import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';

const CLOUD = env.CLOUDINARY_CLOUD_NAME;
const API_KEY = env.CLOUDINARY_API_KEY;
const API_SECRET = env.CLOUDINARY_API_SECRET;

// Debug log to verify env loading
console.log('Cloudinary ENV:', { CLOUD, API_KEY, API_SECRET: API_SECRET ? '***' : 'MISSING' });

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

export const POST = async ({ request }) => {

  console.log('Request headers:', Object.fromEntries(request.headers));
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!(file instanceof File)) {
			return json({ error: 'Invalid file upload' }, { status: 400 });
		}

		if (!file.type.startsWith('image/')) {
			return json({ error: 'Only image files are allowed' }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const stream = bufferToStream(buffer);

		const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.v2.uploader.upload_stream(
				{
					folder: 'college_logos',
					resource_type: 'image'
				},
				(error, result) => {
					if (error) reject(error);
					else if (result) resolve(result);
					else reject(new Error('No result from Cloudinary'));
				}
			);
			stream.pipe(uploadStream);
		});

    console.log('File received:', {
  name: file.name,
  size: file.size,
  type: file.type
});

		return json({ url: uploadResult.secure_url });
	} catch (err) {
		console.error('Cloudinary upload failed:', err);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};

