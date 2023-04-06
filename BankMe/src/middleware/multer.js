// // import { Request } from "express";
// const multer = require("multer");
// // const path from "path";
// // const fs from "fs";

// function fileFilter(
//   req,
//   file,
//   cb
// ) {
//   switch (req.path) {
//     case "/admin/create":
//     //   if (["image/jpeg", "image/png", "images/jpg"].includes(file.mimetype)) {
//             if (
//               ["image/jpeg", "image/png", "images/jpg"].includes(file.mimetype)
//             ) {
//               cb(null, true);
//             } else {
//               throw new Error("Unsupported file format");
//             }
//       break;
//     default:
//       cb(null, false);
//       break;
//   }
// }


// module.exports.upload = multer({

//   fileFilter,
// //   limits: {
// //     fileSize: 1000000,
// //   },
// });




const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


// const upload = multer()
module.exports = upload;