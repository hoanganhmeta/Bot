const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ========== CẤU HÌNH ==========
const BOT_TOKEN = '8457659379:AAHP3K3owb_yl6hQTk7y9cQBJgH2gv9u_U8';
// Token sẽ được đọc từ file token.txt (giống file tokenEAAD6V7.txt trong code gốc)
// =============================

const bot = new Telegraf(BOT_TOKEN);

// Đường dẫn file lưu token (mô phỏng tokenEAAD6V7.txt)
// Trong Netlify Functions, chúng ta lưu trong /tmp vì đây là thư mục có quyền ghi
const TOKEN_FILE = '/tmp/tokenEAAD6V7.txt';

// Hàm đọc token từ file
function getTokenFromFile() {
    try {
        if (fs.existsSync(TOKEN_FILE)) {
            return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
        }
    } catch (e) {
        console.error('Lỗi đọc file token:', e);
    }
    return null;
}

// Hàm lưu token vào file
function saveTokenToFile(token) {
    try {
        fs.writeFileSync(TOKEN_FILE, token, 'utf8');
        return true;
    } catch (e) {
        console.error('Lỗi ghi file token:', e);
        return false;
    }
}

// Hàm gọi API Facebook - mô phỏng cách dùng file_get_contents trong PHP
async function callFacebookAPI(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: { message: 'Không thể kết nối đến máy chủ Facebook' } };
    }
}

// Hàm check info - chuyển từ apiCheck.php
async function checkFacebookInfo(uid, token) {
    if (!uid || !token) {
        return { error: 'Thiếu UID hoặc Token' };
    }
    
    // Code gốc dùng các trường này
    const fields = 'id,name,first_name,last_name,gender,locale,link,updated_time,verified,about,birthday,email,education,favorite_athletes,favorite_teams,hometown,inspirational_people,install_type,interested_in,is_guest_user,languages,location,meeting_for,political,quotes,relationship_status,religion,significant_other,sports,website,work';
    
    const url = `https://graph.facebook.com/v13.0/${uid}?fields=${fields}&access_token=${token}`;
    
    const data = await callFacebookAPI(url);
    
    if (data.error) {
        // Thông báo lỗi giống code gốc
        if (data.error.message.includes('token')) {
            return { error: 'Token Facebook không hợp lệ hoặc đã hết hạn' };
        }
        if (data.error.message.includes('Unsupported get request')) {
            return { error: 'UID không tồn tại hoặc không thể truy cập' };
        }
        return { error: data.error.message };
    }
    
    return data;
}

// Hàm convert ID - chuyển từ convertID.php
async function convertToUid(input, token) {
    let cleanInput = input.trim();
    
    // Nếu là UID số
    if (/^\d+$/.test(cleanInput)) {
        return { uid: cleanInput };
    }
    
    // Trích xuất username từ link (giống code gốc)
    let username = cleanInput;
    
    // Xóa http:// hoặc https://
    username = username.replace(/^https?:\/\//, '');
    // Xóa www.
    username = username.replace(/^www\./, '');
    // Lấy phần sau facebook.com/ hoặc fb.com/
    const patterns = [
        /facebook\.com\/(?:profile\.php\?id=)?([^/?&\s]+)/i,
        /fb\.com\/([^/?&\s]+)/i,
        /fb\.me\/([^/?&\s]+)/i
    ];
    
    for (const pattern of patterns) {
        const match = cleanInput.match(pattern);
        if (match) {
            username = match[1];
            break;
        }
    }
    
    // Nếu không phải số, gọi API để lấy ID
    if (!/^\d+$/.test(username)) {
        const url = `https://graph.facebook.com/v13.0/${username}?access_token=${token}`;
        const data = await callFacebookAPI(url);
        
        if (data.error) {
            return { error: 'Không thể lấy UID. Vui lòng kiểm tra lại link hoặc token' };
        }
        
        return { uid: data.id };
    }
    
    return { uid: username };
}

// Hàm lấy avatar
async function getFacebookAvatar(uid, token) {
    const url = `https://graph.facebook.com/v13.0/${uid}/picture?type=large&redirect=false&access_token=${token}`;
    const data = await callFacebookAPI(url);
    
    if (data.error) {
        return { error: data.error.message };
    }
    
    return { url: data.data.url };
}

// Hàm format thông tin - giống cách hiển thị trong code gốc
function formatUserInfo(data) {
    let result = `📋 THÔNG TIN FACEBOOK\n`;
    result += `──────────────────\n`;
    result += `🆔 ID: ${data.id || 'Không có'}\n`;
    result += `👤 Tên: ${data.name || 'Không có'}\n`;
    
    if (data.first_name) result += `📛 Tên: ${data.first_name}\n`;
    if (data.last_name) result += `📛 Họ: ${data.last_name}\n`;
    if (data.gender) {
        let gender = data.gender === 'male' ? 'Nam' : (data.gender === 'female' ? 'Nữ' : data.gender);
        result += `⚥ Giới tính: ${gender}\n`;
    }
    if (data.locale) result += `🌐 Ngôn ngữ: ${data.locale}\n`;
    if (data.birthday) result += `🎂 Sinh nhật: ${data.birthday}\n`;
    if (data.relationship_status) result += `💑 Mối quan hệ: ${data.relationship_status}\n`;
    if (data.hometown && data.hometown.name) result += `🏠 Quê quán: ${data.hometown.name}\n`;
    if (data.location && data.location.name) result += `📍 Địa điểm: ${data.location.name}\n`;
    if (data.about) result += `📝 Giới thiệu: ${data.about}\n`;
    if (data.quotes) result += `💬 Châm ngôn: ${data.quotes}\n`;
    if (data.website) result += `🌍 Website: ${data.website}\n`;
    if (data.link) result += `🔗 Link: ${data.link}\n`;
    if (data.verified) result += `✅ Tài khoản xác minh: Có\n`;
    
    if (data.education && data.education.length > 0) {
        result += `\n🎓 HỌC VẤN:\n`;
        data.education.slice(0, 5).forEach(edu => {
            if (edu.school && edu.school.name) {
                result += `  • ${edu.school.name}\n`;
            }
        });
    }
    
    if (data.work && data.work.length > 0) {
        result += `\n💼 CÔNG VIỆC:\n`;
        data.work.slice(0, 5).forEach(job => {
            if (job.employer && job.employer.name) {
                result += `  • ${job.employer.name}`;
                if (job.position && job.position.name) result += ` - ${job.position.name}`;
                result += `\n`;
            }
        });
    }
    
    result += `\n──────────────────\n`;
    result += `🤖 Bot by Hoàng Anh`;
    
    return result;
}

// ========== BOT COMMANDS (Giống bot.php) ==========

bot.start((ctx) => {
    ctx.reply(
        `👋 Chào mừng ${ctx.from.first_name}!\n\n` +
        `🔰 BOT CHECK INFO FACEBOOK\n` +
        `──────────────────\n` +
        `📌 Hướng dẫn sử dụng:\n` +
        `• Gửi UID Facebook để check thông tin\n` +
        `• Gửi link Facebook để lấy UID\n\n` +
        `📎 Ví dụ:\n` +
        `• 1000123456789\n` +
        `• facebook.com/username\n\n` +
        `💡 Lệnh hỗ trợ:\n` +
        `/help - Xem hướng dẫn chi tiết\n` +
        `/token [token] - Cập nhật token Facebook\n` +
        `/checktoken - Kiểm tra token hiện tại`
    );
});

bot.help((ctx) => {
    ctx.reply(
        `📚 HƯỚNG DẪN SỬ DỤNG\n` +
        `──────────────────\n` +
        `1️⃣ Gửi UID (dãy số) để kiểm tra thông tin\n` +
        `2️⃣ Gửi link Facebook để lấy UID\n\n` +
        `🛠 Các lệnh:\n` +
        `/start - Khởi động bot\n` +
        `/help - Xem hướng dẫn này\n` +
        `/token [EAAD...] - Cập nhật token Facebook\n` +
        `/checktoken - Kiểm tra token hiện tại\n` +
        `/uid [link] - Lấy UID từ link\n` +
        `/check [UID/link] - Kiểm tra thông tin\n\n` +
        `⚠️ Lưu ý: Token Facebook có thời hạn, cần cập nhật khi hết hạn`
    );
});

// Lệnh cập nhật token - giống chức năng ghi file tokenEAAD6V7.txt
bot.command('token', (ctx) => {
    const newToken = ctx.message.text.replace('/token', '').trim();
    
    if (!newToken) {
        return ctx.reply('❌ Vui lòng nhập token. Ví dụ: /token EAAD6V7...');
    }
    
    if (!newToken.startsWith('EAA')) {
        return ctx.reply('⚠️ Token Facebook thường bắt đầu bằng EAA... Vui lòng kiểm tra lại');
    }
    
    if (saveTokenToFile(newToken)) {
        ctx.reply('✅ Token Facebook đã được cập nhật thành công!');
    } else {
        ctx.reply('❌ Lỗi khi lưu token. Vui lòng thử lại sau.');
    }
});

// Lệnh kiểm tra token
bot.command('checktoken', (ctx) => {
    const token = getTokenFromFile();
    
    if (!token) {
        return ctx.reply('❌ Chưa có token Facebook. Sử dụng lệnh /token [token] để thêm.');
    }
    
    // Hiển thị 10 ký tự đầu của token để bảo mật
    const maskedToken = token.substring(0, 15) + '...' + token.substring(token.length - 5);
    ctx.reply(`📋 Token hiện tại: ${maskedToken}\n\n💡 Dùng /token [token_moi] để cập nhật.`);
});

// Lệnh lấy UID từ link
bot.command('uid', async (ctx) => {
    const input = ctx.message.text.replace('/uid', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Vui lòng nhập link Facebook. Ví dụ: /uid facebook.com/zuck');
    }
    
    const token = getTokenFromFile();
    if (!token) {
        return ctx.reply('❌ Chưa có token Facebook. Dùng lệnh /token [token] để thêm.');
    }
    
    ctx.reply('⏳ Đang xử lý...');
    
    const result = await convertToUid(input, token);
    
    if (result.error) {
        return ctx.reply(`❌ ${result.error}`);
    }
    
    ctx.reply(`✅ UID: ${result.uid}`);
});

// Lệnh check info
bot.command('check', async (ctx) => {
    const input = ctx.message.text.replace('/check', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Vui lòng nhập UID hoặc link. Ví dụ: /check 4');
    }
    
    const token = getTokenFromFile();
    if (!token) {
        return ctx.reply('❌ Chưa có token Facebook. Dùng lệnh /token [token] để thêm.');
    }
    
    ctx.reply('⏳ Đang kiểm tra thông tin...');
    
    const convertResult = await convertToUid(input, token);
    
    if (convertResult.error) {
        return ctx.reply(`❌ ${convertResult.error}`);
    }
    
    const uid = convertResult.uid;
    const info = await checkFacebookInfo(uid, token);
    
    if (info.error) {
        return ctx.reply(`❌ ${info.error}`);
    }
    
    const formattedInfo = formatUserInfo(info);
    ctx.reply(formattedInfo);
});

// Xử lý tin nhắn thường - tự động nhận diện UID/link
bot.on('text', async (ctx) => {
    const message = ctx.message.text.trim();
    
    // Bỏ qua nếu là lệnh
    if (message.startsWith('/')) return;
    
    // Kiểm tra xem có phải UID hoặc link Facebook không
    const isUID = /^\d+$/.test(message);
    const isFBLink = /(?:facebook|fb)\.(?:com|me)\//i.test(message);
    
    if (isUID || isFBLink) {
        const token = getTokenFromFile();
        
        if (!token) {
            return ctx.reply('❌ Chưa có token Facebook. Dùng lệnh /token [token] để thêm.');
        }
        
        ctx.reply('⏳ Đang kiểm tra thông tin...');
        
        const convertResult = await convertToUid(message, token);
        
        if (convertResult.error) {
            return ctx.reply(`❌ ${convertResult.error}`);
        }
        
        const uid = convertResult.uid;
        const info = await checkFacebookInfo(uid, token);
        
        if (info.error) {
            return ctx.reply(`❌ ${info.error}`);
        }
        
        const formattedInfo = formatUserInfo(info);
        ctx.reply(formattedInfo);
    }
});

// ========== EXPORT CHO NETLIFY ==========
exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            await bot.handleUpdate(body);
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'ok' })
            };
        } catch (error) {
            console.error('Bot error:', error);
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'error' })
            };
        }
    }
    
    return {
        statusCode: 200,
        body: 'Bot Telegram Facebook Info -  '
    };
};
