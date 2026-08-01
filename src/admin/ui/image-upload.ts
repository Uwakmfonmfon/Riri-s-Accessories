import { supabase } from '../../lib/supabase.ts';
import { env } from '../../lib/env.ts';

let currentImageUrl: string | null = null;
let lastObjectUrl: string | null = null;

/**
 * Used by product-form.ts to attach the stored image URL to a row.
 */
export function getCurrentImageUrl(): string | null {
  return currentImageUrl;
}

/**
 * Used by editProduct() in product-form.ts to seed an existing URL.
 */
export function setCurrentImageUrl(url: string | null): void {
  currentImageUrl = url;
}

export function initImageUpload(): void {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const input = document.getElementById('imgFileInput') as HTMLInputElement | null;
    if (input) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // Some browsers refuse programmatic file assignment; fall through to
        // the direct handler.
      }
    }
    void handleImageSelect(file);
  });
}

export async function handleImageSelect(
  source: HTMLInputElement | File,
): Promise<void> {
  const file = source instanceof File ? source : source.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    setUploadStatus('Not a valid image file.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    setUploadStatus('Image too large — max 5MB.', 'error');
    return;
  }

  // Revoke any previous local preview URL to avoid leaks.
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
  const localUrl = URL.createObjectURL(file);
  lastObjectUrl = localUrl;
  showPreview(localUrl);
  setUploadStatus('Uploading to cloud...', 'uploading');

  const ext = file.name.split('.').pop() ?? 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(env.VITE_SUPABASE_STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    setUploadStatus(`Upload failed: ${uploadError.message}`, 'error');
    clearImage();
    return;
  }

  const { data: urlData } = supabase.storage
    .from(env.VITE_SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(fileName);

  currentImageUrl = urlData.publicUrl;

  // Free the local preview — the cloud URL is the source of truth now.
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = null;
  }
  const preview = document.getElementById('imgPreview') as HTMLImageElement | null;
  if (preview) preview.src = currentImageUrl;
  setUploadStatus('✓ Image uploaded successfully', 'success');
  const clearBtn = document.getElementById('clearImgBtn') as HTMLElement | null;
  if (clearBtn) clearBtn.style.display = 'inline-block';
}

export function showPreview(url: string): void {
  document.getElementById('uploadPlaceholder')?.style.setProperty('display', 'none');
  const wrap = document.getElementById('imgPreviewWrap');
  if (wrap) wrap.style.display = 'block';
  const preview = document.getElementById('imgPreview') as HTMLImageElement | null;
  if (preview) preview.src = url;
}

export function setUploadStatus(msg: string, type: '' | 'error' | 'uploading' | 'success'): void {
  const el = document.getElementById('uploadStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = `upload-status${type ? ' ' + type : ''}`;
}

export function clearImage(): void {
  currentImageUrl = null;
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = null;
  }
  const input = document.getElementById('imgFileInput') as HTMLInputElement | null;
  if (input) input.value = '';
  const preview = document.getElementById('imgPreview') as HTMLImageElement | null;
  if (preview) preview.src = '';
  document.getElementById('imgPreviewWrap')?.style.setProperty('display', 'none');
  document.getElementById('uploadPlaceholder')?.style.setProperty('display', 'block');
  const status = document.getElementById('uploadStatus');
  if (status) {
    status.textContent = '';
    status.className = 'upload-status';
  }
  const clearBtn = document.getElementById('clearImgBtn') as HTMLElement | null;
  if (clearBtn) clearBtn.style.display = 'none';
}
