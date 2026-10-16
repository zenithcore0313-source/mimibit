import React, { useState } from 'react';
import { X, Download, Copy, Check, QrCode, Sparkles, ExternalLink } from 'lucide-react';

export function QrCodeModal({ isOpen, onClose, creator }) {
  if (!isOpen || !creator) return null;

  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const bioUrl = `https://mimibit.me/${creator.handle?.replace('@', '@')}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bioUrl)}&bgcolor=ffffff&color=140e10&margin=2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setDownloaded(true);
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mimibit_${creator.handle?.replace('@', '')}_qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (e) {
      window.open(qrImageUrl, '_blank');
      setDownloaded(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white">바이오링크 QR 코드</h3>
              <p className="text-[11px] text-slate-400">오프라인 부스 & 인스타 공유용</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {/* Creator Mini Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <img 
              src={creator.avatar} 
              alt={creator.name} 
              className="w-5 h-5 rounded-full object-cover" 
            />
            <span className="text-xs font-bold text-slate-800">{creator.name}</span>
            <span className="text-[10px] font-mono font-bold text-[#E4092B]">{creator.handle}</span>
          </div>

          {/* QR Code Container */}
          <div className="relative mx-auto w-52 h-52 p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md flex items-center justify-center group">
            <img 
              src={qrImageUrl} 
              alt={`${creator.name} QR Code`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            스마트폰 기본 카메라로 스캔하면<br />
            <strong>{creator.name}</strong>님의 후원 링크로 1초 만에 바로 연결됩니다.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{downloaded ? '다운로드 완료!' : '고화질 QR 이미지 다운로드 (.PNG)'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? '링크 주소 복사됨!' : '링크 주소 복사하기'}</span>
            </button>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
          굿즈 스티커, 일러스트 명함, 서브컬처 부스 배너 인쇄에 적합한 400x400 고해상도 규격입니다.
        </div>
      </div>
    </div>
  );
}
