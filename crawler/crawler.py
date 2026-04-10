#!/usr/bin/env python3
"""
Lao Lottery Crawler
mthai.com에서 라오스 복권 데이터를 파싱하여 Cloudflare D1에 저장
실행: python3 crawler.py
"""

import os
import re
import json
import logging
import time
from datetime import datetime
from typing import Optional

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── 환경변수 로드 ──────────────────────────────────────────
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

ACCOUNT_ID  = os.getenv('CLOUDFLARE_ACCOUNT_ID', '')
DATABASE_ID = os.getenv('CLOUDFLARE_D1_DATABASE_ID', '')
API_TOKEN   = os.getenv('CLOUDFLARE_API_TOKEN', '')

TARGET_URL  = 'https://mthai.com/lotto/%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B8%A7'
D1_API_URL  = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{DATABASE_ID}/query'

# ── 로깅 설정 ──────────────────────────────────────────────
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(
            os.path.join(log_dir, f'crawler_{datetime.now().strftime("%Y%m%d")}.log'),
            encoding='utf-8'
        ),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)


# ── HTML fetch ────────────────────────────────────────────
def fetch_html(url: str) -> Optional[str]:
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/124.0.0.0 Safari/537.36'
        ),
        'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
    }
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        resp.encoding = 'utf-8'
        log.info(f'HTML fetch 성공 (status={resp.status_code}, size={len(resp.text)}bytes)')
        return resp.text
    except requests.RequestException as e:
        log.error(f'HTML fetch 실패: {e}')
        return None


# ── 파싱 ──────────────────────────────────────────────────
def parse_lottery(html: str) -> Optional[dict]:
    soup = BeautifulSoup(html, 'lxml')

    try:
        # h3 텍스트 목록 추출
        h3_texts = [h3.get_text(strip=True) for h3 in soup.find_all('h3')]
        log.info(f'h3 태그 {len(h3_texts)}개 발견')

        def get_value_after(labels: list) -> Optional[str]:
            """레이블 h3 다음 h3에서 숫자 또는 텍스트 추출"""
            for label in labels:
                for i, text in enumerate(h3_texts):
                    if label in text and i + 1 < len(h3_texts):
                        val = h3_texts[i + 1].strip()
                        # 숫자만 필요한 경우 숫자 추출, 아니면 그대로 반환
                        return val
            return None

        def get_number_after(labels: list) -> Optional[str]:
            val = get_value_after(labels)
            if val:
                num = re.sub(r'\D', '', val)
                return num if num else None
            return None

        # 추첨일
        draw_date = parse_draw_date(h3_texts)
        if not draw_date:
            log.error('추첨일 파싱 실패')
            return None

        # 번호 파싱 - mthai h3 구조 기준 (확인된 순서)
        # [02]เลข 3 ตัวบน → [03]478
        # [04]เลข 2 ตัวล่าง → [05]14
        # [06]เลข 2 ตัวบน → [07]78
        # [08]หวยลาวเลข 6 ตัว → [09]081478
        # [12]หวยลาวเลข 5 ตัว → [13]81478
        # [14]หวยลาวเลข 4 ตัว → [15]1478
        # [16]หวยลาวเลข 3 ตัว → [17]478
        # [18]หวยลาวเลข 2 ตัว → [19]78
        # [20]นามสัตว์หวยลาว → [21]เม่น

        num6        = get_number_after(['หวยลาวเลข 6 ตัว'])
        num5        = get_number_after(['หวยลาวเลข 5 ตัว'])
        num4        = get_number_after(['หวยลาวเลข 4 ตัว'])
        num3_top    = get_number_after(['หวยลาวเลข 3 ตัว'])
        num2_top    = get_number_after(['หวยลาวเลข 2 ตัว'])
        num2_bottom = get_number_after(['เลข 2 ตัวล่าง'])
        animal_th   = get_value_after(['นามสัตว์หวยลาว', 'นามสัตว์'])
        youtube     = extract_youtube(soup)

        result = {
            'draw_date':        draw_date,
            'num6':             num6,
            'num5':             num5,
            'num4':             num4,
            'num3_top':         num3_top,
            'num2_top':         num2_top,
            'num2_bottom':      num2_bottom,
            'animal_name_th':   animal_th,
            'animal_name_lo':   None,
            'youtube_embed_url': youtube,
        }

        log.info(f'파싱 결과: {result}')
        return result

    except Exception as e:
        log.error(f'파싱 중 예외 발생: {e}', exc_info=True)
        return None


def parse_draw_date(h3_texts: list) -> Optional[str]:
    """태국 불력(BE) → 서력(CE) ISO 날짜 변환"""
    TH_MONTHS = {
        'มกราคม': 1, 'กุมภาพันธ์': 2, 'มีนาคม': 3,
        'เมษายน': 4, 'พฤษภาคม': 5, 'มิถุนายน': 6,
        'กรกฎาคม': 7, 'สิงหาคม': 8, 'กันยายน': 9,
        'ตุลาคม': 10, 'พฤศจิกายน': 11, 'ธันวาคม': 12,
    }
    for text in h3_texts:
        for month_th, month_num in TH_MONTHS.items():
            pattern = rf'ที่\s*(\d{{1,2}})\s*{month_th}\s*(\d{{4}})'
            m = re.search(pattern, text)
            if m:
                day  = int(m.group(1))
                year = int(m.group(2)) - 543
                return f'{year:04d}-{month_num:02d}-{day:02d}'
    return None


def extract_youtube(soup: BeautifulSoup) -> Optional[str]:
    """iframe src에서 YouTube embed URL 추출"""
    iframe = soup.find('iframe', src=re.compile(r'youtube\.com/embed'))
    if iframe:
        return iframe.get('src', '').split('?')[0]
    return None


# ── 데이터 검증 ───────────────────────────────────────────
def validate(data: dict) -> bool:
    num6  = data.get('num6') or ''
    num5  = data.get('num5') or ''
    num4  = data.get('num4') or ''
    num3  = data.get('num3_top') or ''
    num2t = data.get('num2_top') or ''

    errors = []

    if len(num6) == 6 and len(num5) == 5:
        if num6[-5:] != num5:
            errors.append(f'num6[-5:]={num6[-5:]} != num5={num5}')

    if len(num5) == 5 and len(num4) == 4:
        if num5[-4:] != num4:
            errors.append(f'num5[-4:]={num5[-4:]} != num4={num4}')

    if len(num4) == 4 and len(num3) == 3:
        if num4[-3:] != num3:
            errors.append(f'num4[-3:]={num4[-3:]} != num3_top={num3}')

    if len(num3) == 3 and len(num2t) == 2:
        if num3[-2:] != num2t:
            errors.append(f'num3[-2:]={num3[-2:]} != num2_top={num2t}')

    if errors:
        log.error(f'데이터 검증 실패: {errors}')
        return False

    if not data.get('draw_date'):
        log.error('draw_date 없음')
        return False

    log.info('데이터 검증 통과')
    return True


# ── D1 저장 ───────────────────────────────────────────────
def save_to_d1(data: dict) -> bool:
    sql = """
    INSERT OR IGNORE INTO lottery_results
      (draw_date, num6, num5, num4, num3_top, num2_top, num2_bottom,
       animal_name_th, animal_name_lo, youtube_embed_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = [
        data.get('draw_date'),
        data.get('num6'),
        data.get('num5'),
        data.get('num4'),
        data.get('num3_top'),
        data.get('num2_top'),
        data.get('num2_bottom'),
        data.get('animal_name_th'),
        data.get('animal_name_lo'),
        data.get('youtube_embed_url'),
    ]

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json',
    }
    payload = {'sql': sql, 'params': params}

    try:
        resp = requests.post(D1_API_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()

        if not result.get('success'):
            log.error(f'D1 저장 실패: {result}')
            return False

        rows_written = result.get('result', [{}])[0].get('meta', {}).get('rows_written', 0)
        if rows_written == 0:
            log.info(f'이미 존재하는 데이터 (draw_date={data["draw_date"]}), 건너뜀')
        else:
            log.info(f'D1 저장 성공 (draw_date={data["draw_date"]}, rows_written={rows_written})')
        return True

    except requests.RequestException as e:
        log.error(f'D1 API 요청 실패: {e}')
        return False


# ── 메인 실행 (재시도 포함) ────────────────────────────────
def run(max_retries: int = 6, retry_interval: int = 300):
    log.info('=' * 50)
    log.info('Lao Lottery Crawler 시작')
    log.info('=' * 50)

    if not all([ACCOUNT_ID, DATABASE_ID, API_TOKEN]):
        log.error('환경변수 누락: CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_D1_DATABASE_ID / CLOUDFLARE_API_TOKEN')
        return

    for attempt in range(1, max_retries + 1):
        log.info(f'시도 {attempt}/{max_retries}')

        html = fetch_html(TARGET_URL)
        if not html:
            log.warning(f'HTML fetch 실패, {retry_interval}초 후 재시도')
            time.sleep(retry_interval)
            continue

        data = parse_lottery(html)
        if not data:
            log.warning(f'파싱 실패, {retry_interval}초 후 재시도')
            time.sleep(retry_interval)
            continue

        if not validate(data):
            log.warning(f'검증 실패, {retry_interval}초 후 재시도')
            time.sleep(retry_interval)
            continue

        success = save_to_d1(data)
        if success:
            log.info('크롤러 완료')
            return

        log.warning(f'D1 저장 실패, {retry_interval}초 후 재시도')
        time.sleep(retry_interval)

    log.error(f'최대 재시도 횟수({max_retries}) 초과. 크롤러 종료')


if __name__ == '__main__':
    run()
