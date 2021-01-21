const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + req.user.id + '/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.id + '-'+Date.now()+ path.extname(file.originalname));
    }
});



const upload = multer({
    storage: storage,
    limits: {

    },
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('imgUpload');



function checkFileType(file, callback) {
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);


    if (mimetype && extname) {
        return callback(null, true);
    }

    else {
        callback({
            message: 'Images Only'
        });
    }
}


module.exports = upload;
