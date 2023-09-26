const multer = require('multer');
const path = require('path');





const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG images are allowed.'));
    }
};

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    //only support jpeg and png

    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },


});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});


module.exports = upload;