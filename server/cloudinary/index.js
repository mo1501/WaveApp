import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv/config";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});




const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'WaveApp',
  params: {
    folder: 'WaveApp',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

// const uploadImageToCloudinary = async (path) => {
//   try {
//     const result = await cloudinary.uploader.upload(path);
//   return result.secure_url;
//   } catch (error) {
//     console.log("Error from upload-data-function", error);
//   }
  
// };

export {
  cloudinary,
  storage,
  
};
