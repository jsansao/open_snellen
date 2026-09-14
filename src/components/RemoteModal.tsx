import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Wifi, Copy, Check } from 'lucide-react';

interface RemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerId: string | null;
  isConnected: boolean;
}

export const RemoteModal: React.FC<RemoteModalProps> = ({
  isOpen,
  onClose,
  peerId,
  isConnected,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Build full remote pairing URL
  const remoteUrl = peerId
    ? `${window.location.origin}${window.location.pathname}?remote=${peerId}`
    : '';

  const handleCopy = () => {
    if (remoteUrl) {
      navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col items-center">
        
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Smartphone Remote Control</h2>
              <p className="text-xs text-slate-400">Scan QR code to pair your phone as a wireless controller</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium">
          <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-400 animate-pulse' : 'text-amber-400'}`} />
          <span>{isConnected ? 'Controller Connected!' : peerId ? 'Waiting for phone to scan...' : 'Initializing WebRTC connection...'}</span>
        </div>

        {/* QR Code Container */}
        {peerId && (
          <div className="p-4 bg-white rounded-2xl shadow-xl mb-6 border border-slate-200 flex flex-col items-center">
            <QRCodeSVG value={remoteUrl} size={200} level="M" includeMargin={true} />
          </div>
        )}

        {/* Connection Link */}
        {remoteUrl && (
          <div className="w-full mb-6">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Remote Pair URL</label>
            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <span className="truncate flex-1 px-2">{remoteUrl}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-sans transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <p className="text-xs text-slate-400 text-center max-w-sm">
          No app download required. Works instantly on any iPhone or Android smartphone web browser on the same or remote network.
        </p>
      </div>
    </div>
  );
};
