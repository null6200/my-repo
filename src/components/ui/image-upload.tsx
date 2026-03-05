import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (data.url) {
        setPreview(data.url);
        onChange(data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="font-paragraph text-sm text-foreground block">
          {label}
        </label>
      )}

      <div className="relative">
        {preview ? (
          <div className="relative w-full aspect-square max-w-xs bg-primary/10 border border-secondary/30">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-destructive text-white hover:bg-destructive/90 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square max-w-xs bg-primary/10 border-2 border-dashed border-secondary/30 hover:border-primary cursor-pointer transition-colors flex flex-col items-center justify-center gap-3"
          >
            {isUploading ? (
              <>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-paragraph text-sm text-secondary">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-secondary/40" />
                <div className="text-center">
                  <p className="font-paragraph text-sm text-foreground mb-1">
                    Click to upload image
                  </p>
                  <p className="font-paragraph text-xs text-secondary">
                    All image formats (PNG, JPG, JPEG, GIF, WebP) up to 5MB
                  </p>
                </div>
                <Upload className="w-5 h-5 text-secondary/40" />
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      <p className="font-paragraph text-xs text-secondary">
        Recommended: Square images (1:1 ratio) for best display
      </p>
    </div>
  );
}
