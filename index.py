import json
import requests
import re
import os
from telegram import Bot, Update
from telegram.ext import Dispatcher, CommandHandler, MessageHandler, Filters

TOKEN = os.environ.get("TELEGRAM_TOKEN", "7884631997:AAH02f-Zrp4IRCdFd04huvKhcKC83Igd93Y")
FB_TOKEN = os.environ.get("FB_TOKEN", "EAAGNO4a7r2wBRh9G0ZBCg4mOppOUVSs24ExgnhbVsWVaN5lfcqgn3LPGZBGdQof5plhXiH7pIMYd0MsRGhLbSPPECT1sokvS1cNAX5e2dmKRrrU3WDDSXSiwfg9AqwkVOd6lal8DzLIPVuuOqFNp28Tn7xOQlGiOdYqEiZAoYCrhqAChnlVZBtV64ShZAHQZDZD")
bot = Bot(token=TOKEN)

# Lưu ý: chat_id được lấy từ update.message.chat_id hoặc update.effective_chat.id
# Dùng để gửi tin nhắn trả lời đúng người dùng

def extract_identifier(text):
    text = text.strip()
    url_match = re.search(r'facebook\.com/([A-Za-z0-9.]+)', text)
    if url_match:
        return url_match.group(1), 'username'
    user_match = re.search(r'^[A-Za-z][A-Za-z0-9.]{4,50}$', text)
    if user_match:
        return user_match.group(0), 'username'
    uid_match = re.search(r'\b\d{10,20}\b', text)
    if uid_match:
        return uid_match.group(0), 'uid'
    return None, None

def get_public_info(identifier, id_type):
    if id_type == 'uid':
        fb_id = identifier
    else:
        url = f"https://graph.facebook.com/{identifier}?access_token={FB_TOKEN}&fields=id"
        resp = requests.get(url, timeout=8)
        if resp.status_code != 200:
            return None, f"Không tìm thấy username: {identifier}"
        fb_id = resp.json().get('id')
    fields = "id,name,username,first_name,last_name,about,birthday,gender,location,hometown,email,website,relationship_status,political,religion,link,verified,created_time,followers_count"
    url = f"https://graph.facebook.com/{fb_id}?access_token={FB_TOKEN}&fields={fields}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            return None, f"Lỗi API: {resp.status_code}"
        return resp.json(), None
    except Exception as e:
        return None, f"Lỗi: {str(e)[:50]}"

def get_recent_posts(fb_id, limit=3):
    url = f"https://graph.facebook.com/{fb_id}/posts?access_token={FB_TOKEN}&fields=id,message,created_time,likes.summary(true),comments.summary(true)&limit={limit}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            return resp.json().get('data', [])
    except:
        pass
    return []

def format_public_info(data, posts):
    lines = []
    lines.append(f"📌 THÔNG TIN CÔNG KHAI")
    lines.append(f"ID: {data.get('id', 'N/A')}")
    lines.append(f"Tên: {data.get('name', 'N/A')}")
    lines.append(f"Username: {data.get('username', 'N/A')}")
    lines.append(f"Tên đầu: {data.get('first_name', 'N/A')}")
    lines.append(f"Tên cuối: {data.get('last_name', 'N/A')}")
    lines.append(f"Giới tính: {data.get('gender', 'N/A')}")
    lines.append(f"Ngày sinh: {data.get('birthday', 'N/A')}")
    loc = data.get('location', {})
    lines.append(f"Nơi sống: {loc.get('name', 'N/A') if isinstance(loc, dict) else loc}")
    home = data.get('hometown', {})
    lines.append(f"Quê quán: {home.get('name', 'N/A') if isinstance(home, dict) else home}")
    lines.append(f"Email: {data.get('email', 'N/A')}")
    lines.append(f"Website: {data.get('website', 'N/A')}")
    lines.append(f"Tình trạng: {data.get('relationship_status', 'N/A')}")
    lines.append(f"Chính trị: {data.get('political', 'N/A')}")
    lines.append(f"Tôn giáo: {data.get('religion', 'N/A')}")
    lines.append(f"Link: {data.get('link', 'N/A')}")
    lines.append(f"Xác thực: {'✅' if data.get('verified') else '❌'}")
    lines.append(f"Tạo TK: {data.get('created_time', 'N/A')[:10] if data.get('created_time') else 'N/A'}")
    lines.append(f"Theo dõi: {data.get('followers_count', 'N/A')}")
    lines.append("")
    lines.append("📝 BÀI VIẾT GẦN ĐÂY:")
    if posts:
        for i, post in enumerate(posts[:3], 1):
            msg = post.get('message', '[Không có text]')[:100]
            time = post.get('created_time', 'N/A')[:16]
            likes = post.get('likes', {}).get('summary', {}).get('total_count', 0)
            comments = post.get('comments', {}).get('summary', {}).get('total_count', 0)
            lines.append(f"{i}. {time}")
            lines.append(f"   {msg}")
            lines.append(f"   👍 {likes} 💬 {comments}")
    else:
        lines.append("Không có bài viết công khai")
    return "\n".join(lines)

def handle_message(update, context):
    # LẤY ID CHAT TELEGRAM
    chat_id = update.message.chat_id
    user_id = update.message.from_user.id
    username = update.message.from_user.username
    text = update.message.text.strip()
    
    # Ghi log ID chat (tùy chọn, có thể bỏ)
    print(f"Chat ID: {chat_id}, User ID: {user_id}, Username: {username}, Text: {text[:50]}")
    
    identifier, id_type = extract_identifier(text)
    if not identifier:
        context.bot.send_message(
            chat_id=chat_id,
            text="Gửi username Facebook (vd: zuck) hoặc URL (vd: facebook.com/zuck) hoặc UID"
        )
        return
    
    context.bot.send_message(chat_id=chat_id, text="⏳ Đang lấy thông tin...")
    data, error = get_public_info(identifier, id_type)
    if error or not data or 'id' not in data:
        context.bot.send_message(chat_id=chat_id, text=f"❌ {error or 'Không tìm thấy'}")
        return
    
    fb_id = data['id']
    posts = get_recent_posts(fb_id, 3)
    result_text = format_public_info(data, posts)
    if len(result_text) > 4000:
        result_text = result_text[:3950] + "\n\n... (cắt)"
    
    context.bot.send_message(chat_id=chat_id, text=result_text)

def start(update, context):
    chat_id = update.effective_chat.id
    context.bot.send_message(
        chat_id=chat_id,
        text="Gửi username Facebook (vd: zuck) hoặc URL hoặc UID để lấy toàn bộ thông tin công khai.\n\nCần Facebook Access Token."
    )

def handler(request, context):
    if request.method == "POST":
        body = json.loads(request.body)
        update = Update.de_json(body, bot)
        dispatcher = Dispatcher(bot, None, use_context=True)
        dispatcher.add_handler(CommandHandler("start", start))
        dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))
        dispatcher.process_update(update)
        return {"statusCode": 200, "body": json.dumps({"status": "ok"}), "headers": {"Content-Type": "application/json"}}
    return {"statusCode": 405, "body": json.dumps({"error": "Method not allowed"}), "headers": {"Content-Type": "application/json"}}
