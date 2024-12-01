const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Project } = require("../../db/models");

const router = express.Router();

const validateProject = [
  check("title").exists({ checkFalsy: true }).withMessage("Title Required"),
  check("description")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 3, max: 250 })
    .withMessage("Description must be between 3 and 250 characters"),
  handleValidationErrors,
];

// Get all user projects
router.get("/", requireAuth, async (req, res, next) => {
  const uid = req.user.id;

  try {
    const projects = await Project.findAll({
      where: {
        ownerId: uid,
      },
    });

    return res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get a project by id
router.get("/:projectId", requireAuth, async (req, res, next) => {
  const uid = req.user.id;
  const projectId = req.params.projectId;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        error: "Project couldn't be found",
      });
    }

    if (project.ownerId !== uid) {
      return res.status(403).json({
        error: "YOur not authorized to view this project",
      });
    }

    return res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create a project
router.post("/", requireAuth, validateProject, async (req, res, next) => {
  const uid = req.user.id;
  const { title, description } = req.body;
  try {
    const project = await Project.create({
      ownerId: uid,
      title,
      description,
    });

    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// Update a project
router.put(
  "/:projectId",
  requireAuth,
  validateProject,
  async (req, res, next) => {
    const uid = req.user.id;
    const projectId = req.params.projectId;
    const { title, description } = req.body;

    try {
      const project = await Project.findByPk(projectId);

      if (!project) {
        return res.status(404).json({
          error: "Project couldn't be found",
        });
      }

      if (project.ownerId !== uid) {
        return res.status(403).json({
          error: "You are not authorized to view this project",
        });
      }

      project.title = title;
      project.description = description;

      await project.save();

      return res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
