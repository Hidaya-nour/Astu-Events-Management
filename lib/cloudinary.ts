import { v2 as cloudinary } from 'cloudinary'

// Log configuration (without sensitive data)
console.log('Cloudinary Config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing'
})

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary configuration. Please check your environment variables.')
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const uploadImage = async (file: string): Promise<string> => {
  try {
    console.log('Attempting to upload to Cloudinary...')
    
    // Use upload_stream for better reliability
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'astu_events',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error(`Cloudinary upload failed: ${error.message}`))
          } else if (result) {
            console.log('Upload successful:', result.secure_url)
            resolve(result.secure_url)
          } else {
            reject(new Error('No result from Cloudinary upload'))
          }
        }
      )

      // Convert base64 to buffer and pipe to upload stream
      const buffer = Buffer.from(file.split(',')[1], 'base64')
      const stream = require('stream')
      const bufferStream = new stream.PassThrough()
      bufferStream.end(buffer)
      bufferStream.pipe(uploadStream)
    })
  } catch (error) {
    console.error('Detailed Cloudinary error:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const uploadMultipleImages = async (files: string[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file))
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error)
    throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 