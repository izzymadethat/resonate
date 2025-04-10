const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const projectsRouter = require("./projects.js");
const clientsRouter = require("./clients.js");
const filesRouter = require("./files.js");
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/projects", projectsRouter);
router.use("/clients", clientsRouter);
router.use("/files", filesRouter);

module.exports = router;
