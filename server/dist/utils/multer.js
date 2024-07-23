import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";
const configureMulter = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    //configuring mutler storage object
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // null (no error)
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    //creating a multer instance based on storage config
    const upload = multer({ storage: storage });
    return upload;
};
export default configureMulter;
