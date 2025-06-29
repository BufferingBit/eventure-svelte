import { env } from '$env/dynamic/private';
import { Readable } from 'stream';
import cloudinary from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';


const CLOUD = env.CLOUDINARY_CLOUD_NAME;
const API_KEY = env.CLOUDINARY_API_KEY;
const API_SECRET = env.CLOUDINARY_API_SECRET;

cloudinary.v2.config({
  cloud_name: CLOUD,
  api_key: API_KEY,
  api_secret: API_SECRET
});

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// Helper function to decide resource_type based on file mime/type
interface FileWithType {
  type: string;
}

function getResourceType(file: FileWithType): 'image' | 'video' | 'raw' {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'video'; // audio uploads are 'video' type in Cloudinary
  return 'raw'; // everything else (pdf, doc, zip etc)
}

export const actions = {
  photoUpload: async ({ request }) => {
    try {
      const formData = await request.formData();
      const file = formData.get('user_photo');

      if (!file || typeof file === 'string') {
        return { error: 'Invalid file upload' };
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const stream = bufferToStream(buffer);

      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: 'svelte-uploads', resource_type: getResourceType(file) },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Upload failed: No result returned'));
          }
        );
        stream.pipe(uploadStream);
      });


      return {
        success: true,
        url: uploadResult.secure_url
      };

    } catch (err) {
      console.error('Upload failed:', err);
      return {
        error: 'Failed to upload image. Please try again.'
      };
    }
  }
};
