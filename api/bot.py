from http.server import BaseHTTPRequestHandler
import json
import os
import subprocess
import datetime
import re

# Token bot Telegram
BOT_TOKEN = '8624782345:AAHjhUAwov-IDPsIXkiX2V10U8GcFqE0C-E'
ADMIN_ID = '7211752234'

def TimeStamp():
    return str(datetime.date.today())

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        update = json.loads(post_data)
        
        # Xử lý tin nhắn từ Telegram
        if 'message' in update:
            message = update['message']
            chat_id = message['chat']['id']
            text = message.get('text', '')
            user_id = message['from']['id']
            
            response_text = ""
            
            # Lệnh /spam - KHÔNG CẦN KEY
            if text.startswith('/spam'):
                parts = text.split()
                if len(parts) < 3:
                    response_text = 'Vui lòng nhập: /spam <SĐT> <SỐ_LẦN>'
                else:
                    phone = parts[1]
                    lap = parts[2]
                    
                    if not lap.isnumeric() or not (1 <= int(lap) <= 100):
                        response_text = 'Số lần spam phải từ 1-100!'
                    elif not re.search(r"^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$", phone):
                        response_text = 'SĐT KHÔNG HỢP LỆ!'
                    else:
                        # Gọi API spam (tự gọi chính mình hoặc file spam)
                        response_text = f'✅ Đang spam SĐT: {phone} - {lap} lần'
            
            # Lệnh /help
            elif text == '/help':
                response_text = '''
📋 Danh sách lệnh:
/spam {SĐT} {Số Lần} - Spam SMS
/help - Xem hướng dẫn
/admin - Thông tin Admin
'''
            
            # Lệnh /admin
            elif text == '/admin':
                response_text = '👤 Admin: h.anh\n📞 Zalo: https://zalo.me/g/h.anh'
            
            else:
                response_text = 'Dùng /help để xem lệnh!'
            
            # Gửi tin nhắn qua Telegram API
            if response_text:
                import requests
                requests.post(
                    f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                    json={
                        'chat_id': chat_id,
                        'text': response_text
                    }
                )
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode())
