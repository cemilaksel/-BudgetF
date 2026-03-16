import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { AiService } from '../services/AiService';

interface ApiKeyScreenProps {
  onKeySaved: () => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySaved }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setIsLoading(true);
    setError(null);

    const isValid = await AiService.validateApiKey(key.trim());
    if (isValid) {
      AiService.setApiKey(key.trim());
      onKeySaved();
    } else {
      setError('API Key geçersiz. Lütfen doğru girdiğinizden emin olun.');
    }
    setIsLoading(false);
  };

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
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gemini API Key</label>
            <div className="relative">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#1a8a5c] focus:bg-white transition-all outline-none font-mono text-sm"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>

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
