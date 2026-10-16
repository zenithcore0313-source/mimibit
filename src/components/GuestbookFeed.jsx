import React, { useState } from 'react';
import { MessageSquare, Heart, Send, Sparkles } from 'lucide-react';

export function GuestbookFeed({ guestbook, onAddComment, userState, onOpenDonate }) {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (userState.tierLevel < 1) {
      alert('방명록 댓글은 화이트 래빗(1,000원+) 이상부터 작성 가능합니다!');
      onOpenDonate(10);
      return;
    }

    onAddComment({
      id: Date.now(),
      nickname: userState.nickname,
      tierId: userState.tierId,
      carrots: userState.totalDonatedCarrots || 10,
      content: newComment,
      createdAt: '방금 전',
      likes: 1
    });

    setNewComment('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F3E8EC] p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F3E8EC]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F4] text-[#FF2E63] flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4 text-[#FF2E63]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1D1E2C]">
              루나의 당근 방명록
            </h3>
            <p className="text-[11px] text-[#72748A]">
              화이트 래빗 이상의 서포터들이 남긴 응원 한마디
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#FF2E63] bg-[#FFF0F4] px-2.5 py-1 rounded-full">
          총 {guestbook.length}개의 응원
        </span>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={60}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              userState.tierLevel >= 1
                ? `${userState.nickname}님, 루나에게 따뜻한 응원을 남겨보세요!`
                : '1,000원(10당근) 이상 후원 시 방명록 작성 권한이 부여됩니다'
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#F3E8EC] text-xs font-medium focus:border-[#FF2E63]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#FF2E63] hover:bg-[#E81A50] text-white text-xs font-black transition-all flex items-center gap-1 shrink-0"
          >
            <span>등록</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {guestbook.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#FAFAFC] border border-[#F3E8EC] flex items-start justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-black ${
                    item.tierId === 'royal'
                      ? 'text-[#B45309]'
                      : item.tierId === 'silver'
                      ? 'text-[#FF2E63]'
                      : 'text-[#1D1E2C]'
                  }`}
                >
                  {item.nickname}
                </span>
                <span className="text-[10px] bg-white border border-[#F3E8EC] text-[#72748A] px-1.5 py-0.2 rounded-md font-semibold">
                  {item.carrots}🥕 서포터
                </span>
                <span className="text-[10px] text-[#9CA3AF]">{item.createdAt}</span>
              </div>
              <p className="text-[#33354A] font-medium leading-relaxed">
                {item.content}
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-[#72748A] hover:text-[#FF2E63] shrink-0 bg-white px-2 py-1 rounded-lg border border-[#F3E8EC]"
            >
              <Heart className="w-3 h-3 text-[#FF2E63]" />
              <span>{item.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
