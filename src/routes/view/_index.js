import UserController from "../../controllers/user.controller.js";
import ServerController from "../../controllers/server.controller.js";
import ChannelController from "../../controllers/channel.controller.js";
import routeType from "../../middleware/routeType.js";
import isAuthenticated from "../../middleware/authentication.js";
import express from "express";
import PrivateMessageController from "../../controllers/privateMessage.controller.js";

const router = express.Router({ mergeParams: true });

// Landing Page
router.route("/").get(routeType("view"), async (_req, res) => {
  return res.render("landing", {
    stylesheets: [`<link rel="stylesheet" href="/public/css/landing.css" />`],
    scripts: [`<script src="/public/js/landing.js"></script>`]
  });
});

// Signup Page
router.route("/signup").get(routeType("view"), async (_req, res) => {
  return res.render("signup", {
    stylesheets: [`<link rel="stylesheet" href="/public/css/signup.css" />`],
    scripts: [`<script src="/public/js/signup.js"></script>`]
  });
});

// Login Page
router.route("/login").get(routeType("view"), async (req, res) => {
  if (req.session.user) {
    return res.redirect(`/user/${req.session.user.id}`);
  }
  return res.render("login", {
    stylesheets: [`<link rel="stylesheet" href="/public/css/login.css" />`],
    scripts: [`<script src="/public/js/login.js"></script>`]
  });
});

// User Pages
router
  .route("/user/:userId")
  .get(routeType("view"), UserController.renderUserMainPage);
router
  .route("/user/edit/:userId")
  .get(routeType("view"), isAuthenticated(), UserController.renderUserEditPage);
router
  .route("/user/servers/:userId")
  .get(
    routeType("view"),
    isAuthenticated(),
    UserController.renderUserServersPage
  );
router
  .route("/user/friends/:userId")
  .get(
    routeType("view"),
    isAuthenticated(),
    UserController.renderUserFriendsPage
  );

// Server Pages
router
  .route("/server/:serverId")
  .get(routeType("view"), ServerController.renderServerMainPage);
router
  .route("/server/:serverId/edit")
  .get(
    routeType("view"),
    isAuthenticated(),
    ServerController.renderServerEditPage
  );
router
  .route("/server/:serverId/edit/user/:userId")
  .get(
    routeType("view"),
    isAuthenticated(),
    ServerController.renderServerEditUserPage
  );
router
  .route("/server/:serverId/edit/channel/:channelId")
  .get(
    routeType("view"),
    isAuthenticated(),
    ServerController.renderServerEditChannelPage
  );

// Channel Page
router
  .route("/server/:serverId/channel/:channelId")
  .get(
    routeType("view"),
    isAuthenticated(),
    ChannelController.renderChannelMainPage
  );

// Private Message Page
router
  .route("/privateMessage/:privateMessageId")
  .get(
    routeType("view"),
    isAuthenticated(),
    PrivateMessageController.renderPrivateMessageMainPage
  );

export default router;
