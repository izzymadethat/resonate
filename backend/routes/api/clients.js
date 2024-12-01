const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Client, Project } = require("../../db/models");

// /api/projects/:projectId/clients
// For now, a client can only be created with a project
const router = express.Router();

const validateClient = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name of client required"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Client email is required"),
  check("avatar")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Photo url is required"),
  check("projectId")
    .exists({ checkFalsy: true })
    .withMessage("Project id is required")
    .toInt(),
  handleValidationErrors
];

// TODO: Get All User Clients route standalone
// Get Project Clients (handled in /api/projects/:projectId)
// Create a client
router.post("/", requireAuth, validateClient, async (req, res, next) => {
  const uid = req.user.id;
  const { name, email, avatar, projectId } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.ownerId !== uid)
      return res.status(403).json({
        error: "You're not authorized to add a client to this project"
      });

    const client = await Client.create({
      projectId,
      name,
      email,
      avatar: avatar ?? null
    });

    return res.status(201).json(client);
  } catch (error) {
    next(error);
  }
});

// Update a client
router.put(
  "/:clientId",
  requireAuth,
  validateClient,
  async (req, res, next) => {
    const { projectId, clientId } = req.params;
    const { name, email, avatar } = req.body;
    const uid = req.user.id;

    try {
      const client = await Client.findByPk(clientId, {
        include: [{ model: Project, where: { id: projectId } }]
      });

      if (!client || client.Project.ownerId !== uid) {
        return res.status(404).json({ error: "Client not found" });
      }

      client.name = name;
      client.email = email;
      client.avatar = avatar ?? null;

      await client.save();

      return res.json(client);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a client
router.delete(
  "/:clientId",
  requireAuth,
  validateClient,
  async (req, res, next) => {
    const { projectId, clientId } = req.params;
    const uid = req.user.id;

    try {
      const client = await Client.findByPk(clientId, {
        include: [{ model: Project, where: { id: projectId } }]
      });

      if (!client || client.Project.ownerId !== uid) {
        return res.status(404).json({ error: "Client not found" });
      }

      await client.destroy();

      return res.status(204).json({ message: "Client deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
