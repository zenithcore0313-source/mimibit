/**
 * STELLA STUDIO - OBS OVERLAY JAVASCRIPT
 * OBS Studio / PRISM Live 브라우저 소스 동기화 & 실시간 인터랙션 엔진
 */

(function () {
  'use strict';

  // 1. URL Parameter Parsing
  const urlParams = new URLSearchParams(window.location.search);
  const widgetParam = (urlParams.get('widget') || 'all').toLowerCase();
  const themeParam = (urlParams.get('theme') || 'lavender').toLowerCase();
  const fontParam = parseInt(urlParams.get('fontSize') || '18', 10);
  const hideToolbarParam = urlParams.get('hideToolbar') === 'true' || urlParams.get('obs') === 'true';

  // DOM Elements
  const stage = document.getElementById('overlayStage');
  const virtualBg = document.getElementById('virtualBg');
  const toolbar = document.getElementById('streamerToolbar');
  const toolbarTab = document.getElementById('toolbarReopenTab');
  const widgetSelect = document.getElementById('widgetSelect');

  // Widget Elements
  const widgetGoal = document.getElementById('widgetGoal');
  const widgetChat = document.getElementById('widgetChat');
  const widgetBgm = document.getElementById('widgetBgm');
  const widgetAlert = document.getElementById('widgetAlert');
  const widgetRoulette = document.getElementById('widgetRoulette');
  const widgetAvatar = document.getElementById('widgetAvatar');
  const chatList = document.getElementById('chatStreamList');
  const alertCard = document.getElementById('overlayAlertCard');

  // Custom Streamer Avatar Elements
  const avatarImg = document.getElementById('avatarImg');
  const avatarName = document.getElementById('avatarName');
  const avatarSpeechBubble = document.getElementById('avatarSpeechBubble');
  const avatarSpeechText = document.getElementById('avatarSpeechText');
  let avatarReactionTimeout = null;
  let avatarSpeechTimeout = null;

  // Layout Edit Mode Elements
  const btnToggleLayoutEdit = document.getElementById('btnToggleLayoutEdit');
  const layoutEditBanner = document.getElementById('layoutEditBanner');
  const btnResetLayout = document.getElementById('btnResetLayout');
  const btnSaveLayout = document.getElementById('btnSaveLayout');
  const btnTestAvatar = document.getElementById('btnTestAvatar');

  // Real-Time Macro Overlay Elements
  const emergencyShield = document.getElementById('emergencyShield');
  const brbWidget = document.getElementById('brbWidget');
  const brbTimerText = document.getElementById('brbTimerText');
  const brbProgressFill = document.getElementById('brbProgressFill');
  const sipBadge = document.getElementById('sipBadge');
  const soundFxBadge = document.getElementById('soundFxBadge');
  const soundFxIcon = document.getElementById('soundFxIcon');
  const soundFxLabel = document.getElementById('soundFxLabel');
  let soundFxTimeout = null;

  // Broadcast Channel for Multi-tab / Dashboard Sync
  let broadcastChannel = null;
  try {
    broadcastChannel = new BroadcastChannel('stella_overlay_channel');
  } catch (e) {
    console.warn('BroadcastChannel not supported in this browser environment', e);
  }

  // 2. Initialize Widget Visibility
  function applyWidgetFilter(target) {
    const allWidgets = [
      { id: 'goal', el: widgetGoal },
      { id: 'chat', el: widgetChat },
      { id: 'bgm', el: widgetBgm },
      { id: 'alert', el: widgetAlert },
      { id: 'roulette', el: widgetRoulette },
      { id: 'avatar', el: widgetAvatar }
    ];

    if (target === 'all') {
      allWidgets.forEach(w => w.el?.classList.remove('widget-hidden'));
    } else {
      allWidgets.forEach(w => {
        if (w.id === target || (target === 'donation' && w.id === 'alert')) {
          w.el?.classList.remove('widget-hidden');
        } else {
          w.el?.classList.add('widget-hidden');
        }
      });
    }

    if (widgetSelect) widgetSelect.value = target;
  }

  // Apply Initial Filter
  applyWidgetFilter(widgetParam);

  // Apply Theme & Font to Chat
  if (widgetChat) {
    widgetChat.className = `widget-box widget-chat-container theme-${themeParam}`;
    if (!isNaN(fontParam)) {
      widgetChat.style.fontSize = `${fontParam}px`;
    }
  }

  // Toolbar Visibility Control
  if (hideToolbarParam && toolbar) {
    toolbar.classList.add('toolbar-hidden');
    if (toolbarTab) toolbarTab.style.display = 'block';
  }

  // 3. Chat Overlay Management
  const sampleUsers = [
    { name: '초승달팬클럽', badge: 'sub', badgeText: '구독', color: 'color-chzzk' },
    { name: '별빛모험가', badge: 'fan', badgeText: '팬클럽', color: 'color-lavender' },
    { name: '치지직고수', badge: 'vip', badgeText: 'VIP', color: 'color-gold' },
    { name: '사이버냥이', badge: 'sub', badgeText: '구독', color: 'color-cyan' },
    { name: '스텔라수호대', badge: 'fan', badgeText: '팬클럽', color: 'color-pink' }
  ];

  const sampleMessages = [
    '스텔라님 오늘 룩 너무 예뻐요! ✨',
    '오버레이 투명창 미쳤다 감성 대박 💜',
    '치지직 1등 가자아아 화이팅!',
    '방금 브금 진짜 좋아요 무슨 곡인가요?',
    '오늘 방송 몇 시까지 하시나요? 넘 재밌음',
    '룰렛 가자아아 오늘 100만 가자!! 🧀',
    '와 화질 엄청 깨끗하게 나온다 대박'
  ];

  // Clean Chat Banned Words Moderation
  let currentBannedWords = [
    { word: '바보', action: 'mask' },
    { word: '멍청이', action: 'mask' },
    { word: '핵', action: 'mask' },
    { word: '대리', action: 'mask' },
    { word: '분탕', action: 'hide' },
    { word: '스포', action: 'mask' }
  ];

  function loadOverlayBannedWords() {
    try {
      const saved = localStorage.getItem('stella_banned_words');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) currentBannedWords = parsed;
      }
    } catch (e) {}
  }
  loadOverlayBannedWords();

  function addChatMessage(user, text, badge = 'sub', badgeText = '구독', color = 'color-chzzk') {
    if (!chatList) return;

    let filteredText = text;
    let isHidden = false;
    let isWarned = false;

    if (Array.isArray(currentBannedWords) && currentBannedWords.length > 0) {
      for (const b of currentBannedWords) {
        if (!b || !b.word) continue;
        const escaped = b.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        if (regex.test(filteredText)) {
          if (b.action === 'hide') {
            isHidden = true;
            break;
          } else if (b.action === 'warn') {
            filteredText = filteredText.replace(regex, '***');
            isWarned = true;
          } else {
            filteredText = filteredText.replace(regex, '***');
          }
        }
      }
    }

    if (isHidden) {
      console.log('[CleanChat Filter] Message hidden:', text);
      return;
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble-item';
    if (isWarned) {
      bubble.style.borderLeft = '3px solid #f43f5e';
    }

    bubble.innerHTML = `
      <span class="chat-badge ${isWarned ? 'badge-mod' : `badge-${badge}`}">${isWarned ? '클린봇주의' : badgeText}</span>
      <div class="chat-content-wrap">
        <span class="chat-sender ${color}">${user}</span>
        <span class="chat-message-text">${filteredText}</span>
      </div>
    `;

    chatList.appendChild(bubble);

    // Limit chat items on screen to prevent overflow
    while (chatList.children.length > 7) {
      chatList.removeChild(chatList.firstChild);
    }

    // Auto fade-out after 14 seconds
    setTimeout(() => {
      bubble.classList.add('fade-out');
      setTimeout(() => bubble.remove(), 600);
    }, 14000);
  }

  // 4. Alert Box (Donation & Roulette) Management
  let alertTimeout = null;

  // Web Speech API Donation Voice Synthesizer
  function speakDonationTTS(user, amount, message) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = `${user}님, 치즈 ${amount.toLocaleString()}개 감사합니다. ${message}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.15;
      utterance.lang = 'ko-KR';

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.includes('ko') || v.name.includes('Korean') || v.name.includes('Yuna') || v.name.includes('Heami'));
      if (koVoice) utterance.voice = koVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  let overlayMediaSettings = null;
  function loadOverlayMediaSettings() {
    try {
      const saved = localStorage.getItem('stella_media_custom_settings');
      if (saved) overlayMediaSettings = JSON.parse(saved);
    } catch (e) {}
  }
  loadOverlayMediaSettings();

  function triggerDonationAlert(user, amount, message, mode, media) {
    if (!alertCard) return;

    // Reset previous
    clearTimeout(alertTimeout);

    // Check mode
    const isExcelMode = mode === 'excel' || (overlayMediaSettings && overlayMediaSettings.mode === 'excel');
    alertCard.className = 'overlay-alert-card' + (isExcelMode ? ' mode-excel' : '');

    const alertUserEl = document.getElementById('alertUser');
    const alertAmountEl = document.getElementById('alertAmount');
    const alertMsgEl = document.getElementById('alertMsg');
    const alertBadgeEl = document.getElementById('alertBadge');
    const alertTitleEl = document.getElementById('alertTitle');
    const alertCustomMediaWrap = document.getElementById('alertCustomMediaWrap');
    const alertCustomImg = document.getElementById('alertCustomImg');
    const alertCustomAudio = document.getElementById('alertCustomAudio');

    if (alertBadgeEl) {
      alertBadgeEl.textContent = isExcelMode ? '🔥 엑셀 크루 후원 폭격' : '🧀 치즈 후원 도착';
    }
    if (alertTitleEl) alertTitleEl.innerHTML = `<span class="alert-user">${user}</span>님의 따뜻한 후원!`;
    if (alertAmountEl) alertAmountEl.textContent = `${amount.toLocaleString()} 치즈`;
    if (alertMsgEl) alertMsgEl.textContent = `"${message}"`;

    // Determine Tier Media
    let tierMedia = media;
    if (!tierMedia && overlayMediaSettings && overlayMediaSettings.tiers) {
      if (amount >= 50000) tierMedia = overlayMediaSettings.tiers.tier50k;
      else if (amount >= 10000) tierMedia = overlayMediaSettings.tiers.tier10k;
      else if (amount >= 5000) tierMedia = overlayMediaSettings.tiers.tier5k;
      else tierMedia = overlayMediaSettings.tiers.default;
    }

    // Display Custom Image/GIF
    if (tierMedia && tierMedia.img && alertCustomMediaWrap && alertCustomImg) {
      alertCustomImg.src = tierMedia.img;
      alertCustomMediaWrap.style.display = 'flex';
    } else if (alertCustomMediaWrap) {
      alertCustomMediaWrap.style.display = 'none';
    }

    // Trigger visual popup
    alertCard.classList.add('active');

    // Play Custom Sound / Preset SFX
    if (tierMedia && tierMedia.sfx && alertCustomAudio) {
      try {
        alertCustomAudio.src = tierMedia.sfx;
        alertCustomAudio.currentTime = 0;
        alertCustomAudio.play().catch(e => {
          console.warn('Audio play error, falling back to synth', e);
          playProceduralSound('chime');
        });
      } catch (e) {
        playProceduralSound('chime');
      }
    } else if (tierMedia && tierMedia.sfxType === 'preset' && tierMedia.sfxKey) {
      playProceduralSound(tierMedia.sfxKey);
    } else {
      playProceduralSound('chime');
    }

    // Speak donation voice TTS
    speakDonationTTS(user, amount, message);

    // Update goal bar dynamically
    incrementGoalProgress(amount);

    // Exit animation after 5.5s
    alertTimeout = setTimeout(() => {
      alertCard.classList.add('alert-exit');
      setTimeout(() => {
        alertCard.classList.remove('active', 'alert-exit', 'mode-excel');
      }, 450);
    }, 5500);
  }

  function triggerRouletteAlert(winItem) {
    if (!alertCard) return;

    clearTimeout(alertTimeout);
    alertCard.className = 'overlay-alert-card alert-roulette';

    const alertBadgeEl = document.getElementById('alertBadge');
    const alertTitleEl = document.getElementById('alertTitle');
    const alertAmountEl = document.getElementById('alertAmount');
    const alertMsgEl = document.getElementById('alertMsg');

    if (alertBadgeEl) alertBadgeEl.textContent = '🎯 룰렛 당첨 알림';
    if (alertTitleEl) alertTitleEl.innerHTML = '축하합니다! 룰렛 결과 발표!';
    if (alertAmountEl) alertAmountEl.textContent = winItem || '매운 불닭 먹방';
    if (alertMsgEl) alertMsgEl.textContent = '스트리머 벌칙/리액션이 확정되었습니다! 박수 짝짝짝 👏';

    alertCard.classList.add('active');

    alertTimeout = setTimeout(() => {
      alertCard.classList.add('alert-exit');
      setTimeout(() => {
        alertCard.classList.remove('active', 'alert-exit', 'alert-roulette');
      }, 450);
    }, 5500);
  }

  // Goal Bar Incremental Progress
  let currentGoalAmount = 382000;
  const maxGoalAmount = 500000;

  function incrementGoalProgress(amt) {
    currentGoalAmount = Math.min(currentGoalAmount + amt, maxGoalAmount);
    const percent = Math.min(Math.round((currentGoalAmount / maxGoalAmount) * 100), 100);

    const goalNumbers = document.getElementById('goalNumbers');
    const goalFill = document.getElementById('goalFill');

    if (goalNumbers) {
      goalNumbers.innerHTML = `${currentGoalAmount.toLocaleString()} / ${maxGoalAmount.toLocaleString()} 치즈 <span class="percent">${percent}%</span>`;
    }
    if (goalFill) {
      goalFill.style.width = `${percent}%`;
    }
  }

  // 5. Broadcast Roulette Drawing (Synced with Dashboard)
  const rouletteCanvas = document.getElementById('broadcastRouletteCanvas');
  let rouletteAngle = 0;
  let isSpinning = false;
  let currentRouletteItems = [
    { name: '10초 모에모에 애교 미션', color: '#ec4899' },
    { name: '스쿼트 10개', color: '#f43f5e' },
    { name: '원하는 노래 1곡 라이브 부르기', color: '#38bdf8' },
    { name: '시청자 닉네임 다정하게 불러주기', color: '#c4b5fd' },
    { name: '치즈 10,000개 잭팟 환급', color: '#fde047' }
  ];

  function loadOverlayRouletteItems() {
    try {
      const saved = localStorage.getItem('stella_roulette_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          currentRouletteItems = parsed.map(item => ({
            name: item.text || item.name,
            color: item.color || '#8b5cf6'
          }));
        }
      }
    } catch (e) {}
  }
  loadOverlayRouletteItems();

  function drawRouletteWheel() {
    if (!rouletteCanvas) return;
    const ctx = rouletteCanvas.getContext('2d');
    const width = rouletteCanvas.width;
    const height = rouletteCanvas.height;
    const radius = width / 2;
    const count = currentRouletteItems.length;
    if (count === 0) return;
    const arc = (2 * Math.PI) / count;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rouletteAngle);

    currentRouletteItems.forEach((item, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = item.color;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 8, angle, angle + arc);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Border line
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.fillStyle = (item.color === '#fde047' || item.color === '#00ffa3') ? '#1e1b4b' : '#ffffff';
      ctx.font = 'bold 12px Pretendard, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 3;
      ctx.translate(
        Math.cos(angle + arc / 2) * (radius * 0.62),
        Math.sin(angle + arc / 2) * (radius * 0.62)
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      ctx.textAlign = 'center';
      let displayName = item.name;
      if (displayName.length > 8) displayName = displayName.substring(0, 7) + '…';
      ctx.fillText(displayName, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  function spinRoulette() {
    if (isSpinning) return;
    isSpinning = true;

    const extraSpins = 5 + Math.random() * 4;
    const randomStop = Math.random() * 2 * Math.PI;
    const targetAngle = rouletteAngle + extraSpins * 2 * Math.PI + randomStop;
    const startAngle = rouletteAngle;
    const duration = 4500;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      rouletteAngle = startAngle + (targetAngle - startAngle) * eased;
      drawRouletteWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        // Determine winning item at top pointer (angle = 3PI/2)
        const normalizedAngle = (rouletteAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const arc = (2 * Math.PI) / currentRouletteItems.length;
        const pointerAngle = (3 * Math.PI / 2 - normalizedAngle + 4 * Math.PI) % (2 * Math.PI);
        const winIdx = Math.floor(pointerAngle / arc) % currentRouletteItems.length;
        const winner = currentRouletteItems[winIdx].name;

        triggerRouletteAlert(winner);
      }
    }

    requestAnimationFrame(animate);
  }

  drawRouletteWheel();

  // ========================================================
  // 5.5 Real-Time Macro Handlers (Emergency, BRB, Sip, Flush)
  // ========================================================
  function setEmergencyShield(active) {
    if (active) {
      emergencyShield?.classList.add('active');
    } else {
      emergencyShield?.classList.remove('active');
    }
  }

  let brbInterval = null;
  function startBrbTimer(durationSeconds = 300) {
    if (!brbWidget) return;
    clearInterval(brbInterval);
    brbWidget.classList.add('active');
    let remaining = durationSeconds;

    function updateBrb() {
      const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
      const secs = String(remaining % 60).padStart(2, '0');
      if (brbTimerText) brbTimerText.textContent = `${mins}:${secs}`;
      if (brbProgressFill) {
        const pct = Math.max(0, (remaining / durationSeconds) * 100);
        brbProgressFill.style.width = `${pct}%`;
      }
      if (remaining <= 0) {
        clearInterval(brbInterval);
        setTimeout(() => brbWidget.classList.remove('active'), 2000);
      }
      remaining--;
    }

    updateBrb();
    brbInterval = setInterval(updateBrb, 1000);
  }

  function stopBrbTimer() {
    clearInterval(brbInterval);
    brbWidget?.classList.remove('active');
  }

  function setSipBadge(active) {
    if (active) {
      sipBadge?.classList.add('active');
    } else {
      sipBadge?.classList.remove('active');
    }
  }

  function flushChatList() {
    if (!chatList) return;
    chatList.innerHTML = '';
    const notice = document.createElement('div');
    notice.className = 'chat-flush-notice';
    notice.textContent = '✨ 채팅창이 깨끗하게 정돈되었습니다.';
    chatList.appendChild(notice);
    setTimeout(() => {
      notice.remove();
    }, 4000);
  }

  // Procedural Web Audio Sound Synthesizer for Overlay
  function playProceduralSound(type, volume = 0.8) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      master.connect(ctx.destination);

      if (type === 'applause') {
        // Filtered noise with multi-burst envelope
        const bufferSize = ctx.sampleRate * 2.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        noise.start();
      } else if (type === 'beep') {
        // Standard 1000Hz pure tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.85);
      } else if (type === 'boing') {
        // Downward sweep comic boing
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.9, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      } else if (type === 'airhorn') {
        // Airhorn dual pulse
        const freqs = [466.16, 622.25]; // Bb4, Eb5
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        });
      } else if (type === 'magic') {
        // Pentatonic harp arpeggio
        const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.5, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(master);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
      } else if (type === 'drumroll') {
        // Snare roll into crash
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
      }
    } catch (e) {}
  }

  function triggerOverlaySoundFx(key, icon, label, volume = 0.8, audioData = null) {
    if (soundFxIcon) soundFxIcon.textContent = icon;
    if (soundFxLabel) soundFxLabel.textContent = `[효과음] ${label}`;
    if (soundFxBadge) {
      soundFxBadge.classList.add('active');
      clearTimeout(soundFxTimeout);
      soundFxTimeout = setTimeout(() => {
        soundFxBadge.classList.remove('active');
      }, 3200);
    }
    if (audioData) {
      try {
        const audio = new Audio(audioData);
        audio.volume = volume;
        audio.play();
      } catch (e) {}
    } else {
      playProceduralSound(key, volume);
    }
  }

  // ========================================================
  // 6. STREAMER CUSTOM CHARACTER & AVATAR SYSTEM
  // ========================================================
  let customAvatarSettings = {
    imgUrl: 'assets/images/frame_01.png',
    name: '스텔라★루나',
    animStyle: 'anim-float',
    speechEnabled: true,
    reactionEnabled: true
  };

  function loadCustomAvatarSettings() {
    try {
      const raw = localStorage.getItem('stella_custom_avatar_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        customAvatarSettings = Object.assign(customAvatarSettings, parsed);
      }
    } catch (e) {}

    applyCustomAvatarToDom();
  }

  function applyCustomAvatarToDom() {
    if (avatarImg && customAvatarSettings.imgUrl) {
      avatarImg.src = customAvatarSettings.imgUrl;
      avatarImg.className = `avatar-character-img ${customAvatarSettings.animStyle || 'anim-float'}`;
    }
    if (avatarName && customAvatarSettings.name) {
      avatarName.textContent = customAvatarSettings.name;
    }
  }

  function triggerAvatarReaction(speechText) {
    if (!avatarImg || !widgetAvatar || widgetAvatar.classList.contains('widget-hidden')) return;

    // 1. Excited physical bounce / jump
    avatarImg.classList.remove('avatar-reacting');
    void avatarImg.offsetWidth; // Force reflow
    avatarImg.classList.add('avatar-reacting');

    clearTimeout(avatarReactionTimeout);
    avatarReactionTimeout = setTimeout(() => {
      avatarImg.classList.remove('avatar-reacting');
    }, 1500);

    // 2. Speech Bubble display
    const bubble = avatarSpeechBubble || document.getElementById('avatarSpeechBubble');
    const textEl = avatarSpeechText || document.getElementById('avatarSpeechText');
    if (bubble) {
      if (textEl) textEl.textContent = speechText || '오늘도 스텔라 스튜디오에 와주셔서 감사합니다! ✨';
      bubble.classList.add('active');

      clearTimeout(avatarSpeechTimeout);
      avatarSpeechTimeout = setTimeout(() => {
        bubble.classList.remove('active');
      }, 4800);
    }
  }

  // Initial Avatar load
  loadCustomAvatarSettings();

  // ========================================================
  // 7. OVERLAY WIDGET LAYOUT DRAG & SCALE ENGINE (위젯 자유 배치)
  // ========================================================
  const layoutWidgetDefs = [
    { id: 'widgetGoal', el: widgetGoal, name: '🎯 목표치 바', defaultX: 'center', defaultY: 28 },
    { id: 'widgetChat', el: widgetChat, name: '💬 실시간 채팅', defaultX: 32, defaultY: 'calc(100vh - 540px)' },
    { id: 'widgetBgm', el: widgetBgm, name: '🎵 BGM 플레이어', defaultX: 'calc(100vw - 360px)', defaultY: 'calc(100vh - 90px)' },
    { id: 'widgetAlert', el: widgetAlert, name: '🧀 후원/룰렛 알림', defaultX: 'center', defaultY: 140 },
    { id: 'widgetRoulette', el: widgetRoulette, name: '🎡 방송 룰렛', defaultX: 'calc(100vw - 360px)', defaultY: 220 },
    { id: 'widgetAvatar', el: widgetAvatar, name: '👤 내 캐릭터 아바타', defaultX: 'calc(100vw - 280px)', defaultY: 'calc(100vh - 380px)' }
  ];

  let widgetLayoutState = {};
  let isLayoutEditing = false;
  let activeDragWidget = null;
  let dragStartMouseX = 0;
  let dragStartMouseY = 0;
  let dragStartElemX = 0;
  let dragStartElemY = 0;

  function loadSavedWidgetLayout() {
    try {
      const raw = localStorage.getItem('stella_widget_layout');
      if (raw) {
        widgetLayoutState = JSON.parse(raw);
        applyLayoutStateToDom();
      }
    } catch (e) {}
  }

  function applyLayoutStateToDom() {
    layoutWidgetDefs.forEach(def => {
      const state = widgetLayoutState[def.id];
      if (state && def.el) {
        if (typeof state.left === 'number' && typeof state.top === 'number') {
          def.el.style.left = `${state.left}px`;
          def.el.style.top = `${state.top}px`;
          def.el.style.right = 'auto';
          def.el.style.bottom = 'auto';
        }
        if (state.scale) {
          def.el.style.transform = `scale(${state.scale})`;
          def.el.style.transformOrigin = 'center center';
        }
      }
    });
  }

  function toggleLayoutEditing(force) {
    isLayoutEditing = typeof force === 'boolean' ? force : !isLayoutEditing;
    document.body.classList.toggle('layout-editing', isLayoutEditing);

    if (btnToggleLayoutEdit) {
      btnToggleLayoutEdit.classList.toggle('btn-active', isLayoutEditing);
      btnToggleLayoutEdit.innerHTML = isLayoutEditing ? '<span>💾 배치 완료</span>' : '<span>📐 위젯 위치/크기 편집</span>';
    }

    if (layoutEditBanner) {
      layoutEditBanner.style.display = isLayoutEditing ? 'flex' : 'none';
    }

    if (isLayoutEditing) {
      injectLayoutEditHandles();
    } else {
      removeLayoutEditHandles();
      saveWidgetLayout();
    }
  }

  function injectLayoutEditHandles() {
    layoutWidgetDefs.forEach(def => {
      if (!def.el) return;
      if (def.el.querySelector('.widget-edit-handle-bar')) return;

      const state = widgetLayoutState[def.id] || { scale: 1 };
      const currentScale = state.scale || 1;

      const handle = document.createElement('div');
      handle.className = 'widget-edit-handle-bar';
      handle.innerHTML = `
        <div class="handle-title">
          <span class="drag-icon">⠿</span>
          <span>${def.name}</span>
        </div>
        <div class="handle-scale-group">
          <span>크기</span>
          <input type="range" class="handle-scale-slider" min="0.5" max="2.0" step="0.05" value="${currentScale}">
          <span class="handle-scale-val">${currentScale.toFixed(2)}x</span>
        </div>
      `;

      // Scale range input event
      const slider = handle.querySelector('.handle-scale-slider');
      const valLabel = handle.querySelector('.handle-scale-val');
      slider.addEventListener('input', (e) => {
        e.stopPropagation();
        const sc = parseFloat(e.target.value);
        valLabel.textContent = `${sc.toFixed(2)}x`;
        def.el.style.transform = `scale(${sc})`;
        def.el.style.transformOrigin = 'center center';

        if (!widgetLayoutState[def.id]) {
          const rect = def.el.getBoundingClientRect();
          widgetLayoutState[def.id] = { left: rect.left, top: rect.top, scale: sc };
        } else {
          widgetLayoutState[def.id].scale = sc;
        }
      });

      // Prevent dragging from firing slider
      slider.addEventListener('mousedown', (e) => e.stopPropagation());

      def.el.prepend(handle);
      setupWidgetDrag(def.el, def.id);
    });
  }

  function removeLayoutEditHandles() {
    document.querySelectorAll('.widget-edit-handle-bar').forEach(el => el.remove());
  }

  function setupWidgetDrag(elem, widgetId) {
    elem.onmousedown = function (e) {
      if (!isLayoutEditing) return;
      if (e.target.closest('.handle-scale-slider')) return;

      e.preventDefault();
      activeDragWidget = elem;
      activeDragWidget.classList.add('is-dragging');

      const rect = elem.getBoundingClientRect();
      dragStartMouseX = e.clientX;
      dragStartMouseY = e.clientY;
      dragStartElemX = rect.left;
      dragStartElemY = rect.top;

      elem.style.left = `${dragStartElemX}px`;
      elem.style.top = `${dragStartElemY}px`;
      elem.style.right = 'auto';
      elem.style.bottom = 'auto';

      document.onmousemove = onWidgetMouseMove;
      document.onmouseup = onWidgetMouseUp;
    };
  }

  function onWidgetMouseMove(e) {
    if (!activeDragWidget) return;
    const dx = e.clientX - dragStartMouseX;
    const dy = e.clientY - dragStartMouseY;

    let newX = dragStartElemX + dx;
    let newY = dragStartElemY + dy;

    // Viewport bounding clamp
    newX = Math.max(0, Math.min(newX, window.innerWidth - 80));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 80));

    activeDragWidget.style.left = `${newX}px`;
    activeDragWidget.style.top = `${newY}px`;
  }

  function onWidgetMouseUp() {
    if (!activeDragWidget) return;

    activeDragWidget.classList.remove('is-dragging');
    const id = activeDragWidget.id;
    const rect = activeDragWidget.getBoundingClientRect();
    const sc = widgetLayoutState[id]?.scale || 1;

    widgetLayoutState[id] = {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      scale: sc
    };

    activeDragWidget = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  function saveWidgetLayout() {
    try {
      localStorage.setItem('stella_widget_layout', JSON.stringify(widgetLayoutState));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'LAYOUT_UPDATED', layout: widgetLayoutState });
      }
    } catch (e) {}
  }

  function resetWidgetLayout() {
    try {
      localStorage.removeItem('stella_widget_layout');
      widgetLayoutState = {};

      layoutWidgetDefs.forEach(def => {
        if (!def.el) return;
        def.el.style.left = '';
        def.el.style.top = '';
        def.el.style.right = '';
        def.el.style.bottom = '';
        def.el.style.transform = '';
      });

      if (isLayoutEditing) {
        removeLayoutEditHandles();
        injectLayoutEditHandles();
      }

      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'RESET_LAYOUT' });
      }
    } catch (e) {}
  }

  // Load layout on initialization
  loadSavedWidgetLayout();

  // If URL has ?edit=1 or ?layout=edit, open directly in layout editing mode!
  if (urlParams.get('edit') === '1' || urlParams.get('layout') === 'edit') {
    setTimeout(() => toggleLayoutEditing(true), 400);
  }

  // ========================================================
  // 8. BROADCASTCHANNEL & LOCALSTORAGE EVENT LISTENERS
  // ========================================================
  if (broadcastChannel) {
    broadcastChannel.onmessage = function (e) {
      const data = e.data;
      if (!data) return;

      if (data.type === 'DONATION_ALERT') {
        triggerDonationAlert(data.user, data.amount, data.message, data.mode, data.media);
        triggerAvatarReaction(`${data.user}님 ${Number(data.amount).toLocaleString()} 치즈 감사합니다! 💜`);
      } else if (data.type === 'UPDATE_MEDIA_CUSTOM') {
        loadOverlayMediaSettings();
      } else if (data.type === 'ROULETTE_ALERT') {
        triggerRouletteAlert(data.winItem);
        triggerAvatarReaction(`룰렛 당첨! [${data.winItem}] 축하드려요 🎉`);
      } else if (data.type === 'SPIN_ROULETTE') {
        spinRoulette();
      } else if (data.type === 'NEW_CHAT') {
        addChatMessage(data.user, data.text, data.badge, data.badgeText, data.color);
      } else if (data.type === 'UPDATE_GOAL') {
        incrementGoalProgress(data.amount || 10000);
      } else if (data.type === 'EMERGENCY_SHIELD') {
        setEmergencyShield(data.active);
      } else if (data.type === 'BRB_TIMER') {
        if (data.active) startBrbTimer(data.durationSeconds || 300);
        else stopBrbTimer();
      } else if (data.type === 'SIP_MUTE') {
        setSipBadge(data.active);
      } else if (data.type === 'CHAT_FLUSH') {
        flushChatList();
      } else if (data.type === 'QUICK_ANNOUNCEMENT') {
        addChatMessage('STELLA BOT', data.text, 'vip', '공지', 'color-chzzk');
        triggerAvatarReaction(`[공지] ${data.text}`);
      } else if (data.type === 'SOUND_FX') {
        triggerOverlaySoundFx(data.key, data.icon, data.label, data.volume || 0.8, data.audioData);
        triggerAvatarReaction(`${data.label}! 👏`);
      } else if (data.type === 'UPDATE_AVATAR') {
        if (data.settings) {
          customAvatarSettings = Object.assign(customAvatarSettings, data.settings);
          applyCustomAvatarToDom();
        }
      } else if (data.type === 'TRIGGER_AVATAR_REACTION') {
        triggerAvatarReaction(data.speechText || '별빛 가득한 방송 함께해요! ✨');
      } else if (data.type === 'RESET_LAYOUT') {
        resetWidgetLayout();
      } else if (data.type === 'ROULETTE_CONFIG_UPDATE') {
        loadOverlayRouletteItems();
        drawRouletteWheel();
      } else if (data.type === 'BANNED_WORDS_UPDATED') {
        loadOverlayBannedWords();
      } else if (data.type === 'STUDIO_RESTORED') {
        loadOverlayRouletteItems();
        drawRouletteWheel();
        loadOverlayBannedWords();
        loadCustomAvatarSettings();
        applyCustomAvatarToDom();
        loadSavedWidgetLayout();
      }
    };
  }

  // Fallback LocalStorage event listener
  window.addEventListener('storage', (e) => {
    if (e.key === 'stella_overlay_event' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        if (data.type === 'DONATION_ALERT') {
          triggerDonationAlert(data.user, data.amount, data.message, data.mode, data.media);
          triggerAvatarReaction(`${data.user}님 ${Number(data.amount).toLocaleString()} 치즈 감사합니다! 💜`);
        } else if (data.type === 'UPDATE_MEDIA_CUSTOM') {
          loadOverlayMediaSettings();
        } else if (data.type === 'ROULETTE_ALERT') {
          triggerRouletteAlert(data.winItem);
        } else if (data.type === 'EMERGENCY_SHIELD') {
          setEmergencyShield(data.active);
        } else if (data.type === 'BRB_TIMER') {
          if (data.active) startBrbTimer(data.durationSeconds || 300);
          else stopBrbTimer();
        } else if (data.type === 'SIP_MUTE') {
          setSipBadge(data.active);
        } else if (data.type === 'CHAT_FLUSH') {
          flushChatList();
        } else if (data.type === 'SOUND_FX') {
          triggerOverlaySoundFx(data.key, data.icon, data.label, data.volume || 0.8, data.audioData);
        } else if (data.type === 'UPDATE_AVATAR') {
          loadCustomAvatarSettings();
        } else if (data.type === 'RESET_LAYOUT') {
          resetWidgetLayout();
        } else if (data.type === 'ROULETTE_CONFIG_UPDATE') {
          loadOverlayRouletteItems();
          drawRouletteWheel();
        } else if (data.type === 'BANNED_WORDS_UPDATED') {
          loadOverlayBannedWords();
        } else if (data.type === 'STUDIO_RESTORED') {
          loadOverlayRouletteItems();
          drawRouletteWheel();
          loadOverlayBannedWords();
          loadCustomAvatarSettings();
          applyCustomAvatarToDom();
          loadSavedWidgetLayout();
        }
      } catch (err) {}
    } else if (e.key === 'stella_custom_avatar_data') {
      loadCustomAvatarSettings();
    } else if (e.key === 'stella_banned_words') {
      loadOverlayBannedWords();
    } else if (e.key === 'stella_roulette_items') {
      loadOverlayRouletteItems();
      drawRouletteWheel();
    } else if (e.key === 'stella_widget_layout') {
      loadSavedWidgetLayout();
    }
  });

  // ========================================================
  // 9. STREAMER HELPER TOOLBAR BUTTON INTERACTIONS
  // ========================================================
  const btnToggleBg = document.getElementById('btnToggleBg');
  const btnTestDonation = document.getElementById('btnTestDonation');
  const btnTestRoulette = document.getElementById('btnTestRoulette');
  const btnTestChat = document.getElementById('btnTestChat');
  const btnCopyObsUrl = document.getElementById('btnCopyObsUrl');
  const btnHideToolbar = document.getElementById('btnHideToolbar');

  if (btnToggleBg) {
    btnToggleBg.addEventListener('click', () => {
      const active = virtualBg?.classList.toggle('active');
      btnToggleBg.classList.toggle('btn-active', active);
      btnToggleBg.innerHTML = active ? '🎮 배경 끄기' : '🎮 가상 배경 켜기';
    });
  }

  if (btnTestDonation) {
    btnTestDonation.addEventListener('click', () => {
      const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)].name;
      const amounts = [10000, 30000, 50000, 100000];
      const amt = amounts[Math.floor(Math.random() * amounts.length)];
      const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      triggerDonationAlert(user, amt, msg);
      triggerAvatarReaction(`${user}님 치즈 후원 감사합니다! 💜`);
    });
  }

  if (btnTestAvatar) {
    btnTestAvatar.addEventListener('click', () => {
      triggerAvatarReaction('스텔라 스튜디오 캐릭터 리액션 작동 확인 완료! ✨');
    });
  }

  if (btnTestRoulette) {
    btnTestRoulette.addEventListener('click', () => {
      spinRoulette();
    });
  }

  if (btnTestChat) {
    btnTestChat.addEventListener('click', () => {
      const u = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      addChatMessage(u.name, msg, u.badge, u.badgeText, u.color);
    });
  }

  if (btnToggleLayoutEdit) {
    btnToggleLayoutEdit.addEventListener('click', () => {
      toggleLayoutEditing();
    });
  }

  if (btnResetLayout) {
    btnResetLayout.addEventListener('click', () => {
      resetWidgetLayout();
    });
  }

  if (btnSaveLayout) {
    btnSaveLayout.addEventListener('click', () => {
      toggleLayoutEditing(false);
    });
  }

  if (widgetSelect) {
    widgetSelect.addEventListener('change', (e) => {
      applyWidgetFilter(e.target.value);
    });
  }

  if (btnCopyObsUrl) {
    btnCopyObsUrl.addEventListener('click', () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('hideToolbar', 'true');
      navigator.clipboard.writeText(currentUrl.toString()).then(() => {
        const orig = btnCopyObsUrl.innerHTML;
        btnCopyObsUrl.innerHTML = '✅ URL 복사 완료!';
        setTimeout(() => { btnCopyObsUrl.innerHTML = orig; }, 2000);
      });
    });
  }

  if (btnHideToolbar && toolbar) {
    btnHideToolbar.addEventListener('click', () => {
      toolbar.classList.add('toolbar-hidden');
      if (toolbarTab) toolbarTab.style.display = 'block';
    });
  }

  if (toolbarTab && toolbar) {
    toolbarTab.addEventListener('click', () => {
      toolbar.classList.remove('toolbar-hidden');
      toolbarTab.style.display = 'none';
    });
  }

  // 10. Auto Demo Chat Ticker (Runs simulation for testing)
  let tickerIdx = 0;
  setInterval(() => {
    if (!widgetChat?.classList.contains('widget-hidden')) {
      const u = sampleUsers[tickerIdx % sampleUsers.length];
      const m = sampleMessages[tickerIdx % sampleMessages.length];
      addChatMessage(u.name, m, u.badge, u.badgeText, u.color);
      tickerIdx++;
    }
  }, 4800);

  // Initial welcome chats
  setTimeout(() => {
    addChatMessage('치지직고수', '스텔라 스튜디오 OBS 오버레이 연결 성공! 💜', 'vip', 'VIP', 'color-gold');
  }, 500);
  setTimeout(() => {
    addChatMessage('초승달팬클럽', '투명 브라우저 소스 설정 완료되었습니다 ✨', 'sub', '구독', 'color-chzzk');
  }, 1800);

})();

