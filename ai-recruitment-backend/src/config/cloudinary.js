import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

// Configure Cloudinary only if credentials exist
if (isCloudinaryConfigured()) {
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary not configured - using local file storage');
}

// Local storage directory
const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../uploads/storage');

// Ensure local uploads directory exists
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

// Upload file to Cloudinary OR local storage
export const uploadToCloudinary = async (file, folder = 'cvs') => {
  // If Cloudinary is not configured, use local storage
  if (!isCloudinaryConfigured()) {
    try {
      const folderPath = path.join(LOCAL_UPLOADS_DIR, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const destPath = path.join(folderPath, uniqueName);
      
      // Copy file to storage directory
      fs.copyFileSync(file.path, destPath);
      
      // Generate local URL (accessible via static serving)
      const localUrl = `http://localhost:${process.env.PORT || 5000}/uploads/storage/${folder}/${uniqueName}`;

      console.log(`📁 File stored locally: ${destPath}`);
      
      return {
        url: localUrl,
        publicId: `local/${folder}/${uniqueName}`,
        format: path.extname(file.originalname).slice(1),
        size: file.size
      };
    } catch (error) {
      console.error('Local storage error:', error);
      throw new Error('Failed to store file locally');
    }
  }
  
  // Use Cloudinary if configured
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `ai-recruitment/${folder}`,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export default cloudinary;

