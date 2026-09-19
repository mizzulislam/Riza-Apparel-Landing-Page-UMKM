import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  UploadCloud, 
  FolderSync, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  LogOut,
  FolderOpen,
  Sparkles,
  Download
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../lib/googleAuth';
import { 
  listJerseyFiles, 
  saveJerseyToGoogleDrive, 
  loadJerseyFromGoogleDrive, 
  deleteFileFromGoogleDrive,
  GoogleDriveFileItem 
} from '../lib/googleDriveApi';
import { DesignState } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDesign?: DesignState;
  onApplyDesign?: (design: DesignState) => void;
  isDark?: boolean;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentDesign,
  onApplyDesign,
  isDark = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [files, setFiles] = useState<GoogleDriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState('');

  // Confirmation state for file deletion (MANDATORY per Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles(accessToken);
    }
  }, [isOpen, accessToken]);

  const loadFiles = async (token: string) => {
    setIsLoadingFiles(true);
    setFeedback(null);
    try {
      const items = await listJerseyFiles(token);
      setFiles(items);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setFeedback({ type: 'error', message: err.message || 'Gagal memuat file dari Google Drive' });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        loadFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setFiles([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSaveCurrentDesign = async () => {
    if (!accessToken || !currentDesign) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setFeedback(null);

    try {
      const savedItem = await saveJerseyToGoogleDrive(accessToken, currentDesign, customFileName);
      setSaveSuccessMsg(`Desain berhasil disimpan ke Google Drive: "${savedItem.name}"`);
      setCustomFileName('');
      // Reload files
      await loadFiles(accessToken);
    } catch (err: any) {
      console.error('Save design error:', err);
      setFeedback({ type: 'error', message: err.message || 'Gagal menyimpan ke Google Drive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDesignFromFile = async (file: GoogleDriveFileItem) => {
    if (!accessToken) return;
    try {
      const content = await loadJerseyFromGoogleDrive(accessToken, file.id);
      if (content && content.design && onApplyDesign) {
        onApplyDesign(content.design);
        setFeedback({ 
          type: 'success', 
          message: `Desain "${file.name}" berhasil diterapkan ke Studio Desain!` 
        });
      } else {
        setFeedback({ 
          type: 'error', 
          message: 'Format file tidak memiliki konfigurasi desain yang valid.' 
        });
      }
    } catch (err: any) {
      console.error('Load design file error:', err);
      setFeedback({ type: 'error', message: err.message || 'Gagal membuka file desain.' });
    }
  };

  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFileFromGoogleDrive(accessToken, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFeedback({ type: 'success', message: `File "${fileToDelete.name}" berhasil dihapus dari Google Drive.` });
      setFileToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus file dari Google Drive.' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl transition-all my-8 overflow-hidden ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-gray-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shadow-inner">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <span>Google Drive Workspace</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Cloud Sync
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Simpan & kelola arsip custom jersey Anda langsung di folder Google Drive pribadi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* AUTHENTICATION STATE */}
          {!user ? (
            <div className={`text-center p-8 rounded-2xl border ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'
            }`}>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold mb-2">Hubungkan dengan Google Drive</h4>
              <p className={`text-xs sm:text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Aplikasi memerlukan izin untuk menyimpan berkas spesifikasi jersey dan mockup ke folder Google Drive pribadi Anda dengan aman.
              </p>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Official Google Sign In Button Spec */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 active:scale-98 text-gray-800 font-semibold text-sm shadow-md hover:shadow-lg border border-gray-300 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span>{isAuthenticating ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* CONNECTED USER BADGE */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Google User'} 
                      className="w-10 h-10 rounded-full border-2 border-emerald-500 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{user.displayName || 'Pengguna Google'}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Terhubung
                      </span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isDark 
                      ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                      : 'border-gray-300 hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Keluar dari akun Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>

              {/* FEEDBACK ALERT */}
              {feedback && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{feedback.message}</span>
                  </div>
                  <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ACTION: SAVE CURRENT DESIGN */}
              {currentDesign && (
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <UploadCloud className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold">Simpan Desain Saat Ini ke Google Drive</h4>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Nama file (contoh: Jersey_Final_Tim_Ende)"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs border outline-none transition-colors ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' 
                          : 'bg-slate-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleSaveCurrentDesign}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Simpan ke Drive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>{saveSuccessMsg}</span>
                    </p>
                  )}
                </div>
              )}

              {/* LIST OF SAVED DESIGNS IN GOOGLE DRIVE */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderSync className="w-4 h-4 text-heritage-zawo" />
                    <h4 className="text-sm font-bold">Berkas di Folder "Riza Apparel Custom Jerseys"</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => accessToken && loadFiles(accessToken)}
                    disabled={isLoadingFiles}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-gray-200 hover:bg-gray-100 text-gray-600'
                    }`}
                    title="Muat Ulang File"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    <span className="text-[11px]">Segarkan</span>
                  </button>
                </div>

                {isLoadingFiles ? (
                  <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                    <span>Memuat berkas dari Google Drive...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className={`p-8 text-center rounded-2xl border ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}>
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-semibold">Belum ada file desain di folder Google Drive Anda</p>
                    <p className="text-[11px] opacity-70 mt-1">
                      Klik "Simpan ke Drive" di atas untuk mengarsipkan konfigurasi jersey pertama Anda.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                          isDark 
                            ? 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600' 
                            : 'bg-slate-50 border-gray-200 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold truncate" title={file.name}>
                              {file.name}
                            </h5>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400">
                              <span>{file.createdTime ? new Date(file.createdTime).toLocaleDateString('id-ID') : 'Tersimpan'}</span>
                              {file.size && <span>• {(parseInt(file.size, 10) / 1024).toFixed(1)} KB</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {onApplyDesign && (
                            <button
                              type="button"
                              onClick={() => handleLoadDesignFromFile(file)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                              title="Terapkan konfigurasi desain ini ke Studio Desain"
                            >
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>Muat ke Studio</span>
                            </button>
                          )}

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 rounded-xl border text-xs transition-colors ${
                                isDark 
                                  ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                                  : 'border-gray-300 hover:bg-gray-200 text-gray-600'
                              }`}
                              title="Buka file di Google Drive web"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* DELETE WITH MANDATORY USER CONFIRMATION */}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Hapus file ini dari Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* FOOTER */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-900/90 text-slate-400' : 'border-gray-200 bg-slate-50 text-gray-500'
        }`}>
          <span>Izin Terverifikasi: Google Drive Workspace API</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl border font-bold transition-colors ${
              isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-gray-300 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Tutup
          </button>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE OPERATION (DELETE) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
            isDark ? 'bg-slate-900 border-red-500/30 text-white' : 'bg-white border-red-200 text-gray-900'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-extrabold mb-2 text-red-500">
              Konfirmasi Hapus Berkas Google Drive
            </h4>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Apakah Anda yakin ingin menghapus berkas berikut dari akun Google Drive Anda?
            </p>

            <div className={`p-3 rounded-xl border mb-6 text-xs font-mono break-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-100 border-gray-200 text-gray-800'
            }`}>
              📁 {fileToDelete.name}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-98 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Berkas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
