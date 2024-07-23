import multer, {StorageEngine} from 'multer';
import { Request } from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from "fs";

const configureMulter = () : multer.Multer => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    //configuring mutler storage object
    const storage: StorageEngine = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
            // null (no error)
            cb(null, uploadDir);
        },
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
            cb(null, file.originalname);
        }
    });
    
    //creating a multer instance based on storage config
    const upload :  multer.Multer  = multer({ storage : storage });

    return upload;
};

export default configureMulter;
