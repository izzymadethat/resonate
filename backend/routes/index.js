const express = require("express");
const router = express.Router();
const apiRouter = require("./api");
const { ValidationError } = require("sequelize");

router.use("/api", apiRouter);

// Catch unhandled requests and forward to error handler.
router.use((_req, _res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.title = "Resource Not Found";
	err.errors = { message: "The requested resource couldn't be found." };
	err.status = 404;
	next(err);
});

router.use((err, _req, _res, next) => {
	// check if error is a Sequelize error:
	if (err instanceof ValidationError) {
		let errors = {};
		for (let error of err.errors) {
			errors[error.path] = error.message;
		}
		err.title = "Validation error";
		err.errors = errors;
	}
	next(err);
});

router.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);
	res.json({
		title: err.title || "Server Error",
		message: err.message,
		errors: err.errors,
		stack: isProduction ? null : err.stack,
	});
});

module.exports = router;
