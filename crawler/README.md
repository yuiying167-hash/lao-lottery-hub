# Lao Lottery Crawler

## 설치 (M1 맥북에서 실행)

### 1. 저장소 클론 후 의존성 설치

    cd /Users/twinssn/Projects/lao-lottery-hub
    python3 -m venv crawler/.venv
    crawler/.venv/bin/pip install -r crawler/requirements.txt

### 2. 환경변수 설정

    cp crawler/.env.example crawler/.env
    # crawler/.env 파일을 열어 실제 값 입력

### 3. 수동 테스트 실행

    crawler/.venv/bin/python3 crawler/crawler.py

### 4. launchd 스케줄러 등록 (M1)

    cp scripts/com.laolottery.crawler.plist ~/Library/LaunchAgents/
    launchctl load ~/Library/LaunchAgents/com.laolottery.crawler.plist
    launchctl list | grep laolottery

### 5. 스케줄러 해제

    launchctl unload ~/Library/LaunchAgents/com.laolottery.crawler.plist

## 실행 주기
- 매주 월, 수, 금요일 20:05 ICT (13:05 UTC)
- 데이터 없으면 5분 간격으로 최대 6회 재시도 (20:35까지)

## 로그 위치
- crawler/logs/crawler_YYYYMMDD.log
- crawler/logs/launchd_stdout.log
- crawler/logs/launchd_stderr.log
