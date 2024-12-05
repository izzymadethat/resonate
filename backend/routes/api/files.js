const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectsCommand
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../../config");
const { requireAuth } = require("../../utils/auth");
const { Project, File, User } = require("../../db/models");
const { where } = require("sequelize");

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
  const projectId = req.params.projectId;
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        error: "Project couldn't be found"
      });
    }

    const files = await File.findAll({
      where: {
        projectId
      }
    });

    res.send(files);
  } catch (error) {
    next(error);
  }
});

// Get a specific file to stream
// Route: /api/projects/:projectId/files/:name/stream
router.get("/:name/stream", async (req, res, next) => {
  const { projectId, name } = req.params;

  try {
    // find project to return userId
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          attributes: ["email"]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        error: "Project couldn't be found"
      });
    }

    const file = await File.findOne({
      where: {
        name
      }
    });

    if (!file) {
      return res.status(404).json({
        error: "File couldn't be found"
      });
    }

    const params = {
      Bucket: s3.bucket,
      Key: `${project.User.email}/${projectId}/${req.params.name}`,
      Expires: 3600
    };

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600
    });

    res.json({ file, streamUrl: url });
  } catch (error) {
    next(error);
  }
});

// TODO: Get a file download link (will involve payments)

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
        projectId: Number(projectId),
        s3Key: file.key
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

// Delete a set of files (minimum of 1)
router.delete("/", async (req, res, next) => {
  const projectId = req.params.projectId;
  const { fileIds } = req.body;
  try {
    if (!fileIds || fileIds.length === 0) {
      return res
        .status(400)
        .json({ error: "No files specified for deletion." });
    }

    // find project to return userId
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        error: "Project couldn't be found"
      });
    }

    // get files from database
    const files = await File.findAll({ where: { id: fileIds } });
    if (files.length === 0) {
      return res.status(404).json({ message: "Files not found" });
    }

    // prepare s3 delete command
    const objectsToDelete = files.map((file) => ({ Key: file.s3Key }));

    const deleteParams = {
      Bucket: s3.bucket,
      Delete: { Objects: objectsToDelete, Quiet: false }
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);

    // delete files from s3
    await s3Client.send(deleteCommand);

    // delete files from database
    await File.destroy({ where: { id: fileIds } });

    res.status(200).json({ message: "Files deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
