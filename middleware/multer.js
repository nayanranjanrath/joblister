import multer from "multer";

const storage = multer.diskStorage({
  
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },

  filename: function (req, file, cb) {
     const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});


export const avatarUpload = multer({
  storage,
 
  fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
}
});
export const upload = multer({ storage: storage }); 