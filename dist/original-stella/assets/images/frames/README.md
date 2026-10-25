# 쏘카 스타일 캐릭터 시퀀스 프레임 안내 (Frames Directory)

이 폴더에 FFmpeg 등으로 추출한 60~90장의 WebP 또는 PNG/JPG 이미지를 넣으시면,
웹페이지의 스크롤 인터랙션 캔버스가 자동으로 감지하여 부드러운 60fps 쏘카 스타일 스크롤 애니메이션으로 재생합니다!

### 네이밍 규칙:
- `frame_001.webp`, `frame_002.webp`, ... `frame_072.webp`
- (또는 `.png`, `.jpg` 확장자 지원)

### FFmpeg 추출 명령어 예시 (사용자 가이드 기준):
```bash
ffmpeg -i character_animation.mp4 -vf "fps=24" frames/frame_%03d.webp
```

*참고: 이 폴더에 프레임 이미지가 없더라도 웹사이트는 자체 키프레임과 캔버스 우주 파티클 물리 엔진으로 자동 대체(Fallback)되어 즉시 정상 작동합니다.*
