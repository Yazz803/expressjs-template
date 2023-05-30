"use strict";

require("dotenv").config();
const accessTokenSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const tbl = require("../models");
const User = tbl.users;

module.exports = async (req, res, next) => {
  const token = req.get("api-token") || req.query["api-token"];
  let key = req.query["key"];

  try {
    if (!token) throw "Required Token";

    let user = {};
    let jwtData = jwt.verify(token, accessTokenSecret);
    if (!jwtData) throw "Invalid Token";
    user = await User.findOne({
      where: {
        email: jwtData.email,
      },
      attributes: [
        "id",
        "name",
        "email",
        "hp",
        "role_id",
        "hashed_id",
        "is_add_password",
      ],
      include: [
        {
          model: tbl.roles,
        },
      ],
    });

    req.user = user;
  } catch (error) {
    let errMsg = error.message || error;
    let httpCode = error.httpCode || 401;

    return res.status(httpCode).json({
      success: false,
      message: errMsg,
    });
  }

  return next();
};
