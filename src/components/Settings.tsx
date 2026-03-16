import React, { useState } from 'react';
import { Key, Trash2, RefreshCw, AlertCircle, CheckCircle2, Eye, EyeOff, Clipboard, Info } from 'lucide-react';
import { AiService } from '../services/AiService';

export const Settings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = AiService.sanitizeApiKey(newKey);
    if (!cleanKey) return;

    setIsLoading(true);
    setStatus(null);

    const isValid = await AiService.validateApiKey(cleanKey);
    if (isValid) {
      AiService.setApiKey(cleanKey);
      setStatus({ type: 'success', message: 'API Key başarıyla güncellendi.' });
      setNewKey('');
      setIsEditing(false);
    } else {
      setStatus({ type: 'error', message: 'API Key geçersiz.' });
    }
    setIsLoading(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanText = AiService.sanitizeApiKey(text);
      setNewKey(cleanText);
    } catch (err) {
      setStatus({ type: 'error', message: 'Panodan okuma başarısız oldu.' });
    }
  };

  const handleDeleteKey = () => {
    if (window.confirm('API Key silinecek. Uygulamayı kullanmaya devam etmek için yeni bir key girmeniz gerekecek. Emin misiniz?')) {
      AiService.removeApiKey();
      window.location.reload();
    }
  };

  const keyLength = newKey.length;
  const isCorrectLength = keyLength === 39;
  const preview = newKey.length >= 12 
    ? `${newKey.slice(0, 8)}...${newKey.slice(-4)}`
    : newKey;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
            <Key size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">API Key Yönetimi</h3>
            <p className="text-xs text-gray-400">Gemini AI özelliklerini yönetin</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Mevcut Durum</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase">Aktif</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-mono truncate">
              ••••••••••••••••{AiService.getApiKey()?.slice(-4)}
            </p>
          </div>

          {status && (
            <div className={`flex items-center gap-2 p-4 rounded-2xl text-sm animate-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="font-medium">{status.message}</p>
            </div>
          )}

          {!isEditing ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                <RefreshCw size={16} />
                Key Değiştir
              </button>
              <button
                onClick={handleDeleteKey}
                className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
              >
                <Trash2 size={16} />
                Key Sil
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateKey} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Yeni API Key</label>
                  {newKey && (
                    <span className={`text-[10px] font-bold ${isCorrectLength ? 'text-gray-400' : 'text-amber-600'}`}>
                      {isCorrectLength ? '' : '⚠️ '}{keyLength} karakter
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Yeni API Key girin..."
                    className="w-full p-3 pr-10 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#1a8a5c] outline-none text-sm font-mono"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1a8a5c] transition-colors"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1a8a5c] transition-colors ml-1"
                >
                  <Clipboard size={14} />
                  📋 Panodan Yapıştır
                </button>
              </div>

              {newKey && (
                <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center gap-2">
                  <Info size={14} className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Önizleme</span>
                    <span className="text-xs font-mono font-bold text-gray-600">{preview}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setNewKey('');
                    setStatus(null);
                  }}
                  className="py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newKey.trim()}
                  className="py-3 bg-[#1a8a5c] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center"
                >
                  {isLoading ? 'Kontrol ediliyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl space-y-3">
        <h4 className="text-sm font-bold text-blue-900">Bilgi</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          API Key'iniz sadece bu tarayıcıda saklanır. Uygulama verileriniz (işlemler, hedefler vb.) de yerel olarak saklanmaktadır.
        </p>
      </div>
    </div>
  );
};
