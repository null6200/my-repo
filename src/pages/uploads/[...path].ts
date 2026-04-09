import type { APIRoute } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const path = params.path || '';
    const filePath = join('/app/public/uploads', path);

    if (!existsSync(filePath)) {
      return new Response('File not found', { status: 404 });
    }

    const file = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    
    const contentType = contentTypes[ext || ''] || 'application/octet-stream';

    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
