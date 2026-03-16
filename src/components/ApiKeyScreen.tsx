import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, Loader2, Eye, EyeOff, Clipboard, Info } from 'lucide-react';
import { AiService } from '../services/AiService';

interface ApiKeyScreenProps {
  onKeySaved: () => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySaved }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = AiService.sanitizeApiKey(key);
    if (!cleanKey) return;

    setIsLoading(true);
    setError(null);

    const isValid = await AiService.validateApiKey(cleanKey);
    if (isValid) {
      AiService.setApiKey(cleanKey);
      onKeySaved();
    } else {
      setError('API Key geçersiz. Lütfen doğru girdiğinizden emin olun.');
    }
    setIsLoading(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanText = AiService.sanitizeApiKey(text);
      setKey(cleanText);
    } catch (err) {
      setError('Panodan okuma başarısız oldu. Lütfen manuel yapıştırın.');
    }
  };

  const keyLength = key.length;
  const isCorrectLength = keyLength === 39;
  const preview = key.length >= 12 
    ? `${key.slice(0, 8)}...${key.slice(-4)}`
    : key;

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Key className="text-[#1a8a5c]" size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Hoş Geldiniz</h1>
          <p className="text-gray-500 text-sm">Uygulamayı kullanmak için Gemini API Key gereklidir.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gemini API Key</label>
              {key && (
                <span className={`text-[10px] font-bold ${isCorrectLength ? 'text-gray-400' : 'text-amber-600'}`}>
                  {isCorrectLength ? '' : '⚠️ '}{keyLength} karakter
                </span>
              )}
            </div>
            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-4 pr-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#1a8a5c] focus:bg-white transition-all outline-none font-mono text-sm"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 text-gray-400 hover:text-[#1a8a5c] transition-colors"
                  title={showKey ? "Gizle" : "Göster"}
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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

          {key && (
            <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center gap-2">
              <Info size={14} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Önizleme</span>
                <span className="text-xs font-mono font-bold text-gray-600">{preview}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              API Key'inizi aşağıdaki adresten ücretsiz alabilirsiniz:
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-blue-800 hover:underline"
            >
              aistudio.google.com/app/apikey
              <ExternalLink size={12} />
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading || !key.trim()}
            className="w-full py-4 bg-[#1a8a5c] text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Kaydet ve Başla'
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-400 font-medium">
          API Key'iniz sadece tarayıcınızda (localStorage) saklanır ve asla sunucuya gönderilmez.
        </p>
      </div>
    </div>
  );
};
