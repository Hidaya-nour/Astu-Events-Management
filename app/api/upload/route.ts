import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// Validate Cloudinary configuration
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary configuration. Please check your environment variables.')
  throw new Error('Cloudinary configuration is missing')
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export async function POST(request: Request) {
  try {
    // Validate Cloudinary configuration at runtime
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary configuration is missing. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64
    const base64Image = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Image}`

    // Upload to Cloudinary with better error handling
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, {
        folder: 'astu-events',
        resource_type: 'auto',
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(new Error(error.message || 'Failed to upload to Cloudinary'))
        } else {
          resolve(result)
        }
      })
    })

    if (!result || !(result as any).secure_url) {
      throw new Error('Failed to get secure URL from Cloudinary')
    }

    // Return the secure URL of the uploaded file
    return NextResponse.json({
      url: (result as any).secure_url
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
} 