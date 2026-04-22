const { Telegraf } = require('telegraf');
const axios = require('axios');

// ========== TOKEN - SỬA 2 DÒNG NÀY ==========
const BOT_TOKEN = '8457659379:AAHP3K3owb_yl6hQTk7y9cQBJgH2gv9u_U8';
const FB_ACCESS_TOKEN = 'EAAGNO4a7r2wBRbKQCZBxs6JDQANGKxpWBlIP974rCj0x4taIdVTj7IoP2t0xy705d0Kh1cjRIZBlwUOzjHK5lNKY3em4Rmre1iWBUXVn1tHu42q0nd8GAyggqZAjjEijhJj0mAzelRvRiZBVmNj8W7o3UiPg0u1GBKgAyjUY9JfLzEnI9NTbLLQqD0SKCx4JiwZDZD';
// ===========================================

const bot = new Telegraf(BOT_TOKEN);

// Hàm gọi Facebook API
async function callFacebookAPI(uid) {
    const fields = 'id,name,first_name,last_name,gender,locale,link,verified,birthday,relationship_status,hometown,location,about,bio,quotes,website';
    
    const url = `https://graph.facebook.com/v16.0/${uid}?fields=${fields}&access_token=${FB_ACCESS_TOKEN}`;
    
    try {
        const response = await axios.get(url, { timeout: 15000 });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { error: error.response.data.error.message };
        }
        return { error: 'Không thể kết nối đến Facebook API' };
    }
}

// Hàm chuyển link sang UID
async function getUIDFromLink(link) {
    let username = link.trim();
    
    const patterns = [
        /(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com\/(?:profile\.php\?id=)?([^/?&\s]+)/i,
        /(?:https?:\/\/)?(?:www\.)?fb\.com\/([^/?&\s]+)/i,
        /(?:https?:\/\/)?fb\.me\/([^/?&\s]+)/i
    ];
    
    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) {
            username = match[1];
            break;
        }
    }
    
    if (/^\d+$/.test(username)) {
        return { uid: username };
    }
    
    try {
        const url = `https://graph.facebook.com/v16.0/${username}?access_token=${FB_ACCESS_TOKEN}`;
        const response = await axios.get(url, { timeout: 15000 });
        return { uid: response.data.id };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { error: error.response.data.error.message };
        }
        return { error: 'Không thể chuyển đổi link sang UID' };
    }
}

// Format kết quả
function formatResult(data) {
    let msg = `📋 *THÔNG TIN FACEBOOK*\n\n`;
    msg += `🆔 *ID:* \`${data.id}\`\n`;
    msg += `👤 *Tên:* ${data.name || 'Không có'}\n`;
    if (data.first_name) msg += `📛 *Tên:* ${data.first_name}\n`;
    if (data.last_name) msg += `📛 *Họ:* ${data.last_name}\n`;
    if (data.gender) {
        const gender = data.gender === 'male' ? 'Nam' : (data.gender === 'female' ? 'Nữ' : data.gender);
        msg += `⚥ *Giới tính:* ${gender}\n`;
    }
    if (data.locale) msg += `🌐 *Ngôn ngữ:* ${data.locale}\n`;
    if (data.birthday) msg += `🎂 *Sinh nhật:* ${data.birthday}\n`;
    if (data.relationship_status) msg += `💑 *Mối quan hệ:* ${data.relationship_status}\n`;
    if (data.hometown && data.hometown.name) msg += `🏠 *Quê quán:* ${data.hometown.name}\n`;
    if (data.location && data.location.name) msg += `📍 *Địa điểm:* ${data.location.name}\n`;
    if (data.about) msg += `📝 *Giới thiệu:* ${data.about}\n`;
    if (data.verified) msg += `✅ *Tick xanh:* Có\n`;
    if (data.link) msg += `\n🔗 [Xem profile](${data.link})`;
    
    return msg;
}

// ========== BOT COMMANDS ==========

bot.start(ctx => {
    ctx.replyWithMarkdown(
        `👋 *Chào ${ctx.from.first_name}!*\n\n` +
        `🤖 *BOT CHECK INFO FACEBOOK*\n\n` +
        `📌 *Cách dùng:*\n` +
        `• Gửi UID (dãy số) hoặc link Facebook\n` +
        `• Bot sẽ trả về thông tin công khai\n\n` +
        `📎 *Ví dụ:*\n` +
        `• \`4\`\n` +
        `• \`facebook.com/zuck\`\n\n` +
        `🆘 *Lệnh:* /help`
    );
});

bot.help(ctx => {
    ctx.replyWithMarkdown(
        `📚 *HƯỚNG DẪN*\n\n` +
        `• Gửi UID: \`1000123456789\`\n` +
        `• Gửi link: \`facebook.com/username\`\n\n` +
        `Bot sẽ tự động nhận diện và trả về thông tin.`
    );
});

bot.on('text', async ctx => {
    const msg = ctx.message.text.trim();
    
    if (msg.startsWith('/')) return;
    
    const isUID = /^\d+$/.test(msg);
    const isLink = /facebook\.com|fb\.com|fb\.me/i.test(msg);
    
    if (!isUID && !isLink) return;
    
    ctx.reply('⏳ Đang kiểm tra...');
    
    let uid = msg;
    
    if (isLink) {
        const result = await getUIDFromLink(msg);
        if (result.error) {
            return ctx.reply(`❌ Lỗi: ${result.error}`);
        }
        uid = result.uid;
    }
    
    const data = await callFacebookAPI(uid);
    
    if (data.error) {
        if (data.error.includes('token')) {
            return ctx.reply('❌ Token Facebook không hợp lệ hoặc đã hết hạn.');
        }
        if (data.error.includes('Unsupported get request')) {
            return ctx.reply('❌ UID không tồn tại hoặc không thể truy cập.');
        }
        return ctx.reply(`❌ Lỗi: ${data.error}`);
    }
    
    ctx.replyWithMarkdown(formatResult(data), { disable_web_page_preview: false });
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
        body: 'Bot Telegram Facebook Info - Hoàng Anh'
    };
};
