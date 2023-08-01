const checkToken = require("../helpers/checkToken");

module.exports = (app) => {
  const Controller = require("../controllers/userController.js");
  const router = require("express").Router();

  router.get("/", Controller.getAll);

  app.use("/api/user", router);
};
