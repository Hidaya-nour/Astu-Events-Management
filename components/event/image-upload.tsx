import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxFiles?: number
}

export function ImageUpload({ onImagesChange, maxFiles = 5 }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + uploadedImages.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`)
      return
    }

    setIsUploading(true)
    const newImageUrls: string[] = []

    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        newImageUrls.push(data.url)
      }

      const updatedImages = [...uploadedImages, ...newImageUrls]
      setUploadedImages(updatedImages)
      onImagesChange(updatedImages)
      toast.success('Images uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload images')
      console.error('Error uploading images:', error)
    } finally {
      setIsUploading(false)
    }
  }, [uploadedImages, maxFiles, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <div>
            <p>Drag and drop images here, or click to select files</p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PNG, JPG, JPEG, GIF (max 5MB each)
            </p>
          </div>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 