const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')
const mime = require('mime-types')

dotenv.config()

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY
  }
})

const PROJECT_ID = process.env.PROJECT_ID

async function init() {
  console.log("Executing script.js");
  const outDirectoryPath = path.join(__dirname, "output");

  const process = exec(
    `cd ${outDirectoryPath} && npm install && npm run build`
  );

  process.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  process.stdout.on("error", function (data) {
    console.log("Error: ", data.toString());
  });

  process.on("close", async function () {
    console.log("Build Complete");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file)
      if (fs.lstatSync(filePath).isDirectory()) {
        continue
      }

      console.log("Uploading file path: ", filePath);

      const command = new PutObjectCommand({
        Bucket: 'vercel-clone-outputs-abhishek',
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath)
      })

      await s3Client.send(command)
      console.log("Uploaded: ", filePath);

    }
    console.log("Done...");

  });
}

init()
