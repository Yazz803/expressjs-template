const tbl = require("../models");
const Model = tbl.users;

exports.getAll = async (req, res) => {
  try {
    let data = await Model.findAll();
    if (data) {
      return res.json({
        success: true,
        message: "Berhasil mengambil semua data users",
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      error,
    });
  }
};
