from http.server import BaseHTTPRequestHandler
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        results = []
        
        # Test từng API
        apis = [
            ("Popeyes", lambda: requests.post('https://api.popeyes.vn/api/v1/register',
                headers={'content-type':'application/json'},
                data='{"phone":"0987654321","firstName":"Test","lastName":"Test","email":"test@gmail.com","password":"123456"}', timeout=5)),
            ("FPTShop", lambda: requests.post('https://fptshop.com.vn/api-data/loyalty/Home/Verification',
                headers={"Content-Type":"application/x-www-form-urlencoded"},
                data={"phone":"0987654321"}, timeout=5)),
            ("Viettel", lambda: requests.post('https://vietteltelecom.vn/api/get-otp-login',
                headers={'Content-Type':'application/json','X-CSRF-TOKEN':'dS0MwhelCkb96HCH9kVlEd3CxX8yyiQim71Acpr6'},
                json={'phone':'0987654321','type':''}, timeout=5)),
        ]
        
        for name, func in apis:
            try:
                func()
                results.append(f"{name}: OK")
            except Exception as e:
                results.append(f"{name}: LỖI - {str(e)[:50]}")
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write("<br>".join(results).encode())
