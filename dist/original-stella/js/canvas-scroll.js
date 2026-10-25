/**
 * STELLA STUDIO - 144-FRAME HIGH-IMPACT CINEMATIC VTUBER ENGINE
 * 1. 시네마틱 다이내믹 카메라 워크 (얼굴 클로즈업 ➔ 돌리 줌아웃 전신 ➔ 손끝 별빛 푸시인)
 * 2. 3D 공간 홀로그램 궤도 (캐릭터 앞뒤를 입체적으로 공전하는 실시간 방송 UI)
 * 3. 마우스 시선 & 3D 패럴랙스 틸트 (Live2D 입체 생동감)
 * 4. 쏟아지는 찬란한 유성우 & 은하수 오로라 캔버스 물리 엔진
 */

class StellaScrollEngine {
  constructor() {
    this.canvas = document.getElementById('stellaScrollCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.section = document.querySelector('.socar-scroll-section');
    this.header = document.querySelector('.header-nav');
    this.progressThumb = document.querySelector('.progress-thumb');
    this.stepDots = document.querySelectorAll('.step-dot');
    this.storySteps = document.querySelectorAll('.socar-story-step');
    this.scrollHint = document.querySelector('.scroll-down-hint');
    
    // 144장 초고밀도 시퀀스 프레임 프리로드 (60fps 비디오 감도)
    this.totalFrames = 144;
    this.frames = [];
    this.loadedCount = 0;
    this.isReady = false;
    
    this.preloadFrames();
    
    // 감성 밤하늘 & 유성우 물리 시스템
    this.stars = [];
    this.meteors = [];
    this.petals = [];
    this.ripples = [];
    this.lastRippleProgress = 0;
    
    // 스크롤 및 마우스 패럴랙스 물리
    this.scrollProgress = 0;
    this.targetProgress = 0;
    this.scrollVelocity = 0;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    this.init();
  }

  onThemeChange(theme) {
    this.theme = theme;
  }

  preloadFrames() {
    for (let i = 1; i <= this.totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `assets/images/frames/frame_${pad}.webp`;
      img.onload = () => {
        this.loadedCount++;
        if (this.loadedCount >= 10) {
          this.isReady = true;
        }
      };
      this.frames.push(img);
    }
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // 마우스 반응형 3D 패럴랙스 리스너 (-1.0 ~ 1.0)
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / this.viewportWidth) * 2 - 1;
      this.targetMouseY = (e.clientY / this.viewportHeight) * 2 - 1;
    }, { passive: true });
    
    this.initStarlightSystem();
    this.handleScroll();
    
    requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  handleResize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    
    this.canvas.width = this.viewportWidth * this.dpr;
    this.canvas.height = this.viewportHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    this.canvas.style.width = `${this.viewportWidth}px`;
    this.canvas.style.height = `${this.viewportHeight}px`;
    
    this.initStarlightSystem();
  }

  initStarlightSystem() {
    this.stars = [];
    const starCount = this.viewportWidth > 1024 ? 220 : 120;
    for (let i = 0; i < starCount; i++) {
      const depth = Math.random();
      this.stars.push({
        x: Math.random() * this.viewportWidth,
        y: Math.random() * this.viewportHeight,
        baseX: Math.random() * this.viewportWidth,
        baseY: Math.random() * this.viewportHeight,
        size: depth > 0.85 ? Math.random() * 2.5 + 1.8 : (depth > 0.4 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.9 + 0.4),
        alpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.65 ? '#c4b5fd' : (Math.random() > 0.4 ? '#93c5fd' : (Math.random() > 0.2 ? '#fde047' : '#ffffff')),
        depth: depth,
        hasSpikes: depth > 0.92
      });
    }

    this.meteors = [];
    
    this.petals = [];
    for (let i = 0; i < 35; i++) {
      this.petals.push({
        x: Math.random() * this.viewportWidth,
        y: Math.random() * this.viewportHeight,
        size: Math.random() * 4 + 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5 ? '#e9d5ff' : '#fbcfe8'
      });
    }
  }

  handleScroll() {
    if (!this.section) return;
    
    const rect = this.section.getBoundingClientRect();
    const totalScrollable = this.section.offsetHeight - window.innerHeight;
    
    if (totalScrollable <= 0) return;
    
    let progress = -rect.top / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));
    this.targetProgress = progress;
    
    if (this.header) {
      if (progress >= 0.98 || rect.bottom <= window.innerHeight * 0.92) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
    
    if (this.scrollHint) {
      this.scrollHint.style.opacity = progress > 0.03 ? '0' : '0.85';
    }
  }

  updateStepOpacities(p) {
    let opacities = [0, 0, 0, 0, 0];
    let transforms = [0, 0, 0, 0, 0];

    // Act 1: 0.00 ~ 0.18 (전환 0.16 ~ 0.22)
    // Act 2: 0.22 ~ 0.38 (전환 0.36 ~ 0.42)
    // Act 3: 0.42 ~ 0.62 (전환 0.60 ~ 0.66)
    // Act 4: 0.66 ~ 0.84 (전환 0.82 ~ 0.88)
    // Act 5: 0.88 ~ 1.00 (온에어 피날레)
    if (p < 0.16) {
      opacities[0] = 1;
      transforms[0] = 0;
    } else if (p < 0.22) {
      const t = (p - 0.16) / 0.06;
      opacities[0] = Math.max(0, 1 - t * 1.35);
      transforms[0] = -t * 26;
      opacities[1] = Math.max(0, (t - 0.1) * 1.25);
      transforms[1] = (1 - t) * 26;
    } else if (p < 0.36) {
      opacities[1] = 1;
      transforms[1] = 0;
    } else if (p < 0.42) {
      const t = (p - 0.36) / 0.06;
      opacities[1] = Math.max(0, 1 - t * 1.35);
      transforms[1] = -t * 26;
      opacities[2] = Math.max(0, (t - 0.1) * 1.25);
      transforms[2] = (1 - t) * 26;
    } else if (p < 0.60) {
      opacities[2] = 1;
      transforms[2] = 0;
    } else if (p < 0.66) {
      const t = (p - 0.60) / 0.06;
      opacities[2] = Math.max(0, 1 - t * 1.35);
      transforms[2] = -t * 26;
      opacities[3] = Math.max(0, (t - 0.1) * 1.25);
      transforms[3] = (1 - t) * 26;
    } else if (p < 0.80) {
      opacities[3] = 1;
      transforms[3] = 0;
    } else if (p < 0.86) {
      const t = (p - 0.80) / 0.06;
      opacities[3] = Math.max(0, 1 - t * 1.35);
      transforms[3] = -t * 26;
      opacities[4] = Math.max(0, (t - 0.1) * 1.25);
      transforms[4] = (1 - t) * 26;
    } else {
      opacities[4] = 1;
      transforms[4] = 0;
    }

    this.storySteps.forEach((el, idx) => {
      const op = opacities[idx] || 0;
      const ty = transforms[idx] || 0;
      
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translateY(calc(-50% + ${ty.toFixed(1)}px)) scale(${0.96 + (op * 0.04)})`;
      el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
      el.style.visibility = op > 0.02 ? 'visible' : 'hidden';
      
      if (op > 0.6) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    if (this.progressThumb) {
      this.progressThumb.style.height = `${p * 100}%`;
    }
    
    // 5단계 도트 인디케이터 활성화
    let activeIdx = 0;
    if (p >= 0.82) activeIdx = 4;
    else if (p >= 0.62) activeIdx = 3;
    else if (p >= 0.38) activeIdx = 2;
    else if (p >= 0.18) activeIdx = 1;

    this.stepDots.forEach((dot, idx) => {
      if (idx === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  spawnMeteor(forceSpeed = 1) {
    const isLight = (document.documentElement.getAttribute('data-theme') || this.theme) === 'light';
    const startX = Math.random() * (this.viewportWidth * 1.3) - (this.viewportWidth * 0.15);
    const startY = Math.random() * (this.viewportHeight * 0.45) - 90;
    
    const angle = (Math.PI / 180) * (38 + (Math.random() - 0.5) * 12);
    const speed = (Math.random() * 14 + 18) * forceSpeed;
    const length = Math.random() * 150 + 130;
    const thickness = Math.random() * 2.2 + 1.2;
    
    const palette = isLight 
      ? ['#6366f1', '#8b5cf6', '#0284c7', '#d97706']
      : ['#ffffff', '#a78bfa', '#38bdf8', '#fde047', '#f472b6'];
    const coreColor = palette[Math.floor(Math.random() * palette.length)];

    this.meteors.push({
      x: startX,
      y: startY,
      prevX: startX,
      prevY: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: length,
      thickness: thickness,
      alpha: 1.0,
      fadeSpeed: Math.random() * 0.025 + 0.015,
      color: coreColor,
      sparks: []
    });
  }

  renderLoop(timestamp) {
    const prevProg = this.scrollProgress;
    this.scrollProgress += (this.targetProgress - this.scrollProgress) * 0.10;
    this.scrollVelocity = Math.abs(this.scrollProgress - prevProg);
    
    // 마우스 패럴랙스 스무딩
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
    
    this.updateStepOpacities(this.scrollProgress);

    this.ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

    // 1. 깊고 웅장한 감성 밤하늘 & 은하수 오로라 (마우스 시차 연동)
    this.renderNightSkyAndMilkyWay(timestamp);

    // 2. 밤하늘을 수놓는 별빛 필드
    this.renderStarlightField(timestamp);

    // 3. 쏟아져 내리는 역동적 유성우 (Meteor Shower) 물리 렌더링
    this.renderMeteorShower(timestamp);

    // 4. 시네마틱 카메라 & 버츄얼 캐릭터 + 3D 공간 홀로그램 궤도 렌더링
    this.renderCinematicCharacterScene(timestamp);

    // 5. 스텔라 각성 오로라 링 파동 & 흩날리는 별빛 꽃잎
    this.renderAwakeningRipplesAndPetals(timestamp);

    requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  /**
   * 1. 감성 밤하늘 & 은하수 렌더링 (마우스 시차 반영)
   */
  renderNightSkyAndMilkyWay(timestamp) {
    const p = this.scrollProgress;
    const isLight = (document.documentElement.getAttribute('data-theme') || this.theme) === 'light';

    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.viewportHeight);
    
    if (isLight) {
      skyGrad.addColorStop(0, '#e0e7ff');
      skyGrad.addColorStop(0.35, '#ede9fe');
      skyGrad.addColorStop(0.70, '#f5f3ff');
      skyGrad.addColorStop(1, '#f1f5f9');
    } else {
      skyGrad.addColorStop(0, '#1c1542');
      skyGrad.addColorStop(0.30, '#111233');
      skyGrad.addColorStop(0.65, '#08081c');
      skyGrad.addColorStop(1, '#03030a');
    }
    
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);

    // 은하수 오로라 밴드 (마우스 패럴랙스로 은은하게 흔들림)
    this.ctx.save();
    const mwAngle = -0.32;
    const mwOffsetX = this.mouseX * -14;
    const mwOffsetY = this.mouseY * -12;
    
    this.ctx.translate(this.viewportWidth * 0.5 + mwOffsetX, this.viewportHeight * 0.45 + mwOffsetY);
    this.ctx.rotate(mwAngle);

    const mwWidth = Math.max(this.viewportWidth, this.viewportHeight) * 1.5;
    const mwGrad = this.ctx.createLinearGradient(0, -220, 0, 220);
    
    if (isLight) {
      mwGrad.addColorStop(0, 'rgba(196, 181, 253, 0)');
      mwGrad.addColorStop(0.35, 'rgba(167, 139, 250, 0.12)');
      mwGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.16)');
      mwGrad.addColorStop(0.65, 'rgba(244, 114, 182, 0.10)');
      mwGrad.addColorStop(1, 'rgba(196, 181, 253, 0)');
    } else {
      mwGrad.addColorStop(0, 'rgba(139, 92, 246, 0)');
      mwGrad.addColorStop(0.30, 'rgba(139, 92, 246, 0.15)');
      mwGrad.addColorStop(0.50, 'rgba(56, 189, 248, 0.20)');
      mwGrad.addColorStop(0.70, 'rgba(236, 72, 153, 0.12)');
      mwGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    }

    this.ctx.fillStyle = mwGrad;
    this.ctx.fillRect(-mwWidth / 2, -220, mwWidth, 440);
    this.ctx.restore();
  }

  /**
   * 2. 별빛 필드 (마우스 패럴랙스 + 3D 뎁스)
   */
  renderStarlightField(timestamp) {
    const time = timestamp * 0.001;
    const p = this.scrollProgress;
    const isLight = (document.documentElement.getAttribute('data-theme') || this.theme) === 'light';

    this.stars.forEach((s) => {
      const parallaxY = s.baseY - (p * 260 * s.depth) + (this.mouseY * -24 * s.depth);
      const parallaxX = s.baseX + (this.mouseX * -24 * s.depth);
      
      const curY = ((parallaxY % this.viewportHeight) + this.viewportHeight) % this.viewportHeight;
      const curX = ((parallaxX % this.viewportWidth) + this.viewportWidth) % this.viewportWidth;

      const twinkle = 0.75 + Math.sin(time * 3 + s.x) * 0.25;
      const curAlpha = s.alpha * twinkle * (isLight ? 0.65 : 1.0);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0.1, Math.min(0.9, curAlpha));
      this.ctx.fill();

      if (s.hasSpikes && curAlpha > 0.45) {
        this.ctx.strokeStyle = s.color;
        this.ctx.lineWidth = 0.8;
        this.ctx.globalAlpha = curAlpha * 0.4;
        const spikeLen = s.size * 3.5;

        this.ctx.beginPath();
        this.ctx.moveTo(curX - spikeLen, curY);
        this.ctx.lineTo(curX + spikeLen, curY);
        this.ctx.moveTo(curX, curY - spikeLen);
        this.ctx.lineTo(curX, curY + spikeLen);
        this.ctx.stroke();
      }

      this.ctx.restore();
    });
  }

  /**
   * 3. 쏟아져 내리는 유성우 (Meteor Shower) 물리 엔진
   */
  renderMeteorShower(timestamp) {
    const p = this.scrollProgress;
    
    let spawnRate = 0.025;
    if (p >= 0.38 && p <= 0.68) {
      // Act 3 (Meteor Awakening: 0.38 ~ 0.68): 유성우가 밤하늘을 가르며 폭발적으로 쏟아짐!
      spawnRate = 0.12 + (this.scrollVelocity * 4.5);
    } else if (p >= 0.18 && p <= 0.88) {
      spawnRate = 0.06 + (this.scrollVelocity * 2.5);
    } else {
      spawnRate = 0.02 + (this.scrollVelocity * 1.5);
    }

    if (Math.random() < spawnRate && this.meteors.length < 12) {
      this.spawnMeteor(1 + (this.scrollVelocity * 2.0));
    }

    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.prevX = m.x;
      m.prevY = m.y;
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.fadeSpeed;

      if (Math.random() < 0.35 && m.alpha > 0.3) {
        m.sparks.push({
          x: m.prevX + (Math.random() - 0.5) * 6,
          y: m.prevY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          alpha: m.alpha * 0.8,
          size: Math.random() * 2 + 0.8,
          color: m.color
        });
      }

      if (m.alpha > 0) {
        this.ctx.save();
        const tailX = m.x - (m.vx * (m.length / Math.hypot(m.vx, m.vy)));
        const tailY = m.y - (m.vy * (m.length / Math.hypot(m.vx, m.vy)));

        const meteorGrad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        meteorGrad.addColorStop(0.7, m.color);
        meteorGrad.addColorStop(1, '#ffffff');

        this.ctx.strokeStyle = meteorGrad;
        this.ctx.lineWidth = m.thickness;
        this.ctx.lineCap = 'round';
        this.ctx.globalAlpha = Math.max(0, Math.min(1, m.alpha));

        this.ctx.beginPath();
        this.ctx.moveTo(tailX, tailY);
        this.ctx.lineTo(m.x, m.y);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(m.x, m.y, m.thickness * 1.4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }

      for (let sIdx = m.sparks.length - 1; sIdx >= 0; sIdx--) {
        const sp = m.sparks[sIdx];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.035;

        if (sp.alpha > 0) {
          this.ctx.save();
          this.ctx.fillStyle = sp.color;
          this.ctx.globalAlpha = sp.alpha;
          this.ctx.beginPath();
          this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        } else {
          m.sparks.splice(sIdx, 1);
        }
      }

      if (m.alpha <= 0 || m.x > this.viewportWidth + 200 || m.y > this.viewportHeight + 200) {
        this.meteors.splice(i, 1);
      }
    }
  }

  /**
   * 4. 시네마틱 다이내믹 카메라 워크 & 3D 공간 홀로그램 궤도 렌더러
   * - Chapter 1: 초승달과 스텔라 얼굴 극적 클로즈업 (Close-up, Scale 1.65)
   * - Chapter 2: 유성우 폭발과 함께 시원한 돌리 줌아웃 (Dolly Zoom-out, Scale 1.0)
   * - Chapter 3: 각성과 별빛 오로라 파동
   * - Chapter 4: 손끝 별빛 코어로 푸시인 (Push-in, Scale 1.15) & 3D 홀로그램 궤도 공전
   */
  renderCinematicCharacterScene(timestamp) {
    const p = this.scrollProgress;
    const time = timestamp * 0.0015;
    
    // 5막 서사와 144장 프레임의 완벽한 1:1 시네마틱 싱크
    let frameProg = 0;
    if (p < 0.18) {
      // Act 1: 초승달에 기대어 잠든 스텔라 (Frame 0 ~ 24)
      frameProg = (p / 0.18) * (24 / 143);
    } else if (p < 0.24) {
      // Act 1 ➔ Act 2 스크롤 전환 모핑 (Frame 25 ~ 51)
      const t = (p - 0.18) / 0.06;
      frameProg = (25 + t * 26) / 143;
    } else if (p < 0.40) {
      // Act 2 본문 구간: 잔상 0% 완벽하게 눈을 뜨고 미소 짓는 스텔라 (Frame 52 ~ 65)
      // 02번 버튼 클릭 시 잔상 없이 가장 맑고 예쁜 스텔라(Frame 57 부근)가 표시됨!
      const t = (p - 0.24) / 0.16;
      frameProg = (52 + t * 13) / 143;
    } else if (p < 0.64) {
      // Act 3: 각성과 유성우 (Frame 66 ~ 100)
      const t = (p - 0.40) / 0.24;
      frameProg = (66 + t * 34) / 143;
    } else if (p < 0.84) {
      // Act 4: 마법 실현과 홀로그램 공전 (Frame 101 ~ 138)
      const t = (p - 0.64) / 0.20;
      frameProg = (101 + t * 37) / 143;
    } else {
      // Act 5: 찬란한 온에어 피날레 (Frame 139 ~ 143)
      const t = Math.min(1, (p - 0.84) / 0.16);
      frameProg = (139 + t * 4) / 143;
    }

    const exactFrame = frameProg * (this.totalFrames - 1);
    const frameIndex = Math.min(this.totalFrames - 1, Math.max(0, Math.round(exactFrame)));

    const currentImg = this.frames[frameIndex];
    if (!currentImg || !currentImg.complete) return;

    const isMobile = this.viewportWidth < 768;
    const isTablet = this.viewportWidth < 1024;

    // 기본 캐릭터 바운딩 규격 & 글씨-캐릭터 황금비율 밀착 배치
    let baseHeight, baseWidth, baseDrawX, baseDrawY;

    if (isMobile) {
      baseHeight = this.viewportHeight * 0.72;
      baseWidth = baseHeight * (896 / 1200);
      baseDrawX = (this.viewportWidth - baseWidth) / 2;
      baseDrawY = (this.viewportHeight - baseHeight) / 2 + 30;
    } else if (isTablet) {
      baseHeight = this.viewportHeight * 0.85;
      baseWidth = baseHeight * (896 / 1200);
      baseDrawX = this.viewportWidth * 0.44;
      baseDrawY = (this.viewportHeight - baseHeight) / 2;
    } else {
      // 데스크톱 / 와이드 화면:
      // 중앙 1260px 컨테이너 기준, 좌측 텍스트(너비 540px) 바로 우측 35px 옆에 밀착!
      baseHeight = Math.min(this.viewportHeight * 0.92, 880);
      baseWidth = baseHeight * (896 / 1200);

      const containerWidth = Math.min(this.viewportWidth, 1260);
      const containerLeft = (this.viewportWidth - containerWidth) / 2;
      const textRightEdge = containerLeft + 40 + 540; // 패딩 2.5rem(40px) + 텍스트너비(540px)

      // 텍스트 바로 우측 35px 옆에 배치하여 빈공간 완전 해소!
      baseDrawX = Math.min(textRightEdge + 35, this.viewportWidth - baseWidth - 40);
      baseDrawY = (this.viewportHeight - baseHeight) / 2;
    }

    // ========================================================
    // 💎 방법 B: 애플 & 호요버스 스타일 시네마틱 스테이지 연출
    // 인위적 카메라 흔들림/확대를 걷어내고, 캐릭터의 품격 있는 전신과
    // 마우스 3D 틸트 + 3D 홀로그램 공전 + 밤하늘 공간감으로 압도감 완성
    // ========================================================
    // 스크롤 끝(온에어)으로 갈수록 아주 미세하고 우아하게 집중되는 영적 푸시인 (1.00 ➔ 1.03)
    const cameraScale = 1.00 + (p * 0.035);
    
    // 신비로운 우주 유영 미세 호흡 (Subtle Float Breath)
    const floatBreathY = Math.sin(time * 1.4) * 6;

    // 마우스 반응형 3D 패럴랙스 (Live2D 입체 시선)
    const mouseShiftX = this.mouseX * 20;
    const mouseShiftY = this.mouseY * 16;
    const mouseTilt = this.mouseX * 0.015; // 미세한 3D 입체 각도 틸트

    // 캐릭터 중심점 (완벽하게 안정된 황금비율 위치)
    const centerX = baseDrawX + (baseWidth * 0.5);
    const centerY = baseDrawY + (baseHeight * 0.45);

    // ========================================================
    // 🌌 스텔라 배후 신비로운 오로라 후광 링 (Act 2부터 점진적 발현)
    // ========================================================
    if (p > 0.15) {
      const haloAlpha = Math.min(0.65, (p - 0.15) * 1.5);
      const haloRadius = (baseWidth * 0.42) * (1 + Math.sin(time * 1.8) * 0.04);
      
      this.ctx.save();
      const haloGrad = this.ctx.createRadialGradient(
        centerX, centerY, haloRadius * 0.2,
        centerX, centerY, haloRadius * 1.4
      );
      haloGrad.addColorStop(0, 'rgba(196, 181, 253, 0.45)');
      haloGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
      haloGrad.addColorStop(1, 'rgba(24, 20, 68, 0)');

      this.ctx.globalAlpha = haloAlpha;
      this.ctx.fillStyle = haloGrad;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY + floatBreathY, haloRadius * 1.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3D 홀로그램 방송 위젯 정의
    const hologramCards = [
      { id: 'chat', label: '실시간 채팅', val: '스텔라님 방송 시작! ✨', icon: '💬', color: '#38bdf8', orbit: 0 },
      { id: 'donation', label: '치즈 도네이션', val: '50,000 치즈 후원', icon: '🧀', color: '#fde047', orbit: Math.PI * 0.5 },
      { id: 'ai', label: '스마트 AI 챗봇', val: '지연율 0.02초 가동 중', icon: '🤖', color: '#a78bfa', orbit: Math.PI },
      { id: 'roulette', label: '도네이션 룰렛', val: '10초 애교 미션 당첨!', icon: '🎰', color: '#f472b6', orbit: Math.PI * 1.5 }
    ];

    // Act 4~5 (p > 0.55)에서 활성화되는 3D 공전 궤도 연산
    const hologramActive = p > 0.55;
    const hologramIntensity = Math.min(1, Math.max(0, (p - 0.55) / 0.20));

    // ========================================================
    // 🪐 3D 홀로그램 레이어 1: 캐릭터 뒤를 지나가는 카드 (Back Layer)
    // ========================================================
    if (hologramActive && !isMobile) {
      hologramCards.forEach((c) => {
        const angle = time * 0.7 + c.orbit;
        const z = Math.sin(angle); // -1 (뒤) ~ +1 (앞)
        if (z < 0) {
          this.render3DHologramCard(c, centerX, centerY + floatBreathY, baseWidth, angle, z, hologramIntensity);
        }
      });
    }

    // ========================================================
    // 👸 버츄얼 캐릭터 스텔라 렌더링 (100% Opaque Solid Video Render)
    // ========================================================
    this.ctx.save();
    this.ctx.translate(centerX + mouseShiftX, centerY + mouseShiftY + floatBreathY);
    this.ctx.rotate(mouseTilt);
    this.ctx.scale(cameraScale, cameraScale);
    this.ctx.translate(-centerX, -centerY);

    this.ctx.globalAlpha = 1.0;
    this.ctx.drawImage(currentImg, baseDrawX, baseDrawY, baseWidth, baseHeight);

    // 각성 순간(Chapter 2 진입: p 0.26~0.32) 눈동자 별빛 섬광 이펙트 (Lens Glint)
    if (p >= 0.26 && p <= 0.34) {
      const glintProg = (p - 0.26) / 0.08;
      const glintAlpha = Math.sin(glintProg * Math.PI) * 0.85;
      const eyeX = baseDrawX + (baseWidth * 0.53);
      const eyeY = baseDrawY + (baseHeight * 0.21);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(eyeX, eyeY, 6 * glintProg, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = glintAlpha;
      this.ctx.fill();

      this.ctx.strokeStyle = '#c4b5fd';
      this.ctx.lineWidth = 1.5;
      const gLen = 16 * glintProg;
      this.ctx.beginPath();
      this.ctx.moveTo(eyeX - gLen, eyeY);
      this.ctx.lineTo(eyeX + gLen, eyeY);
      this.ctx.moveTo(eyeX, eyeY - gLen);
      this.ctx.lineTo(eyeX, eyeY + gLen);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.restore();

    // ========================================================
    // 🪐 3D 홀로그램 레이어 2: 캐릭터 앞을 지나가는 카드 (Front Layer)
    // ========================================================
    if (hologramActive && !isMobile) {
      hologramCards.forEach((c) => {
        const angle = time * 0.7 + c.orbit;
        const z = Math.sin(angle);
        if (z >= 0) {
          this.render3DHologramCard(c, centerX, centerY + floatBreathY, baseWidth, angle, z, hologramIntensity);
        }
      });
    }

    // 좌측 텍스트 구역의 자연스러운 밤하늘 융합 비네팅
    this.ctx.save();
    const isLight = (document.documentElement.getAttribute('data-theme') || this.theme) === 'light';
    const leftTextGlow = this.ctx.createLinearGradient(0, 0, this.viewportWidth * 0.55, 0);
    if (isLight) {
      leftTextGlow.addColorStop(0, 'rgba(241, 245, 249, 0.95)');
      leftTextGlow.addColorStop(0.42, 'rgba(241, 245, 249, 0.78)');
      leftTextGlow.addColorStop(0.78, 'rgba(241, 245, 249, 0.25)');
      leftTextGlow.addColorStop(1, 'rgba(241, 245, 249, 0)');
    } else {
      leftTextGlow.addColorStop(0, 'rgba(4, 4, 14, 0.94)');
      leftTextGlow.addColorStop(0.42, 'rgba(4, 4, 14, 0.76)');
      leftTextGlow.addColorStop(0.78, 'rgba(4, 4, 14, 0.22)');
      leftTextGlow.addColorStop(1, 'rgba(4, 4, 14, 0)');
    }
    this.ctx.fillStyle = leftTextGlow;
    this.ctx.fillRect(0, 0, this.viewportWidth * 0.58, this.viewportHeight);
    this.ctx.restore();
  }

  /**
   * 캐릭터 앞뒤를 3D로 감싸 도는 입체 홀로그램 UI 카드 렌더링
   */
  render3DHologramCard(card, centerX, centerY, baseWidth, angle, z, intensity) {
    // 3D 타원 궤도 좌표 연산 (스텔라의 오른쪽과 중심 주위를 3D로 공전하여 좌측 텍스트와 절대 겹치지 않음)
    const orbitCenterX = centerX + (baseWidth * 0.22);
    const orbitRadiusX = baseWidth * 0.26;
    const orbitRadiusY = baseWidth * 0.20;
    
    const cardX = orbitCenterX + Math.cos(angle) * orbitRadiusX + (this.mouseX * 18 * (z + 1));
    const cardY = centerY + Math.sin(angle) * orbitRadiusY + (this.mouseY * 14 * (z + 1));
    
    // Z축에 따른 스케일 및 알파 (앞에 올수록 크고 선명하게)
    const cardScale = 0.80 + (z + 1) * 0.14; // 0.80 ~ 1.08
    const cardAlpha = (0.35 + (z + 1) * 0.32) * intensity;

    const cardW = 154 * cardScale;
    const cardH = 48 * cardScale;

    this.ctx.save();
    this.ctx.translate(cardX, cardY);
    this.ctx.globalAlpha = Math.max(0, Math.min(1, cardAlpha));

    // 글래스모피즘 카드 배경
    const bgGrad = this.ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
    bgGrad.addColorStop(0, 'rgba(24, 20, 68, 0.90)');
    bgGrad.addColorStop(1, 'rgba(12, 14, 45, 0.90)');

    this.ctx.fillStyle = bgGrad;
    this.ctx.strokeStyle = card.color;
    this.ctx.lineWidth = 1.2;

    this.ctx.beginPath();
    this.ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 8 * cardScale);
    this.ctx.fill();
    this.ctx.stroke();

    // 카드 내부 텍스트 & 아이콘
    this.ctx.font = `bold ${10.5 * cardScale}px sans-serif`;
    this.ctx.fillStyle = card.color;
    this.ctx.fillText(`${card.icon} ${card.label}`, -cardW / 2 + (10 * cardScale), -cardH / 2 + (18 * cardScale));

    this.ctx.font = `${10 * cardScale}px sans-serif`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(card.val, -cardW / 2 + (10 * cardScale), -cardH / 2 + (35 * cardScale));

    this.ctx.restore();
  }

  /**
   * 5. 스텔라 각성 오로라 링 파동 & 흩날리는 별빛 꽃잎
   */
  renderAwakeningRipplesAndPetals(timestamp) {
    const time = timestamp * 0.002;
    const p = this.scrollProgress;

    if (p > 0.50 && p - this.lastRippleProgress > 0.08) {
      this.lastRippleProgress = p;
      const originX = this.viewportWidth > 1024 ? this.viewportWidth * 0.70 : this.viewportWidth * 0.65;
      const originY = this.viewportHeight * 0.38;

      this.ripples.push({
        x: originX,
        y: originY,
        r: 10,
        maxR: this.viewportWidth * 0.45,
        alpha: 0.65,
        speed: 4.5
      });
    }

    for (let rIdx = this.ripples.length - 1; rIdx >= 0; rIdx--) {
      const rp = this.ripples[rIdx];
      rp.r += rp.speed;
      rp.alpha -= 0.012;

      if (rp.alpha > 0 && rp.r < rp.maxR) {
        this.ctx.save();
        this.ctx.strokeStyle = `rgba(167, 139, 250, ${rp.alpha * 0.5})`;
        this.ctx.lineWidth = 1.8;
        this.ctx.beginPath();
        this.ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      } else {
        this.ripples.splice(rIdx, 1);
      }
    }

    if (p > 0.35) {
      const petalIntensity = Math.min(1, (p - 0.35) / 0.25);
      
      this.petals.forEach((petal) => {
        petal.y -= petal.speedY;
        petal.x += Math.sin(time + petal.y * 0.01) * 0.8;
        petal.rot += petal.rotSpeed;

        if (petal.y < -20) petal.y = this.viewportHeight + 20;

        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);
        this.ctx.rotate(petal.rot);
        this.ctx.fillStyle = petal.color;
        this.ctx.globalAlpha = petal.alpha * petalIntensity * 0.65;
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.stellaEngine = new StellaScrollEngine();
});
