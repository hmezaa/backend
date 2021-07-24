const express = require("express");
const router = express.Router();
const multer = require("multer");


//  Multer Configuration Starts Here
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, +Date.now() + "." + ext);
    }
});
//  Multer Configuration Finishes Here



//   Add a  image
router.post(
    "/saveimage",
    multer({
        storage: storage
    }).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const reqData = req.body;
        console.log(reqData);
        const imagePath = req.file.filename;

        res.json(imagePath);

    });






module.exports = router;