import ExpressBrute from "express-brute";
import { MongoClient } from 'mongodb'

import MongoStore from 'express-brute-mongo';

import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "swagger-jsdoc";
import multer from "multer";

import UserController from "./app/controllers/UserController";
import AvatarController from "./app/controllers/AvatarController";
import SessionController from "./app/controllers/SessionController";
import PasswordController from "./app/controllers/PasswordController";
import ProjectController from "./app/controllers/ProjectController";
import TaskController from "./app/controllers/TaskController";
import UserMailController from "./app/controllers/UserMailController";

import validateUserStore from "./app/middlewares/validators/UserStore";
import validateUserUpdate from "./app/middlewares/validators/UserUpdate";
import validatePasswordStore from "./app/middlewares/validators/PasswordStore";
import validatePasswordUpdate from "./app/middlewares/validators/PasswordUpdate";
import validateSessionStore from "./app/middlewares/validators/SessionStore";
import validateProjectStore from "./app/middlewares/validators/ProjectStore";
import validateProjectUpdate from "./app/middlewares/validators/ProjectUpdate";
import validateProjectIndex from "./app/middlewares/validators/ProjectIndex";

import app from "./app";
import multerConfig from "./app/config/multer";
import swaggerOptions from "./documentation/docSwagger";
import retries from "./app/config/brute";
import errorMiddleware from "./app/middlewares/error";

const store = new MongoStore(function (ready) {
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db: any) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
  });
});

const bruteforce = new ExpressBrute(store, { freeRetries: retries });

const specs = swaggerDocs(swaggerOptions);

app.use("/docs", swaggerUi.serve);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get(
  "/docs",
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none !important }",
    customSiteTitle: "TodoList | Documentation",
  })
);

app.post(
  "/register",
  multer(multerConfig).single("file"),
  validateUserStore,
  UserController.store
);

app.post(
  "/login",
  bruteforce.prevent,
  validateSessionStore,
  SessionController.store
);

app.delete(
  "/user-management/delete-photo",
  passport.authenticate("jwt", { session: false }),
  AvatarController.delete
);

app.get("/verify-email/:verifyToken", UserMailController.verifyEmail);
app.post("/verify-email/re-send", UserMailController.sendVerificationMail);

app.post("/forgot-password", validatePasswordStore, PasswordController.store);
app.put(
  "/reset-password/:resetToken",
  validatePasswordUpdate,
  PasswordController.update
);

app.put(
  "/user-management/edit-account",
  passport.authenticate("jwt", { session: false }),
  multer(multerConfig).single("file"),
  validateUserUpdate,
  UserController.update
);

app.delete(
  "/user-management/delete-account",
  passport.authenticate("jwt", { session: false }),
  validateUserUpdate,
  UserController.delete
);

app.post(
  "/my-projects/create-project",
  validateProjectStore,
  passport.authenticate("jwt", { session: false }),
  ProjectController.store
);

app.get(
  "/my-projects/all-projects",
  passport.authenticate("jwt", { session: false }),
  validateProjectIndex,
  ProjectController.index
);

app.get(
  "/my-projects/:projectId/tasks",
  passport.authenticate("jwt", { session: false }),
  ProjectController.show
);
app.put(
  "/my-projects/:projectId/edit",
  validateProjectUpdate,
  passport.authenticate("jwt", { session: false }),
  ProjectController.update
);
app.delete(
  "/my-projects/:projectId/delete",
  passport.authenticate("jwt", { session: false }),
  ProjectController.delete
);

app.put(
  "/task/:taskId/edit",
  passport.authenticate("jwt", { session: false }),
  TaskController.update
);

app.delete(
  "/task/:taskId/delete",
  passport.authenticate("jwt", { session: false }),
  TaskController.delete
);

app.use(errorMiddleware);

export default app;
