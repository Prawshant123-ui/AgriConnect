const cloudinary = require("../config/cloudinary");

const uploadImageBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "agrishield/scans" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = { uploadImageBuffer };