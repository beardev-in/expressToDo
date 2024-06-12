import multer from 'multer';

const configureMulter = () => {
    //configuring mutler storage object
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            //null (no error)
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    
    //creating a multer instance based on storage config
    const upload = multer({ storage : storage });

    return upload;
};

export default configureMulter;
