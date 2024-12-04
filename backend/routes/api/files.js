const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../../config");
const { requireAuth } = require("../../utils/auth");
const { Project, File } = require("../../db/models");

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
router.get("/", requireAuth, async (req, res, next) => {
  const user = req.user;
  const projectId = req.params.projectId;
  try {
    const params = {
      Bucket: s3.bucket,
      Prefix: `${user.email}/${projectId}/`
    };
    const command = new ListObjectsV2Command(params);

    const response = await s3Client.send(command);
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
router.post("/", upload.array("file"), async (req, res, next) => {
  const { id: userId, email } = req.user;
  const projectId = req.params.projectId;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // const prefix = `${req.user.email}/${projectId}/`;

  try {
    // Find project or return error
    const project = await Project.findByPk(projectId);
    if (!projectId || !project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const allFilesDetails = files.map((file) => {
      return {
        name: file.originalname,
        size: file.size,
        url: file.location,
        type: file.mimetype,
        userId: userId,
        projectId: Number(projectId)
      };
    });

    // Get file size from AWS and update database with it

    for (let i = 0; i < allFilesDetails.length; i++) {
      const file = allFilesDetails[i];
      const command = new HeadObjectCommand({
        Bucket: s3.bucket,
        Key: `${email}/${projectId}/${file.name}`
      });

      const response = await s3Client.send(command);
      file.size = response.ContentLength;
    }

    const newFiles = await File.bulkCreate(allFilesDetails);

    res.send(newFiles);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
