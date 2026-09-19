export interface GoogleDriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  designData?: any;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
const FOLDER_NAME = 'Riza Apparel Custom Jerseys';

/**
 * Mendapatkan ID folder "Riza Apparel Custom Jerseys", atau membuatnya jika belum ada
 */
export async function getOrCreateRizaFolder(accessToken: string): Promise<string> {
  // Cari apakah folder sudah ada
  const query = encodeURIComponent(`name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`${DRIVE_API_BASE}/files?q=${query}&fields=files(id,name)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    const err = await searchRes.text();
    throw new Error(`Gagal mencari folder Google Drive: ${err}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Buat folder baru jika belum ada
  const createRes = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder penyimpanan otomatis desain custom jersey dari Riza Apparel Studio',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Gagal membuat folder di Google Drive: ${err}`);
  }

  const folder = await createRes.json();
  return folder.id;
}

/**
 * Mengambil daftar file desain di folder Riza Apparel
 */
export async function listJerseyFiles(accessToken: string): Promise<GoogleDriveFileItem[]> {
  const folderId = await getOrCreateRizaFolder(accessToken);
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await fetch(
    `${DRIVE_API_BASE}/files?q=${query}&fields=files(id,name,mimeType,size,createdTime,webViewLink,webContentLink)&orderBy=createdTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal memuat daftar file dari Google Drive: ${err}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Menyimpan konfigurasi jersey ke Google Drive sebagai file JSON
 */
export async function saveJerseyToGoogleDrive(
  accessToken: string,
  designState: any,
  customFileName?: string
): Promise<GoogleDriveFileItem> {
  const folderId = await getOrCreateRizaFolder(accessToken);

  const teamOrPlayer = designState.playerName || designState.sponsorText || 'Custom';
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = customFileName 
    ? `${customFileName.replace(/\.json$/i, '')}.json`
    : `Jersey_${teamOrPlayer.replace(/[^a-zA-Z0-9_-]/g, '_')}_${timestamp}.json`;

  const filePayload = {
    appName: 'Riza Apparel Studio',
    version: '2.0',
    savedAt: new Date().toISOString(),
    design: designState,
  };

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
    description: `Spesifikasi Desain Custom Jersey Riza Apparel: ${designState.motifTemplate || 'Custom'} (${designState.baseColor || '#fff'})`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(filePayload, null, 2) +
    closeDelimiter;

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menyimpan file ke Google Drive: ${err}`);
  }

  return await res.json();
}

/**
 * Mengambil isi konten desain jersey dari Google Drive
 */
export async function loadJerseyFromGoogleDrive(accessToken: string, fileId: string): Promise<any> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membaca isi file dari Google Drive: ${err}`);
  }

  return await res.json();
}

/**
 * Menghapus file dari Google Drive (Wajib didahului dialog konfirmasi di UI)
 */
export async function deleteFileFromGoogleDrive(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(`Gagal menghapus file dari Google Drive: ${err}`);
  }
}
