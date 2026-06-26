const multer = require("multer"); //used to upload files/images
const path = require("path"); //helps work with file paths and extensions
const fs = require("fs"); //File System module, used to create/check folders and files

//Creates a upload folder automatically if it doesnt exists.
//So uploaded images will be stored inside:
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  //mkdir: make directory. Sync: run immediately/synchronously
  //recursive: true means: Even if parent folders are missing, create everything safely.
  fs.mkdirSync(uploadDir, { recursive: true });
}

//storage = multer.diskStorage: This tells multer HOW and WHERE to save uploaded files.
//diskStorage() means: save files inside your computer/server disk.
const storage = multer.diskStorage({
  //req contains body data, user data, token data.File: Contains uploaded file information.
  //cb : means callback function. Multer waits for this callback result.
  destination: function (req, file, cb) {
    //null: no error. uploadDir: save inside uploads folder
    cb(null, uploadDir);
  },

  //this is for filename, the filename should be fieldname-date.png(originalname)
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  //test the file type is correct by checking extension from orgnl file name ex:png
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype); //MIME : Multipurpose Internet Mail Extensions

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("coverImage");

module.exports = upload;
