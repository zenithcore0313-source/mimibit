/**
 * STELLA STUDIO - MAIN INTERACTIVE LOGIC
 * 스텔라 스튜디오 인터랙티브 위젯 시뮬레이터, 요금제 토글, FAQ, 네비게이션
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initWidgetPlayground();
  initPricingToggle();
  initFaqAccordion();
  initStepNavigation();
});

/* 0. Theme Toggle Handler (Dark / Light Mode) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  
  // 저장된 테마 불러오기 (기본값: dark)
  const savedTheme = localStorage.getItem('stella-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('stella-theme', nextTheme);
      
      if (window.stellaEngine && typeof window.stellaEngine.onThemeChange === 'function') {
        window.stellaEngine.onThemeChange(nextTheme);
      }
    });
  }
}

/* 1. Header Scroll Effect */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Interactive Widget Playground (Stella Studio Style Live Demo) */
function initWidgetPlayground() {
  const donationAlert = document.getElementById('donationAlert');
  const speechBubble = document.getElementById('stellaSpeechBubble');
  const chatInput = document.getElementById('chatSimInput');
  const btnSend = document.getElementById('btnSimSend');
  
  // 프리셋 버튼들
  const btnSimDonation = document.getElementById('btnSimDonation');
  const btnSimAiBot = document.getElementById('btnSimAiBot');
  const btnSimRoulette = document.getElementById('btnSimRoulette');
  const btnSimMission = document.getElementById('btnSimMission');

  // 도네이션 알림 트리거
  function triggerDonation(name = '별빛기사단', amount = '10,000 치즈', msg = '오늘 방송도 너무 재밌어요! 스텔라 화이팅 ✨') {
    if (!donationAlert) return;
    const titleEl = donationAlert.querySelector('.alert-title');
    const msgEl = donationAlert.querySelector('.alert-msg');
    
    if (titleEl) titleEl.textContent = `${name}님의 후원 (${amount})`;
    if (msgEl) msgEl.textContent = msg;

    donationAlert.classList.add('show');
    
    // 스피치 버블도 반응
    updateSpeechBubble(`와앗! ${name}님 ${amount} 후원 진심으로 감사드려요! 💜`);

    clearTimeout(donationAlert._timer);
    donationAlert._timer = setTimeout(() => {
      donationAlert.classList.remove('show');
    }, 4500);
  }

  // 말풍선 대사 업데이트
  function updateSpeechBubble(text) {
    if (!speechBubble) return;
    speechBubble.style.opacity = '0';
    speechBubble.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      speechBubble.textContent = text;
      speechBubble.style.opacity = '1';
      speechBubble.style.transform = 'translateY(0)';
    }, 200);
  }

  // 사용자 채팅 입력 처리
  function handleSendMessage() {
    if (!chatInput) return;
    const val = chatInput.value.trim();
    if (!val) return;

    chatInput.value = '';

    if (val.startsWith('!스텔라') || val.includes('스텔라') || val.includes('안녕') || val.includes('치지직')) {
      const answers = [
        "네, 방송지기 스텔라 대기 중이에요! 오늘 방송 흐름도 최고예요 ✨",
        "치지직 채팅창과 0.05초 만에 싱크 완료! 무엇을 도와드릴까요?",
        "방금 들어온 질문을 도네이션 룰렛에 등록해둘까요? 후훗 💜",
        "현재 방송 시청자 유입률이 지난주 대비 142% 상승 중이에요!"
      ];
      const randomAns = answers[Math.floor(Math.random() * answers.length)];
      updateSpeechBubble(randomAns);
    } else {
      updateSpeechBubble(`[채팅 접수] "${val}" - 시청자님과 실시간으로 소통 중이에요! 🌟`);
    }
  }

  if (btnSimDonation) {
    btnSimDonation.addEventListener('click', () => {
      triggerDonation('트윙클_라떼', '50,000 치즈', '스텔라 스튜디오 위젯 너무 예쁘다 대박나자!');
    });
  }

  if (btnSimAiBot) {
    btnSimAiBot.addEventListener('click', () => {
      updateSpeechBubble("!스텔라 명령어 호출됨: '오늘 2부는 시청자 참여 롤 내전 & 룰렛 벌칙 방송입니다!'");
    });
  }

  if (btnSimRoulette) {
    btnSimRoulette.addEventListener('click', () => {
      triggerDonation('행운의룰렛봇', '10,000 치즈', '🎰 [룰렛 당첨] 치킨 기프티콘 증정!');
      updateSpeechBubble("축하합니다! 룰렛에서 '치킨 기프티콘'이 당첨되었어요! 🎉");
    });
  }

  if (btnSimMission) {
    btnSimMission.addEventListener('click', () => {
      triggerDonation('열혈팬1호', '100,000 치즈', '🎯 [미션 100,000치즈] 1등 못하면 공포게임 2시간!');
      updateSpeechBubble("우와 대형 미션 등장! 스트리머님 과연 1등을 성공할 수 있을까요?!");
    });
  }

  if (btnSend) {
    btnSend.addEventListener('click', handleSendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }
}

/* 3. Pricing Period Toggle (Monthly / Annual) */
function initPricingToggle() {
  const switchEl = document.getElementById('pricingSwitch');
  const monthlyLabel = document.getElementById('labelMonthly');
  const annualLabel = document.getElementById('labelAnnual');
  const priceElements = document.querySelectorAll('.plan-price-val');
  
  if (!switchEl) return;

  const pricingData = {
    monthly: ['0', '14,900', '34,900'],
    annual: ['0', '11,900', '27,900'] // 20% discount
  };

  let isAnnual = false;

  function setPricing(annual) {
    isAnnual = annual;
    if (annual) {
      switchEl.classList.add('annual');
      annualLabel.classList.add('active');
      monthlyLabel.classList.remove('active');
      
      priceElements.forEach((el, idx) => {
        animateValue(el, pricingData.annual[idx]);
      });
    } else {
      switchEl.classList.remove('annual');
      monthlyLabel.classList.add('active');
      annualLabel.classList.remove('active');
      
      priceElements.forEach((el, idx) => {
        animateValue(el, pricingData.monthly[idx]);
      });
    }
  }

  switchEl.addEventListener('click', () => setPricing(!isAnnual));
  monthlyLabel.addEventListener('click', () => setPricing(false));
  annualLabel.addEventListener('click', () => setPricing(true));
}

function animateValue(element, targetText) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(-5px)';
  setTimeout(() => {
    element.textContent = targetText;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 150);
}

/* 4. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 5. Step Indicator Click Navigation */
function initStepNavigation() {
  const stepDots = document.querySelectorAll('.step-dot');
  const scrollSection = document.querySelector('.socar-scroll-section');
  if (!scrollSection || !stepDots.length) return;

  stepDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-target-step'), 10);
      const sectionTop = scrollSection.offsetTop;
      const sectionHeight = scrollSection.offsetHeight - window.innerHeight;
      
      // 5막 서사 스텝별 목표 스크롤 비율 (0.05, 0.30, 0.52, 0.74, 0.92)
      const targetRatios = [0.05, 0.30, 0.52, 0.74, 0.92];
      const targetRatio = targetRatios[step - 1] !== undefined ? targetRatios[step - 1] : 0;
      
      window.scrollTo({
        top: sectionTop + (sectionHeight * targetRatio),
        behavior: 'smooth'
      });
    });
  });
}
