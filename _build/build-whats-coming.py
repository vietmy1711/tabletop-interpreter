# Writes whats-coming.html from one table per language, so the six sections stay identical in shape and the
# Write to Us links stay correctly encoded. Edit the text here, never the output. Run from the site folder:
#   python3 _build/build-whats-coming.py
import sys, html
from urllib.parse import quote
OUT = sys.argv[1] if len(sys.argv) > 1 else "whats-coming.html"
E = html.escape

L = {}
L["en"] = dict(home="/", support="Support", privacy="Privacy Policy", terms="Terms of Use",
  title="What's Coming",
  lede="One app for the whole trip: before you go, at the counter, and after. Here is what we're building next. Plans change with what you tell us.",
  updated="Updated October 2026",
  stages=[("Being built now", [
      ("Better hearing", "In noisy places, and on one-word replies like “yes” or “OK”, so each reply is understood in the right language."),
      ("Getting ready for a trip", "Say where you're going. Tabletop downloads what it needs, suggests phrases for the trip, and checks everything works offline before you leave."),
      ("Split Earbuds", "Share one pair of earbuds, and each of you hears your own language in one ear.")]),
    ("Coming next", [
      ("Reminders from what you were told", "Follow-ups from a conversation, like a pharmacist's dose or a supplier's delivery date, become reminders, with the numbers checked against what was said."),
      ("Translation for words, labels and things", "Type a word, or point the camera at a label or an object, to see what it's called, how to say it and how it's used. Save it to your words. Pictures are never kept."),
      ("Phrases from your conversations", "The best things the other person said, kept as phrases you can learn."),
      ("Translation with context", "Each line translated with what was said just before it, for fewer wrong words.")]),
    ("Later", [
      ("Typing in a conversation", "For a room too loud to hear you, or when speaking isn't possible. Either person can type, and Tabletop can read it aloud."),
      ("Captions only", "No voice and larger text, for deaf and hard-of-hearing people and for quiet rooms.")])],
  ideas_h="Ideas we're weighing",
  ideas=["Tabletop for Android", "Polite forms of address", "Practising a conversation again", "More languages, such as Cantonese, Malay and Ukrainian", "Conversations with three people"],
  ask_h="Tell us what you'd use",
  ask="Which of these would you use, and what's missing? The email opens with the list, so you can keep the ones you'd use.",
  button="Write to Us",
  inapp="Or in the app: Settings › Help and Support › Suggest a Feature.",
  privacy_line="As today, what you say is heard and translated on your iPhone, and none of it is sent to us.",
  subject="Tabletop: What's Coming", mail_top="Which would you use? Delete the rest.", mail_missing="What's missing:")

L["vi"] = dict(home="/vi/", support="Hỗ trợ", privacy="Chính sách quyền riêng tư", terms="Điều khoản sử dụng",
  title="Những gì sắp tới",
  lede="Một ứng dụng cho cả chuyến đi: trước khi đi, tại quầy và sau đó. Đây là những gì chúng tôi đang làm tiếp theo. Kế hoạch sẽ thay đổi theo góp ý của bạn.",
  updated="Cập nhật tháng 10 năm 2026",
  stages=[("Đang làm", [
      ("Nghe rõ hơn", "Ở nơi ồn ào và với những câu trả lời một chữ như “vâng” hay “OK”, để mỗi câu được hiểu đúng ngôn ngữ."),
      ("Chuẩn bị cho chuyến đi", "Cho biết bạn sắp đi đâu. Tabletop tải sẵn những gì cần thiết, gợi ý các câu dùng trong chuyến đi và kiểm tra để chắc mọi thứ chạy được khi không có mạng trước lúc bạn lên đường."),
      ("Chia tai nghe", "Dùng chung một cặp tai nghe, mỗi người nghe ngôn ngữ của mình ở một bên tai.")]),
    ("Sắp tới", [
      ("Lời nhắc từ những gì bạn được dặn", "Việc cần làm từ cuộc trò chuyện, như liều thuốc dược sĩ dặn hay ngày giao hàng của nhà cung cấp, trở thành lời nhắc, với các con số được đối chiếu với những gì đã nói."),
      ("Dịch từ, nhãn và đồ vật", "Gõ một từ, hoặc hướng camera vào một nhãn hay một đồ vật, để biết nó gọi là gì, nói thế nào và dùng ra sao. Lưu vào danh sách từ của bạn. Không bao giờ lưu hình ảnh."),
      ("Câu học từ cuộc trò chuyện", "Những câu hay nhất người kia đã nói, giữ lại thành câu để bạn học."),
      ("Bản dịch theo ngữ cảnh", "Mỗi câu được dịch cùng với câu vừa nói trước đó, để ít dịch sai hơn.")]),
    ("Sau này", [
      ("Gõ chữ trong cuộc trò chuyện", "Khi phòng quá ồn, hoặc khi không thể nói. Cả hai người đều có thể gõ, và Tabletop có thể đọc to lên."),
      ("Chỉ phụ đề", "Không đọc thành tiếng, chữ lớn hơn, dành cho người khiếm thính và cho nơi cần yên lặng.")])],
  ideas_h="Những ý tưởng đang cân nhắc",
  ideas=["Tabletop cho Android", "Cách xưng hô lịch sự", "Luyện lại một cuộc trò chuyện", "Thêm ngôn ngữ, như tiếng Quảng Đông, tiếng Mã Lai và tiếng Ukraina", "Trò chuyện ba người"],
  ask_h="Cho chúng tôi biết bạn sẽ dùng gì",
  ask="Bạn sẽ dùng điều nào, và còn thiếu gì? Email mở sẵn danh sách, bạn chỉ cần giữ lại những điều bạn sẽ dùng.",
  button="Viết cho chúng tôi",
  inapp="Hoặc trong ứng dụng: Cài đặt › Trợ giúp và hỗ trợ › Góp ý tính năng.",
  privacy_line="Như hiện nay, những gì bạn nói được nghe và dịch ngay trên iPhone của bạn, và không gửi đến chúng tôi.",
  subject="Tabletop: Những gì sắp tới", mail_top="Bạn sẽ dùng điều nào? Hãy xóa những điều còn lại.", mail_missing="Còn thiếu gì:")

L["ja"] = dict(home="/ja/", support="サポート", privacy="プライバシーポリシー", terms="利用規約",
  title="今後の予定",
  lede="旅のすべてをひとつのアプリで。出発前も、カウンターでも、そのあとも。次に取り組んでいることをご紹介します。いただいたご意見によって計画は変わります。",
  updated="2026年10月更新",
  stages=[("開発中", [
      ("聞き取りの向上", "騒がしい場所でも、「はい」や「OK」のようなひと言の返事でも、正しい言語で聞き取れるように。"),
      ("旅の準備", "行き先を伝えるだけで、必要なものをダウンロードし、旅で使えるフレーズを提案し、出発前にオフラインで動くことを確認します。"),
      ("イヤホンを分け合う", "1組のイヤホンを共有し、片耳ずつそれぞれの言語で聞けます。")]),
    ("次に予定", [
      ("言われたことをリマインダーに", "薬剤師に言われた飲み方や仕入れ先の納品日など、会話から生まれたやることをリマインダーに。数字は実際の発言と照らし合わせて確認します。"),
      ("言葉・ラベル・物の翻訳", "言葉を入力するか、ラベルや物にカメラを向けるだけで、呼び方、言い方、使い方がわかります。単語として保存もできます。画像は保存しません。"),
      ("会話から学ぶフレーズ", "相手が言った印象的なひと言を、覚えたいフレーズとして残せます。"),
      ("文脈を踏まえた翻訳", "直前の発言を踏まえて訳すので、誤訳が減ります。")]),
    ("その先", [
      ("会話中の文字入力", "声が届かないほど騒がしいときや、話すことができないときに。どちらの人も入力でき、Tabletopが読み上げることもできます。"),
      ("字幕のみ", "音声なし、より大きな文字で。耳の不自由な方や、静かな場所のために。")])],
  ideas_h="検討中のアイデア",
  ideas=["Android版Tabletop", "ていねいな呼びかけ", "会話のおさらい練習", "広東語、マレー語、ウクライナ語などの言語の追加", "3人での会話"],
  ask_h="使いたい機能を教えてください",
  ask="どれを使いたいですか？足りないものは？メールには一覧が入っているので、使いたいものだけ残してお送りください。",
  button="お問い合わせ",
  inapp="アプリからも送れます：設定 › ヘルプとサポート › 機能を提案",
  privacy_line="これまでどおり、話した内容はiPhoneの中で聞き取られ、翻訳され、私たちに送られることはありません。",
  subject="Tabletop：今後の予定", mail_top="どれを使いたいですか？ほかは削除してください。", mail_missing="足りないもの：")

L["ko"] = dict(home="/ko/", support="지원", privacy="개인정보 처리방침", terms="이용 약관",
  title="앞으로의 계획",
  lede="여행의 모든 순간을 하나의 앱으로. 떠나기 전에도, 카운터 앞에서도, 그 후에도. 다음으로 만들고 있는 것을 소개합니다. 계획은 여러분의 의견에 따라 바뀝니다.",
  updated="2026년 10월 업데이트",
  stages=[("개발 중", [
      ("더 정확한 듣기", "시끄러운 곳에서도, “네”나 “OK” 같은 한마디 대답도 올바른 언어로 알아듣도록."),
      ("여행 준비", "어디로 가는지 알려 주세요. Tabletop이 필요한 것을 내려받고, 여행에 쓸 문장을 제안하고, 떠나기 전에 오프라인에서 잘 작동하는지 확인합니다."),
      ("이어폰 나눠 쓰기", "이어폰 한 쌍을 함께 쓰고, 한쪽 귀로 각자의 언어를 듣습니다.")]),
    ("다음 계획", [
      ("들은 내용을 알림으로", "약사가 알려 준 복용법이나 공급업체의 납품일처럼, 대화에서 나온 할 일을 알림으로 만듭니다. 숫자는 실제로 한 말과 대조해 확인합니다."),
      ("단어·라벨·물건 번역", "단어를 입력하거나, 라벨이나 물건에 카메라를 대면 이름, 말하는 법, 쓰는 법을 알려 줍니다. 단어장에 저장할 수 있습니다. 사진은 저장하지 않습니다."),
      ("대화에서 배우는 문장", "상대가 한 좋은 말을 배울 문장으로 남겨 둡니다."),
      ("맥락을 고려한 번역", "바로 앞에 한 말을 함께 고려해 번역하므로 오역이 줄어듭니다.")]),
    ("그 이후", [
      ("대화 중 입력", "목소리가 들리지 않을 만큼 시끄럽거나, 말을 할 수 없을 때. 두 사람 모두 입력할 수 있고, Tabletop이 소리 내어 읽어 줄 수도 있습니다."),
      ("자막만", "음성 없이 더 큰 글자로. 청각 장애가 있는 분과 조용한 곳을 위해.")])],
  ideas_h="검토 중인 아이디어",
  ideas=["Android용 Tabletop", "정중한 호칭", "대화 다시 연습하기", "광둥어, 말레이어, 우크라이나어 등 언어 추가", "세 사람 대화"],
  ask_h="어떤 기능을 쓰고 싶은지 알려 주세요",
  ask="어떤 것을 쓰고 싶으신가요? 빠진 것은 무엇인가요? 메일에 목록이 들어 있으니 쓰고 싶은 것만 남겨 보내 주세요.",
  button="문의하기",
  inapp="앱에서도 보낼 수 있습니다: 설정 › 도움말 및 지원 › 기능 제안",
  privacy_line="지금처럼, 말한 내용은 iPhone 안에서 인식되고 번역되며 저희에게 전송되지 않습니다.",
  subject="Tabletop: 앞으로의 계획", mail_top="어떤 것을 쓰고 싶으신가요? 나머지는 지워 주세요.", mail_missing="빠진 것:")

L["zh-Hans"] = dict(home="/zh-hans/", support="支持", privacy="隐私政策", terms="使用条款",
  title="接下来的计划",
  lede="一个 App 陪你走完整趟旅程：出发前、柜台前，以及之后。以下是我们接下来要做的。计划会根据你的反馈调整。",
  updated="2026 年 10 月更新",
  stages=[("正在开发", [
      ("听得更清楚", "在嘈杂的地方，或是“好”“OK”这样只有一个词的回答，也能听成正确的语言。"),
      ("旅行准备", "告诉 Tabletop 你要去哪里。它会下载所需的内容，推荐旅途中用得上的句子，并在你出发前确认离线也能正常使用。"),
      ("分享耳机", "两人共用一副耳机，各自一只耳朵听自己的语言。")]),
    ("接下来", [
      ("把交代的事变成提醒", "对话中的待办事项，比如药剂师交代的用法或供应商的交货日期，会变成提醒，数字会与实际说过的话核对。"),
      ("翻译词语、标签和物品", "输入一个词，或用相机对准标签或物品，就能知道它叫什么、怎么说、怎么用。可以保存到你的单词里。绝不保存图片。"),
      ("从对话中学句子", "把对方说过的精彩句子留下来，作为要学的句子。"),
      ("结合上下文的翻译", "每句话都结合前一句一起翻译，减少误译。")]),
    ("之后", [
      ("对话中打字", "环境太吵听不见你，或是无法开口时。双方都能打字，Tabletop 也可以朗读出来。"),
      ("仅字幕", "不发声，文字更大，适合听障人士和安静的场所。")])],
  ideas_h="正在考虑的想法",
  ideas=["Android 版 Tabletop", "礼貌的称呼", "重新练习一次对话", "增加更多语言，如粤语、马来语和乌克兰语", "三人对话"],
  ask_h="告诉我们你会用哪些",
  ask="你会用哪些？还缺什么？邮件里已附上清单，只保留你会用的即可。",
  button="给我们写信",
  inapp="也可以在 App 中：设置 › 帮助与支持 › 提出功能建议",
  privacy_line="和现在一样，你说的话在 iPhone 上识别和翻译，不会发送给我们。",
  subject="Tabletop：接下来的计划", mail_top="你会用哪些？请删除其余的。", mail_missing="还缺什么：")

L["zh-Hant"] = dict(home="/zh-hant/", support="支援", privacy="隱私權政策", terms="使用條款",
  title="接下來的計畫",
  lede="一個 App 陪你走完整趟旅程：出發前、櫃檯前，以及之後。以下是我們接下來要做的。計畫會依照你的回饋調整。",
  updated="2026 年 10 月更新",
  stages=[("正在開發", [
      ("聽得更清楚", "在吵雜的地方，或是「好」「OK」這樣只有一個詞的回答，也能聽成正確的語言。"),
      ("旅行準備", "告訴 Tabletop 你要去哪裡。它會下載所需的內容，推薦旅途中用得到的句子，並在你出發前確認離線也能正常使用。"),
      ("共用耳機", "兩人共用一副耳機，各自一隻耳朵聽自己的語言。")]),
    ("接下來", [
      ("把交代的事變成提醒", "對話中的待辦事項，例如藥師交代的用法或供應商的交貨日期，會變成提醒，數字會與實際說過的話核對。"),
      ("翻譯詞語、標籤和物品", "輸入一個詞，或用相機對準標籤或物品，就能知道它叫什麼、怎麼說、怎麼用。可以儲存到你的單字裡。絕不儲存圖片。"),
      ("從對話中學句子", "把對方說過的精彩句子留下來，作為要學的句子。"),
      ("結合上下文的翻譯", "每句話都結合前一句一起翻譯，減少誤譯。")]),
    ("之後", [
      ("對話中打字", "環境太吵聽不到你，或是無法開口時。雙方都能打字，Tabletop 也可以朗讀出來。"),
      ("僅字幕", "不發聲，文字更大，適合聽障人士和安靜的場所。")])],
  ideas_h="正在考慮的想法",
  ideas=["Android 版 Tabletop", "禮貌的稱呼", "重新練習一次對話", "增加更多語言，例如粵語、馬來語和烏克蘭語", "三人對話"],
  ask_h="告訴我們你會用哪些",
  ask="你會用哪些？還缺什麼？郵件裡已附上清單，只保留你會用的即可。",
  button="寫信給我們",
  inapp="也可以在 App 中：設定 › 幫助與支援 › 提出功能建議",
  privacy_line="和現在一樣，你說的話在 iPhone 上辨識和翻譯，不會傳送給我們。",
  subject="Tabletop：接下來的計畫", mail_top="你會用哪些？請刪除其餘的。", mail_missing="還缺什麼：")

ORDER = ["en", "vi", "ja", "ko", "zh-Hans", "zh-Hant"]
NAMES = {"en": "English", "vi": "Tiếng Việt", "ja": "日本語", "ko": "한국어", "zh-Hans": "简体中文", "zh-Hant": "繁體中文"}

def mailto(t):
    items = [i[0] for _, its in t["stages"] for i in its] + t["ideas"]
    body = t["mail_top"] + "\n\n" + "\n".join("- " + i for i in items) + "\n\n" + t["mail_missing"] + "\n\n"
    return "mailto:support@trytabletop.app?subject=" + quote(t["subject"]) + "&body=" + quote(body)

def section(code):
    t = L[code]
    out = [f'<section class="lang" id="{code}" lang="{code}" data-title="Tabletop Interpreter · {E(t["title"])}">',
           f'<nav><a href="{t["home"]}">Tabletop</a><a href="support.html#{code}">{E(t["support"])}</a><a href="privacy.html#{code}">{E(t["privacy"])}</a></nav>',
           f'<h1>{E(t["title"])}</h1>',
           f'<p class="lede">{E(t["lede"])}</p>',
           f'<p class="updated"><time datetime="2026-10">{E(t["updated"])}</time></p>']
    for i, (stage, items) in enumerate(t["stages"]):
        cls = "coming now" if i == 0 else "coming"
        out.append(f'<h2 class="cue">{E(stage)}</h2>')
        out.append(f'<ul class="{cls}">' + "".join(f'<li><strong>{E(a)}</strong><span>{E(b)}</span></li>' for a, b in items) + '</ul>')
    out.append(f'<h2 class="cue">{E(t["ideas_h"])}</h2>')
    out.append('<ul class="ideas">' + "".join(f'<li>{E(x)}</li>' for x in t["ideas"]) + '</ul>')
    out.append('<div class="envelope">')
    out.append(f'<h2>{E(t["ask_h"])}</h2>')
    out.append(f'<p>{E(t["ask"])}</p>')
    out.append(f'<p><a class="button" href="{E(mailto(t))}">{E(t["button"])}</a></p>')
    out.append(f'<p class="in-app">{E(t["inapp"])}</p>')
    out.append('</div>')
    out.append(f'<p class="privacy-line">{E(t["privacy_line"])}</p>')
    out.append(f'<footer class="quiet"><p><a href="support.html#{code}">{E(t["support"])}</a> · <a href="privacy.html#{code}">{E(t["privacy"])}</a> · <a href="terms.html#{code}">{E(t["terms"])}</a> · <a href="mailto:support@trytabletop.app">support@trytabletop.app</a><br>© 2026 Tabletop</p></footer>')
    out.append('</section>')
    return "\n".join(out)

STYLE = """
h1{font-size:clamp(32px,7.5vw,44px);font-weight:800;letter-spacing:-0.02em;text-wrap:balance}
.lede{color:var(--secondary);margin:10px 0 4px;max-width:62ch}
.updated{font-size:14px;color:var(--secondary);margin:0}
/* Each stage is a caption cue, as the app shows state: [Being built now], ［開発中］. */
h2.cue{color:var(--blue);font-size:17px;font-weight:700;margin:44px 0 12px}
.cue::before{content:"[";content:"[" / ""}.cue::after{content:"]";content:"]" / ""}
:lang(ja) .cue::before,:lang(zh-Hans) .cue::before,:lang(zh-Hant) .cue::before{content:"［";content:"［" / ""}
:lang(ja) .cue::after,:lang(zh-Hans) .cue::after,:lang(zh-Hant) .cue::after{content:"］";content:"］" / ""}
ul.coming{list-style:none;padding:0;margin:0}
ul.coming li{padding:14px 0;border-top:1px solid var(--seam)}
ul.coming li:last-child{border-bottom:1px solid var(--seam)}
ul.coming strong{display:block;font-size:18px}
ul.coming span{color:var(--secondary)}
/* What's being built now is written on the aerogramme sheet. */
ul.now{background:var(--sheet);padding:4px 18px}
ul.now li{border-color:color-mix(in srgb,var(--ink) 14%,transparent)}
ul.now li:last-child{border-bottom:0}
ul.now li:first-child{border-top:0}
ul.now span{color:var(--ink)}
ul.ideas{margin:0;padding-left:1.2em}
ul.ideas li{padding:3px 0}
ul.ideas li::marker{color:var(--blue)}
/* The ask is a letter to us, in an airmail border. */
.envelope{margin:48px 0 0;padding:22px 22px 6px;border:6px solid transparent;border-image:repeating-linear-gradient(135deg,var(--red) 0 10px,transparent 10px 14px,var(--blue) 14px 24px,transparent 24px 28px) 6}
.envelope h2{margin:0 0 6px}
.button{display:inline-flex;align-items:center;min-height:44px;padding:0 24px;border-radius:999px;background:var(--blue);color:var(--ground);font-weight:600;text-decoration:none}
.button:hover{filter:brightness(1.12)}
.in-app{font-size:15px;color:var(--secondary)}
.from-app .in-app{display:none}
.privacy-line{font-size:15px;color:var(--secondary);margin-top:20px}
@media (max-width:480px){main{padding-top:24px}nav{margin-bottom:20px}h2.cue{margin-top:36px}.envelope{padding:18px 16px 4px}}
"""

REDIRECT = """(function(){if(location.hash)return;var m={vi:"vi",ja:"ja",ko:"ko"};var l=(navigator.languages||[navigator.language||""]);for(var i=0;i<l.length;i++){var c=l[i].toLowerCase();if(c.indexOf("en")===0)return;if(c.indexOf("zh")===0){location.replace("#"+(/hant|tw|hk|mo/.test(c)?"zh-Hant":"zh-Hans"));return}var b=c.split("-")[0];if(m[b]){location.replace("#"+m[b]);return}}})();"""
# The document's language and title follow the section shown; the app opens the page with ?from=app, where the
# "Or in the app" line would point back to the screen the reader came from.
FOLLOW = """(function(){var d=document.documentElement;if(/[?&]from=app\\b/.test(location.search))d.classList.add("from-app");function show(){var s=document.getElementById(location.hash.slice(1))||document.getElementById("en");if(!s||!s.classList.contains("lang"))s=document.getElementById("en");d.lang=s.lang;document.title=s.dataset.title}show();addEventListener("hashchange",show)})();"""

page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabletop Interpreter · What's Coming</title><meta name="description" content="What we're building next for Tabletop Interpreter, and the ideas we're weighing. Tell us what you'd use."><link rel="canonical" href="https://trytabletop.app/whats-coming.html"><link rel="stylesheet" href="style.css"><style>{STYLE.strip()}</style><script>{REDIRECT}</script></head>
<body><div class="edge"></div><main>
<p class="langs">{' · '.join(f'<a href="#{c}" lang="{c}" hreflang="{c}">{NAMES[c]}</a>' for c in ORDER)}</p>

{chr(10).join(chr(10) + section(c) for c in ORDER).lstrip()}
</main><script>{FOLLOW}</script></body></html>
"""
open(OUT, "w").write(page)
print("wrote", OUT)
