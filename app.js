require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
app.use(
  multer({
    allowedFile: function (req, file, cb) {
      if (
        !file.originalname.match(
          /\.(pdf|csv|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
        )
      ) {
        req.fileValidationError = "Only  files are allowed!";
        return cb(new Error("Only  files are allowed!"), false);
      }
      cb(null, true);
    },
    storage: multer.diskStorage({
      destination: "./uploads",
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  })
    // .single("img"))       // for upload 1 img
    .array("img", 12)
); // for upload more than 1 img

// mengizinkan atau membatasi akses dari domain berbeda
// let corsOptions = {
//   origin: "http://localhost:8081",
//   optionsSuccessStatus: 200,
// };
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Simple route
app.get("/", (req, res) => {
  res.json({});
});

// Call Routes
require("./routes/roles")(app);
require("./routes/auth")(app);
require("./routes/user")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
