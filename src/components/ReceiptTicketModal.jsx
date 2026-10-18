import React, { useState } from 'react';
import { X, Share2, Download, Check, Sparkles, Heart, Copy, Camera } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function ReceiptTicketModal({ isOpen, onClose, donationData, creator }) {
  if (!isOpen || !donationData) return null;

  const [copied, setCopied] = useState(false);
  const [sharedStory, setSharedStory] = useState(false);

  const ticketNumber = `MIMIBIT-005400`;
  const serialNo = `#00${Math.floor(1 + Math.random() * 9)}`;
  const dateStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const handleShareStory = () => {
    setSharedStory(true);
    setTimeout(() => setSharedStory(false), 3500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mimibit.me/${creator.handle}?ticket=${ticketNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border-2 border-[#FFCCD5] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white text-[#6B5E62] flex items-center justify-center shadow-md hover:bg-[#FFF0F2] hover:text-[#E4092B] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-6 pb-2 text-center bg-gradient-to-b from-[#FFF0F2] to-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#E4092B] text-xs font-black shadow-xs border border-[#FCD5DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
            <span>VIRAL DONATION RECEIPT</span>
          </div>
          <div className="mt-2 flex justify-center">
            <img src="/logo.png" alt="MIMIBIT" className="h-8 w-auto object-contain filter drop-shadow-sm" />
          </div>
          <h3 className="font-bubble font-black text-2xl text-[#E4092B] mt-1 tracking-tight">
            THANK YOU! 💕
          </h3>
          <p className="text-xs text-[#6B5E62] font-bold mt-0.5">
            인스타 스토리에 공유하면 루나가 리포스트해 드려요!
          </p>
        </div>

        {/* The Viral Supporter Ticket Card (Slide 9 Exact Re-creation) */}
        <div className="p-4 bg-white">
          <div className="bg-[#FFFDFD] rounded-3xl p-5 border-2 border-dashed border-[#F89CAE] relative shadow-md text-center overflow-hidden">
            {/* Cutout Notch Left & Right */}
            <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-white border-r-2 border-[#F89CAE]"></div>
            <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-white border-l-2 border-[#F89CAE]"></div>

            {/* Ticket Header Pill */}
            <div className="flex items-center justify-between border-b border-[#FCD5DC] pb-2 mb-3">
              <img src="/logo.png" alt="MIMIBIT" className="h-5 w-auto object-contain" />
              <span className="text-[9px] font-black tracking-widest text-[#6B5E62] uppercase">
                DONATION RECEIPT
              </span>
            </div>

            {/* Supporter Ticket Title */}
            <div className="my-1.5">
              <span className="text-[10px] font-black tracking-widest text-[#E4092B] uppercase block">
                ✦ MIMIBIT SUPPORTER ✦
              </span>
              <h2 className="text-xl font-bubble font-black text-[#1C1215] mt-0.5 tracking-tight">
                {donationData.nickname}
              </h2>
            </div>

            {/* Ticket Key-Value Details */}
            <div className="bg-[#FFF0F2] rounded-2xl p-3 my-3 text-left space-y-1.5 text-xs border border-[#FCD5DC]">
              <div className="flex justify-between items-center">
                <span className="text-[#6B5E62] text-[10px] font-bold uppercase">SUPPORTER OF</span>
                <span className="font-black text-[#1C1215]">{creator.handle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5E62] text-[10px] font-bold uppercase">RANK / TIER</span>
                <span className="font-black text-[#E4092B] flex items-center gap-1">
                  <span>👑</span> #1 TOP SUPPORTER
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5E62] text-[10px] font-bold uppercase">CARROTS DONATED</span>
                <span className="font-bubble font-black text-sm text-[#E4092B]">
                  {donationData.carrots.toLocaleString()} 🥕
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5E62] text-[10px] font-bold uppercase">DATE & TIME</span>
                <span className="font-bold text-[#6B5E62] text-[10px]">{dateStr}</span>
              </div>
            </div>

            {/* Circular Stamp from Slide 9 */}
            <div className="flex justify-center my-2">
              <div className="w-18 h-18 rounded-full border-2 border-[#E4092B] text-[#E4092B] flex flex-col items-center justify-center transform -rotate-12 select-none shadow-sm bg-white/80 p-1">
                <span className="text-[8px] font-black tracking-tighter">APPROVED</span>
                <span className="text-xl leading-none my-0.5">🐰</span>
                <span className="text-[7px] font-black">CERTIFIED</span>
              </div>
            </div>

            {/* Barcode Strip & Serial Number */}
            <div className="border-t border-[#FCD5DC] pt-2 mt-2">
              <div className="flex justify-center items-center gap-1 h-6 px-4 mb-1">
                {[3, 2, 5, 2, 7, 3, 4, 2, 6, 3, 3, 2, 7, 2, 4, 3, 6, 2, 3, 2].map((w, i) => (
                  <div
                    key={i}
                    className="bg-[#1C1215] h-full"
                    style={{ width: `${w}px` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between items-center px-4 text-[9px] font-mono font-bold text-[#6B5E62]">
                <span>{ticketNumber}</span>
                <span className="font-black text-[#E4092B]">{serialNo}</span>
              </div>
            </div>

            {/* Footer watermark */}
            <p className="text-[9px] font-black text-[#E4092B] mt-2 tracking-wide uppercase">
              PROUD SUPPORTER OF MIMIBIT · SHARED VIA {creator.handle}
            </p>
          </div>
        </div>

        {/* Viral Action Buttons */}
        <div className="p-4 bg-white border-t border-[#FCE7EC] space-y-2">
          {sharedStory && (
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-black text-center animate-fade-in flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{creator.handle} 태그가 인스타 스토리 공유 클립보드에 복사되었습니다!</span>
            </div>
          )}

          <button
            onClick={handleShareStory}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] text-white text-xs font-black shadow-md shadow-[#E1306C]/30 flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>인스타 스토리에 인증하기 ({creator.handle} 자동태그)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const tweetText = `${creator.handle} 님에게 ${donationData.carrots}당근을 선물하고 Top 서포터 티켓 획득! #미미빗 #MIMIBIT`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <TwitterIcon className="w-3.5 h-3.5" />
              <span>X(트위터) 공유</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-[#FAFAFC] hover:bg-[#FFF0F2] text-[#1C1215] border border-[#FCD5DC] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#E4092B]" />}
              <span>{copied ? '복사 완료!' : '티켓 링크 복사'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
