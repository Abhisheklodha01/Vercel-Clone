const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const mime = require("mime-types");
const { Kafka } = require("kafkajs");

dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;

const kafka = new Kafka({
  clientId: `docker-build-serevr-${DEPLOYMENT_ID}`,
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

const producer = kafka.producer();

async function publishLog(log) {
  await producer.send({
    topic: "container-logs",
    messages: [
      { key: "log", value: JSON.stringify({ PROJECT_ID, DEPLOYMENT_ID, log }) },
    ],
  });
}

async function init() {
  await producer.connect();
  await publishLog("Build Satrted");
  const outDirectoryPath = path.join(__dirname, "output");

  const process = exec(
    `cd ${outDirectoryPath} && npm install && npm run build`
  );

  process.stdout.on("data", async function (data) {
    await publishLog(data.toString());
  });
  process.stdout.on("error", async function (data) {
    await publishLog(`Error: ${data.toString()}`);
  });

  process.on("close", async function () {
    await publishLog("Build Complete");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });

    await publishLog("Starting to upload");
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        continue;
      }

      await publishLog(`Uploading file: ${file}`);

      const command = new PutObjectCommand({
        Bucket: "vercel-clone-outputs-abhishek",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });

      await s3Client.send(command);
      await publishLog(`Uploaded: ${file}`);
    }
    await publishLog("Done.");
    process.exitCode(0);
  });
}

init();
