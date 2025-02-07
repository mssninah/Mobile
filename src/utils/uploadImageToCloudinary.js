export const uploadImageToCloudinary = async (imageUri) => {
  const data = new FormData();
  
  // Append image
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg', // Adjust based on your file type
    name: 'profile_picture.jpg',
  });

  // Cloudinary required parameters
  data.append('upload_preset', 'ml_default');
  data.append('cloud_name', 'djalkrrwa'); // Replace with your Cloudinary Cloud Name

  try {
    let response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    let responseData = await response.json();
    return responseData.secure_url; // Returns Cloudinary image URL
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
