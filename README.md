# أبلغ (Ablagh)

أداة ويب بسيطة لإعادة صياغة النص العربي بشكل أكثر بلاغة واحترافية وتصحيح الأخطاء النحوية، باستخدام منصة Mistral API.

## المتطلبات

- Node.js 18+
- مفتاح `MISTRAL_API_KEY` صالح من منصة Mistral

## الإعداد

1. تثبيت الاعتماديات:

```bash
cd server && npm install
cd ../client && npm install
```

2. إعداد المتغيرات:

- انسخ ملف `server/.env.example` إلى `server/.env` وأدخل مفتاحك:

```
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=4000
```

## التشغيل أثناء التطوير

في نافذتين منفصلتين:

- تشغيل الخادم:

```bash
cd server
npm run dev
```

- تشغيل الواجهة:

```bash
cd client
npm run dev
```

ستجد الواجهة على: http://localhost:5173 وتتصل بالخادم على http://localhost:4000

## الإنتاج

- بناء الواجهة:

```bash
cd client
npm run build
```

- تشغيل الخادم:

```bash
cd server
npm start
```

## الملاحظات

- الواجهة تعمل باتجاه RTL وتعرض النتائج بالعربية.
- الخادم يستدعي نموذج `mistral-large-latest` عبر واجهة الدردشة.
- يمكن ضبط `VITE_API_BASE` في الواجهة إن أردت تغيير عنوان الخادم.
