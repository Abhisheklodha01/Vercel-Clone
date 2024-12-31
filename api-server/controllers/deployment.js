const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@clickhouse/client");
const { Kafka } = require("kafkajs");
const { v4: uuidV4 } = require("uuid");
const fs = require("fs");
const path = require("path");

dotenv.config();

const prisma = new PrismaClient({});

const client = new createClient({
  host:
    process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const config = {
  CLUSTER: process.env.CLUSTER_ARN,
  TASK: process.env.BUILDER_TASK_ARN,
};

const kafka = new Kafka({
  clientId: `api-server`,
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
});

const consumer = kafka.consumer({ groupId: "api-server-logs-consumer" });

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

io.listen(9001, () => {
  console.log("Socket serveris running on 9001");
});

const createDeployment = async (req, res) => {
  const { projectId, slug } = req.body;
  const projectSlug = slug ? slug : generateSlug();

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  // check for running deployement

  const deployement = await prisma.deployment.create({
    data: {
      project: { connect: { id: projectId } },
      status: "QUEUED",
    },
  });

  // spin the container
  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-07a58c57af8b2ebe0",
          "subnet-0b24ede9cbca2dc5a",
          "subnet-0e0166b9a88b979f7",
        ],
        securityGroups: ["sg-0a56fe87620cecfc9"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "SEREVER-BUILDER-IMAGE",
          environment: [
            { name: "GIT_REPOSITORY_URL", value: project.gitUrl },
            { name: "PROJECT_ID", value: projectId },
            { name: "DEPLOYMENT_ID", value: deployement.id },
          ],
        },
      ],
    },
  });
  await ecsClient.send(command);
  return res.json({
    status: "queued",
    data: {
      projectId,
      status: "QUEUED",
      deploymentId: deployement.id,
      url: `http://${projectId}.localhost:8000` 
    },
  });
};

async function kafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ["container-logs"] });

  await consumer.run({
    autoCommit: false,
    eachBatch: async function ({
      batch,
      heartbeat,
      commitOffsetsIfNecessary,
      resolveOffset,
    }) {
      const messages = batch.messages;
      console.log(`Recieved ${messages.length} messages..`);

      for (const message of messages) {
        const stringMessage = message.value.toString();
        const { PROJECT_ID, DEPLOYMENT_ID, log } = JSON.parse(stringMessage);
        try {
          const { query_id } = await client.insert({
            table: "log_events",
            values: [
              {
                event_id: uuidV4(),
                deployment_id: DEPLOYMENT_ID,
                log: log,
              },
            ],
            format: "JSONEachRow",
          });
          console.log("Query id: ", query_id);
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          await heartbeat();
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
}
kafkaConsumer();

const getDeployementLogs = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const logs = await client.query({
      query: `SELECT event_id, deployment_id, log, timestamp from log_events where deployment_id = {deployment_id:String}`,
      query_params: {
        deployment_id: id,
      },
      format: "JSONEachRow",
    });
    const rawLogs = await logs.json();
    return res.status(200).json({
      logs: rawLogs,
      message: "Logs fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching logs",
      error,
    });
  }
};

module.exports = { createDeployment, getDeployementLogs };
