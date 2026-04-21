const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// ========== CẤU HÌNH - SỬA 2 DÒNG NÀY ==========
const BOT_TOKEN = '8457659379:AAHP3K3owb_yl6hQTk7y9cQBJgH2gv9u_U8';
const FB_ACCESS_TOKEN = 'DÁN_TOKEN_FACEBOOK_EAAD6V7_CỦA_BẠN_VÀO_ĐÂY';
// ==============================================

const bot = new Telegraf(BOT_TOKEN);

// Hàm lấy TẤT CẢ thông tin công khai từ Facebook
async function checkFacebookInfo(uid) {
    try {
        const fields = [
            'id', 'name', 'first_name', 'last_name', 'middle_name',
            'name_format', 'short_name', 'gender', 'locale', 'link',
            'updated_time', 'verified', 'about', 'bio', 'birthday',
            'email', 'education', 'favorite_athletes', 'favorite_teams',
            'hometown', 'inspirational_people', 'install_type', 'interested_in',
            'is_guest_user', 'languages', 'location', 'meeting_for',
            'political', 'quotes', 'relationship_status', 'religion',
            'significant_other', 'sports', 'website', 'work'
        ].join(',');

        const url = `https://graph.facebook.com/v18.0/${uid}?fields=${fields}&access_token=${FB_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return { error: data.error.message };
        }

        return data;
    } catch (error) {
        return { error: error.message };
    }
}

// Hàm lấy ảnh đại diện HD
async function getFacebookAvatar(uid) {
    try {
        const url = `https://graph.facebook.com/v18.0/${uid}/picture?type=large&redirect=false&access_token=${FB_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return { error: data.error.message };
        }

        return { url: data.data.url };
    } catch (error) {
        return { error: error.message };
    }
}

// Hàm format thông tin thành tin nhắn đẹp
function formatUserInfo(data) {
    let result = `📋 **THÔNG TIN FACEBOOK**\n\n`;

    // Thông tin cơ bản
    result += `🆔 **ID:** \`${data.id || 'Không có'}\`\n`;
    result += `👤 **Tên đầy đủ:** ${data.name || 'Không có'}\n`;
    result += `📛 **Họ:** ${data.last_name || 'Không có'}\n`;
    result += `📛 **Tên:** ${data.first_name || 'Không có'}\n`;
    if (data.middle_name) result += `📛 **Tên đệm:** ${data.middle_name}\n`;
    if (data.short_name) result += `🔖 **Tên ngắn:** ${data.short_name}\n`;

    // Trạng thái xác minh (Tick xanh)
    if (data.verified !== undefined) {
        result += `✅ **Tài khoản xác minh:** ${data.verified ? 'Có (Tick xanh)' : 'Không'}\n`;
    }

    // Giới tính
    if (data.gender) {
        let genderText = data.gender;
        if (data.gender === 'male') genderText = 'Nam';
        else if (data.gender === 'female') genderText = 'Nữ';
        result += `⚥ **Giới tính:** ${genderText}\n`;
    }

    // Ngôn ngữ
    if (data.locale) result += `🌐 **Ngôn ngữ:** ${data.locale}\n`;

    // Ngày sinh
    if (data.birthday) result += `🎂 **Sinh nhật:** ${data.birthday}\n`;

    // Mối quan hệ
    if (data.relationship_status) {
        const statusMap = {
            'Single': 'Độc thân',
            'In a relationship': 'Đang hẹn hò',
            'Engaged': 'Đã đính hôn',
            'Married': 'Đã kết hôn',
            'It\'s complicated': 'Phức tạp',
            'In an open relationship': 'Mối quan hệ mở',
            'Widowed': 'Góa phụ',
            'Separated': 'Ly thân',
            'Divorced': 'Đã ly hôn',
            'In a civil union': 'Chung sống dân sự',
            'In a domestic partnership': 'Chung sống không hôn thú'
        };
        const statusText = statusMap[data.relationship_status] || data.relationship_status;
        result += `💑 **Mối quan hệ:** ${statusText}\n`;
    }

    // Người yêu / Vợ chồng
    if (data.significant_other) {
        result += `💕 **Người quan trọng:** ${data.significant_other.name || data.significant_other.id}\n`;
    }

    // Giới thiệu
    if (data.about) result += `📝 **Giới thiệu:** ${data.about}\n`;
    if (data.bio) result += `📄 **Tiểu sử:** ${data.bio}\n`;
    if (data.quotes) result += `💬 **Châm ngôn:** ${data.quotes}\n`;

    // Quê quán & Địa điểm
    if (data.hometown) result += `🏠 **Quê quán:** ${data.hometown.name || 'Không có'}\n`;
    if (data.location) result += `📍 **Địa điểm hiện tại:** ${data.location.name || 'Không có'}\n`;

    // Công việc
    if (data.work && data.work.length > 0) {
        result += `\n💼 **CÔNG VIỆC:**\n`;
        data.work.slice(0, 5).forEach((job, index) => {
            if (job.employer) {
                result += `  ${index + 1}. ${job.employer.name || ''}`;
                if (job.position) result += ` - ${job.position.name || ''}`;
                result += `\n`;
            }
        });
    }

    // Học vấn
    if (data.education && data.education.length > 0) {
        result += `\n🎓 **HỌC VẤN:**\n`;
        data.education.slice(0, 5).forEach((edu, index) => {
            if (edu.school) {
                result += `  ${index + 1}. ${edu.school.name || ''}`;
                if (edu.type) result += ` (${edu.type})`;
                result += `\n`;
            }
        });
    }

    // Sở thích
    if (data.interested_in && data.interested_in.length > 0) {
        const interested = data.interested_in.map(i => i === 'male' ? 'Nam' : 'Nữ').join(', ');
        result += `\n💘 **Quan tâm đến:** ${interested}\n`;
    }

    // Tôn giáo & Chính trị
    if (data.religion) result += `🛐 **Tôn giáo:** ${data.religion}\n`;
    if (data.political) result += `🏛️ **Chính trị:** ${data.political}\n`;

    // Website
    if (data.website) {
        const website = data.website.split('\n')[0];
        result += `🌍 **Website:** ${website}\n`;
    }

    // Link profile
    if (data.link) result += `\n🔗 **Link profile:** ${data.link}\n`;

    // Cập nhật lần cuối
    if (data.updated_time) {
        const date = new Date(data.updated_time);
        result += `\n🕒 **Cập nhật lần cuối:** ${date.toLocaleString('vi-VN')}\n`;
    }

    return result;
}

// Hàm chuyển đổi link/username sang UID
async function convertToUid(input) {
    try {
        let cleanInput = input.trim();

        // Nếu là UID số
        if (/^\d+$/.test(cleanInput)) {
            return { uid: cleanInput };
        }

        // Trích xuất username từ link
        let username = cleanInput;
        
        const patterns = [
            /facebook\.com\/(?:profile\.php\?id=)?(\d+)/i,
            /facebook\.com\/([^\/\?\&\s]+)/i,
            /fb\.com\/([^\/\?\&\s]+)/i,
            /fb\.me\/([^\/\?\&\s]+)/i
        ];

        for (const pattern of patterns) {
            const match = cleanInput.match(pattern);
            if (match) {
                username = match[1];
                break;
            }
        }

        const url = `https://graph.facebook.com/v18.0/${username}?access_token=${FB_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return { error: data.error.message };
        }

        return { uid: data.id };
    } catch (error) {
        return { error: error.message };
    }
}

// ========== BOT COMMANDS ==========

bot.start((ctx) => {
    const welcomeMessage = 
        `👋 *Xin chào ${ctx.from.first_name}!*\n\n` +
        `🤖 *Bot Kiểm Tra Thông Tin Facebook*\n` +
        `📌 *Cách dùng:*\n` +
        `• Gửi *UID* hoặc *link Facebook*\n` +
        `• Bot sẽ trả về ảnh đại diện + toàn bộ thông tin công khai\n\n` +
        `📎 *Ví dụ:*\n` +
        `• 1000123456789\n` +
        `• facebook.com/username\n\n` +
        `⚡ *Lệnh:*\n` +
        `/help - Xem hướng dẫn\n` +
        `/check [UID/link] - Kiểm tra nhanh\n` +
        `/avatar [UID/link] - Chỉ lấy ảnh HD\n` +
        `/uid [link] - Lấy UID từ link`;

    ctx.replyWithMarkdown(welcomeMessage);
});

bot.help((ctx) => {
    const helpMessage = 
        `🆘 *HƯỚNG DẪN*\n\n` +
        `*Gửi trực tiếp:* UID hoặc link Facebook\n` +
        `*Lệnh:* \n` +
        `/check [UID/link] - Kiểm tra đầy đủ\n` +
        `/avatar [UID/link] - Lấy ảnh đại diện HD\n` +
        `/uid [link] - Chuyển link sang UID\n\n` +
        `*Thông tin lấy được:*\n` +
        `• Tên, ID, Giới tính, Sinh nhật\n` +
        `• Mối quan hệ, Quê quán, Địa điểm\n` +
        `• Công việc, Học vấn\n` +
        `• Sở thích, Tôn giáo, Chính trị\n` +
        `• Website, Link profile\n` +
        `• Ảnh đại diện HD`;

    ctx.replyWithMarkdown(helpMessage);
});

bot.command('check', async (ctx) => {
    const input = ctx.message.text.replace('/check', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Nhập UID hoặc link. VD: /check 1000123456789');
    }

    ctx.reply('⏳ Đang kiểm tra...');

    const convertResult = await convertToUid(input);
    
    if (convertResult.error) {
        return ctx.reply(`❌ Lỗi: ${convertResult.error}`);
    }

    const uid = convertResult.uid;
    const info = await checkFacebookInfo(uid);
    
    if (info.error) {
        return ctx.reply(`❌ Lỗi: ${info.error}`);
    }

    const avatar = await getFacebookAvatar(uid);
    const formattedInfo = formatUserInfo(info);
    
    if (avatar.url) {
        try {
            await ctx.replyWithPhoto(avatar.url, {
                caption: `🖼️ Ảnh đại diện của ${info.name || uid}`
            });
        } catch (e) {}
    }
    
    ctx.replyWithMarkdown(formattedInfo, { disable_web_page_preview: true });
});

bot.command('avatar', async (ctx) => {
    const input = ctx.message.text.replace('/avatar', '').trim();
    
    if (!input) {
        return ctx.reply('❌ Nhập UID hoặc link. VD: /avatar 1000123456789');
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
        return ctx.reply('❌ Nhập link Facebook. VD: /uid facebook.com/username');
    }

    ctx.reply('⏳ Đang chuyển đổi...');

    const convertResult = await convertToUid(input);
    
    if (convertResult.error) {
        return ctx.reply(`❌ Lỗi: ${convertResult.error}`);
    }

    ctx.replyWithMarkdown(
        `✅ *Chuyển đổi thành công*\n\n` +
        `🔗 Link: ${input}\n` +
        `🆔 UID: \`${convertResult.uid}\`\n\n` +
        `💡 Dùng /check ${convertResult.uid} để xem thông tin.`
    );
});

// Xử lý tin nhắn thường
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
        const formattedInfo = formatUserInfo(info);
        
        if (avatar.url) {
            try {
                await ctx.replyWithPhoto(avatar.url, {
                    caption: `🖼️ Ảnh đại diện của ${info.name || uid}`
                });
            } catch (e) {}
        }
        
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
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }
    
    return {
        statusCode: 200,
        body: 'Bot Telegram Facebook Info đang hoạt động!'
    };
};
