import multer from 'multer';
import { storage } from '../config/cloudinary';

const upload = multer({ storage: storage });

export default upload;