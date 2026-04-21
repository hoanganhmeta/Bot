const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// ========== CẤU HÌNH - SỬA 2 DÒNG NÀY ==========
const BOT_TOKEN = '8457659379:AAHP3K3owb_yl6hQTk7y9cQBJgH2gv9u_U8';
const FB_ACCESS_TOKEN = 'EAAGNO4a7r2wBRRpFXyrhjQSUszefCKT1cEICmtGNe3AH9ryzBRKycJOLUQDOHQ0zQdt2uEzlgT0Ye5k4wV4LfEwAkxYh6QyWZCRq64tDTEu1OCOLZAeytxLKafFStmZAVw4edZA1vB9OB1e6SpDTSjkb9AVJWLZBaaM5MejBdSf1VRtAmIyXJHQ8bgqK9zDy8eQZDZD';
// =============================================

const bot = new Telegraf(BOT_TOKEN);

// Hàm gọi API Facebook với cấu hình an toàn hơn
async function callFacebookAPI(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000 // 15 giây timeout
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error.message);
        return { error: { message: 'Không thể kết nối đến Facebook. Vui lòng thử lại sau.' } };
    }
}

// Hàm kiểm tra thông tin Facebook
async function checkFacebookInfo(uid) {
    // Phiên bản API cũ hơn để tăng khả năng tương thích
    const fields = 'id,name,first_name,last_name,gender,locale,link,verified,birthday,relationship_status,hometown,location,work,education,about,bio,quotes,website';
    
    const url = `https://graph.facebook.com/v13.0/${uid}?fields=${fields}&access_token=${FB_ACCESS_TOKEN}`;
    
    const data = await callFacebookAPI(url);
    
    if (data.error) {
        return { error: data.error.message };
    }
    
    return data;
}

// Hàm lấy ảnh đại diện
async function getFacebookAvatar(uid) {
    const url = `https://graph.facebook.com/v13.0/${uid}/picture?type=large&redirect=false&access_token=${FB_ACCESS_TOKEN}`;
    
    const data = await callFacebookAPI(url);
    
    if (data.error) {
        return { error: data.error.message };
    }
    
    return { url: data.data.url };
}

// Hàm chuyển đổi link sang UID
async function convertToUid(input) {
    let cleanInput = input.trim();
    
    // Nếu là UID số
    if (/^\d+$/.test(cleanInput)) {
        return { uid: cleanInput };
    }
    
    // Trích xuất username từ link
    let username = cleanInput;
    const patterns = [
        /facebook\.com\/(?:profile\.php\?id=)?(\d+)/i,
        /facebook\.com\/([^/?&\s]+)/i,
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
        const url = `https://graph.facebook.com/v13.0/${username}?access_token=${FB_ACCESS_TOKEN}`;
        const data = await callFacebookAPI(url);
        
        if (data.error) {
            return { error: data.error.message };
        }
        
        return { uid: data.id };
    }
    
    return { uid: username };
}

// Hàm format thông tin
function formatUserInfo(data) {
    let result = `📋 **THÔNG TIN FACEBOOK**\n\n`;
    
    result += `🆔 **ID:** \`${data.id || 'Không có'}\`\n`;
    result += `👤 **Tên:** ${data.name || 'Không có'}\n`;
    result += `📛 **Họ:** ${data.last_name || 'Không có'}\n`;
    result += `📛 **Tên:** ${data.first_name || 'Không có'}\n`;
    
    if (data.verified) {
        result += `✅ **Tick xanh:** Có\n`;
    }
    
    if (data.gender) {
        let gender = data.gender;
        if (gender === 'male') gender = 'Nam';
        else if (gender === 'female') gender = 'Nữ';
        result += `⚥ **Giới tính:** ${gender}\n`;
    }
    
    if (data.locale) result += `🌐 **Ngôn ngữ:** ${data.locale}\n`;
    if (data.birthday) result += `🎂 **Sinh nhật:** ${data.birthday}\n`;
    
    if (data.relationship_status) {
        const statusMap = {
            'Single': 'Độc thân',
            'In a relationship': 'Đang hẹn hò',
            'Engaged': 'Đã đính hôn',
            'Married': 'Đã kết hôn',
            'It\'s complicated': 'Phức tạp'
        };
        result += `💑 **Mối quan hệ:** ${statusMap[data.relationship_status] || data.relationship_status}\n`;
    }
    
    if (data.hometown) result += `🏠 **Quê quán:** ${data.hometown.name || 'Không có'}\n`;
    if (data.location) result += `📍 **Địa điểm:** ${data.location.name || 'Không có'}\n`;
    if (data.about) result += `📝 **Giới thiệu:** ${data.about}\n`;
    if (data.bio) result += `📄 **Tiểu sử:** ${data.bio}\n`;
    if (data.quotes) result += `💬 **Châm ngôn:** ${data.quotes}\n`;
    if (data.website) result += `🌍 **Website:** ${data.website}\n`;
    
    if (data.work && data.work.length > 0) {
        result += `\n💼 **CÔNG VIỆC:**\n`;
        data.work.slice(0, 3).forEach(job => {
            if (job.employer) {
                result += `  • ${job.employer.name || ''}`;
                if (job.position) result += ` - ${job.position.name || ''}`;
                result += `\n`;
            }
        });
    }
    
    if (data.education && data.education.length > 0) {
        result += `\n🎓 **HỌC VẤN:**\n`;
        data.education.slice(0, 3).forEach(edu => {
            if (edu.school) {
                result += `  • ${edu.school.name || ''}`;
                result += `\n`;
            }
        });
    }
    
    if (data.link) result += `\n🔗 **Link:** ${data.link}\n`;
    
    return result;
}

// ========== BOT COMMANDS ==========

bot.start((ctx) => {
    ctx.replyWithMarkdown(
        `👋 *Xin chào ${ctx.from.first_name}!*\n\n` +
        `🤖 *Bot Kiểm Tra Thông Tin Facebook*\n\n` +
        `📌 *Cách dùng:*\n` +
        `• Gửi *UID* hoặc *link Facebook*\n` +
        `• Bot sẽ trả về ảnh đại diện + thông tin công khai\n\n` +
        `📎 *Ví dụ:*\n` +
        `• 1000123456789\n` +
        `• facebook.com/username\n\n` +
        `⚡ *Lệnh:*\n` +
        `/help - Xem hướng dẫn\n` +
        `/check [UID/link] - Kiểm tra nhanh\n` +
        `/avatar [UID/link] - Lấy ảnh HD\n` +
        `/uid [link] - Lấy UID từ link`
    );
});

bot.help((ctx) => {
    ctx.replyWithMarkdown(
        `🆘 *HƯỚNG DẪN*\n\n` +
        `*Gửi trực tiếp:* UID hoặc link Facebook\n` +
        `*Lệnh:* \n` +
        `/check [UID/link] - Kiểm tra đầy đủ\n` +
        `/avatar [UID/link] - Lấy ảnh đại diện HD\n` +
        `/uid [link] - Chuyển link sang UID`
    );
});

bot.command('check', async (ctx) => {
    const input = ctx.message.text.replace('/check', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Vui lòng nhập UID hoặc link.\nVí dụ: /check 4');
    }
    
    ctx.reply('⏳ Đang kiểm tra...');
    
    const convertResult = await convertToUid(input);
    
    if (convertResult.error) {
        return ctx.reply(`❌ Lỗi chuyển đổi: ${convertResult.error}`);
    }
    
    const uid = convertResult.uid;
    const info = await checkFacebookInfo(uid);
    
    if (info.error) {
        return ctx.reply(`❌ Lỗi Facebook: ${info.error}`);
    }
    
    const avatar = await getFacebookAvatar(uid);
    
    if (avatar.url) {
        try {
            await ctx.replyWithPhoto(avatar.url, {
                caption: `🖼️ Ảnh đại diện của ${info.name || uid}`
            });
        } catch (e) {
            // Bỏ qua lỗi ảnh
        }
    }
    
    const formattedInfo = formatUserInfo(info);
    ctx.replyWithMarkdown(formattedInfo, { disable_web_page_preview: true });
});

bot.command('avatar', async (ctx) => {
    const input = ctx.message.text.replace('/avatar', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Vui lòng nhập UID hoặc link.\nVí dụ: /avatar 4');
    }
    
    ctx.reply('⏳ Đang lấy ảnh...');
    
    const convertResult = await convertToUid(input);
    
    if (convertResult.error) {
        return ctx.reply(`❌ Lỗi: ${convertResult.error}`);
    }
    
    const uid = convertResult.uid;
    const avatar = await getFacebookAvatar(uid);
    
    if (avatar.error) {
        return ctx.reply(`❌ Lỗi: ${avatar.error}`);
    }
    
    if (avatar.url) {
        await ctx.replyWithPhoto(avatar.url, {
            caption: `✅ Ảnh đại diện HD của UID: ${uid}`
        });
    } else {
        ctx.reply('❌ Không tìm thấy ảnh.');
    }
});

bot.command('uid', async (ctx) => {
    const input = ctx.message.text.replace('/uid', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Vui lòng nhập link Facebook.\nVí dụ: /uid facebook.com/zuck');
    }
    
    ctx.reply('⏳ Đang chuyển đổi...');
    
    const convertResult = await convertToUid(input);
    
    if (convertResult.error) {
        return ctx.reply(`❌ Lỗi: ${convertResult.error}`);
    }
    
    ctx.replyWithMarkdown(
        `✅ *Chuyển đổi thành công*\n\n` +
        `🔗 Link: ${input}\n` +
        `🆔 UID: \`${convertResult.uid}\``
    );
});

bot.on('text', async (ctx) => {
    const message = ctx.message.text.trim();
    
    if (message.startsWith('/')) return;
    
    const fbPattern = /(?:facebook|fb)\.(?:com|me)\/|^\d+$/i;
    
    if (fbPattern.test(message)) {
        ctx.reply('⏳ Đang xử lý...');
        
        const convertResult = await convertToUid(message);
        
        if (convertResult.error) {
            return ctx.reply(`❌ Lỗi: ${convertResult.error}`);
        }
        
        const uid = convertResult.uid;
        const info = await checkFacebookInfo(uid);
        
        if (info.error) {
            return ctx.reply(`❌ Lỗi: ${info.error}`);
        }
        
        const avatar = await getFacebookAvatar(uid);
        
        if (avatar.url) {
            try {
                await ctx.replyWithPhoto(avatar.url, {
                    caption: `🖼️ Ảnh đại diện của ${info.name || uid}`
                });
            } catch (e) {}
        }
        
        const formattedInfo = formatUserInfo(info);
        await ctx.replyWithMarkdown(formattedInfo, { disable_web_page_preview: true });
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
        body: 'Bot Telegram Facebook Info đang hoạt động!'
    };
};
