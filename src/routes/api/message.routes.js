import MessageController from "../../controllers/message.controller.js";
import routeType from "../../middleware/routeType.js";
import isAuthenticated from "../../middleware/authentication.js";
import express from "express";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(routeType("api"), isAuthenticated(), MessageController.createMessage);

export default router;
