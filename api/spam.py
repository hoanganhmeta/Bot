from http.server import BaseHTTPRequestHandler
import json
import datetime
import re
import requests
import os

BOT_TOKEN = '6393252222:AAEWYuwEUdVj7jN0AnhUzO5TPm9E0cOQPjo'
ADMIN_ID = '6452283369'

def TimeStamp():
    return str(datetime.date.today())

def send_telegram(chat_id, text):
    """Gửi tin nhắn về Telegram"""
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    try:
        requests.post(url, json={
            'chat_id': chat_id,
            'text': text
        }, timeout=5)
    except Exception as e:
        print(f"Lỗi gửi tin nhắn: {e}")

def call_spam_api(phone, amount):
    """Gọi API spam từ chính Vercel"""
    try:
        url = f'https://bot-6tdh.vercel.app/api/spam?phone={phone}&amount={amount}'
        requests.get(url, timeout=5)
        return True
    except:
        return False

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Trả về trạng thái bot"""
        self.send_response(200)
        self.send_header('Content-type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b"Bot Telegram hoat dong!")

    def do_POST(self):
        """Nhận và xử lý tin nhắn từ Telegram"""
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
            user_id = message['from']['id']
            first_name = message['from'].get('first_name', 'Ban')

            response_text = ""

            if text == '/start':
                response_text = f'''👋 Chào {first_name}!
🤖 Chào mừng đến với SMS Bot!

📋 Các lệnh:
/spam <SĐT> <LẦN> - Spam SMS
/help - Xem hướng dẫn
/admin - Thông tin Admin

⚠️ Số lần spam tối đa: 10 lần/lượt'''

            elif text == '/help':
                response_text = '''📋 DANH SÁCH LỆNH:
━━━━━━━━━━━━━━━━━
/spam {SĐT} {Số Lần} ✅
/help ✅
/admin ✅
━━━━━━━━━━━━━━━━━
📌 Ví dụ: /spam 0987654321 5'''

            elif text == '/admin':
                response_text = '''👤 THÔNG TIN ADMIN:
━━━━━━━━━━━━━━━━━
📞 Zalo: https://zalo.me/g/bprmyn080
📺 YouTube: https://youtube.com/@HDT-TOOL-VN
🌐 Web: https://linkbio.co/sharetool
━━━━━━━━━━━━━━━━━'''

            elif text.startswith('/spam'):
                parts = text.split()
                
                if len(parts) < 3:
                    response_text = '❌ Vui lòng nhập: /spam <SĐT> <SỐ_LẦN>\nVí dụ: /spam 0987654321 5'
                else:
                    phone = parts[1]
                    lap = parts[2]

                    if not lap.isnumeric():
                        response_text = '❌ Số lần spam phải là số!'
                    elif int(lap) > 10:
                        response_text = '❌ Tối đa 10 lần/lượt!'
                    elif int(lap) < 1:
                        response_text = '❌ Số lần spam phải lớn hơn 0!'
                    elif not re.search(r"^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$", phone):
                        response_text = '❌ Số điện thoại không hợp lệ!'
                    else:
                        success = call_spam_api(phone, lap)
                        if success:
                            response_text = f'''✅ SPAM THÀNH CÔNG!
━━━━━━━━━━━━━━━━━
📱 SĐT: {phone}
🔄 Số lần: {lap}
👤 Người dùng: {first_name}
📅 Ngày: {TimeStamp()}
━━━━━━━━━━━━━━━━━'''
                        else:
                            response_text = f'''⚠️ Đã gửi yêu cầu spam:
📱 SĐT: {phone}
🔄 Số lần: {lap}
(Vui lòng đợi vài giây...)'''

            else:
                response_text = '🤖 Gõ /help để xem danh sách lệnh!'

            if response_text:
                send_telegram(chat_id, response_text)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode())
