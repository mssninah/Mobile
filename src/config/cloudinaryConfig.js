// cloudinaryConfig.js

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'djalkrrwa', // Replace with your Cloudinary Cloud Name
  api_key: '872381868261428', // Replace with your API Key
  api_secret: 'lHZkrtbzDCzBmeP72g7k3GOqXvQ', // Replace with your API Secret
});

export default cloudinary;
