# 🚀 미미빗(MIMIBIT) AWS 인스턴스 5분 배포 가이드

AWS Lightsail(추천) 또는 AWS EC2 인스턴스에 백엔드와 프론트엔드를 한 번에 배포하는 가장 쉽고 빠른 실전 가이드입니다.

---

## 1. AWS 인스턴스 생성 (Lightsail 추천)
1. **AWS 콘솔** ➔ **Amazon Lightsail** 접속
2. **[인스턴스 생성]** 클릭:
   * 플랫폼: **Linux/Unix**
   * 블루프린트: **OS 전용 ➔ Ubuntu 24.04 LTS (또는 22.04)**
   * 플랜 선택: **월 $3.5 또는 $5 (1GB RAM, 고정 IP 무료 제공)**
3. 생성 완료 후 **네트워킹(Networking)** 탭에서:
   * **[고정 IP(Static IP) 생성 및 연결]** 클릭
   * **방화벽(Firewall)** 규칙에 **HTTP (80), HTTPS (443), Custom (3000)** 추가

---

## 2. 서버 접속 후 원클릭 환경 세팅 (SSH 터미널)

Lightsail 콘솔에서 **[SSH 브라우저 연결]**을 누른 뒤 아래 명령어를 그대로 복사해서 실행합니다:

```bash
# 1. 패키지 업데이트 및 최신 Node.js v20 설치
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 2. 프로세스 무중단 관리자 PM2 설치
sudo npm install -g pm2

# 3. 설치 확인
node -v
npm -v
pm2 -v
```

---

## 3. 미미빗 프로젝트 업로드 및 실행

```bash
# 1. 프로젝트 폴더 생성 또는 깃허브 클론
mkdir -p /home/ubuntu/mimibit
cd /home/ubuntu/mimibit

# (깃허브 사용 시)
# git clone <대표님_깃허브_주소> .

# 2. 백엔드 의존성 설치
cd server
npm install

# 3. PM2로 백엔드 무중단 24시간 가동
pm2 start server.js --name "mimibit-api"
pm2 save
pm2 startup
```

이제 `http://<내_AWS_고정IP>:3000/health` 접속 시 `{"status":"healthy"}` 응답이 나오면 백엔드 가동 완료!

---

## 4. 프론트엔드 연결 (.env)

프론트엔드 프로젝트 루트에 `.env` 파일을 생성하고 AWS 인스턴스 주소를 입력합니다:

```env
VITE_API_BASE_URL=http://<내_AWS_고정IP>:3000
```

---

## 5. (선택) Nginx 리버스 프록시 & 무료 SSL (HTTPS) 적용

포트 번호(`:3000`) 없이 도메인(`api.mimibit.me` 또는 `mimibit.me`)으로 바로 연결하는 방법:

```bash
# 1. Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/mimibit
```

아래 내용 입력:
```nginx
server {
    listen 80;
    server_name 내도메인.com api.내도메인.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 2. Nginx 활성화
sudo ln -s /etc/nginx/sites-available/mimibit /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# 3. 무료 Let's Encrypt SSL (HTTPS) 적용
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 내도메인.com -d api.내도메인.com
```

축하합니다! 이제 100% 무료 HTTPS 보안 인증서가 적용된 실전 프로덕션 서버가 24시간 무중단으로 운영됩니다.
