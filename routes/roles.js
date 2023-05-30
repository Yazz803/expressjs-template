const checkToken = require("../helpers/checkToken");

module.exports = (app) => {
  const Controller = require("../controllers/rolesController.js");
  const router = require("express").Router();

  router.get("/", checkToken, Controller.getAll);
  router.get("/get", checkToken, Controller.getOne);
  router.post("/store", checkToken, Controller.store);
  router.post("/update", checkToken, Controller.update);
  router.delete("/destroy", checkToken, Controller.destroy);

  app.use("/api/roles", router);
};
