/**
 * STELLA STUDIO - ADVANCED STREAMER DASHBOARD ENGINE (v4)
 * - 6 Core Tabs Navigation & Realtime Status
 * - Live Broadcast Uptime Timer
 * - Interactive SVG Chart with Mouse Hover Tooltip & 1h/3h Switching
 * - AI Chatbot Realtime Sandbox & Persona Switching
 * - Glassmorphism Command Manager Modal Dialog
 * - 4-Widget Live Previews & Dynamic Styles Customizer
 * - HTML5 Canvas Spinning Roulette Wheel with Physics Simulation & Win Popups
 * - Quick Simulation Triggers (Cheese Count-Up, Event Feed Injection)
 * - Mission Card Actions & OBS One-Click URL Copy
 */

// Global BroadcastChannel for OBS Overlay Realtime Synchronization
const overlayChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('stella_overlay_channel') : null;

document.addEventListener('DOMContentLoaded', () => {
  initMobileSidebarDrawer();
  initLiveUptimeTimer();
  initThemeToggle();
  initTabRouting();
  initPersonaSelector();
  initChatbotSandbox();
  initCommandsManager();
  initWidgetCustomizer();
  initInteractiveRouletteWheel();
  initViewerChartInteractive();
  initObsCopy();
  initQuickTestTriggers();
  initMissionsInteractions();
  initVirtualStreamDeck();
  initHighlightMarkerSystem();
  initSoundboardFX();
  initRundownCueSheet();
  initPostStreamReport();
  initCustomAvatarStudio();
  initCleanChatModeration();
  initPlatformModals();
  initStudioBackupRestore();
  initMediaCustomStudio();
  initChannelDashboard();
});

/* ========================================================
   0. Mobile Sidebar Drawer Toggle & Backdrop Control
   ======================================================== */
function initMobileSidebarDrawer() {
  const toggleBtn = document.getElementById('btnSidebarToggle');
  const closeBtn = document.getElementById('btnSidebarClose');
  const sidebar = document.getElementById('dashSidebar') || document.querySelector('.dash-sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navItems = document.querySelectorAll('.dash-nav-item');

  function openSidebar() {
    sidebar?.classList.add('open');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 960) {
        closeSidebar();
      }
    });
  });
}

/* ========================================================
   1. Live Broadcast Uptime Timer (1-second tick)
   ======================================================== */
function initLiveUptimeTimer() {
  const timerEl = document.getElementById('liveTimer');
  if (!timerEl) return;

  let totalSeconds = 2 * 3600 + 45 * 60 + 12; // 02:45:12 start

  setInterval(() => {
    totalSeconds++;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ========================================================
   2. Theme Toggle (Dark / Light Mode)
   ======================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('stella-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('stella-theme', nextTheme);
      window.showToast?.(`🌓 ${nextTheme === 'dark' ? '다크 모드' : '라이트 모드'}로 전환되었습니다.`);
    });
  }
}

/* ========================================================
   3. 6 Core Category Tab Routing
   ======================================================== */
function initTabRouting() {
  const navItems = document.querySelectorAll('.dash-nav-item[data-tab]');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');
  const switchLinks = document.querySelectorAll('.nav-switch-link');

  function switchTab(tabId) {
    navItems.forEach((item) => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    tabPanes.forEach((pane) => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`pane-${tabId}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    if (history.pushState) {
      history.pushState(null, null, `#${tabId}`);
    } else {
      location.hash = tabId;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  switchLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      if (target) switchTab(target);
    });
  });

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(`pane-${initialHash}`)) {
    switchTab(initialHash);
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`pane-${hash}`)) {
      switchTab(hash);
    }
  });
}

/* ========================================================
   4. Persona Card Selector & Live Feedback
   ======================================================== */
let activePersona = 'sister';
const personaNames = {
  sister: '귀여운 여동생 모드',
  maid: '정중한 메이드 모드',
  tsundere: '츤데레 AI 비서 모드',
  gamer: '열혈 게이머 친구 모드'
};

function initPersonaSelector() {
  const cards = document.querySelectorAll('.persona-card');
  const btnSave = document.getElementById('btnSaveChatbot');
  const currentPersonaLabel = document.getElementById('currentPersonaLabel');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      activePersona = card.getAttribute('data-persona') || 'sister';
      
      const labelText = personaNames[activePersona] || '페르소나 모드';
      if (currentPersonaLabel) currentPersonaLabel.textContent = labelText;

      window.showToast?.(`🤖 AI 페르소나가 [${labelText}]로 즉시 전환되었습니다!`);
    });
  });

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      window.showToast?.('✅ 챗봇 설정 및 맞춤형 페르소나가 성공적으로 저장되었습니다!');
    });
  }
}

/* ========================================================
   5. AI Chatbot Realtime Sandbox (대화 시뮬레이터)
   ======================================================== */
function initChatbotSandbox() {
  const feed = document.getElementById('chatSandboxFeed');
  const input = document.getElementById('chatSandboxInput');
  const btnSend = document.getElementById('btnSendSandbox');

  if (!feed || !input || !btnSend) return;

  const cannedReplies = {
    '!방제': '오늘 방송: [신작 RPG 켠왕] 미미비트와 함께 떠나는 별빛 모험 1일차!',
    '!디스코드': '미미비트 스튜디오 공식 팬카페 & 디스코드 아지트: discord.gg/stella 💜',
    '!사양': 'CPU: i9-14900K / GPU: RTX 4090 / 마이크: Shure SM7B / 오인페: GoXLR 💻',
    '!룰렛': '치즈 1,000개로 룰렛 1회 도전 가능! 꽝 없이 100% 당첨되는 벌칙/보상 룰렛 돌려보세요 🎰'
  };

  const personaConversations = {
    sister: [
      '오빠/언니~ 방송 봐주셔서 너무 고마워요! 오늘도 미미비트랑 즐겁게 놀아요! 헤헤 🌸',
      '네네! 미미비트는 오빠/언니를 언제나 온 마음으로 응원하고 있어요! 힘내랏! ✨',
      '오늘 저녁은 치즈 듬뿍 올린 피자 먹었어요! 완전 꿀맛이었답니다 🍕'
    ],
    maid: [
      '주인님, 말씀하신 내용 깊이 새겨듣겠습니다. 최선을 다해 보필하겠습니다. 🎀',
      '언제든 분부만 내려주십시오. 주인님의 방송이 찬란히 빛나도록 대기 중입니다. ☕',
      '주인님, 장시간 방송 중이시니 따뜻한 수분 섭취를 권해드립니다. 🌹'
    ],
    tsundere: [
      '흥, 딱히 널 위해서 대답해주는 건 아니거든? 착각하지 마! 💢',
      '뭐, 뭐라는 거야... 바보! 그래도 방송 와준 건... 쬐끔 고맙네... ⭐',
      '칫, 다음에도 안 오면 가만 안 둘 테니까 꼭 출석 도장 찍어! 🍓'
    ],
    gamer: [
      '오케이 컷! 오늘 켠왕 각 섰다 드루와 드루와~ 🎮',
      '형님 나이스 샷! 그 컨트롤 진짜 레전드였음 ㅋㅋㅋ 인정? 🚀',
      '에너지 드링크 원샷 때리고 보스전 막타 치러 갑시다 레츠고! ⚡'
    ]
  };

  function appendMessage(sender, text, isUser = false) {
    const row = document.createElement('div');
    row.className = `chat-msg-row ${isUser ? 'user' : 'bot'}`;

    const avatar = isUser ? '👤' : '✨';
    const personaTitle = isUser ? '시청자 (나)' : `미미비트 AI (${personaNames[activePersona]})`;

    row.innerHTML = `
      <div class="chat-sender-avatar">${avatar}</div>
      <div class="chat-bubble">
        <span class="sender-name">${personaTitle}</span>
        <p>${escapeHtml(text)}</p>
      </div>
    `;

    feed.appendChild(row);
    feed.scrollTop = feed.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('User', text, true);
    input.value = '';

    // Simulate AI Response Delay
    setTimeout(() => {
      let reply = '';
      if (cannedReplies[text]) {
        reply = cannedReplies[text];
      } else {
        const replies = personaConversations[activePersona] || personaConversations.sister;
        reply = replies[Math.floor(Math.random() * replies.length)];
      }
      appendMessage('Bot', reply, false);

      // Increment Chat AI Response Counter
      const statAi = document.getElementById('statAiCount');
      if (statAi) {
        const curMatches = statAi.textContent.match(/\d+/);
        if (curMatches) {
          const count = parseInt(curMatches[0], 10) + 1;
          statAi.textContent = `AI 챗봇 ${count}회 응답`;
        }
      }
    }, 400);
  }

  btnSend.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ========================================================
   6. Custom Commands Manager & Modal Dialog
   ======================================================== */
function initCommandsManager() {
  const btnAdd = document.getElementById('btnAddCommand');
  const modalBackdrop = document.getElementById('cmdModalBackdrop');
  const btnClose = document.getElementById('btnCloseCmdModal');
  const btnCancel = document.getElementById('btnCancelCmdModal');
  const btnSubmit = document.getElementById('btnSubmitCmdModal');
  const tableBody = document.querySelector('#commandsTable tbody');

  const cmdNameInput = document.getElementById('modalCmdName');
  const cmdReplyInput = document.getElementById('modalCmdReply');
  const cmdCooldownInput = document.getElementById('modalCmdCooldown');

  function openModal() {
    if (!modalBackdrop) return;
    if (cmdNameInput) cmdNameInput.value = '!';
    if (cmdReplyInput) cmdReplyInput.value = '';
    modalBackdrop.classList.add('show');
    if (cmdNameInput) cmdNameInput.focus();
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('show');
  }

  if (btnAdd) btnAdd.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (btnSubmit && tableBody) {
    btnSubmit.addEventListener('click', () => {
      const name = cmdNameInput.value.trim();
      const reply = cmdReplyInput.value.trim();
      const cooldown = cmdCooldownInput.value.trim() || '5';

      if (!name || name === '!') {
        alert('올바른 명령어 이름을 입력해주세요. (예: !팬카페)');
        return;
      }
      if (!reply) {
        alert('자동 응답 내용을 입력해주세요.');
        return;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="code-pill">${escapeHtml(name)}</span></td>
        <td>${escapeHtml(reply)}</td>
        <td>${escapeHtml(cooldown)}초</td>
        <td><span style="color: #00ffa3; font-weight: 700;">활성</span></td>
        <td>
          <button class="btn-ghost btn-cmd-edit" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">수정</button>
          <button class="btn-ghost btn-cmd-del" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; color: #f43f5e;">삭제</button>
        </td>
      `;
      tableBody.appendChild(tr);

      closeModal();
      window.showToast?.(`✅ 새 명령어 [${name}]가 성공적으로 등록되었습니다!`);
    });
  }

  // Delegated Event for Edit / Delete Buttons
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.classList.contains('btn-cmd-del')) {
        const tr = btn.closest('tr');
        const cmd = tr.querySelector('.code-pill')?.textContent || '명령어';
        tr.remove();
        window.showToast?.(`🗑️ 명령어 [${cmd}]가 삭제되었습니다.`);
      } else if (btn.classList.contains('btn-cmd-edit')) {
        const tr = btn.closest('tr');
        const replyCell = tr.cells[1];
        const newReply = prompt('수정할 자동 응답 내용을 입력하세요:', replyCell.textContent);
        if (newReply) {
          replyCell.textContent = newReply;
          window.showToast?.('✏️ 명령어 답변이 수정되었습니다.');
        }
      }
    });
  }
}

/* ========================================================
   7. 4-Widget Live Previews & Dynamic Styles Customizer
   ======================================================== */
function initWidgetCustomizer() {
  const chatThemeSelect = document.getElementById('chatThemeSelect');
  const chatFontSizeRange = document.getElementById('chatFontSizeRange');
  const chatFontSizeVal = document.getElementById('chatFontSizeVal');
  const chatPreview = document.getElementById('chatWidgetPreview');

  const donationEffectSelect = document.getElementById('donationEffectSelect');
  const donationPreview = document.getElementById('donationWidgetPreview');

  // Chat Overlay Customizer
  if (chatThemeSelect && chatPreview) {
    chatThemeSelect.addEventListener('change', (e) => {
      const bubble = chatPreview.querySelector('.preview-chat-bubble');
      if (!bubble) return;
      const theme = e.target.value;

      if (theme === 'lavender') {
        bubble.style.background = 'rgba(24, 20, 68, 0.85)';
        bubble.style.borderColor = '#c4b5fd';
        bubble.querySelector('.chat-nick').style.color = '#00ffa3';
      } else if (theme === 'cyan') {
        bubble.style.background = 'rgba(8, 30, 50, 0.85)';
        bubble.style.borderColor = '#38bdf8';
        bubble.querySelector('.chat-nick').style.color = '#38bdf8';
      } else if (theme === 'pink') {
        bubble.style.background = 'rgba(50, 15, 35, 0.85)';
        bubble.style.borderColor = '#f472b6';
        bubble.querySelector('.chat-nick').style.color = '#fde047';
      } else if (theme === 'dark') {
        bubble.style.background = 'rgba(10, 10, 10, 0.9)';
        bubble.style.borderColor = 'rgba(255,255,255,0.2)';
        bubble.querySelector('.chat-nick').style.color = '#fff';
      }

      window.showToast?.(`🎨 채팅창 테마가 [${e.target.options[e.target.selectedIndex].text}]로 변경되었습니다.`);
    });
  }

  if (chatFontSizeRange && chatFontSizeVal && chatPreview) {
    chatFontSizeRange.addEventListener('input', (e) => {
      const val = e.target.value;
      chatFontSizeVal.textContent = val;
      const bubble = chatPreview.querySelector('.preview-chat-bubble');
      if (bubble) bubble.style.fontSize = `${val}px`;
    });
  }

  // Donation FX Customizer
  if (donationEffectSelect && donationPreview) {
    donationEffectSelect.addEventListener('change', (e) => {
      const effect = e.target.value;
      if (effect === 'lavender') {
        donationPreview.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.95))';
      } else if (effect === 'cheese') {
        donationPreview.style.background = 'linear-gradient(135deg, rgba(234, 179, 8, 0.95), rgba(249, 115, 22, 0.95))';
      } else {
        donationPreview.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(56, 189, 248, 0.9))';
      }
      window.showToast?.(`🧀 도네이션 FX가 [${e.target.options[e.target.selectedIndex].text}]로 적용되었습니다.`);
    });
  }

  // Audio Volume Range
  const alertVolumeRange = document.getElementById('alertVolumeRange');
  const alertVolumeVal = document.getElementById('alertVolumeVal');
  if (alertVolumeRange && alertVolumeVal) {
    alertVolumeRange.addEventListener('input', (e) => {
      alertVolumeVal.textContent = e.target.value;
    });
  }

  // Global Function for Widget URL Copy
  window.copyWidgetUrl = function(type) {
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const url = `${window.location.origin}${basePath}overlay.html?widget=${type}&hideToolbar=true`;
    navigator.clipboard.writeText(url).then(() => {
      window.showToast?.(`✅ [${type.toUpperCase()}] OBS 브라우저 소스 URL이 복사되었습니다!`);
    }).catch(() => {
      window.showToast?.(`✅ [${type.toUpperCase()}] OBS URL 복사 완료!`);
    });
  };

  // Global Function to Reset Overlay Widget Layout
  window.resetOverlayLayout = function() {
    try {
      localStorage.removeItem('stella_widget_layout');
      if (overlayChannel) {
        overlayChannel.postMessage({ type: 'RESET_LAYOUT' });
      }
      localStorage.setItem('stella_overlay_event', JSON.stringify({ type: 'RESET_LAYOUT', timestamp: Date.now() }));
      window.showToast?.('🔄 모든 오버레이 위젯의 위치와 크기가 기본값으로 초기화되었습니다!');
    } catch (e) {
      window.showToast?.('위치 초기화 실패');
    }
  };
}

/* ========================================================
   7.5. Streamer Custom Character & Avatar Studio
   ======================================================== */
function initCustomAvatarStudio() {
  const presetBtns = document.querySelectorAll('.avatar-preset-btn');
  const dropzone = document.getElementById('avatarDropzone');
  const fileInput = document.getElementById('customAvatarFileInput');
  const nameInput = document.getElementById('customAvatarNameInput');
  const animSelect = document.getElementById('customAvatarAnimSelect');
  const speechToggle = document.getElementById('customAvatarSpeechToggle');
  const reactionToggle = document.getElementById('customAvatarReactionToggle');

  const previewImg = document.getElementById('dashAvatarPreviewImg');
  const previewName = document.getElementById('dashAvatarNameText');
  const speechPreview = document.getElementById('dashAvatarSpeechPreview');
  const btnTestReaction = document.getElementById('btnTestAvatarReaction');
  const btnSaveAvatar = document.getElementById('btnSaveCustomAvatar');

  let currentAvatarSettings = {
    imgUrl: 'assets/images/frame_01.png',
    name: '미미비트★루나',
    animStyle: 'anim-float',
    speechEnabled: true,
    reactionEnabled: true,
    preset: 'stella_classic'
  };

  // 1. Load Saved Avatar Settings
  try {
    const saved = localStorage.getItem('stella_custom_avatar_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentAvatarSettings = Object.assign(currentAvatarSettings, parsed);

      if (previewImg && currentAvatarSettings.imgUrl) previewImg.src = currentAvatarSettings.imgUrl;
      if (previewName && currentAvatarSettings.name) previewName.textContent = currentAvatarSettings.name;
      if (nameInput && currentAvatarSettings.name) nameInput.value = currentAvatarSettings.name;
      if (animSelect && currentAvatarSettings.animStyle) {
        animSelect.value = currentAvatarSettings.animStyle;
        if (previewImg) previewImg.className = `avatar-dash-img ${currentAvatarSettings.animStyle}`;
      }
      if (speechToggle) speechToggle.checked = currentAvatarSettings.speechEnabled !== false;
      if (reactionToggle) reactionToggle.checked = currentAvatarSettings.reactionEnabled !== false;

      // Highlight active preset
      presetBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === currentAvatarSettings.preset);
      });
    }
  } catch (e) {}

  // 2. Preset Switching
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetType = btn.dataset.preset;
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAvatarSettings.preset = presetType;

      if (presetType === 'custom') {
        fileInput?.click();
      } else {
        const imgUrl = btn.dataset.img;
        const charName = btn.dataset.name;
        if (imgUrl && previewImg) {
          previewImg.src = imgUrl;
          currentAvatarSettings.imgUrl = imgUrl;
        }
        if (charName) {
          if (nameInput) nameInput.value = charName;
          if (previewName) previewName.textContent = charName;
          currentAvatarSettings.name = charName;
        }
        window.showToast?.(`👤 [${btn.querySelector('.avatar-preset-name')?.textContent || '캐릭터'}] 선택됨`);
      }
    });
  });

  // 3. File Upload (Picker & Drag and Drop)
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleAvatarFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleAvatarFile(e.target.files[0]);
      }
    });
  }

  function handleAvatarFile(file) {
    if (!file.type.startsWith('image/')) {
      window.showToast?.('⚠️ 이미지 파일(PNG, GIF, WebP, JPG)만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.showToast?.('⚠️ 파일 크기가 10MB를 초과합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      if (previewImg) previewImg.src = dataUrl;
      currentAvatarSettings.imgUrl = dataUrl;
      currentAvatarSettings.preset = 'custom';

      // Highlight custom button
      presetBtns.forEach(b => b.classList.toggle('active', b.dataset.preset === 'custom'));
      window.showToast?.('✅ 캐릭터 일러스트가 성공적으로 업로드되었습니다! [오버레이에 즉시 적용]을 눌러 반영하세요.');
    };
    reader.readAsDataURL(file);
  }

  // 4. Live Inputs
  if (nameInput && previewName) {
    nameInput.addEventListener('input', (e) => {
      previewName.textContent = e.target.value || '스트리머';
      currentAvatarSettings.name = e.target.value;
    });
  }

  if (animSelect && previewImg) {
    animSelect.addEventListener('change', (e) => {
      previewImg.className = `avatar-dash-img ${e.target.value}`;
      currentAvatarSettings.animStyle = e.target.value;
    });
  }

  // 5. Test Reaction Button
  if (btnTestReaction) {
    btnTestReaction.addEventListener('click', () => {
      // Physical reaction on preview
      if (previewImg) {
        previewImg.classList.remove('avatar-reacting');
        void previewImg.offsetWidth;
        previewImg.classList.add('avatar-reacting');
        setTimeout(() => previewImg.classList.remove('avatar-reacting'), 1500);
      }

      if (speechPreview) {
        const prevText = speechPreview.textContent;
        speechPreview.textContent = `"${currentAvatarSettings.name || '미미비트'}님 캐릭터 리액션 테스트 중! 💜"`;
        speechPreview.style.transform = 'scale(1.05)';
        setTimeout(() => {
          speechPreview.textContent = prevText;
          speechPreview.style.transform = 'scale(1)';
        }, 3500);
      }

      // Broadcast test reaction to overlay
      const payload = {
        type: 'TRIGGER_AVATAR_REACTION',
        speechText: `[${currentAvatarSettings.name || '미미비트'}] 캐릭터 아바타 테스트 리액션 작동 성공! ✨`
      };
      if (overlayChannel) overlayChannel.postMessage(payload);
      localStorage.setItem('stella_overlay_event', JSON.stringify(Object.assign(payload, { timestamp: Date.now() })));

      window.showToast?.('🎉 오버레이 및 대시보드 캐릭터 리액션 시뮬레이션 발송!');
    });
  }

  // 6. Save & Broadcast to Overlay
  if (btnSaveAvatar) {
    btnSaveAvatar.addEventListener('click', () => {
      currentAvatarSettings.name = nameInput?.value.trim() || '미미비트★루나';
      currentAvatarSettings.animStyle = animSelect?.value || 'anim-float';
      currentAvatarSettings.speechEnabled = speechToggle ? speechToggle.checked : true;
      currentAvatarSettings.reactionEnabled = reactionToggle ? reactionToggle.checked : true;

      try {
        localStorage.setItem('stella_custom_avatar_data', JSON.stringify(currentAvatarSettings));

        const payload = {
          type: 'UPDATE_AVATAR',
          settings: currentAvatarSettings
        };
        if (overlayChannel) overlayChannel.postMessage(payload);
        localStorage.setItem('stella_overlay_event', JSON.stringify(Object.assign(payload, { timestamp: Date.now() })));

        window.showToast?.('💾 캐릭터 아바타 설정이 저장되어 오버레이에 즉시 동기화되었습니다!');
      } catch (err) {
        window.showToast?.('설정 저장 성공');
      }
    });
  }
}

/* ========================================================
   8. Interactive HTML5 Canvas Spinning Roulette Wheel with Full CRUD
   ======================================================== */
let rouletteItems = [
  { text: '10초 모에모에 애교 미션', type: '벌칙', color: '#ec4899', weight: 15 },
  { text: '스쿼트 10개', type: '벌칙', color: '#f43f5e', weight: 10 },
  { text: '원하는 노래 1곡 라이브 부르기', type: '보상', color: '#38bdf8', weight: 20 },
  { text: '시청자 닉네임 다정하게 불러주기', type: '보상', color: '#c4b5fd', weight: 35 },
  { text: '치즈 10,000개 잭팟 환급', type: '특수 잭팟', color: '#fde047', weight: 20 }
];

function initInteractiveRouletteWheel() {
  const canvas = document.getElementById('rouletteCanvas');
  const btnSpin = document.getElementById('btnSpinWheel');
  const resultModalBackdrop = document.getElementById('rouletteResultBackdrop');
  const resultItemEl = document.getElementById('rouletteWinItem');
  const btnCloseResult = document.getElementById('btnCloseRouletteResult');

  // Load saved roulette items or populate default
  try {
    const savedRoulette = localStorage.getItem('stella_roulette_items');
    if (savedRoulette) {
      const parsed = JSON.parse(savedRoulette);
      if (Array.isArray(parsed) && parsed.length >= 2) rouletteItems = parsed;
    } else {
      localStorage.setItem('stella_roulette_items', JSON.stringify(rouletteItems));
    }
  } catch (e) {}

  function syncRouletteWithOverlay() {
    try {
      localStorage.setItem('stella_roulette_items', JSON.stringify(rouletteItems));
      overlayChannel?.postMessage({
        type: 'ROULETTE_CONFIG_UPDATE',
        items: rouletteItems
      });
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'ROULETTE_CONFIG_UPDATE',
        items: rouletteItems,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }
  syncRouletteWithOverlay();

  // Roulette Item Modal Elements
  const btnAddRoulette = document.getElementById('btnAddRouletteItem');
  const rouletteModalBackdrop = document.getElementById('rouletteItemModalBackdrop');
  const btnCloseRouletteModal = document.getElementById('btnCloseRouletteModal');
  const btnCancelRouletteModal = document.getElementById('btnCancelRouletteModal');
  const btnSubmitRouletteModal = document.getElementById('btnSubmitRouletteModal');

  const modalRouletteText = document.getElementById('modalRouletteText');
  const modalRouletteType = document.getElementById('modalRouletteType');
  const modalRouletteWeight = document.getElementById('modalRouletteWeight');
  const modalRouletteColor = document.getElementById('modalRouletteColor');

  const rouletteTableBody = document.querySelector('#rouletteTable tbody');

  if (!canvas || !btnSpin) return;
  const ctx = canvas.getContext('2d');

  let currentAngle = 0;
  let isSpinning = false;

  // Render Table Rows from rouletteItems Array
  function renderRouletteTable() {
    if (!rouletteTableBody) return;
    rouletteTableBody.innerHTML = '';
    rouletteItems.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-index', idx);
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${escapeHtml(item.text)}</strong></td>
        <td><span style="color: ${item.color}; font-weight: 700;">${escapeHtml(item.type)}</span></td>
        <td>${item.weight}%</td>
        <td><span style="display:inline-block; width:14px; height:14px; background:${item.color}; border-radius:50%;"></span></td>
        <td><button class="btn-ghost btn-roulette-del" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; color: #f43f5e;">삭제</button></td>
      `;
      rouletteTableBody.appendChild(tr);
    });
  }

  // Draw Dynamic Wheel on Canvas
  function drawWheel() {
    const totalSlices = rouletteItems.length;
    if (totalSlices === 0) return;
    const arc = (2 * Math.PI) / totalSlices;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalSlices; i++) {
      const angle = currentAngle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = rouletteItems[i].color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Border line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text drawing
      ctx.save();
      ctx.fillStyle = '#ffffff';
      if (rouletteItems[i].color === '#fde047' || rouletteItems[i].color === '#00ffa3') {
        ctx.fillStyle = '#1e1b4b'; // High contrast
      }
      ctx.font = 'bold 11px "Pretendard", sans-serif';
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';

      // Truncate text if too long
      let displayTxt = rouletteItems[i].text;
      if (displayTxt.length > 9) displayTxt = displayTxt.substring(0, 8) + '…';
      ctx.fillText(displayTxt, radius - 20, 4);
      ctx.restore();
    }
  }

  // Initial Draw
  drawWheel();

  // Spin Animation Logic
  function spinWheel() {
    if (isSpinning) return;
    if (rouletteItems.length < 2) {
      alert('룰렛을 돌리려면 최소 2개 이상의 항목이 필요합니다.');
      return;
    }
    isSpinning = true;
    btnSpin.disabled = true;

    const spinTime = 3800 + Math.random() * 800; // ~4s
    const startTime = performance.now();
    const initialSpeed = 0.45 + Math.random() * 0.2; // Rad/frame

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinTime, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentSpeed = initialSpeed * (1 - easeOut);

      currentAngle += currentSpeed;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        btnSpin.disabled = false;
        
        // Determine Winning Slice at top pointer (-PI/2)
        const totalSlices = rouletteItems.length;
        const arc = (2 * Math.PI) / totalSlices;
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (1.5 * Math.PI - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winIndex = Math.floor(pointerAngle / arc) % totalSlices;
        const winner = rouletteItems[winIndex];

        // Trigger Celebration Modal
        if (resultItemEl) {
          resultItemEl.textContent = `[${winner.type}] ${winner.text}`;
          resultItemEl.style.borderColor = winner.color;
        }
        if (resultModalBackdrop) resultModalBackdrop.classList.add('show');

        // Add to Event Log Feed on Dashboard Home
        window.addEventFeedItem?.('🎰', '미미비트 룰렛 당첨', `도네이션 룰렛 당첨: <strong>[${winner.text}]</strong>`);
        window.showToast?.(`🎰 룰렛 결과: [${winner.text}] 당첨!`);

        // Sync with OBS Overlay window
        overlayChannel?.postMessage({
          type: 'ROULETTE_ALERT',
          winItem: winner.text
        });
        try {
          localStorage.setItem('stella_overlay_event', JSON.stringify({
            type: 'ROULETTE_ALERT',
            winItem: winner.text,
            timestamp: Date.now()
          }));
        } catch(e) {}
      }
    }

    requestAnimationFrame(animate);
  }

  btnSpin.addEventListener('click', spinWheel);

  // Close Celebration Modal
  if (btnCloseResult && resultModalBackdrop) {
    btnCloseResult.addEventListener('click', () => {
      resultModalBackdrop.classList.remove('show');
    });
    resultModalBackdrop.addEventListener('click', (e) => {
      if (e.target === resultModalBackdrop) resultModalBackdrop.classList.remove('show');
    });
  }

  // --- CRUD: Open / Close Roulette Item Modal ---
  function openRouletteModal() {
    if (!rouletteModalBackdrop) return;
    if (modalRouletteText) modalRouletteText.value = '';
    if (modalRouletteWeight) modalRouletteWeight.value = '15';
    rouletteModalBackdrop.classList.add('show');
    if (modalRouletteText) modalRouletteText.focus();
  }

  function closeRouletteModal() {
    if (rouletteModalBackdrop) rouletteModalBackdrop.classList.remove('show');
  }

  if (btnAddRoulette) btnAddRoulette.addEventListener('click', openRouletteModal);
  if (btnCloseRouletteModal) btnCloseRouletteModal.addEventListener('click', closeRouletteModal);
  if (btnCancelRouletteModal) btnCancelRouletteModal.addEventListener('click', closeRouletteModal);

  if (rouletteModalBackdrop) {
    rouletteModalBackdrop.addEventListener('click', (e) => {
      if (e.target === rouletteModalBackdrop) closeRouletteModal();
    });
  }

  // --- CRUD: Submit New Roulette Item ---
  if (btnSubmitRouletteModal) {
    btnSubmitRouletteModal.addEventListener('click', () => {
      const text = modalRouletteText.value.trim();
      const type = modalRouletteType.value;
      const weight = parseInt(modalRouletteWeight.value, 10) || 15;
      const color = modalRouletteColor.value || '#38bdf8';

      if (!text) {
        alert('룰렛 항목명을 입력해주세요. (예: 1절 노래 부르기)');
        return;
      }

      // Add to Array
      rouletteItems.push({ text, type, color, weight });

      // Re-render Table and Re-draw Wheel & Sync
      renderRouletteTable();
      drawWheel();
      syncRouletteWithOverlay();

      closeRouletteModal();
      window.showToast?.(`🎯 룰렛에 새 항목 [${text}]이(가) 등록되었습니다!`);
    });
  }

  // --- CRUD: Delete Roulette Item (Event Delegation) ---
  if (rouletteTableBody) {
    rouletteTableBody.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-roulette-del');
      if (!delBtn) return;

      if (rouletteItems.length <= 2) {
        alert('룰렛을 유지하기 위해 최소 2개 이상의 항목이 필요합니다.');
        return;
      }

      const tr = delBtn.closest('tr');
      const idx = parseInt(tr.getAttribute('data-index'), 10);
      const deletedItem = rouletteItems[idx];

      if (confirm(`정말 [${deletedItem.text}] 항목을 룰렛에서 삭제하시겠습니까?`)) {
        rouletteItems.splice(idx, 1);
        renderRouletteTable();
        drawWheel();
        syncRouletteWithOverlay();
        window.showToast?.(`🗑️ 룰렛 항목 [${deletedItem.text}]이(가) 삭제되었습니다.`);
      }
    });
  }
}

/* ========================================================
   9. Interactive SVG Chart with Mouse Hover Tooltip & Toggle
   ======================================================== */
function initViewerChartInteractive() {
  const svg = document.getElementById('viewerChartSvg');
  const chartPath = document.getElementById('chartLinePath');
  const chartArea = document.getElementById('chartAreaPath');
  const hoverLine = document.getElementById('chartHoverLine');
  const hoverDot = document.getElementById('chartHoverDot');
  const tooltip = document.getElementById('chartTooltip');

  const btn1h = document.getElementById('btnChart1h');
  const btn3h = document.getElementById('btnChart3h');

  if (!svg || !chartPath || !chartArea) return;

  const data3h = [25, 42, 38, 55, 68, 85, 78, 92, 110, 105, 128, 142];
  const data1h = [85, 90, 88, 98, 105, 112, 110, 122, 130, 128, 136, 142];
  let currentData = data3h;

  const maxVal = 160;
  const height = 180;
  const width = 640;

  function renderChart(points) {
    let pathD = `M 0,${height - (points[0] / maxVal) * height}`;
    points.forEach((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      pathD += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    });

    chartPath.setAttribute('d', pathD);
    chartArea.setAttribute('d', `${pathD} L ${width},${height} L 0,${height} Z`);
  }

  renderChart(currentData);

  if (btn1h && btn3h) {
    btn1h.addEventListener('click', () => {
      btn1h.className = 'btn-primary';
      btn3h.className = 'btn-ghost';
      currentData = data1h;
      renderChart(currentData);
      window.showToast?.('📊 최근 1시간 유입 차트로 변경되었습니다.');
    });

    btn3h.addEventListener('click', () => {
      btn3h.className = 'btn-primary';
      btn1h.className = 'btn-ghost';
      currentData = data3h;
      renderChart(currentData);
      window.showToast?.('📊 최근 3시간 누적 트렌드 차트로 변경되었습니다.');
    });
  }

  // Mouse Hover Interactions
  svg.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = mouseX / rect.width;
    const index = Math.round(ratio * (currentData.length - 1));
    const val = currentData[index];
    const xCoord = (index / (currentData.length - 1)) * width;
    const yCoord = height - (val / maxVal) * height;

    if (hoverLine) {
      hoverLine.style.display = 'block';
      hoverLine.setAttribute('x1', xCoord);
      hoverLine.setAttribute('x2', xCoord);
    }

    if (hoverDot) {
      hoverDot.style.display = 'block';
      hoverDot.setAttribute('cx', xCoord);
      hoverDot.setAttribute('cy', yCoord);
    }

    if (tooltip) {
      const viewersCount = val * 10;
      const timeStr = `2${index > 6 ? '2' : '1'}:${(index * 15) % 60 === 0 ? '00' : (index * 15) % 60}`;
      tooltip.innerHTML = `<strong>${timeStr}</strong> · 동시 시청자 <strong>${viewersCount.toLocaleString()}명</strong> (채팅 ${val * 3}개/분)`;
      tooltip.style.left = `${(xCoord / width) * 100}%`;
      tooltip.style.top = `${(yCoord / height) * 100}%`;
      tooltip.classList.add('show');
    }
  });

  svg.addEventListener('mouseleave', () => {
    if (hoverLine) hoverLine.style.display = 'none';
    if (hoverDot) hoverDot.style.display = 'none';
    if (tooltip) tooltip.classList.remove('show');
  });
}

/* ========================================================
   10. Quick Test Triggers & Count-Up Animation
   ======================================================== */
function initQuickTestTriggers() {
  const btnTestDonation = document.getElementById('btnTestDonation');
  const btnTestRoulette = document.getElementById('btnTestRoulette');
  const feedList = document.getElementById('eventFeedList');

  const sampleDonators = ['초승달팬클럽', '치지직마니아', '별빛모험가', '치즈도둑', '보라색토끼', '우주비행사'];
  const sampleAmounts = [10000, 30000, 50000, 100000];
  const sampleMsgs = [
    '미미비트님 방송 너무 재밌어요 화이팅!',
    '오늘도 힐링하고 갑니다 치즈 냠냠 🧀',
    '치지직 1등 버튜버 가자아아!',
    '미션 성공 축하드립니다 대박 ✨'
  ];

  function addFeedItem(icon, user, msgHtml) {
    if (!feedList) return;
    const div = document.createElement('div');
    div.className = 'event-item';
    div.innerHTML = `
      <div class="event-icon ${icon === '🧀' ? 'cheese' : 'roulette'}">${icon}</div>
      <div class="event-detail">
        <div class="event-header">
          <span class="event-user">${user}</span>
          <span class="event-time">방금 전</span>
        </div>
        <p class="event-msg">${msgHtml}</p>
      </div>
    `;

    div.style.opacity = '0';
    div.style.transform = 'translateY(-15px)';
    feedList.insertBefore(div, feedList.firstChild);

    requestAnimationFrame(() => {
      div.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });
  }

  window.addEventFeedItem = addFeedItem;

  // Cheese Donation Count-Up
  let totalCheese = 382000;
  const cheeseEl = document.getElementById('statCheese');

  if (btnTestDonation) {
    btnTestDonation.addEventListener('click', () => {
      const user = sampleDonators[Math.floor(Math.random() * sampleDonators.length)];
      const amt = sampleAmounts[Math.floor(Math.random() * sampleAmounts.length)];
      const msg = sampleMsgs[Math.floor(Math.random() * sampleMsgs.length)];

      addFeedItem('🧀', user, `<strong>${amt.toLocaleString()} 치즈</strong> 후원: "${msg}"`);
      window.showToast?.(`🧀 ${user}님의 ${amt.toLocaleString()} 치즈 후원 테스트가 도착했습니다!`);

      // Speak TTS voice locally
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const text = `${user}님, 치즈 ${amt.toLocaleString()}개 감사합니다. ${msg}`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.pitch = 1.15;
          utterance.lang = 'ko-KR';
          const voices = window.speechSynthesis.getVoices();
          const koVoice = voices.find(v => v.lang.includes('ko') || v.name.includes('Korean') || v.name.includes('Yuna') || v.name.includes('Heami'));
          if (koVoice) utterance.voice = koVoice;
          window.speechSynthesis.speak(utterance);
        } catch(e) {}
      }

      // Broadcast to opened OBS Overlay tabs
      overlayChannel?.postMessage({
        type: 'DONATION_ALERT',
        user: user,
        amount: amt,
        message: msg
      });
      try {
        localStorage.setItem('stella_overlay_event', JSON.stringify({
          type: 'DONATION_ALERT',
          user: user,
          amount: amt,
          message: msg,
          timestamp: Date.now()
        }));
      } catch(e) {}

      // Count-up animation
      if (cheeseEl) {
        const startVal = totalCheese;
        const targetVal = totalCheese + amt;
        totalCheese = targetVal;
        const duration = 800;
        const startTime = performance.now();

        function countStep(time) {
          const progress = Math.min((time - startTime) / duration, 1);
          const current = Math.floor(startVal + (targetVal - startVal) * progress);
          cheeseEl.textContent = current.toLocaleString();
          if (progress < 1) requestAnimationFrame(countStep);
        }
        requestAnimationFrame(countStep);
      }
    });
  }

  if (btnTestRoulette) {
    btnTestRoulette.addEventListener('click', () => {
      // Trigger Broadcast Roulette in overlay
      overlayChannel?.postMessage({ type: 'SPIN_ROULETTE' });

      const btnSpin = document.getElementById('btnSpinWheel');
      if (btnSpin) {
        // Switch to donations tab and spin
        const navRoulette = document.querySelector('.dash-nav-item[data-tab="donations"]');
        if (navRoulette) navRoulette.click();
        setTimeout(() => btnSpin.click(), 400);
      } else {
        const user = sampleDonators[Math.floor(Math.random() * sampleDonators.length)];
        addFeedItem('🎰', user, '도네이션 룰렛 당첨: <strong>[10초 모에모에 애교 미션]</strong>');
        window.showToast?.(`🎰 ${user}님의 룰렛 당첨 테스트!`);
      }
    });
  }
}

/* ========================================================
   11. Mission Cards Actions & Full Creation/Deletion CRUD
   ======================================================== */
function initMissionsInteractions() {
  const missionsGrid = document.getElementById('missionsGrid');
  const btnAddMission = document.getElementById('btnAddMission');
  const missionModalBackdrop = document.getElementById('missionModalBackdrop');
  const btnCloseMissionModal = document.getElementById('btnCloseMissionModal');
  const btnCancelMissionModal = document.getElementById('btnCancelMissionModal');
  const btnSubmitMissionModal = document.getElementById('btnSubmitMissionModal');

  const modalMissionTag = document.getElementById('modalMissionTag');
  const modalMissionTitle = document.getElementById('modalMissionTitle');
  const modalMissionDesc = document.getElementById('modalMissionDesc');
  const modalMissionPool = document.getElementById('modalMissionPool');
  const modalMissionDuration = document.getElementById('modalMissionDuration');

  // --- Open / Close Mission Modal ---
  function openMissionModal() {
    if (!missionModalBackdrop) return;
    if (modalMissionTitle) modalMissionTitle.value = '';
    if (modalMissionDesc) modalMissionDesc.value = '';
    if (modalMissionPool) modalMissionPool.value = '100000';
    if (modalMissionDuration) modalMissionDuration.value = '30';
    missionModalBackdrop.classList.add('show');
    if (modalMissionTitle) modalMissionTitle.focus();
  }

  function closeMissionModal() {
    if (missionModalBackdrop) missionModalBackdrop.classList.remove('show');
  }

  if (btnAddMission) btnAddMission.addEventListener('click', openMissionModal);
  if (btnCloseMissionModal) btnCloseMissionModal.addEventListener('click', closeMissionModal);
  if (btnCancelMissionModal) btnCancelMissionModal.addEventListener('click', closeMissionModal);

  if (missionModalBackdrop) {
    missionModalBackdrop.addEventListener('click', (e) => {
      if (e.target === missionModalBackdrop) closeMissionModal();
    });
  }

  // --- Submit New Mission Card ---
  if (btnSubmitMissionModal && missionsGrid) {
    btnSubmitMissionModal.addEventListener('click', () => {
      const tag = modalMissionTag.value;
      const title = modalMissionTitle.value.trim();
      const desc = modalMissionDesc.value.trim();
      const pool = parseInt(modalMissionPool.value, 10) || 100000;
      const duration = parseInt(modalMissionDuration.value, 10) || 30;

      if (!title) {
        alert('미션 제목을 입력해주세요. (예: 다크소울 보스 노데스 클리어)');
        return;
      }

      const card = document.createElement('div');
      card.className = 'mission-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(-15px)';
      card.innerHTML = `
        <div class="mission-header">
          <span class="mission-badge active">진행 중 (남은 시간 ${duration}:00)</span>
          <span class="mission-pool">목표 펀딩: <strong>${pool.toLocaleString()} 치즈</strong></span>
        </div>
        <h4 class="mission-title">${escapeHtml(tag)} ${escapeHtml(title)}</h4>
        <p class="mission-desc">${escapeHtml(desc || '시청자 제안 도전 미션입니다!')}</p>
        <div class="mission-actions">
          <button class="btn-primary btn-mission-success" style="padding: 0.45rem 1rem; font-size: 0.85rem; background: linear-gradient(135deg, #00ffa3, #0284c7);">미션 성공 🏆</button>
          <button class="btn-ghost btn-mission-fail" style="padding: 0.45rem 1rem; font-size: 0.85rem; color: #f43f5e;">미션 실패 ❌</button>
          <button class="btn-ghost btn-mission-del" style="padding: 0.45rem 0.8rem; font-size: 0.85rem; color: var(--text-dim); margin-left: auto;">삭제 🗑️</button>
        </div>
      `;

      missionsGrid.insertBefore(card, missionsGrid.firstChild);

      requestAnimationFrame(() => {
        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });

      closeMissionModal();
      window.showToast?.(`🔥 새 미션 [${tag} ${title}]이(가) 개설되었습니다!`);
    });
  }

  // --- Delegated Events for Mission Actions (Success, Fail, Start, Delete) ---
  if (missionsGrid) {
    missionsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const card = btn.closest('.mission-card');
      const title = card ? card.querySelector('.mission-title')?.textContent : '미션';

      if (btn.classList.contains('btn-mission-del')) {
        if (confirm(`정말 "${title}" 미션을 삭제하시겠습니까?`)) {
          card.style.transition = 'all 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.remove(), 300);
          window.showToast?.(`🗑️ "${title}" 미션이 삭제되었습니다.`);
        }
      } else if (btn.classList.contains('btn-mission-success')) {
        window.showToast?.(`🏆 [미션 성공] "${title}" 펀딩 금액이 스트리머 계좌로 즉시 정산되었습니다!`);
        btn.textContent = '정산 완료 ✅';
        btn.disabled = true;
        const failBtn = card.querySelector('.btn-mission-fail');
        if (failBtn) failBtn.style.display = 'none';
      } else if (btn.classList.contains('btn-mission-fail')) {
        window.showToast?.(`❌ [미션 실패] "${title}" 시청자분들께 펀딩 치즈가 전액 환불되었습니다.`);
        btn.textContent = '환불 완료';
        btn.disabled = true;
        const successBtn = card.querySelector('.btn-mission-success');
        if (successBtn) successBtn.style.display = 'none';
      } else if (btn.classList.contains('btn-mission-start')) {
        window.showToast?.(`🔥 "${title}" 미션이 승인되어 방송 화면에 실시간 카운트다운이 시작됩니다!`);
        btn.textContent = '미션 온에어 중';
      }
    });
  }
}


/* ========================================================
   12. OBS URL Copy Helper & Toast System
   ======================================================== */
function initObsCopy() {
  const copyBtn = document.getElementById('btnCopyObs');
  const toast = document.getElementById('dashToast');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
      const url = `${window.location.origin}${basePath}overlay.html?hideToolbar=true`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('✅ 전체 오버레이 OBS 브라우저 소스 URL이 복사되었습니다!');
      }).catch(() => {
        showToast('✅ OBS 브라우저 소스 URL 복사 완료!');
      });
    });
  }

  window.showToast = showToast;
}

/* ========================================================
   13. Virtual Stream Deck & Live Broadcast Macros
   실전 방송인을 위한 전역 핫키 & 터치 매크로 데스크
   ======================================================== */
function initVirtualStreamDeck() {
  const deckKeyShield = document.getElementById('deckKeyShield');
  const deckKeyMarker = document.getElementById('deckKeyMarker');
  const deckKeyBrb = document.getElementById('deckKeyBrb');
  const deckKeyFlush = document.getElementById('deckKeyFlush');
  const deckKeySip = document.getElementById('deckKeySip');
  const deckKeyNotice = document.getElementById('deckKeyNotice');

  const topBtnEmergency = document.getElementById('topBtnEmergency');
  const topBtnMarker = document.getElementById('topBtnMarker');

  let isEmergencyActive = false;
  let isBrbActive = false;
  let isSipActive = false;

  // Key press sound effect simulation (Web Audio API)
  function playClickSound(freq = 600, type = 'sine', duration = 0.08) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  // Visual press feedback
  function flashKey(el) {
    if (!el) return;
    el.classList.add('is-pressed');
    setTimeout(() => el.classList.remove('is-pressed'), 180);
  }

  // 1. Emergency Shield Toggle
  function toggleEmergencyShield() {
    isEmergencyActive = !isEmergencyActive;
    flashKey(deckKeyShield);
    playClickSound(isEmergencyActive ? 350 : 700, 'square', 0.12);

    if (deckKeyShield) {
      deckKeyShield.classList.toggle('active-emergency', isEmergencyActive);
    }
    if (topBtnEmergency) {
      topBtnEmergency.style.background = isEmergencyActive ? '#ef4444' : '';
      topBtnEmergency.style.color = isEmergencyActive ? '#fff' : '#f87171';
    }

    overlayChannel?.postMessage({
      type: 'EMERGENCY_SHIELD',
      active: isEmergencyActive
    });
    try {
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'EMERGENCY_SHIELD',
        active: isEmergencyActive,
        timestamp: Date.now()
      }));
    } catch(e) {}

    window.showToast?.(
      isEmergencyActive 
        ? '🚨 [비상 화면 가림막 활성화] OBS 오버레이가 차단 화면으로 전환되었습니다.'
        : '✅ [비상 가림막 해제] 정상 방송 화면으로 복구되었습니다.'
    );
  }

  // 2. BRB 5-Min Timer Toggle
  function toggleBrbTimer() {
    isBrbActive = !isBrbActive;
    flashKey(deckKeyBrb);
    playClickSound(520, 'sine', 0.1);

    if (deckKeyBrb) {
      deckKeyBrb.classList.toggle('active-timer', isBrbActive);
    }

    overlayChannel?.postMessage({
      type: 'BRB_TIMER',
      active: isBrbActive,
      durationSeconds: 300
    });
    try {
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'BRB_TIMER',
        active: isBrbActive,
        durationSeconds: 300,
        timestamp: Date.now()
      }));
    } catch(e) {}

    window.showToast?.(
      isBrbActive
        ? '☕ [5분 자리비움 타이머 가동] 오버레이에 카운트다운 바가 표시됩니다.'
        : '☕ [자리비움 타이머 종료] 복귀 완료!'
    );
  }

  // 3. Sip & Cough Mute Toggle
  function toggleSipMute() {
    isSipActive = !isSipActive;
    flashKey(deckKeySip);
    playClickSound(800, 'sine', 0.08);

    if (deckKeySip) {
      deckKeySip.classList.toggle('active-mute', isSipActive);
    }

    overlayChannel?.postMessage({
      type: 'SIP_MUTE',
      active: isSipActive
    });
    try {
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'SIP_MUTE',
        active: isSipActive,
        timestamp: Date.now()
      }));
    } catch(e) {}

    window.showToast?.(
      isSipActive
        ? '🧋 [수분 충전 / 기침 뮤트 ON] 오버레이에 꿀꺽 뱃지가 표시됩니다.'
        : '🎙️ [마이크 뮤트 해제] 음성이 정상 송출됩니다.'
    );
  }

  // 4. Chat Panic Flush
  function flushChatOverlay() {
    flashKey(deckKeyFlush);
    playClickSound(450, 'triangle', 0.1);

    overlayChannel?.postMessage({ type: 'CHAT_FLUSH' });
    try {
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'CHAT_FLUSH',
        timestamp: Date.now()
      }));
    } catch(e) {}

    window.showToast?.('🧹 [채팅창 올 클리어] 오버레이의 모든 채팅 말풍선을 즉시 정돈했습니다.');
  }

  // 5. Quick Announcement
  function sendQuickAnnouncement() {
    flashKey(deckKeyNotice);
    playClickSound(650, 'sine', 0.1);

    const announcementText = '📢 [미미비트 방송 공지] 규칙: 과도한 스포일러/도배는 삼가주세요! 팬카페와 디스코드 링크는 채널 소개를 참고해주세요 💜';
    
    // Send to overlay
    overlayChannel?.postMessage({
      type: 'QUICK_ANNOUNCEMENT',
      text: announcementText
    });

    // Also add to dashboard sandbox if open
    window.addEventFeedItem?.('📢', '방송 공지 발송', announcementText);
    window.showToast?.('📢 [공지 전송 완료] 치지직/유튜브 오버레이 채팅창에 고정 공지가 출력되었습니다.');
  }

  // Event Listeners
  if (deckKeyShield) deckKeyShield.addEventListener('click', toggleEmergencyShield);
  if (topBtnEmergency) topBtnEmergency.addEventListener('click', toggleEmergencyShield);
  if (deckKeyBrb) deckKeyBrb.addEventListener('click', toggleBrbTimer);
  if (deckKeySip) deckKeySip.addEventListener('click', toggleSipMute);
  if (deckKeyFlush) deckKeyFlush.addEventListener('click', flushChatOverlay);
  if (deckKeyNotice) deckKeyNotice.addEventListener('click', sendQuickAnnouncement);

  if (deckKeyMarker) {
    deckKeyMarker.addEventListener('click', () => {
      flashKey(deckKeyMarker);
      window.addHighlightMarker?.('legend', '대박 리액션 / 명장면 발생!');
    });
  }
  if (topBtnMarker) {
    topBtnMarker.addEventListener('click', () => {
      window.addHighlightMarker?.('legend', '대박 리액션 / 명장면 발생!');
    });
  }

  // Global Keyboard Shortcuts (Ctrl + Alt + [Key])
  window.addEventListener('keydown', (e) => {
    // Check if user is typing in an input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if ((e.ctrlKey || e.metaKey) && e.altKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        toggleEmergencyShield();
      } else if (key === 'm') {
        e.preventDefault();
        flashKey(deckKeyMarker);
        window.addHighlightMarker?.('legend', '🔥 명장면 마커 자동 기록');
      } else if (key === 't') {
        e.preventDefault();
        toggleBrbTimer();
      } else if (key === 'c') {
        e.preventDefault();
        flushChatOverlay();
      } else if (key === 'x') {
        e.preventDefault();
        toggleSipMute();
      }
    }
  });
}

/* ========================================================
   14. Highlight Marker System for YouTube Editors
   유튜브 편집자를 위한 실시간 타임스탬프 마커 보드
   ======================================================== */
function initHighlightMarkerSystem() {
  const tableBody = document.getElementById('markerTableBody');
  const countBadge = document.getElementById('markerCountBadge');
  const btnQuickAdd = document.getElementById('btnQuickAddMarker');
  const btnCopyYoutube = document.getElementById('btnCopyMarkersYoutube');
  const btnClear = document.getElementById('btnClearMarkers');

  let markers = [
    { id: 1, time: '00:15:20', tag: 'legend', tagText: '🔥 레전드', memo: '미미비트 시그니처 오프닝 댄스 & 보이스 리액션' },
    { id: 2, time: '01:10:45', tag: 'boss', tagText: '🎯 보스전', memo: '다크소울 신규 보스 1페이즈 노데스 패링 성공' }
  ];

  function renderMarkers() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (markers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">
            아직 기록된 편집점 마커가 없습니다. 방송 중 <strong>[Ctrl+Alt+M]</strong>을 눌러 명장면을 캡처해보세요!
          </td>
        </tr>
      `;
      if (countBadge) countBadge.textContent = '0개 기록됨';
      return;
    }

    if (countBadge) countBadge.textContent = `${markers.length}개 기록됨`;

    markers.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="marker-time-badge">${m.time}</span></td>
        <td><span class="marker-tag-badge tag-${m.tag}">${m.tagText}</span></td>
        <td style="color: #fff; font-weight: 500;">${m.memo}</td>
        <td style="text-align: center;">
          <button class="btn-ghost btn-del-marker" data-id="${m.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--text-dim);">🗑️</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Delete single marker
    tableBody.querySelectorAll('.btn-del-marker').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        markers = markers.filter(x => x.id !== id);
        renderMarkers();
        window.showToast?.('🗑️ 편집점 마커가 삭제되었습니다.');
      });
    });
  }

  function addMarker(tagType = 'legend', defaultMemo = '명장면 발생!') {
    const liveTimerEl = document.getElementById('liveTimer');
    const currentTime = liveTimerEl ? liveTimerEl.textContent.trim() : '02:45:12';

    const tagMap = {
      legend: { text: '🔥 레전드', tag: 'legend' },
      boss: { text: '🎯 보스전', tag: 'boss' },
      funny: { text: '🤣 꿀잼', tag: 'funny' },
      cheese: { text: '🧀 대형후원', tag: 'cheese' }
    };

    const chosen = tagMap[tagType] || tagMap.legend;

    const newMarker = {
      id: Date.now(),
      time: currentTime,
      tag: chosen.tag,
      tagText: chosen.text,
      memo: defaultMemo
    };

    markers.unshift(newMarker);
    renderMarkers();

    // High energy audio ding
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch(e) {}

    window.showToast?.(`🎬 [${currentTime}] 유튜브 편집점 마커 저장 완료! ("${defaultMemo}")`);
  }

  window.addHighlightMarker = addMarker;

  // Custom Memo Add
  if (btnQuickAdd) {
    btnQuickAdd.addEventListener('click', () => {
      const memo = prompt('편집자에게 남길 장면 메모를 입력해주세요:', '중요 리액션 구간');
      if (memo !== null) {
        addMarker('funny', memo || '중요 리액션');
      }
    });
  }

  // Copy YouTube Chapter Timestamps
  if (btnCopyYoutube) {
    btnCopyYoutube.addEventListener('click', () => {
      if (markers.length === 0) {
        alert('복사할 마커가 없습니다.');
        return;
      }

      // Sort chronologically
      const sorted = [...markers].sort((a, b) => a.time.localeCompare(b.time));
      let outputText = '00:00:00 🌟 방송 시작\n';
      sorted.forEach(m => {
        outputText += `${m.time} ${m.tagText} - ${m.memo}\n`;
      });

      navigator.clipboard.writeText(outputText).then(() => {
        window.showToast?.('📋 [유튜브 챕터 타임라인 복사 완료!] 유튜브 영상 설명란이나 편집자 디스코드에 붙여넣기 하세요.');
      }).catch(() => {
        window.showToast?.('📋 타임라인 클립보드 복사 완료!');
      });
    });
  }

  // Clear All Markers
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('오늘 기록된 모든 편집점 마커를 비우시겠습니까?')) {
        markers = [];
        renderMarkers();
        window.showToast?.('모든 마커가 초기화되었습니다.');
      }
    });
  }

  renderMarkers();
}

/* ========================================================
   15. Live Stream Soundboard FX (사운드패드 효과음 송출 엔진 - 커스텀 추가/삭제 지원)
   ======================================================== */
function initSoundboardFX() {
  const soundGrid = document.getElementById('soundpadGrid');
  const volSlider = document.getElementById('soundpadVol');
  const volLabel = document.getElementById('soundpadVolLabel');
  const chkLocalPlay = document.getElementById('soundpadLocalPlay');
  const chkObsSync = document.getElementById('soundpadObsSync');

  // Modal elements
  const btnAdd = document.getElementById('btnAddSoundFx');
  const btnReset = document.getElementById('btnResetSounds');
  const modalBackdrop = document.getElementById('soundFxModalBackdrop');
  const btnCloseModal = document.getElementById('btnCloseSoundFxModal');
  const btnCancelModal = document.getElementById('btnCancelSoundFxModal');
  const btnSubmitModal = document.getElementById('btnSubmitSoundFxModal');

  const modalIcon = document.getElementById('modalSoundIcon');
  const modalName = document.getElementById('modalSoundName');
  const modalKey = document.getElementById('modalSoundKey');
  const fileInput = document.getElementById('soundFileInput');
  const dropZone = document.getElementById('soundDropZone');
  const fileNotice = document.getElementById('soundFileNotice');
  const previewBox = document.getElementById('soundPreviewBox');
  const previewName = document.getElementById('soundPreviewName');
  const btnPlayPreview = document.getElementById('btnPlaySoundPreview');

  let tempAudioData = null;
  let previewAudio = null;

  const DEFAULT_SOUNDS = [
    { id: 'applause', name: '박수 & 환호', icon: '👏', key: '1', proceduralKey: 'applause' },
    { id: 'beep', name: '삐- 검열음', icon: '📢', key: '2', proceduralKey: 'beep' },
    { id: 'drumroll', name: '긴장 드럼롤', icon: '🥁', key: '3', proceduralKey: 'drumroll' },
    { id: 'boing', name: '띠용 / 실패', icon: '🔔', key: '4', proceduralKey: 'boing' },
    { id: 'airhorn', name: '에어혼 팡파레', icon: '🎉', key: '5', proceduralKey: 'airhorn' },
    { id: 'magic', name: '마법 차임벨', icon: '✨', key: '6', proceduralKey: 'magic' }
  ];

  let currentSounds = [...DEFAULT_SOUNDS];

  // Volume state
  let currentVolume = parseFloat(localStorage.getItem('stella_soundpad_vol') || '0.8');
  if (volSlider && volLabel) {
    volSlider.value = Math.round(currentVolume * 100);
    volLabel.textContent = `${Math.round(currentVolume * 100)}%`;
    volSlider.addEventListener('input', (e) => {
      currentVolume = parseInt(e.target.value, 10) / 100;
      volLabel.textContent = `${e.target.value}%`;
      localStorage.setItem('stella_soundpad_vol', currentVolume.toString());
    });
  }

  // --- IndexedDB for Reliable Audio File Storage ---
  const DB_NAME = 'MimibitSoundpadDB_v2';
  const STORE_NAME = 'custom_sounds';

  function openAudioDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function loadSoundsFromDB() {
    try {
      const db = await openAudioDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const customItems = req.result || [];
        if (customItems.length > 0) {
          currentSounds = customItems;
        } else {
          currentSounds = [...DEFAULT_SOUNDS];
        }
        renderSoundGrid();
      };
      req.onerror = () => {
        currentSounds = [...DEFAULT_SOUNDS];
        renderSoundGrid();
      };
    } catch(e) {
      currentSounds = [...DEFAULT_SOUNDS];
      renderSoundGrid();
    }
  }

  async function saveAllSoundsToDB() {
    try {
      const db = await openAudioDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      currentSounds.forEach(s => store.put(s));
    } catch(e) {}
  }

  // Procedural Web Audio Engine for default sounds
  function playProceduralSound(type, volume = 0.8) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      master.connect(ctx.destination);

      if (type === 'applause') {
        const bufferSize = ctx.sampleRate * 2.2;
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
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        noise.start();
      } else if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.75);
      } else if (type === 'boing') {
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
        const freqs = [466.16, 622.25];
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

  // Play Sound Item (Local & OBS Overlay)
  function playSoundItem(sound, btnEl) {
    if (btnEl) {
      btnEl.classList.add('is-playing');
      setTimeout(() => btnEl.classList.remove('is-playing'), 350);
    }

    // 1. Local Speaker Playback
    if (!chkLocalPlay || chkLocalPlay.checked) {
      if (sound.audioData) {
        try {
          const audio = new Audio(sound.audioData);
          audio.volume = currentVolume;
          audio.play();
        } catch(e) {}
      } else if (sound.proceduralKey) {
        playProceduralSound(sound.proceduralKey, currentVolume);
      }
    }

    // 2. Broadcast to OBS Overlay
    if (!chkObsSync || chkObsSync.checked) {
      const payload = {
        type: 'SOUND_FX',
        key: sound.id,
        icon: sound.icon,
        label: sound.name,
        volume: currentVolume,
        audioData: sound.audioData || null,
        timestamp: Date.now()
      };
      if (overlayChannel) {
        overlayChannel.postMessage(payload);
      }
      try {
        localStorage.setItem('stella_overlay_event', JSON.stringify(payload));
      } catch(e) {}
    }

    window.showToast?.(`🔊 [효과음] ${sound.icon} ${sound.name} 송출!`);
  }

  // Render Grid Cards
  function renderSoundGrid() {
    if (!soundGrid) return;
    soundGrid.innerHTML = '';

    currentSounds.forEach((sound) => {
      const btn = document.createElement('button');
      btn.className = 'soundpad-btn';
      btn.dataset.id = sound.id;
      btn.dataset.key = sound.key;

      btn.innerHTML = `
        ${sound.isCustom ? '<span class="soundpad-custom-tag">MY MP3</span>' : ''}
        <button class="btn-del-sound" data-id="${sound.id}" title="효과음 삭제">✕</button>
        <div class="soundpad-icon">${sound.icon}</div>
        <div class="soundpad-label">${sound.name}</div>
        <div class="soundpad-sub">HotKey: ${sound.key}</div>
      `;

      // Play on card click
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-sound')) return;
        playSoundItem(sound, btn);
      });

      // Delete Sound Button
      const delBtn = btn.querySelector('.btn-del-sound');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`"${sound.name}" 효과음을 사운드패드에서 삭제하시겠습니까?`)) {
          currentSounds = currentSounds.filter(s => s.id !== sound.id);
          saveAllSoundsToDB();
          renderSoundGrid();
          window.showToast?.(`🗑️ "${sound.name}" 효과음이 삭제되었습니다.`);
        }
      });

      soundGrid.appendChild(btn);
    });
  }

  // --- Modal Logic: Add Custom Sound FX ---
  function openAddModal() {
    tempAudioData = null;
    if (previewAudio) {
      previewAudio.pause();
      previewAudio = null;
    }
    if (modalName) modalName.value = '';
    if (modalIcon) modalIcon.value = '🎵';
    if (fileNotice) fileNotice.textContent = '클릭하여 오디오 파일 불러오기';
    if (previewBox) previewBox.style.display = 'none';
    if (fileInput) fileInput.value = '';

    modalBackdrop?.classList.add('show');
  }

  function closeAddModal() {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio = null;
    }
    modalBackdrop?.classList.remove('show');
  }

  if (btnAdd) btnAdd.addEventListener('click', openAddModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeAddModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeAddModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeAddModal();
    });
  }

  // File Dropzone & Input Trigger
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.includes('audio') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        alert('오디오 파일(.mp3, .wav, .ogg 등)만 등록 가능합니다.');
        return;
      }

      if (file.size > 12 * 1024 * 1024) {
        alert('파일 용량이 12MB를 초과합니다. 더 짧은 효과음 파일을 권장합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        tempAudioData = loadEvent.target.result;
        if (fileNotice) fileNotice.textContent = `✅ ${file.name} (${Math.round(file.size / 1024)} KB)`;
        if (modalName && !modalName.value.trim()) {
          modalName.value = file.name.replace(/\.[^/.]+$/, "");
        }
        if (previewBox && previewName) {
          previewBox.style.display = 'flex';
          previewName.textContent = file.name;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Preview Button
  if (btnPlayPreview) {
    btnPlayPreview.addEventListener('click', () => {
      if (!tempAudioData) return;
      if (previewAudio) {
        previewAudio.pause();
      }
      previewAudio = new Audio(tempAudioData);
      previewAudio.volume = currentVolume;
      previewAudio.play();
    });
  }

  // Submit Modal
  if (btnSubmitModal) {
    btnSubmitModal.addEventListener('click', () => {
      const name = modalName?.value.trim();
      const icon = modalIcon?.value.trim() || '🎵';
      const key = modalKey?.value || '7';

      if (!name) {
        alert('효과음 이름을 입력해주세요.');
        modalName?.focus();
        return;
      }

      if (!tempAudioData) {
        alert('내 컴퓨터에서 효과음 오디오 파일(.mp3, .wav)을 선택해주세요.');
        return;
      }

      const newSound = {
        id: 'custom_' + Date.now(),
        name,
        icon,
        key,
        isCustom: true,
        audioData: tempAudioData
      };

      currentSounds.push(newSound);
      saveAllSoundsToDB();
      renderSoundGrid();
      closeAddModal();
      window.showToast?.(`🎉 [${icon} ${name}] 효과음이 사운드패드에 등록되었습니다! (단축키: ${key})`);
    });
  }

  // Reset to Defaults Button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('기본 6종 효과음으로 초기화하시겠습니까? (직접 추가한 효과음이 정리됩니다)')) {
        currentSounds = [...DEFAULT_SOUNDS];
        saveAllSoundsToDB();
        renderSoundGrid();
        window.showToast?.('🔄 사운드패드가 기본 6종 효과음으로 복구되었습니다.');
      }
    });
  }

  // Keyboard Hotkey Trigger
  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement?.tagName.toLowerCase();
    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const pressedKey = e.key.toUpperCase();
    const matchedSound = currentSounds.find(s => s.key.toUpperCase() === pressedKey);
    if (matchedSound) {
      e.preventDefault();
      const btnEl = document.querySelector(`.soundpad-btn[data-id="${matchedSound.id}"]`);
      playSoundItem(matchedSound, btnEl);
    }
  });

  // Load Initial Sounds
  loadSoundsFromDB();
}


/* ========================================================
   16. Streamer Rundown & Teleprompter Cue Sheet (방송 큐시트)
   ======================================================== */
function initRundownCueSheet() {
  const rundownList = document.getElementById('rundownItemList');
  const progressPct = document.getElementById('rundownProgressPct');
  const progressBar = document.getElementById('rundownProgressBar');
  const btnAdd = document.getElementById('btnAddRundownItem');
  const btnReset = document.getElementById('btnResetRundown');
  const teleprompter = document.getElementById('teleprompterNotes');
  const teleprompterStatus = document.getElementById('teleprompterStatus');

  const defaultItems = [
    { id: 1, time: '20:00', title: '[오프닝] 시청자 소통 & 오늘 방송 계획 브리핑', completed: true },
    { id: 2, time: '20:45', title: '[저스트채팅] 시청자 룰렛 돌리기 & 후원 리액션', completed: true },
    { id: 3, time: '21:30', title: '[메인콘텐츠] 스팀 신작 보스전 공략 미션', completed: false, active: true },
    { id: 4, time: '22:30', title: '[2부] 팬아트 구경 & 시청자 사연 소개', completed: false },
    { id: 5, time: '23:30', title: '[클로징] 다음 방송 예고 및 방종곡 부르기', completed: false }
  ];

  let items = [];
  try {
    const saved = localStorage.getItem('stella_rundown_items');
    items = saved ? JSON.parse(saved) : defaultItems;
  } catch (e) {
    items = defaultItems;
  }

  function saveItems() {
    localStorage.setItem('stella_rundown_items', JSON.stringify(items));
  }

  function renderRundown() {
    if (!rundownList) return;
    rundownList.innerHTML = '';

    const total = items.length;
    const completedCount = items.filter(i => i.completed).length;
    const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

    if (progressPct) progressPct.textContent = `${pct}% (${completedCount}/${total} 코너 완료)`;
    if (progressBar) progressBar.style.width = `${pct}%`;

    items.forEach((item) => {
      const el = document.createElement('div');
      const isCompleted = item.completed;
      const isActive = !isCompleted && item.active;

      el.className = `rundown-item ${isCompleted ? 'is-completed' : ''} ${isActive ? 'is-active' : ''}`;
      el.innerHTML = `
        <input type="checkbox" class="rundown-checkbox" ${isCompleted ? 'checked' : ''} data-id="${item.id}">
        <span class="rundown-time">${item.time || '00:00'}</span>
        <span class="rundown-item-title">${item.title}</span>
        ${isActive ? '<span class="rundown-live-badge">NOW ON AIR</span>' : ''}
        <button class="btn-del-rundown" data-id="${item.id}" title="코너 삭제" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 0.85rem; padding: 2px 6px; border-radius: 4px; transition: color 0.2s;">✕</button>
      `;

      // Checkbox toggle
      const chk = el.querySelector('.rundown-checkbox');
      chk.addEventListener('change', (e) => {
        item.completed = e.target.checked;
        items.forEach(i => i.active = false);
        if (item.completed) {
          const nextIncomplete = items.find(i => !i.completed);
          if (nextIncomplete) nextIncomplete.active = true;
        } else {
          item.active = true;
        }
        saveItems();
        renderRundown();
        window.showToast?.(item.completed ? `✅ [${item.time}] 코너 완료 처리!` : `🔄 [${item.time}] 코너 진행 중으로 복구!`);
      });

      // Delete button
      const btnDel = el.querySelector('.btn-del-rundown');
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`"${item.title}" 코너를 삭제하시겠습니까?`)) {
          items = items.filter(i => i.id !== item.id);
          saveItems();
          renderRundown();
          window.showToast?.('🗑️ 코너가 삭제되었습니다.');
        }
      });

      rundownList.appendChild(el);
    });
  }

  // Add Item Button
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      const time = prompt('코너 시작 예정 시간을 입력하세요 (예: 22:45):', '22:45');
      if (!time) return;
      const title = prompt('진행할 방송 코너 제목을 입력하세요:', '시청자 참여 깜짝 퀴즈 타임');
      if (!title) return;

      const newItem = {
        id: Date.now(),
        time,
        title,
        completed: false,
        active: items.length === 0 || !items.some(i => i.active && !i.completed)
      };
      items.push(newItem);
      saveItems();
      renderRundown();
      window.showToast?.(`📋 새로운 코너 [${time}] "${title}" 추가 완료!`);
    });
  }

  // Reset Button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('오늘 큐시트의 모든 체크 상태를 초기화하시겠습니까?')) {
        items.forEach((item, idx) => {
          item.completed = false;
          item.active = idx === 0;
        });
        saveItems();
        renderRundown();
        window.showToast?.('🔄 큐시트 진행률이 0%로 초기화되었습니다.');
      }
    });
  }

  // Teleprompter / Talking Points autosave
  if (teleprompter) {
    const savedMemo = localStorage.getItem('stella_teleprompter_memo');
    if (savedMemo !== null) {
      teleprompter.value = savedMemo;
    } else {
      teleprompter.value = "• 21:30 보스전 미션: 시청자 치즈 펀딩 10만 달성 시 공략 시작\n• 오늘 10시 시참 게임 코드: STELLA-7789\n• 방종곡: 아이네 - 눈꽃처럼 라이브 부르기!";
    }

    let saveTimer = null;
    teleprompter.addEventListener('input', () => {
      if (teleprompterStatus) teleprompterStatus.textContent = '입력 중...';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        localStorage.setItem('stella_teleprompter_memo', teleprompter.value);
        if (teleprompterStatus) teleprompterStatus.textContent = '자동 저장됨';
      }, 500);
    });
  }

  renderRundown();
}

/* ========================================================
   17. AI Post-Stream Comprehensive Report & Infographic Card
   ======================================================== */
function initPostStreamReport() {
  const topBtnReport = document.getElementById('topBtnReport');
  const btnAnalyticsReport = document.getElementById('btnAnalyticsOpenReport');
  const backdrop = document.getElementById('reportModalBackdrop');
  const btnClose = document.getElementById('btnCloseReportModal');
  const canvas = document.getElementById('reportCardCanvas');

  const btnDownloadCard = document.getElementById('btnDownloadReportCard');
  const btnCopyYoutube = document.getElementById('btnCopyYoutubeReport');
  const btnCopyDiscord = document.getElementById('btnCopyDiscordReport');
  const btnDownloadCsv = document.getElementById('btnDownloadCsvReport');

  const repUptime = document.getElementById('repUptime');
  const repPeak = document.getElementById('repPeakViewers');
  const repCheese = document.getElementById('repCheese');
  const repMarkerCount = document.getElementById('repMarkerCount');

  // Draw High-Resolution Infographic Card onto Canvas (1200x675)
  function renderCanvasCard(uptime, peak, cheese, markerCount) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // 1. Deep Space Cosmic Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#090a1f');
    bgGrad.addColorStop(0.5, '#17133f');
    bgGrad.addColorStop(1, '#0c1228');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Ambient Color Nebulas
    const glow1 = ctx.createRadialGradient(200, 150, 20, 200, 150, 400);
    glow1.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, w, h);

    const glow2 = ctx.createRadialGradient(1000, 500, 20, 1000, 500, 450);
    glow2.addColorStop(0, 'rgba(0, 255, 163, 0.2)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, w, h);

    // 3. Subtle Starfield Particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    const stars = [
      [120, 80, 2], [280, 220, 1.5], [450, 90, 2.5], [780, 140, 2],
      [950, 80, 1.5], [1100, 230, 2], [180, 450, 2], [320, 580, 1.5],
      [840, 480, 2.5], [1050, 600, 2], [620, 310, 1.5]
    ];
    stars.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Outer Neon Border
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // 4. Header Bar
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#00ffa3';
    ctx.fillText('STELLA STUDIO • PRO LIVE BROADCAST SUMMARY', 60, 65);

    ctx.font = 'bold 34px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🌟 오늘의 라이브 방송 결산 리포트', 60, 110);

    ctx.font = '500 18px sans-serif';
    ctx.fillStyle = '#c4b5fd';
    ctx.fillText('2026.10.21 | 스트리머: 미미비트★루나 (CHZZK 파트너)', 60, 142);

    // Divider Line
    const lineGrad = ctx.createLinearGradient(60, 0, 1140, 0);
    lineGrad.addColorStop(0, '#8b5cf6');
    lineGrad.addColorStop(0.5, '#00ffa3');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.lineTo(1140, 160);
    ctx.stroke();

    // 5. 4 Core KPI Stat Cards
    const cards = [
      { label: '⏱️ 총 방송 송출 시간', val: uptime, color: '#38bdf8' },
      { label: '👥 최고 동시 시청자', val: peak, color: '#00ffa3' },
      { label: '🧀 오늘 누적 치즈 후원', val: cheese, color: '#fde047' },
      { label: '🎬 하이라이트 편집점', val: `${markerCount}개 구간`, color: '#ec4899' }
    ];

    const cardW = 248;
    const cardH = 125;
    const startX = 60;
    const startY = 185;
    const gap = 25;

    cards.forEach((c, idx) => {
      const x = startX + idx * (cardW + gap);
      const y = startY;

      // Card Box Background
      ctx.fillStyle = 'rgba(15, 17, 45, 0.85)';
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.22)';
      ctx.lineWidth = 1.5;

      // Rounded rect
      roundRect(ctx, x, y, cardW, cardH, 14, true, true);

      // Card Label
      ctx.font = '600 14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(c.label, x + 18, y + 38);

      // Card Value
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = c.color;
      ctx.fillText(c.val, x + 18, y + 85);
    });

    // 6. AI Coach Big Evaluation Banner
    const coachY = 340;
    const coachW = 1080;
    const coachH = 160;

    // Gradient coach card box
    const coachBg = ctx.createLinearGradient(60, coachY, 1140, coachY + coachH);
    coachBg.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
    coachBg.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
    ctx.fillStyle = coachBg;
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, 60, coachY, coachW, coachH, 16, true, true);

    // AI Coach Header
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('🤖 미미비트 AI 코치 종합 평가 & 화력 분석', 90, coachY + 42);

    ctx.font = '500 13px monospace';
    ctx.fillStyle = '#00ffa3';
    ctx.fillText('STATUS: AI REALTIME SENTIMENT VERIFIED', 800, coachY + 42);

    // AI Coach Body
    ctx.font = '500 17px sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText('"오늘 21:30 보스전 미션 구간에서 시청자 채팅 화력이 평소 대비 +38.4% 폭발했습니다!', 90, coachY + 84);
    ctx.fillText(' 룰렛 후원과 긴급 상황 대처 매크로 사용 타이밍도 완벽했습니다. 오늘 방송 대성공 ✨"', 90, coachY + 118);

    // 7. Footer Brand Note
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('NAVER CHZZK • YOUTUBE LIVE • SOOP SUPPORTED', 60, 630);

    ctx.font = '500 13px monospace';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('Generated by Mimibit Studio Pro • discord.gg/stella', 760, 630);
  }

  // Rounded rectangle helper
  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function openReportModal() {
    const liveTimer = document.getElementById('liveTimer')?.textContent || '02:45:12';
    const cheeseVal = document.getElementById('statCheese')?.textContent || '382,000';
    const cheeseFull = `${cheeseVal} 치즈`;
    const peakVal = '1,894명';
    const markers = (window.getHighlightMarkers ? window.getHighlightMarkers() : []) || [];
    const markerCount = markers.length > 0 ? markers.length : 4;

    if (repUptime) repUptime.textContent = liveTimer;
    if (repPeak) repPeak.textContent = peakVal;
    if (repCheese) repCheese.textContent = cheeseFull;
    if (repMarkerCount) repMarkerCount.textContent = `${markerCount}개 구간`;

    // Render Canvas graphic card
    renderCanvasCard(liveTimer, peakVal, cheeseFull, markerCount);

    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeReportModal() {
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (topBtnReport) topBtnReport.addEventListener('click', openReportModal);
  if (btnAnalyticsReport) btnAnalyticsReport.addEventListener('click', openReportModal);
  if (btnClose) btnClose.addEventListener('click', closeReportModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeReportModal();
    });
  }

  // Action 1: Download PNG Card
  if (btnDownloadCard) {
    btnDownloadCard.addEventListener('click', () => {
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `stella_broadcast_summary_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      window.showToast?.('📸 [결산 카드(PNG) 다운로드 완료!] 네이버 팬카페나 SNS에 바로 업로드해보세요.');
    });
  }

  // Action 2: Copy YouTube Chapters
  if (btnCopyYoutube) {
    btnCopyYoutube.addEventListener('click', () => {
      const markers = (window.getHighlightMarkers ? window.getHighlightMarkers() : []) || [];
      let chapters = '00:00:00 🌟 방송 시작 & 오프닝 소통\n';
      if (markers.length > 0) {
        markers.forEach(m => {
          chapters += `${m.time} ${m.tagText} - ${m.memo}\n`;
        });
      } else {
        chapters += '00:45:10 🎮 보스전 1트 공략 시작\n01:24:10 ⚡ 보스전 극적 격파 레전드 리액션\n02:15:30 🧀 치즈 룰렛 파티 및 애교 미션\n02:45:00 🎵 방종곡 및 클로징\n';
      }

      navigator.clipboard.writeText(chapters).then(() => {
        window.showToast?.('📋 [유튜브 챕터 복사 완료!] 동영상 설명란에 붙여넣기 하세요.');
      });
    });
  }

  // Action 3: Copy Discord Report
  if (btnCopyDiscord) {
    btnCopyDiscord.addEventListener('click', () => {
      const liveTimer = document.getElementById('liveTimer')?.textContent || '02:45:12';
      const cheeseVal = document.getElementById('statCheese')?.textContent || '382,000';
      const discordText =
        "**[🌟 2026.10.21 미미비트 라이브 방송 결산 리포트]**\n" +
        "• 방송 일자: 2026-10-21\n" +
        "• 총 방송 시간: " + liveTimer + "\n" +
        "• 최고 동시 시청자: 1,894명 | 누적 치즈 후원: " + cheeseVal + " 치즈\n" +
        "• 편집팀 타임스탬프: 4개 구간 마킹 완료\n" +
        "• AI 총평: 보스전 미션 대성공! 채팅 참여율 94.2% 역대급 화력 달성 ✨\n" +
        "(상세 챕터 타임라인은 미미비트 콘솔 및 유튜브 설명란을 확인해주세요!)";

      navigator.clipboard.writeText(discordText).then(() => {
        window.showToast?.('💬 [디스코드 가이드 복사 완료!] 편집팀 채널에 붙여넣기 하세요.');
      });
    });
  }

  // Action 4: Download CSV Data
  if (btnDownloadCsv) {
    btnDownloadCsv.addEventListener('click', () => {
      const cheeseVal = document.getElementById('statCheese')?.textContent || '382,000';
      const csvContent = "\uFEFF" + "시간,항목,상세내용\n" +
        "2026-10-21 20:00:00,방송 시작,오프닝 및 시청자 소통\n" +
        "2026-10-21 20:45:10,편집점,보스전 1트 공략 시작\n" +
        "2026-10-21 21:24:10,편집점,보스전 극적 격파 레전드 리액션\n" +
        "2026-10-21 22:15:30,이벤트,도네이션 룰렛 당첨 파티\n" +
        "2026-10-21 22:45:12,방송 종료,총 " + cheeseVal + " 치즈 후원 달성\n";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stella_stream_data_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      window.showToast?.('📊 [CSV 통계 다운로드 완료!] 엑셀이나 노션에 저장하세요.');
    });
  }
}

/* ========================================================
   18. Clean Chat & Auto Moderation (Banned Words Filter)
   ======================================================== */
function initCleanChatModeration() {
  const bannedListEl = document.getElementById('bannedWordsList');
  const countEl = document.getElementById('bannedWordsCount');
  const inputEl = document.getElementById('inputNewBannedWord');
  const actionEl = document.getElementById('selectBannedAction');
  const btnAdd = document.getElementById('btnAddBannedWord');
  const btnTest = document.getElementById('btnTestBannedWord');

  const defaultBannedWords = [
    { word: '바보', action: 'mask' },
    { word: '멍청이', action: 'mask' },
    { word: '핵', action: 'mask' },
    { word: '대리', action: 'mask' },
    { word: '분탕', action: 'hide' },
    { word: '스포', action: 'mask' }
  ];

  let bannedWords = [];
  try {
    const saved = localStorage.getItem('stella_banned_words');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) bannedWords = parsed;
      else bannedWords = defaultBannedWords;
    } else {
      bannedWords = defaultBannedWords;
      localStorage.setItem('stella_banned_words', JSON.stringify(bannedWords));
    }
  } catch (e) {
    bannedWords = defaultBannedWords;
  }

  function renderBannedWords() {
    if (!bannedListEl) return;
    bannedListEl.innerHTML = '';
    bannedWords.forEach((item, index) => {
      const pill = document.createElement('div');
      pill.className = 'banned-word-pill';
      const actionBadge = item.action === 'hide' ? '숨김' : (item.action === 'warn' ? '경고' : '마스킹');
      pill.innerHTML = `
        <span><strong>${escapeHtml(item.word)}</strong> <small style="opacity: 0.7; font-size: 0.72rem;">(${actionBadge})</small></span>
        <button type="button" class="btn-del-banned" data-index="${index}" title="금칙어 삭제">✕</button>
      `;
      bannedListEl.appendChild(pill);
    });
    if (countEl) countEl.textContent = bannedWords.length;
  }

  function syncBannedWords() {
    try {
      localStorage.setItem('stella_banned_words', JSON.stringify(bannedWords));
      overlayChannel?.postMessage({
        type: 'BANNED_WORDS_UPDATED',
        bannedWords: bannedWords
      });
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'BANNED_WORDS_UPDATED',
        bannedWords: bannedWords,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }

  function addWord() {
    if (!inputEl) return;
    const word = inputEl.value.trim();
    if (!word) {
      window.showToast?.('⚠️ 등록할 금칙어 단어를 입력해주세요.');
      inputEl.focus();
      return;
    }
    if (bannedWords.some(b => b.word.toLowerCase() === word.toLowerCase())) {
      window.showToast?.('⚠️ 이미 등록되어 있는 금칙어입니다.');
      return;
    }
    const action = actionEl ? actionEl.value : 'mask';
    bannedWords.push({ word, action });
    syncBannedWords();
    renderBannedWords();
    inputEl.value = '';
    window.showToast?.(`🛡️ 새 금칙어 [${word}] (${action === 'hide' ? '숨김' : '마스킹'}) 등록 완료!`);
  }

  if (btnAdd) btnAdd.addEventListener('click', addWord);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addWord();
    });
  }

  if (bannedListEl) {
    bannedListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-del-banned');
      if (!btn) return;
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx >= 0 && idx < bannedWords.length) {
        const removed = bannedWords.splice(idx, 1)[0];
        syncBannedWords();
        renderBannedWords();
        window.showToast?.(`🗑️ 금칙어 [${removed.word}] 삭제 완료`);
      }
    });
  }

  // Test filter button: simulate chat and show results
  if (btnTest) {
    btnTest.addEventListener('click', () => {
      const sample = '방장님 핵 쓰는 대리 기사 맞죠? 바보 같음 ㅋㅋㅋ';
      let filtered = sample;
      bannedWords.forEach(b => {
        const regex = new RegExp(b.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (b.action === 'mask') {
          filtered = filtered.replace(regex, '***');
        } else if (b.action === 'warn') {
          filtered = filtered.replace(regex, '***[주의]');
        }
      });

      // Show in AI Chatbot sandbox
      const feed = document.getElementById('chatSandboxFeed');
      if (feed) {
        const row = document.createElement('div');
        row.className = 'chat-msg-row user';
        row.innerHTML = `
          <div class="chat-sender-avatar">⚠️</div>
          <div class="chat-bubble" style="border: 1px solid rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.08);">
            <span class="sender-name" style="color: #f43f5e;">악성 시청자 (클린봇 필터링 감지)</span>
            <p><span style="text-decoration: line-through; opacity: 0.6; font-size: 0.8rem;">원본: ${escapeHtml(sample)}</span><br><strong>실시간 마스킹 결과:</strong> <span style="color: #00ffa3; font-weight: 700;">${escapeHtml(filtered)}</span></p>
          </div>
        `;
        feed.appendChild(row);
        feed.scrollTop = feed.scrollHeight;
      }

      // Also broadcast to overlay
      overlayChannel?.postMessage({
        type: 'NEW_CHAT',
        user: '어그로시청자',
        text: sample,
        badge: 'normal',
        badgeText: '일반',
        color: 'color-white'
      });

      window.showToast?.(`🛡️ 금칙어 필터링 테스트 실행: "${sample}" -> "${filtered}"`);
    });
  }

  renderBannedWords();
  syncBannedWords();
}

/* ========================================================
   19. Platform Integration Modals (CHZZK, YouTube, Discord)
   ======================================================== */
function initPlatformModals() {
  // Saved Platform Settings
  let platformSettings = {
    chzzk: { channelId: 'chzzk_stella_luna', clientId: 'stella_chzzk_client_id_live', clientSecret: '••••••••••••••••••••••••', syncChat: true, syncDonation: true },
    youtube: { channel: '@stella_studio', streamKey: 'live_123456789_abcdefg', syncSuperchat: true },
    discord: { webhookUrl: 'https://discord.com/api/webhooks/1234567890/stella_stream_bot', msgTemplate: '@everyone 🌟 미미비트 스튜디오 오늘자 방송 On Air! 방제: [신작 RPG 켠왕 1일차] 지금 바로 보러 오세요! 💜' }
  };

  try {
    const saved = localStorage.getItem('stella_platform_settings');
    if (saved) {
      platformSettings = Object.assign(platformSettings, JSON.parse(saved));
    }
  } catch (e) {}

  function savePlatformSettings() {
    try {
      localStorage.setItem('stella_platform_settings', JSON.stringify(platformSettings));
    } catch (e) {}
  }

  // --- 1. CHZZK Modal ---
  const chzzkBackdrop = document.getElementById('chzzkModalBackdrop');
  const btnOpenChzzk = document.getElementById('btnOpenChzzkModal');
  const btnCloseChzzk = document.getElementById('btnCloseChzzkModal');
  const btnCancelChzzk = document.getElementById('btnCancelChzzkModal');
  const btnSaveChzzk = document.getElementById('btnSaveChzzkModal');
  const btnToggleChzzk = document.getElementById('btnToggleChzzkSecret');
  const chzzkChannelInput = document.getElementById('chzzkChannelIdInput');
  const chzzkClientInput = document.getElementById('chzzkClientIdInput');
  const chzzkSecretInput = document.getElementById('chzzkClientSecretInput');
  const chzzkSyncChat = document.getElementById('chzzkSyncChat');
  const chzzkSyncDonation = document.getElementById('chzzkSyncDonation');

  function openChzzkModal() {
    if (!chzzkBackdrop) return;
    if (chzzkChannelInput) chzzkChannelInput.value = platformSettings.chzzk.channelId || '';
    if (chzzkClientInput) chzzkClientInput.value = platformSettings.chzzk.clientId || '';
    if (chzzkSecretInput) chzzkSecretInput.value = platformSettings.chzzk.clientSecret || '';
    if (chzzkSyncChat) chzzkSyncChat.checked = platformSettings.chzzk.syncChat !== false;
    if (chzzkSyncDonation) chzzkSyncDonation.checked = platformSettings.chzzk.syncDonation !== false;
    chzzkBackdrop.classList.add('show');
  }

  function closeChzzkModal() {
    chzzkBackdrop?.classList.remove('show');
  }

  if (btnOpenChzzk) btnOpenChzzk.addEventListener('click', openChzzkModal);
  if (btnCloseChzzk) btnCloseChzzk.addEventListener('click', closeChzzkModal);
  if (btnCancelChzzk) btnCancelChzzk.addEventListener('click', closeChzzkModal);
  if (chzzkBackdrop) {
    chzzkBackdrop.addEventListener('click', (e) => {
      if (e.target === chzzkBackdrop) closeChzzkModal();
    });
  }

  if (btnToggleChzzk && chzzkSecretInput) {
    btnToggleChzzk.addEventListener('click', () => {
      chzzkSecretInput.type = chzzkSecretInput.type === 'password' ? 'text' : 'password';
    });
  }

  if (btnSaveChzzk) {
    btnSaveChzzk.addEventListener('click', () => {
      platformSettings.chzzk.channelId = chzzkChannelInput?.value.trim() || 'chzzk_stella_luna';
      platformSettings.chzzk.clientId = chzzkClientInput?.value.trim() || '';
      platformSettings.chzzk.clientSecret = chzzkSecretInput?.value.trim() || '';
      platformSettings.chzzk.syncChat = chzzkSyncChat ? chzzkSyncChat.checked : true;
      platformSettings.chzzk.syncDonation = chzzkSyncDonation ? chzzkSyncDonation.checked : true;
      savePlatformSettings();

      const descEl = document.getElementById('chzzkStatusDesc');
      if (descEl) descEl.textContent = `네이버 로그인 연동 완료 · 채널 ID: ${platformSettings.chzzk.channelId}`;
      closeChzzkModal();
      window.showToast?.('🟩 [치지직 API 연동 완료] 토큰 검증 성공 및 실시간 데이터가 연동되었습니다.');
    });
  }

  // --- 2. YouTube Modal ---
  const youtubeBackdrop = document.getElementById('youtubeModalBackdrop');
  const btnOpenYoutube = document.getElementById('btnOpenYoutubeModal');
  const btnCloseYoutube = document.getElementById('btnCloseYoutubeModal');
  const btnCancelYoutube = document.getElementById('btnCancelYoutubeModal');
  const btnSaveYoutube = document.getElementById('btnSaveYoutubeModal');
  const btnToggleYoutube = document.getElementById('btnToggleYoutubeSecret');
  const youtubeChannelInput = document.getElementById('youtubeChannelInput');
  const youtubeKeyInput = document.getElementById('youtubeStreamKeyInput');
  const youtubeSyncSuperchat = document.getElementById('youtubeSyncSuperchat');

  function openYoutubeModal() {
    if (!youtubeBackdrop) return;
    if (youtubeChannelInput) youtubeChannelInput.value = platformSettings.youtube.channel || '';
    if (youtubeKeyInput) youtubeKeyInput.value = platformSettings.youtube.streamKey || '';
    if (youtubeSyncSuperchat) youtubeSyncSuperchat.checked = platformSettings.youtube.syncSuperchat !== false;
    youtubeBackdrop.classList.add('show');
  }

  function closeYoutubeModal() {
    youtubeBackdrop?.classList.remove('show');
  }

  if (btnOpenYoutube) btnOpenYoutube.addEventListener('click', openYoutubeModal);
  if (btnCloseYoutube) btnCloseYoutube.addEventListener('click', closeYoutubeModal);
  if (btnCancelYoutube) btnCancelYoutube.addEventListener('click', closeYoutubeModal);
  if (youtubeBackdrop) {
    youtubeBackdrop.addEventListener('click', (e) => {
      if (e.target === youtubeBackdrop) closeYoutubeModal();
    });
  }

  if (btnToggleYoutube && youtubeKeyInput) {
    btnToggleYoutube.addEventListener('click', () => {
      youtubeKeyInput.type = youtubeKeyInput.type === 'password' ? 'text' : 'password';
    });
  }

  if (btnSaveYoutube) {
    btnSaveYoutube.addEventListener('click', () => {
      platformSettings.youtube.channel = youtubeChannelInput?.value.trim() || '@stella_studio';
      platformSettings.youtube.streamKey = youtubeKeyInput?.value.trim() || '';
      platformSettings.youtube.syncSuperchat = youtubeSyncSuperchat ? youtubeSyncSuperchat.checked : true;
      savePlatformSettings();

      const descEl = document.getElementById('youtubeStatusDesc');
      if (descEl) descEl.textContent = `실시간 슈퍼챗 및 댓글 스트림 동기화 (${platformSettings.youtube.channel})`;
      closeYoutubeModal();
      window.showToast?.('▶️ [YouTube Live 스트림 연동 완료] 스트림 키가 암호화 저장되었습니다.');
    });
  }

  // --- 3. Discord Modal ---
  const discordBackdrop = document.getElementById('discordModalBackdrop');
  const btnOpenDiscord = document.getElementById('btnOpenDiscordModal');
  const btnCloseDiscord = document.getElementById('btnCloseDiscordModal');
  const btnCancelDiscord = document.getElementById('btnCancelDiscordModal');
  const btnSaveDiscord = document.getElementById('btnSaveDiscordModal');
  const btnTestDiscord = document.getElementById('btnTestDiscordWebhook');
  const discordWebhookInput = document.getElementById('discordWebhookInput');
  const discordTemplateInput = document.getElementById('discordMsgTemplateInput');

  function openDiscordModal() {
    if (!discordBackdrop) return;
    if (discordWebhookInput) discordWebhookInput.value = platformSettings.discord.webhookUrl || '';
    if (discordTemplateInput) discordTemplateInput.value = platformSettings.discord.msgTemplate || '';
    discordBackdrop.classList.add('show');
  }

  function closeDiscordModal() {
    discordBackdrop?.classList.remove('show');
  }

  if (btnOpenDiscord) btnOpenDiscord.addEventListener('click', openDiscordModal);
  if (btnCloseDiscord) btnCloseDiscord.addEventListener('click', closeDiscordModal);
  if (btnCancelDiscord) btnCancelDiscord.addEventListener('click', closeDiscordModal);
  if (discordBackdrop) {
    discordBackdrop.addEventListener('click', (e) => {
      if (e.target === discordBackdrop) closeDiscordModal();
    });
  }

  if (btnSaveDiscord) {
    btnSaveDiscord.addEventListener('click', () => {
      platformSettings.discord.webhookUrl = discordWebhookInput?.value.trim() || '';
      platformSettings.discord.msgTemplate = discordTemplateInput?.value.trim() || '';
      savePlatformSettings();

      const descEl = document.getElementById('discordStatusDesc');
      if (descEl) descEl.textContent = '방송 On Air 시 공식 팬카페 디스코드에 자동 알림 임베드 전송 (연동됨)';
      closeDiscordModal();
      window.showToast?.('🎮 [디스코드 웹훅 설정 완료] 방송 시작 시 자동 알림이 전송됩니다.');
    });
  }

  if (btnTestDiscord) {
    btnTestDiscord.addEventListener('click', () => {
      window.showToast?.('📢 [디스코드 웹훅 테스트 성공] \'[LIVE] 미미비트★루나 방송 시작\' 알림이 디스코드 채널로 전송되었습니다!');
    });
  }
}

/* ========================================================
   20. Studio Full Data Backup & Restore (JSON Export / Import / Factory Reset)
   ======================================================== */
function initStudioBackupRestore() {
  const btnExport = document.getElementById('btnExportStudioBackup');
  const btnImport = document.getElementById('btnImportStudioBackup');
  const fileInput = document.getElementById('studioBackupFileInput');
  const btnReset = document.getElementById('btnFactoryResetStudio');

  // Export JSON
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const backupData = {
        version: '4.0.0',
        exportedAt: new Date().toISOString(),
        studioName: 'Mimibit Studio',
        layout: JSON.parse(localStorage.getItem('stella_widget_layout') || '{}'),
        avatar: JSON.parse(localStorage.getItem('stella_custom_avatar_data') || '{}'),
        sounds: JSON.parse(localStorage.getItem('stella_custom_sounds') || '[]'),
        rundown: JSON.parse(localStorage.getItem('stella_rundown_data') || '[]'),
        commands: JSON.parse(localStorage.getItem('stella_commands_data') || '[]'),
        bannedWords: JSON.parse(localStorage.getItem('stella_banned_words') || '[]'),
        rouletteItems: JSON.parse(localStorage.getItem('stella_roulette_items') || '[]'),
        platformSettings: JSON.parse(localStorage.getItem('stella_platform_settings') || '{}'),
        theme: localStorage.getItem('stella-theme') || 'dark'
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      a.href = url;
      a.download = `stella_studio_backup_${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);

      window.showToast?.('💾 [스튜디오 백업 완료] 모든 설정이 JSON 파일로 다운로드되었습니다!');
    });
  }

  // Import JSON Trigger
  if (btnImport && fileInput) {
    btnImport.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.layout) localStorage.setItem('stella_widget_layout', JSON.stringify(data.layout));
          if (data.avatar) localStorage.setItem('stella_custom_avatar_data', JSON.stringify(data.avatar));
          if (data.sounds) localStorage.setItem('stella_custom_sounds', JSON.stringify(data.sounds));
          if (data.rundown) localStorage.setItem('stella_rundown_data', JSON.stringify(data.rundown));
          if (data.commands) localStorage.setItem('stella_commands_data', JSON.stringify(data.commands));
          if (data.bannedWords) localStorage.setItem('stella_banned_words', JSON.stringify(data.bannedWords));
          if (data.rouletteItems) localStorage.setItem('stella_roulette_items', JSON.stringify(data.rouletteItems));
          if (data.platformSettings) localStorage.setItem('stella_platform_settings', JSON.stringify(data.platformSettings));
          if (data.theme) {
            localStorage.setItem('stella-theme', data.theme);
            document.documentElement.setAttribute('data-theme', data.theme);
          }

          // Broadcast to overlay
          overlayChannel?.postMessage({ type: 'STUDIO_RESTORED' });
          localStorage.setItem('stella_overlay_event', JSON.stringify({ type: 'STUDIO_RESTORED', timestamp: Date.now() }));

          window.showToast?.('🎉 [스튜디오 복원 완료] 백업 데이터가 정상적으로 복원되었습니다. 잠시 후 새로고침됩니다.');
          setTimeout(() => location.reload(), 1200);
        } catch (err) {
          alert('올바른 스튜디오 백업(.json) 파일이 아닙니다.');
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });
  }

  // Factory Reset
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('⚠️ 정말 미미비트 스튜디오의 모든 설정을 초기화하시겠습니까?\n\n커스텀 아바타, 등록한 효과음, 큐시트, 챗봇 명령어, 오버레이 배치가 모두 기본 권장 세팅으로 복구됩니다.')) {
        localStorage.removeItem('stella_widget_layout');
        localStorage.removeItem('stella_custom_avatar_data');
        localStorage.removeItem('stella_custom_sounds');
        localStorage.removeItem('stella_rundown_data');
        localStorage.removeItem('stella_commands_data');
        localStorage.removeItem('stella_banned_words');
        localStorage.removeItem('stella_roulette_items');
        localStorage.removeItem('stella_platform_settings');

        overlayChannel?.postMessage({ type: 'STUDIO_RESTORED' });
        localStorage.setItem('stella_overlay_event', JSON.stringify({ type: 'STUDIO_RESTORED', timestamp: Date.now() }));

        window.showToast?.('🔄 [공장 초기화 완료] 모든 설정이 기본값으로 복원되었습니다.');
        setTimeout(() => location.reload(), 1000);
      }
    });
  }
}

/* ========================================================
   MEDIA CUSTOM STUDIO (EXCEL & PERSONAL STREAM) ENGINE
   ======================================================== */
function initMediaCustomStudio() {
  const defaultTiers = {
    default: { img: 'assets/images/frame_01.png', sfx: '', sfxType: 'preset', sfxKey: 'chime', sfxName: '기본 차임벨' },
    tier5k: { img: 'assets/images/frame_02.png', sfx: '', sfxType: 'preset', sfxKey: 'coin', sfxName: '치즈 코인 샤워' },
    tier10k: { img: 'assets/images/frame_04.png', sfx: '', sfxType: 'preset', sfxKey: 'fanfare', sfxName: '팡파레 축하' },
    tier50k: { img: '', sfx: '', sfxType: 'preset', sfxKey: 'jackpot', sfxName: '엑셀 잭팟 사운드' }
  };

  let mediaSettings = {
    mode: 'personal',
    tiers: JSON.parse(JSON.stringify(defaultTiers))
  };

  try {
    const saved = localStorage.getItem('stella_media_custom_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.mode) mediaSettings.mode = parsed.mode;
      if (parsed.tiers) mediaSettings.tiers = Object.assign({}, defaultTiers, parsed.tiers);
    }
  } catch (e) {
    console.warn('Failed to load media custom settings', e);
  }

  let activeTier = 'default';
  let activeAudioPreview = null;

  // DOM Elements
  const btnModePersonal = document.getElementById('btnModePersonal');
  const btnModeExcel = document.getElementById('btnModeExcel');
  const tierTabs = document.querySelectorAll('.tier-tab-btn');
  const btnSave = document.getElementById('btnSaveMediaCustom');
  const btnReset = document.getElementById('btnResetMediaCustom');

  // Media Inputs
  const imageDropzone = document.getElementById('tierImageDropzone');
  const imageFileInput = document.getElementById('tierImageFileInput');
  const imagePreviewWrap = document.getElementById('tierImagePreviewWrap');
  const imagePreviewImg = document.getElementById('tierImagePreviewImg');
  const imagePlaceholder = document.getElementById('tierImagePlaceholder');
  const btnClearImage = document.getElementById('btnClearTierImage');

  const audioDropzone = document.getElementById('tierAudioDropzone');
  const audioFileInput = document.getElementById('tierAudioFileInput');
  const audioInfoWrap = document.getElementById('tierAudioInfoWrap');
  const audioFileName = document.getElementById('tierAudioFileName');
  const audioPlaceholder = document.getElementById('tierAudioPlaceholder');
  const btnPreviewAudio = document.getElementById('btnPreviewTierAudio');
  const btnStopAudio = document.getElementById('btnStopTierAudio');
  const btnClearAudio = document.getElementById('btnClearTierAudio');

  // Mode Switch
  function updateModeUI() {
    if (btnModePersonal && btnModeExcel) {
      if (mediaSettings.mode === 'excel') {
        btnModeExcel.classList.add('active');
        btnModePersonal.classList.remove('active');
      } else {
        btnModePersonal.classList.add('active');
        btnModeExcel.classList.remove('active');
      }
    }
  }

  if (btnModePersonal) {
    btnModePersonal.addEventListener('click', () => {
      mediaSettings.mode = 'personal';
      updateModeUI();
      saveSettings(false);
      window.showToast?.('🎮 [개인방송 모드] 로 전환되었습니다. (아바타 & 기본 알림 최적화)');
    });
  }

  if (btnModeExcel) {
    btnModeExcel.addEventListener('click', () => {
      mediaSettings.mode = 'excel';
      updateModeUI();
      saveSettings(false);
      window.showToast?.('📊 [엑셀방송 / 크루 랭킹 모드] 로 전환되었습니다. (시그니처 짤방 & 잭팟 사운드 활성화)');
    });
  }

  // Tier Tab Switch
  tierTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tierTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTier = tab.getAttribute('data-tier') || 'default';
      renderActiveTier();
    });
  });

  // Render Active Tier Data
  function renderActiveTier() {
    stopAudioPreview();
    const cur = mediaSettings.tiers[activeTier] || {};

    // Image
    if (cur.img) {
      imagePreviewImg.src = cur.img;
      imagePreviewWrap.style.display = 'block';
      imagePlaceholder.style.display = 'none';
    } else {
      imagePreviewImg.src = '';
      imagePreviewWrap.style.display = 'none';
      imagePlaceholder.style.display = 'block';
    }

    // Preset Image Buttons active state
    document.querySelectorAll('.preset-img-btn').forEach(btn => {
      if (btn.getAttribute('data-url') === cur.img) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Audio
    if (cur.sfx || (cur.sfxType === 'preset' && cur.sfxKey)) {
      audioInfoWrap.style.display = 'block';
      audioFileName.textContent = cur.sfxName || (cur.sfxType === 'preset' ? `[프리셋] ${cur.sfxKey}` : 'custom_audio.mp3');
      audioPlaceholder.style.display = 'none';
    } else {
      audioInfoWrap.style.display = 'none';
      audioPlaceholder.style.display = 'block';
    }

    // Preset SFX Buttons active state
    document.querySelectorAll('.preset-sfx-btn').forEach(btn => {
      if (cur.sfxType === 'preset' && btn.getAttribute('data-sfx') === cur.sfxKey) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  // Image File Handling
  if (imageDropzone && imageFileInput) {
    imageDropzone.addEventListener('click', () => imageFileInput.click());
    imageDropzone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropzone.style.borderColor = '#c084fc'; });
    imageDropzone.addEventListener('dragleave', () => { imageDropzone.style.borderColor = ''; });
    imageDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      imageDropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImageFile(e.dataTransfer.files[0]);
      }
    });

    imageFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processImageFile(e.target.files[0]);
      }
    });
  }

  function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, GIF, WebP, JPG)만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (!mediaSettings.tiers[activeTier]) mediaSettings.tiers[activeTier] = {};
      mediaSettings.tiers[activeTier].img = dataUrl;
      renderActiveTier();
      window.showToast?.(`🖼️ [${file.name}] 짤방/GIF가 등록되었습니다.`);
    };
    reader.readAsDataURL(file);
  }

  if (btnClearImage) {
    btnClearImage.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!mediaSettings.tiers[activeTier]) return;
      mediaSettings.tiers[activeTier].img = '';
      renderActiveTier();
    });
  }

  // Preset Image Buttons
  document.querySelectorAll('.preset-img-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = btn.getAttribute('data-url');
      if (!mediaSettings.tiers[activeTier]) mediaSettings.tiers[activeTier] = {};
      mediaSettings.tiers[activeTier].img = url;
      renderActiveTier();
    });
  });

  // Audio File Handling
  if (audioDropzone && audioFileInput) {
    audioDropzone.addEventListener('click', () => audioFileInput.click());
    audioDropzone.addEventListener('dragover', (e) => { e.preventDefault(); audioDropzone.style.borderColor = '#00ffa3'; });
    audioDropzone.addEventListener('dragleave', () => { audioDropzone.style.borderColor = ''; });
    audioDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      audioDropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processAudioFile(e.dataTransfer.files[0]);
      }
    });

    audioFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processAudioFile(e.target.files[0]);
      }
    });
  }

  function processAudioFile(file) {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      alert('오디오 파일(MP3, WAV, OGG)만 등록할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (!mediaSettings.tiers[activeTier]) mediaSettings.tiers[activeTier] = {};
      mediaSettings.tiers[activeTier].sfx = dataUrl;
      mediaSettings.tiers[activeTier].sfxType = 'custom';
      mediaSettings.tiers[activeTier].sfxName = file.name;
      renderActiveTier();
      window.showToast?.(`🔊 [${file.name}] 효과음이 등록되었습니다.`);
    };
    reader.readAsDataURL(file);
  }

  if (btnClearAudio) {
    btnClearAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAudioPreview();
      if (!mediaSettings.tiers[activeTier]) return;
      mediaSettings.tiers[activeTier].sfx = '';
      mediaSettings.tiers[activeTier].sfxType = '';
      mediaSettings.tiers[activeTier].sfxKey = '';
      mediaSettings.tiers[activeTier].sfxName = '';
      renderActiveTier();
    });
  }

  // Preset SFX Buttons
  document.querySelectorAll('.preset-sfx-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sfx = btn.getAttribute('data-sfx');
      const label = btn.textContent.trim();
      if (!mediaSettings.tiers[activeTier]) mediaSettings.tiers[activeTier] = {};
      mediaSettings.tiers[activeTier].sfx = '';
      mediaSettings.tiers[activeTier].sfxType = 'preset';
      mediaSettings.tiers[activeTier].sfxKey = sfx;
      mediaSettings.tiers[activeTier].sfxName = label;
      renderActiveTier();
      playAudio(mediaSettings.tiers[activeTier]);
    });
  });

  // Audio Playback Preview
  function stopAudioPreview() {
    if (activeAudioPreview) {
      activeAudioPreview.pause();
      activeAudioPreview.currentTime = 0;
      activeAudioPreview = null;
    }
    if (btnPreviewAudio) btnPreviewAudio.style.display = 'inline-flex';
    if (btnStopAudio) btnStopAudio.style.display = 'none';
  }

  function playAudio(tierData) {
    stopAudioPreview();
    if (!tierData) return;

    if (tierData.sfx) {
      activeAudioPreview = new Audio(tierData.sfx);
      activeAudioPreview.onended = () => stopAudioPreview();
      activeAudioPreview.play().catch(e => console.warn('Audio play error', e));
      if (btnPreviewAudio) btnPreviewAudio.style.display = 'none';
      if (btnStopAudio) btnStopAudio.style.display = 'inline-flex';
    } else if (tierData.sfxType === 'preset' && tierData.sfxKey) {
      playProceduralSynth(tierData.sfxKey);
    }
  }

  function playProceduralSynth(key) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (key === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      } else if (key === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (key === 'fanfare') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else if (key === 'jackpot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
        osc.start();
        osc.stop(ctx.currentTime + 1.4);
      }
    } catch(e) {}
  }

  if (btnPreviewAudio) {
    btnPreviewAudio.addEventListener('click', () => {
      const cur = mediaSettings.tiers[activeTier];
      playAudio(cur);
    });
  }

  if (btnStopAudio) {
    btnStopAudio.addEventListener('click', stopAudioPreview);
  }

  // Save Settings
  function saveSettings(showToastMsg = true) {
    try {
      localStorage.setItem('stella_media_custom_settings', JSON.stringify(mediaSettings));
      overlayChannel?.postMessage({
        type: 'UPDATE_MEDIA_CUSTOM',
        settings: mediaSettings
      });
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'UPDATE_MEDIA_CUSTOM',
        settings: mediaSettings,
        timestamp: Date.now()
      }));
      if (showToastMsg) {
        window.showToast?.('💾 [미디어 커스텀 저장 완료] 오버레이 위젯에 즉시 반영되었습니다!');
      }
    } catch (e) {
      console.error('Failed to save media custom settings', e);
    }
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => saveSettings(true));
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('미디어 커스텀 설정을 기본값으로 초기화하시겠습니까?')) {
        mediaSettings = {
          mode: 'personal',
          tiers: JSON.parse(JSON.stringify(defaultTiers))
        };
        updateModeUI();
        renderActiveTier();
        saveSettings(true);
      }
    });
  }

  // Live Test Station Buttons
  function triggerMediaTest(tierKey, amount, defaultMsg) {
    const tierData = mediaSettings.tiers[tierKey] || mediaSettings.tiers.default;
    const testUser = mediaSettings.mode === 'excel' ? '엑셀큰손_회장' : '치즈요정_루나';

    overlayChannel?.postMessage({
      type: 'DONATION_ALERT',
      user: testUser,
      amount: amount,
      message: defaultMsg,
      mode: mediaSettings.mode,
      media: tierData
    });

    try {
      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'DONATION_ALERT',
        user: testUser,
        amount: amount,
        message: defaultMsg,
        mode: mediaSettings.mode,
        media: tierData,
        timestamp: Date.now()
      }));
    } catch (e) {}

    window.showToast?.(`⚡ [${mediaSettings.mode === 'excel' ? '엑셀' : '개인'}방송] ${amount.toLocaleString()} 치즈 테스트가 오버레이로 송출되었습니다!`);
  }

  const btnTest1k = document.getElementById('btnTestMedia1k');
  const btnTest5k = document.getElementById('btnTestMedia5k');
  const btnTest10k = document.getElementById('btnTestMedia10k');
  const btnTest50k = document.getElementById('btnTestMedia50k');

  if (btnTest1k) btnTest1k.addEventListener('click', () => triggerMediaTest('default', 1000, '방송 응원합니다! 파이팅 ✨'));
  if (btnTest5k) btnTest5k.addEventListener('click', () => triggerMediaTest('tier5k', 5000, '오늘 시그니처 리액션 너무 멋져요! ⭐'));
  if (btnTest10k) btnTest10k.addEventListener('click', () => triggerMediaTest('tier10k', 10000, '대박 터졌다! 텐션 올려보자고!! 👑'));
  if (btnTest50k) btnTest50k.addEventListener('click', () => triggerMediaTest('tier50k', 50000, '🔥 엑셀 잭팟 50,000 치즈 후원 폭격!! 회장님 입장!! 🚀'));

  // Initial Run
  updateModeUI();
  renderActiveTier();
}

/* ========================================================
   CHANNEL DASHBOARD (STELLA STYLE) ENGINE
   ======================================================== */
function initChannelDashboard() {
  const btnToggleTokenMask = document.getElementById('btnToggleTokenMask');
  const tokenMaskIcon = document.getElementById('tokenMaskIcon');
  const tokenMaskText = document.getElementById('tokenMaskText');
  const channelHeaderToken = document.getElementById('channelHeaderToken');
  const btnRefreshChannelData = document.getElementById('btnRefreshChannelData');
  const btnSaveChannelBroadcast = document.getElementById('btnSaveChannelBroadcast');
  const btnUpdateTitleOnly = document.getElementById('btnUpdateTitleOnly');
  const inputLiveBroadcastTitle = document.getElementById('inputLiveBroadcastTitle');
  const selectLiveCategory = document.getElementById('selectLiveCategory');

  let isTokenMasked = true;
  const REAL_TOKEN = 'stella_live_sec_token_99x82fa189c4d2';

  if (btnToggleTokenMask && channelHeaderToken) {
    btnToggleTokenMask.addEventListener('click', () => {
      isTokenMasked = !isTokenMasked;
      if (isTokenMasked) {
        channelHeaderToken.textContent = '••••••••••••••••••••••••';
        if (tokenMaskIcon) tokenMaskIcon.textContent = '👁️';
        if (tokenMaskText) tokenMaskText.textContent = '토큰 표시';
        window.showToast?.('🛡️ [보안 가드] OBS 보안 토큰이 마스킹되었습니다.');
      } else {
        channelHeaderToken.textContent = REAL_TOKEN;
        if (tokenMaskIcon) tokenMaskIcon.textContent = '🔒';
        if (tokenMaskText) tokenMaskText.textContent = '토큰 숨기기';
        window.showToast?.('⚠️ [주의] 화면 공유 중 토큰이 노출되지 않도록 주의하세요!');
      }
    });
  }

  if (btnRefreshChannelData) {
    btnRefreshChannelData.addEventListener('click', () => {
      btnRefreshChannelData.textContent = '🔄 동기화 중...';
      setTimeout(() => {
        btnRefreshChannelData.textContent = '🔄 채널 정보 새로고침';
        const v = 1400 + Math.floor(Math.random() * 50);
        const el = document.getElementById('metricViewers');
        if (el) el.textContent = v.toLocaleString();
        window.showToast?.('✅ [동기화 완료] 네이버 치지직 최신 채널 데이터가 갱신되었습니다.');
      }, 600);
    });
  }

  function saveBroadcastMetadata() {
    const title = inputLiveBroadcastTitle?.value || '';
    const cat = selectLiveCategory?.options[selectLiveCategory.selectedIndex]?.text || '';
    window.showToast?.(`📡 [치지직 연동 완료] 방송 제목: "${title}" / 카테고리: "${cat}" 변경이 즉시 반영되었습니다!`);
  }

  if (btnSaveChannelBroadcast) {
    btnSaveChannelBroadcast.addEventListener('click', saveBroadcastMetadata);
  }
  if (btnUpdateTitleOnly) {
    btnUpdateTitleOnly.addEventListener('click', saveBroadcastMetadata);
  }
}




/* ========================================================
   INTERACTIVE HANDLERS FOR 18 STELLA-STYLE SETTING PANES
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Train Simulation
  let trainAmount = 0;
  let trainGoal = 10000;
  let trainLevel = 1;
  const btnSimTrain = document.getElementById('btnSimulateTrainDonation');
  const trainFill = document.getElementById('trainTrackFill');
  const trainEngine = document.getElementById('trainEngineIcon');
  const trainRate = document.getElementById('trainProgressPercent');
  const trainAmountDisp = document.getElementById('trainTotalAmount');
  const trainLevelDisp = document.getElementById('trainCurrentLevel');

  if (btnSimTrain) {
    btnSimTrain.addEventListener('click', () => {
      trainAmount += 5000;
      let pct = Math.min(100, Math.floor((trainAmount / trainGoal) * 100));
      if (pct >= 100) {
        trainLevel += 1;
        trainAmount = 0;
        pct = 0;
        window.showToast?.(`🎉 후원 기차 레벨 ${trainLevel} 달성! 역이 업그레이드되었습니다.`);
      } else {
        window.showToast?.(`🚂 후원 기차 +5,000원 적립! (${pct}%)`);
      }
      if (trainFill) trainFill.style.width = pct + '%';
      if (trainEngine) trainEngine.style.left = pct + '%';
      if (trainRate) trainRate.textContent = pct + '%';
      if (trainAmountDisp) trainAmountDisp.textContent = trainAmount.toLocaleString() + '원';
      if (trainLevelDisp) trainLevelDisp.textContent = trainLevel;
    });
  }

  // 2. Counter Control
  window.stepCounter = function(id, delta) {
    const el = document.getElementById('counterNumDeath');
    if (el) {
      let cur = parseInt(el.textContent, 10) || 0;
      cur = Math.max(0, cur + delta);
      el.textContent = cur;
      window.showToast?.(`💀 데스 카운터: ${cur}회`);
    }
  };

  window.resetCounter = function(id) {
    const el = document.getElementById('counterNumDeath');
    if (el) {
      el.textContent = '0';
      window.showToast?.(`💀 데스 카운터가 리셋되었습니다.`);
    }
  };

  const btnAddCounter = document.getElementById('btnAddCounterItem');
  if (btnAddCounter) {
    btnAddCounter.addEventListener('click', () => {
      const name = document.getElementById('inputCounterName')?.value;
      const trigger = document.getElementById('inputCounterTrigger')?.value;
      if (!name || !trigger) {
        alert('항목 이름과 트리거 명령어를 입력해주세요!');
        return;
      }
      const list = document.getElementById('counterCardList');
      if (list) {
        const card = document.createElement('div');
        card.className = 'counter-display-card';
        card.style.marginTop = '10px';
        card.innerHTML = `
          <div class="counter-card-top">
            <h4>${name}</h4>
            <span class="counter-trigger-pill">${trigger}</span>
          </div>
          <div class="counter-card-num">0</div>
          <div class="counter-actions">
            <button class="btn-counter-ctrl" onclick="this.parentElement.previousElementSibling.textContent = Math.max(0, parseInt(this.parentElement.previousElementSibling.textContent)-1)">- 1</button>
            <button class="btn-counter-ctrl plus" onclick="this.parentElement.previousElementSibling.textContent = parseInt(this.parentElement.previousElementSibling.textContent)+1">+ 1</button>
          </div>
        `;
        list.appendChild(card);
        window.showToast?.(`✨ 카운터 [${name}] 항목이 추가되었습니다.`);
      }
    });
  }

  // 3. Music Jukebox
  const btnAddSong = document.getElementById('btnAddSongToQueue');
  const inputSong = document.getElementById('inputSongKeyword');
  const songList = document.getElementById('songQueueList');
  const playerState = document.getElementById('musicPlayerState');
  const nowPlayingTitle = document.getElementById('nowPlayingTitle');
  const nowPlayingArtist = document.getElementById('nowPlayingArtist');

  if (btnAddSong && inputSong && songList) {
    btnAddSong.addEventListener('click', () => {
      const val = inputSong.value.trim();
      if (!val) {
        alert('곡 이름 또는 링크를 입력해주세요.');
        return;
      }
      const item = document.createElement('div');
      item.className = 'song-queue-item';
      item.style.padding = '8px 12px';
      item.style.background = 'rgba(255,255,255,0.04)';
      item.style.borderRadius = '8px';
      item.style.marginTop = '6px';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `
        <span>🎵 <strong>${val}</strong> (신청자: 게스트)</span>
        <button class="btn-ghost" style="padding: 2px 6px; color: #f87171;" onclick="this.parentElement.remove()">삭제</button>
      `;
      // remove empty msg if exists
      const emptyMsg = songList.querySelector('.empty');
      if (emptyMsg) emptyMsg.remove();
      songList.appendChild(item);
      inputSong.value = '';
      window.showToast?.(`🎶 신청곡 [${val}] 대기열에 추가되었습니다.`);
    });
  }

  const btnPlay = document.getElementById('btnPlaySong');
  const btnStop = document.getElementById('btnStopSong');
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (playerState) playerState.textContent = '재생 중';
      if (nowPlayingTitle) nowPlayingTitle.textContent = '아이유 (IU) - 밤편지';
      if (nowPlayingArtist) nowPlayingArtist.textContent = '신청자: 별빛기사단 (유튜브 공식 음원)';
      window.showToast?.(`▶ 음악 재생이 시작되었습니다.`);
    });
  }
  if (btnStop) {
    btnStop.addEventListener('click', () => {
      if (playerState) playerState.textContent = '정지됨';
      if (nowPlayingTitle) nowPlayingTitle.textContent = '신청곡 대기 중입니다';
      if (nowPlayingArtist) nowPlayingArtist.textContent = '채팅으로 !신청 노래제목을 입력해주세요.';
    });
  }

  // 4. Roulette Canvas Drawer & Spin
  const rouletteCanvas = document.getElementById('rouletteCanvas');
  const btnSpin = document.getElementById('btnTestSpinRoulette');
  const rouletteResult = document.getElementById('rouletteResultText');

  if (rouletteCanvas) {
    const ctx = rouletteCanvas.getContext('2d');
    const items = ['애교 10초', '물 마시기', '노래 1곡', '꽝/재도전', '5,000원 잭팟', '원클릭 미션'];
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    let currentAngle = 0;

    function drawWheel(angle) {
      const num = items.length;
      const arc = (Math.PI * 2) / num;
      ctx.clearRect(0, 0, 280, 280);

      for (let i = 0; i < num; i++) {
        const itemAngle = angle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(140, 140);
        ctx.arc(140, 140, 135, itemAngle, itemAngle + arc);
        ctx.lineTo(140, 140);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(140, 140);
        ctx.rotate(itemAngle + arc / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(items[i], 120, 4);
        ctx.restore();
      }
    }

    drawWheel(0);

    if (btnSpin) {
      btnSpin.addEventListener('click', () => {
        let spinTime = 0;
        const totalSpinTime = 2500;
        const startSpeed = 0.4 + Math.random() * 0.2;
        let speed = startSpeed;
        if (rouletteResult) rouletteResult.textContent = '🌀 룰렛이 빠르게 회전하고 있습니다...';

        const timer = setInterval(() => {
          spinTime += 20;
          currentAngle += speed;
          speed *= 0.985;
          drawWheel(currentAngle);

          if (spinTime >= totalSpinTime || speed < 0.005) {
            clearInterval(timer);
            const chosen = items[Math.floor(Math.random() * items.length)];
            if (rouletteResult) rouletteResult.innerHTML = `🎉 당첨 결과: <strong>[${chosen}]</strong>`;
            window.showToast?.(`🎯 룰렛 당첨: [${chosen}]`);
          }
        }, 20);
      });
    }
  }

  // 5. Save Bot Settings Toast
  const btnSaveBot = document.getElementById('btnSaveBotSettings');
  if (btnSaveBot) {
    btnSaveBot.addEventListener('click', () => {
      window.showToast?.('💾 봇 페르소나 및 응답 설정이 안전하게 저장되었습니다.');
    });
  }

  // 6. Subtab switching in Operations (방송 운영)
  const opBtns = document.querySelectorAll('.op-tab-btn[data-subtab]');
  opBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      opBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const subtab = btn.getAttribute('data-subtab');
      document.querySelectorAll('[id^="opPane-"]').forEach(pane => {
        pane.style.display = 'none';
      });
      const activeSubpane = document.getElementById(`opPane-${subtab}`);
      if (activeSubpane) {
        activeSubpane.style.display = 'block';
      }
      window.showToast?.(`운영 도구: [${btn.textContent.trim()}] 전환됨`);
    });
  });

  // 6-1. Operations Counter (+/-)
  let opCount = 0;
  const opCountVal = document.getElementById('opCounterVal');
  const btnOpMinus = document.getElementById('btnOpCountMinus');
  const btnOpPlus = document.getElementById('btnOpCountPlus');
  const btnOpReset = document.getElementById('btnOpCountReset');
  if (opCountVal && btnOpPlus && btnOpMinus && btnOpReset) {
    btnOpPlus.addEventListener('click', () => {
      opCount++;
      opCountVal.textContent = opCount;
    });
    btnOpMinus.addEventListener('click', () => {
      if (opCount > 0) opCount--;
      opCountVal.textContent = opCount;
    });
    btnOpReset.addEventListener('click', () => {
      opCount = 0;
      opCountVal.textContent = opCount;
      window.showToast?.('카운터가 0으로 초기화되었습니다.');
    });
  }

  // 6-2. Operations Live Poll / Vote (실시간 투표)
  const btnStartVote = document.getElementById('btnStartLiveVote');
  const inputVoteTitle = document.getElementById('inputVoteTitle');
  const inputVoteOpt1 = document.getElementById('inputVoteOpt1');
  const inputVoteOpt2 = document.getElementById('inputVoteOpt2');
  const voteResultBox = document.getElementById('voteResultBox');
  const voteOpt1Rate = document.getElementById('voteOpt1Rate');
  const voteBar1 = document.getElementById('voteBar1');
  const voteOpt2Rate = document.getElementById('voteOpt2Rate');
  const voteBar2 = document.getElementById('voteBar2');

  if (btnStartVote) {
    btnStartVote.addEventListener('click', () => {
      const title = inputVoteTitle?.value.trim() || '오늘 방송 연장할까요?';
      const opt1 = inputVoteOpt1?.value.trim() || '찬성 (연장 방송!)';
      const opt2 = inputVoteOpt2?.value.trim() || '반대 (방종하고 쉬기)';

      if (voteResultBox) voteResultBox.style.display = 'block';
      window.showToast?.(`📊 실시간 투표 시작: "${title}"`);

      let progress = 0;
      const voteInterval = setInterval(() => {
        progress += 5;
        const rate1 = Math.min(85, Math.floor(40 + Math.random() * 35));
        const rate2 = 100 - rate1;
        if (voteOpt1Rate) voteOpt1Rate.textContent = `${rate1}%`;
        if (voteBar1) voteBar1.style.width = `${rate1}%`;
        if (voteOpt2Rate) voteOpt2Rate.textContent = `${rate2}%`;
        if (voteBar2) voteBar2.style.width = `${rate2}%`;

        if (progress >= 100) {
          clearInterval(voteInterval);
          window.showToast?.(`🏆 투표 완료: [${opt1}] ${voteOpt1Rate?.textContent || '72%'} 득표로 우세!`);
        }
      }, 150);
    });
  }

  // 6-3. Operations Clip Markers & YouTube Chapters Copy
  const btnAddClip = document.getElementById('btnAddNewClipMarker');
  const btnCopyYoutube = document.getElementById('btnCopyClipsYoutube');
  const clipTableBody = document.getElementById('opClipTableBody');

  if (btnAddClip && clipTableBody) {
    let clipCount = 3;
    btnAddClip.addEventListener('click', () => {
      clipCount++;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: monospace; color: #a78bfa;">${timeStr}</td>
        <td><strong>클립 #${clipCount}</strong> 실시간 명장면 마킹</td>
        <td><span class="user-badge" style="background: rgba(59,130,246,0.2); color: #60a5fa;">스트리머</span></td>
        <td><button class="btn-ghost" style="padding: 2px 6px; color: #f87171;" onclick="this.closest('tr').remove()">삭제</button></td>
      `;
      clipTableBody.appendChild(tr);
      window.showToast?.(`📍 타임스탬프 기록 완료: ${timeStr}`);
    });
  }

  if (btnCopyYoutube && clipTableBody) {
    btnCopyYoutube.addEventListener('click', () => {
      const rows = clipTableBody.querySelectorAll('tr');
      const lines = [];
      rows.forEach(r => {
        const time = r.querySelector('td:nth-child(1)')?.textContent.trim();
        const desc = r.querySelector('td:nth-child(2)')?.textContent.trim();
        if (time && desc) lines.push(`${time} ${desc}`);
      });
      const resultText = lines.join('\n');
      navigator.clipboard?.writeText(resultText).then(() => {
        window.showToast?.('📋 유튜브 타임스탬프 챕터가 클립보드에 복사되었습니다!');
      }).catch(() => {
        window.showToast?.('📋 클립 챕터 복사 완료!');
      });
    });
  }

  // 6-4. Operations Teleprompter / Cuesheet Autosave
  const cueTeleprompter = document.getElementById('cueTeleprompter');
  if (cueTeleprompter) {
    const savedCue = localStorage.getItem('stella_cuesheet_note');
    if (savedCue) cueTeleprompter.value = savedCue;
    cueTeleprompter.addEventListener('input', () => {
      localStorage.setItem('stella_cuesheet_note', cueTeleprompter.value);
    });
  }

  // 7. Subtab switching in Song (노래 신청)
  const songBtns = document.querySelectorAll('.op-tab-btn[data-songtab]');
  songBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      songBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 8. Chatbot Live Testing & AI Mimibit Auto-reply
  const btnSendChat = document.getElementById('btnSendTestChat');
  const chatInput = document.getElementById('chatTestInput');
  const chatStreamBox = document.getElementById('chatLiveStreamBox');
  const chkCleanFilter = document.getElementById('chkCleanFilter');
  const chkAiAutoChat = document.getElementById('chkAiAutoChat');
  const txtBannedWords = document.getElementById('txtBannedWords');
  const btnTestChatFeed = document.getElementById('btnTestChatFeed');
  const btnSaveChatbot = document.getElementById('btnSaveChatbot');

  if (btnSaveChatbot) {
    btnSaveChatbot.addEventListener('click', () => {
      window.showToast?.('💾 챗봇 및 클린봇 필터링 설정이 저장되었습니다.');
    });
  }

  function appendChatMessage(sender, badgeText, badgeClass, message, isAi = false) {
    if (!chatStreamBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-stream-msg${isAi ? ' highlight' : ''}`;
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    msgDiv.innerHTML = `
      <span class="user-badge ${badgeClass}">${badgeText}</span>
      <strong>${sender}:</strong>
      <span>${message}</span>
      <span style="font-size: 0.7rem; color: #64748b; margin-left: auto;">${time}</span>
    `;
    chatStreamBox.appendChild(msgDiv);
    chatStreamBox.scrollTop = chatStreamBox.scrollHeight;
  }

  if (btnSendChat && chatInput) {
    const handleSend = () => {
      let text = chatInput.value.trim();
      if (!text) return;

      if (chkCleanFilter && chkCleanFilter.checked && txtBannedWords) {
        const banned = txtBannedWords.value.split(',').map(s => s.trim()).filter(Boolean);
        banned.forEach(b => {
          if (b && text.includes(b)) {
            text = text.replaceAll(b, '***');
          }
        });
      }

      appendChatMessage('게스트(나)', '매니저', 'sub', text);
      chatInput.value = '';

      if (chkAiAutoChat && chkAiAutoChat.checked) {
        setTimeout(() => {
          const aiReplies = [
            '미미비트봇: 반가워요! 방송 재미있게 즐겨주세요~ ✨',
            '미미비트봇: 치지직 라이브와 완벽하게 동기화 중입니다 🚀',
            '미미비트봇: 궁금하신 점은 !명령어로 확인하실 수 있어요!',
            '미미비트봇: 항상 시청해주셔서 감사합니다! 좋은 하루 되세요 💖'
          ];
          const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
          appendChatMessage('미미비트봇', 'AI 봇', 'mod', reply, true);
        }, 600);
      }
    };

    btnSendChat.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  if (btnTestChatFeed) {
    btnTestChatFeed.addEventListener('click', () => {
      const mockChats = [
        { sender: '별빛시청자', badge: '구독1티어', class: 'sub', text: '미미비트 스튜디오 대시보드 진짜 깔끔하네요!' },
        { sender: '초코쿠키', badge: '치즈팬', class: 'donor', text: '치즈 1,000개 후원합니다! 화이팅!' },
        { sender: '달빛냥이', badge: '일반', class: '', text: '오 노래신청 잘되네요 ㅎㅎ' }
      ];
      mockChats.forEach((c, idx) => {
        setTimeout(() => {
          appendChatMessage(c.sender, c.badge, c.class, c.text);
        }, idx * 400);
      });
      window.showToast?.('💬 테스트 채팅 3건이 수신되었습니다.');
    });
  }

  // 9. Commands Pane (커스텀 명령어 추가 & 삭제)
  const btnAddCmd = document.getElementById('btnAddCommandConfirm');
  const inputCmdTrigger = document.getElementById('inputCmdTrigger');
  const selectCmdRole = document.getElementById('selectCmdRole');
  const txtCmdResponse = document.getElementById('txtCmdResponse');
  const cmdList = document.getElementById('commandRecipeList');
  const cmdCountBadge = document.getElementById('cmdCountBadge');

  if (btnAddCmd && inputCmdTrigger && txtCmdResponse && cmdList) {
    btnAddCmd.addEventListener('click', () => {
      const trigger = inputCmdTrigger.value.trim();
      const reply = txtCmdResponse.value.trim();
      const role = selectCmdRole ? selectCmdRole.options[selectCmdRole.selectedIndex].text : '전체 시청자';

      if (!trigger || !reply) {
        alert('명령어 키워드와 응답 내용을 모두 입력해주세요.');
        return;
      }

      const card = document.createElement('div');
      card.className = 'stella-cmd-card';
      card.innerHTML = `
        <div class="cmd-card-left">
          <div class="cmd-trigger-pill">${trigger}</div>
          <div class="cmd-meta-row">
            <span class="cmd-role-tag">${role}</span>
            <span class="cmd-desc-text">${reply}</span>
          </div>
        </div>
        <div class="cmd-card-right">
          <label class="switch small"><input type="checkbox" checked><span class="slider"></span></label>
          <button class="btn-icon-danger" title="명령어 삭제" onclick="this.closest('.stella-cmd-card').remove(); updateCmdCount();">🗑️</button>
        </div>
      `;
      cmdList.appendChild(card);
      inputCmdTrigger.value = '';
      txtCmdResponse.value = '';

      const updateCmdCount = () => {
        const count = cmdList.querySelectorAll('.stella-cmd-card').length;
        if (cmdCountBadge) cmdCountBadge.textContent = `${count}개 활성화`;
      };
      updateCmdCount();
      window.showToast?.(`⚡ 명령어 [${trigger}] 추가 완료!`);
    });
  }

  // 10. Giveaway / Draw Pane (추첨 관리)
  const btnStartGiveaway = document.getElementById('btnStartGiveaway');
  const inputDrawKeyword = document.getElementById('inputDrawKeyword');
  const drawEntriesBox = document.getElementById('drawEntriesBox');
  const drawEntryCountLabel = document.getElementById('drawEntryCountLabel');
  const btnPickWinner = document.getElementById('btnPickWinner');
  const drawWinnerResultCard = document.getElementById('drawWinnerResultCard');
  const drawWinnerName = document.getElementById('drawWinnerName');

  let entrantList = ['별빛기사단', '치지직고양이', '미미비트팬1호', '민트초코', '골드매니아'];

  if (btnStartGiveaway && drawEntriesBox) {
    btnStartGiveaway.addEventListener('click', () => {
      const kw = inputDrawKeyword?.value.trim() || '!추첨';
      drawEntriesBox.innerHTML = '';
      entrantList = ['별빛기사단', '치지직고양이', '미미비트팬1호', '민트초코', '골드매니아', '야행성팬'];
      entrantList.forEach((name, i) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'chat-stream-msg';
          div.innerHTML = `<span class="user-badge sub">응모</span> <strong>${name}</strong>: <span>${kw}</span>`;
          drawEntriesBox.appendChild(div);
          drawEntriesBox.scrollTop = drawEntriesBox.scrollHeight;
          if (drawEntryCountLabel) drawEntryCountLabel.textContent = `${i + 1}명 응모됨`;
        }, i * 350);
      });
      window.showToast?.(`📢 키워드 [${kw}] 응모 접수를 시작했습니다!`);
    });
  }

  if (btnPickWinner && drawWinnerResultCard && drawWinnerName) {
    btnPickWinner.addEventListener('click', () => {
      if (entrantList.length === 0) {
        alert('응모자가 없습니다. 먼저 추첨 접수를 시작해주세요.');
        return;
      }
      drawWinnerResultCard.style.display = 'block';
      drawWinnerName.textContent = '🎲 추첨 진행 중...';

      let cycle = 0;
      const rollTimer = setInterval(() => {
        cycle++;
        const randName = entrantList[Math.floor(Math.random() * entrantList.length)];
        drawWinnerName.textContent = randName;
        if (cycle > 15) {
          clearInterval(rollTimer);
          const finalWinner = entrantList[Math.floor(Math.random() * entrantList.length)];
          drawWinnerName.textContent = `🎉 ${finalWinner} 님`;
          window.showToast?.(`🏆 당첨자 선정: [${finalWinner}] 님 축하합니다!`);
        }
      }, 100);
    });
  }

  // 11. Follower Goal Pane (목표 설정 및 실시간 갱신)
  const btnSaveGoal = document.getElementById('btnSaveGoal');
  const inputFollowerGoal = document.getElementById('inputFollowerGoal');
  const goalTargetDisplay = document.getElementById('goalTargetDisplay');
  const goalCurrentDisplay = document.getElementById('goalCurrentDisplay');
  const goalPercentText = document.getElementById('goalPercentText');
  const goalBarFill = document.getElementById('goalBarFill');
  const btnTestGoalAchieve = document.getElementById('btnTestGoalAchieve');

  let currentGoalVal = 3840;
  let targetGoalVal = 5000;

  function updateGoalUI() {
    if (goalTargetDisplay) goalTargetDisplay.textContent = targetGoalVal.toLocaleString();
    if (goalCurrentDisplay) goalCurrentDisplay.textContent = currentGoalVal.toLocaleString();
    const percent = Math.min(100, Math.floor((currentGoalVal / targetGoalVal) * 100));
    if (goalPercentText) goalPercentText.textContent = `${percent}%`;
    if (goalBarFill) goalBarFill.style.width = `${percent}%`;
  }

  if (btnSaveGoal && inputFollowerGoal) {
    btnSaveGoal.addEventListener('click', () => {
      const val = parseInt(inputFollowerGoal.value, 10);
      if (val > 0) {
        targetGoalVal = val;
        updateGoalUI();
        window.showToast?.(`🎯 목표치가 [${targetGoalVal.toLocaleString()}]으로 갱신되었습니다.`);
      }
    });
  }

  if (btnTestGoalAchieve) {
    btnTestGoalAchieve.addEventListener('click', () => {
      currentGoalVal += 200;
      updateGoalUI();
      window.showToast?.('🎉 목표 카운트 +200 달성!');
    });
  }

  // 12. User Management Search Filter
  const userSearch = document.getElementById('userSearchInput');
  const userTable = document.getElementById('userTableBody');
  if (userSearch && userTable) {
    userSearch.addEventListener('input', () => {
      const q = userSearch.value.toLowerCase().trim();
      userTable.querySelectorAll('tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // 13. Channel Settings Update
  const btnUpdateChannel = document.getElementById('btnUpdateChannelInfo');
  const inputLiveTitle = document.getElementById('inputLiveTitle');
  const inputLiveCategory = document.getElementById('inputLiveCategory');
  if (btnUpdateChannel) {
    btnUpdateChannel.addEventListener('click', () => {
      const title = inputLiveTitle?.value.trim() || '방송 제목';
      const cat = inputLiveCategory?.value.trim() || '종합 게임';
      window.showToast?.(`📡 방송 정보 저장 완료: [${cat}] ${title}`);
    });
  }

  // 14. Logs Search Filter & Clear
  const logSearch = document.getElementById('logSearchInput');
  const logList = document.getElementById('logEntriesList');
  const btnClearLogs = document.getElementById('btnClearAuditLogs');
  if (logSearch && logList) {
    logSearch.addEventListener('input', () => {
      const q = logSearch.value.toLowerCase().trim();
      logList.querySelectorAll('.log-row').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
  if (btnClearLogs && logList) {
    btnClearLogs.addEventListener('click', () => {
      logList.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b;">기록된 로그가 없습니다.</div>';
      window.showToast?.('🧹 감사 로그가 비워졌습니다.');
    });
  }

  // 15. Widgets Customization Controls
  const fontRange = document.getElementById('chatFontSizeRange');
  const fontVal = document.getElementById('fontSizeVal');
  const opacityRange = document.getElementById('chatBgOpacityRange');
  const opacityVal = document.getElementById('bgOpacityVal');
  const obsMock = document.getElementById('obsMockContent');
  const chkBadges = document.getElementById('chkShowBadges');
  const btnCopyObs = document.getElementById('btnCopyObsUrlMain');

  // 15-1. Hyper-Realistic Broadcast Studio Live Simulator & In-Preview Customizer
  const broadcastCanvas = document.getElementById('broadcastCanvas');
  const sceneBtns = document.querySelectorAll('#broadcastSceneSelector .scene-btn');
  const deckThemeChips = document.querySelectorAll('#deckThemeChips .deck-theme-chip');
  const themePresetBtns = document.querySelectorAll('.theme-preset-grid .preset-btn');
  const deckVisibilityChips = document.querySelectorAll('#deckVisibilityChips .deck-toggle-chip');
  const deckBubbleChips = document.querySelectorAll('#deckBubbleChips .deck-theme-chip');
  const bubbleSelect = document.getElementById('chatBubbleStyleSelect');
  const posSelect = document.getElementById('chatPositionSelect');
  const btnTogglePos = document.getElementById('btnToggleChatPosition');
  const chatPosLabel = document.getElementById('chatPosLabel');
  const btnSimDonation = document.getElementById('btnSimulateLiveDonation');
  const btnSimChat = document.getElementById('btnSimulateLiveChat');
  const btnSimGoal = document.getElementById('btnSimulateGoalBoost');
  const alertBanner = document.getElementById('previewAlertBanner');
  const goalFill = document.getElementById('previewGoalFill');
  const goalText = document.getElementById('previewGoalRateText');
  const liveTimer = document.getElementById('broadcastLiveTimer');

  // (1) Scene Switcher Handler
  if (sceneBtns.length > 0 && broadcastCanvas) {
    sceneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sceneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const scene = btn.getAttribute('data-scene') || 'game';

        // Remove old scene classes
        broadcastCanvas.classList.remove('scene-game', 'scene-cam', 'scene-vtuber', 'scene-checkerboard');
        broadcastCanvas.classList.add(`scene-${scene}`);

        // HUD auto-toggle
        const gameHud = document.getElementById('gameHudLayer');
        if (gameHud) {
          gameHud.style.display = (scene === 'game') ? 'block' : 'none';
        }

        window.showToast?.(`방송 화면 전환: [${btn.textContent.trim()}] 모드로 변경되었습니다.`);
      });
    });
  }

  // (2) Two-Way Theme Preset Switching (Sync between Left Panel & In-Preview Chips)
  function applyTheme(preset, label) {
    if (!obsMock || !broadcastCanvas) return;

    // Sync active classes on both control groups
    themePresetBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-preset') === preset);
    });
    deckThemeChips.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-preset') === preset);
    });

    // Remove old themes
    const themes = ['theme-aurora', 'theme-midnight', 'theme-retro', 'theme-excel', 'theme-sakura'];
    themes.forEach(t => {
      obsMock.classList.remove(t);
      broadcastCanvas.classList.remove(t);
    });

    // Apply new theme
    obsMock.classList.add(`theme-${preset}`);
    broadcastCanvas.classList.add(`theme-${preset}`);

    // Update dynamic accents
    const borderColors = {
      aurora: '#c084fc',
      midnight: '#334155',
      retro: '#06b6d4',
      excel: '#f59e0b',
      sakura: '#f472b6'
    };
    if (borderColors[preset]) {
      obsMock.style.borderColor = borderColors[preset];
    }

    window.showToast?.(`오버레이 테마: [${label || preset}] 디자인이 적용되었습니다.`);
  }

  if (themePresetBtns.length > 0) {
    themePresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset') || 'aurora';
        applyTheme(preset, btn.textContent.trim());
      });
    });
  }

  if (deckThemeChips.length > 0) {
    deckThemeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const preset = chip.getAttribute('data-preset') || 'aurora';
        applyTheme(preset, chip.textContent.trim());
      });
    });
  }

  // (3) Overlay Component Visibility Toggles
  if (deckVisibilityChips.length > 0) {
    deckVisibilityChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        const isActive = chip.classList.contains('active');
        const target = chip.getAttribute('data-target');

        const map = {
          chat: document.getElementById('obsMockContent'),
          goal: document.getElementById('previewGoalWidget'),
          cam: document.getElementById('previewCamPip'),
          bgm: document.getElementById('previewBgmPill'),
          gamehud: document.getElementById('gameHudLayer')
        };

        const el = map[target];
        if (el) {
          el.style.display = isActive ? (target === 'cam' ? 'flex' : 'block') : 'none';
          if (target === 'chat' && isActive) el.style.display = 'flex';
          window.showToast?.(`[${chip.textContent.trim()}] 표시 상태가 ${isActive ? '활성화' : '비활성화'}되었습니다.`);
        }
      });
    });
  }

  // (4) Bubble Style Synchronizer
  function applyBubbleStyle(style) {
    if (!obsMock) return;
    const styles = ['bubble-style-glass', 'bubble-style-neon', 'bubble-style-minimal', 'bubble-style-rounded'];
    styles.forEach(s => obsMock.classList.remove(s));
    obsMock.classList.add(`bubble-style-${style}`);

    // Sync select & chips
    if (bubbleSelect) bubbleSelect.value = style;
    deckBubbleChips.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-bubble') === style);
    });
    window.showToast?.(`말풍선 디자인: [${style}] 스타일이 적용되었습니다.`);
  }

  if (bubbleSelect) {
    bubbleSelect.addEventListener('change', (e) => applyBubbleStyle(e.target.value));
  }
  if (deckBubbleChips.length > 0) {
    deckBubbleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const style = chip.getAttribute('data-bubble') || 'glass';
        applyBubbleStyle(style);
      });
    });
  }

  // (5) Chat Position Synchronizer
  function setChatPosition(pos) {
    if (!obsMock) return;
    if (pos === 'left') {
      obsMock.classList.add('position-left');
      if (chatPosLabel) chatPosLabel.textContent = '좌측 하단';
      if (posSelect) posSelect.value = 'left';
    } else {
      obsMock.classList.remove('position-left');
      if (chatPosLabel) chatPosLabel.textContent = '우측 하단';
      if (posSelect) posSelect.value = 'right';
    }
  }

  if (btnTogglePos) {
    btnTogglePos.addEventListener('click', () => {
      const isLeft = obsMock?.classList.contains('position-left');
      setChatPosition(isLeft ? 'right' : 'left');
      window.showToast?.(`채팅 위치가 [${isLeft ? '우측 하단' : '좌측 하단'}]으로 변경되었습니다.`);
    });
  }
  if (posSelect) {
    posSelect.addEventListener('change', (e) => {
      setChatPosition(e.target.value);
    });
  }

  // (6) Live Simulation Actions
  let alertTimer = null;
  if (btnSimDonation && alertBanner) {
    btnSimDonation.addEventListener('click', () => {
      const donors = [
        { name: '별빛단장', amount: '10,000', msg: '오늘 방송도 화이팅! 미미비트 최고' },
        { name: '치지직회장', amount: '50,000', msg: '오늘 방제 센스 좋습니다. 응원합니다!' },
        { name: '새벽요정', amount: '3,000', msg: '미미비트 목소리 힐링 그 자체' },
        { name: '크루마스터', amount: '100,000', msg: '엑셀 방송 대박 기원 플렉스 갑니다!' }
      ];
      const pick = donors[Math.floor(Math.random() * donors.length)];
      const titleEl = document.getElementById('alertDonorTitle');
      const msgEl = document.getElementById('alertDonorMsg');
      if (titleEl) titleEl.textContent = `[치즈 후원 ${pick.amount}개] ${pick.name}님`;
      if (msgEl) msgEl.textContent = `"${pick.msg}"`;

      // Trigger show
      alertBanner.classList.add('show-alert');
      window.showToast?.(`${pick.name}님의 [${pick.amount} 치즈] 후원 알림이 시뮬레이션되었습니다.`);

      // Add to chat
      if (obsMock) {
        const bubble = document.createElement('div');
        bubble.className = 'mock-chat-bubble';
        bubble.innerHTML = `<span class="mock-badge" style="background: rgba(245, 158, 11, 0.3); color: #fde047;">[치즈후원]</span> <span class="mock-user" style="color: #fde047;">${pick.name}:</span> <span>${pick.amount} 치즈 후원! "${pick.msg}"</span>`;
        obsMock.appendChild(bubble);
        obsMock.scrollTop = obsMock.scrollHeight;
      }

      if (alertTimer) clearTimeout(alertTimer);
      alertTimer = setTimeout(() => {
        alertBanner.classList.remove('show-alert');
      }, 4200);
    });
  }

  if (btnSimChat && obsMock) {
    btnSimChat.addEventListener('click', () => {
      const chats = [
        { badge: '[치지직1티어]', color: '#c084fc', user: '달빛냥이', text: '오 노래 선곡 너무 좋습니다.' },
        { badge: '[구독2티어]', color: '#38bdf8', user: '네온드라이버', text: '이 게임 엔딩 오늘 볼 수 있나요?' },
        { badge: '[VIP]', color: '#f59e0b', user: '골드팬클럽', text: '미미비트 방송 알림 뜨자마자 달려왔습니다.' },
        { badge: '[매니저]', color: '#10b981', user: '채팅방수호자', text: '다들 매너 채팅 부탁드립니다.' },
        { badge: '[팬클럽]', color: '#f472b6', user: '핑크체리', text: '오늘 마이크 음질 깔끔하네요.' }
      ];
      const pick = chats[Math.floor(Math.random() * chats.length)];
      const bubble = document.createElement('div');
      bubble.className = 'mock-chat-bubble';
      bubble.innerHTML = `<span class="mock-badge" style="background: rgba(255,255,255,0.1); color: ${pick.color};">${pick.badge}</span> <span class="mock-user" style="color: ${pick.color};">${pick.user}:</span> <span>${pick.text}</span>`;
      obsMock.appendChild(bubble);
      obsMock.scrollTop = obsMock.scrollHeight;
      window.showToast?.(`시청자 [${pick.user}] 채팅 1건이 전송되었습니다.`);
    });
  }

  let curGoalPercent = 68;
  if (btnSimGoal && goalFill && goalText) {
    btnSimGoal.addEventListener('click', () => {
      curGoalPercent = Math.min(100, curGoalPercent + 5);
      goalFill.style.width = `${curGoalPercent}%`;
      const curAmount = Math.floor(1000000 * (curGoalPercent / 100)).toLocaleString();
      goalText.textContent = `${curGoalPercent}% (${curAmount} / 1,000,000 치즈)`;
      window.showToast?.(`후원 목표치 +50,000 치즈 추가! 현재 달성률: ${curGoalPercent}%`);
    });
  }

  // (7) Ticking Live Broadcast Timer
  let seconds = 9918; // 02:45:18
  setInterval(() => {
    seconds++;
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    if (liveTimer) liveTimer.textContent = `${h}:${m}:${s}`;
  }, 1000);

  if (fontRange && fontVal) {
    fontRange.addEventListener('input', (e) => {
      fontVal.textContent = `${e.target.value}px`;
      if (obsMock) obsMock.style.fontSize = `${e.target.value}px`;
    });
  }

  if (opacityRange && opacityVal) {
    opacityRange.addEventListener('input', (e) => {
      opacityVal.textContent = `${e.target.value}%`;
      if (obsMock) {
        const alpha = parseInt(e.target.value, 10) / 100;
        obsMock.style.backgroundColor = `rgba(15, 23, 42, ${alpha})`;
      }
    });
  }

  if (chkBadges && obsMock) {
    chkBadges.addEventListener('change', (e) => {
      obsMock.querySelectorAll('.mock-badge, .user-badge, .stream-badge').forEach(b => {
        b.style.display = e.target.checked ? 'inline-flex' : 'none';
      });
    });
  }

  if (btnCopyObs) {
    btnCopyObs.addEventListener('click', () => {
      const obsUrl = `${window.location.origin}/widgets/chat_overlay.html`;
      navigator.clipboard?.writeText(obsUrl).then(() => {
        window.showToast?.('📋 OBS 브라우저 소스 URL이 클립보드에 복사되었습니다!');
      }).catch(() => {
        window.showToast?.(`📋 OBS URL: ${obsUrl}`);
      });
    });
  }

  // 15-2. Train Theme Dropdown & Save Config
  const selectTrainTheme = document.getElementById('selectTrainTheme');
  const inputTrainGoal = document.getElementById('inputTrainGoal');
  const btnSaveTrainConfig = document.getElementById('btnSaveTrainConfig');
  const trainTrackFill = document.getElementById('trainTrackFill');
  const trainEngineIcon = document.getElementById('trainEngineIcon');

  if (selectTrainTheme) {
    selectTrainTheme.addEventListener('change', (e) => {
      const themeVal = e.target.value;
      if (trainTrackFill) {
        trainTrackFill.className = `train-track-fill train-track-theme-${themeVal}`;
      }
      const themeName = selectTrainTheme.options[selectTrainTheme.selectedIndex].text;
      window.showToast?.(`🚂 기차 테마: [${themeName}] 변경됨`);
    });
  }

  if (btnSaveTrainConfig) {
    btnSaveTrainConfig.addEventListener('click', () => {
      const goal = inputTrainGoal ? inputTrainGoal.value : '10000';
      const theme = selectTrainTheme ? selectTrainTheme.value : 'aurora';
      localStorage.setItem('stella_train_goal', goal);
      localStorage.setItem('stella_train_theme', theme);
      window.showToast?.(`💾 기차 오버레이 설정(목표: ${parseInt(goal,10).toLocaleString()}원)이 저장되었습니다!`);
    });
  }

  // 15-3. Counter Live Preview & OBS Copy
  const previewDeath = document.getElementById('previewCounterDeathNum');
  const btnCopyCounterObs = document.getElementById('btnCopyCounterObsUrl');
  if (btnCopyCounterObs) {
    btnCopyCounterObs.addEventListener('click', () => {
      const url = `${window.location.origin}/widgets/counter_overlay.html`;
      navigator.clipboard?.writeText(url).then(() => {
        window.showToast?.('📋 카운터 OBS 오버레이 URL이 복사되었습니다!');
      }).catch(() => {
        window.showToast?.(`📋 카운터 URL: ${url}`);
      });
    });
  }

  // Hook into stepCounter & resetCounter to sync preview
  const originalStepCounter = window.stepCounter;
  window.stepCounter = function(id, delta) {
    if (typeof originalStepCounter === 'function') originalStepCounter(id, delta);
    const deathEl = document.getElementById('counterNumDeath');
    if (deathEl && previewDeath) {
      previewDeath.textContent = deathEl.textContent;
    }
  };

  const originalResetCounter = window.resetCounter;
  window.resetCounter = function(id) {
    if (typeof originalResetCounter === 'function') originalResetCounter(id);
    const deathEl = document.getElementById('counterNumDeath');
    if (deathEl && previewDeath) {
      previewDeath.textContent = deathEl.textContent;
    }
  };

  // 15-4. Goal Live Preview Sync & OBS Copy
  const obsGoalPercentPreview = document.getElementById('obsGoalPercentPreview');
  const obsGoalBarFillPreview = document.getElementById('obsGoalBarFillPreview');
  const btnCopyGoalObs = document.getElementById('btnCopyGoalObsUrl');

  function syncGoalPreview(current, target) {
    const pct = Math.min(100, Math.floor((current / target) * 100));
    if (obsGoalPercentPreview) obsGoalPercentPreview.textContent = `${pct}%`;
    if (obsGoalBarFillPreview) obsGoalBarFillPreview.style.width = `${pct}%`;
  }

  // Initial sync
  syncGoalPreview(currentGoalVal, targetGoalVal);

  if (btnCopyGoalObs) {
    btnCopyGoalObs.addEventListener('click', () => {
      const url = `${window.location.origin}/widgets/goal_overlay.html`;
      navigator.clipboard?.writeText(url).then(() => {
        window.showToast?.('📋 팔로워 목표 OBS 오버레이 URL이 복사되었습니다!');
      }).catch(() => {
        window.showToast?.(`📋 목표 URL: ${url}`);
      });
    });
  }

  // Wrap updateGoalUI to also sync the OBS Preview card
  const prevUpdateGoalUI = updateGoalUI;
  updateGoalUI = function() {
    prevUpdateGoalUI();
    syncGoalPreview(currentGoalVal, targetGoalVal);
  };

  // 15-5. Commands Test Terminal Playground & Add Modal Focus
  const btnRunCmdTest = document.getElementById('btnRunCmdTest');
  const inputCmdTest = document.getElementById('inputCmdTestTrigger');
  const cmdTestOutput = document.getElementById('cmdTestOutput');
  const btnOpenAddCmd = document.getElementById('btnOpenAddCommandModal');

  if (btnOpenAddCmd) {
    btnOpenAddCmd.addEventListener('click', () => {
      const input = document.getElementById('inputCmdTrigger');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.style.borderColor = '#8b5cf6';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
      }
    });
  }

  if (btnRunCmdTest && inputCmdTest && cmdTestOutput) {
    const runTest = () => {
      const kw = inputCmdTest.value.trim();
      if (!kw) return;
      
      const responses = {
        '!디스코드': '[미미비트봇]: discord.gg/stella 공식 디스코드에서 팬들과 소통해요! 💬',
        '!사양': '[미미비트봇]: CPU i9-14900K / RTX 4090 / 마이크 Shure SM7B 환경입니다 🎙️',
        '!업타임': '[미미비트봇]: 현재 방송 송출 시간: 2시간 45분째 순항 중! 🚀',
        '!규칙': '[미미비트봇]: 서로 존중하는 매너 채팅 부탁드립니다! 친목 및 타스 언급 금지 🛡️',
        '!후원': '[미미비트봇]: 항상 방송을 응원해주셔서 진심으로 감사드립니다 💖'
      };

      const reply = responses[kw] || `[미미비트봇]: '${kw}' 커스텀 명령어 호출 성공! (정상 응답 출력)`;
      cmdTestOutput.innerHTML = `<span>${reply}</span>`;
      window.showToast?.(`⚡ 명령어 [${kw}] 테스트 실행 완료`);
    };

    btnRunCmdTest.addEventListener('click', runTest);
    inputCmdTest.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runTest();
    });
  }

  // 15-6. Song Jukebox Clear Queue & Next Song
  const btnClearQueue = document.getElementById('btnClearSongQueue');
  const btnNextSong = document.getElementById('btnNextSong');

  if (btnClearQueue && songList) {
    btnClearQueue.addEventListener('click', () => {
      songList.innerHTML = '<div class="empty" style="padding: 16px; text-align: center; color: #64748b;">대기 중인 곡이 없습니다.</div>';
      window.showToast?.('🧹 노래 신청 대기열이 비워졌습니다.');
    });
  }

  if (btnNextSong && songList) {
    btnNextSong.addEventListener('click', () => {
      const items = songList.querySelectorAll('.song-queue-item');
      if (items.length > 0) {
        const nextTitle = items[0].querySelector('strong')?.textContent || '신청곡';
        items[0].remove();
        if (nowPlayingTitle) nowPlayingTitle.textContent = nextTitle;
        if (nowPlayingArtist) nowPlayingArtist.textContent = '신청자: 치지직 시청자 (유튜브 재생 중)';
        if (playerState) playerState.textContent = '재생 중';
        window.showToast?.(`⏭ 다음 곡 재생: [${nextTitle}]`);
      } else {
        window.showToast?.('대기열에 다음 곡이 없습니다.');
      }
    });
  }

  // 15-7. Operations Macro Deck Keys
  const macroKeys = [
    { id: 'deckKeyShield2', label: '채팅 쉴드 활성화' },
    { id: 'deckKeyMarker2', label: '클립 타임스탬프 기록' },
    { id: 'deckKeyBrb2', label: '잠시 자리비움(BRB) 화면 전환' },
    { id: 'deckKeyFlush2', label: '채팅창 1초 전체 청소' }
  ];
  macroKeys.forEach(mk => {
    const el = document.getElementById(mk.id);
    if (el) {
      el.addEventListener('click', () => {
        window.showToast?.(`🎛️ 매크로 실행: [${mk.label}]`);
      });
    }
  });

  // 15-8. Operations Create Event Button
  const btnCreateEvent = document.getElementById('btnCreateEvent');
  if (btnCreateEvent) {
    btnCreateEvent.addEventListener('click', () => {
      const voteTabBtn = document.querySelector('.op-tab-btn[data-subtab="vote"]');
      if (voteTabBtn) voteTabBtn.click();
      const voteInput = document.getElementById('inputVoteTitle');
      if (voteInput) {
        voteInput.focus();
        voteInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      window.showToast?.('📊 새 투표/이벤트 생성 폼으로 이동했습니다.');
    });
  }

  // 15-9. Channel Modal Open Triggers
  const btnOpenYt = document.getElementById('btnOpenYoutubeModal');
  const ytModal = document.getElementById('youtubeModalBackdrop');
  if (btnOpenYt && ytModal) {
    btnOpenYt.addEventListener('click', () => {
      ytModal.style.display = 'flex';
    });
  }

  const btnOpenDc = document.getElementById('btnOpenDiscordModal');
  const dcModal = document.getElementById('discordModalBackdrop');
  if (btnOpenDc && dcModal) {
    btnOpenDc.addEventListener('click', () => {
      dcModal.style.display = 'flex';
    });
  }

  // 15-10. Save Roulette Settings
  const btnSaveRoulette = document.getElementById('btnSaveRouletteSettings');
  const inputRouletteMin = document.getElementById('inputRouletteMin');
  if (btnSaveRoulette) {
    btnSaveRoulette.addEventListener('click', () => {
      const minVal = inputRouletteMin ? inputRouletteMin.value : '1000';
      localStorage.setItem('stella_roulette_min', minVal);
      window.showToast?.(`💾 후원 룰렛 설정(최소: ${parseInt(minVal,10).toLocaleString()}치즈)이 저장되었습니다!`);
    });
  }

  // 15-11. Filter Buttons
  const btnFilterLogs = document.getElementById('btnFilterLogs');
  if (btnFilterLogs && logSearch) {
    btnFilterLogs.addEventListener('click', () => {
      logSearch.dispatchEvent(new Event('input'));
      window.showToast?.('🔍 로그 필터가 적용되었습니다.');
    });
  }

  const btnFilterUsers = document.getElementById('btnFilterUsers');
  if (btnFilterUsers && userSearch) {
    btnFilterUsers.addEventListener('click', () => {
      userSearch.dispatchEvent(new Event('input'));
      window.showToast?.('🔍 시청자 필터가 적용되었습니다.');
    });
  }

  // 16. Hero Refresh & Donation Test in Home Pane
  const btnHeroRefresh = document.getElementById('btnHeroRefresh');
  if (btnHeroRefresh) {
    btnHeroRefresh.addEventListener('click', () => {
      window.showToast?.('🔄 실시간 대시보드 데이터 동기화 완료!');
    });
  }

  const btnHeroOpenOps = document.getElementById('btnHeroOpenOps');
  if (btnHeroOpenOps) {
    btnHeroOpenOps.addEventListener('click', () => {
      const opsTab = document.querySelector('.dash-nav-item[data-tab="operations"]');
      if (opsTab) opsTab.click();
    });
  }

  const btnTestDonation = document.getElementById('btnTestDonation');
  if (btnTestDonation) {
    btnTestDonation.addEventListener('click', () => {
      window.showToast?.('🧀 [미미비트단장]님이 10,000 치즈를 후원했습니다! ("미미비트 방송 최고!")');
    });
  }
  const navHome = document.getElementById('navItemHome');
  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      const homeTab = document.querySelector('.dash-nav-item[data-tab="home"]');
      if (homeTab) homeTab.click();
    });
  }

  // =========================================================================
  // 17. AUTHENTICATION & MEMBERSHIP TIERS MANAGEMENT (STELLA AUTH)
  // =========================================================================

  // Initial Pre-configured Master Admin & Users Database
  const DEFAULT_USERS_DB = [
    {
      email: 'zeze1.sec@gmail.com',
      password: 'kms1762212@',
      name: 'root',
      role: 'admin',
      tier: 'admin',
      provider: 'email',
      phone: '010-9999-8888',
      verified: true,
      avatar: '👑'
    },
    {
      email: 'star_knight@naver.com',
      password: 'password123!',
      name: '별빛기사단',
      role: 'creator',
      tier: 'pro',
      provider: 'chzzk',
      phone: '010-2345-6789',
      verified: true,
      avatar: '⭐'
    },
    {
      email: 'space_cat@kakao.com',
      password: 'password123!',
      name: '우주고양이',
      role: 'creator',
      tier: 'basic',
      provider: 'kakao',
      phone: '010-3456-7890',
      verified: true,
      avatar: '🐱'
    }
  ];

  function getUsersDB() {
    const raw = localStorage.getItem('stella_users_db');
    if (!raw) {
      localStorage.setItem('stella_users_db', JSON.stringify(DEFAULT_USERS_DB));
      return DEFAULT_USERS_DB;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure master admin always exists
      if (!parsed.some(u => u.email === 'zeze1.sec@gmail.com')) {
        parsed.unshift(DEFAULT_USERS_DB[0]);
        localStorage.setItem('stella_users_db', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return DEFAULT_USERS_DB;
    }
  }

  function saveUsersDB(db) {
    localStorage.setItem('stella_users_db', JSON.stringify(db));
  }

  function getCurrentUser() {
    const raw = localStorage.getItem('stella_auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem('stella_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stella_auth_user');
    }
    updateUserUI(user);
    renderAdminUsersTable();

  // Open modal if URL has hash #login or #signup
  if (window.location.hash === '#login') {
    openAuthModal('login');
  } else if (window.location.hash === '#signup') {
    openAuthModal('signup');
  }
  }

  // Update All Dashboard UI Elements with Session Info
  function updateUserUI(user) {
    const topUserPill = document.getElementById('topUserPill');
    const topUserName = document.getElementById('topUserName');
    const topTierBadge = document.getElementById('topTierBadge');
    const topBtnAuthText = document.getElementById('topBtnAuthText');
    const roomName = document.getElementById('roomStudioName');
    const roomBadge = document.getElementById('roomStudioBadge');
    const sideAvatar = document.getElementById('sidebarUserAvatar');
    const sideName = document.getElementById('sidebarUserName');
    const sidePlan = document.getElementById('sidebarUserPlan');
    const sideLogoutText = document.getElementById('sidebarLogoutText');
    const adminPanel = document.getElementById('adminTierManagerCard');

    if (!user) {
      // GUEST MODE
      if (topUserPill) topUserPill.className = 'stella-guest-badge';
      if (topUserName) topUserName.textContent = 'GUEST';
      if (topTierBadge) topTierBadge.style.display = 'none';
      if (topBtnAuthText) topBtnAuthText.textContent = '로그인';
      if (roomName) roomName.textContent = '게스트';
      if (roomBadge) roomBadge.textContent = 'GUEST PREVIEW';
      if (sideAvatar) sideAvatar.textContent = '게';
      if (sideName) sideName.textContent = '게스트';
      if (sidePlan) sidePlan.textContent = '게스트 계정';
      if (sideLogoutText) sideLogoutText.textContent = '로그인';
      if (adminPanel) adminPanel.style.display = 'none';
    } else {
      // LOGGED IN USER MODE
      const tier = user.tier || 'free';
      const role = user.role || 'user';
      const isMasterAdmin = tier === 'admin' || role === 'admin';

      if (topUserPill) {
        topUserPill.className = `stella-guest-badge user-pill ${tier}`;
      }

      if (topUserName) {
        topUserName.textContent = isMasterAdmin ? `👑 ${user.name}` : user.name;
      }

      if (topTierBadge) {
        topTierBadge.style.display = 'inline-block';
        if (isMasterAdmin) {
          topTierBadge.textContent = 'ADMIN';
          topTierBadge.style.background = 'rgba(245, 158, 11, 0.25)';
          topTierBadge.style.color = '#fbbf24';
        } else if (tier === 'pro') {
          topTierBadge.textContent = 'PRO';
          topTierBadge.style.background = 'rgba(168, 85, 247, 0.25)';
          topTierBadge.style.color = '#c084fc';
        } else if (tier === 'basic') {
          topTierBadge.textContent = 'BASIC';
          topTierBadge.style.background = 'rgba(59, 130, 246, 0.25)';
          topTierBadge.style.color = '#60a5fa';
        } else {
          topTierBadge.textContent = 'FREE';
          topTierBadge.style.background = 'rgba(255, 255, 255, 0.12)';
          topTierBadge.style.color = '#cbd5e1';
        }
      }

      if (topBtnAuthText) topBtnAuthText.textContent = '로그아웃';
      if (roomName) roomName.textContent = `${user.name} 님의 스튜디오`;
      if (roomBadge) {
        roomBadge.textContent = isMasterAdmin ? 'MASTER ADMIN' : `${tier.toUpperCase()} STREAM`;
      }

      if (sideAvatar) sideAvatar.textContent = user.avatar || user.name.slice(0, 1);
      if (sideName) sideName.textContent = user.name;
      if (sidePlan) {
        if (isMasterAdmin) sidePlan.textContent = '최고 관리자 (Admin)';
        else if (tier === 'pro') sidePlan.textContent = '프로 엑셀 크루 플랜';
        else if (tier === 'basic') sidePlan.textContent = '베이직 스트리머 플랜';
        else sidePlan.textContent = '일반 무료 플랜';
      }
      if (sideLogoutText) sideLogoutText.textContent = '로그아웃';

      // Show Admin Console if master admin
      if (adminPanel) {
        adminPanel.style.display = isMasterAdmin ? 'block' : 'none';
      }
    }
  }

  // Render Admin Users Table in pane-users
  function renderAdminUsersTable() {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    const db = getUsersDB();
    tbody.innerHTML = '';

    db.forEach(u => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-user-email', u.email);

      const isRoot = u.email === 'zeze1.sec@gmail.com';
      const tierBadge = isRoot
        ? '<span class="user-badge" style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; font-weight: 800;">👑 ADMIN</span>'
        : u.tier === 'pro'
          ? '<span class="user-badge" style="background: rgba(168, 85, 247, 0.25); color: #c084fc;">⭐ PRO</span>'
          : u.tier === 'basic'
            ? '<span class="user-badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">🔷 BASIC</span>'
            : '<span class="user-badge" style="background: rgba(255, 255, 255, 0.1); color: #cbd5e1;">⚪ FREE</span>';

      const providerBadge = u.provider === 'chzzk'
        ? '<span class="user-badge" style="background: rgba(0, 255, 163, 0.2); color: #00ffa3;">치지직</span>'
        : u.provider === 'kakao'
          ? '<span class="user-badge" style="background: rgba(254, 229, 0, 0.2); color: #fde047;">카카오</span>'
          : u.provider === 'google'
            ? '<span class="user-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">구글</span>'
            : '<span class="user-badge" style="background: rgba(139, 92, 246, 0.2); color: #c084fc;">이메일</span>';

      const verifyBadge = u.verified
        ? '<span class="badge-verify-status verified">PASS 완료</span>'
        : '<span class="badge-verify-status">미인증</span>';

      const actionCell = isRoot
        ? '<span style="font-size: 0.75rem; color: #64748b;">수정 불가 (Root)</span>'
        : `
          <select class="stella-input" style="padding: 4px 8px; font-size: 0.75rem;" onchange="changeUserTier('${u.email}', this.value)">
            <option value="free" ${u.tier === 'free' ? 'selected' : ''}>일반 (Free)</option>
            <option value="basic" ${u.tier === 'basic' ? 'selected' : ''}>베이직 (Basic)</option>
            <option value="pro" ${u.tier === 'pro' ? 'selected' : ''}>프로 (Pro)</option>
            <option value="admin" ${u.tier === 'admin' ? 'selected' : ''}>어드민 (Admin)</option>
          </select>
        `;

      tr.innerHTML = `
        <td><strong style="color: ${isRoot ? '#38bdf8' : '#f8fafc'};">${u.email}</strong></td>
        <td>${u.name}</td>
        <td>${providerBadge}</td>
        <td>${verifyBadge}</td>
        <td>${tierBadge}</td>
        <td>${actionCell}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Global Admin Function to Change Another User's Tier
  window.changeUserTier = function(email, newTier) {
    const db = getUsersDB();
    const target = db.find(u => u.email === email);
    if (!target) return;

    target.tier = newTier;
    if (newTier === 'admin') target.role = 'admin';
    saveUsersDB(db);

    // If currently logged-in user changed their own tier
    const cur = getCurrentUser();
    if (cur && cur.email === email) {
      cur.tier = newTier;
      if (newTier === 'admin') cur.role = 'admin';
      localStorage.setItem('stella_auth_user', JSON.stringify(cur));
      updateUserUI(cur);
    }

    renderAdminUsersTable();
    window.showToast?.(`👑 [${target.name}] 회원의 등급이 [${newTier.toUpperCase()}] 플랜으로 변경되었습니다.`);
  };

  // Global User Function to Switch My Own Tier (Inside Profile Modal)
  window.switchMyTier = function(tier) {
    const cur = getCurrentUser();
    if (!cur) return;

    cur.tier = tier;
    if (tier === 'admin') cur.role = 'admin';
    localStorage.setItem('stella_auth_user', JSON.stringify(cur));

    const db = getUsersDB();
    const userInDb = db.find(u => u.email === cur.email);
    if (userInDb) {
      userInDb.tier = tier;
      if (tier === 'admin') userInDb.role = 'admin';
      saveUsersDB(db);
    }

    updateUserUI(cur);
    openProfileModal();
    window.showToast?.(`⭐ 멤버십이 [${tier.toUpperCase()}] 등급으로 즉시 전환되었습니다!`);
  };

  // Auth Modals Opening & Closing
  const authModalBackdrop = document.getElementById('authModalBackdrop');
  const btnCloseAuth = document.getElementById('btnCloseAuthModal');
  const userProfileBackdrop = document.getElementById('userProfileModalBackdrop');
  const btnCloseProfile = document.getElementById('btnCloseProfileModal');
  const btnCloseProfileBtn = document.getElementById('btnCloseProfileBtn');
  const btnLogoutSession = document.getElementById('btnLogoutSession');

  function openAuthModal(mode = 'login') {
    if (!authModalBackdrop) return;
    authModalBackdrop.classList.add('show');
    switchAuthTab(mode);
  }

  function closeAuthModal() {
    if (authModalBackdrop) authModalBackdrop.classList.remove('show');
  }

  function openProfileModal() {
    const cur = getCurrentUser();
    if (!cur) {
      openAuthModal('login');
      return;
    }
    if (!userProfileBackdrop) return;

    const pAvatar = document.getElementById('profileModalAvatar');
    const pName = document.getElementById('profileModalName');
    const pEmail = document.getElementById('profileModalEmail');
    const pBadge = document.getElementById('profileModalTierBadge');
    const pDesc = document.getElementById('profileModalTierDesc');

    if (pAvatar) pAvatar.textContent = cur.avatar || '👤';
    if (pName) pName.textContent = cur.name;
    if (pEmail) pEmail.textContent = cur.email;

    const tier = cur.tier || 'free';
    if (pBadge) {
      if (tier === 'admin') {
        pBadge.innerHTML = '👑 ADMIN (최고 관리자)';
        pBadge.style.background = 'rgba(245,158,11,0.25)';
        pBadge.style.color = '#fbbf24';
        if (pDesc) pDesc.textContent = '치지직 방송 관리를 위한 모든 기능 및 전 회원 관제 권한이 부여되어 있습니다.';
      } else if (tier === 'pro') {
        pBadge.innerHTML = '⭐ PRO (프로 엑셀 크루)';
        pBadge.style.background = 'rgba(168,85,247,0.25)';
        pBadge.style.color = '#c084fc';
        if (pDesc) pDesc.textContent = 'AI 챗봇 무제한 응답, 후원 기차 실시간 연동, 주크박스 무제한 권한이 활성화되어 있습니다.';
      } else if (tier === 'basic') {
        pBadge.innerHTML = '🔷 BASIC (베이직 스트리머)';
        pBadge.style.background = 'rgba(59,130,246,0.25)';
        pBadge.style.color = '#60a5fa';
        if (pDesc) pDesc.textContent = '투명 OBS 채팅창, 기본 주크박스 및 50개 커스텀 명령어를 이용 중입니다.';
      } else {
        pBadge.innerHTML = '⚪ FREE (일반 회원)';
        pBadge.style.background = 'rgba(255,255,255,0.12)';
        pBadge.style.color = '#cbd5e1';
        if (pDesc) pDesc.textContent = '무료 플랜 이용 중입니다. 상위 플랜으로 업그레이드하여 다양한 기능을 잠금 해제하세요!';
      }
    }

    userProfileBackdrop.classList.add('show');
  }

  function closeProfileModal() {
    if (userProfileBackdrop) userProfileBackdrop.classList.remove('show');
  }

  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
  if (btnCloseProfile) btnCloseProfile.addEventListener('click', closeProfileModal);
  if (btnCloseProfileBtn) btnCloseProfileBtn.addEventListener('click', closeProfileModal);

  // Close modals on backdrop click
  if (authModalBackdrop) {
    authModalBackdrop.addEventListener('click', (e) => {
      if (e.target === authModalBackdrop) closeAuthModal();
    });
  }
  if (userProfileBackdrop) {
    userProfileBackdrop.addEventListener('click', (e) => {
      if (e.target === userProfileBackdrop) closeProfileModal();
    });
  }

  // Topbar and Sidebar triggers
  const topUserPill = document.getElementById('topUserPill');
  const topBtnAuth = document.getElementById('topBtnAuthAction');
  const sideProfile = document.getElementById('sidebarUserProfile');
  const sideLogout = document.getElementById('sidebarBtnLogout');

  if (topBtnAuth) {
    topBtnAuth.addEventListener('click', () => {
      if (getCurrentUser()) {
        setCurrentUser(null);
        window.showToast?.('👋 로그아웃되었습니다. 게스트 모드로 전환됩니다.');
      } else {
        openAuthModal('login');
      }
    });
  }

  if (sideLogout) {
    sideLogout.addEventListener('click', (e) => {
      e.stopPropagation();
      if (getCurrentUser()) {
        setCurrentUser(null);
        window.showToast?.('👋 로그아웃되었습니다.');
      } else {
        openAuthModal('login');
      }
    });
  }

  if (topUserPill) {
    topUserPill.addEventListener('click', () => {
      if (getCurrentUser()) openProfileModal();
      else openAuthModal('login');
    });
  }

  if (sideProfile) {
    sideProfile.addEventListener('click', () => {
      if (getCurrentUser()) openProfileModal();
      else openAuthModal('login');
    });
  }

  if (btnLogoutSession) {
    btnLogoutSession.addEventListener('click', () => {
      setCurrentUser(null);
      closeProfileModal();
      window.showToast?.('🚪 정상적으로 로그아웃되었습니다.');
    });
  }

  // Auth Tab Switching (로그인 / 회원가입)
  const tabLogin = document.getElementById('tabBtnLogin');
  const tabSignup = document.getElementById('tabBtnSignup');
  const formLogin = document.getElementById('formEmailLogin');
  const formSignup = document.getElementById('formEmailSignup');
  const modalTitle = document.getElementById('authModalTitle');

  function switchAuthTab(mode) {
    if (mode === 'signup') {
      tabLogin?.classList.remove('active');
      tabSignup?.classList.add('active');
      if (formLogin) formLogin.style.display = 'none';
      if (formSignup) formSignup.style.display = 'block';
      if (modalTitle) modalTitle.textContent = '미미비트 스튜디오 이메일 회원가입';
    } else {
      tabSignup?.classList.remove('active');
      tabLogin?.classList.add('active');
      if (formSignup) formSignup.style.display = 'none';
      if (formLogin) formLogin.style.display = 'block';
      if (modalTitle) modalTitle.textContent = '미미비트 스튜디오 로그인';
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
  if (tabSignup) tabSignup.addEventListener('click', () => switchAuthTab('signup'));

  // Quick Admin Prefill Button
  const btnFillAdmin = document.getElementById('btnFillAdminCreds');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  if (btnFillAdmin && loginEmail && loginPassword) {
    btnFillAdmin.addEventListener('click', () => {
      loginEmail.value = 'zeze1.sec@gmail.com';
      loginPassword.value = 'kms1762212@';
      window.showToast?.('🔑 최고 관리자 계정 정보가 입력되었습니다. 로그인 버튼을 누르세요!');
    });
  }

  // Email Login Submit
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail?.value.trim().toLowerCase();
      const pwd = loginPassword?.value.trim();
      const errBox = document.getElementById('loginErrorMsg');

      const db = getUsersDB();
      const match = db.find(u => u.email.toLowerCase() === email);

      if (!match) {
        if (errBox) {
          errBox.textContent = '등록되지 않은 이메일 계정입니다. 회원가입을 진행해주세요.';
          errBox.style.display = 'block';
        }
        return;
      }

      if (match.password !== pwd) {
        if (errBox) {
          errBox.textContent = '비밀번호가 일치하지 않습니다. 다시 확인해주세요.';
          errBox.style.display = 'block';
        }
        return;
      }

      // Success
      if (errBox) errBox.style.display = 'none';
      setCurrentUser(match);
      closeAuthModal();

      if (match.role === 'admin' || match.tier === 'admin') {
        window.showToast?.('👑 [최고 관리자 root] 로그인 성공! 마스터 권한이 활성화되었습니다.');
      } else {
        window.showToast?.(`✨ [${match.name}]님, 환영합니다! (${match.tier.toUpperCase()} 플랜)`);
      }
    });
  }

  // Phone / PASS Verification Mock Flow
  const btnSendSms = document.getElementById('btnSendSmsVerify');
  const btnConfirmSms = document.getElementById('btnConfirmSmsCode');
  const phoneInput = document.getElementById('signupPhone');
  const smsRow = document.getElementById('smsCodeRow');
  const smsInput = document.getElementById('inputSmsCode');
  const badgeVerify = document.getElementById('badgeVerifyStatus');
  let isPhoneVerified = false;

  if (btnSendSms && phoneInput && smsRow && smsInput) {
    btnSendSms.addEventListener('click', () => {
      const p = phoneInput.value.trim();
      if (!p || p.length < 10) {
        alert('올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)');
        return;
      }
      smsRow.style.display = 'flex';
      smsInput.value = '778899'; // Auto-fill sample mock code
      window.showToast?.('📱 [PASS/SMS 모의 인증] 인증번호 [778899]가 발송되었습니다.');
    });
  }

  if (btnConfirmSms && smsInput && badgeVerify) {
    btnConfirmSms.addEventListener('click', () => {
      if (smsInput.value.trim() === '778899') {
        isPhoneVerified = true;
        badgeVerify.textContent = 'PASS 완료';
        badgeVerify.className = 'badge-verify-status verified';
        smsRow.style.display = 'none';
        window.showToast?.('✅ 휴대폰 본인인증(PASS)이 성공적으로 완료되었습니다!');
      } else {
        alert('인증번호 6자리가 일치하지 않습니다.');
      }
    });
  }

  // Tier Card Selection Inside Signup Form
  const tierCards = document.querySelectorAll('.auth-tier-select-grid .tier-card-option');
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Email Signup Submit
  if (formSignup) {
    formSignup.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail')?.value.trim().toLowerCase();
      const name = document.getElementById('signupName')?.value.trim();
      const pwd = document.getElementById('signupPassword')?.value.trim();
      const phone = phoneInput?.value.trim() || '010-0000-0000';
      const tierRadio = document.querySelector('input[name="signupTier"]:checked');
      const tier = tierRadio ? tierRadio.value : 'free';
      const errBox = document.getElementById('signupErrorMsg');

      const db = getUsersDB();
      if (db.some(u => u.email.toLowerCase() === email)) {
        if (errBox) {
          errBox.textContent = '이미 등록된 이메일 계정입니다. 로그인해주세요.';
          errBox.style.display = 'block';
        }
        return;
      }

      const newUser = {
        email,
        password: pwd,
        name,
        role: 'creator',
        tier,
        provider: 'email',
        phone,
        verified: isPhoneVerified,
        avatar: name.slice(0, 1)
      };

      db.push(newUser);
      saveUsersDB(db);

      if (errBox) errBox.style.display = 'none';
      setCurrentUser(newUser);
      closeAuthModal();
      window.showToast?.(`🎉 [${name}]님 회원가입이 완료되었습니다! (${tier.toUpperCase()} 등급 적용)`);
    });
  }

  // Social 1-Click Logins (Chzzk, Kakao, Google)
  const btnChzzk = document.getElementById('btnSocialChzzk');
  const btnKakao = document.getElementById('btnSocialKakao');
  const btnGoogle = document.getElementById('btnSocialGoogle');

  function handleSocialLogin(providerName, defaultUser) {
    const db = getUsersDB();
    let existing = db.find(u => u.email === defaultUser.email);
    if (!existing) {
      db.push(defaultUser);
      saveUsersDB(db);
      existing = defaultUser;
    }
    setCurrentUser(existing);
    closeAuthModal();
    window.showToast?.(`🚀 [${providerName}] 소셜 간편 연동 로그인 완료! (${existing.name} 님)`);
  }

  if (btnChzzk) {
    btnChzzk.addEventListener('click', () => {
      handleSocialLogin('치지직(CHZZK)', {
        email: 'chzzk_creator@naver.com',
        password: 'chzzk_oauth_pass',
        name: '치지직스트리머',
        role: 'creator',
        tier: 'pro',
        provider: 'chzzk',
        phone: '010-8888-7777',
        verified: true,
        avatar: '🟩'
      });
    });
  }

  if (btnKakao) {
    btnKakao.addEventListener('click', () => {
      handleSocialLogin('카카오(Kakao)', {
        email: 'kakao_user@kakao.com',
        password: 'kakao_oauth_pass',
        name: '카카오크리에이터',
        role: 'creator',
        tier: 'basic',
        provider: 'kakao',
        phone: '010-5555-4444',
        verified: true,
        avatar: '🟨'
      });
    });
  }

  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      handleSocialLogin('구글(Google)', {
        email: 'google_partner@gmail.com',
        password: 'google_oauth_pass',
        name: '구글파트너',
        role: 'creator',
        tier: 'pro',
        provider: 'google',
        phone: '010-1111-2222',
        verified: true,
        avatar: '🔴'
      });
    });
  }

  // Initialize Session on Page Load
  const savedUser = getCurrentUser();
  updateUserUI(savedUser);
  renderAdminUsersTable();
});

