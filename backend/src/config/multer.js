const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req,res,cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    //rinomino il file mettendo la data attuale + numero casuale + estensione originale
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb (null, uniqueSuffix + path.extname(file.originalname));
  }
});

//vengono accettate solo immagini jpeg, jpg,png, webp
const fileFilter = (req,file,cb) => {
if (file.mimetype.startsWith('image/')) {
cb(null,true);
} else {
    cb(new Error('Il file deve essere un\'immagine!'), false);
  }
};

//middleware pronto all'uso
const upload = multer({
  storage:storage,
  fileFilter:fileFilter,
  limits: {fileSize: 5 * 1024 * 1024} //limite massimo 5mb per evitare attacchi di DoS
});

module.exports = upload;
