import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadOptions {
  bucket: 'project-photos' | 'company-assets' | 'blog-covers' | 'tender-documents';
  folder?: string;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
}

const BUCKET_CONFIGS = {
  'project-photos': {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    isPublic: true
  },
  'company-assets': {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
    isPublic: true
  },
  'blog-covers': {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    isPublic: true
  },
  'tender-documents': {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/zip',
      'application/x-zip-compressed',
      'image/vnd.dwg',
      'application/acad',
      'application/x-acad',
      'application/autocad_dwg',
      'image/x-dwg'
    ],
    isPublic: false
  }
};

export async function uploadFile(file: File, options: UploadOptions): Promise<{ url: string; path: string; error?: string }> {
  const config = BUCKET_CONFIGS[options.bucket];
  const maxBytes = options.maxSizeBytes || config.maxSizeBytes;
  const allowedTypes = options.allowedMimeTypes || config.allowedMimeTypes;

  // 1. Validate File Size
  if (file.size > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`File exceeds the maximum allowed size of ${maxMb}MB.`);
  }

  // 2. Validate MIME Type (flexible check for dwg/cad)
  const isDwg = file.name.toLowerCase().endsWith('.dwg');
  const isAllowedType = allowedTypes.includes(file.type) || (isDwg && options.bucket === 'tender-documents');

  if (!isAllowedType && allowedTypes.length > 0) {
    throw new Error(`File format (${file.type || 'unknown'}) is not supported for ${options.bucket}.`);
  }

  // If live Supabase is configured, upload directly to bucket
  if (isSupabaseConfigured) {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folderPath = options.folder ? `${options.folder}/` : '';
    const filePath = `${folderPath}${timestamp}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`Storage upload error in ${options.bucket}:`, error);
      throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
    }

    if (config.isPublic) {
      const { data: publicUrlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);
      return { url: publicUrlData.publicUrl, path: data.path };
    } else {
      // Private bucket: generate a signed URL or return path reference
      const { data: signedUrlData, error: signError } = await supabase.storage
        .from(options.bucket)
        .createSignedUrl(data.path, 60 * 60 * 24); // 24hr access

      return { 
        url: signedUrlData?.signedUrl || data.path, 
        path: data.path 
      };
    }
  }

  // Resilient fallback for local testing: return data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        path: `local/${file.name}`
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file for local preview.'));
    reader.readAsDataURL(file);
  });
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Failed to delete storage file:`, error);
    return false;
  }
  return true;
}
