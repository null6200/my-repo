import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size must be less than 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const imageStorage = process.env.IMAGE_STORAGE || 'cloudinary';

    // LOCAL STORAGE (for development)
    if (imageStorage === 'local') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Save file
      const filepath = join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      
      // Return public URL
      const publicUrl = `/uploads/${filename}`;
      
      return new Response(
        JSON.stringify({ url: publicUrl }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // CLOUDINARY STORAGE (for production)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudinaryCloudName) {
      throw new Error('CLOUDINARY_CLOUD_NAME not configured. Please set up Cloudinary or use IMAGE_STORAGE=local');
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
    
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', base64File);
    
    if (cloudinaryUploadPreset) {
      cloudinaryFormData.append('upload_preset', cloudinaryUploadPreset);
    }
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return new Response(
      JSON.stringify({
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
