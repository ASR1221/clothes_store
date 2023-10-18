const multer = require("multer");

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "./public/images/items");
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   }
});

function fileFilter(req, file, cb) {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
}

module.exports = multer({
   storage,
   fileFilter,
   limits: { fileSize: 3_000_000 }, // 3 MB
})
   .fields([
      { name: "images", maxCount: 3 },
      { name: "json", maxCount: 1},
   ]);