const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../../config");
const { v4: uuid } = require("uuid");

const s3Client = new S3Client({
  region: s3.region,
  credentials: {
    accessKeyId: s3.accessKeyId,
    secretAccessKey: s3.secretAccessKey
  }
});

const getS3FolderKey = (req, file, cb) => {
  const projectId = req.params.projectId;
  const user = req.user;
  const fileName = `${file.originalname}`;
  const key = `${user.email}/${projectId}/${fileName}`;
  cb(null, key);
};

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: s3.bucket,
    acl: "private",
    key: getS3FolderKey
  }),
  limits: {
    fileSize: 250 * 1024 * 1024 // 250MB
  }
});

// Get all files
router.get("/", async (req, res, next) => {
  try {
    const params = {
      Bucket: s3.bucket,
      Prefix: "test-folder/"
    };
    const command = new ListObjectsV2Command(params);

    const response = await s3Client.send(command);
    console.log(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// Get a specific file
router.get("/:name", async (req, res, next) => {
  try {
    const params = {
      Bucket: s3.bucket,
      Key: `test-folder/${req.params.name}`
    };

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600
    });

    res.send(`<audio controls src="${url}"></audio>`);
  } catch (error) {
    next(error);
  }
});

// Upload files
router.post(
  "/",
  upload.fields([{ name: "file" }, { name: "projectId" }]),
  async (req, res, next) => {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    /**
     * Grab the files from the request
     * Set up a Promise.all() to upload all files to S3
     * Add to database
     * If any of the files fail, delete the ones that have been uploaded from S3
     */
    const files = req.files || [];

    try {
      return res
        .status(201)
        .json({ message: "Files uploaded successfully", files });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
