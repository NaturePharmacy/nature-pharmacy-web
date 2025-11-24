'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = 'nature-pharmacy/products',
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (index: number) => {
    if (disabled) return;

    const imageUrl = value[index];

    // Extract public ID from Cloudinary URL
    const publicId = extractPublicId(imageUrl);

    // Delete from Cloudinary
    if (publicId) {
      try {
        await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Remove from state
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const extractPublicId = (url: string): string | null => {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
      return matches ? matches[1] : null;
    } catch (error) {
      return null;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={disabled || uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 mb-2">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                JPEG, PNG, WebP (max 5MB each) - {value.length}/{maxImages} images
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
