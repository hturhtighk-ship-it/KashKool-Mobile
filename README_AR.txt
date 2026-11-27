KashKool v74 — Themed Page Transitions, Signature Motion, Signature Colours

محتويات التحديث:
- assets/css/kashkool-v74.css: انتقال بين الصفحات لكل ثيم — 19 ستارًا مختلفًا بلون هوية كل ثيم.
- assets/js/35-v74-page-transitions.js: محرّك الانتقال (غطاء الستار ← تبديل الصفحة ← كشف الستار).
- assets/css/kashkool-v72.css: توقيع حركي كامل لكل ثيم (دخول، تمرير، ضغط، تبويب، ترويسة) للثيمات الستة الناقصة: frost, rose, golden, metro, blueprint, swiss.
- assets/js/34-v72-signature-press.js: بصمة الضغط — علامة مرسومة مختلفة لكل ثيم في 19 ثيمًا، بلون هوية الثيم.
- assets/css/kashkool-v73.css: لون مميز واحد لكل ثيم له معنى + لون هامش ثانوي، بلا أبيض سافي ولا أسود سافي.
- assets/js/01-app-core.js: تحديث معاينات المتجر وأوصاف الثيمات لتطابق ألوان الهوية الجديدة.
- index.html: التطبيق الرئيسي بإصدار v74 مع ربط الطبقات الجديدة.
- kashkool-sw.js: ذاكرة العمل دون اتصال باسم kashkool-shell-v74 مع الملفات الجديدة.
- package.json: النسخة 74.0.0.

ألوان الهوية الجديدة:
- classic #a8791f / school #b2472e / football #4fae6a / galaxy #8b7cff / cyber #31f2c2
- nature #5b8a51 / academia #a7753e / ocean #2e9fb8 / sunset #ffad5b / mono #232326
- frost #4a7a93 / rose #9c5a4c / golden #f4a900 / metro #1677d2 / blueprint #55d6ff
- swiss #e53935 / fire #ef7138 / anime #ff5576 / manga #9a4033

ما جاء من v71:
- assets/js/33-v71-cinematic-themes.js: مشهد سينمائي لكل ثيم في المتجر.
- assets/css/kashkool-v71.css: طبقة المشهد، انتقالات التبديل الناقصة، وإصلاحات الموبايل.
- assets/js/18-cloud-accounts-v1.js: مزامنة سحابية أكثر موثوقية.
- assets/js/23-learning-os-v50-js.js: إصلاح قائمة "المزيد".

طريقة رفع التحديث إلى GitHub:
1) افتح مستودع KashKool-Mobile.
2) ارفع الملفات الموجودة في هذه الحزمة إلى جذر المستودع.
3) وافق على استبدال index.html و kashkool-sw.js و kashkool.webmanifest.
4) انتظر انتهاء GitHub Pages من النشر، ثم افتح رابط التطبيق.
5) إذا ظهرت النسخة القديمة، أغلق التطبيق وافتحه مجددًا أو امسح بيانات الموقع/الكاش ثم افتحه مرة أخرى.

ملاحظات مهمة:
- هذا التحديث لا يضمّن إعدادات Firebase الخاصة بالمشروع داخل الملف.
- إذا لم تكن إعدادات Firebase محفوظة مسبقًا على الجهاز، أدخل Firebase Web App config من إعدادات الحساب والمزامنة داخل التطبيق.
- يلزم تفعيل Email/Password في Firebase Authentication وإعداد Cloud Firestore وقواعد الأمان.
- لا ترفع كلمات مرور أو مفاتيح Admin SDK أو مفاتيح خادم إلى GitHub.
- احتفظ بنسخة احتياطية من بياناتك قبل اختبار تسجيل الدخول والمزامنة.
