require("dotenv").config();
const tbl = require("../models");
const Model = tbl.users;
const nodemailer = require("nodemailer");
const helpers = require("../helpers/commonHelpers.js");
const htmlEmailRegister = require("../helpers/htmlEmailRegister.js");
const mailUsername = process.env.MAIL_USERNAME;
const mailPassword = process.env.MAIL_PASSWORD;
const accessTokenSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    let { name, hp, email, role_id } = req.body;

    const dataUser = {
      name,
      hp,
      email,
      role_id,
    };

    const foundEmailUser = await Model.findOne({ where: { email } });

    if (foundEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    // Check nodemailer is working or not
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Mail Server Error",
        });
      }
    });

    await Model.create(dataUser).then(async (data) => {
      let hashedId = helpers.encryptUserId(data.id);
      await Model.update({ hashed_id: hashedId }, { where: { id: data.id } });

      const mailData = {
        from: '"Narantraya" <yazidakbar08@gmail.com>',
        to: data.email,
        subject: "Akun Berhasil di Daftarkan",
        html: htmlEmailRegister({ hashedId }),
        attachments: [
          {
            path: "assets/images/gb.png",
            cid: "gb",
          },
          {
            path: "assets/images/gk.png",
            cid: "gk",
          },
          {
            path: "assets/images/amplop.png",
            cid: "amplop",
          },
        ],
      };

      // Send Email
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          return console.log({ err });
        }
        res.status(200).send({ message: "Mail Terkirim" });
      });

      return res.status(200).json({
        success: true,
        message: "Berhasil Register",
        data,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    password = helpers.encryptPassword(password);

    const dataUser = await Model.findOne({ where: { email } });

    if (!dataUser) {
      return res.status(400).json({
        success: false,
        message: "Email tidak terdaftar!",
      });
    }

    if (dataUser.is_add_password === false) {
      return res.status(400).json({
        success: false,
        message: "Anda belum mengatur password!",
      });
    }

    const checkPassword = password === dataUser.password;

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Pastikan Email dan Password Anda Benar",
      });
    }

    const token = jwt.sign(
      {
        id: dataUser.id,
        name: dataUser.name,
        hp: dataUser.hp,
        email: dataUser.email,
        role_id: dataUser.role_id,
      },
      accessTokenSecret
    );

    return res.status(200).json({
      success: true,
      message: "Berhasil Login",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      error,
    });
  }
};

exports.settingPassword = async (req, res) => {
  try {
    let { hashedUserId, password } = req.body;

    const dataUser = {
      password: helpers.encryptPassword(password),
      is_add_password: true,
    };

    await Model.update(dataUser, { where: { hashed_id: hashedUserId } }).then(
      (data) => {
        return res.status(200).json({
          success: true,
          message: "Berhasil Update Password",
          data,
        });
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      error,
    });
  }
};
