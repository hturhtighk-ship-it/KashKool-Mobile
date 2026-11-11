/* ==============================================================
   JS 02/28 · Core app logic · 284.6 KB
   ============================================================== */
(function () {
  'use strict';

  /* ---------------- constants ---------------- */
  var DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  var DAYS_EN = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var MONTHS_AR = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  var MONTHS_EN = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var DAYS = DAYS_AR;
  var MONTHS = MONTHS_AR;
  var PALETTE = ['#C24A3E', '#2E5E9E', '#2F7D62', '#8A5BB5', '#C98A22', '#0E7C86', '#B4456F', '#5C6B7A'];
  var DEFAULT_COLOR = '#5C6B7A';
  var LS_KEY_BASE = 'kashkool.data.v1';
  var LS_ACCOUNTS = 'kashkool.accounts.v1',
    LS_ACTIVE_ACCOUNT = 'kashkool.active.account.v1';
  var accounts = [],
    activeAccountId = 'default';
  function dataKey() {
    return LS_KEY_BASE + '.' + activeAccountId;
  }
  function scopedKey(base) {
    return base + '.' + activeAccountId;
  }
  var LS_THEME = 'kashkool.theme';
  var LS_LANG = 'kashkool.lang';
  var LS_SETTINGS = 'kashkool.settings.v1';
  var lang = 'ar';
  var soundEnabled = true;

  var UI = {
    ar: {
      title: 'الكشكول',
      subtitle: 'دروسي · واجباتي · مواعيد الأسبوع',
      search: 'بحث',
      dashboard: 'لوحة التحكم',
      dark: 'الوضع الداكن',
      light: 'الوضع الفاتح',
      today: 'النهاردة',
      week: 'الأسبوع',
      homework: 'الواجبات',
      exams: 'امتحانات',
      links: 'الشروحات',
      notes: 'نوتات',
      studySystem: 'نظام المذاكرة',
      timer: 'مؤقّت',
      stats: 'التقدم',
      subjects: 'المواد',
      showFlashcards: 'البطاقات التعليمية',
      sections: 'أقسام',
      todaySchedule: 'جدول اليوم',
      addEntry: '+ درس أو ميعاد',
      addHomework: '+ واجب',
      weekSchedule: 'جدول الأسبوع',
      addExam: '+ امتحان',
      addLink: '+ لينك',
      addNote: '+ نوتة',
      studyTimer: 'مؤقّت مذاكرة',
      study: 'مذاكرة',
      start: 'ابدأ',
      pause: 'إيقاف مؤقت',
      skip: 'تخطي',
      reset: 'إعادة ضبط',
      timerSettings: 'إعدادات المؤقّت',
      shortBreak: 'استراحة قصيرة (دقيقة)',
      longBreak: 'استراحة طويلة (دقيقة)',
      rounds: 'استراحة طويلة كل كام جولة',
      apply: 'تطبيق',
      subjectHint: 'اللون بيمشي على الجدول والواجبات',
      linksHint: 'يوتيوب، منصة، ملف… محفوظين حسب المادة',
      notesHint: 'أي حاجة عايز تفتكرها، مربوطة بمادة لو حبيت',
      addSubject: '+ مادة',
      save: 'حفظ',
      cancel: 'إلغاء',
      remove: 'مسح',
      close: 'قفل',
      clear: 'مسح البحث',
      results: 'نتيجة',
      newExam: 'امتحان جديد',
      editExam: 'تعديل الامتحان',
      examName: 'اسم الامتحان',
      subject: 'المادة',
      noSubject: '— من غير مادة —',
      date: 'التاريخ',
      optionalTime: 'الساعة (اختياري)',
      place: 'المكان',
      note: 'ملاحظة',
      newEntry: 'درس أو ميعاد جديد',
      edit: 'تعديل',
      title: 'العنوان',
      days: 'الأيام',
      dayHint: 'تقدر تختار أكتر من يوم مرة واحدة',
      noTime: 'بدون وقت محدد (طول اليوم)',
      from: 'من',
      to: 'لـ',
      link: 'لينك الشرح',
      chooseSavedLink: 'أو اختار من الشروحات المحفوظة',
      homeworkName: 'الواجب',
      due: 'التسليم',
      details: 'تفاصيل',
      newHomework: 'واجب جديد',
      editHomework: 'تعديل الواجب',
      newLink: 'لينك جديد',
      editLink: 'تعديل اللينك',
      url: 'الرابط',
      newNote: 'نوتة جديدة',
      editNote: 'تعديل النوتة',
      noteBody: 'النوتة',
      newSubject: 'مادة جديدة',
      subjectName: 'اسم المادة',
      color: 'اللون',
      teacher: 'المدرس',
      optionalTeacher: 'اسم المدرس (اختياري)',
      searchPlaceholder: 'دوّر في الدروس، الواجبات، الامتحانات، الشروحات، النوتات، المواد…',
      settings: 'الإعدادات',
      accountTitle: 'الحساب',
      accountDesc: 'أنشئ حسابًا باسم مستخدم وكلمة مرور، وفعّل المزامنة السحابية لفتح بياناتك على أجهزتك.',
      manageAccounts: 'الحساب والمزامنة',
      accountsTitle: 'الحساب والمزامنة',
      newAccountName: 'اسم حساب جديد',
      newAccountPlaceholder: 'مثلاً: Mahmoud',
      addAccount: 'إضافة',
      defaultAccount: 'حسابي',
      soundTitle: 'صوت المؤقّت',
      soundDesc: 'اختار صوت التنبيه ومستواه لما تخلص مرحلة المذاكرة أو الاستراحة.',
      soundOn: 'تشغيل الصوت',
      volume: 'مستوى الصوت',
      soundChoice: 'صوت التنبيه',
      testSound: 'تجربة الصوت',
      preview: 'سماع',
      soundClassic: 'بيب كلاسيك',
      soundBell: 'جرس',
      soundChime: 'رنين هادي',
      soundDigital: 'منبّه رقمي',
      soundSoft: 'نغمة ناعمة',
      settingsHint: 'خصص الكشكول على طريقتك',
      accountSection: 'الحساب',
      appearanceSection: 'المظهر',
      studySection: 'المذاكرة',
      timerSection: 'المؤقّت',
      dataSection: 'البيانات',
      helpSection: 'مساعدة',
      appearanceTitle: 'المظهر والواجهة',
      appearanceDesc: 'غيّر شكل الكشكول وحجم الكتابة وطريقة العرض.',
      themeLabel: 'المظهر',
      themeDesc: 'تلقائي حسب الجهاز أو اختر وضعًا ثابتًا.',
      themeSystem: 'تلقائي',
      themeLight: 'فاتح',
      themeDark: 'داكن',
      fontSizeLabel: 'حجم الخط',
      fontSizeDesc: 'كبّر أو صغّر النص في التطبيق.',
      fontSmall: 'صغير',
      fontNormal: 'متوسط',
      fontLarge: 'كبير',
      fontXLarge: 'كبير جدًا',
      compactLabel: 'الوضع المدمج',
      compactDesc: 'يقلل المسافات عشان يظهر محتوى أكثر.',
      motionLabel: 'تقليل الحركة',
      motionDesc: 'يوقف معظم الحركات والانتقالات.',
      motionProfileLabel: 'أداء الأنيميشن',
      motionProfileDesc: 'تلقائي يوازن المؤثرات مع قدرة الجهاز، أو اختر الوضع بنفسك.',
      motionAuto: 'تلقائي (موصى به)',
      motionRich: 'مؤثرات كاملة',
      motionBalanced: 'أداء متوازن',
      motionUltra: 'أقصى أداء',
      studySettingsTitle: 'تفضيلات المذاكرة',
      studySettingsDesc: 'حدد الصفحة التي تفتح أولًا وبعض سلوكيات التطبيق.',
      defaultViewLabel: 'الصفحة الافتراضية',
      defaultViewDesc: 'الصفحة التي يفتح عليها الكشكول.',
      confirmDeleteLabel: 'تأكيد قبل المسح',
      confirmDeleteDesc: 'يعرض رسالة تأكيد قبل حذف العناصر.',
      timerSettingsCardTitle: 'إعدادات المؤقّت',
      timerSettingsCardDesc: 'اضبط مدة الجلسة والاستراحات والجولات من هنا.',
      settingWorkLabel: 'المذاكرة',
      settingWorkDesc: 'مدة جلسة التركيز بالدقائق.',
      settingBreakLabel: 'الاستراحة القصيرة',
      settingBreakDesc: 'مدة الاستراحة بين الجولات.',
      settingLongLabel: 'الاستراحة الطويلة',
      settingLongDesc: 'مدة الاستراحة الطويلة.',
      settingRoundsLabel: 'عدد الجولات',
      settingRoundsDesc: 'بعدها تبدأ الاستراحة الطويلة.',
      settingsAutoLabel: 'تشغيل المرحلة التالية تلقائيًا',
      saveTimerSettings: 'حفظ إعدادات المؤقّت',
      openTimer: 'فتح صفحة المؤقّت',
      dataTitle: 'البيانات والخصوصية',
      dataDesc: 'بياناتك تُحفظ محليًا على هذا الجهاز في وضع التخزين المحلي.',
      exportData: 'تصدير البيانات',
      importData: 'استيراد البيانات',
      resetData: 'مسح بيانات الحساب',
      dataReady: 'التخزين المحلي جاهز.',
      dataExported: 'تم تصدير البيانات.',
      dataImported: 'تم استيراد البيانات بنجاح.',
      invalidImport: 'ملف البيانات غير صالح.',
      resetConfirm: 'تمسح كل بيانات الحساب الحالي من الجهاز؟',
      dataReset: 'تم مسح بيانات الحساب.',
      helpTitle: 'اختصارات وتلميحات',
      helpDesc: 'استخدم الكيبورد بسرعة: Space لتشغيل/إيقاف المؤقّت، وEscape لإغلاق النوافذ.',
      settingsSaved: 'تم حفظ الإعدادات.',
      studyMinutes: 'مذاكرة (دقيقة)',
      phaseWork: 'مذاكرة',
      phaseBreak: 'استراحة قصيرة',
      phaseLong: 'استراحة طويلة',
      readyHint: 'جاهز لما تبدأ',
      runningHint: 'المؤقّت شغّال',
      pausedHint: 'واقف مؤقتًا',
      nextUp: 'بعدها: ',
      resume: 'كمّل',
      presetsLabel: 'إعدادات جاهزة',
      presetClassic: 'كلاسيك',
      presetFocus: 'تركيز عميق',
      presetSprint: 'سريع',
      autoStart: 'ابدأ المرحلة اللي بعدها تلقائي',
      keysHint: 'دوس على زرار المسافة للبدء / الإيقاف المؤقت',
      soundMute: 'كتم تنبيه المؤقّت',
      soundUnmute: 'تشغيل تنبيه المؤقّت',
      personalizationSection: 'التخصيص',
      personalizationTitle: 'التخصيص',
      personalizationDesc: 'غيّر لون الكشكول وشكل البطاقات والأقسام الظاهرة حسب ذوقك.',
      accentLabel: 'اللون الأساسي',
      accentDesc: 'اختار اللون الذي يظهر في الأزرار والعناصر المميزة.',
      accentGold: 'ذهبي',
      accentBlue: 'أزرق',
      accentGreen: 'أخضر',
      accentPurple: 'بنفسجي',
      accentRose: 'وردي',
      accentCyan: 'سماوي',
      radiusLabel: 'شكل البطاقات',
      radiusDesc: 'غيّر درجة نعومة الحواف في التطبيق.',
      radiusSoft: 'ناعم',
      radiusRounded: 'دائري',
      radiusSquare: 'حاد',
      densityLabel: 'كثافة الواجهة',
      densityDesc: 'تحكم في المسافات وحجم العناصر.',
      densityComfortable: 'مريحة',
      densityCompact: 'مدمجة',
      densitySpacious: 'واسعة',
      visibleSectionsTitle: 'الأقسام الظاهرة',
      showDashboard: 'لوحة التحكم',
      showToday: 'النهاردة',
      showWeek: 'الأسبوع',
      showHomework: 'الواجبات',
      showExams: 'الامتحانات',
      showLinks: 'الشروحات',
      showNotes: 'النوتات',
      showTimer: 'المؤقّت',
      showStudySystem: 'نظام المذاكرة',
      showProgress: 'التقدم',
      showSubjects: 'المواد',
      studySystems: 'أنظمة المذاكرة',
      studyPlanIntro: 'اختار نظام مذاكرة، نفّذ خطواته بالترتيب، وعلّم على كل خطوة بعد ما تخلصها.',
      addStudySystem: 'إضافة نظام',
      currentStudySystem: 'النظام الحالي',
      noStudySystems: 'لا توجد أنظمة مذاكرة.',
      noSteps: 'لا توجد خطوات.',
      stepsCount: 'خطوات',
      stepArabic: 'الخطوة بالعربية',
      stepEnglish: 'الخطوة بالإنجليزية',
      removeStep: 'حذف الخطوة',
      addStep: 'إضافة خطوة',
      saveStudySystem: 'حفظ النظام',
      resetStudySystem: 'إعادة الخطوات',
      systemDeleted: 'تم حذف نظام المذاكرة.',
      cannotDeleteDefault: 'الأنظمة الجاهزة لا يمكن حذفها.',
      studySystemDialogTitle: 'إضافة نظام مذاكرة',
      studyStepsEditorHeading: 'خطوات النظام',
      studyTitleArabic: 'اسم النظام بالعربية',
      studyTitleEnglish: 'اسم النظام بالإنجليزية',
      studyDescArabic: 'الوصف بالعربية',
      studyDescEnglish: 'الوصف بالإنجليزية',
      studyTitleArabicPh: 'مثلاً: الاسترجاع النشط',
      studyTitleEnglishPh: 'مثلاً: Active Recall',
      studyDescArabicPh: 'وصف مختصر للنظام',
      studyDescEnglishPh: 'Short description',
      streak: 'الاستريك',
      dayStreak: 'يوم مذاكرة متتالي',
      streakSafe: 'مستمر 🔥',
      streakRisk: 'ذاكر النهاردة عشان تحافظ عليه',
      longestStreak: 'أطول استريك',
      streakAtRisk: 'مُعرّض للانقطاع',
      focusSettingsTitle: 'وضع التركيز',
      focusSettingsDesc: 'اقفل التنقل داخل التطبيق وركّز على المؤقّت والخطوة الحالية بدون تشتيت.',
      focusAutoLabel: 'الدخول لوضع التركيز تلقائيًا عند بدء جلسة مذاكرة',
      focusStepsLabel: 'إظهار خطوات نظام المذاكرة أثناء التركيز',
      openFocus: 'دخول وضع التركيز',
      focusMode: 'وضع التركيز',
      exitFocus: 'خروج من التركيز',
      focusReady: 'جاهز لما تبدأ',
      focusRunning: 'ركز في جلستك',
      focusPaused: 'المؤقّت واقف مؤقتًا',
      focusShortcut: 'Ctrl + Shift + F · Esc للخروج',
      focusPrev: 'السابق',
      focusNext: 'التالي',
      focusStage: 'مرحلة',
      focusSelected: 'المرحلة المحددة',
      focusArabic: 'العربية',
      focusEnglish: 'English',
      todayEnglish: 'Today',
      homeworkEnglish: 'Homework',
      dueEnglish: 'Due',
      overdueEnglish: 'Overdue',
      todayDueEnglish: 'Today',
      tomorrowEnglish: 'Tomorrow',
      laterEnglish: 'Later',
      doneEnglish: 'Done',
      emptyTodayEnglish: 'No events scheduled yet.',
      emptyHomeworkEnglish: 'No homework due soon.',
      emptyAllHomeworkEnglish: 'No homework added yet.',
      studySubject: 'المادة',
      studySubjectHint: 'اختار المادة اللي هتذاكرها عشان تتحسب في إحصائياتها.',
      noStudySubject: 'من غير مادة',
      subjectStudyTitle: 'وقت المذاكرة حسب المادة',
      subjectStudySub: 'شوف وقت مذاكرتك رايح فين خلال الأسبوع، ومعاه إجمالي وقت كل مادة.',
      subjectStudyEmpty: 'مفيش جلسات متسجلة حسب المادة لسه.',
      sessionsLabel: 'جلسات',
      lastStudied: 'آخر مذاكرة',
      thisWeek: 'هذا الأسبوع',
      totalTime: 'الإجمالي',
      uncategorized: 'غير مصنفة',
    },
    en: {
      title: 'Kashkool',
      subtitle: 'Lessons · Homework · Weekly schedule',
      search: 'Search',
      dashboard: 'Dashboard',
      dark: 'Dark mode',
      light: 'Light mode',
      today: 'Today',
      week: 'Week',
      homework: 'Homework',
      exams: 'Exams',
      links: 'Resources',
      notes: 'Notes',
      studySystem: 'Study system',
      timer: 'Timer',
      stats: 'Progress',
      subjects: 'Subjects',
      showFlashcards: 'Flashcards',
      sections: 'Sections',
      todaySchedule: "Today's schedule",
      addEntry: '+ Lesson or event',
      addHomework: '+ Homework',
      weekSchedule: 'Weekly schedule',
      addExam: '+ Exam',
      addLink: '+ Resource',
      addNote: '+ Note',
      studyTimer: 'Study timer',
      study: 'Study',
      start: 'Start',
      pause: 'Pause',
      skip: 'Skip',
      reset: 'Reset',
      timerSettings: 'Timer settings',
      shortBreak: 'Short break (minutes)',
      longBreak: 'Long break (minutes)',
      rounds: 'Long break every (rounds)',
      apply: 'Apply',
      subjectHint: 'Colors appear on your schedule and homework',
      linksHint: 'YouTube, platforms, files… saved by subject',
      notesHint: 'Anything you want to remember, optionally linked to a subject',
      addSubject: '+ Subject',
      save: 'Save',
      cancel: 'Cancel',
      remove: 'Delete',
      close: 'Close',
      clear: 'Clear search',
      results: 'results',
      newExam: 'New exam',
      editExam: 'Edit exam',
      examName: 'Exam name',
      subject: 'Subject',
      noSubject: '— No subject —',
      date: 'Date',
      optionalTime: 'Time (optional)',
      place: 'Location',
      note: 'Note',
      newEntry: 'New lesson or event',
      edit: 'Edit',
      title: 'Title',
      days: 'Days',
      dayHint: 'You can choose more than one day',
      noTime: 'No specific time (all day)',
      from: 'From',
      to: 'To',
      link: 'Resource link',
      chooseSavedLink: 'Or choose a saved resource',
      homeworkName: 'Homework',
      due: 'Due',
      details: 'Details',
      newHomework: 'New homework',
      editHomework: 'Edit homework',
      newLink: 'New resource',
      editLink: 'Edit resource',
      url: 'URL',
      newNote: 'New note',
      editNote: 'Edit note',
      noteBody: 'Note',
      newSubject: 'New subject',
      subjectName: 'Subject name',
      color: 'Color',
      teacher: 'Teacher',
      optionalTeacher: 'Teacher name (optional)',
      searchPlaceholder: 'Search lessons, homework, exams, resources, notes, and subjects…',
      settings: 'Settings',
      accountTitle: 'Account',
      accountDesc:
        'Create a username and password, then enable cloud sync to access your data on your devices.',
      manageAccounts: 'Account & sync',
      accountsTitle: 'Account & sync',
      newAccountName: 'New account name',
      newAccountPlaceholder: 'e.g. Mahmoud',
      addAccount: 'Add',
      defaultAccount: 'My account',
      soundTitle: 'Timer sound',
      soundDesc: 'Choose the alert sound and its volume for when a study session or break ends.',
      soundOn: 'Play sound',
      volume: 'Volume',
      soundChoice: 'Alert sound',
      testSound: 'Test sound',
      preview: 'Preview',
      soundClassic: 'Classic beep',
      soundBell: 'Bell',
      soundChime: 'Soft chime',
      soundDigital: 'Digital alarm',
      soundSoft: 'Gentle tone',
      settingsHint: 'Customize Kashkool your way',
      accountSection: 'Account',
      appearanceSection: 'Appearance',
      studySection: 'Study',
      timerSection: 'Timer',
      dataSection: 'Data',
      helpSection: 'Help',
      appearanceTitle: 'Appearance & interface',
      appearanceDesc: 'Change the look, text size, and display style.',
      themeLabel: 'Theme',
      themeDesc: 'Follow your device or choose a fixed theme.',
      themeSystem: 'System',
      themeLight: 'Light',
      themeDark: 'Dark',
      fontSizeLabel: 'Text size',
      fontSizeDesc: 'Make app text smaller or larger.',
      fontSmall: 'Small',
      fontNormal: 'Normal',
      fontLarge: 'Large',
      fontXLarge: 'Extra large',
      compactLabel: 'Compact mode',
      compactDesc: 'Reduce spacing to fit more content.',
      motionLabel: 'Reduce motion',
      motionDesc: 'Disable most animations and transitions.',
      motionProfileLabel: 'Animation performance',
      motionProfileDesc: 'Auto balances visual effects with your device, or choose a mode.',
      motionAuto: 'Auto (recommended)',
      motionRich: 'Full visual effects',
      motionBalanced: 'Balanced performance',
      motionUltra: 'Maximum performance',
      studySettingsTitle: 'Study preferences',
      studySettingsDesc: 'Choose the opening page and a few app behaviors.',
      defaultViewLabel: 'Default page',
      defaultViewDesc: 'The page Kashkool opens on.',
      confirmDeleteLabel: 'Confirm before deleting',
      confirmDeleteDesc: 'Ask for confirmation before deleting items.',
      timerSettingsCardTitle: 'Timer settings',
      timerSettingsCardDesc: 'Set study, break, and round durations from here.',
      settingWorkLabel: 'Study',
      settingWorkDesc: 'Focus session length in minutes.',
      settingBreakLabel: 'Short break',
      settingBreakDesc: 'Break length between rounds.',
      settingLongLabel: 'Long break',
      settingLongDesc: 'Long break length.',
      settingRoundsLabel: 'Rounds',
      settingRoundsDesc: 'Long break starts after this many rounds.',
      settingsAutoLabel: 'Start the next phase automatically',
      saveTimerSettings: 'Save timer settings',
      openTimer: 'Open timer',
      dataTitle: 'Data & privacy',
      dataDesc: 'Your data is stored locally on this device in local-storage mode.',
      exportData: 'Export data',
      importData: 'Import data',
      resetData: 'Clear account data',
      dataReady: 'Local storage is ready.',
      dataExported: 'Data exported.',
      dataImported: 'Data imported successfully.',
      invalidImport: 'The data file is invalid.',
      resetConfirm: 'Clear all data for the current account from this device?',
      dataReset: 'Account data cleared.',
      helpTitle: 'Shortcuts & tips',
      helpDesc: 'Keyboard shortcuts: Space starts/pauses the timer, and Escape closes dialogs.',
      settingsSaved: 'Settings saved.',
      studyMinutes: 'Study (minutes)',
      phaseWork: 'Study',
      phaseBreak: 'Short break',
      phaseLong: 'Long break',
      readyHint: 'Ready when you are',
      runningHint: 'Timer is running',
      pausedHint: 'Paused',
      nextUp: 'Next: ',
      resume: 'Resume',
      presetsLabel: 'Quick presets',
      presetClassic: 'Classic',
      presetFocus: 'Deep focus',
      presetSprint: 'Sprint',
      autoStart: 'Start the next phase automatically',
      keysHint: 'Press Space to start / pause',
      soundMute: 'Mute timer alert',
      soundUnmute: 'Unmute timer alert',
      personalizationSection: 'Personalization',
      personalizationTitle: 'Personalization',
      personalizationDesc: 'Customize the accent color, card shape, density, and visible sections.',
      accentLabel: 'Accent color',
      accentDesc: 'Choose the color used for highlighted controls and accents.',
      accentGold: 'Gold',
      accentBlue: 'Blue',
      accentGreen: 'Green',
      accentPurple: 'Purple',
      accentRose: 'Rose',
      accentCyan: 'Cyan',
      radiusLabel: 'Card shape',
      radiusDesc: 'Change how rounded the app cards and controls are.',
      radiusSoft: 'Soft',
      radiusRounded: 'Rounded',
      radiusSquare: 'Square',
      densityLabel: 'Interface density',
      densityDesc: 'Control spacing and element size across the app.',
      densityComfortable: 'Comfortable',
      densityCompact: 'Compact',
      densitySpacious: 'Spacious',
      visibleSectionsTitle: 'Visible sections',
      showDashboard: 'Dashboard',
      showToday: 'Today',
      showWeek: 'Week',
      showHomework: 'Homework',
      showExams: 'Exams',
      showLinks: 'Resources',
      showNotes: 'Notes',
      showTimer: 'Timer',
      showStudySystem: 'Study system',
      showProgress: 'Progress',
      showSubjects: 'Subjects',
      studySystems: 'Study systems',
      studyPlanIntro:
        'Choose a study system, follow its steps in order, and check off each step when you finish it.',
      addStudySystem: 'Add system',
      currentStudySystem: 'Current system',
      noStudySystems: 'No study systems yet.',
      noSteps: 'No steps yet.',
      stepsCount: 'steps',
      stepArabic: 'Step in Arabic',
      stepEnglish: 'Step in English',
      removeStep: 'Delete step',
      addStep: 'Add step',
      saveStudySystem: 'Save system',
      resetStudySystem: 'Reset steps',
      systemDeleted: 'Study system deleted.',
      cannotDeleteDefault: 'Built-in study systems cannot be deleted.',
      studySystemDialogTitle: 'Add study system',
      studyStepsEditorHeading: 'System steps',
      studyTitleArabic: 'System name in Arabic',
      studyTitleEnglish: 'System name in English',
      studyDescArabic: 'Description in Arabic',
      studyDescEnglish: 'Description in English',
      studyTitleArabicPh: 'e.g. الاسترجاع النشط',
      studyTitleEnglishPh: 'e.g. Active Recall',
      studyDescArabicPh: 'Short description in Arabic',
      studyDescEnglishPh: 'Short description',
      streak: 'Streak',
      dayStreak: 'day streak',
      streakSafe: 'On fire 🔥',
      streakRisk: 'Study today to keep it going',
      longestStreak: 'Longest streak',
      streakAtRisk: 'At risk',
      focusSettingsTitle: 'Focus Mode',
      focusSettingsDesc:
        'Hide in-app navigation and keep your timer and current study step front and center.',
      focusAutoLabel: 'Enter Focus Mode automatically when a study session starts',
      focusStepsLabel: 'Show study-system steps during Focus Mode',
      openFocus: 'Enter Focus Mode',
      focusMode: 'Focus Mode',
      exitFocus: 'Exit Focus',
      focusReady: 'Ready when you are',
      focusRunning: 'Stay in your session',
      focusPaused: 'Timer paused',
      focusShortcut: 'Ctrl + Shift + F · Esc to exit',
      focusPrev: 'Previous',
      focusNext: 'Next',
      focusStage: 'Stage',
      focusSelected: 'Selected stage',
      focusArabic: 'Arabic',
      focusEnglish: 'English',
      todayEnglish: 'Today',
      homeworkEnglish: 'Homework',
      dueEnglish: 'Due',
      overdueEnglish: 'Overdue',
      todayDueEnglish: 'Today',
      tomorrowEnglish: 'Tomorrow',
      laterEnglish: 'Later',
      doneEnglish: 'Done',
      emptyTodayEnglish: 'No events scheduled yet.',
      emptyHomeworkEnglish: 'No homework due soon.',
      emptyAllHomeworkEnglish: 'No homework added yet.',
      studySubject: 'Subject',
      studySubjectHint: 'Choose the subject you are studying so the time is counted in its stats.',
      noStudySubject: 'No subject',
      subjectStudyTitle: 'Study time by subject',
      subjectStudySub: "See where your study time is going this week, plus each subject's total time.",
      subjectStudyEmpty: 'No subject-based study sessions yet.',
      sessionsLabel: 'sessions',
      lastStudied: 'Last studied',
      thisWeek: 'This week',
      totalTime: 'Total',
      uncategorized: 'Uncategorized',
    },
  };
  function tr(key) {
    return UI[lang][key] || key;
  }
  function L(ar, en) {
    return lang === 'en' ? en : ar;
  }
  function baseTitle() {
    return L('الكشكول — دروسي وواجباتي وجدول الأسبوع', 'Kashkool — Lessons, Homework and Weekly Schedule');
  }
  function setText(selector, key) {
    var el = document.querySelector(selector);
    if (el) el.textContent = tr(key);
  }
  function setFirstText(selector, key) {
    var el = document.querySelector(selector);
    if (el && el.firstChild) el.firstChild.nodeValue = tr(key) + ' ';
  }
  function setPlaceholder(selector, key) {
    var el = document.querySelector(selector);
    if (el) el.placeholder = tr(key);
  }
  function applyLanguage() {
    DAYS = lang === 'en' ? DAYS_EN : DAYS_AR;
    MONTHS = lang === 'en' ? MONTHS_EN : MONTHS_AR;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.title =
      lang === 'en'
        ? 'Kashkool — Lessons, Homework and Weekly Schedule'
        : 'الكشكول — دروسي وواجباتي وجدول الأسبوع';
    $('langBtn').textContent = lang === 'en' ? 'العربية' : 'English';
    document.querySelectorAll('.dlgClose').forEach(function (btn) {
      btn.setAttribute('aria-label', tr('close'));
    });
    var brand = document.querySelector('.brand');
    if (brand && brand.firstChild) brand.firstChild.nodeValue = tr('title');
    var small = document.querySelector('.brand small');
    if (small) small.textContent = tr('subtitle');
    var explicitMode = document.documentElement.getAttribute('data-theme');
    var currentlyDark =
      explicitMode === 'dark' ||
      (!explicitMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setText('#themeBtn', currentlyDark ? 'light' : 'dark');
    $('searchBtn').setAttribute('aria-label', tr('search'));
    document.querySelector('.tabs').setAttribute('aria-label', tr('sections'));
    document.querySelector('[data-view="dashboard"]').textContent = tr('dashboard');
    document.querySelector('[data-view="today"]').textContent = tr('today');
    document.querySelector('[data-view="week"]').textContent = tr('week');
    var hwTab = document.querySelector('[data-view="hw"]');
    if (hwTab && hwTab.firstChild) hwTab.firstChild.nodeValue = tr('homework') + ' ';
    document.querySelector('[data-view="exams"]').textContent = tr('exams');
    document.querySelector('[data-view="links"]').textContent = tr('links');
    document.querySelector('[data-view="notes"]').textContent = tr('notes');
    var trkTab = document.querySelector('[data-view="track"]');
    if (trkTab) trkTab.textContent = lang === 'en' ? 'Track' : 'المسار';
    try {
      if (activeView === 'track') renderTrack();
    } catch (e) {}
    document.querySelector('[data-view="pomo"]').textContent = tr('timer');
    document.querySelector('[data-view="studyplan"]').textContent = tr('studySystem');
    document.querySelector('[data-view="stats"]').textContent = tr('stats');
    document.querySelector('[data-view="subjects"]').textContent = tr('subjects');
    var themeStudioTab = document.querySelector('[data-view="themeStudio"]');
    if (themeStudioTab) themeStudioTab.textContent = lang === 'en' ? '🎨 Theme Studio' : '🎨 استوديو الثيمات';
    document.querySelector('[data-view="settings"]').textContent = lang === 'en' ? 'Settings' : 'الإعدادات';
    var storeTab = document.querySelector('[data-view="store"]');
    if (storeTab) storeTab.textContent = lang === 'en' ? 'Store' : 'المتجر';
    if ($('moreNavBtn')) {
      var ml = $('moreNavBtn').querySelector('.navMore__label');
      if (ml) ml.textContent = lang === 'en' ? 'More' : 'المزيد';
    }
    document.querySelectorAll('[data-nav-group]').forEach(function (el) {
      var group = el.getAttribute('data-nav-group');
      var labels = {
        planner: lang === 'en' ? 'PLANNER' : 'التخطيط',
        library: lang === 'en' ? 'LIBRARY' : 'المكتبة',
        personalize: lang === 'en' ? 'PERSONALIZE' : 'التخصيص',
      };
      var ariaLabels = {
        planner: lang === 'en' ? 'Planner' : 'التخطيط',
        library: lang === 'en' ? 'Library' : 'المكتبة',
        personalize: lang === 'en' ? 'Personalization' : 'التخصيص',
      };
      if (labels[group]) el.textContent = labels[group];
      if (el.parentElement && ariaLabels[group])
        el.parentElement.setAttribute('aria-label', ariaLabels[group]);
    });
    if ($('moreNavMenu'))
      $('moreNavMenu').setAttribute('aria-label', lang === 'en' ? 'More sections' : 'أقسام إضافية');
    if ($('dashboardHeading')) $('dashboardHeading').textContent = tr('dashboard');
    if ($('dashboardHint'))
      $('dashboardHint').textContent =
        lang === 'en' ? 'Your study day at a glance.' : 'كل اللي يهمك في يوم مذاكرتك في مكان واحد.';
    if ($('dashboardStartBtn'))
      $('dashboardStartBtn').textContent = lang === 'en' ? 'Start a study session' : 'ابدأ جلسة مذاكرة';
    if ($('dashStreakLabel')) $('dashStreakLabel').textContent = tr('streak');
    if ($('dashStudyLabel'))
      $('dashStudyLabel').textContent = lang === 'en' ? 'Study today' : 'مذاكرة النهاردة';
    if ($('dashSessionsLabel'))
      $('dashSessionsLabel').textContent = lang === 'en' ? 'Sessions today' : 'جلسات النهاردة';
    if ($('dashHwLabel'))
      $('dashHwLabel').textContent = lang === 'en' ? 'Open homework' : 'الواجبات المفتوحة';
    if ($('dashStudyMeta'))
      $('dashStudyMeta').textContent = lang === 'en' ? 'Completed focus time' : 'وقت التركيز المكتمل';
    if ($('dashSessionsMeta'))
      $('dashSessionsMeta').textContent = lang === 'en' ? 'Completed sessions' : 'جلسات مكتملة';
    if ($('dashScheduleTitle')) $('dashScheduleTitle').textContent = lang === 'en' ? 'Today' : 'النهاردة';
    if ($('dashExamTitle')) $('dashExamTitle').textContent = lang === 'en' ? 'Next exam' : 'أقرب امتحان';
    if ($('dashSystemTitle'))
      $('dashSystemTitle').textContent = lang === 'en' ? 'Study system' : 'نظام المذاكرة';
    if ($('dashHomeworkTitle')) $('dashHomeworkTitle').textContent = lang === 'en' ? 'Homework' : 'الواجبات';
    if ($('dashWeekTitle'))
      $('dashWeekTitle').textContent = lang === 'en' ? 'Study this week' : 'مذاكرة الأسبوع';
    if ($('dashWeekHint'))
      $('dashWeekHint').textContent = lang === 'en' ? 'Minutes completed each day' : 'دقائق المذاكرة كل يوم';
    if ($('dashScheduleBtn')) $('dashScheduleBtn').textContent = lang === 'en' ? 'Open' : 'فتح';
    if ($('dashExamBtn')) $('dashExamBtn').textContent = lang === 'en' ? 'View exams' : 'شوف الامتحانات';
    if ($('dashSystemBtn')) $('dashSystemBtn').textContent = lang === 'en' ? 'Open' : 'فتح';
    if ($('dashHomeworkBtn'))
      $('dashHomeworkBtn').textContent = lang === 'en' ? 'View homework' : 'شوف الواجبات';
    if ($('dashActionTimer')) $('dashActionTimer').textContent = lang === 'en' ? 'Timer' : 'المؤقّت';
    if ($('dashActionHomework')) $('dashActionHomework').textContent = tr('addHomework');
    if ($('dashActionSystem')) $('dashActionSystem').textContent = tr('studySystem');
    if ($('dashActionProgress')) $('dashActionProgress').textContent = tr('stats');
    if ($('settingsHeading')) $('settingsHeading').textContent = tr('settings');
    if ($('settingsHint')) $('settingsHint').textContent = tr('settingsHint');
    var settingsLang = $('settingsLangBtn');
    if (settingsLang) settingsLang.textContent = lang === 'en' ? 'العربية' : 'English';
    setText('#view-today h3', 'todaySchedule');
    setFirstText('#view-week h3', 'weekSchedule');
    setText('#view-hw h3', 'homework');
    setText('#view-exams h3', 'exams');
    setFirstText('#view-links h3', 'links');
    setFirstText('#view-notes h3', 'notes');
    setText('#view-pomo h3', 'studyTimer');
    applyStudyPlanLanguage();
    var statsText =
      lang === 'en'
        ? {
            heading: 'Progress overview',
            hint: 'Your week at a glance',
            heroEyebrow: 'This week',
            heroCopy: 'Study time completed',
            min: 'Study minutes this week',
            sessions: 'Completed sessions',
            rate: 'Homework completion',
            activeDays: 'Study days',
            summary: 'Weekly consistency',
            active: 'active days',
            avg: 'Average per day',
            best: 'Best day',
            streak: 'Current streak',
            longestStreak: 'Longest streak',
            days: 'days',
            minUnit: 'min',
            goal: 'Weekly goal',
            setGoal: 'Set goal',
            study: 'Study time through the week',
            studySub: 'Completed focus sessions',
            hw: 'Homework progress',
            done: 'Completed',
            open: 'Remaining',
            subject: 'Workload by subject',
            subjectSub: 'Open homework and weekly lessons',
            completed: 'completed',
            subjectStudy: 'Study time by subject',
            subjectStudySub: 'See where your study time is going this week.',
            insightLabel: 'This week',
            bestDay2: 'Best day',
            studyDays2: 'Study days',
            last7: 'Days of the week',
            dailyStudy: 'Daily study time',
            remaining: 'Remaining',
            dailyPace: 'Daily pace',
            activeDaysSub: 'Active days this week',
          }
        : {
            heading: 'نظرة على التقدم',
            hint: 'ملخص أسبوعك في نظرة واحدة',
            heroEyebrow: 'هذا الأسبوع',
            heroCopy: 'وقت المذاكرة المكتمل',
            min: 'دقائق المذاكرة هذا الأسبوع',
            sessions: 'جلسات مكتملة',
            rate: 'إنجاز الواجبات',
            activeDays: 'أيام المذاكرة',
            summary: 'ثبات المذاكرة خلال الأسبوع',
            active: 'أيام نشطة',
            avg: 'متوسط اليوم',
            best: 'أفضل يوم',
            streak: 'الاستمرار الحالي',
            longestStreak: 'أطول استريك',
            days: 'يوم',
            minUnit: 'دقيقة',
            goal: 'هدف الأسبوع',
            setGoal: 'تحديد الهدف',
            study: 'وقت المذاكرة خلال الأسبوع',
            studySub: 'جلسات التركيز المكتملة',
            hw: 'تقدم الواجبات',
            done: 'مكتمل',
            open: 'متبقي',
            subject: 'الحِمل حسب المادة',
            subjectSub: 'الواجبات المفتوحة وحصص الأسبوع',
            completed: 'مكتمل',
            subjectStudy: 'وقت المذاكرة حسب المادة',
            subjectStudySub: 'شوف وقت مذاكرتك رايح فين خلال الأسبوع.',
            insightLabel: 'هذا الأسبوع',
            bestDay2: 'أفضل يوم',
            studyDays2: 'أيام المذاكرة',
            last7: 'أيام الأسبوع',
            dailyStudy: 'وقت المذاكرة اليومي',
            remaining: 'متبقي',
            dailyPace: 'الوتيرة اليومية',
            activeDaysSub: 'أيام المذاكرة هذا الأسبوع',
          };
    if ($('statsHint')) $('statsHint').textContent = statsText.hint;
    if ($('progressHeroEyebrow')) $('progressHeroEyebrow').textContent = statsText.heroEyebrow;
    if ($('progressHeroCopy')) $('progressHeroCopy').textContent = statsText.heroCopy;
    if ($('progressGoalTitle')) $('progressGoalTitle').textContent = statsText.goal;
    if ($('progressGoalEdit')) $('progressGoalEdit').textContent = statsText.setGoal;
    [
      ['statsHeading', 'heading'],
      ['statMinutesLabel', 'min'],
      ['statSessionsLabel', 'sessions'],
      ['statHwRateLabel', 'rate'],
      ['statActiveDaysLabel', 'activeDays'],
      ['progressSummaryTitle', 'summary'],
      ['progressRingLabel', 'active'],
      ['avgDayLabel', 'avg'],
      ['bestDayLabel', 'best'],
      ['streakLabel', 'streak'],
      ['longestStreakLabel', 'longestStreak'],
      ['studyChartTitle', 'study'],
      ['studyChartSub', 'studySub'],
      ['hwChartTitle', 'hw'],
      ['doneLegend', 'done'],
      ['openLegend', 'open'],
      ['subjectChartTitle', 'subject'],
      ['subjectChartSub', 'subjectSub'],
      ['subjectStudyTitle', 'subjectStudy'],
      ['subjectStudySub', 'subjectStudySub'],
    ].forEach(function (pair) {
      if ($(pair[0])) $(pair[0]).textContent = statsText[pair[1]];
    });
    if ($('progressInsightLabel')) $('progressInsightLabel').textContent = statsText.insightLabel;
    if ($('progressBestDayLabel2')) $('progressBestDayLabel2').textContent = statsText.bestDay2;
    if ($('progressFocusDaysLabel')) $('progressFocusDaysLabel').textContent = statsText.studyDays2;
    if ($('progressWeekStripTitle')) $('progressWeekStripTitle').textContent = statsText.last7;
    if ($('progressWeekStripHint')) $('progressWeekStripHint').textContent = statsText.dailyStudy;
    if ($('progressGoalRemaining')) $('progressGoalRemaining').dataset.label = statsText.remaining;
    if ($('progressGoalPace')) $('progressGoalPace').dataset.label = statsText.dailyPace;

    setFirstText('#view-subjects h3', 'subjects');
    document.querySelectorAll('[data-add="entry"]').forEach(function (el) {
      el.textContent = tr('addEntry');
    });
    document.querySelectorAll('[data-add="hw"]').forEach(function (el) {
      el.textContent = tr('addHomework');
    });
    document.querySelectorAll('[data-add="exam"]').forEach(function (el) {
      el.textContent = tr('addExam');
    });
    document.querySelectorAll('[data-add="link"]').forEach(function (el) {
      el.textContent = tr('addLink');
    });
    document.querySelectorAll('[data-add="note"]').forEach(function (el) {
      el.textContent = tr('addNote');
    });
    document.querySelectorAll('[data-add="subject"]').forEach(function (el) {
      el.textContent = tr('addSubject');
    });
    setText('#view-links .hint', 'linksHint');
    setText('#view-notes .hint', 'notesHint');
    setText('#view-subjects .hint', 'subjectHint');
    if ($('pomoMode'))
      $('pomoMode').textContent = typeof pomo !== 'undefined' && pomo ? pomoLabel(pomo.mode) : tr('study');
    if ($('pomoRound') && typeof pomo !== 'undefined' && pomo) {
      $('pomoRound').textContent =
        lang === 'en'
          ? 'Round ' + pomo.round + ' of ' + pomoSettings.rounds
          : 'الجولة ' + pomo.round + ' من ' + pomoSettings.rounds;
    }
    setText('#pomoToggle', pomo && pomo.running ? 'pause' : 'start');
    if ($('pomoToggle')) $('pomoToggle').setAttribute('data-running', pomo && pomo.running ? '1' : '0');
    setText('#pomoSkip', 'skip');
    setText('#pomoReset', 'reset');
    setText('#pomoFocusBtn', 'focusMode');
    if (focusModeActive) syncFocusUI();
    document.querySelector('.pomo__settings summary').textContent = tr('timerSettings');
    setText('#p_apply', 'apply');
    setText('label[for="p_work"]', 'studyMinutes');
    setText('label[for="p_break"]', 'shortBreak');
    setText('label[for="p_long"]', 'longBreak');
    setText('label[for="p_rounds"]', 'rounds');
    setText('#examTitle', editing.exam ? 'editExam' : 'newExam');
    setText('label[for="x_title"]', 'examName');
    setText('label[for="x_subject"]', 'subject');
    setText('label[for="x_date"]', 'date');
    setText('label[for="x_time"]', 'optionalTime');
    setText('label[for="x_place"]', 'place');
    setText('label[for="x_note"]', 'note');
    setText('#x_save', 'save');
    setText('#x_del', 'remove');
    setText('#entryTitle', editing.entry ? 'edit' : 'newEntry');
    setText('label[for="e_title"]', 'title');
    setText('label[for="e_subject"]', 'subject');
    setFirstText('#e_dayLbl', 'days');
    setText('#e_dayHint', 'dayHint');
    var noTimeLabel = document.querySelector('#e_notime');
    if (noTimeLabel && noTimeLabel.parentElement)
      noTimeLabel.parentElement.lastChild.nodeValue = ' ' + tr('noTime');
    setText('label[for="e_from"]', 'from');
    setText('label[for="e_to"]', 'to');
    setText('label[for="e_place"]', 'place');
    setText('label[for="e_link"]', 'link');
    setText('label[for="e_note"]', 'note');
    setText('#e_save', 'save');
    setText('#e_del', 'remove');
    setText('#hwTitle', editing.hw ? 'editHomework' : 'newHomework');
    setText('label[for="h_title"]', 'homeworkName');
    setText('label[for="h_subject"]', 'subject');
    setText('label[for="h_due"]', 'due');
    setText('label[for="h_link"]', 'link');
    setText('label[for="h_note"]', 'details');
    setText('#h_save', 'save');
    setText('#h_del', 'remove');
    setText('#linkTitle', editing.link ? 'editLink' : 'newLink');
    setText('label[for="l_title"]', 'title');
    setText('label[for="l_url"]', 'url');
    setText('label[for="l_subject"]', 'subject');
    setText('label[for="l_note"]', 'note');
    setText('#l_save', 'save');
    setText('#l_del', 'remove');
    setText('#noteTitle', editing.note ? 'editNote' : 'newNote');
    setText('label[for="n_title"]', 'title');
    setText('label[for="n_subject"]', 'subject');
    setText('label[for="n_body"]', 'noteBody');
    setText('#n_save', 'save');
    setText('#n_del', 'remove');
    setText('#subTitle', editing.sub ? 'edit' : 'newSubject');
    setText('label[for="s_name"]', 'subjectName');
    setText('#dlgSub label:not([for])', 'color');
    setText('label[for="s_teacher"]', 'teacher');
    setText('#s_save', 'save');
    setText('#s_del', 'remove');
    setPlaceholder('#sq', 'searchPlaceholder');
    var searchClear = $('searchClear');
    if (searchClear) {
      searchClear.setAttribute('aria-label', tr('clear'));
      searchClear.title = tr('clear');
      searchClear.hidden = !$('sq').value.trim();
    }
    setText('#dlgSearch .dlg__head h3', 'search');
    setText('#dlgSearch .dlg__foot [data-close]', 'close');
    setText('#formExam .dlg__foot [data-close]', 'cancel');
    setText('#formEntry .dlg__foot [data-close]', 'cancel');
    setText('#formHw .dlg__foot [data-close]', 'cancel');
    setText('#formLink .dlg__foot [data-close]', 'cancel');
    setText('#formNote .dlg__foot [data-close]', 'cancel');
    setText('#formSub .dlg__foot [data-close]', 'cancel');
    setText('#studySystemDialogTitle', 'studySystemDialogTitle');
    setText('#ss_title_ar_label', 'studyTitleArabic');
    setText('#ss_title_en_label', 'studyTitleEnglish');
    setText('#ss_desc_ar_label', 'studyDescArabic');
    setText('#ss_desc_en_label', 'studyDescEnglish');
    setText('#studyStepsEditorHeading', 'studyStepsEditorHeading');
    setText('#studyAddStep', 'addStep');
    setText('#ss_save', 'saveStudySystem');
    setText('#ss_cancel', 'cancel');
    setPlaceholder('#ss_title_ar', 'studyTitleArabicPh');
    setPlaceholder('#ss_title_en', 'studyTitleEnglishPh');
    setPlaceholder('#ss_desc_ar', 'studyDescArabicPh');
    setPlaceholder('#ss_desc_en', 'studyDescEnglishPh');
    var placeholders =
      lang === 'en'
        ? {
            '#x_title': 'e.g. Midterm exam — Math',
            '#x_place': 'Room, committee…',
            '#x_note': 'Syllabus, things to bring…',
            '#e_title': 'e.g. Math class, tutoring, doctor appointment',
            '#e_place': 'Classroom, center, online…',
            '#e_note': 'Anything to remember',
            '#h_title': 'e.g. Solve exercises on page 42',
            '#h_note': 'What exactly is required',
            '#l_title': 'e.g. Chapter two explanation — channel name',
            '#n_title': 'e.g. Lesson summary, project ideas…',
            '#n_body': 'Write what you want to remember…',
            '#s_name': 'Arabic, Math, Physics…',
            '#s_teacher': 'Teacher name (optional)',
          }
        : {
            '#x_title': 'مثلاً: امتحان نصف الترم — رياضة',
            '#x_place': 'القاعة، اللجنة…',
            '#x_note': 'المنهج، حاجات تاخدها معاك…',
            '#e_title': 'مثلاً: حصة رياضة، درس خصوصي، ميعاد دكتور',
            '#e_place': 'فصل، سنتر، أونلاين…',
            '#e_note': 'أي حاجة تفتكرها',
            '#h_title': 'مثلاً: حل تمارين صفحة 42',
            '#h_note': 'المطلوب بالظبط',
            '#l_title': 'مثلاً: شرح الفصل التاني — قناة فلان',
            '#n_title': 'مثلاً: ملخص الدرس، أفكار للمشروع…',
            '#n_body': 'اكتب اللي عايز تفتكره…',
            '#s_name': 'عربي، رياضة، فيزياء…',
            '#s_teacher': 'اسم المدرس (اختياري)',
          };
    Object.keys(placeholders).forEach(function (selector) {
      var el = document.querySelector(selector);
      if (el) el.placeholder = placeholders[selector];
    });
    var linkPick = document.querySelector('#e_linkpick');
    if (linkPick) {
      linkPick.setAttribute('aria-label', tr('chooseSavedLink'));
      if (linkPick.options[0]) linkPick.options[0].textContent = tr('chooseSavedLink');
    }
    applySettingsLanguage();
    applyTimerLanguage();
    renderPomoSubjectOptions();
    if (lastNoticeMsg) notice(lastNoticeMsg);
    if (typeof pomo !== 'undefined' && pomo) syncPomoUI();
  }

  var appSettings = {
    theme: 'system',
    fontSize: 'normal',
    compact: false,
    reduceMotion: (function () {
      try {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      } catch (e) {
        return false;
      }
    })(),
    motionProfile: 'auto',
    defaultView: 'today',
    confirmDelete: true,
    focusAuto: false,
    focusShowSteps: true,
    accent: 'gold',
    radius: 'soft',
    density: 'comfortable',
    visibleSections: {
      dashboard: true,
      today: true,
      week: true,
      hw: true,
      exams: true,
      links: true,
      notes: true,
      flashcards: true,
      pomo: true,
      studyplan: true,
      stats: true,
      subjects: true,
    },
  };
  function normalizeAppSettings() {
    if (!appSettings.visibleSections || typeof appSettings.visibleSections !== 'object')
      appSettings.visibleSections = {};
    Object.keys(VISIBLE_SECTION_KEYS).forEach(function (v) {
      if (appSettings.visibleSections[v] === undefined) appSettings.visibleSections[v] = true;
    });
    if (!appSettings.accent) appSettings.accent = 'gold';
    if (!appSettings.radius) appSettings.radius = 'soft';
    if (!appSettings.density) appSettings.density = appSettings.compact ? 'compact' : 'comfortable';
    if (appSettings.focusAuto === undefined) appSettings.focusAuto = false;
    if (appSettings.focusShowSteps === undefined) appSettings.focusShowSteps = true;
    if (['auto', 'rich', 'performance', 'ultra'].indexOf(appSettings.motionProfile) < 0)
      appSettings.motionProfile = 'auto';
  }
  function detectLowPowerDevice() {
    var nav = window.navigator || {},
      conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    return (
      (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 8) ||
      !!conn.saveData
    );
  }
  function applyMotionProfile(choice) {
    choice = ['auto', 'rich', 'performance', 'ultra'].indexOf(choice) >= 0 ? choice : 'auto';
    var effective = choice === 'auto' ? (detectLowPowerDevice() ? 'performance' : 'rich') : choice;
    var body = document.body,
      root = document.documentElement;
    root.setAttribute('data-motion-choice', choice);
    root.setAttribute('data-motion-profile', effective);
    body.classList.toggle('motion-rich', effective === 'rich');
    body.classList.toggle('motion-performance', effective === 'performance');
    body.classList.toggle('motion-ultra', effective === 'ultra');
  }
  function loadAppSettings() {
    try {
      var x = JSON.parse(localStorage.getItem(scopedKey(LS_SETTINGS)) || 'null');
      if (x) appSettings = Object.assign(appSettings, x);
    } catch (e) {}
    normalizeAppSettings();
    applyAppSettings();
  }
  function saveAppSettings() {
    try {
      localStorage.setItem(scopedKey(LS_SETTINGS), JSON.stringify(appSettings));
    } catch (e) {}
  }
  function applyThemeSetting(value) {
    appSettings.theme = value;
    if (isDefaultStoreTheme()) {
      if (value === 'dark' || value === 'light') document.documentElement.setAttribute('data-theme', value);
      else document.documentElement.removeAttribute('data-theme');
    }
    applyTheme(value === 'system' ? null : value);
  }
  function applyAppSettings() {
    var density = appSettings.density || (appSettings.compact ? 'compact' : 'comfortable');
    document.body.classList.toggle('compact-mode', density === 'compact');
    document.body.classList.toggle('spacious-mode', density === 'spacious');
    document.body.classList.toggle('reduce-motion', !!appSettings.reduceMotion);
    applyMotionProfile(appSettings.motionProfile || 'auto');
    document.documentElement.style.setProperty(
      '--ui-font-scale',
      appSettings.fontSize === 'small'
        ? '.92'
        : appSettings.fontSize === 'large'
          ? '1.08'
          : appSettings.fontSize === 'xlarge'
            ? '1.18'
            : '1',
    );
    var accentMap = {
      gold: ['#D9A428', '#F7ECC8'],
      blue: ['#3F73B8', '#E5EFFB'],
      green: ['#2F7D5C', '#E5F3EC'],
      purple: ['#7A5AA6', '#EFE8F8'],
      rose: ['#B45574', '#F8E8EE'],
      cyan: ['#147F8C', '#E4F4F6'],
    };
    var accent = accentMap[appSettings.accent] || accentMap.gold;
    document.documentElement.style.setProperty('--mark', accent[0]);
    document.documentElement.style.setProperty('--mark-bg', accent[1]);
    var radiusMap = {
      soft: ['8px', '12px', '16px'],
      rounded: ['14px', '18px', '24px'],
      square: ['4px', '6px', '8px'],
    };
    var radius = radiusMap[appSettings.radius] || radiusMap.soft;
    document.documentElement.style.setProperty('--radius-sm', radius[0]);
    document.documentElement.style.setProperty('--radius-md', radius[1]);
    document.documentElement.style.setProperty('--radius-lg', radius[2]);
    var visible = appSettings.visibleSections || {};
    document.querySelectorAll('.tab[data-view]').forEach(function (tab) {
      if (tab.dataset.view === 'settings') return;
      var show = visible[tab.dataset.view] !== false;
      tab.hidden = !show;
    });
    applyTheme(appSettings.theme === 'system' ? null : appSettings.theme);
  }
  function localizeSettingsOptions() {
    var theme = $('themeSetting');
    if (theme) {
      theme.options[0].textContent = tr('themeSystem');
      theme.options[1].textContent = tr('themeLight');
      theme.options[2].textContent = tr('themeDark');
    }
    var fs = $('fontSizeSetting');
    if (fs) {
      fs.options[0].textContent = tr('fontSmall');
      fs.options[1].textContent = tr('fontNormal');
      fs.options[2].textContent = tr('fontLarge');
      fs.options[3].textContent = tr('fontXLarge');
    }
    var accent = $('accentSetting');
    if (accent) {
      accent.options[0].textContent = tr('accentGold');
      accent.options[1].textContent = tr('accentBlue');
      accent.options[2].textContent = tr('accentGreen');
      accent.options[3].textContent = tr('accentPurple');
      accent.options[4].textContent = tr('accentRose');
      accent.options[5].textContent = tr('accentCyan');
    }
    var radius = $('radiusSetting');
    if (radius) {
      radius.options[0].textContent = tr('radiusSoft');
      radius.options[1].textContent = tr('radiusRounded');
      radius.options[2].textContent = tr('radiusSquare');
    }
    var density = $('densitySetting');
    if (density) {
      density.options[0].textContent = tr('densityComfortable');
      density.options[1].textContent = tr('densityCompact');
      density.options[2].textContent = tr('densitySpacious');
    }
    var views = [
      ['dashboard', 'dashboard'],
      ['today', 'today'],
      ['week', 'week'],
      ['hw', 'homework'],
      ['flashcards', 'showFlashcards'],
      ['pomo', 'timer'],
      ['studyplan', 'studySystem'],
      ['stats', 'stats'],
      ['subjects', 'subjects'],
      ['settings', 'settings'],
    ];
    var vs = $('defaultViewSetting');
    if (vs)
      views.forEach(function (pair) {
        var opt = vs.querySelector('option[value="' + pair[0] + '"]');
        if (opt) opt.textContent = tr(pair[1]);
      });
    var lb = $('dataStatus');
    if (lb && !lb.textContent.trim()) lb.textContent = tr('dataReady');
    renderVisibleSections();
  }
  var VISIBLE_SECTION_KEYS = {
    dashboard: 'showDashboard',
    today: 'showToday',
    week: 'showWeek',
    hw: 'showHomework',
    exams: 'showExams',
    links: 'showLinks',
    notes: 'showNotes',
    flashcards: 'showFlashcards',
    pomo: 'showTimer',
    studyplan: 'showStudySystem',
    stats: 'showProgress',
    subjects: 'showSubjects',
  };
  function renderVisibleSections() {
    var host = $('visibleSectionsGrid');
    if (!host) return;
    var visible = appSettings.visibleSections || {};
    host.innerHTML = Object.keys(VISIBLE_SECTION_KEYS)
      .map(function (view) {
        return (
          '<label class="visibleSectionItem"><input type="checkbox" data-visible-section="' +
          view +
          '" ' +
          (visible[view] !== false ? 'checked' : '') +
          '><span>' +
          esc(tr(VISIBLE_SECTION_KEYS[view])) +
          '</span></label>'
        );
      })
      .join('');
  }
  function syncSettingsUI() {
    if ($('themeSetting')) $('themeSetting').value = appSettings.theme || 'system';
    if ($('fontSizeSetting')) $('fontSizeSetting').value = appSettings.fontSize || 'normal';
    if ($('compactSetting'))
      $('compactSetting').checked =
        (appSettings.density || (appSettings.compact ? 'compact' : 'comfortable')) === 'compact';
    if ($('reduceMotionSetting')) $('reduceMotionSetting').checked = !!appSettings.reduceMotion;
    if ($('motionProfileSetting')) $('motionProfileSetting').value = appSettings.motionProfile || 'auto';
    if ($('accentSetting')) $('accentSetting').value = appSettings.accent || 'gold';
    if ($('radiusSetting')) $('radiusSetting').value = appSettings.radius || 'soft';
    if ($('densitySetting'))
      $('densitySetting').value = appSettings.density || (appSettings.compact ? 'compact' : 'comfortable');
    if ($('defaultViewSetting')) $('defaultViewSetting').value = appSettings.defaultView || 'today';
    if ($('confirmDeleteSetting')) $('confirmDeleteSetting').checked = appSettings.confirmDelete !== false;
    if ($('focusAutoSetting')) $('focusAutoSetting').checked = appSettings.focusAuto === true;
    if ($('focusStepsSetting')) $('focusStepsSetting').checked = appSettings.focusShowSteps !== false;
    if (typeof pomoSettings !== 'undefined' && pomoSettings) {
      if ($('settingsWork')) $('settingsWork').value = pomoSettings.work;
      if ($('settingsBreak')) $('settingsBreak').value = pomoSettings.brk;
      if ($('settingsLong')) $('settingsLong').value = pomoSettings.long;
      if ($('settingsRounds')) $('settingsRounds').value = pomoSettings.rounds;
      if ($('settingsAuto')) $('settingsAuto').checked = pomoSettings.auto !== false;
    }
    renderVisibleSections();
    applyAppSettings();
  }
  function currentDefaultView() {
    return appSettings.defaultView || 'today';
  }
  function exportAppData() {
    var payload = {
      version: 3,
      exportedAt: new Date().toISOString(),
      account: activeAccount(),
      accountId: activeAccountId,
      data: state,
      studySystems: studySystems,
      prefs: appSettings,
      pomo: typeof pomoSettings !== 'undefined' ? pomoSettings : null,
      studyStats: typeof loadStudyStats !== 'undefined' ? loadStudyStats() : [],
      store: typeof storeState !== 'undefined' ? storeState : null,
      pomoSubject: typeof pomo !== 'undefined' && pomo ? pomo.subjectId || '' : '',
      flashcards: (function () {
        try {
          return JSON.parse(localStorage.getItem('kashkool.flashcards.v1.' + activeAccountId) || '[]');
        } catch (e) {
          return [];
        }
      })(),
      track: (function () {
        try {
          trkLoad();
          return JSON.parse(JSON.stringify(TRK));
        } catch (e) {
          return null;
        }
      })(),
      learningOS: (function () {
        try {
          return JSON.parse(localStorage.getItem('kashkool.learningos.v1.' + activeAccountId) || 'null');
        } catch (e) {
          return null;
        }
      })(),
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'kashkool-backup-' + ymd(new Date()) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
    toast(tr('dataExported'));
  }
  function importAppData(obj) {
    if (!obj || !obj.data || typeof obj.data !== 'object') throw new Error('bad');
    ['subjects', 'entries', 'homework', 'links', 'notes', 'exams'].forEach(function (k) {
      state[k] = Array.isArray(obj.data[k]) ? obj.data[k] : [];
    });
    saveLocal();
    if (obj.studySystems && Array.isArray(obj.studySystems)) {
      studySystems = obj.studySystems;
      saveStudySystems();
    }
    if (obj.prefs && typeof obj.prefs === 'object') {
      appSettings = Object.assign(appSettings, obj.prefs);
      saveAppSettings();
    }
    if (obj.pomo && typeof obj.pomo === 'object') {
      pomoSettings = Object.assign(pomoSettings, obj.pomo);
      try {
        localStorage.setItem(scopedKey(LS_POMO), JSON.stringify(pomoSettings));
      } catch (e) {}
      fillPomoSettingsForm();
    }
    if (Array.isArray(obj.studyStats)) {
      try {
        localStorage.setItem(scopedKey(LS_STATS), JSON.stringify(obj.studyStats));
      } catch (e) {}
    }
    if (Array.isArray(obj.flashcards)) {
      try {
        localStorage.setItem(
          'kashkool.flashcards.v1.' + activeAccountId,
          JSON.stringify(obj.flashcards.slice(0, 5000)),
        );
      } catch (e) {}
      if (window.KashkoolFlashcardsImport) window.KashkoolFlashcardsImport(obj.flashcards);
    }
    if (obj.store && typeof obj.store === 'object') {
      try {
        storeState = Object.assign(storeState, obj.store);
        saveStoreState();
        applyStoreTheme();
      } catch (e) {}
    }
    if (obj.track && typeof obj.track === 'object') {
      try {
        var importedTrack = Object.assign(
          {
            schemaVersion: 3,
            tracks: [],
            items: [],
            milestones: [],
            tasks: [],
            notes: {},
            win: ['07:00', '22:00'],
          },
          obj.track,
        );
        localStorage.setItem(scopedKey('kashkool.track.v3'), JSON.stringify(importedTrack));
        localStorage.setItem(
          scopedKey('kashkool.track.v2'),
          JSON.stringify({
            tracks: importedTrack.tracks,
            items: importedTrack.items,
            notes: importedTrack.notes,
            win: importedTrack.win,
          }),
        );
      } catch (e) {}
    }
    if (obj.learningOS && typeof obj.learningOS === 'object') {
      try {
        var kkHistory = Array.isArray(obj.learningOS.events) ? obj.learningOS.events.slice(0, 600) : [];
        localStorage.setItem(
          'kashkool.learningos.v1.' + activeAccountId,
          JSON.stringify({ schemaVersion: 1, events: kkHistory }),
        );
      } catch (e) {}
    }
    if (isFinite(+obj.progressGoal)) {
      try {
        saveWeeklyGoal(+obj.progressGoal);
      } catch (e) {}
    }
    if (typeof obj.pomoSubject === 'string') {
      savePomoSubject(obj.pomoSubject);
    } else {
      loadPomoSubject();
    }
    applyAppSettings();
    syncSettingsUI();
    render();
    toast(tr('dataImported'));
  }
  function restoreLatestDeletedItem() {
    var rk = 'kashkool.recycle.v1.' + activeAccountId,
      bin = [];
    try {
      bin = JSON.parse(localStorage.getItem(rk) || '[]');
    } catch (e) {
      bin = [];
    }
    if (!Array.isArray(bin) || !bin.length) {
      toast(lang === 'en' ? 'No recently deleted item was found.' : 'مفيش عنصر محذوف حديثًا للاستعادة.');
      return;
    }
    var entry = bin[0],
      coll = entry.collection,
      item = entry.item;
    if (!item || !Array.isArray(state[coll])) {
      toast(lang === 'en' ? 'This item cannot be restored here.' : 'العنصر ده مش قابل للاستعادة هنا.');
      return;
    }
    var data = Object.assign({}, item);
    delete data.id;
    if (mode === 'db' && db) {
      db.collection(coll)
        .doc(item.id)
        .set(data)
        .then(function () {
          bin.shift();
          localStorage.setItem(rk, JSON.stringify(bin));
          toast(lang === 'en' ? 'Item restored.' : 'تمت استعادة العنصر.');
        })
        .catch(function () {
          toast(lang === 'en' ? 'Restore failed.' : 'فشلت الاستعادة.');
        });
    } else {
      if (
        state[coll].some(function (x) {
          return x.id === item.id;
        })
      ) {
        toast(lang === 'en' ? 'That item already exists.' : 'العنصر موجود بالفعل.');
        return;
      }
      state[coll].push(item);
      saveLocal();
      bin.shift();
      try {
        localStorage.setItem(rk, JSON.stringify(bin));
      } catch (e) {}
      render();
      toast(lang === 'en' ? 'Item restored.' : 'تمت استعادة العنصر.');
    }
  }
  function resetAccountData() {
    if (
      appSettings.confirmDelete !== false &&
      !confirmText(tr('resetConfirm'), 'Clear all data for the current account from this device?')
    )
      return;
    state = { subjects: [], entries: [], homework: [], links: [], notes: [], exams: [] };
    saveLocal();
    try {
      localStorage.removeItem(scopedKey(LS_STUDY_SYSTEMS));
      localStorage.removeItem(scopedKey(LS_STUDY_SYSTEM));
      localStorage.removeItem(scopedKey(LS_STATS));
      localStorage.removeItem(scopedKey(LS_POMO));
      localStorage.removeItem(scopedKey(LS_POMO_STATE));
      localStorage.removeItem(scopedKey(LS_POMO_SUBJECT));
      localStorage.removeItem(scopedKey(LS_PROGRESS_GOAL));
      localStorage.removeItem(scopedKey(STORE_KEY));
    } catch (e) {}
    if (typeof pomo !== 'undefined' && pomo) pomo.subjectId = '';
    studySystems = cloneStudyDefaults();
    activeStudySystemId = studySystems[0] ? studySystems[0].id : '';
    saveStudySystems();
    saveActiveStudySystem();
    toast(tr('dataReset'));
    render();
  }

  function applySettingsLanguage() {
    setText('#settingsHeading', 'settings');
    setText('#settingsHint', 'settingsHint');
    setText('#settingsAccountSection', 'accountSection');
    setText('#settingsAppearanceSection', 'appearanceSection');
    setText('#settingsStudySection', 'studySection');
    setText('#settingsTimerSection', 'timerSection');
    setText('#settingsDataSection', 'dataSection');
    setText('#settingsHelpSection', 'helpSection');
    setText('#accountSettingsTitle', 'accountTitle');
    setText('#accountSettingsDesc', 'accountDesc');
    setText('#manageAccountsBtn', 'manageAccounts');
    setText('#appearanceSettingsTitle', 'appearanceTitle');
    setText('#appearanceSettingsDesc', 'appearanceDesc');
    setText('#themeSettingLabel', 'themeLabel');
    setText('#themeSettingDesc', 'themeDesc');
    setText('#fontSizeSettingLabel', 'fontSizeLabel');
    setText('#fontSizeSettingDesc', 'fontSizeDesc');
    setText('#compactSettingLabel', 'compactLabel');
    setText('#compactSettingDesc', 'compactDesc');
    setText('#motionSettingLabel', 'motionLabel');
    setText('#motionSettingDesc', 'motionDesc');
    setText('#motionProfileLabel', 'motionProfileLabel');
    setText('#motionProfileDesc', 'motionProfileDesc');
    setText('#personalizationSettingsTitle', 'personalizationTitle');
    setText('#personalizationSettingsDesc', 'personalizationDesc');
    setText('#accentSettingLabel', 'accentLabel');
    setText('#accentSettingDesc', 'accentDesc');
    setText('#radiusSettingLabel', 'radiusLabel');
    setText('#radiusSettingDesc', 'radiusDesc');
    setText('#densitySettingLabel', 'densityLabel');
    setText('#densitySettingDesc', 'densityDesc');
    setText('#visibleSectionsHeading', 'visibleSectionsTitle');
    setText('#studySettingsTitle', 'studySettingsTitle');
    setText('#studySettingsDesc', 'studySettingsDesc');
    setText('#defaultViewLabel', 'defaultViewLabel');
    setText('#defaultViewDesc', 'defaultViewDesc');
    setText('#confirmDeleteLabel', 'confirmDeleteLabel');
    setText('#confirmDeleteDesc', 'confirmDeleteDesc');
    setText('#focusSettingsTitle', 'focusSettingsTitle');
    setText('#focusSettingsDesc', 'focusSettingsDesc');
    setText('#focusAutoLabel', 'focusAutoLabel');
    setText('#focusStepsLabel', 'focusStepsLabel');
    setText('#openFocusFromSettings', 'openFocus');
    setText('#timerSettingsCardTitle', 'timerSettingsCardTitle');
    setText('#timerSettingsCardDesc', 'timerSettingsCardDesc');
    setText('#settingWorkLabel', 'settingWorkLabel');
    setText('#settingWorkDesc', 'settingWorkDesc');
    setText('#settingBreakLabel', 'settingBreakLabel');
    setText('#settingBreakDesc', 'settingBreakDesc');
    setText('#settingLongLabel', 'settingLongLabel');
    setText('#settingLongDesc', 'settingLongDesc');
    setText('#settingRoundsLabel', 'settingRoundsLabel');
    setText('#settingRoundsDesc', 'settingRoundsDesc');
    setText('#settingsAutoLabel', 'settingsAutoLabel');
    setText('#saveTimerFromSettings', 'saveTimerSettings');
    setText('#openTimerSettings', 'openTimer');
    setText('#soundSettingsTitle', 'soundTitle');
    setText('#soundSettingsDesc', 'soundDesc');
    setText('#soundToggleLabel', 'soundOn');
    setText('#soundVolumeLabel', 'volume');
    setText('#soundChoiceLabel', 'soundChoice');
    setText('#testSoundBtn', 'testSound');
    setText('#dataSettingsTitle', 'dataTitle');
    setText('#dataSettingsDesc', 'dataDesc');
    setText('#exportDataBtn', 'exportData');
    setText('#importDataBtn', 'importData');
    setText('#resetDataBtn', 'resetData');
    setText('#helpSettingsTitle', 'helpTitle');
    setText('#helpSettingsDesc', 'helpDesc');
    localizeSettingsOptions();
    syncSettingsUI();
    setText('#accountsTitle', 'accountsTitle');
    setText('#newAccountLabel', 'newAccountName');
    setText('#addAccountBtn', 'addAccount');
    setText('#dlgAccounts .dlg__foot [data-close]', 'close');
    setPlaceholder('#newAccountName', 'newAccountPlaceholder');
    var ab = $('accountBtn');
    if (ab) ab.title = tr('accountTitle');
    renderSoundOptions();
    syncSoundUI();
    updateAccountUI();
    if ($('dlgAccounts').open) renderAccounts();
  }
  function applyTimerLanguage() {
    setText('#pomoKeys', 'keysHint');
    setText('#p_autoLabel', 'autoStart');
    renderPomoPresets();
    refreshPomoToday();
  }

  function englishText(text) {
    if (lang !== 'en') return text;
    var lead = String(text || '').match(/^\s*/)[0],
      tail = String(text || '').match(/\s*$/)[0];
    var s = String(text || '').trim();
    var exact = {
      'بيفتح…': 'Loading…',
      'المواد:': 'Subjects:',
      الكل: 'All',
      طول: 'All',
      اليوم: 'day',
      دلوقتي: 'Now',
      الجاي: 'Next',
      'مفيش واجب قريب.': 'No upcoming homework.',
      'ضيف واجب': 'Add homework',
      جدول: 'Schedule',
      واجب: 'Homework',
      امتحان: 'Exam',
      شرح: 'Resource',
      نوتة: 'Note',
      مادة: 'Subject',
      'خلص الجدول': 'Schedule complete',
      'مفيش واجبات متسجلة.': 'No homework yet.',
      'ضيف أول واجب': 'Add your first homework',
      متأخرة: 'Overdue',
      'الأسبوع ده': 'This week',
      بعدين: 'Later',
      خلصت: 'Completed',
      'مفيش امتحانات متسجلة.': 'No exams yet.',
      'ضيف أول امتحان': 'Add your first exam',
      فاتت: 'Past',
      'أقرب امتحان': 'Next exam',
      افتح: 'Open',
      النهاردة: 'Today',
      إمبارح: 'Yesterday',
      'بدون عنوان': 'Untitled',
      'مفيش نوتات للمادة دي.': 'No notes for this subject.',
      'لسه مفيش نوتات. دوّن أول حاجة عايز تفتكرها.':
        'No notes yet. Write down the first thing you want to remember.',
      'ضيف نوتة': 'Add a note',
      'ضيف موادك الأول، وبعدين لوّن بيها الجدول والواجبات.':
        'Add your subjects first, then use their colors for your schedule and homework.',
      'ضيف مادة': 'Add a subject',
      'مش في الجدول': 'Not on the schedule',
      لون: 'Color',
      'من غير ميعاد': 'No due date',
      النهاردة: 'Today',
      بكرة: 'Tomorrow',
      'اتحفظت إعدادات المؤقّت.': 'Timer settings saved.',
      'الحفظ مانفعش. جرّب تاني.': 'Save failed. Please try again.',
      'المسح مانفعش. جرّب تاني.': 'Delete failed. Please try again.',
      'الاتصال بالحفظ اتقطع. افتح الصفحة تاني.': 'The save connection was lost. Reopen the page.',
      'بياناتك القديمة اتنقلت هنا.': 'Your previous data was moved here.',
      'اكتب عنوان أو اختار مادة.': 'Enter a title or choose a subject.',
      'ميعاد النهاية لازم بعد البداية.': 'The end time must be after the start time.',
      'اختار يوم على الأقل.': 'Choose at least one day.',
      'اكتب الواجب الأول.': 'Enter the homework first.',
      'حط الرابط الأول (لازم يبدأ بـ http).': 'Enter a URL starting with http.',
      'اكتب حاجة في النوتة الأول.': 'Write something in the note first.',
      'حدد تاريخ الامتحان الأول.': 'Choose the exam date first.',
      'اكتب اسم المادة.': 'Enter the subject name.',
      'اتحط اللينك.': 'Resource link added.',
      'اكتب عشان تدوّر.': 'Type to search.',
      'مفيش نتايج.': 'No results.',
      'الحفظ دلوقتي على الجهاز ده بس. لو فتحت الصفحة من موبايل تاني مش هتلاقي نفس البيانات.':
        "Data is saved on this device only. If you open the page on another phone, you won't find the same data.",
    };
    if (exact[s]) return lead + exact[s] + tail;
    s = s
      .replace(/اليوم لسه فاضي\./g, 'Today is empty.')
      .replace(/ضيف أول درس أو ميعاد/g, 'Add your first lesson or event')
      .replace(/مفيش شروحات محفوظة للمادة دي\./g, 'No resources saved for this subject.')
      .replace(
        /احفظ هنا شروح اليوتيوب أو أي منصة، وبعدين تقدر تربطها بأي حصة في الجدول\./g,
        'Save YouTube videos or resources here, then link them to any scheduled lesson.',
      )
      .replace(/مفيش نوتات للمادة دي\./g, 'No notes for this subject.')
      .replace(
        /لسه مفيش نوتات\. دوّن أول حاجة عايز تفتكرها\./g,
        'No notes yet. Write down the first thing you want to remember.',
      )
      .replace(/دلوقتي: /g, 'Now: ')
      .replace(/الجاي: /g, 'Next: ')
      .replace(/ — باقي /g, ' — ')
      .replace(/ بعد /g, ' in ')
      .replace(/خلص الجدول/g, 'Schedule complete')
      .replace(/فاضل (\d+)/g, '$1 remaining')
      .replace(/طول اليوم/g, 'All day')
      .replace(/متأخر /g, 'Overdue ')
      .replace(/يومين/g, '2 days')
      .replace(/(\d+) أيام/g, '$1 days')
      .replace(/(\d+) يوم/g, '$1 days')
      .replace(/يوم /g, 'Day ')
      .replace(/أقرب امتحان/g, 'Next exam')
      .replace(/من غير ميعاد/g, 'No due date')
      .replace(/النهاردة/g, 'Today')
      .replace(/بكرة/g, 'Tomorrow')
      .replace(/إمبارح/g, 'Yesterday')
      .replace(/حصة واحدة/g, '1 lesson')
      .replace(/حصتين/g, '2 lessons')
      .replace(/حصص/g, 'lessons')
      .replace(/حصة/g, 'lesson')
      .replace(/واجب تسليمه النهاردة/g, 'homework due today')
      .replace(/واجبين تسليمهم النهاردة/g, '2 homework items due today')
      .replace(/واجبات تسليمهم النهاردة/g, 'homework items due today')
      .replace(/واجب مفتوح/g, 'open homework')
      .replace(/حصة في الأسبوع/g, 'lessons this week')
      .replace(/اتضافت في (\d+) أيام\./g, 'Added on $1 days.')
      .replace(/مفيش واجب قريب\./g, 'No upcoming homework.')
      .replace(/ضيف واجب/g, 'Add homework')
      .replace(/ضيف أول واجب/g, 'Add your first homework')
      .replace(/مفيش امتحانات متسجلة\./g, 'No exams yet.')
      .replace(/ضيف أول امتحان/g, 'Add your first exam')
      .replace(/مفيش واجبات متسجلة\./g, 'No homework yet.')
      .replace(/مفيش شروحات محفوظة للمادة دي\./g, 'No resources saved for this subject.')
      .replace(/اتحفظت إعدادات المؤقّت\./g, 'Timer settings saved.');
    return lead + s + tail;
  }
  function translateRenderedUI() {
    if (lang !== 'en') return;
    var roots = document.querySelectorAll(
      '#notice,#tip,#todaySummary,#pulseText,#todayEntries,#todayHw,#weekFilter,#weekGrid,#hwList,#examHero,#examList,#linksFilter,#linksList,#notesFilter,#notesList,#subList,#searchResults',
    );
    roots.forEach(function (root) {
      (function walk(node) {
        if (node.nodeType === 3) {
          node.nodeValue = englishText(node.nodeValue);
          return;
        }
        Array.prototype.forEach.call(node.childNodes, walk);
      })(root);
    });
    document.querySelectorAll('[aria-label="خلصت"]').forEach(function (el) {
      el.setAttribute('aria-label', 'Completed');
    });
  }

  /* ---------------- study systems ---------------- */
  var LS_STUDY_SYSTEMS = 'kashkool.study.systems.v2';
  var LS_STUDY_SYSTEM = 'kashkool.study.active-system.v2';
  var LS_STUDY_PLAN_OLD = 'kashkool.study.plan.v1';
  var studySystems = [],
    activeStudySystemId = '';

  var DEFAULT_STUDY_SYSTEMS = [
    {
      id: 'active-recall',
      builtin: true,
      titleAr: 'الاسترجاع النشط',
      titleEn: 'Active Recall',
      descAr: 'اختبر نفسك بدل ما تكتفي بإعادة القراءة.',
      descEn: 'Test yourself instead of only rereading.',
      steps: [
        {
          id: 's1',
          ar: 'اقرأ الدرس وافهم الفكرة الأساسية.',
          en: 'Read the lesson and understand the main idea.',
        },
        {
          id: 's2',
          ar: 'اقفل الكتاب وحاول تشرح من ذاكرتك.',
          en: 'Close the book and explain it from memory.',
        },
        {
          id: 's3',
          ar: 'جاوب أسئلة من غير ما تبص على الحل.',
          en: 'Answer questions without looking at the solution.',
        },
        { id: 's4', ar: 'راجع أخطاءك وحدد النقاط الضعيفة.', en: 'Review mistakes and identify weak points.' },
        { id: 's5', ar: 'اختبر نفسك مرة أخيرة بسرعة.', en: 'Give yourself one final quick test.' },
      ],
    },
    {
      id: 'feynman',
      builtin: true,
      titleAr: 'طريقة فاينمان',
      titleEn: 'Feynman Technique',
      descAr: 'بسّط المعلومة كأنك بتشرحها لشخص تاني.',
      descEn: 'Simplify the idea as if you were teaching someone else.',
      steps: [
        { id: 's1', ar: 'اختار الفكرة اللي عايز تتعلمها.', en: 'Choose the idea you want to learn.' },
        { id: 's2', ar: 'اشرحها بكلام بسيط جدًا.', en: 'Explain it in very simple words.' },
        {
          id: 's3',
          ar: 'حدد الأجزاء اللي وقفت معاك.',
          en: 'Identify the parts you could not explain clearly.',
        },
        { id: 's4', ar: 'ارجع للمصدر وصحّح شرحك.', en: 'Return to the source and correct your explanation.' },
      ],
    },
    {
      id: 'pomodoro-study',
      builtin: true,
      titleAr: 'بومودورو للمذاكرة',
      titleEn: 'Pomodoro Study',
      descAr: 'جلسات تركيز قصيرة مع استراحات محددة.',
      descEn: 'Focused study sessions with planned breaks.',
      steps: [
        { id: 's1', ar: 'حدد مهمة واحدة للجولة.', en: 'Choose one task for the round.' },
        { id: 's2', ar: 'ذاكر بتركيز حتى ينتهي المؤقّت.', en: 'Study with full focus until the timer ends.' },
        { id: 's3', ar: 'خد استراحة قصيرة من غير مشتتات.', en: 'Take a short break without distractions.' },
        {
          id: 's4',
          ar: 'كرر الجولات ثم خُد استراحة أطول.',
          en: 'Repeat the rounds, then take a longer break.',
        },
        {
          id: 's5',
          ar: 'سجل اللي أنجزته قبل ما تبدأ الجولة التالية.',
          en: 'Record what you completed before the next round.',
        },
        {
          id: 's6',
          ar: 'راجع هدفك وعدّل المهمة لو لزم.',
          en: 'Review your goal and adjust the task if needed.',
        },
      ],
    },
    {
      id: 'spaced-repetition',
      builtin: true,
      titleAr: 'التكرار المتباعد',
      titleEn: 'Spaced Repetition',
      descAr: 'راجع المعلومة على فترات بدل الحفظ مرة واحدة.',
      descEn: 'Review information at expanding intervals.',
      steps: [
        { id: 's1', ar: 'ذاكر المعلومة لأول مرة.', en: 'Learn the information for the first time.' },
        { id: 's2', ar: 'راجعها في اليوم التالي.', en: 'Review it the next day.' },
        { id: 's3', ar: 'راجعها بعد عدة أيام.', en: 'Review it again after a few days.' },
        { id: 's4', ar: 'راجعها بعد أسبوع.', en: 'Review it after a week.' },
        {
          id: 's5',
          ar: 'اختبر نفسك وكرر فقط اللي نسيته.',
          en: 'Test yourself and repeat only what you forgot.',
        },
      ],
    },
    {
      id: 'practice-loop',
      builtin: true,
      titleAr: 'حل → مراجعة → إعادة',
      titleEn: 'Practice Loop',
      descAr: 'اتعلم من الحل والخطأ ثم جرّب مرة ثانية.',
      descEn: 'Learn from mistakes, then try again.',
      steps: [
        { id: 's1', ar: 'حل مجموعة مسائل من غير مساعدة.', en: 'Solve a set of problems without help.' },
        { id: 's2', ar: 'صحح إجاباتك وحدد الأخطاء.', en: 'Check your answers and identify mistakes.' },
        { id: 's3', ar: 'اكتب سبب كل خطأ.', en: 'Write why each mistake happened.' },
        { id: 's4', ar: 'حل أسئلة مشابهة من جديد.', en: 'Solve similar questions again.' },
        { id: 's5', ar: 'اختبر نفسك بسؤال أصعب.', en: 'Challenge yourself with a harder question.' },
      ],
    },
  ];

  function cloneStudyDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_STUDY_SYSTEMS));
  }
  function saveStudySystems() {
    try {
      localStorage.setItem(scopedKey(LS_STUDY_SYSTEMS), JSON.stringify(studySystems));
    } catch (e) {}
  }
  function loadStudySystems() {
    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(scopedKey(LS_STUDY_SYSTEMS)) || 'null');
    } catch (e) {}
    if (Array.isArray(saved) && saved.length) {
      studySystems = saved.filter(function (s) {
        return s && s.id && Array.isArray(s.steps);
      });
    } else {
      studySystems = cloneStudyDefaults();
      var old = [];
      try {
        old = JSON.parse(localStorage.getItem(scopedKey(LS_STUDY_PLAN_OLD)) || '[]');
      } catch (e) {}
      if (Array.isArray(old) && old.length) {
        old.forEach(function (idx) {
          if (studySystems[0].steps[idx]) studySystems[0].steps[idx].done = true;
        });
      }
      saveStudySystems();
    }
    try {
      activeStudySystemId = localStorage.getItem(scopedKey(LS_STUDY_SYSTEM)) || '';
    } catch (e) {
      activeStudySystemId = '';
    }
    if (
      !studySystems.some(function (s) {
        return s.id === activeStudySystemId;
      })
    )
      activeStudySystemId = studySystems[0] ? studySystems[0].id : '';
  }
  function saveActiveStudySystem() {
    try {
      localStorage.setItem(scopedKey(LS_STUDY_SYSTEM), activeStudySystemId);
    } catch (e) {}
  }
  function currentStudySystem() {
    return (
      studySystems.find(function (s) {
        return s.id === activeStudySystemId;
      }) ||
      studySystems[0] ||
      null
    );
  }
  function studyText(s) {
    return lang === 'en' ? s.titleEn || s.titleAr || '' : s.titleAr || s.titleEn || '';
  }
  function studyDesc(s) {
    return lang === 'en' ? s.descEn || s.descAr || '' : s.descAr || s.descEn || '';
  }
  function studyStepText(step) {
    return lang === 'en' ? step.en || step.ar || '' : step.ar || step.en || '';
  }
  function bilingualPair(ar, en, cls) {
    var text = lang === 'en' ? en || ar || '' : ar || en || '';
    if (!text) return '';
    var extra = cls ? ' ' + cls : '';
    var dir = lang === 'en' ? 'ltr' : 'rtl';
    return '<span class="langPair' + extra + '" dir="' + dir + '">' + esc(text) + '</span>';
  }
  function studyStepPair(step, cls) {
    return bilingualPair(step && step.ar, step && step.en, cls);
  }
  function studyTitlePair(system, cls) {
    return bilingualPair(system && system.titleAr, system && system.titleEn, cls);
  }
  function renderStudySystems() {
    var box = $('studySystems');
    if (!box) return;
    if (!studySystems.length) {
      box.innerHTML = '<div class="studyEmpty">' + esc(tr('noStudySystems')) + '</div>';
      return;
    }
    box.innerHTML = studySystems
      .map(function (s) {
        var done = (s.steps || []).filter(function (x) {
            return x.done;
          }).length,
          total = (s.steps || []).length;
        return (
          '<button type="button" class="studySystemCard' +
          (s.id === activeStudySystemId ? ' is-active' : '') +
          '" data-study-system="' +
          esc(s.id) +
          '">' +
          (s.builtin
            ? ''
            : '<span class="studySystemCard__delete" data-delete-study-system="' +
              esc(s.id) +
              '" aria-label="' +
              esc(tr('removeStep')) +
              '">×</span>') +
          '<span class="studySystemCard__title">' +
          studyTitlePair(s) +
          '</span>' +
          '<span class="studySystemCard__desc">' +
          esc(studyDesc(s)) +
          '</span>' +
          '<span class="studySystemCard__bar"><i style="width:' +
          (total ? Math.round((done / total) * 100) : 0) +
          '%"></i></span>' +
          '<span class="studySystemCard__meta"><span>' +
          done +
          '/' +
          total +
          ' ' +
          esc(tr('stepsCount')) +
          (s.cycles ? ' · 🔁 ' + s.cycles : '') +
          '</span><span class="studySystemCard__badge">' +
          (done === total && total ? '✓' : total ? Math.round((done / total) * 100) + '%' : '') +
          '</span></span></button>'
        );
      })
      .join('');
  }
  function noteSystemCycle(s) {
    var all =
      (s.steps || []).length > 0 &&
      s.steps.every(function (x) {
        return x.done;
      });
    if (all && !s.cycleCounted) {
      s.cycles = (s.cycles || 0) + 1;
      s.cycleCounted = true;
      toast(L('🎉 خلّصت دورة كاملة من ' + studyText(s), '🎉 Cycle completed: ' + studyText(s)));
    } else if (!all) s.cycleCounted = false;
  }
  function renderStudySubjectSelect(s) {
    var sel = $('studySubject');
    if (!sel || !s) return;
    if (
      s.subjectId &&
      !state.subjects.some(function (x) {
        return x.id === s.subjectId;
      })
    )
      s.subjectId = '';
    var o = '<option value="">' + esc(tr('noStudySubject')) + '</option>';
    state.subjects
      .slice()
      .sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', lang === 'en' ? 'en' : 'ar');
      })
      .forEach(function (x) {
        o += '<option value="' + esc(x.id) + '">' + esc(x.name || '') + '</option>';
      });
    sel.innerHTML = o;
    sel.value = s.subjectId || '';
    sel.dir = lang === 'en' ? 'ltr' : 'rtl';
    $('studySubjectLabel').textContent = tr('studySubject');
  }
  function renderStudyPlan() {
    var stepsBox = $('studySteps');
    if (!stepsBox) return;
    var s = currentStudySystem();
    renderStudySystems();
    if (!s) {
      $('studyActiveSystemTitle').textContent = tr('currentStudySystem');
      $('studyActiveSystemDesc').textContent = '';
      stepsBox.innerHTML = '<div class="studyEmpty">' + esc(tr('noStudySystems')) + '</div>';
      $('studyProgressValue').textContent = '0/0';
      $('studyProgressBar').style.width = '0%';
      return;
    }
    $('studyActiveSystemTitle').textContent = studyText(s);
    renderStudySubjectSelect(s);
    $('studyActiveSystemDesc').textContent = studyDesc(s);
    var steps = s.steps || [];
    stepsBox.innerHTML = steps.length
      ? steps
          .map(function (step, i) {
            var checked = !!step.done;
            return (
              '<label class="studyStep' +
              (checked ? ' is-done' : '') +
              '"><input type="checkbox" data-study-step="' +
              esc(step.id) +
              '" ' +
              (checked ? 'checked' : '') +
              '><b class="studyStep__num">' +
              (i + 1) +
              '</b><span><span class="studyStep__pair">' +
              studyStepPair(step) +
              '</span><span>' +
              esc(
                lang === 'en'
                  ? s.builtin
                    ? 'Follow this step carefully.'
                    : 'Custom step'
                  : s.builtin
                    ? 'نفّذ الخطوة بهدوء وركّز فيها.'
                    : 'خطوة مخصصة',
              ) +
              '</span></span>' +
              (checked
                ? ''
                : '<button type="button" class="ghost studyStep__go" data-study-go="' +
                  esc(step.id) +
                  '">' +
                  (lang === 'en' ? '▶ Start' : '▶ ابدأ') +
                  '</button>') +
              '</label>'
            );
          })
          .join('')
      : '<div class="studyEmpty">' + esc(tr('noSteps')) + '</div>';
    updateStudyProgress();
  }
  function updateStudyProgress() {
    var s = currentStudySystem(),
      checks = Array.prototype.slice.call(document.querySelectorAll('[data-study-step]'));
    var count = checks.filter(function (x) {
        return x.checked;
      }).length,
      total = s ? (s.steps || []).length : 0;
    var pct = total ? Math.round((count / total) * 100) : 0,
      en = lang === 'en',
      finished = total > 0 && count === total;
    $('studyProgressValue').textContent = count + '/' + total + ' · ' + pct + '%';
    $('studyProgressBar').style.width = pct + '%';
    $('studyProgressLabel').textContent = finished
      ? en
        ? '🎉 All steps done'
        : '🎉 خلّصت كل الخطوات'
      : en
        ? 'Progress'
        : 'التقدم';
    var box = document.querySelector('.studyProgress');
    if (box) box.classList.toggle('is-complete', finished);
    var firstOpen = -1;
    checks.forEach(function (x, i) {
      if (!x.checked && firstOpen < 0) firstOpen = i;
    });
    checks.forEach(function (x, i) {
      var st = x.closest('.studyStep');
      st.classList.toggle('is-done', x.checked);
      st.classList.toggle('is-current', i === firstOpen);
      var sub = st.querySelector('.studyStep__pair + span');
      if (sub)
        sub.textContent =
          (x.checked
            ? en
              ? 'Done ✓'
              : 'تمت ✓'
            : i === firstOpen
              ? en
                ? 'Current step'
                : 'الخطوة الحالية'
              : en
                ? 'Step ' + (i + 1) + ' of ' + total
                : 'الخطوة ' + (i + 1) + ' من ' + total) + stepSpentTag(i);
    });
  }
  function applyStudyPlanLanguage() {
    if (!$('studyPlanHeading')) return;
    $('studyPlanHeading').textContent = tr('studySystems');
    $('studyPlanIntro').textContent = tr('studyPlanIntro');
    $('studyAddSystem').textContent = '+' + ' ' + tr('addStudySystem');
    $('studyActiveSystemTitle').setAttribute('aria-label', tr('currentStudySystem'));
    $('studyPlanReset').textContent = tr('reset');
    $('studyProgressLabel').textContent = L('التقدم', 'Progress');
    renderStudyPlan();
  }

  var newStudyStepDraft = [];
  function makeStudyStepDraft(ar, en) {
    return { ar: ar || '', en: en || '' };
  }
  function renderStudyStepEditorLanguage() {
    var box = $('studyStepEditor');
    if (!box) return;
    Array.prototype.forEach.call(box.querySelectorAll('[data-step-ar-label]'), function (el) {
      el.textContent = tr('stepArabic');
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-step-en-label]'), function (el) {
      el.textContent = tr('stepEnglish');
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-step-remove]'), function (el) {
      el.setAttribute('aria-label', tr('removeStep'));
      el.title = tr('removeStep');
    });
  }
  function renderStudyStepEditor() {
    var box = $('studyStepEditor');
    if (!box) return;
    box.innerHTML = newStudyStepDraft
      .map(function (step, i) {
        return (
          '<div class="studyStepEditor__row" data-editor-step="' +
          i +
          '">' +
          '<b>' +
          (i + 1) +
          '</b>' +
          '<div class="studyStepEditor__langs"><label><span data-step-ar-label>' +
          esc(tr('stepArabic')) +
          '</span><input type="text" dir="rtl" lang="ar" data-step-ar value="' +
          esc(step.ar) +
          '"></label>' +
          '<label><span data-step-en-label>' +
          esc(tr('stepEnglish')) +
          '</span><input type="text" dir="ltr" lang="en" data-step-en value="' +
          esc(step.en) +
          '"></label></div>' +
          '<button type="button" class="studyStepEditor__remove" data-step-remove data-step-index="' +
          i +
          '">×</button></div>'
        );
      })
      .join('');
    renderStudyStepEditorLanguage();
  }
  function openStudySystemDialog() {
    newStudyStepDraft = [makeStudyStepDraft('', '')];
    $('ss_title_ar').value = '';
    $('ss_title_en').value = '';
    $('ss_desc_ar').value = '';
    $('ss_desc_en').value = '';
    renderStudyStepEditor();
    $('dlgStudySystem').showModal();
    setTimeout(function () {
      $('ss_title_ar').focus();
    }, 30);
  }
  function makeStudyId() {
    return 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }
  function saveStudySystem() {
    var titleAr = $('ss_title_ar').value.trim(),
      titleEn = $('ss_title_en').value.trim();
    if (!titleAr || !titleEn) {
      toast(L('اكتب اسم النظام بالعربي والإنجليزي.', 'Enter the system name in Arabic and English.'));
      return;
    }
    var steps = newStudyStepDraft
      .map(function (x, i) {
        return {
          id: 's' + Date.now().toString(36) + i + Math.random().toString(36).slice(2, 5),
          ar: (x.ar || '').trim(),
          en: (x.en || '').trim(),
        };
      })
      .filter(function (x) {
        return x.ar || x.en;
      });
    if (
      !steps.length ||
      steps.some(function (x) {
        return !x.ar || !x.en;
      })
    ) {
      toast(
        L(
          'اكتب كل خطوة بالعربي والإنجليزي. وخلّي عندك خطوة واحدة على الأقل.',
          'Enter every step in Arabic and English, with at least one step.',
        ),
      );
      return;
    }
    var item = {
      id: makeStudyId(),
      builtin: false,
      titleAr: titleAr,
      titleEn: titleEn,
      descAr: $('ss_desc_ar').value.trim(),
      descEn: $('ss_desc_en').value.trim(),
      steps: steps,
    };
    studySystems.push(item);
    activeStudySystemId = item.id;
    saveStudySystems();
    saveActiveStudySystem();
    $('dlgStudySystem').close();
    renderStudyPlan();
    toast(L('اتضاف نظام المذاكرة.', 'Study system added.'));
  }
  function deleteStudySystem(id) {
    var s = studySystems.find(function (x) {
      return x.id === id;
    });
    if (!s) return;
    if (s.builtin) {
      toast(tr('cannotDeleteDefault'));
      return;
    }
    if (!confirmText('تمسح نظام المذاكرة ده؟', 'Delete this study system?')) return;
    studySystems = studySystems.filter(function (x) {
      return x.id !== id;
    });
    if (activeStudySystemId === id) activeStudySystemId = studySystems[0] ? studySystems[0].id : '';
    saveStudySystems();
    saveActiveStudySystem();
    renderStudyPlan();
    toast(tr('systemDeleted'));
  }

  /* ---------------- state ---------------- */
  var state = { subjects: [], entries: [], homework: [], links: [], notes: [], exams: [] };
  var db = null,
    mode = 'loading',
    activeView = 'today';
  var loadedOnce = {
    subjects: false,
    entries: false,
    homework: false,
    links: false,
    notes: false,
    exams: false,
  };
  var editing = { entry: null, hw: null, sub: null, link: null, note: null, exam: null };
  var pickedColor = PALETTE[0];
  var pickedDays = [];
  var subjectFilter = '';

  var $ = function (id) {
    return document.getElementById(id);
  };

  /* ---------------- date helpers ---------------- */
  function todayIdx() {
    return (new Date().getDay() + 1) % 7;
  } // 0 = السبت
  function idxOfDate(d) {
    return (d.getDay() + 1) % 7;
  }
  function ymd(d) {
    var m = d.getMonth() + 1,
      day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function parseYmd(s) {
    if (!s) return null;
    var p = String(s).split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function startOfWeek() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - todayIdx());
    return d;
  }
  function addDays(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function dayDiff(a, b) {
    var x = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var y = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((y - x) / 86400000);
  }
  function fmtDate(d) {
    return d.getDate() + ' ' + MONTHS[d.getMonth()];
  }
  function fmtTime(t) {
    if (!t) return '';
    var p = String(t).split(':');
    if (p.length < 2) return t;
    var h = +p[0],
      m = pad2(+p[1] || 0);
    var suffix = lang === 'en' ? (h < 12 ? 'AM' : 'PM') : h < 12 ? 'ص' : 'م';
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ':' + m + ' ' + suffix;
  }
  function mins(t) {
    if (!t) return 0;
    var p = String(t).split(':');
    return +p[0] * 60 + (+p[1] || 0);
  }
  function arabicDays(n) {
    if (lang === 'en') return n === 1 ? 'day' : n + ' days';
    if (n === 1) return 'يوم';
    if (n === 2) return 'يومين';
    if (n <= 10) return n + ' أيام';
    return n + ' يوم';
  }
  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }
  function formatDuration(ms) {
    if (ms < 0) ms = 0;
    var total = Math.floor(ms / 1000);
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    return h > 0 ? h + ':' + pad2(m) + ':' + pad2(s) : pad2(m) + ':' + pad2(s);
  }
  function tickCountdown() {
    var clock = $('pulseClock');
    if (!clock) return;
    if (!countdownState) {
      clock.textContent = '';
      return;
    }
    var remain = countdownState.target - Date.now();
    if (remain <= 0) {
      if (activeView === 'today') renderToday();
      return;
    }
    clock.textContent = formatDuration(remain);
  }
  function formatExamRemain(ms) {
    if (ms <= 0) return lang === 'en' ? 'Now' : 'دلوقتي';
    var totalSec = Math.floor(ms / 1000);
    var days = Math.floor(totalSec / 86400);
    var rem = totalSec - days * 86400;
    var h = Math.floor(rem / 3600),
      m = Math.floor((rem % 3600) / 60),
      s = rem % 60;
    if (lang === 'en') {
      if (days > 0) return 'in ' + arabicDays(days) + (h > 0 ? ' ' + h + 'h' : '');
      return 'in ' + pad2(h) + ':' + pad2(m) + ':' + pad2(s);
    }
    if (days > 0) return 'خلال ' + arabicDays(days) + (h > 0 ? ' و' + h + ' س' : '');
    return 'خلال ' + pad2(h) + ':' + pad2(m) + ':' + pad2(s);
  }
  function tickExamHero() {
    var clock = $('examHeroClock');
    if (!clock || !examCountdownState) return;
    var remain = examCountdownState.target - Date.now();
    if (remain <= 0) {
      if (activeView === 'exams') renderExams();
      return;
    }
    clock.textContent = formatExamRemain(remain);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function normUrl(u) {
    u = String(u == null ? '' : u).trim();
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) {
      if (/^[a-z][a-z0-9+.\-]*:/i.test(u)) return ''; // أي بروتوكول تاني مرفوض
      u = 'https://' + u;
    }
    return u;
  }
  function safeUrl(u) {
    return /^https?:\/\//i.test(String(u || '')) ? u : '';
  }
  function hostOf(u) {
    try {
      return new URL(u).hostname.replace(/^www\./, '');
    } catch (e) {
      return lang === 'en' ? 'resource' : 'لينك';
    }
  }
  function linkWord(u) {
    var h = hostOf(u);
    if (/youtube|youtu\.be/i.test(h)) return lang === 'en' ? 'Video' : 'فيديو';
    if (/drive\.google|dropbox|onedrive/i.test(h)) return lang === 'en' ? 'File' : 'ملف';
    return lang === 'en' ? 'Resource' : 'لينك';
  }
  function linkBtn(u, label) {
    var safe = safeUrl(u);
    if (!safe) return '';
    return (
      '<a class="linkbtn" href="' +
      esc(safe) +
      '" target="_blank" rel="noopener noreferrer">' +
      esc(label || linkWord(safe)) +
      '</a>'
    );
  }

  /* ---------------- storage ---------------- */
  function loadLocal() {
    try {
      var raw = localStorage.getItem(dataKey());
      if (!raw && activeAccountId === 'default') raw = localStorage.getItem(LS_KEY_BASE);
      if (!raw) return;
      var o = JSON.parse(raw);
      function list(key) {
        return Array.isArray(o[key]) ? o[key] : [];
      }
      state.subjects = list('subjects');
      state.entries = list('entries');
      state.homework = list('homework');
      state.links = list('links');
      state.notes = list('notes');
      state.exams = list('exams');
    } catch (e) {}
  }
  function saveLocal() {
    try {
      localStorage.setItem(dataKey(), JSON.stringify(state));
    } catch (e) {}
    try {
      if (window.KashKoolLearningOS && window.KashKoolLearningOS.onDataSaved)
        window.KashKoolLearningOS.onDataSaved(state);
    } catch (e) {}
  }

  function put(coll, id, data) {
    if (mode === 'db' && db) {
      var ref = id ? db.collection(coll).doc(id) : db.collection(coll).doc();
      return ref.set(data).catch(function (err) {
        toast('الحفظ مانفعش. جرّب تاني.');
        throw err;
      });
    }
    var arr = state[coll];
    var theId = id || uid();
    var rec = Object.assign({ id: theId }, data);
    var i = -1;
    for (var k = 0; k < arr.length; k++) {
      if (arr[k].id === theId) {
        i = k;
        break;
      }
    }
    if (i >= 0) arr[i] = rec;
    else arr.push(rec);
    saveLocal();
    render();
    return Promise.resolve();
  }
  function remove(coll, id) {
    try {
      var gone = (state[coll] || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (gone) {
        var rk = 'kashkool.recycle.v1.' + activeAccountId,
          bin = JSON.parse(localStorage.getItem(rk) || '[]');
        if (!Array.isArray(bin)) bin = [];
        bin.unshift({ collection: coll, item: gone, deletedAt: Date.now() });
        bin = bin.slice(0, 20);
        localStorage.setItem(rk, JSON.stringify(bin));
      }
    } catch (e) {}
    if (mode === 'db' && db) {
      return db
        .collection(coll)
        .doc(id)
        .delete()
        .catch(function () {
          toast('المسح مانفعش. جرّب تاني.');
        });
    }
    state[coll] = state[coll].filter(function (x) {
      return x.id !== id;
    });
    saveLocal();
    render();
    return Promise.resolve();
  }

  function subscribe(coll) {
    db.collection(coll).onSnapshot(
      function (snap) {
        state[coll] = snap.docs.map(function (d) {
          return Object.assign({ id: d.id }, d.data());
        });
        loadedOnce[coll] = true;
        maybeMigrate();
        render();
      },
      function (err) {
        if (err && err.code === 'revoked') {
          notice('الاتصال بالحفظ اتقطع. افتح الصفحة تاني.');
        }
      },
    );
  }

  var migrated = false;
  function maybeMigrate() {
    if (migrated) return;
    if (!(
      loadedOnce.subjects &&
      loadedOnce.entries &&
      loadedOnce.homework &&
      loadedOnce.links &&
      loadedOnce.notes &&
      loadedOnce.exams
    ))
      return;
    migrated = true;
    if (
      state.subjects.length ||
      state.entries.length ||
      state.homework.length ||
      state.links.length ||
      state.notes.length ||
      state.exams.length
    )
      return;
    var raw;
    try {
      raw = localStorage.getItem(dataKey());
    } catch (e) {
      return;
    }
    if (!raw) return;
    var o;
    try {
      o = JSON.parse(raw);
    } catch (e) {
      return;
    }
    var lists = [
      ['subjects', o.subjects || []],
      ['entries', o.entries || []],
      ['homework', o.homework || []],
      ['links', o.links || []],
      ['notes', o.notes || []],
      ['exams', o.exams || []],
    ];
    var any = lists.some(function (p) {
      return p[1].length;
    });
    if (!any) return;
    var chain = Promise.resolve();
    lists.forEach(function (pair) {
      pair[1].forEach(function (item) {
        var body = Object.assign({}, item);
        delete body.id;
        chain = chain.then(function () {
          return db.collection(pair[0]).doc(item.id).set(body);
        });
      });
    });
    chain
      .then(function () {
        try {
          localStorage.removeItem(dataKey());
        } catch (e) {}
        toast('بياناتك القديمة اتنقلت هنا.');
      })
      .catch(function () {});
  }

  function initAccounts() {
    try {
      accounts = JSON.parse(localStorage.getItem(LS_ACCOUNTS) || '[]');
    } catch (e) {
      accounts = [];
    }
    if (!Array.isArray(accounts) || !accounts.length) accounts = [{ id: 'default', name: 'حسابي' }];
    try {
      activeAccountId = localStorage.getItem(LS_ACTIVE_ACCOUNT) || accounts[0].id;
    } catch (e) {
      activeAccountId = accounts[0].id;
    }
    if (
      !accounts.some(function (a) {
        return a.id === activeAccountId;
      })
    )
      activeAccountId = accounts[0].id;
    saveAccounts();
    updateAccountUI();
  }
  function saveAccounts() {
    try {
      localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(LS_ACTIVE_ACCOUNT, activeAccountId);
    } catch (e) {}
  }
  function activeAccount() {
    return (
      accounts.filter(function (a) {
        return a.id === activeAccountId;
      })[0] || accounts[0]
    );
  }
  function displayAccountName(a) {
    return !a || (a.id === 'default' && a.name === 'حسابي') ? tr('defaultAccount') : a.name;
  }
  function updateAccountUI() {
    if ($('accountName')) $('accountName').textContent = displayAccountName(activeAccount());
  }
  function renderAccounts() {
    $('accountList').innerHTML = accounts
      .map(function (a) {
        return (
          '<div class="accountRow ' +
          (a.id === activeAccountId ? 'active' : '') +
          '"><b>' +
          esc(displayAccountName(a)) +
          '</b><button class="ghost" type="button" data-switch-account="' +
          esc(a.id) +
          '">' +
          (a.id === activeAccountId
            ? lang === 'en'
              ? 'Active'
              : 'الحالي'
            : lang === 'en'
              ? 'Open'
              : 'فتح') +
          '</button>' +
          (accounts.length > 1
            ? '<button class="danger" type="button" data-delete-account="' + esc(a.id) + '">×</button>'
            : '') +
          '</div>'
        );
      })
      .join('');
  }
  function switchAccount(id) {
    if (id === activeAccountId) return;
    activeAccountId = id;
    saveAccounts();
    location.reload();
  }
  function addAccount() {
    var n = $('newAccountName').value.trim();
    if (!n) return;
    var id = uid();
    accounts.push({ id: id, name: n });
    activeAccountId = id;
    saveAccounts();
    location.reload();
  }
  function deleteAccount(id) {
    if (accounts.length <= 1) return;
    if (!confirmText('تمسح الحساب وبياناته من الجهاز؟', 'Delete this account and its local data?')) return;
    try {
      localStorage.removeItem(LS_KEY_BASE + '.' + id);
      localStorage.removeItem(LS_STATS + '.' + id);
      localStorage.removeItem(LS_POMO + '.' + id);
      localStorage.removeItem(LS_POMO_STATE + '.' + id);
      localStorage.removeItem(LS_POMO_SUBJECT + '.' + id);
      localStorage.removeItem(LS_PROGRESS_GOAL + '.' + id);
    } catch (e) {}
    accounts = accounts.filter(function (a) {
      return a.id !== id;
    });
    if (activeAccountId === id) activeAccountId = accounts[0].id;
    saveAccounts();
    location.reload();
  }
  /* ---------------- ui helpers ---------------- */
  var toastTimer = null;
  var countdownState = null;
  var examCountdownState = null;
  var lastNoticeMsg = '';
  function toast(msg) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = englishText(msg);
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.remove();
    }, 3200);
  }
  function notice(msg) {
    lastNoticeMsg = msg;
    $('notice').innerHTML = '<div class="notice">' + esc(englishText(msg)) + '</div>';
  }
  function confirmText(ar, en) {
    if (
      appSettings &&
      appSettings.confirmDelete === false &&
      /delete|تمسح|حذف|المسح/i.test(String(ar) + ' ' + String(en))
    )
      return true;
    return confirm(lang === 'en' ? en : ar);
  }
  function updateTip() {
    if (activeView === 'subjects' || mode === 'loading' || state.subjects.length) {
      $('tip').innerHTML = '';
      return;
    }
    var tip =
      lang === 'en'
        ? 'Start by adding your subjects, then use their colors for your schedule and homework.'
        : 'ابدأ بإضافة موادك، وبعدين لوّن بيها الجدول والواجبات.';
    $('tip').innerHTML =
      '<div class="notice"><span>' +
      esc(tip) +
      '</span>' +
      '<button class="add" type="button" data-add="subject">' +
      esc(tr('addSubject')) +
      '</button></div>';
  }
  function subjectById(id) {
    for (var i = 0; i < state.subjects.length; i++) {
      if (state.subjects[i].id === id) return state.subjects[i];
    }
    return null;
  }
  function colorOf(subjectId) {
    var s = subjectById(subjectId);
    return s && s.color ? s.color : DEFAULT_COLOR;
  }

  function renderDashboardPriority(now, openHw, upcoming, exams, system) {
    var en = lang === 'en',
      picked = null,
      today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var datedHw = openHw.filter(function (h) {
      return !!parseYmd(h.due);
    });
    var overdue = datedHw.filter(function (h) {
      return dayDiff(today, parseYmd(h.due)) < 0;
    });
    var dueToday = datedHw.filter(function (h) {
      return dayDiff(today, parseYmd(h.due)) === 0;
    });
    var dueSoon = datedHw.filter(function (h) {
      var d = dayDiff(today, parseYmd(h.due));
      return d > 0 && d <= 2;
    });
    var nextExam = exams.find(function (x) {
      var t = examTargetMs(x);
      return t !== null && t >= now.getTime();
    });
    var examDays = nextExam ? dayDiff(today, parseYmd(nextExam.date)) : Infinity;

    if (overdue.length) {
      var h = overdue[0],
        sub = subjectById(h.subjectId),
        info = dueInfo(h);
      picked = {
        type: 'overdue',
        icon: '!',
        eyebrow: en ? 'PRIORITY · OVERDUE' : 'أولوية · متأخر',
        title: h.title || (sub ? sub.name : en ? 'Overdue homework' : 'واجب متأخر'),
        desc: en
          ? (sub ? sub.name + ' · ' : '') + 'This task is past its due date. Clear it or update its plan.'
          : (sub ? sub.name + ' · ' : '') + 'المهمة دي فات موعدها. خلّصها أو حدّث خطتها.',
        reason: info.en || info.text,
        action: en ? 'Review homework' : 'راجع الواجبات',
        view: 'hw',
      };
    } else if (dueToday.length) {
      var hToday = dueToday[0],
        subToday = subjectById(hToday.subjectId);
      picked = {
        type: 'today',
        icon: '✓',
        eyebrow: en ? 'DUE TODAY' : 'تسليم النهاردة',
        title: hToday.title || (subToday ? subToday.name : en ? 'Homework due today' : 'واجب مطلوب النهاردة'),
        desc: en
          ? (subToday ? subToday.name + ' · ' : '') + 'Finish this before moving to less urgent work.'
          : (subToday ? subToday.name + ' · ' : '') + 'خلّص المهمة دي قبل ما تنتقل لحاجة أقل استعجالًا.',
        reason: en ? 'Due today' : 'موعده النهاردة',
        action: en ? 'Open homework' : 'افتح الواجبات',
        view: 'hw',
      };
    } else if (nextExam && examDays <= 1) {
      var examSub = subjectById(nextExam.subjectId);
      picked = {
        type: 'exam',
        icon: '✎',
        eyebrow: en ? 'UPCOMING EXAM' : 'امتحان قريب',
        title: nextExam.title || (examSub ? examSub.name : en ? 'Upcoming exam' : 'الامتحان القادم'),
        desc: en
          ? (examSub ? examSub.name + ' · ' : '') + 'Review the key topics and prepare what you need.'
          : (examSub ? examSub.name + ' · ' : '') + 'راجع أهم النقاط وجهّز المطلوب للامتحان.',
        reason: examDays === 0 ? (en ? 'Today' : 'النهاردة') : en ? 'Tomorrow' : 'بكرة',
        action: en ? 'View exam' : 'اعرض الامتحانات',
        view: 'exams',
      };
    } else if (dueSoon.length) {
      var hSoon = dueSoon[0],
        subSoon = subjectById(hSoon.subjectId),
        dueSoonInfo = dueInfo(hSoon);
      picked = {
        type: 'soon',
        icon: '◷',
        eyebrow: en ? 'COMING UP' : 'قريب الاستحقاق',
        title: hSoon.title || (subSoon ? subSoon.name : en ? 'Upcoming homework' : 'واجب قريب'),
        desc: en
          ? (subSoon ? subSoon.name + ' · ' : '') + 'Start a little early so the deadline does not pile up.'
          : (subSoon ? subSoon.name + ' · ' : '') + 'ابدأ فيه بدري شوية عشان الموعد مايتراكمش عليك.',
        reason: dueSoonInfo.en || dueSoonInfo.text,
        action: en ? 'Open homework' : 'افتح الواجبات',
        view: 'hw',
      };
    } else if (upcoming && upcoming.length) {
      var entry = upcoming[0],
        entrySub = subjectById(entry.subjectId),
        entryTitle = entry.title || (entrySub ? entrySub.name : en ? 'Next lesson' : 'الحصة القادمة');
      picked = {
        type: 'schedule',
        icon: '◷',
        eyebrow: en ? 'NEXT ON YOUR SCHEDULE' : 'التالي في جدولك',
        title: entryTitle,
        desc: en
          ? (entrySub ? entrySub.name + ' · ' : '') + 'Get your materials ready and use the next slot well.'
          : (entrySub ? entrySub.name + ' · ' : '') + 'جهّز أدواتك واستغل الموعد الجاي بهدوء.',
        reason: entry.noTime ? (en ? 'Today · all day' : 'النهاردة · طوال اليوم') : fmtTime(entry.from),
        action: en ? 'Open today' : 'افتح جدول اليوم',
        view: 'today',
      };
    } else if (nextExam) {
      var nextSub = subjectById(nextExam.subjectId),
        examRemain =
          examDays === 0
            ? en
              ? 'Today'
              : 'النهاردة'
            : examDays === 1
              ? en
                ? 'Tomorrow'
                : 'بكرة'
              : en
                ? examDays + ' days'
                : 'خلال ' + examDays + ' يوم';
      picked = {
        type: 'exam',
        icon: '✎',
        eyebrow: en ? 'NEXT EXAM' : 'الامتحان القادم',
        title: nextExam.title || (nextSub ? nextSub.name : en ? 'Upcoming exam' : 'الامتحان القادم'),
        desc: en
          ? (nextSub ? nextSub.name + ' · ' : '') + 'Break revision into small sessions before exam day.'
          : (nextSub ? nextSub.name + ' · ' : '') + 'قسّم المراجعة لجلسات صغيرة قبل يوم الامتحان.',
        reason: examRemain,
        action: en ? 'View exams' : 'اعرض الامتحانات',
        view: 'exams',
      };
    } else if (
      system &&
      Array.isArray(system.steps) &&
      system.steps.some(function (step) {
        return !step.done;
      })
    ) {
      var step = system.steps.find(function (x) {
        return !x.done;
      });
      picked = {
        type: 'system',
        icon: '→',
        eyebrow: en ? 'NEXT STUDY STEP' : 'الخطوة التالية في المذاكرة',
        title: studyStepText(step) || studyText(system),
        desc: en
          ? 'Continue your current study system one step at a time.'
          : 'كمّل نظام المذاكرة الحالي خطوة بخطوة من غير استعجال.',
        reason: studyText(system),
        action: en ? 'Continue system' : 'كمّل النظام',
        view: 'studyplan',
      };
    } else {
      picked = {
        type: 'focus',
        icon: '✦',
        eyebrow: en ? 'YOUR NEXT STEP' : 'خطوتك التالية',
        title: en ? 'Start a focused study session' : 'ابدأ جلسة مذاكرة مركّزة',
        desc: en
          ? 'No urgent items are waiting. Choose a subject and make a little progress.'
          : 'مفيش مهام عاجلة مستنياك. اختار مادة وابدأ تقدم بسيط.',
        reason: en ? 'A calm start' : 'بداية هادئة',
        action: en ? 'Start studying' : 'ابدأ المذاكرة',
        view: 'pomo',
      };
    }

    var card = $('dashPriorityCard'),
      icon = $('dashPriorityIcon'),
      eyebrow = $('dashPriorityEyebrow'),
      title = $('dashPriorityTitle'),
      desc = $('dashPriorityDesc'),
      reason = $('dashPriorityReason'),
      button = $('dashPriorityButton');
    if (!card || !picked || !button) return;
    card.setAttribute('data-priority', picked.type);
    icon.textContent = picked.icon;
    eyebrow.textContent = picked.eyebrow;
    title.textContent = picked.title;
    desc.textContent = picked.desc;
    reason.textContent = picked.reason;
    button.textContent = picked.action;
    button.setAttribute('data-dash-view', picked.view);
    button.setAttribute('aria-label', picked.action + ': ' + picked.title);
  }

  function renderDashboard() {
    var now = new Date(),
      todayKey = localDateKey(now),
      sessions = loadStudyStats(),
      todaySessions = sessions.filter(function (x) {
        return localDateKey(x.at) === todayKey;
      }),
      todayMinutes = todaySessions.reduce(function (a, x) {
        return a + (+x.minutes || 0);
      }, 0);
    var openHw = state.homework
        .filter(function (h) {
          return !h.done;
        })
        .sort(sortHw),
      dueToday = openHw.filter(function (h) {
        var d = parseYmd(h.due);
        return d && dayDiff(now, d) === 0;
      });
    var st = getStudyStreak();
    $('dashStreakValue').textContent = st.current;
    $('dashStreakUnit').textContent = lang === 'en' ? 'days' : 'يوم';
    $('dashStreakState').textContent = st.todayStudied
      ? lang === 'en'
        ? 'On fire 🔥'
        : 'مستمر 🔥'
      : st.current
        ? lang === 'en'
          ? 'Study today to keep it going'
          : 'ذاكر النهاردة عشان تحافظ عليه'
        : lang === 'en'
          ? 'Start your streak today'
          : 'ابدأ الاستريك النهاردة';
    $('dashStudyValue').textContent = todayMinutes + (lang === 'en' ? ' min' : ' دقيقة');
    $('dashSessionsValue').textContent = todaySessions.length;
    $('dashHwValue').textContent = openHw.length;
    $('dashHwMeta').textContent =
      lang === 'en' ? dueToday.length + ' due today' : dueToday.length + ' تسليم النهاردة';

    var entries = sortedEntriesFor(todayIdx()),
      nowM = now.getHours() * 60 + now.getMinutes();
    var upcoming = entries
      .filter(function (e) {
        return e.noTime || mins(e.to || e.from) > nowM;
      })
      .slice(0, 4);
    $('dashScheduleList').innerHTML = upcoming.length
      ? upcoming
          .map(function (e) {
            var sub = subjectById(e.subjectId),
              title = e.title || (sub ? sub.name : lang === 'en' ? 'Lesson' : 'حصة'),
              time = e.noTime ? (lang === 'en' ? 'All day' : 'طول اليوم') : fmtTime(e.from);
            return (
              '<div class="dashListRow"><div><strong>' +
              esc(title) +
              '</strong><span>' +
              esc(sub ? sub.name : '') +
              '</span></div><time>' +
              esc(time) +
              '</time></div>'
            );
          })
          .join('')
      : '<div class="dashEmpty">' +
        esc(lang === 'en' ? 'No more scheduled items today.' : 'مفيش مواعيد تانية النهاردة.') +
        '</div>';

    var exams = state.exams.slice().sort(sortExam),
      next = exams.find(function (x) {
        var t = examTargetMs(x);
        return t !== null && t >= now.getTime();
      });
    if (next) {
      var nd = parseYmd(next.date),
        diff = dayDiff(now, nd),
        sub = subjectById(next.subjectId),
        remain =
          diff === 0
            ? lang === 'en'
              ? 'Today'
              : 'النهاردة'
            : diff === 1
              ? lang === 'en'
                ? 'Tomorrow'
                : 'بكرة'
              : lang === 'en'
                ? diff + ' days'
                : diff + ' يوم';
      $('dashExamBox').innerHTML =
        '<div class="dashExam"><div class="dashExam__name">' +
        esc(next.title || (sub ? sub.name : lang === 'en' ? 'Exam' : 'امتحان')) +
        '</div><div class="dashExam__meta">' +
        esc(sub ? sub.name : '') +
        (next.time ? ' · ' + esc(fmtTime(next.time)) : '') +
        '</div><div class="dashExam__count">' +
        esc(remain) +
        '</div><button class="add" type="button" data-edit-exam="' +
        esc(next.id) +
        '">' +
        esc(lang === 'en' ? 'Open exam' : 'فتح الامتحان') +
        '</button></div>';
    } else {
      $('dashExamBox').innerHTML =
        '<div class="dashEmpty">' +
        esc(lang === 'en' ? 'No upcoming exams.' : 'مفيش امتحانات جاية.') +
        '</div>';
    }

    var system = currentStudySystem(),
      total = system && Array.isArray(system.steps) ? system.steps.length : 0,
      done = system
        ? (system.steps || []).filter(function (x) {
            return x.done;
          }).length
        : 0,
      pct = total ? Math.round((done / total) * 100) : 0;
    $('dashSystemBox').innerHTML = system
      ? '<div class="dashStudy"><div class="dashStudy__title">' +
        esc(studyText(system)) +
        '</div><div class="dashStudy__desc">' +
        esc(studyDesc(system)) +
        '</div><div class="dashBar"><i style="width:' +
        pct +
        '%"></i></div><div class="dashProgressLine"><span>' +
        esc(lang === 'en' ? done + ' of ' + total + ' steps' : done + ' من ' + total + ' خطوة') +
        '</span><b>' +
        pct +
        '%</b></div></div>'
      : '<div class="dashEmpty">' +
        esc(lang === 'en' ? 'Add a study system first.' : 'أضف نظام مذاكرة الأول.') +
        '</div>';
    renderDashboardPriority(now, openHw, upcoming, exams, system);

    var hwTop = openHw.slice(0, 4);
    $('dashHomeworkList').innerHTML = hwTop.length
      ? hwTop
          .map(function (h) {
            var info = dueInfo(h);
            return (
              '<div class="dashListRow"><div><strong>' +
              esc(h.title || (lang === 'en' ? 'Homework' : 'واجب')) +
              '</strong><span>' +
              esc(
                (function () {
                  var sub = subjectById(h.subjectId);
                  return sub ? sub.name : '';
                })(),
              ) +
              '</span></div><time>' +
              esc(lang === 'en' ? info.en : info.text) +
              '</time></div>'
            );
          })
          .join('')
      : '<div class="dashEmpty">' +
        esc(lang === 'en' ? 'No open homework. Nice.' : 'مفيش واجبات مفتوحة. جامد 👌') +
        '</div>';

    var ws = startOfWeek(),
      vals = [0, 0, 0, 0, 0, 0, 0];
    sessions.forEach(function (x) {
      var diff = dayDiff(ws, new Date(x.at));
      if (diff >= 0 && diff < 7) vals[diff] += +x.minutes || 0;
    });
    var max = Math.max.apply(null, vals.concat([1]));
    $('dashWeekChart').innerHTML = vals
      .map(function (v, i) {
        var h = Math.max(3, Math.round((v / max) * 100));
        return (
          '<div class="dashWeekDay"><div class="dashWeekBar"><i style="height:' +
          h +
          '%"></i></div><b>' +
          esc(DAYS[i].slice(0, 3)) +
          '</b><span>' +
          v +
          (lang === 'en' ? 'm' : 'د') +
          '</span></div>'
        );
      })
      .join('');
  }

  /* ---------------- study-time theme store ---------------- */
  var STORE_KEY = 'kashkool.store.v1';
  var STORE_THEMES = [
    {
      id: 'classic',
      nameAr: 'دفتر كشكول',
      nameEn: 'Kashkool Notebook',
      descAr: 'الهوية الأساسية: ورق منظم، هدوء، وتركيز بدون زحمة.',
      descEn: 'The core identity: ruled paper, calm structure, and zero visual noise.',
      price: 0,
      icon: '📓',
      className: 'classic',
      family: 'balanced',
      familyAr: 'متوازن',
      familyEn: 'Balanced',
      moodAr: 'هادئ وعملي',
      moodEn: 'Calm · Practical',
      preview: ['#F3EFE5', '#FFFCF3', '#D7CFBE', '#C79222', '#242B38'],
    },
    {
      id: 'school',
      nameAr: 'المدرسة',
      nameEn: 'School',
      descAr: 'دفتر مدرسى كامل: مسطرة جانبية، ورق، علامات وتفاصيل مكتبية.',
      descEn: 'A full school-desk identity: ruled paper, margin line, tabs, and notebook details.',
      price: 2,
      icon: '🏫',
      className: 'school',
      family: 'classic',
      familyAr: 'كلاسيكي',
      familyEn: 'Classic',
      moodAr: 'منظم',
      moodEn: 'Organized',
      preview: ['#E7DFC9', '#FFFDF4', '#C8B98F', '#B2472E', '#27343C'],
    },
    {
      id: 'football',
      nameAr: 'كرة القدم',
      nameEn: 'Football',
      descAr: 'ملعب كامل في الواجهة: خطوط الملعب، لوحة مباراة، وطاقة تنافسية.',
      descEn: 'A full match-day identity: pitch lines, scoreboard cues, and competitive energy.',
      price: 4,
      icon: '⚽',
      className: 'football',
      family: 'energy',
      familyAr: 'حماسي',
      familyEn: 'Energy',
      moodAr: 'تنافسي',
      moodEn: 'Competitive',
      preview: ['#173D2B', '#F5FFF8', '#2D7A4B', '#E7C95C', '#12251B'],
    },
    {
      id: 'galaxy',
      nameAr: 'المجرة',
      nameEn: 'Galaxy',
      descAr: 'مساحة عميقة ببطاقات زجاجية ونجوم متحركة لجلسات الليل.',
      descEn: 'Deep-space glass, moving stars, and luminous focus surfaces for night sessions.',
      price: 5,
      icon: '🌌',
      className: 'galaxy',
      family: 'immersive',
      familyAr: 'غامر',
      familyEn: 'Immersive',
      moodAr: 'ليلي وملهم',
      moodEn: 'Night · Inspired',
      preview: ['#090B24', '#121735', '#2C3477', '#8B7CFF', '#F5F3FF'],
    },
    {
      id: 'cyber',
      nameAr: 'سايبر',
      nameEn: 'Cyber',
      descAr: 'واجهة HUD مستقبلية: شبكة، حواف مضيئة، وتفاصيل رقمية حادة.',
      descEn: 'A futuristic HUD: scanlines, neon rails, and sharp digital interface details.',
      price: 6,
      icon: '⚡',
      className: 'cyber',
      family: 'immersive',
      familyAr: 'غامر',
      familyEn: 'Immersive',
      moodAr: 'سريع وحاد',
      moodEn: 'Fast · Sharp',
      preview: ['#081213', '#101B20', '#1C5960', '#31F2C2', '#E6FFFB'],
    },
    {
      id: 'nature',
      nameAr: 'الطبيعة',
      nameEn: 'Nature',
      descAr: 'مساحة نباتية ناعمة: أشكال عضوية، فراغات أوسع وألوان مريحة.',
      descEn: 'An organic workspace: soft shapes, generous spacing, and restorative colors.',
      price: 7,
      icon: '🌿',
      className: 'nature',
      family: 'calm',
      familyAr: 'هادئ',
      familyEn: 'Calm',
      moodAr: 'مريح',
      moodEn: 'Restorative',
      preview: ['#DDE8D6', '#F7FBF4', '#B6CBAA', '#5B8A51', '#23372A'],
    },
    {
      id: 'academia',
      nameAr: 'دار الكتب',
      nameEn: 'Dark Academia',
      descAr: 'مكتبة كلاسيكية: ورق كريمي، حبر داكن، ظلال ثقيلة ولمسة فاخرة.',
      descEn: 'A classical library: cream paper, dark ink, weighty shadows, and a scholarly mood.',
      price: 8,
      icon: '📚',
      className: 'academia',
      family: 'classic',
      familyAr: 'كلاسيكي',
      familyEn: 'Classic',
      moodAr: 'دافئ وعميق',
      moodEn: 'Warm · Scholarly',
      preview: ['#241C18', '#F3E8D7', '#67513D', '#B28750', '#F6EEDC'],
    },
    {
      id: 'ocean',
      nameAr: 'المحيط',
      nameEn: 'Ocean',
      descAr: 'عمق أزرق هادئ مع زجاج مائي وتدرجات باردة تساعد على التركيز الطويل.',
      descEn: 'Deep blue calm with watery glass surfaces and cool gradients for long focus sessions.',
      price: 9,
      icon: '🌊',
      className: 'ocean',
      family: 'calm',
      familyAr: 'هادئ',
      familyEn: 'Calm',
      moodAr: 'هادئ وعميق',
      moodEn: 'Calm · Deep',
      preview: ['#071C2B', '#0C2B3A', '#1D6275', '#55D6FF', '#E8FBFF'],
    },
    {
      id: 'sunset',
      nameAr: 'الغروب',
      nameEn: 'Sunset',
      descAr: 'ألوان غروب دافئة مع بطاقات زجاجية وتوهج برتقالي للجلسات المسائية.',
      descEn: 'Warm sunset gradients, soft glass cards, and amber glow for evening study.',
      price: 10,
      icon: '🌅',
      className: 'sunset',
      family: 'energy',
      familyAr: 'حماسي',
      familyEn: 'Energy',
      moodAr: 'دافئ وحيوي',
      moodEn: 'Warm · Vivid',
      preview: ['#341624', '#5A2630', '#8E4B36', '#FFAD5B', '#FFF3E6'],
    },
    {
      id: 'mono',
      nameAr: 'أبيض وأسود',
      nameEn: 'Monochrome',
      descAr: 'واجهة استوديو نظيفة: أبيض وأسود وتباين قوي بدون زحمة بصرية.',
      descEn: 'A clean studio identity: black, white, strong contrast, and almost no decoration.',
      price: 11,
      icon: '◐',
      className: 'mono',
      family: 'balanced',
      familyAr: 'متوازن',
      familyEn: 'Balanced',
      moodAr: 'نقي',
      moodEn: 'Pure',
      preview: ['#E9E9E9', '#FFFFFF', '#B7B7B7', '#1E1E1E', '#111111'],
    },
    {
      id: 'frost',
      nameAr: 'صقيع القطب',
      nameEn: 'Arctic Frost',
      descAr: 'أزرق جليدي صافٍ: أسطح بيضاء باردة، خطوط دقيقة، وتركيز نظيف مثل الهواء الشتوي.',
      descEn: 'Crisp icy blues, cool white surfaces, fine lines, and clean focus like winter air.',
      price: 12,
      icon: '❄️',
      className: 'frost',
      family: 'calm',
      familyAr: 'هادئ',
      familyEn: 'Calm',
      moodAr: 'صافٍ ودقيق',
      moodEn: 'Crisp · Precise',
      preview: ['#D4E4F7', '#FAFAFA', '#B7C6DA', '#4A6FA5', '#1E2F4A'],
    },
    {
      id: 'rose',
      nameAr: 'وردة الصحراء',
      nameEn: 'Desert Rose',
      descAr: 'رمل دافئ ووردي مغبر وعنابي عميق: نعومة أنيقة بحواف مقوّسة وهدوء راقٍ.',
      descEn: 'Warm sand, dusty rose, and deep burgundy: soft elegance with arched corners.',
      price: 13,
      icon: '🌹',
      className: 'rose',
      family: 'balanced',
      familyAr: 'متوازن',
      familyEn: 'Balanced',
      moodAr: 'ناعم وأنيق',
      moodEn: 'Soft · Elegant',
      preview: ['#E8D5C4', '#F8EFE8', '#D4B3A6', '#9C5A4C', '#3B1A2E'],
    },
    {
      id: 'golden',
      nameAr: 'الساعة الذهبية',
      nameEn: 'Golden Hour',
      descAr: 'بني شوكولاتة دافئ مع توهج خردلي: جو مسائي مريح لجلسات مذاكرة طويلة.',
      descEn: 'Chocolate brown with mustard glow: a cozy late-afternoon mood for long study sessions.',
      price: 14,
      icon: '🌇',
      className: 'golden',
      family: 'classic',
      familyAr: 'كلاسيكي',
      familyEn: 'Classic',
      moodAr: 'دافئ ومريح',
      moodEn: 'Warm · Cozy',
      preview: ['#2B241F', '#3A312B', '#6A5848', '#F4A900', '#FBF1DF'],
    },
    {
      id: 'metro',
      nameAr: 'أطلس المترو',
      nameEn: 'Metro Atlas',
      descAr:
        'واجهة مستوحاة من خرائط المترو: محطات مترابطة، خطوط واضحة، وتنقل بصري يجعل كل هدف رحلة لها محطات.',
      descEn:
        'A transit-map workspace with connected stations, route lines, and clear visual journeys from one goal to the next.',
      price: 15,
      icon: '🚇',
      className: 'metro',
      family: 'balanced',
      familyAr: 'متوازن',
      familyEn: 'Balanced',
      moodAr: 'منظم وحيوي',
      moodEn: 'Structured · Lively',
      preview: ['#E9EEF4', '#FFFFFF', '#CBD7E3', '#1677D2', '#18283D'],
    },
    {
      id: 'blueprint',
      nameAr: 'المختبر الهندسي',
      nameEn: 'Blueprint Lab',
      descAr: 'مخطط هندسي داكن بشبكة دقيقة وعلامات قياس وطبقات تقنية هادئة، مناسب للتخطيط العميق.',
      descEn:
        'A calm technical blueprint with a precise grid, measurement marks, and layered engineering surfaces.',
      price: 16,
      icon: '📐',
      className: 'blueprint',
      family: 'immersive',
      familyAr: 'غامر',
      familyEn: 'Immersive',
      moodAr: 'تقني ودقيق',
      moodEn: 'Technical · Precise',
      preview: ['#081B33', '#102B4B', '#244769', '#55D6FF', '#EAF5FF'],
    },
    {
      id: 'swiss',
      nameAr: 'المجلة السويسرية',
      nameEn: 'Swiss Editorial',
      descAr: 'هوية تحريرية جريئة: مساحات بيضاء، عناوين كبيرة، شبكة غير متماثلة ولمسات حمراء محسوبة.',
      descEn:
        'A bold editorial identity with generous whitespace, oversized typography, an asymmetric grid, and precise red accents.',
      price: 17,
      icon: '▦',
      className: 'swiss',
      family: 'classic',
      familyAr: 'كلاسيكي',
      familyEn: 'Classic',
      moodAr: 'تحريري ونقي',
      moodEn: 'Editorial · Minimal',
      preview: ['#F2F1ED', '#FFFFFF', '#D9D7D1', '#E53935', '#171717'],
    },
    {
      id: 'fire',
      nameAr: 'لهيب الجمر',
      nameEn: 'Emberfire',
      descAr:
        'ثيم سري لا يظهر إلا بعد العثور على الجمرة المحبوسة داخل مؤقّت الصقيع. هوية داكنة دافئة بلمسات نحاسية ورسوم حركية مرسومة.',
      descEn:
        'A secret theme revealed by finding the ember sealed inside the Frost timer. A warm charcoal identity with copper accents and illustrated motion.',
      price: 0,
      icon: '🔥',
      className: 'fire',
      family: 'energy',
      familyAr: 'سري · حماسي',
      familyEn: 'Secret · Energy',
      moodAr: 'دافئ وسينمائي',
      moodEn: 'Warm · Cinematic',
      preview: ['#241A18', '#342622', '#684035', '#C56B43', '#F2DFD0'],
    },
    {
      id: 'anime',
      nameAr: 'أنمي: شقّ السماء',
      nameEn: 'Anime: Skybreaker',
      descAr: 'هوية أنمي مرسومة بالحبر: لوحات مانجا، سماء ليلية، خطوط سرعة، ومشاهد انتقال 60 إطارًا في الثانية.',
      descEn:
        'A hand-inked anime identity with manga panels, night-sky scenery, speed lines, and 60fps slash transitions.',
      price: 0,
      icon: '⚔️',
      className: 'anime',
      family: 'immersive',
      familyAr: 'سري · أنمي',
      familyEn: 'Secret · Anime',
      moodAr: 'حركي وسينمائي',
      moodEn: 'Dynamic · Cinematic',
      preview: ['#101522', '#202A3D', '#3A4964', '#E85A70', '#F4F5FA'],
    },
    {
      id: 'manga',
      nameAr: 'الفصل المفقود · مانجا',
      nameEn: 'The Lost Chapter · Manga',
      descAr: 'هوية مانجا كاملة بورق رمادي دافئ، حبر مطبوع، سحب تفكير وانتقالات تقليب صفحات من اليمين إلى اليسار. تظهر في المتجر بعد اكتشافها وتصبح مملوكة لحسابك.',
      descEn: 'A complete manga identity with warm grey paper, printed ink, thought clouds and right-to-left page-turn transitions. It enters the store after discovery and is permanently owned by your account.',
      price: 0,
      icon: '漫',
      className: 'manga',
      family: 'immersive',
      familyAr: 'مانجا · غامر',
      familyEn: 'Manga · Immersive',
      moodAr: 'حبر وسينما وورق',
      moodEn: 'Ink · Cinematic · Paper',
      preview: ['#D7D4CE', '#E9E6DF', '#77757B', '#4B4A4E', '#29292B'],
    },
  ];
  var storeState = { owned: ['classic'], active: 'classic', spentMinutes: 0 };
  function mangaUnlockedForCurrentAccount() {
    try {
      return localStorage.getItem(scopedKey('kashkool.secret.manga.unlocked.v1')) === '1';
    } catch (e) { return false; }
  }
  var storeFilter = 'all';
  function loadStoreState() {
    try {
      var x = JSON.parse(localStorage.getItem(scopedKey(STORE_KEY)) || 'null');
      if (x && typeof x === 'object') {
        storeState.owned = Array.isArray(x.owned) && x.owned.length ? x.owned : ['classic'];
        storeState.active = String(x.active || 'classic');
        storeState.spentMinutes = Math.max(0, +x.spentMinutes || 0);
      }
    } catch (e) {}
    if (storeState.owned.indexOf('classic') < 0) storeState.owned.unshift('classic');
    if (window.KK_FIRE_UNLOCKED && storeState.owned.indexOf('fire') < 0) storeState.owned.push('fire');
    if (window.KK_ANIME_UNLOCKED && storeState.owned.indexOf('anime') < 0) storeState.owned.push('anime');
    if (mangaUnlockedForCurrentAccount() && storeState.owned.indexOf('manga') < 0) {
      storeState.owned.push('manga');
      saveStoreState();
    }
    if (
      !STORE_THEMES.some(function (t) {
        return t.id === storeState.active;
      })
    )
      storeState.active = 'classic';
  }
  function saveStoreState() {
    try {
      localStorage.setItem(scopedKey(STORE_KEY), JSON.stringify(storeState));
    } catch (e) {}
  }
  function totalStudyMinutes() {
    return loadStudyStats().reduce(function (sum, x) {
      return sum + Math.max(0, +x.minutes || 0);
    }, 0);
  }
  function studyWalletMinutes() {
    return Math.max(0, totalStudyMinutes() - storeState.spentMinutes);
  }
  function formatStudyWallet(mins) {
    var h = Math.floor(mins / 60),
      m = mins % 60;
    return h + (lang === 'en' ? 'h' : ' س') + (m ? (lang === 'en' ? ' ' + m + 'm' : ' و ' + m + ' د') : '');
  }
  function applyStoreTheme() {
    var active = storeState.active || 'classic',
      root = document.documentElement;
    root.setAttribute('data-store-theme', active);
    root.classList.toggle('has-store-theme', active !== 'classic');
    if (active === 'classic') {
      applyTheme(appSettings.theme === 'system' ? null : appSettings.theme);
    } else {
      var baseModes = {
        school: 'light',
        football: 'dark',
        galaxy: 'dark',
        cyber: 'dark',
        nature: 'light',
        academia: 'dark',
        ocean: 'dark',
        sunset: 'dark',
        mono: 'light',
        frost: 'light',
        rose: 'light',
        golden: 'dark',
        metro: 'light',
        blueprint: 'dark',
        swiss: 'light',
        fire: 'dark',
        anime: 'dark',
        manga: 'light',
      };
      root.setAttribute('data-theme', baseModes[active] || 'light');
      if (window.KashkoolThemeStudioRefreshMode) window.KashkoolThemeStudioRefreshMode();
    }
  }
  function renderStore() {
    loadStoreState();
    applyStoreTheme();
    var balance = studyWalletMinutes(),
      b = $('storeBalance'),
      grid = $('storeGrid');
    if (b) b.textContent = formatStudyWallet(balance);
    if (!grid) return;
    var en = lang === 'en';
    var families = [
      ['all', en ? 'All' : 'الكل'],
      ['balanced', en ? 'Balanced' : 'متوازن'],
      ['classic', en ? 'Classic' : 'كلاسيكي'],
      ['calm', en ? 'Calm' : 'هادئ'],
      ['energy', en ? 'Energy' : 'حماسي'],
      ['immersive', en ? 'Immersive' : 'غامر'],
    ];
    var visible = STORE_THEMES.filter(function (t) {
      return (
        (t.id !== 'fire' || window.KK_FIRE_UNLOCKED === true) &&
        (t.id !== 'anime' || window.KK_ANIME_UNLOCKED === true) &&
        (t.id !== 'manga' || mangaUnlockedForCurrentAccount()) &&
        (storeFilter === 'all' || t.family === storeFilter)
      );
    });
    grid.innerHTML =
      '<div class="storeStudioIntro" id="themeStudio">' +
      '<div class="storeStudioIntro__copy"><span class="storeStudioIntro__eyebrow">' +
      esc(en ? 'THEME STUDIO' : 'استوديو الثيمات') +
      '</span><h3>' +
      esc(en ? 'Choose a visual identity, not just a color' : 'اختار هوية بصرية كاملة، مش مجرد لون') +
      '</h3><p>' +
      esc(
        en
          ? 'Every theme changes surfaces, spacing, navigation, buttons, focus cues and atmosphere.'
          : 'كل ثيم بيغير البطاقات، المسافات، التنقل، الأزرار، إشارات التركيز والجو العام للموقع.',
      ) +
      '</p></div>' +
      '<div class="storeStudioIntro__filters" role="group" aria-label="' +
      esc(en ? 'Theme families' : 'عائلات الثيمات') +
      '">' +
      families
        .map(function (f) {
          return (
            '<button type="button" class="themeFilter" data-theme-filter="' +
            f[0] +
            '" aria-pressed="' +
            (storeFilter === f[0] ? 'true' : 'false') +
            '">' +
            esc(f[1]) +
            '</button>'
          );
        })
        .join('') +
      '</div></div>' +
      '<div class="storeThemeGrid">' +
      visible
        .map(function (t) {
          var owned = storeState.owned.indexOf(t.id) >= 0,
            active = storeState.active === t.id,
            can = balance >= t.price * 60;
          var p = t.preview;
          return (
            '<article class="storeCard ' +
            (active ? 'is-active ' : '') +
            'themeCard--' +
            t.className +
            '" data-theme-family="' +
            esc(t.family) +
            '">' +
            (active ? '<span class="storeBadge">' + (en ? 'Active' : 'مفعّل') + '</span>' : '') +
            '<div class="storePreview themePreview--' +
            t.className +
            '" style="--preview-bg:' +
            p[0] +
            ';--preview-grid:' +
            p[2] +
            ';--preview-accent:' +
            p[3] +
            ';--preview-ink:' +
            p[4] +
            '"><div class="storePreview__texture"></div><div class="storePreview__grid"></div><div class="storePreview__sceneIcon">' +
            t.icon +
            '</div><div class="storePreview__bar"></div><div class="storePreview__line"></div><div class="storePreview__line short"></div><div class="storePreview__miniCard"></div></div>' +
            '<div class="storeCard__body"><div class="storeCard__top"><h3>' +
            (en ? t.nameEn : t.nameAr) +
            '</h3><span class="' +
            (owned ? 'storeOwned' : 'storePrice') +
            '">' +
            (owned
              ? en
                ? 'Owned'
                : 'مملوك'
              : t.price === 0
                ? en
                  ? 'Free'
                  : 'مجاني'
                : t.price + (en ? ' study h' : ' ساعة مذاكرة')) +
            '</span></div>' +
            '<p>' +
            (en ? t.descEn : t.descAr) +
            '</p>' +
            '<div class="themeMeta"><span><b>' +
            esc(en ? 'Family' : 'العائلة') +
            '</b>' +
            esc(en ? t.familyEn : t.familyAr) +
            '</span><span><b>' +
            esc(en ? 'Mood' : 'المزاج') +
            '</b>' +
            esc(en ? t.moodEn : t.moodAr) +
            '</span></div>' +
            '<div class="storeActions">' +
            (owned
              ? '<button class="storeUse" type="button" data-store-use="' +
                t.id +
                '" ' +
                (active ? 'disabled' : '') +
                '>' +
                (active ? (en ? 'Active' : 'مفعّل') : en ? 'Use theme' : 'تفعيل') +
                '</button>'
              : '<button class="storeBuy" type="button" data-store-buy="' +
                t.id +
                '" ' +
                (can ? '' : 'disabled') +
                '>' +
                (en ? 'Buy · ' : 'شراء · ') +
                (t.price === 0 ? (en ? 'Free' : 'مجاني') : t.price + (en ? ' h' : ' س')) +
                '</button>') +
            '</div></div></article>'
          );
        })
        .join('') +
      '</div>';
  }
  window.KK_REFRESH_THEME_STORE = renderStore;
  function buyStoreTheme(id) {
    loadStoreState();
    var t = STORE_THEMES.find(function (x) {
      return x.id === id;
    });
    if (!t) return;
    if (storeState.owned.indexOf(id) >= 0) {
      storeState.active = id;
      saveStoreState();
      applyStoreTheme();
      renderStore();
      toast(L('الثيم اتفعّل.', 'Theme activated.'));
      return;
    }
    var cost = t.price * 60,
      balance = studyWalletMinutes();
    if (balance < cost) {
      toast(
        L(
          'محتاج ' + formatStudyWallet(cost - balance) + ' مذاكرة إضافية.',
          'You need ' + formatStudyWallet(cost - balance) + ' more study time.',
        ),
      );
      return;
    }
    storeState.spentMinutes += cost;
    storeState.owned.push(id);
    storeState.active = id;
    saveStoreState();
    applyStoreTheme();
    renderStore();
    toast(L('اشتريت ' + t.nameAr + ' واتفعل.', 'Bought ' + t.nameEn + ' and activated it.'));
  }
  /* ---------------- render ---------------- */
  function renderTodayHeader() {
    var now = new Date();
    $('todayName').innerHTML = bilingualPair(DAYS_AR[todayIdx()], DAYS_EN[todayIdx()], 'todayBilingualHead');
    $('todayDate').textContent = fmtDate(now) + ' ' + now.getFullYear();
  }

  /* ---------------- المسار / Track: enhanced weekly, monthly and yearly planner ---------------- */
  var TRK,
    TV = {
      s: 'week',
      o: 0,
      sel: null,
      open: false,
      filter: '',
      editId: null,
      panel: 'overview',
      taskEditId: null,
      createOpen: true,
      pendingTemplateMilestones: [],
    };
  function trkLoad() {
    var v3 = null,
      v2 = null,
      migrated = false;
    try {
      v3 = JSON.parse(localStorage.getItem(scopedKey('kashkool.track.v3')) || 'null');
    } catch (e) {
      v3 = null;
    }
    if (!v3) {
      try {
        v2 = JSON.parse(localStorage.getItem(scopedKey('kashkool.track.v2')) || 'null');
      } catch (e) {
        v2 = null;
      }
      migrated = !!v2;
    }
    var raw = v3 || v2 || {};
    TRK = Object.assign(
      {
        schemaVersion: 3,
        tracks: [],
        items: [],
        milestones: [],
        tasks: [],
        notes: {},
        win: ['07:00', '22:00'],
        trash: null,
      },
      raw,
    );
    TRK.schemaVersion = 3;
    if (!Array.isArray(TRK.tracks)) TRK.tracks = [];
    if (!Array.isArray(TRK.items)) TRK.items = [];
    if (!Array.isArray(TRK.milestones)) TRK.milestones = [];
    if (!Array.isArray(TRK.tasks)) TRK.tasks = [];
    if (!TRK.notes || typeof TRK.notes !== 'object' || Array.isArray(TRK.notes)) TRK.notes = {};
    if (
      !Array.isArray(TRK.win) ||
      TRK.win.length !== 2 ||
      !TRK.win[0] ||
      !TRK.win[1] ||
      mins(TRK.win[1]) <= mins(TRK.win[0])
    )
      TRK.win = ['07:00', '22:00'];
    TRK.tracks.forEach(function (t) {
      if (!t.id) t.id = uid();
      t.name = String(t.name || L('مسار جديد', 'New track')).slice(0, 40);
      t.color = /^#[0-9a-f]{6}$/i.test(t.color || '') ? t.color : DEFAULT_COLOR;
      t.goal = String(t.goal || '').slice(0, 180);
      t.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate || '') ? t.dueDate : '';
      t.archived = !!t.archived;
      if (!t.createdAt) t.createdAt = Date.now();
    });
    TRK.milestones = TRK.milestones
      .filter(function (m) {
        return (
          m &&
          TRK.tracks.some(function (t) {
            return t.id === m.trackId;
          })
        );
      })
      .map(function (m) {
        m.id = String(m.id || uid());
        m.title = String(m.title || L('مرحلة بدون عنوان', 'Untitled milestone')).slice(0, 80);
        m.description = String(m.description || '').slice(0, 300);
        m.startDate = /^\d{4}-\d{2}-\d{2}$/.test(m.startDate || '') ? m.startDate : '';
        m.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(m.dueDate || '') ? m.dueDate : '';
        return m;
      });
    var validStatuses = ['todo', 'doing', 'blocked', 'done'],
      validPriorities = ['low', 'normal', 'high', 'urgent'];
    TRK.tasks = TRK.tasks
      .filter(function (t) {
        return (
          t &&
          TRK.tracks.some(function (x) {
            return x.id === t.trackId;
          })
        );
      })
      .map(function (t) {
        t.id = String(t.id || uid());
        t.title = String(t.title || '').slice(0, 100);
        t.status = validStatuses.indexOf(t.status) >= 0 ? t.status : 'todo';
        t.priority = validPriorities.indexOf(t.priority) >= 0 ? t.priority : 'normal';
        t.milestoneId = TRK.milestones.some(function (m) {
          return m.id === t.milestoneId && m.trackId === t.trackId;
        })
          ? t.milestoneId
          : '';
        t.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate || '') ? t.dueDate : '';
        t.estimateMinutes = Math.max(0, Math.min(100000, Math.round(+t.estimateMinutes || 0)));
        t.actualMinutes = Math.max(0, Math.min(1000000, Math.round(+t.actualMinutes || 0)));
        t.notes = String(t.notes || '').slice(0, 2000);
        t.subjectId = String(t.subjectId || '');
        t.dependsOn = Array.isArray(t.dependsOn)
          ? Array.from(new Set(t.dependsOn.map(String))).filter(function (depId) {
              return depId !== t.id;
            })
          : [];
        t.sessionReviews = Array.isArray(t.sessionReviews) ? t.sessionReviews.slice(-10) : [];
        if (!t.createdAt) t.createdAt = Date.now();
        return t;
      });
    if (TRK.trash && typeof TRK.trash !== 'object') TRK.trash = null;
    if (
      TV.filter &&
      !TRK.tracks.some(function (t) {
        return t.id === TV.filter;
      })
    )
      TV.filter = '';
    if (
      TV.editId &&
      !TRK.items.some(function (i) {
        return i.id === TV.editId;
      })
    )
      TV.editId = null;
    if (
      TV.taskEditId &&
      !TRK.tasks.some(function (t) {
        return t.id === TV.taskEditId;
      })
    )
      TV.taskEditId = null;
    if (migrated) trkSave();
  }
  function trkSave() {
    TRK.schemaVersion = 3;
    TRK.updatedAt = Date.now();
    var serialized = '';
    try {
      serialized = JSON.stringify(TRK);
      /* V3 is the canonical record. Save it first so a legacy compatibility write
         can never make a successful V3 save look like a failed operation. */
      localStorage.setItem(scopedKey('kashkool.track.v3'), serialized);
    } catch (e) {
      toast(
        L(
          'تعذر حفظ المسار. مساحة التخزين قد تكون ممتلئة.',
          'Could not save the planner. Browser storage may be full.',
        ),
      );
      return false;
    }
    try {
      /* V48 only needs the original calendar shape. Do not duplicate the new
         milestone/task payload in the legacy key; this conserves localStorage. */
      localStorage.setItem(
        scopedKey('kashkool.track.v2'),
        JSON.stringify({ tracks: TRK.tracks, items: TRK.items, notes: TRK.notes, win: TRK.win }),
      );
    } catch (e) {
      /* V3 remains saved; older builds may see a stale compatibility copy. */
    }
    try {
      if (window.KashKoolLearningOS && window.KashKoolLearningOS.onTrackSave)
        window.KashKoolLearningOS.onTrackSave(TRK);
    } catch (e) {}
    return true;
  }
  function trkY(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function trkD(s) {
    var p = String(s || '').split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function trkAdd(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }
  function trkIdx(d) {
    return (d.getDay() + 1) % 7;
  }
  function trkGap(a, b) {
    return Math.round((b - a) / 864e5);
  }
  function trkVisible(i) {
    return !TV.filter || i.trackId === TV.filter;
  }
  function trkOn(ds) {
    return TRK.items
      .filter(function (i) {
        return i.start <= ds && ds <= i.end && trkVisible(i);
      })
      .sort(function (a, b) {
        return (a.from || '').localeCompare(b.from || '') || (a.title || '').localeCompare(b.title || '');
      });
  }
  function trkDur(i) {
    return i.from && i.to ? Math.max(0, mins(i.to) - mins(i.from)) : 0;
  }
  function trkTr(id) {
    return (
      TRK.tracks.filter(function (t) {
        return t.id === id;
      })[0] || { name: '?', color: DEFAULT_COLOR }
    );
  }
  function trkNm(i) {
    return i.title || trkTr(i.trackId).name;
  }
  function trkFm(m) {
    m = Math.max(0, Math.round(m));
    var h = Math.floor(m / 60),
      r = m % 60;
    if (!h) return r + L(' د', ' m');
    return h + L(' س', ' h') + (r ? ' ' + r + L(' د', ' m') : '');
  }
  function trkDn(d) {
    return d.getDate() + ' ' + MONTHS[d.getMonth()];
  }
  function trkDayItemsMarkup(ds) {
    var its = trkOn(ds);
    if (!its.length)
      return (
        '<div class="tkEmpty"><b>' +
        L('اليوم لسه فاضي', 'Nothing planned yet') +
        '</b>' +
        L('أضف مهمة أو فترة مذاكرة عشان تظهر هنا.', 'Add a task or study block to see it here.') +
        '</div>'
      );
    return its
      .map(function (x) {
        return (
          '<div class="tkL" style="--c:' +
          trkTr(x.trackId).color +
          '"><i></i><span>' +
          esc(trkNm(x)) +
          '<small>' +
          (x.from && x.to ? x.from + '–' + x.to : L('طوال اليوم', 'All day')) +
          (x.start !== x.end ? ' · ' + trkDn(trkD(x.start)) + ' – ' + trkDn(trkD(x.end)) : '') +
          '</small></span><button type="button" data-edit="' +
          x.id +
          '" aria-label="' +
          L('تعديل ', 'Edit ') +
          esc(trkNm(x)) +
          '">' +
          L('تعديل', 'Edit') +
          '</button><button type="button" data-del="' +
          x.id +
          '" aria-label="' +
          L('حذف ', 'Delete ') +
          esc(trkNm(x)) +
          '">×</button></div>'
        );
      })
      .join('');
  }
  function trkStatsMarkup(td) {
    var all = TRK.items.filter(trkVisible),
      monthStart = trkY(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      monthEnd = trkY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    var mCount = all.filter(function (i) {
        return i.start <= monthEnd && i.end >= monthStart;
      }).length,
      todayCount = trkOn(td).length;
    return (
      '<div class="tkStats"><div class="tkStat"><span>' +
      L('المسارات', 'Tracks') +
      '</span><b>' +
      TRK.tracks.filter(function (t) {
        return !TV.filter || t.id === TV.filter;
      }).length +
      '</b></div><div class="tkStat"><span>' +
      L('الخطط المحفوظة', 'Saved plans') +
      '</span><b>' +
      all.length +
      '</b></div><div class="tkStat"><span>' +
      L('خطط هذا الشهر', 'Plans this month') +
      '</span><b>' +
      mCount +
      '</b></div><div class="tkStat"><span>' +
      L('خطط اليوم', 'Plans today') +
      '</span><b>' +
      todayCount +
      '</b></div></div>'
    );
  }
  function trkTrackManager() {
    var list = TRK.tracks
      .map(function (t) {
        var n = TRK.items.filter(function (i) {
          return i.trackId === t.id;
        }).length;
        return (
          '<div class="tkTrackItem"><i class="tkTrackDot" style="--c:' +
          t.color +
          '"></i><div class="tkTrackInfo"><b>' +
          esc(t.name) +
          '</b><small>' +
          n +
          ' ' +
          L('خطة محفوظة', 'saved plan(s)') +
          '</small></div><button type="button" class="tkTrackDelete" data-track-archive="' +
          t.id +
          '" aria-label="' +
          (t.archived ? L('استعادة المسار', 'Restore track') : L('أرشفة المسار', 'Archive track')) +
          '" title="' +
          (t.archived ? L('استعادة', 'Restore') : L('أرشفة', 'Archive')) +
          '">' +
          (t.archived ? '↶' : '▣') +
          '</button><button type="button" class="tkTrackDelete" data-deltrack="' +
          t.id +
          '" aria-label="' +
          L('حذف المسار ', 'Delete track ') +
          esc(t.name) +
          '" title="' +
          L('حذف المسار', 'Delete track') +
          '">×</button></div>'
        );
      })
      .join('');
    return (
      '<div class="tkTrackList">' +
      (list ||
        '<div class="tkEmpty" style="grid-column:1/-1"><b>' +
          L('ابدأ بأول مسار', 'Start your first track') +
          '</b>' +
          L(
            'مثلاً: الرياضيات، العربي، الإنجليزي أو خطة امتحانات.',
            'For example: Math, Arabic, English, or an exam plan.',
          ) +
          '</div>') +
      '</div>'
    );
  }
  function trkWeek() {
    var b = trkAdd(new Date(), TV.o * 7),
      ws = trkAdd(b, -trkIdx(b)),
      w0 = mins(TRK.win[0]),
      w1 = mins(TRK.win[1]),
      PX = 40,
      H = ((w1 - w0) / 60) * PX,
      tod = trkY(new Date()),
      days = [],
      tot = 0,
      mx = 1,
      d,
      h;
    for (d = 0; d < 7; d++) {
      var dt = trkAdd(ws, d),
        ds = trkY(dt),
        its = trkOn(ds),
        m = 0;
      its.forEach(function (i) {
        m += trkDur(i);
      });
      days.push({ dt: dt, ds: ds, its: its, m: m });
      tot += m;
      mx = Math.max(mx, m);
    }
    var o = '<div class="tkGut" style="height:42px"></div>',
      gut = '<div class="tkGut" style="height:' + H + 'px">';
    for (h = Math.ceil(w0 / 60); h * 60 <= w1; h++)
      gut += '<span style="top:' + ((h * 60 - w0) / 60) * PX + 'px">' + pad2(h) + '</span>';
    gut += '</div>';
    days.forEach(function (x) {
      o +=
        '<div class="tkH' +
        (x.ds === tod ? ' is-today' : '') +
        '" data-sel="' +
        x.ds +
        '" title="' +
        L('اعرض خطط اليوم', 'Show this day’s plans') +
        '"><b>' +
        DAYS[trkIdx(x.dt)] +
        '</b><span class="tkN">' +
        x.dt.getDate() +
        '</span><small>' +
        (x.m ? trkFm(x.m) : L('لا وقت محدد', 'No timed blocks')) +
        '</small><i style="width:' +
        (x.m / mx) * 100 +
        '%"></i></div>';
    });
    o +=
      '<div class="tkGut" style="height:auto;min-height:38px;display:grid;place-items:center;color:var(--ink-faint);font-size:.65rem">' +
      L('اليوم كله', 'All day') +
      '</div>';
    days.forEach(function (x) {
      o +=
        '<div>' +
        x.its
          .filter(function (i) {
            return !trkDur(i);
          })
          .map(function (i) {
            return (
              '<div class="tkAll" style="--c:' +
              trkTr(i.trackId).color +
              '">' +
              esc(trkNm(i)) +
              '<div class="tkAllActions"><button type="button" data-edit="' +
              i.id +
              '">' +
              L('تعديل', 'Edit') +
              '</button><button type="button" data-del="' +
              i.id +
              '" aria-label="' +
              L('حذف الخطة', 'Delete plan') +
              '">×</button></div></div>'
            );
          })
          .join('') +
        '</div>';
    });
    o += gut;
    days.forEach(function (x) {
      var ev = x.its.filter(trkDur).map(function (i) {
        return {
          f: mins(i.from),
          t: mins(i.to),
          c: trkTr(i.trackId).color,
          n: trkNm(i),
          id: i.id,
          fr: i.from,
          to: i.to,
        };
      });
      state.entries.forEach(function (e) {
        if (trkIdx(x.dt) === +e.day && !e.noTime && e.to)
          ev.push({
            f: mins(e.from),
            t: mins(e.to),
            g: 1,
            n: e.title || (subjectById(e.subjectId) || {}).name || '',
            fr: e.from,
            to: e.to,
          });
      });
      o +=
        '<div class="tkCol" style="height:' +
        H +
        'px">' +
        ev
          .map(function (v) {
            var a = Math.max(v.f, w0),
              z = Math.min(v.t, w1);
            if (z <= a) return '';
            return (
              '<div class="tkB' +
              (v.g ? ' g' : '') +
              '" style="top:' +
              ((a - w0) / 60) * PX +
              'px;height:' +
              Math.max(17, ((z - a) / 60) * PX - 1) +
              'px;--c:' +
              (v.c || 'var(--ink-faint)') +
              '" title="' +
              esc(v.n) +
              '"><b>' +
              esc(v.fr) +
              '–' +
              esc(v.to) +
              '</b> ' +
              esc(v.n) +
              (v.id
                ? '<button type="button" data-del="' +
                  v.id +
                  '" aria-label="' +
                  L('حذف الخطة', 'Delete plan') +
                  '">×</button>'
                : '') +
              '</div>'
            );
          })
          .join('') +
        '</div>';
    });
    var panel = '';
    if (TV.sel) {
      var sd = trkD(TV.sel);
      panel =
        '<div class="tkDay"><div class="tkDayHead"><b>' +
        DAYS[trkIdx(sd)] +
        ' ' +
        trkDn(sd) +
        '</b><button class="tkAction" type="button" data-act="quickAdd" data-date="' +
        TV.sel +
        '">＋ ' +
        L('أضف خطة لهذا اليوم', 'Add a plan for this day') +
        '</button></div>' +
        trkDayItemsMarkup(TV.sel) +
        '<textarea data-note="' +
        TV.sel +
        '" aria-label="' +
        L('ملاحظة اليوم', 'Day note') +
        '" placeholder="' +
        L('ملاحظة اليوم…', 'Note for this day…') +
        '">' +
        esc(TRK.notes[TV.sel] || '') +
        '</textarea></div>';
    }
    return {
      t: trkDn(ws) + ' – ' + trkDn(trkAdd(ws, 6)) + ' · ' + L('وقت محدد: ', 'Timed: ') + trkFm(tot),
      h:
        '<div class="tkLegend"><span><i style="--c:var(--mark)"></i>' +
        L('خطة المسار', 'Track plan') +
        '</span><span><i style="--c:var(--ink-faint)"></i>' +
        L('موعد الجدول الأساسي', 'Existing schedule entry') +
        '</span><span>' +
        L('اضغط على اسم اليوم لعرض خططه وملاحظته.', 'Select a day header to view its plans and note.') +
        '</span></div><div class="tkWeek">' +
        o +
        '</div>' +
        panel,
    };
  }
  function trkMonth() {
    var b = new Date(),
      m0 = new Date(b.getFullYear(), b.getMonth() + TV.o, 1),
      n = new Date(m0.getFullYear(), m0.getMonth() + 1, 0).getDate(),
      first = trkAdd(m0, -trkIdx(m0)),
      rows = Math.ceil((trkIdx(m0) + n) / 7),
      tod = trkY(b),
      i,
      o = '';
    for (i = 0; i < 7; i++)
      o += '<div class="tkWd">' + (lang === 'en' ? DAYS[i].slice(0, 3) : DAYS[i]) + '</div>';
    for (i = 0; i < rows * 7; i++) {
      var dt = trkAdd(first, i),
        ds = trkY(dt),
        its = trkOn(ds);
      o +=
        '<div role="button" tabindex="0" aria-label="' +
        DAYS[trkIdx(dt)] +
        ' ' +
        trkDn(dt) +
        '" class="tkCell' +
        (dt.getMonth() !== m0.getMonth() ? ' o' : '') +
        (ds === tod ? ' t' : '') +
        (ds === TV.sel ? ' s' : '') +
        '" data-sel="' +
        ds +
        '"><b class="tkN">' +
        dt.getDate() +
        '</b>' +
        (TRK.notes[ds] ? ' ✎' : '') +
        its
          .slice(0, 3)
          .map(function (x) {
            return (
              '<span class="tkP" style="--c:' + trkTr(x.trackId).color + '">' + esc(trkNm(x)) + '</span>'
            );
          })
          .join('') +
        (its.length > 3 ? '<small>+' + (its.length - 3) + '</small>' : '') +
        '</div>';
    }
    var p = '';
    if (TV.sel) {
      var sd = trkD(TV.sel),
        its2 = trkOn(TV.sel);
      p =
        '<div class="tkDay"><div class="tkDayHead"><b>' +
        DAYS[trkIdx(sd)] +
        ' ' +
        trkDn(sd) +
        '</b><button class="tkAction" type="button" data-act="quickAdd" data-date="' +
        TV.sel +
        '">＋ ' +
        L('أضف خطة لهذا اليوم', 'Add a plan for this day') +
        '</button></div>' +
        trkDayItemsMarkup(TV.sel) +
        '<textarea data-note="' +
        TV.sel +
        '" aria-label="' +
        L('ملاحظة اليوم', 'Day note') +
        '" placeholder="' +
        L('ملاحظة اليوم…', 'Note for this day…') +
        '">' +
        esc(TRK.notes[TV.sel] || '') +
        '</textarea></div>';
    }
    return { t: MONTHS[m0.getMonth()] + ' ' + m0.getFullYear(), h: '<div class="tkMon">' + o + '</div>' + p };
  }
  function trkYear() {
    var y = new Date().getFullYear() + TV.o,
      ys = new Date(y, 0, 1),
      N = trkGap(ys, new Date(y + 1, 0, 1)),
      m,
      o = '<div class="tkYm"><div></div><div>';
    for (m = 0; m < 12; m++)
      o +=
        '<span data-month="' +
        m +
        '" style="width:' +
        (new Date(y, m + 1, 0).getDate() / N) * 100 +
        '%">' +
        MONTHS[m].slice(0, lang === 'en' ? 3 : 99) +
        '</span>';
    o += '</div></div>';
    TRK.tracks
      .filter(function (t) {
        return !TV.filter || t.id === TV.filter;
      })
      .forEach(function (t) {
        var its = TRK.items
            .filter(function (i) {
              return i.trackId === t.id && i.end >= y + '-01-01' && i.start <= y + '-12-31';
            })
            .sort(function (a, b) {
              return a.start < b.start ? -1 : 1;
            }),
          lanes = [],
          bars = '';
        its.forEach(function (i) {
          var s = i.start < y + '-01-01' ? ys : trkD(i.start),
            e = i.end > y + '-12-31' ? new Date(y, 11, 31) : trkD(i.end),
            k = 0;
          while (lanes[k] && lanes[k] >= i.start) k++;
          lanes[k] = i.end;
          bars +=
            '<a role="button" tabindex="0" data-goto="' +
            i.start +
            '" style="--c:' +
            t.color +
            ';top:' +
            (3 + k * 24) +
            'px;inset-inline-start:' +
            (trkGap(ys, s) / N) * 100 +
            '%;width:' +
            ((trkGap(s, e) + 1) / N) * 100 +
            '%" title="' +
            esc(trkNm(i)) +
            '">' +
            esc(trkNm(i)) +
            '</a>';
        });
        o +=
          '<div class="tkYl"><b style="color:' +
          t.color +
          '">' +
          esc(t.name) +
          '</b><div class="tkYa" style="height:' +
          (Math.max(1, lanes.length) * 24 + 6) +
          'px">' +
          bars +
          '</div></div>';
      });
    if (
      !TRK.tracks.filter(function (t) {
        return !TV.filter || t.id === TV.filter;
      }).length
    )
      o +=
        '<div class="tkEmpty"><b>' +
        L('لا توجد مسارات بعد', 'No tracks yet') +
        '</b>' +
        L('أضف مسارًا من الزر أعلى المخطط للبدء.', 'Add a track above to start planning.') +
        '</div>';
    var td = new Date();
    if (td.getFullYear() === y)
      o = o.replace(
        /(<div class="tkYa"[^>]*>)/g,
        '$1<i class="tkNow" style="inset-inline-start:' + (trkGap(ys, td) / N) * 100 + '%"></i>',
      );
    return {
      t: String(y),
      h:
        '<div class="tkYr"><div class="tkYi">' +
        o +
        '</div></div><div class="tkFormNote">' +
        L(
          'اضغط على اسم الشهر للانتقال إليه، أو على أي خطة لفتح تاريخ بدايتها.',
          'Select a month to jump to it, or choose a plan to open its start date.',
        ) +
        '</div>',
    };
  }
  function trkTaskStatusName(status) {
    return (
      {
        todo: L('لم تبدأ', 'To do'),
        doing: L('قيد التنفيذ', 'In progress'),
        blocked: L('متوقفة', 'Blocked'),
        done: L('مكتملة', 'Done'),
      }[status] || L('لم تبدأ', 'To do')
    );
  }
  function trkTaskPriorityName(priority) {
    return (
      {
        low: L('منخفضة', 'Low'),
        normal: L('عادية', 'Normal'),
        high: L('عالية', 'High'),
        urgent: L('عاجلة', 'Urgent'),
      }[priority] || L('عادية', 'Normal')
    );
  }
  function trkTaskCounts(trackId) {
    var list = TRK.tasks.filter(function (t) {
      return !trkTr(t.trackId).archived && (!trackId || t.trackId === trackId);
    });
    return {
      all: list.length,
      done: list.filter(function (t) {
        return t.status === 'done';
      }).length,
      doing: list.filter(function (t) {
        return t.status === 'doing';
      }).length,
      blocked: list.filter(function (t) {
        return t.status === 'blocked';
      }).length,
      todo: list.filter(function (t) {
        return t.status === 'todo';
      }).length,
      overdue: list.filter(function (t) {
        return t.status !== 'done' && t.dueDate && t.dueDate < trkY(new Date());
      }).length,
      planned: list.reduce(function (a, t) {
        return a + (+t.estimateMinutes || 0);
      }, 0),
      actual: list.reduce(function (a, t) {
        return a + (+t.actualMinutes || 0);
      }, 0),
    };
  }
  function trkPct(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  }
  function trkMilestonePct(m) {
    var tasks = TRK.tasks.filter(function (t) {
        return t.milestoneId === m.id;
      }),
      done = tasks.filter(function (t) {
        return t.status === 'done';
      }).length;
    return trkPct(done, tasks.length);
  }
  function trkTaskById(id) {
    return (
      TRK.tasks.filter(function (t) {
        return t.id === id;
      })[0] || null
    );
  }
  function trkTaskCard(task) {
    var track = trkTr(task.trackId),
      late = task.status !== 'done' && task.dueDate && task.dueDate < trkY(new Date());
    var milestone = TRK.milestones.filter(function (m) {
      return m.id === task.milestoneId;
    })[0];
    var statusAction =
      task.status === 'done'
        ? '<button type="button" data-task-id="' +
          task.id +
          '" data-task-state="todo">' +
          L('إعادة فتح', 'Reopen') +
          '</button>'
        : task.status === 'doing'
          ? '<button type="button" data-task-id="' +
            task.id +
            '" data-task-state="done">' +
            L('إكمال', 'Complete') +
            '</button><button type="button" data-task-id="' +
            task.id +
            '" data-task-state="blocked">' +
            L('إيقاف', 'Block') +
            '</button>'
          : task.status === 'blocked'
            ? '<button type="button" data-task-id="' +
              task.id +
              '" data-task-state="doing">' +
              L('استئناف', 'Resume') +
              '</button>'
            : '<button type="button" data-task-id="' +
              task.id +
              '" data-task-state="doing">' +
              L('بدء', 'Start') +
              '</button>';
    return (
      '<article class="tkTaskCard' +
      (task.status === 'done' ? ' is-done' : '') +
      (late ? ' is-late' : '') +
      '" data-task-card="' +
      task.id +
      '" draggable="true" style="--task-color:' +
      track.color +
      '">' +
      '<div class="tkTaskCard__top"><span class="tkTaskPriority p-' +
      task.priority +
      '">' +
      esc(trkTaskPriorityName(task.priority)) +
      '</span><span class="tkTaskCard__status">' +
      esc(trkTaskStatusName(task.status)) +
      '</span></div>' +
      '<h5>' +
      esc(task.title) +
      '</h5>' +
      '<div class="tkTaskMeta">' +
      (milestone ? '<span>◇ ' + esc(milestone.title) + '</span>' : '') +
      (task.dueDate
        ? '<span class="' +
          (late ? 'is-late' : '') +
          '">' +
          (lang === 'en' ? 'Due ' : 'موعد: ') +
          esc(task.dueDate) +
          '</span>'
        : '') +
      (task.estimateMinutes ? '<span>◷ ' + esc(trkFm(task.estimateMinutes)) + '</span>' : '') +
      (task.actualMinutes ? '<span>✓ ' + esc(trkFm(task.actualMinutes)) + '</span>' : '') +
      '</div>' +
      (task.dependsOn && task.dependsOn.length
        ? '<span class="kk-track-dep-line">⇢ ' +
          task.dependsOn.length +
          ' ' +
          L('متطلبات سابقة', 'prerequisites') +
          '</span>'
        : '') +
      '<div class="tkTaskActions"><button type="button" class="tkTaskStart" data-task-start="' +
      task.id +
      '">▶ ' +
      L('ابدأ جلسة', 'Start session') +
      '</button><button type="button" data-kk-deps="' +
      esc(task.id) +
      '" title="' +
      L('إدارة المتطلبات السابقة', 'Manage prerequisites') +
      '">⇢</button>' +
      statusAction +
      '<button type="button" data-task-edit="' +
      task.id +
      '" aria-label="' +
      L('تعديل المهمة', 'Edit task') +
      '">✎</button><button type="button" data-task-schedule="' +
      task.id +
      '" title="' +
      L('إضافة إلى التقويم', 'Add to calendar') +
      '">▦</button><button type="button" data-task-delete="' +
      task.id +
      '" aria-label="' +
      L('حذف المهمة', 'Delete task') +
      '">×</button></div></article>'
    );
  }
  function trkSmartAlerts() {
    var today = trkY(new Date()),
      tasks = TRK.tasks.filter(function (t) {
        return !trkTr(t.trackId).archived && (!TV.filter || t.trackId === TV.filter);
      }),
      alerts = [];
    var overdue = tasks.filter(function (t) {
      return t.status !== 'done' && t.dueDate && t.dueDate < today;
    });
    var dueToday = tasks.filter(function (t) {
      return t.status !== 'done' && t.dueDate === today;
    });
    if (overdue.length)
      alerts.push({
        type: 'danger',
        title: L('مهام متأخرة', 'Overdue tasks'),
        text: L(
          'لديك ' + overdue.length + ' مهمة تجاوزت موعدها. راجعها أو أعد جدولة موعدها.',
          overdue.length + ' tasks are past due. Review them or reschedule their dates.',
        ),
      });
    if (dueToday.length)
      alerts.push({
        type: 'warn',
        title: L('مستحق اليوم', 'Due today'),
        text: L(
          'هناك ' + dueToday.length + ' مهمة تحتاج إلى متابعة اليوم.',
          dueToday.length + ' tasks need attention today.',
        ),
      });
    var dayLoads = {};
    tasks.forEach(function (t) {
      if (t.status !== 'done' && t.dueDate && t.estimateMinutes)
        dayLoads[t.dueDate] = (dayLoads[t.dueDate] || 0) + t.estimateMinutes;
    });
    var heavy = Object.keys(dayLoads)
      .filter(function (d) {
        return dayLoads[d] > 240;
      })
      .sort()[0];
    if (heavy)
      alerts.push({
        type: 'warn',
        title: L('يوم مزدحم', 'Heavy day'),
        text: L(
          'تقدير المهام في ' + heavy + ' يتجاوز 4 ساعات. فكّر في توزيعها.',
          'Estimated tasks on ' + heavy + ' exceed four hours. Consider spreading them out.',
        ),
      });
    var timed = TRK.items
        .filter(function (i) {
          return (!TV.filter || i.trackId === TV.filter) && i.from && i.to;
        })
        .sort(function (a, b) {
          return a.start.localeCompare(b.start) || (a.from || '').localeCompare(b.from || '');
        }),
      collision = null;
    for (var i = 0; i < timed.length && !collision; i++)
      for (var j = i + 1; j < timed.length; j++) {
        if (timed[j].start > timed[i].end) break;
        var dateOverlap = timed[i].start <= timed[j].end && timed[j].start <= timed[i].end;
        if (
          dateOverlap &&
          mins(timed[j].from) < mins(timed[i].to) &&
          mins(timed[j].to) > mins(timed[i].from)
        ) {
          collision = { a: timed[i], b: timed[j] };
          break;
        }
      }
    if (collision)
      alerts.push({
        type: 'danger',
        title: L('تعارض في المواعيد', 'Schedule conflict'),
        text:
          trkNm(collision.a) +
          ' / ' +
          trkNm(collision.b) +
          ' · ' +
          collision.a.from +
          '–' +
          collision.a.to +
          ' / ' +
          collision.b.from +
          '–' +
          collision.b.to,
      });
    if (!alerts.length)
      alerts.push({
        type: 'good',
        title: L('المسار متوازن', 'Your plan looks balanced'),
        text: L(
          'لا توجد مواعيد متأخرة أو تعارضات واضحة حاليًا.',
          'No overdue items or obvious schedule conflicts were found.',
        ),
      });
    return alerts.slice(0, 4);
  }
  function trkAlertMarkup() {
    return (
      '<div class="tkSmartAlerts">' +
      trkSmartAlerts()
        .map(function (a) {
          return (
            '<article class="tkSmartAlert is-' +
            a.type +
            '"><b>' +
            esc(a.title) +
            '</b><span>' +
            esc(a.text) +
            '</span></article>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  function trkMilestonesMarkup() {
    var list = TRK.milestones
      .filter(function (m) {
        return !trkTr(m.trackId).archived && (!TV.filter || m.trackId === TV.filter);
      })
      .sort(function (a, b) {
        return (
          (a.startDate || a.dueDate || '').localeCompare(b.startDate || b.dueDate || '') ||
          a.title.localeCompare(b.title)
        );
      });
    if (!list.length)
      return (
        '<div class="tkEmpty"><b>' +
        L('لا توجد مراحل بعد', 'No milestones yet') +
        '</b>' +
        L(
          'قسّم هدفك إلى مراحل صغيرة لتصبح متابعة المسار أوضح.',
          'Break your goal into milestones to make the path easier to follow.',
        ) +
        '</div>'
      );
    return (
      '<div class="tkMilestoneGrid">' +
      list
        .map(function (m) {
          var ts = TRK.tasks.filter(function (t) {
              return t.milestoneId === m.id;
            }),
            done = ts.filter(function (t) {
              return t.status === 'done';
            }).length,
            p = trkPct(done, ts.length),
            t = trkTr(m.trackId);
          return (
            '<article class="tkMilestone" style="--task-color:' +
            t.color +
            '"><div class="tkMilestone__top"><span>' +
            L('مرحلة', 'MILESTONE') +
            '</span><b>' +
            p +
            '%</b></div><h5>' +
            esc(m.title) +
            '</h5><p>' +
            esc(m.description || L('لا يوجد وصف', 'No description')) +
            '</p><div class="tkMilestone__bar"><i style="width:' +
            p +
            '%"></i></div><div class="tkMilestone__meta"><span>' +
            done +
            '/' +
            ts.length +
            ' ' +
            L('مهام', 'tasks') +
            '</span><span>' +
            esc(m.startDate || L('بلا بداية', 'No start')) +
            (m.dueDate ? ' · ' + esc(m.dueDate) : '') +
            '</span></div><button type="button" class="tkMilestoneDelete" data-milestone-delete="' +
            m.id +
            '">' +
            L('حذف المرحلة', 'Delete milestone') +
            '</button></article>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  function trkTrackProgress(track) {
    var c = trkTaskCounts(track.id);
    return trkPct(c.done, c.all);
  }
  function trkOverviewMarkup() {
    var trackList = TRK.tracks.filter(function (t) {
      return !t.archived && (!TV.filter || t.id === TV.filter);
    });
    var counts = trkTaskCounts(TV.filter || '');
    var next = TRK.tasks
      .filter(function (t) {
        return !trkTr(t.trackId).archived && (!TV.filter || t.trackId === TV.filter) && t.status !== 'done';
      })
      .sort(function (a, b) {
        var ad = a.dueDate || '9999-12-31',
          bd = b.dueDate || '9999-12-31';
        return (
          ad.localeCompare(bd) ||
          (b.priority === 'urgent') - (a.priority === 'urgent') ||
          a.createdAt - b.createdAt
        );
      })[0];
    var tracks = trackList
      .map(function (t) {
        var p = trkTrackProgress(t),
          c = trkTaskCounts(t.id);
        return (
          '<article class="tkTrackProgress" style="--task-color:' +
          t.color +
          '"><div class="tkTrackProgress__head"><span>' +
          esc(t.name) +
          '</span><b>' +
          p +
          '%</b></div>' +
          (t.goal ? '<p>' + esc(t.goal) + '</p>' : '') +
          '<div class="tkMilestone__bar"><i style="width:' +
          p +
          '%"></i></div><div class="tkTrackProgress__meta"><span>' +
          c.done +
          '/' +
          c.all +
          ' ' +
          L('مهام مكتملة', 'tasks complete') +
          '</span><span>' +
          (t.dueDate ? L('الهدف: ', 'Target: ') + esc(t.dueDate) : L('بدون موعد نهائي', 'No target date')) +
          '</span></div></article>'
        );
      })
      .join('');
    return (
      '<section class="tkV49Hero"><div><span class="tkEyebrow">KASHKOOL · TRACK 2.0</span><h4>' +
      L('كل هدف يبدأ بخطوة واضحة', 'Every goal starts with a clear step') +
      '</h4><p>' +
      L(
        'حوّل أهدافك إلى مراحل ومهام قابلة للقياس، ثم اربط التنفيذ بوقت المذاكرة الفعلي.',
        'Turn goals into measurable milestones and tasks, then connect execution to real study time.',
      ) +
      '</p></div><div class="tkV49Hero__number"><b>' +
      trkPct(counts.done, counts.all) +
      '%</b><span>' +
      L('نسبة إنجاز المهام', 'Task completion') +
      '</span></div></section>' +
      '<div class="tkV49Stats"><article><span>' +
      L('المهام', 'Tasks') +
      '</span><b>' +
      counts.all +
      '</b></article><article><span>' +
      L('مكتملة', 'Completed') +
      '</span><b>' +
      counts.done +
      '</b></article><article><span>' +
      L('قيد التنفيذ', 'In progress') +
      '</span><b>' +
      counts.doing +
      '</b></article><article><span>' +
      L('متأخرة', 'Overdue') +
      '</span><b>' +
      counts.overdue +
      '</b></article><article><span>' +
      L('وقت مخطط', 'Planned time') +
      '</span><b>' +
      esc(trkFm(counts.planned)) +
      '</b></article><article><span>' +
      L('وقت فعلي', 'Actual time') +
      '</span><b>' +
      esc(trkFm(counts.actual)) +
      '</b></article></div>' +
      trkAlertMarkup() +
      '<div class="tkV49TwoCol"><section class="tkV49Section"><div class="tkV49Section__head"><h5>' +
      L('المسارات', 'Tracks') +
      '</h5><span>' +
      trackList.length +
      '</span></div>' +
      (tracks ||
        '<div class="tkEmpty"><b>' +
          L('ابدأ بإنشاء مسار', 'Create your first track') +
          '</b>' +
          L(
            'مثلاً: إنهاء منهج الرياضيات قبل الامتحان.',
            'For example: Finish the math syllabus before the exam.',
          ) +
          '</div>') +
      '</section><section class="tkV49Section"><div class="tkV49Section__head"><h5>' +
      L('الخطوة التالية', 'Next action') +
      '</h5></div>' +
      (next
        ? '<div class="tkNextTask"><span class="tkTaskPriority p-' +
          next.priority +
          '">' +
          esc(trkTaskPriorityName(next.priority)) +
          '</span><h5>' +
          esc(next.title) +
          '</h5><p>' +
          esc(trkTr(next.trackId).name) +
          (next.dueDate ? ' · ' + esc(next.dueDate) : '') +
          '</p><button class="tkAction" type="button" data-task-start="' +
          next.id +
          '">▶ ' +
          L('ابدأ المهمة', 'Start task') +
          '</button></div>'
        : '<div class="tkEmpty"><b>' +
          L('لا توجد مهام مفتوحة', 'No open tasks') +
          '</b>' +
          L('أضف مهمة جديدة أو راجع المراحل المكتملة.', 'Add a task or review completed milestones.') +
          '</div>') +
      '</section></div>' +
      '<section class="tkV49Section"><div class="tkV49Section__head"><h5>' +
      L('المراحل الرئيسية', 'Milestones') +
      '</h5><span>' +
      TRK.milestones.filter(function (m) {
        return !trkTr(m.trackId).archived && (!TV.filter || m.trackId === TV.filter);
      }).length +
      '</span></div>' +
      trkMilestonesMarkup() +
      '</section>'
    );
  }
  function trkBoardMarkup() {
    var cols = [
      { id: 'todo', name: L('لم تبدأ', 'To do') },
      { id: 'doing', name: L('قيد التنفيذ', 'In progress') },
      { id: 'blocked', name: L('متوقفة', 'Blocked') },
      { id: 'done', name: L('مكتملة', 'Done') },
    ];
    return (
      '<div class="tkKanbanBoard">' +
      cols
        .map(function (c) {
          var list = TRK.tasks.filter(function (t) {
            return !trkTr(t.trackId).archived && (!TV.filter || t.trackId === TV.filter) && t.status === c.id;
          });
          return (
            '<section class="tkKanbanCol" data-kanban-status="' +
            c.id +
            '"><header><b>' +
            c.name +
            '</b><span>' +
            list.length +
            '</span></header><div class="tkKanbanCol__body">' +
            (list.map(trkTaskCard).join('') ||
              '<div class="tkKanbanEmpty">' + L('اسحب مهمة إلى هنا', 'Drop a task here') + '</div>') +
            '</div></section>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  function trkTimelineMarkup() {
    var milestones = TRK.milestones
      .filter(function (m) {
        return !trkTr(m.trackId).archived && (!TV.filter || m.trackId === TV.filter);
      })
      .slice()
      .sort(function (a, b) {
        return (a.startDate || a.dueDate || '').localeCompare(b.startDate || b.dueDate || '');
      });
    var dated = milestones.filter(function (m) {
      return m.startDate || m.dueDate;
    });
    if (!milestones.length)
      return (
        '<div class="tkEmpty"><b>' +
        L('لا توجد مراحل في الخط الزمني', 'No milestones in the timeline') +
        '</b>' +
        L('أنشئ مراحل وحدد تواريخها لتظهر هنا.', 'Create milestones and add dates to see them here.') +
        '</div>'
      );
    var allDates = [];
    dated.forEach(function (m) {
      if (m.startDate) allDates.push(m.startDate);
      if (m.dueDate) allDates.push(m.dueDate);
    });
    var min = allDates.length ? allDates.sort()[0] : trkY(new Date()),
      max = allDates.length ? allDates[allDates.length - 1] : trkY(new Date());
    var span = Math.max(1, trkGap(trkD(min), trkD(max)) + 1);
    return (
      '<div class="tkTimeline"><div class="tkTimeline__axis"><span>' +
      esc(min) +
      '</span><span>' +
      esc(max) +
      '</span></div>' +
      milestones
        .map(function (m) {
          var t = trkTr(m.trackId),
            p = trkMilestonePct(m),
            s = m.startDate || m.dueDate || min,
            e = m.dueDate || m.startDate || max,
            left = (Math.max(0, trkGap(trkD(min), trkD(s))) / span) * 100,
            width = Math.max(3, ((trkGap(trkD(s), trkD(e)) + 1) / span) * 100),
            tasks = TRK.tasks.filter(function (x) {
              return x.milestoneId === m.id;
            });
          return (
            '<article class="tkTimelineRow"><div class="tkTimelineRow__label"><i style="background:' +
            t.color +
            '"></i><b>' +
            esc(m.title) +
            '</b><small>' +
            esc(t.name) +
            ' · ' +
            p +
            '%</small></div><div class="tkTimelineRow__track"><i style="inset-inline-start:' +
            left +
            '%;width:' +
            Math.min(width, 100 - left) +
            '%;background:' +
            t.color +
            '"></i><span>' +
            esc(m.startDate || L('غير محدد', 'Unscheduled')) +
            (m.dueDate ? ' → ' + esc(m.dueDate) : '') +
            '</span></div><small class="tkTimelineRow__count">' +
            tasks.filter(function (x) {
              return x.status === 'done';
            }).length +
            '/' +
            tasks.length +
            '</small></article>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  function trkAnalyticsMarkup() {
    var c = trkTaskCounts(TV.filter || ''),
      pct = trkPct(c.done, c.all),
      tasks = TRK.tasks.filter(function (t) {
        return !trkTr(t.trackId).archived && (!TV.filter || t.trackId === TV.filter);
      });
    var rows = TRK.tracks
      .filter(function (t) {
        return !t.archived && (!TV.filter || t.id === TV.filter);
      })
      .map(function (t) {
        var x = trkTaskCounts(t.id),
          p = trkPct(x.done, x.all);
        return (
          '<article class="tkAnalyticsTrack"><div><b>' +
          esc(t.name) +
          '</b><strong>' +
          p +
          '%</strong></div><div class="tkMilestone__bar"><i style="width:' +
          p +
          '%;background:' +
          t.color +
          '"></i></div><small>' +
          x.done +
          '/' +
          x.all +
          ' ' +
          L('مهام مكتملة', 'tasks complete') +
          '</small></article>'
        );
      })
      .join('');
    var remaining = tasks.reduce(function (sum, t) {
      return sum + Math.max(0, (+t.estimateMinutes || 0) - (+t.actualMinutes || 0));
    }, 0);
    return (
      '<div class="tkAnalyticsGrid"><article><span>' +
      L('معدل الإنجاز', 'Completion rate') +
      '</span><b>' +
      pct +
      '%</b></article><article><span>' +
      L('الوقت المخطط', 'Planned time') +
      '</span><b>' +
      esc(trkFm(c.planned)) +
      '</b></article><article><span>' +
      L('الوقت الفعلي', 'Actual time') +
      '</span><b>' +
      esc(trkFm(c.actual)) +
      '</b></article><article><span>' +
      L('الوقت المتبقي التقديري', 'Estimated remaining') +
      '</span><b>' +
      esc(trkFm(remaining)) +
      '</b></article></div>' +
      '<section class="tkV49Section"><div class="tkV49Section__head"><h5>' +
      L('توزيع حالات المهام', 'Task status distribution') +
      '</h5></div><div class="tkStatusDistribution">' +
      [
        { k: 'todo', v: c.todo },
        { k: 'doing', v: c.doing },
        { k: 'blocked', v: c.blocked },
        { k: 'done', v: c.done },
      ]
        .map(function (x) {
          var p = trkPct(x.v, c.all);
          return (
            '<div class="tkStatusLine"><span>' +
            esc(trkTaskStatusName(x.k)) +
            '</span><div><i class="s-' +
            x.k +
            '" style="width:' +
            p +
            '%"></i></div><b>' +
            x.v +
            '</b></div>'
          );
        })
        .join('') +
      '</div></section>' +
      '<section class="tkV49Section"><div class="tkV49Section__head"><h5>' +
      L('التقدم حسب المسار', 'Progress by track') +
      '</h5></div><div class="tkAnalyticsTracks">' +
      (rows || '<div class="tkEmpty">' + L('لا توجد بيانات كافية بعد.', 'Not enough data yet.') + '</div>') +
      '</div></section>' +
      '<p class="tkAnalyticsFoot">' +
      L(
        'الوقت الفعلي يُجمع من جلسات المؤقّت التي تبدأ من بطاقة المهمة. الوقت المخطط هو مجموع تقديرات المهام، وقد يتجاوز الفعلي أو يقل عنه.',
        'Actual time is collected from timer sessions started from a task card. Planned time sums task estimates and may differ from actual time.',
      ) +
      '</p>'
    );
  }
  function trkV49FormMarkup() {
    var editing = TV.taskEditId ? trkTaskById(TV.taskEditId) : null;
    var trackOpts = TRK.tracks
      .filter(function (t) {
        return !t.archived;
      })
      .map(function (t) {
        return (
          '<option value="' +
          t.id +
          '"' +
          (TV.filter === t.id ? ' selected' : '') +
          '>' +
          esc(t.name) +
          '</option>'
        );
      })
      .join('');
    var taskTrackOpts = TRK.tracks
      .filter(function (t) {
        return !t.archived;
      })
      .map(function (t) {
        return (
          '<option value="' +
          t.id +
          '"' +
          ((editing ? editing.trackId : TV.filter) === t.id ? ' selected' : '') +
          '>' +
          esc(t.name) +
          '</option>'
        );
      })
      .join('');
    var msOpts = TRK.milestones
      .filter(function (m) {
        return editing ? m.trackId === editing.trackId : !TV.filter || m.trackId === TV.filter;
      })
      .map(function (m) {
        return (
          '<option value="' +
          m.id +
          '"' +
          (editing && editing.milestoneId === m.id ? ' selected' : '') +
          '>' +
          esc(m.title) +
          '</option>'
        );
      })
      .join('');
    var subjectOpts =
      '<option value="">' +
      L('بدون مادة مرتبطة', 'No linked subject') +
      '</option>' +
      state.subjects
        .map(function (x) {
          return (
            '<option value="' +
            x.id +
            '"' +
            (editing && editing.subjectId === x.id ? ' selected' : '') +
            '>' +
            esc(x.name) +
            '</option>'
          );
        })
        .join('');
    return (
      '<details class="tkV49Create" ' +
      (TV.createOpen || !TRK.tracks.length || editing ? 'open' : '') +
      '><summary>' +
      L('إنشاء وإدارة المسار', 'Create & manage your path') +
      '</summary><div class="tkV49Forms">' +
      '<form class="tkV49Form" onsubmit="return false"><h5>' +
      L('1. مسار جديد', '1. New track') +
      '</h5><label>' +
      L('اسم المسار', 'Track name') +
      '<input id="tkName" maxlength="40" placeholder="' +
      L('مثلاً: إنهاء منهج الرياضيات', 'e.g. Finish the math syllabus') +
      '"></label><label>' +
      L('الهدف الرئيسي', 'Main goal') +
      '<input id="tkGoal" maxlength="180" placeholder="' +
      L('ما النتيجة التي تريد الوصول إليها؟', 'What outcome are you aiming for?') +
      '"></label><div class="tkTemplateGroup"><span>' +
      L(
        'ابدأ بقالب جاهز — سيتم إنشاء المراحل تلقائيًا بعد إنشاء المسار',
        'Start from a template — milestones are added when you create the track',
      ) +
      '</span><div class="tkTemplateChoices"><button type="button" class="tkTemplateChoice" data-template="subject">📘 ' +
      L('إنهاء منهج مادة', 'Subject syllabus') +
      '</button><button type="button" class="tkTemplateChoice" data-template="exam">🎯 ' +
      L('الاستعداد لامتحان', 'Exam preparation') +
      '</button><button type="button" class="tkTemplateChoice" data-template="book">📚 ' +
      L('إنهاء كتاب أو مشروع', 'Book or project') +
      '</button><button type="button" class="tkTemplateChoice" data-template="skill">🧭 ' +
      L('تعلم مهارة', 'Learn a skill') +
      '</button></div></div><div class="tkV49FormRow"><label>' +
      L('الموعد النهائي', 'Target date') +
      '<input id="tkTrackDue" type="date"></label><label>' +
      L('اللون', 'Color') +
      '<input id="tkColor" type="color" value="' +
      (PALETTE[TRK.tracks.length % PALETTE.length] || DEFAULT_COLOR) +
      '"></label></div><button type="button" class="tkAction" data-act="addTrack">＋ ' +
      L('إنشاء المسار', 'Create track') +
      '</button></form>' +
      '<form class="tkV49Form" onsubmit="return false"><h5>' +
      L('2. مرحلة رئيسية', '2. Milestone') +
      '</h5><label>' +
      L('المسار', 'Track') +
      '<select id="tkMilestoneTrack">' +
      trackOpts +
      '</select></label><label>' +
      L('اسم المرحلة', 'Milestone name') +
      '<input id="tkMilestoneTitle" maxlength="80" placeholder="' +
      L('مثلاً: إنهاء الوحدتين الأولى والثانية', 'e.g. Finish units one and two') +
      '"></label><label>' +
      L('وصف مختصر', 'Short description') +
      '<input id="tkMilestoneDesc" maxlength="180"></label><div class="tkV49FormRow"><label>' +
      L('تبدأ', 'Start') +
      '<input id="tkMilestoneStart" type="date"></label><label>' +
      L('تنتهي', 'Due') +
      '<input id="tkMilestoneDue" type="date"></label></div><button type="button" class="tkAction" data-act="addMilestone" ' +
      (!TRK.tracks.length ? 'disabled' : '') +
      '>＋ ' +
      L('إضافة المرحلة', 'Add milestone') +
      '</button></form>' +
      '<form class="tkV49Form tkV49Form--wide" onsubmit="return false"><h5>' +
      (editing ? L('3. تعديل المهمة', '3. Edit task') : L('3. مهمة جديدة', '3. New task')) +
      '</h5><div class="tkV49FormRow tkV49FormRow--task"><label>' +
      L('اسم المهمة', 'Task title') +
      '<input id="tkTaskTitle" maxlength="100" value="' +
      esc(editing ? editing.title : '') +
      '" placeholder="' +
      L('مثلاً: حل 20 سؤالًا على الدرس الثالث', 'e.g. Solve 20 questions for lesson three') +
      '"></label><label>' +
      L('المسار', 'Track') +
      '<select id="tkTaskTrack">' +
      taskTrackOpts +
      '</select></label><label>' +
      L('المرحلة', 'Milestone') +
      '<select id="tkTaskMilestone"><option value="">' +
      L('بدون مرحلة', 'No milestone') +
      '</option>' +
      msOpts +
      '</select></label></div><details class="tkV49Advanced"><summary>' +
      L('تفاصيل إضافية', 'Advanced details') +
      '</summary><div class="tkV49FormRow"><label>' +
      L('موعد المهمة', 'Due date') +
      '<input id="tkTaskDue" type="date" value="' +
      esc(editing ? editing.dueDate || '' : '') +
      '"></label><label>' +
      L('الأولوية', 'Priority') +
      '<select id="tkTaskPriority"><option value="low"' +
      (editing && editing.priority === 'low' ? ' selected' : '') +
      '>' +
      L('منخفضة', 'Low') +
      '</option><option value="normal"' +
      (!editing || editing.priority === 'normal' ? ' selected' : '') +
      '>' +
      L('عادية', 'Normal') +
      '</option><option value="high"' +
      (editing && editing.priority === 'high' ? ' selected' : '') +
      '>' +
      L('عالية', 'High') +
      '</option><option value="urgent"' +
      (editing && editing.priority === 'urgent' ? ' selected' : '') +
      '>' +
      L('عاجلة', 'Urgent') +
      '</option></select></label><label>' +
      L('الوقت المتوقع بالدقائق', 'Estimated minutes') +
      '<input id="tkTaskEstimate" type="number" min="0" max="100000" step="5" value="' +
      (editing ? editing.estimateMinutes || 0 : 30) +
      '"></label><label>' +
      L('المادة المرتبطة', 'Linked subject') +
      '<select id="tkTaskSubject">' +
      subjectOpts +
      '</select></label></div><label>' +
      L('ملاحظات', 'Notes') +
      '<textarea id="tkTaskNotes" maxlength="2000">' +
      esc(editing ? editing.notes || '' : '') +
      '</textarea></label></details><div class="tkV49FormActions"><button type="button" class="tkAction" data-act="saveTask" ' +
      (!TRK.tracks.length ? 'disabled' : '') +
      '>' +
      (editing ? L('حفظ التعديل', 'Save task') : L('＋ إضافة المهمة', 'Add task')) +
      '</button>' +
      (editing
        ? '<button type="button" class="tkAction tkAction--quiet" data-act="cancelTaskEdit">' +
          L('إلغاء', 'Cancel') +
          '</button>'
        : '') +
      '</div></form></div></details>'
    );
  }
  function trkLegacyCalendarMarkup() {
    var td = trkY(new Date()),
      v = TV.s === 'month' ? trkMonth() : TV.s === 'year' ? trkYear() : trkWeek();
    var edit = TV.editId
      ? TRK.items.filter(function (i) {
          return i.id === TV.editId;
        })[0]
      : null;
    var opts = TRK.tracks
      .map(function (t) {
        return (
          '<option value="' +
          t.id +
          '"' +
          (edit && edit.trackId === t.id ? ' selected' : '') +
          '>' +
          esc(t.name) +
          '</option>'
        );
      })
      .join('');
    var filterOpts =
      '<option value="">' +
      L('كل المسارات', 'All tracks') +
      '</option>' +
      TRK.tracks
        .map(function (t) {
          return (
            '<option value="' +
            t.id +
            '"' +
            (TV.filter === t.id ? ' selected' : '') +
            '>' +
            esc(t.name) +
            '</option>'
          );
        })
        .join('');
    var sel = TV.sel || td,
      start = edit ? edit.start : sel,
      end = edit ? edit.end : sel;
    var manager =
      '<details data-track-panel' +
      (TV.open || edit ? ' open' : '') +
      '><summary>' +
      L('إدارة المواعيد القديمة', 'Manage scheduled blocks') +
      '</summary><div class="tkSlip"><div class="tkTrackList">' +
      trkTrackManager() +
      '</div>' +
      (TRK.tracks.length
        ? '<h4 class="tkFormTitle">' +
          (edit ? L('تعديل موعد', 'Edit scheduled block') : L('إضافة موعد للمسار', 'Add a scheduled block')) +
          '</h4>' +
          (edit
            ? '<div class="tkEditBar"><span>' +
              L('تعديل: ', 'Editing: ') +
              esc(trkNm(edit)) +
              '</span><button type="button" data-act="cancelEdit">' +
              L('إلغاء', 'Cancel') +
              '</button></div>'
            : '') +
          '<div class="tkForm"><label class="tkField tkField--track"><span>' +
          L('المسار', 'Track') +
          '</span><select id="tkT">' +
          opts +
          '</select></label><label class="tkField tkField--title"><span>' +
          L('عنوان الموعد', 'Block title') +
          '</span><input id="tkTitle" maxlength="60" value="' +
          esc(edit ? edit.title || '' : '') +
          '"></label><label class="tkField tkField--date"><span>' +
          L('تبدأ', 'Starts') +
          '</span><input id="tkS" type="date" value="' +
          start +
          '"></label><label class="tkField tkField--date"><span>' +
          L('تنتهي', 'Ends') +
          '</span><input id="tkE" type="date" value="' +
          end +
          '"></label><label class="tkField tkField--time"><span>' +
          L('من', 'From') +
          '</span><input id="tkF" type="time" value="' +
          (edit ? edit.from || '' : '') +
          '"></label><label class="tkField tkField--time"><span>' +
          L('إلى', 'To') +
          '</span><input id="tkTo" type="time" value="' +
          (edit ? edit.to || '' : '') +
          '"></label><button class="tkAction" type="button" data-act="addItem">' +
          (edit ? L('حفظ', 'Save') : L('إضافة موعد', 'Add block')) +
          '</button></div><small class="tkFormNote">' +
          L('اترك الوقت فارغًا للموعد طوال اليوم.', 'Leave the time fields empty for an all-day block.') +
          '</small>'
        : '<div class="tkEmpty">' + L('أنشئ مسارًا أولًا.', 'Create a track first.') + '</div>') +
      '<div class="tkHours"><label class="tkField"><span>' +
      L('بداية ساعات العرض', 'Visible hours start') +
      '</span><input id="tkWinS" type="time" value="' +
      TRK.win[0] +
      '"></label><label class="tkField"><span>' +
      L('نهاية ساعات العرض', 'Visible hours end') +
      '</span><input id="tkWinE" type="time" value="' +
      TRK.win[1] +
      '"></label><button class="tkAction" type="button" data-act="saveWindow">' +
      L('حفظ الساعات', 'Save hours') +
      '</button></div></div></details>';
    return (
      '<div class="tkBar"><div class="tkTabs">' +
      [
        ['week', L('أسبوع', 'Week')],
        ['month', L('شهر', 'Month')],
        ['year', L('سنة', 'Year')],
      ]
        .map(function (x) {
          return (
            '<button class="tkTab" type="button" data-scale="' +
            x[0] +
            '" aria-pressed="' +
            (TV.s === x[0]) +
            '">' +
            x[1] +
            '</button>'
          );
        })
        .join('') +
      '</div><label class="tkFilter"><span>' +
      L('المسار:', 'Track:') +
      '</span><select id="tkCalendarFilter">' +
      filterOpts +
      '</select></label><div class="tkNav"><button type="button" data-act="prev" aria-label="' +
      L('السابق', 'Previous') +
      '">' +
      (lang === 'en' ? '‹' : '›') +
      '</button><span class="tkTtl">' +
      v.t +
      '</span><button type="button" data-act="next" aria-label="' +
      L('التالي', 'Next') +
      '">' +
      (lang === 'en' ? '›' : '‹') +
      '</button><button type="button" data-act="today">' +
      L('اليوم', 'Today') +
      '</button></div></div>' +
      manager +
      v.h
    );
  }
  function trkRestoreTrash() {
    if (!TRK.trash) return;
    var x = TRK.trash;
    if (x.type === 'task' && x.task) {
      if (
        !TRK.tasks.some(function (t) {
          return t.id === x.task.id;
        })
      )
        TRK.tasks.push(x.task);
      (x.items || []).forEach(function (i) {
        if (
          !TRK.items.some(function (old) {
            return old.id === i.id;
          })
        )
          TRK.items.push(i);
      });
    } else if (x.type === 'track' && x.track) {
      TRK.tracks.push(x.track);
      (x.items || []).forEach(function (i) {
        TRK.items.push(i);
      });
      (x.tasks || []).forEach(function (t) {
        TRK.tasks.push(t);
      });
      (x.milestones || []).forEach(function (m) {
        TRK.milestones.push(m);
      });
    } else if (x.type === 'milestone' && x.milestone) {
      TRK.milestones.push(x.milestone);
      (x.taskIds || []).forEach(function (id) {
        var task = trkTaskById(id);
        if (task) task.milestoneId = x.milestone.id;
      });
    }
    TRK.trash = null;
    trkSave();
    renderTrack();
    toast(L('تمت الاستعادة بنجاح.', 'Restored successfully.'));
  }
  function renderTrack() {
    trkLoad();
    var h = $('trkBody');
    if (!h) return;
    $('trkTitle').textContent = L('المسار', 'Track');
    $('trkHint').textContent = L(
      'من الهدف إلى التنفيذ والإنجاز الفعلي',
      'From goal to execution and measurable progress',
    );
    if (!TV.sel) TV.sel = trkY(new Date());
    var filterOpts =
      '<option value="">' +
      L('كل المسارات', 'All tracks') +
      '</option>' +
      TRK.tracks
        .filter(function (t) {
          return !t.archived;
        })
        .map(function (t) {
          return (
            '<option value="' +
            t.id +
            '"' +
            (TV.filter === t.id ? ' selected' : '') +
            '>' +
            esc(t.name) +
            '</option>'
          );
        })
        .join('');
    var panels = [
      ['overview', L('نظرة عامة', 'Overview')],
      ['board', L('لوحة المهام', 'Board')],
      ['timeline', L('الخط الزمني', 'Timeline')],
      ['calendar', L('التقويم', 'Calendar')],
      ['analytics', L('التحليلات', 'Analytics')],
    ];
    var content =
      TV.panel === 'board'
        ? trkBoardMarkup()
        : TV.panel === 'timeline'
          ? trkTimelineMarkup()
          : TV.panel === 'calendar'
            ? trkLegacyCalendarMarkup()
            : TV.panel === 'analytics'
              ? trkAnalyticsMarkup()
              : trkOverviewMarkup();
    var panelTabs = panels
      .map(function (p) {
        return (
          '<button type="button" class="tkV49Tab" data-panel="' +
          p[0] +
          '" aria-pressed="' +
          (TV.panel === p[0] ? 'true' : 'false') +
          '">' +
          p[1] +
          '</button>'
        );
      })
      .join('');
    var trash = TRK.trash
      ? '<div class="tkUndoBar"><span>' +
        L('يوجد عنصر محذوف مؤخرًا.', 'An item was recently deleted.') +
        '</span><button type="button" data-task-restore="1">' +
        L('استعادة', 'Undo') +
        '</button></div>'
      : '';
    h.innerHTML =
      '<div class="tkV49Shell">' +
      '<div class="tkV49Toolbar"><label><span>' +
      L('المسار الحالي', 'Current track') +
      '</span><select id="tkFilter">' +
      filterOpts +
      '</select></label><span class="tkV49Version">TRACK ENGINE · V3</span></div>' +
      trash +
      '<div class="tkV49Tabs" role="tablist">' +
      panelTabs +
      '</div>' +
      content +
      trkV49FormMarkup() +
      '</div>';
    if (!h._b) {
      h._b = 1;
      h.addEventListener('click', trkClick);
      h.addEventListener('change', function (e) {
        var t = e.target;
        if (!t) return;
        if (t.id === 'tkFilter' || t.id === 'tkCalendarFilter') {
          TV.filter = t.value;
          renderTrack();
          return;
        }
        if (t.dataset && t.dataset.note) {
          if (t.value.trim()) TRK.notes[t.dataset.note] = t.value;
          else delete TRK.notes[t.dataset.note];
          trkSave();
        }
      });
      h.addEventListener(
        'toggle',
        function (e) {
          if (!e.target || !e.target.matches) return;
          if (e.target.matches('details[data-track-panel]')) TV.open = e.target.open;
          if (e.target.matches('details.tkV49Create')) TV.createOpen = e.target.open;
        },
        true,
      );
      h.addEventListener('keydown', function (e) {
        var t = e.target;
        if ((e.key === 'Enter' || e.key === ' ') && t && t.classList && t.classList.contains('tkCell')) {
          e.preventDefault();
          TV.sel = t.dataset.sel;
          renderTrack();
        }
      });
      h.addEventListener('dragstart', function (e) {
        var card = e.target.closest && e.target.closest('[data-task-card]');
        if (!card || !e.dataTransfer) return;
        e.dataTransfer.setData('text/plain', card.dataset.taskCard);
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('is-dragging');
      });
      h.addEventListener('dragend', function (e) {
        var card = e.target.closest && e.target.closest('[data-task-card]');
        if (card) card.classList.remove('is-dragging');
      });
      h.addEventListener('dragover', function (e) {
        if (e.target.closest && e.target.closest('[data-kanban-status]')) e.preventDefault();
      });
      h.addEventListener('drop', function (e) {
        var col = e.target.closest && e.target.closest('[data-kanban-status]');
        if (!col || !e.dataTransfer) return;
        e.preventDefault();
        var id = e.dataTransfer.getData('text/plain');
        trkSetTaskStatus(id, col.dataset.kanbanStatus);
      });
    }
  }
  function trkSetTaskStatus(id, status) {
    var task = trkTaskById(id);
    if (!task) return;
    if (['todo', 'doing', 'blocked', 'done'].indexOf(status) < 0) return;
    if (status === 'doing' || status === 'done') {
      var unmet = (Array.isArray(task.dependsOn) ? task.dependsOn : [])
        .map(trkTaskById)
        .filter(function (dep) {
          return dep && dep.status !== 'done';
        });
      if (unmet.length) {
        toast(
          L(
            'لا يمكن بدء المهمة أو إكمالها قبل إنهاء المتطلبات السابقة.',
            "Complete this task's prerequisites before starting or completing it.",
          ),
        );
        return;
      }
    }
    var activeId = '';
    try {
      activeId = localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
    } catch (e) {}
    if (status === 'done' && activeId === id && typeof pomo !== 'undefined' && pomo && pomo.running) {
      /* Flush elapsed work while the task is still the active association. */
      pomoPause(true);
      trkLoad();
      task = trkTaskById(id);
      if (!task) return;
    }
    task.status = status;
    task.completedAt = status === 'done' ? Date.now() : 0;
    if (status === 'done' && activeId === id) trkClearActiveTask();
    trkSave();
    renderTrack();
  }
  function trkClearActiveTask() {
    try {
      localStorage.removeItem(scopedKey('kashkool.track.activeTask.v1'));
    } catch (e) {}
  }
  function trkRecordStudyMinutes(minutes) {
    var id = '';
    try {
      id = localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
    } catch (e) {}
    if (!id) return;
    var amount = Math.max(0, Math.round(+minutes || 0));
    if (!amount) return;
    trkLoad();
    var task = trkTaskById(id);
    if (!task) {
      trkClearActiveTask();
      return;
    }
    task.actualMinutes = (+task.actualMinutes || 0) + amount;
    if (task.status === 'todo') task.status = 'doing';
    task.lastStudiedAt = Date.now();
    trkSave();
  }
  function trkStartTask(id) {
    trkLoad();
    var task = trkTaskById(id);
    if (!task) return;
    var unmet = (Array.isArray(task.dependsOn) ? task.dependsOn : []).map(trkTaskById).filter(function (dep) {
      return dep && dep.status !== 'done';
    });
    if (unmet.length) {
      toast(
        L(
          'لا يمكن بدء المهمة قبل إنهاء المتطلبات السابقة.',
          "Complete this task's prerequisites before starting it.",
        ),
      );
      return;
    }
    if (pomo && pomo.running) {
      toast(
        L(
          'أوقف جلسة المؤقّت الحالية أولًا قبل ربط مهمة جديدة.',
          'Pause the current timer before linking another task.',
        ),
      );
      return;
    }
    pomoPause(true); /* flush any previously linked work before changing the task association */
    try {
      localStorage.setItem(scopedKey('kashkool.track.activeTask.v1'), id);
    } catch (e) {}
    task.status = 'doing';
    task.lastStartedAt = Date.now();
    trkSave();
    pomo.loggedSec = 0;
    pomo.mode = 'work';
    pomo.total = pomoDurationSec('work');
    pomo.remaining = pomo.total;
    if (task.subjectId) {
      pomo.subjectId = task.subjectId;
      renderPomoSubjectOptions();
    }
    setActiveView('pomo');
    pomoStart();
    toast(
      L(
        'بدأت جلسة المهمة؛ وقت المؤقّت سيُضاف إلى المسار.',
        'Task session started. Timer minutes will be added to this path.',
      ),
    );
  }
  function trkClick(e) {
    var el = e.target.closest(
      '[data-act],[data-del],[data-deltrack],[data-edit],[data-scale],[data-sel],[data-month],[data-goto],[data-panel],[data-task-start],[data-task-state],[data-task-edit],[data-task-delete],[data-task-schedule],[data-task-restore],[data-milestone-delete],[data-track-archive],[data-template]',
    );
    if (!el) return;
    var D = el.dataset,
      a = D.act;
    if (D.template) {
      var templates = {
        subject: {
          name: ['إنهاء منهج مادة', 'Finish a subject syllabus'],
          goal: ['إنهاء وفهم المنهج مع حل تدريباته', 'Complete and understand the syllabus with practice'],
          milestones: [
            ['تحديد الوحدات والدروس', 'Map units and lessons'],
            ['فهم الدروس الأساسية', 'Understand core lessons'],
            ['تلخيص القوانين والأفكار', 'Summarize key ideas'],
            ['حل التدريبات', 'Complete practice exercises'],
            ['مراجعة شاملة', 'Final review'],
          ],
        },
        exam: {
          name: ['الاستعداد لامتحان', 'Prepare for an exam'],
          goal: [
            'الاستعداد للامتحان بفهم وتدريب ومراجعة',
            'Prepare through understanding, practice, and review',
          ],
          milestones: [
            ['تحديد المنهج ونقاط الضعف', 'Map syllabus and weak areas'],
            ['إنهاء الشرح والفهم', 'Finish learning and understanding'],
            ['حل التدريبات والأسئلة', 'Practice questions'],
            ['حل امتحانات سابقة', 'Attempt past exams'],
            ['المراجعة النهائية', 'Final review'],
          ],
        },
        book: {
          name: ['إنهاء كتاب أو مشروع', 'Finish a book or project'],
          goal: [
            'تقسيم العمل إلى أجزاء واضحة ثم مراجعته وإنهاؤه',
            'Break the work into clear parts, review, and finish',
          ],
          milestones: [
            ['تقسيم المحتوى إلى أجزاء', 'Break content into parts'],
            ['إنجاز الجزء الأول', 'Complete part one'],
            ['إنجاز الجزء الثاني', 'Complete part two'],
            ['المراجعة والتدقيق', 'Review and proofread'],
            ['التسليم النهائي', 'Final delivery'],
          ],
        },
        skill: {
          name: ['تعلم مهارة جديدة', 'Learn a new skill'],
          goal: ['بناء أساس قوي ثم التطبيق والممارسة', 'Build strong foundations, then apply and practice'],
          milestones: [
            ['فهم الأساسيات', 'Learn the fundamentals'],
            ['تطبيقات بسيطة', 'Complete simple exercises'],
            ['تطبيق عملي', 'Build a practical application'],
            ['مراجعة نقاط الضعف', 'Review weak areas'],
            ['مشروع نهائي', 'Complete a final project'],
          ],
        },
      };
      var template = templates[D.template];
      if (!template) return;
      $('tkName').value = lang === 'en' ? template.name[1] : template.name[0];
      $('tkGoal').value = lang === 'en' ? template.goal[1] : template.goal[0];
      TV.pendingTemplateMilestones = template.milestones.map(function (x) {
        return { ar: x[0], en: x[1] };
      });
      toast(
        L(
          'تم تحميل القالب. أنشئ المسار لإضافة مراحله، ويمكنك تعديلها بعد ذلك.',
          'Template loaded. Create the track to add its milestones, then edit them as needed.',
        ),
      );
      return;
    }
    if (D.panel) {
      TV.panel = D.panel;
      renderTrack();
      return;
    }
    if (D.taskStart) {
      trkStartTask(D.taskStart);
      return;
    }
    if (D.taskState) {
      trkSetTaskStatus(D.taskId, D.taskState);
      return;
    }
    if (D.taskEdit) {
      TV.taskEditId = D.taskEdit;
      TV.panel = 'overview';
      TV.createOpen = true;
      renderTrack();
      return;
    }
    if (D.taskDelete) {
      var deleting = trkTaskById(D.taskDelete);
      if (!deleting) return;
      if (!window.confirm(L('حذف المهمة "' + deleting.title + '"؟', 'Delete task "' + deleting.title + '"?')))
        return;
      var activeTask = '';
      try {
        activeTask = localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
      } catch (e) {}
      if (activeTask === D.taskDelete && typeof pomo !== 'undefined' && pomo && pomo.running) {
        pomoPause(true);
        trkLoad();
        deleting = trkTaskById(D.taskDelete);
        if (!deleting) return;
      }
      var linkedItems = TRK.items.filter(function (i) {
        return i.linkedTaskId === D.taskDelete;
      });
      TRK.trash = { type: 'task', task: deleting, items: linkedItems, at: Date.now() };
      TRK.tasks = TRK.tasks.filter(function (t) {
        return t.id !== D.taskDelete;
      });
      TRK.items = TRK.items.filter(function (i) {
        return i.linkedTaskId !== D.taskDelete;
      });
      if (activeTask === D.taskDelete) trkClearActiveTask();
      trkSave();
      renderTrack();
      return;
    }
    if (D.taskSchedule) {
      var st = trkTaskById(D.taskSchedule);
      if (!st) return;
      if (!st.dueDate) {
        toast(L('حدد موعد المهمة أولًا من تعديل المهمة.', 'Set a due date on the task first.'));
        return;
      }
      if (
        TRK.items.some(function (i) {
          return i.linkedTaskId === st.id;
        })
      ) {
        toast(L('المهمة موجودة بالفعل في التقويم.', 'This task is already on the calendar.'));
        return;
      }
      TRK.items.push({
        id: uid(),
        trackId: st.trackId,
        title: st.title,
        start: st.dueDate,
        end: st.dueDate,
        from: '',
        to: '',
        linkedTaskId: st.id,
      });
      trkSave();
      TV.panel = 'calendar';
      TV.sel = st.dueDate;
      TV.s = 'month';
      TV.o =
        (trkD(st.dueDate).getFullYear() - new Date().getFullYear()) * 12 +
        trkD(st.dueDate).getMonth() -
        new Date().getMonth();
      renderTrack();
      toast(L('أضيفت المهمة إلى التقويم.', 'Task added to calendar.'));
      return;
    }
    if (D.taskRestore) {
      trkRestoreTrash();
      return;
    }
    if (D.trackArchive) {
      var targetTrack = TRK.tracks.filter(function (t) {
        return t.id === D.trackArchive;
      })[0];
      if (!targetTrack) return;
      targetTrack.archived = !targetTrack.archived;
      if (targetTrack.archived && TV.filter === targetTrack.id) TV.filter = '';
      trkSave();
      renderTrack();
      toast(
        targetTrack.archived
          ? L('تمت أرشفة المسار مع الاحتفاظ ببياناته.', 'Track archived; its data was kept.')
          : L('تمت استعادة المسار.', 'Track restored.'),
      );
      return;
    }
    if (D.milestoneDelete) {
      var dm = TRK.milestones.filter(function (m) {
        return m.id === D.milestoneDelete;
      })[0];
      if (!dm) return;
      if (
        !window.confirm(
          L(
            'حذف المرحلة "' + dm.title + '"؟ ستظل المهام موجودة بدون مرحلة.',
            'Delete milestone "' + dm.title + '"? Its tasks will remain unassigned.',
          ),
        )
      )
        return;
      TRK.trash = {
        type: 'milestone',
        milestone: dm,
        taskIds: TRK.tasks
          .filter(function (t) {
            return t.milestoneId === dm.id;
          })
          .map(function (t) {
            return t.id;
          }),
        at: Date.now(),
      };
      TRK.milestones = TRK.milestones.filter(function (m) {
        return m.id !== dm.id;
      });
      TRK.tasks.forEach(function (t) {
        if (t.milestoneId === dm.id) t.milestoneId = '';
      });
      trkSave();
      renderTrack();
      return;
    }
    if (a === 'addMilestone') {
      var mt = $('tkMilestoneTitle').value.trim(),
        mid = $('tkMilestoneTrack').value,
        ms = $('tkMilestoneStart').value,
        me = $('tkMilestoneDue').value,
        md = $('tkMilestoneDesc').value.trim();
      if (!mt || !mid) {
        toast(L('أدخل اسم المرحلة واختر مسارًا.', 'Enter a milestone name and choose a track.'));
        return;
      }
      if (ms && me && me < ms) {
        toast(L('تاريخ نهاية المرحلة يسبق بدايتها.', 'Milestone end date cannot be before its start date.'));
        return;
      }
      TRK.milestones.push({
        id: uid(),
        trackId: mid,
        title: mt,
        description: md,
        startDate: ms,
        dueDate: me,
        createdAt: Date.now(),
      });
      trkSave();
      TV.filter = mid;
      TV.panel = 'overview';
      TV.createOpen = true;
      renderTrack();
      toast(L('تمت إضافة المرحلة.', 'Milestone added.'));
      return;
    }
    if (a === 'saveTask') {
      var title = $('tkTaskTitle').value.trim(),
        trackId = $('tkTaskTrack').value,
        milestoneId = $('tkTaskMilestone').value,
        dueDate = $('tkTaskDue').value,
        priority = $('tkTaskPriority').value,
        estimate = Math.max(0, Math.min(100000, Math.round(+$('tkTaskEstimate').value || 0))),
        subjectId = $('tkTaskSubject').value,
        notes = $('tkTaskNotes').value.trim();
      if (
        !title ||
        !TRK.tracks.some(function (t) {
          return t.id === trackId && !t.archived;
        })
      ) {
        toast(L('اكتب اسم المهمة واختر مسارًا نشطًا.', 'Enter a task title and choose an active track.'));
        return;
      }
      if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        toast(L('تاريخ المهمة غير صالح.', 'The task date is invalid.'));
        return;
      }
      if (
        milestoneId &&
        !TRK.milestones.some(function (m) {
          return m.id === milestoneId && m.trackId === trackId;
        })
      ) {
        milestoneId = '';
      }
      var editingTask = TV.taskEditId ? trkTaskById(TV.taskEditId) : null;
      var data = {
        trackId: trackId,
        milestoneId: milestoneId,
        title: title,
        dueDate: dueDate,
        priority: priority,
        estimateMinutes: estimate,
        subjectId: subjectId,
        notes: notes,
      };
      if (editingTask) Object.assign(editingTask, data);
      else
        TRK.tasks.push(
          Object.assign({ id: uid(), status: 'todo', actualMinutes: 0, createdAt: Date.now() }, data),
        );
      TV.taskEditId = null;
      TV.filter = trackId;
      TV.createOpen = true;
      trkSave();
      renderTrack();
      toast(
        L(
          editingTask ? 'تم تحديث المهمة.' : 'تمت إضافة المهمة.',
          editingTask ? 'Task updated.' : 'Task added.',
        ),
      );
      return;
    }
    if (a === 'cancelTaskEdit') {
      TV.taskEditId = null;
      renderTrack();
      return;
    }
    if (D.scale) {
      TV.s = D.scale;
      TV.o = 0;
      TV.sel = trkY(new Date());
    } else if (a === 'prev' || a === 'next') {
      TV.o += a === 'next' ? 1 : -1;
      if (TV.s === 'week') {
        var nb = trkAdd(new Date(), TV.o * 7);
        TV.sel = trkY(trkAdd(nb, -trkIdx(nb)));
      } else if (TV.s === 'month') {
        TV.sel = trkY(new Date(new Date().getFullYear(), new Date().getMonth() + TV.o, 1));
      } else {
        TV.sel = trkY(new Date(new Date().getFullYear() + TV.o, 0, 1));
      }
    } else if (a === 'today') {
      TV.o = 0;
      TV.sel = trkY(new Date());
    } else if (a === 'quickAdd') {
      TV.sel = D.date || trkY(new Date());
      TV.open = true;
      TV.editId = null;
    } else if (a === 'cancelEdit') {
      TV.editId = null;
      TV.open = true;
    } else if (a === 'saveWindow') {
      var ws = $('tkWinS').value,
        we = $('tkWinE').value;
      if (!ws || !we || mins(we) <= mins(ws)) {
        toast(L('وقت النهاية لازم يكون بعد وقت البداية.', 'The end time must be after the start time.'));
        return;
      }
      TRK.win = [ws, we];
      trkSave();
      toast(L('تم تحديث ساعات عرض الأسبوع.', 'Week display hours updated.'));
    } else if (a === 'addTrack') {
      var name = $('tkName').value.trim();
      if (!name) {
        toast(L('اكتب اسم المسار أولاً.', 'Enter a track name first.'));
        return;
      }
      if (
        TRK.tracks.some(function (t) {
          return t.name.toLocaleLowerCase() === name.toLocaleLowerCase();
        })
      ) {
        toast(L('فيه مسار بنفس الاسم بالفعل.', 'A track with that name already exists.'));
        return;
      }
      var color = $('tkColor').value,
        goal = $('tkGoal') ? $('tkGoal').value.trim() : '',
        due = $('tkTrackDue') ? $('tkTrackDue').value : '',
        createdTrack = {
          id: uid(),
          name: name,
          color: /^#[0-9a-f]{6}$/i.test(color) ? color : DEFAULT_COLOR,
          goal: goal,
          dueDate: due,
          archived: false,
          createdAt: Date.now(),
        };
      TRK.tracks.push(createdTrack);
      var templateStages = Array.isArray(TV.pendingTemplateMilestones) ? TV.pendingTemplateMilestones : [];
      templateStages.forEach(function (stage) {
        TRK.milestones.push({
          id: uid(),
          trackId: createdTrack.id,
          title: lang === 'en' ? stage.en : stage.ar,
          description: '',
          startDate: '',
          dueDate: '',
          createdAt: Date.now(),
        });
      });
      TV.pendingTemplateMilestones = [];
      TV.open = true;
      TV.filter = createdTrack.id;
      trkSave();
      toast(
        templateStages.length
          ? L(
              'تم إنشاء المسار وإضافة ' + templateStages.length + ' مراحل من القالب.',
              'Track created with ' + templateStages.length + ' template milestones.',
            )
          : L('تم إنشاء المسار.', 'Track created.'),
      );
    } else if (a === 'addItem') {
      var start = $('tkS').value,
        end = $('tkE').value || start,
        from = $('tkF').value,
        to = $('tkTo').value,
        title = $('tkTitle').value.trim(),
        trackId = $('tkT').value;
      if (!start || !end || end < start) {
        toast(
          L(
            'تاريخ النهاية لازم يكون في نفس يوم البداية أو بعده.',
            'The end date must be the same as or later than the start date.',
          ),
        );
        return;
      }
      if ((from || to) && (!from || !to || mins(to) <= mins(from))) {
        toast(
          L(
            'أدخل وقت البداية والنهاية، واجعل النهاية بعد البداية.',
            'Enter both times, and make sure the end is after the start.',
          ),
        );
        return;
      }
      if (
        !TRK.tracks.some(function (t) {
          return t.id === trackId;
        })
      ) {
        toast(L('اختار مسارًا صالحًا.', 'Choose a valid track.'));
        return;
      }
      var obj = { trackId: trackId, title: title, start: start, end: end, from: from, to: to };
      if (TV.editId) {
        var old = TRK.items.filter(function (i) {
          return i.id === TV.editId;
        })[0];
        if (old) Object.assign(old, obj);
        else TRK.items.push(Object.assign({ id: uid() }, obj));
        toast(L('تم حفظ تعديل الخطة.', 'Plan changes saved.'));
      } else {
        obj.id = uid();
        TRK.items.push(obj);
        toast(L('تمت إضافة الخطة.', 'Plan added.'));
      }
      TV.sel = start;
      TV.editId = null;
      TV.open = false;
      trkSave();
    } else if (D.edit) {
      TV.editId = D.edit;
      var ei = TRK.items.filter(function (i) {
        return i.id === D.edit;
      })[0];
      if (ei) TV.sel = ei.start;
      TV.open = true;
    } else if (D.del) {
      TRK.items = TRK.items.filter(function (i) {
        return i.id !== D.del;
      });
      if (TV.editId === D.del) TV.editId = null;
      trkSave();
      toast(L('تم حذف الخطة.', 'Plan deleted.'));
    } else if (D.deltrack) {
      var dt = trkTr(D.deltrack);
      if (
        !window.confirm(
          L(
            'حذف المسار "' + dt.name + '" وكل الخطط والمهام التابعة له؟ يمكنك التراجع مرة واحدة.',
            'Delete track "' + dt.name + '" and its plans and tasks? You can undo once.',
          ),
        )
      )
        return;
      var activeTaskKey = scopedKey('kashkool.track.activeTask.v1'),
        activeTaskId = '';
      try {
        activeTaskId = localStorage.getItem(activeTaskKey) || '';
      } catch (e) {}
      var activeTaskRecord = trkTaskById(activeTaskId);
      if (
        activeTaskRecord &&
        activeTaskRecord.trackId === D.deltrack &&
        typeof pomo !== 'undefined' &&
        pomo &&
        pomo.running
      ) {
        pomoPause(true);
        trkLoad();
        dt = trkTr(D.deltrack);
      }
      TRK.trash = {
        type: 'track',
        track: dt,
        items: TRK.items.filter(function (i) {
          return i.trackId === D.deltrack;
        }),
        tasks: TRK.tasks.filter(function (t) {
          return t.trackId === D.deltrack;
        }),
        milestones: TRK.milestones.filter(function (m) {
          return m.trackId === D.deltrack;
        }),
        at: Date.now(),
      };
      if (activeTaskRecord && activeTaskRecord.trackId === D.deltrack) trkClearActiveTask();
      TRK.tracks = TRK.tracks.filter(function (t) {
        return t.id !== D.deltrack;
      });
      TRK.items = TRK.items.filter(function (i) {
        return i.trackId !== D.deltrack;
      });
      TRK.tasks = TRK.tasks.filter(function (t) {
        return t.trackId !== D.deltrack;
      });
      TRK.milestones = TRK.milestones.filter(function (m) {
        return m.trackId !== D.deltrack;
      });
      if (TV.filter === D.deltrack) TV.filter = '';
      if (
        TV.editId &&
        !TRK.items.some(function (i) {
          return i.id === TV.editId;
        })
      )
        TV.editId = null;
      trkSave();
      toast(L('تم حذف المسار. يمكنك استعادته من زر التراجع.', 'Track deleted. Use Undo to restore it.'));
    } else if (D.sel) TV.sel = D.sel;
    else if (D.month !== undefined) {
      var y = new Date().getFullYear() + TV.o;
      TV.o = (y - new Date().getFullYear()) * 12 + (+D.month - new Date().getMonth());
      TV.s = 'month';
      TV.sel = trkY(new Date(y, +D.month, 1));
    } else if (D.goto) {
      var g = trkD(D.goto),
        n = new Date();
      TV.o = (g.getFullYear() - n.getFullYear()) * 12 + g.getMonth() - n.getMonth();
      TV.s = 'month';
      TV.sel = D.goto;
    }
    renderTrack();
  }

  function render() {
    renderTabs();
    updateTip();
    if (mode === 'loading') {
      renderTodayHeader();
      return;
    }
    if (activeView === 'dashboard') renderDashboard();
    if (activeView === 'today') renderToday();
    if (activeView === 'week') renderWeek();
    if (activeView === 'hw') renderHomework();
    if (activeView === 'exams') renderExams();
    if (activeView === 'links') renderLinks();
    if (activeView === 'notes') renderNotes();
    if (activeView === 'track') renderTrack();
    if (activeView === 'subjects') renderSubjects();
    if (activeView === 'stats') renderStats();
    if (activeView === 'store') renderStore();
    if (activeView === 'learning' && window.KashKoolLearningOSRender) window.KashKoolLearningOSRender();
    if (activeView === 'flashcards' && window.KashkoolFlashcardsRender) window.KashkoolFlashcardsRender();
    if (activeView === 'stats' && window.KashkoolInsightsRender) window.KashkoolInsightsRender();
    renderPomoSubjectOptions();
    translateRenderedUI();
  }

  function renderFilter(elId) {
    var el = $(elId);
    if (!el) return;
    if (!state.subjects.length) {
      el.innerHTML = '';
      return;
    }
    var html =
      '<span class="lbl">المواد:</span>' +
      '<button class="fchip" type="button" data-filter="" aria-pressed="' +
      (subjectFilter ? 'false' : 'true') +
      '">الكل</button>';
    state.subjects
      .slice()
      .sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', 'ar');
      })
      .forEach(function (s) {
        var on = subjectFilter === s.id;
        html +=
          '<button class="fchip" type="button" data-filter="' +
          esc(s.id) +
          '" aria-pressed="' +
          (on ? 'true' : 'false') +
          '" style="color:' +
          esc(s.color || DEFAULT_COLOR) +
          '">' +
          esc(s.name) +
          '</button>';
      });
    el.innerHTML = html;
  }

  function renderTabs() {
    var open = state.homework.filter(function (h) {
      return !h.done;
    }).length;
    $('hwCount').textContent = open ? '(' + open + ')' : '';
  }

  function sortedEntriesFor(dayIndex) {
    return state.entries
      .filter(function (e) {
        return +e.day === dayIndex;
      })
      .sort(function (a, b) {
        var ka = a.noTime ? -1 : mins(a.from),
          kb = b.noTime ? -1 : mins(b.from);
        return ka - kb;
      });
  }

  function entryRow(e, opts) {
    var color = colorOf(e.subjectId);
    var sub = subjectById(e.subjectId);
    var title = e.title || (sub ? sub.name : 'بدون عنوان');
    var meta = [];
    if (sub && e.title) meta.push(sub.name);
    if (e.place) meta.push(e.place);
    if (e.note) meta.push(e.note);
    var flag = opts && opts.flag ? '<span class="flag">' + esc(opts.flag) + '</span>' : '';
    var cls = 'row' + (opts && opts.now ? ' is-now' : '') + (opts && opts.past ? ' is-past' : '');
    return (
      '<div class="' +
      cls +
      '">' +
      '<span class="when">' +
      (e.noTime ? 'طول<br>اليوم' : esc(fmtTime(e.from)) + (e.to ? '<br>' + esc(fmtTime(e.to)) : '')) +
      '</span>' +
      '<span class="bar" style="background:' +
      esc(color) +
      '"></span>' +
      '<button class="what" type="button" data-edit-entry="' +
      esc(e.id) +
      '"><strong>' +
      esc(title) +
      '</strong>' +
      (meta.length ? '<span>' + esc(meta.join(' · ')) + '</span>' : '') +
      '</button>' +
      '<span class="tail">' +
      flag +
      linkBtn(e.link) +
      '</span>' +
      '</div>'
    );
  }

  function renderToday() {
    var now = new Date();
    var idx = todayIdx();
    $('todayName').innerHTML = bilingualPair(DAYS_AR[idx], DAYS_EN[idx], 'todayBilingualHead');
    $('todayDate').textContent = fmtDate(now) + ' ' + now.getFullYear();

    var list = sortedEntriesFor(idx);
    var nowM = now.getHours() * 60 + now.getMinutes();
    var html = '',
      nextFound = false;
    countdownState = null;
    if (!list.length) {
      html =
        '<div class="empty bilingualMeta">' +
        bilingualPair('اليوم لسه فاضي.', tr('emptyTodayEnglish')) +
        '<button class="add" type="button" data-add="entry">' +
        esc(tr('addEntry')) +
        '</button></div>';
      $('todayPulse').hidden = true;
    } else {
      var current = null;
      list.forEach(function (e) {
        if (e.noTime) {
          html += entryRow(e, { now: false, past: false, flag: '' });
          return;
        }
        var s = mins(e.from),
          en = e.to ? mins(e.to) : s + 45;
        var isNow = nowM >= s && nowM < en;
        var past = nowM >= en;
        var flag = '';
        if (isNow) {
          flag = bilingualPair('دلوقتي', 'Now', 'langPair--inline');
          current = e;
        } else if (!past && !nextFound) {
          flag = bilingualPair('الجاي', 'Next', 'langPair--inline');
          nextFound = true;
        }
        html += entryRow(e, { now: isNow, past: past, flag: flag });
      });
      var pulse = $('todayPulse');
      var dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      if (current) {
        var sub = subjectById(current.subjectId);
        var en = current.to ? mins(current.to) : mins(current.from) + 45;
        $('pulseText').innerHTML =
          '<span>' +
          bilingualPair('دلوقتي', 'Now', 'langPair--inline') +
          '</span> <span>' +
          esc(current.title || (sub ? sub.name : lang === 'en' ? 'Class' : 'حصة')) +
          esc(L(' — باقي ', ' — ')) +
          '</span>';
        countdownState = { target: dayStart + en * 60000, key: 'now:' + current.id };
        pulse.hidden = false;
      } else {
        var upcoming = list.filter(function (e) {
          return !e.noTime && mins(e.from) > nowM;
        });
        if (upcoming.length) {
          var nx = upcoming[0],
            nsub = subjectById(nx.subjectId);
          $('pulseText').innerHTML =
            '<span>' +
            bilingualPair('الجاي', 'Next', 'langPair--inline') +
            '</span> <span>' +
            esc(nx.title || (nsub ? nsub.name : lang === 'en' ? 'Class' : 'حصة')) +
            esc(L(' بعد ', ' in ')) +
            '</span>';
          countdownState = { target: dayStart + mins(nx.from) * 60000, key: 'next:' + nx.id };
          pulse.hidden = false;
        } else {
          pulse.hidden = true;
        }
      }
    }
    tickCountdown();
    $('todayEntries').innerHTML = list.length ? '<div class="panel">' + html + '</div>' : html;

    // homework due within a week or overdue
    var soon = state.homework
      .filter(function (h) {
        if (h.done) return false;
        var d = parseYmd(h.due);
        if (!d) return true;
        return dayDiff(now, d) <= 7;
      })
      .sort(sortHw);
    $('todayHw').innerHTML = soon.length
      ? '<div class="panel">' + soon.map(hwRow).join('') + '</div>'
      : '<div class="empty bilingualMeta">' +
        bilingualPair('مفيش واجب قريب.', tr('emptyHomeworkEnglish')) +
        '<button class="add" type="button" data-add="hw">' +
        esc(tr('addHomework')) +
        '</button></div>';

    // خلاصة اليوم
    var left = list.filter(function (e) {
      if (e.noTime) return true;
      var en = e.to ? mins(e.to) : mins(e.from) + 45;
      return nowM < en;
    }).length;
    var dueToday = state.homework.filter(function (h) {
      if (h.done) return false;
      var d = parseYmd(h.due);
      return d && dayDiff(now, d) === 0;
    }).length;
    var bits = [];
    if (lang === 'en') {
      if (list.length) bits.push(list.length === 1 ? '1 lesson' : list.length + ' lessons');
      if (list.length && left) bits.push(left + ' remaining');
      if (list.length && !left) bits.push('Schedule complete');
      if (dueToday) bits.push(dueToday === 1 ? '1 homework due today' : dueToday + ' homework due today');
    } else {
      if (list.length) bits.push(countWord(list.length, 'حصة واحدة', 'حصتين', 'حصص', 'حصة'));
      if (list.length && left) bits.push('فاضل ' + left);
      if (list.length && !left) bits.push('خلص الجدول');
      if (dueToday)
        bits.push(
          countWord(
            dueToday,
            'واجب تسليمه النهاردة',
            'واجبين تسليمهم النهاردة',
            'واجبات تسليمهم النهاردة',
            'واجب تسليمه النهاردة',
          ),
        );
    }
    $('todaySummary').textContent = bits.join(' · ');
    syncTodayStreak();
  }

  function countWord(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n <= 10) return n + ' ' + few;
    return n + ' ' + many;
  }

  function sortHw(a, b) {
    var da = parseYmd(a.due),
      dbb = parseYmd(b.due);
    if (!da && !dbb) return 0;
    if (!da) return 1;
    if (!dbb) return -1;
    return da - dbb;
  }

  function dueInfo(h) {
    var d = parseYmd(h.due);
    if (!d) return { text: 'من غير ميعاد', en: 'No due date', tone: '' };
    var diff = dayDiff(new Date(), d);
    if (diff < 0)
      return { text: 'متأخر ' + arabicDays(Math.abs(diff)), en: tr('overdueEnglish'), tone: 'late' };
    if (diff === 0) return { text: 'النهاردة', en: tr('todayDueEnglish'), tone: 'now' };
    if (diff === 1) return { text: 'بكرة', en: tr('tomorrowEnglish'), tone: 'soon' };
    if (diff <= 6) {
      var di = idxOfDate(d);
      return { text: 'يوم ' + DAYS_AR[di], en: DAYS_EN[di], tone: 'soon' };
    }
    return {
      text: fmtDate(d),
      en: d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      tone: '',
    };
  }

  function hwRow(h) {
    var sub = subjectById(h.subjectId);
    var info = h.done ? { text: 'خلصت', en: tr('doneEnglish'), tone: '' } : dueInfo(h);
    var meta = [];
    if (h.note) meta.push(h.note);
    return (
      '<div class="hw' +
      (h.done ? ' done' : '') +
      '">' +
      '<input class="tick" type="checkbox" ' +
      (h.done ? 'checked' : '') +
      ' data-toggle-hw="' +
      esc(h.id) +
      '" aria-label="' +
      esc(L('خلصت', 'Done')) +
      '">' +
      '<button class="hw__body" type="button" data-edit-hw="' +
      esc(h.id) +
      '">' +
      '<strong>' +
      (sub
        ? '<span class="chip" style="color:' +
          esc(sub.color || DEFAULT_COLOR) +
          '">' +
          esc(sub.name) +
          '</span>'
        : '') +
      esc(h.title || (lang === 'en' ? 'Homework' : 'واجب')) +
      '</strong>' +
      (meta.length ? '<span>' + esc(meta.join(' · ')) + '</span>' : '') +
      '</button>' +
      '<span class="tail"><span class="due ' +
      info.tone +
      '"><span>' +
      esc(lang === 'en' ? info.en : info.text) +
      '</span>' +
      '</span>' +
      linkBtn(h.link) +
      '</span>' +
      '</div>'
    );
  }
  function renderWeek() {
    var ws = startOfWeek();
    $('weekRange').textContent = fmtDate(ws) + ' – ' + fmtDate(addDays(ws, 6));
    renderFilter('weekFilter');
    var ti = todayIdx();
    var html = '';
    for (var i = 0; i < 7; i++) {
      var date = addDays(ws, i);
      var list = sortedEntriesFor(i).filter(function (e) {
        return !subjectFilter || e.subjectId === subjectFilter;
      });
      html +=
        '<div class="day' +
        (i === ti ? ' today' : '') +
        '">' +
        '<div class="day__head"><b>' +
        DAYS[i] +
        '</b><em>' +
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '</em></div>';
      list.forEach(function (e) {
        var sub = subjectById(e.subjectId);
        var title = e.title || (sub ? sub.name : 'بدون عنوان');
        var line = e.noTime ? 'طول اليوم' : fmtTime(e.from) + (e.to ? ' – ' + fmtTime(e.to) : '');
        if (e.place) line += ' · ' + e.place;
        html +=
          '<div class="slot" style="border-color:' +
          esc(colorOf(e.subjectId)) +
          '">' +
          '<button class="slot__main" type="button" data-edit-entry="' +
          esc(e.id) +
          '">' +
          '<b>' +
          esc(title) +
          '</b><i>' +
          esc(line) +
          '</i></button>' +
          linkBtn(e.link) +
          '</div>';
      });
      html += '<button class="day__add" type="button" data-add-day="' + i + '">+</button></div>';
    }
    $('weekGrid').innerHTML = html;
  }

  function renderHomework() {
    var open = state.homework
      .filter(function (h) {
        return !h.done;
      })
      .sort(sortHw);
    var done = state.homework
      .filter(function (h) {
        return h.done;
      })
      .sort(sortHw);
    var now = new Date();
    var late = [],
      week = [],
      later = [];
    open.forEach(function (h) {
      var d = parseYmd(h.due);
      if (!d) {
        later.push(h);
        return;
      }
      var diff = dayDiff(now, d);
      if (diff < 0) late.push(h);
      else if (diff <= 7) week.push(h);
      else later.push(h);
    });
    var html = '';
    function group(title, enTitle, arr) {
      if (!arr.length) return '';
      return (
        '<div class="group-title"><span>' +
        esc(lang === 'en' ? enTitle : title) +
        '</span> (' +
        arr.length +
        ')</div>' +
        '<div class="panel">' +
        arr.map(hwRow).join('') +
        '</div>'
      );
    }
    html += group('متأخرة', 'Overdue', late);
    html += group('الأسبوع ده', 'This week', week);
    html += group('بعدين', 'Later', later);
    html += group('خلصت', tr('doneEnglish'), done);
    if (!html)
      html =
        '<div class="empty bilingualMeta">' +
        bilingualPair('مفيش واجبات متسجلة.', tr('emptyAllHomeworkEnglish')) +
        '<button class="add" type="button" data-add="hw">' +
        esc(tr('addHomework')) +
        '</button></div>';
    $('hwList').innerHTML = html;
  }

  function examTargetMs(x) {
    var d = parseYmd(x.date);
    if (!d) return null;
    if (x.time) {
      var p = String(x.time).split(':');
      d.setHours(+p[0] || 0, +p[1] || 0, 0, 0);
    } else {
      d.setHours(23, 59, 0, 0);
    }
    return d.getTime();
  }
  function sortExam(a, b) {
    var ta = examTargetMs(a),
      tb = examTargetMs(b);
    if (ta === null && tb === null) return 0;
    if (ta === null) return 1;
    if (tb === null) return -1;
    return ta - tb;
  }
  function examRow(x) {
    var sub = subjectById(x.subjectId);
    var info = dueInfo({ due: x.date });
    var meta = [];
    if (sub) meta.push(sub.name);
    if (x.time) meta.push(fmtTime(x.time));
    if (x.place) meta.push(x.place);
    if (x.note) meta.push(x.note);
    return (
      '<button class="exrow" type="button" data-edit-exam="' +
      esc(x.id) +
      '">' +
      '<span class="bar" style="background:' +
      esc(sub && sub.color ? sub.color : DEFAULT_COLOR) +
      '"></span>' +
      '<span><strong>' +
      esc(x.title || (sub ? sub.name : 'امتحان')) +
      '</strong>' +
      (meta.length ? '<span class="meta">' + esc(meta.join(' · ')) + '</span>' : '') +
      '</span>' +
      '<span class="due ' +
      info.tone +
      '">' +
      esc(info.text) +
      '</span>' +
      '</button>'
    );
  }

  function renderExams() {
    var now = new Date();
    var list = state.exams.slice().sort(sortExam);
    var late = [],
      week = [],
      later = [];
    list.forEach(function (x) {
      var d = parseYmd(x.date);
      if (!d) {
        later.push(x);
        return;
      }
      var diff = dayDiff(now, d);
      if (diff < 0) late.push(x);
      else if (diff <= 7) week.push(x);
      else later.push(x);
    });
    var html = '';
    function group(title, arr) {
      if (!arr.length) return '';
      return (
        '<div class="group-title">' +
        title +
        ' (' +
        arr.length +
        ')</div>' +
        '<div class="panel">' +
        arr.map(examRow).join('') +
        '</div>'
      );
    }
    html += group('فاتت', late);
    html += group('الأسبوع ده', week);
    html += group('بعدين', later);
    if (!html)
      html =
        '<div class="empty">مفيش امتحانات متسجلة.<br><button class="add" type="button" data-add="exam">ضيف أول امتحان</button></div>';
    $('examList').innerHTML = html;

    var upcoming = list.filter(function (x) {
      var t = examTargetMs(x);
      return t !== null && t >= now.getTime();
    });
    var hero = $('examHero');
    if (upcoming.length) {
      var x = upcoming[0];
      var sub = subjectById(x.subjectId);
      $('examHeroLabel').textContent = 'أقرب امتحان' + (sub ? ' — ' + sub.name : '');
      $('examHeroTitle').textContent = x.title || (sub ? sub.name : 'امتحان');
      examCountdownState = { target: examTargetMs(x), id: x.id };
      hero.hidden = false;
    } else {
      examCountdownState = null;
      hero.hidden = true;
    }
    tickExamHero();
  }

  function renderLinks() {
    renderFilter('linksFilter');
    var list = state.links
      .filter(function (l) {
        return !subjectFilter || l.subjectId === subjectFilter;
      })
      .sort(function (a, b) {
        var sa = subjectById(a.subjectId),
          sb = subjectById(b.subjectId);
        var na = sa ? sa.name : 'ﻯ',
          nb = sb ? sb.name : 'ﻯ';
        if (na !== nb) return na.localeCompare(nb, 'ar');
        return (a.title || '').localeCompare(b.title || '', 'ar');
      });
    if (!list.length) {
      $('linksList').innerHTML =
        '<div class="empty">' +
        (subjectFilter
          ? L('مفيش شروحات محفوظة للمادة دي.', 'No saved resources for this subject yet.')
          : L(
              'احفظ هنا شروح اليوتيوب أو أي منصة، وبعدين تقدر تربطها بأي حصة في الجدول.',
              "Save YouTube or any other platform's explainers here, then link them to any class in your schedule.",
            )) +
        '<br><button class="add" type="button" data-add="link">' +
        L('ضيف لينك', 'Add resource') +
        '</button></div>';
      return;
    }
    var html = '<div class="links">';
    list.forEach(function (l) {
      var sub = subjectById(l.subjectId);
      var meta = [];
      if (sub) meta.push(sub.name);
      meta.push(hostOf(l.url));
      if (l.note) meta.push(l.note);
      html +=
        '<div class="linkitem">' +
        '<span class="swatch" style="background:' +
        esc(sub && sub.color ? sub.color : DEFAULT_COLOR) +
        '"></span>' +
        '<button class="linkitem__body" type="button" data-edit-link="' +
        esc(l.id) +
        '">' +
        '<strong>' +
        esc(l.title || hostOf(l.url)) +
        '</strong><span>' +
        esc(meta.join(' · ')) +
        '</span>' +
        '</button>' +
        '<span class="tail">' +
        linkBtn(l.url, lang === 'en' ? 'Open' : 'افتح') +
        '</span>' +
        '</div>';
    });
    html += '</div>';
    $('linksList').innerHTML = html;
  }

  function relativeDay(ms) {
    if (!ms) return '';
    var d = new Date(ms);
    var diff = dayDiff(new Date(), d);
    if (diff === 0) return 'النهاردة';
    if (diff === 1) return 'إمبارح';
    return fmtDate(d);
  }

  function renderNotes() {
    renderFilter('notesFilter');
    var list = state.notes
      .filter(function (n) {
        return !subjectFilter || n.subjectId === subjectFilter;
      })
      .sort(function (a, b) {
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
    if (!list.length) {
      $('notesList').innerHTML =
        '<div class="empty">' +
        (subjectFilter ? 'مفيش نوتات للمادة دي.' : 'لسه مفيش نوتات. دوّن أول حاجة عايز تفتكرها.') +
        '<br><button class="add" type="button" data-add="note">ضيف نوتة</button></div>';
      return;
    }
    var html = '<div class="notes">';
    list.forEach(function (n) {
      var sub = subjectById(n.subjectId);
      var meta = [relativeDay(n.updatedAt)];
      if (sub) meta.push(sub.name);
      var body = n.body || '';
      var heading = n.title;
      var preview = body;
      if (!heading) {
        var nl = body.indexOf('\n');
        heading = (nl === -1 ? body : body.slice(0, nl)).trim() || 'بدون عنوان';
        preview = nl === -1 ? '' : body.slice(nl + 1);
      }
      html +=
        '<button class="notecard" type="button" data-edit-note="' +
        esc(n.id) +
        '">' +
        '<span class="bar" style="background:' +
        esc(sub && sub.color ? sub.color : DEFAULT_COLOR) +
        '"></span>' +
        '<strong>' +
        esc(heading) +
        '</strong>' +
        (preview.trim() ? '<p>' + esc(preview) + '</p>' : '') +
        '<span class="meta">' +
        esc(meta.filter(Boolean).join(' · ')) +
        '</span>' +
        '</button>';
    });
    html += '</div>';
    $('notesList').innerHTML = html;
  }

  var LS_STATS = 'kashkool.study.stats.v1';
  var LS_PROGRESS_GOAL = 'kashkool.progress.goal.v1';
  function loadPomoSubject() {
    var saved = '';
    try {
      saved = localStorage.getItem(scopedKey(LS_POMO_SUBJECT)) || '';
    } catch (e) {}
    pomo.subjectId =
      saved &&
      state.subjects.some(function (s) {
        return s.id === saved;
      })
        ? saved
        : '';
  }
  function savePomoSubject(id) {
    id = String(id || '');
    if (
      id &&
      !state.subjects.some(function (s) {
        return s.id === id;
      })
    )
      id = '';
    pomo.subjectId = id;
    try {
      localStorage.setItem(scopedKey(LS_POMO_SUBJECT), id);
    } catch (e) {}
    renderPomoSubjectOptions();
    syncPomoUI();
  }
  function renderPomoSubjectOptions() {
    var sel = $('pomoSubject');
    if (!sel) return;
    if (
      pomo.subjectId &&
      !state.subjects.some(function (s) {
        return s.id === pomo.subjectId;
      })
    )
      pomo.subjectId = '';
    var options = '<option value="">' + esc(tr('noStudySubject')) + '</option>';
    state.subjects
      .slice()
      .sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', lang === 'en' ? 'en' : 'ar');
      })
      .forEach(function (s) {
        options += '<option value="' + esc(s.id) + '">' + esc(s.name || '') + '</option>';
      });
    sel.innerHTML = options;
    sel.value = pomo.subjectId || '';
    sel.dir = lang === 'en' ? 'ltr' : 'rtl';
    if ($('pomoSubjectLabel')) $('pomoSubjectLabel').textContent = tr('studySubject');
    if ($('pomoSubjectHint')) $('pomoSubjectHint').textContent = tr('studySubjectHint');
  }
  function formatStudyMinutes(mins) {
    mins = Math.max(0, Math.round(+mins || 0));
    var h = Math.floor(mins / 60),
      m = mins % 60;
    if (lang === 'en') return h ? (m ? h + 'h ' + m + 'm' : h + 'h') : m + 'm';
    return h ? (m ? h + ' س ' + m + ' د' : h + ' س') : m + ' د';
  }
  function lastStudiedText(at) {
    if (!at) return '—';
    var d = new Date(at),
      diff = dayDiff(d, new Date());
    if (lang === 'en') {
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      if (diff > 1) return diff + ' days ago';
    } else {
      if (diff === 0) return 'النهاردة';
      if (diff === 1) return 'إمبارح';
      if (diff > 1) return 'من ' + diff + ' يوم';
    }
    return fmtDate(d);
  }
  function renderSubjectStudyTracking() {
    var box = $('subjectStudyGrid');
    if (!box) return;
    var sessions = loadStudyStats(),
      ws = startOfWeek(),
      grouped = {},
      totalGrouped = {};
    sessions.forEach(function (x) {
      var mins = +x.minutes || 0;
      if (mins <= 0) return;
      var key =
        x.subjectId &&
        state.subjects.some(function (s) {
          return s.id === x.subjectId;
        })
          ? x.subjectId
          : '';
      if (!totalGrouped[key]) totalGrouped[key] = { minutes: 0, sessions: 0, last: 0 };
      totalGrouped[key].minutes += mins;
      totalGrouped[key].sessions += 1;
      totalGrouped[key].last = Math.max(totalGrouped[key].last, +x.at || 0);
      var diff = dayDiff(ws, new Date(x.at));
      if (diff >= 0 && diff < 7) {
        if (!grouped[key]) grouped[key] = { minutes: 0, sessions: 0, last: 0 };
        grouped[key].minutes += mins;
        grouped[key].sessions += 1;
        grouped[key].last = Math.max(grouped[key].last, +x.at || 0);
      }
    });
    var rows = state.subjects.map(function (s) {
      var w = grouped[s.id] || { minutes: 0, sessions: 0, last: 0 },
        t = totalGrouped[s.id] || { minutes: 0, sessions: 0, last: 0 };
      return {
        id: s.id,
        name: s.name,
        color: s.color || DEFAULT_COLOR,
        week: w.minutes,
        weekSessions: w.sessions,
        total: t.minutes,
        totalSessions: t.sessions,
        last: t.last,
      };
    });
    if (totalGrouped['']) {
      var w0 = grouped[''] || { minutes: 0, sessions: 0, last: 0 },
        t0 = totalGrouped[''];
      rows.push({
        id: '',
        name: tr('uncategorized'),
        color: DEFAULT_COLOR,
        week: w0.minutes,
        weekSessions: w0.sessions,
        total: t0.minutes,
        totalSessions: t0.sessions,
        last: t0.last,
      });
    }
    rows = rows
      .filter(function (r) {
        return r.total > 0;
      })
      .sort(function (a, b) {
        return b.week - a.week || b.total - a.total;
      });
    if (!rows.length) {
      box.innerHTML = '<div class="subjectStudyEmpty">' + esc(tr('subjectStudyEmpty')) + '</div>';
      return;
    }
    var weekTotal = rows.reduce(function (a, r) {
        return a + r.week;
      }, 0),
      max = Math.max.apply(
        null,
        rows
          .map(function (r) {
            return r.week;
          })
          .concat([1]),
      );
    box.innerHTML = rows
      .map(function (r) {
        var pct = r.week ? Math.round((r.week / weekTotal) * 100) : 0,
          bar = r.week ? Math.max(4, Math.round((r.week / max) * 100)) : 0;
        var barStyle = r.week
          ? 'width:' + bar + '%;background:' + esc(r.color)
          : 'width:0%;background:' + esc(r.color);
        return (
          '<article class="subjectStudyCard"><div class="subjectStudyHead"><div class="subjectStudyName"><i class="subjectStudyDot" style="background:' +
          esc(r.color) +
          '"></i><b>' +
          esc(r.name) +
          '</b></div><span class="subjectStudyTime">' +
          esc(formatStudyMinutes(r.week)) +
          '</span></div><div class="subjectStudyMeta"><span>' +
          esc(tr('thisWeek')) +
          ' · ' +
          r.weekSessions +
          ' ' +
          esc(tr('sessionsLabel')) +
          '</span><span>' +
          pct +
          '%</span></div><div class="subjectStudyBar"><i style="' +
          barStyle +
          '"></i></div><div class="subjectStudyMeta"><span>' +
          esc(tr('totalTime')) +
          ' · ' +
          esc(formatStudyMinutes(r.total)) +
          '</span><span>' +
          r.totalSessions +
          ' ' +
          esc(tr('sessionsLabel')) +
          '</span></div><div class="subjectStudyMeta"><span>' +
          esc(tr('lastStudied')) +
          '</span><span>' +
          esc(lastStudiedText(r.last)) +
          '</span></div></article>'
        );
      })
      .join('');
  }
  function loadStudyStats() {
    try {
      var x = JSON.parse(localStorage.getItem(scopedKey(LS_STATS)) || '[]');
      return Array.isArray(x) ? x : [];
    } catch (e) {
      return [];
    }
  }
  function logStudySession(minutes, subjectId) {
    var list = loadStudyStats();
    subjectId = String(subjectId || '');
    if (
      subjectId &&
      !state.subjects.some(function (s) {
        return s.id === subjectId;
      })
    )
      subjectId = '';
    list.push({ at: Date.now(), minutes: Math.max(1, Math.round(minutes || 0)), subjectId: subjectId });
    try {
      attributeStepTime(Math.max(1, Math.round(minutes || 0)));
    } catch (e) {}
    try {
      trkRecordStudyMinutes(Math.max(1, Math.round(minutes || 0)));
    } catch (e) {}
    if (list.length > 500) list = list.slice(-500);
    try {
      localStorage.setItem(scopedKey(LS_STATS), JSON.stringify(list));
    } catch (e) {}
    try {
      var kkActiveTask = localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
      if (window.KashKoolLearningOS && window.KashKoolLearningOS.onStudySession)
        window.KashKoolLearningOS.onStudySession(minutes, subjectId, kkActiveTask);
    } catch (e) {}
    syncTodayStreak();
    if (activeView === 'stats') renderStats();
  }
  function localDateKey(d) {
    var x = d instanceof Date ? d : new Date(d);
    return (
      x.getFullYear() +
      '-' +
      String(x.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(x.getDate()).padStart(2, '0')
    );
  }
  function dayBefore(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - 1);
    return x;
  }
  function getStudyStreak() {
    var sessions = loadStudyStats(),
      days = {};
    sessions.forEach(function (x) {
      if ((+x.minutes || 0) > 0) days[localDateKey(x.at)] = true;
    });
    var today = new Date(),
      todayKey = localDateKey(today),
      todayStudied = !!days[todayKey];
    var start = todayStudied ? today : dayBefore(today),
      current = 0,
      cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (days[localDateKey(cursor)]) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
    var keys = Object.keys(days).sort(),
      longest = 0,
      run = 0,
      prev = null;
    keys.forEach(function (k) {
      var parts = k.split('-').map(Number),
        d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (prev && dayDiff(prev, d) === 1) run++;
      else run = 1;
      if (run > longest) longest = run;
      prev = d;
    });
    return { current: current, todayStudied: todayStudied, longest: longest };
  }
  function syncTodayStreak() {
    var el = $('todayStreak'),
      val = $('todayStreakValue'),
      label = $('todayStreakLabel'),
      state = $('todayStreakState');
    if (!el || !val || !label || !state) return;
    var st = getStudyStreak(),
      n = st.current;
    val.textContent = n;
    label.textContent = tr('dayStreak');
    state.textContent = st.todayStudied ? tr('streakSafe') : n ? tr('streakRisk') : tr('streakAtRisk');
    el.classList.toggle('is-safe', st.todayStudied);
    el.classList.toggle('is-risk', !st.todayStudied);
    el.title = tr('longestStreak') + ': ' + st.longest + ' ' + tr('dayStreak');
  }
  /* ---------- progress hero polish ---------- */
  function loadWeeklyGoal() {
    try {
      var raw = localStorage.getItem(scopedKey(LS_PROGRESS_GOAL));
      var n = raw === null || raw === '' ? NaN : +raw;
      if (isFinite(n) && n > 0) return Math.max(30, Math.min(6000, Math.round(n)));
    } catch (e) {}
    return 600;
  }
  function saveWeeklyGoal(n) {
    try {
      localStorage.setItem(scopedKey(LS_PROGRESS_GOAL), String(n));
    } catch (e) {}
  }
  function formatStudyMinutes(n) {
    n = Math.max(0, Math.round(n));
    if (lang === 'en') return n >= 60 ? Math.floor(n / 60) + 'h ' + (n % 60) + 'm' : n + ' min';
    return n >= 60 ? Math.floor(n / 60) + 'س ' + (n % 60) + 'د' : n + ' دقيقة';
  }
  function pgTween(el, to, fmt) {
    if (!el) return;
    var from = el._pv == null ? 0 : el._pv;
    el._pv = to;
    if (el._raf) cancelAnimationFrame(el._raf);
    if (from === to || document.body.classList.contains('reduce-motion')) {
      el.textContent = fmt(to);
      return;
    }
    var t0 = performance.now();
    (function f(t) {
      var k = Math.min(1, (t - t0) / 700),
        e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
      if (k < 1) el._raf = requestAnimationFrame(f);
    })(t0);
  }
  function updateProgressHero(total, previousTotal) {
    var goal = loadWeeklyGoal(),
      pct = Math.min(100, Math.round((total / goal) * 100));
    pgTween($('progressHeroMinutes'), total, formatStudyMinutes);
    $('progressHeroCopy').textContent = lang === 'en' ? 'Study time completed' : 'وقت المذاكرة المكتمل';
    pgTween($('progressGoalPercent'), pct, function (v) {
      return v + '%';
    });
    $('progressGoalMeta').textContent = formatStudyMinutes(total) + ' / ' + formatStudyMinutes(goal);
    $('progressGoalBar').style.width = pct + '%';
    var ph = document.querySelector('.progressHero');
    if (ph) ph.classList.toggle('is-complete', total >= goal);
    var en = lang === 'en',
      expPct = Math.round(((Math.min(6, todayIdx()) + 1) / 7) * 100),
      expMin = (goal * expPct) / 100,
      gap = Math.round(total - expMin),
      st = $('progressGoalStatus');
    $('progressGoalMark').style.insetInlineStart = expPct + '%';
    $('progressGoalMark').title = en ? 'Where you should be today' : 'المفروض تكون هنا النهارده';
    if (st) {
      var ahead = total >= goal || gap >= 0;
      st.className = 'progressGoal__status ' + (ahead ? 'is-ahead' : 'is-behind');
      st.textContent =
        total >= goal
          ? en
            ? 'Goal reached ✓'
            : 'الهدف اتحقق ✓'
          : gap === 0
            ? en
              ? 'Right on plan'
              : 'ماشي على الخطة'
            : ahead
              ? (en ? 'Ahead of plan by ' : 'قدّام الخطة بـ ') + formatStudyMinutes(gap)
              : (en ? 'Behind plan by ' : 'ورا الخطة بـ ') + formatStudyMinutes(-gap);
    }
    var remaining = Math.max(0, goal - total),
      elapsed = Math.min(6, todayIdx()),
      daysLeft = Math.max(1, 7 - elapsed);
    if ($('progressGoalRemaining'))
      $('progressGoalRemaining').textContent =
        (lang === 'en' ? 'Remaining: ' : 'متبقي: ') + formatStudyMinutes(remaining);
    if ($('progressGoalPace'))
      $('progressGoalPace').textContent =
        (lang === 'en' ? 'Daily pace: ' : 'الوتيرة اليومية: ') +
        formatStudyMinutes(Math.ceil(remaining / daysLeft));
    var compare = 0;
    if (previousTotal === 0) compare = total > 0 ? 100 : 0;
    else compare = Math.round(((total - previousTotal) / previousTotal) * 100);
    var cmp = $('progressHeroCompare');
    cmp.classList.toggle('is-down', compare < 0);
    cmp.textContent =
      previousTotal === 0
        ? total > 0
          ? lang === 'en'
            ? 'New week started ↑'
            : 'بداية جديدة ↑'
          : lang === 'en'
            ? 'No comparison yet'
            : 'لا توجد مقارنة بعد'
        : compare === 0
          ? lang === 'en'
            ? 'Same as last week so far'
            : 'زي الأسبوع الماضي لحد دلوقتي'
          : (compare > 0 ? '↑ ' : '↓ ') +
            Math.abs(compare) +
            '% ' +
            (lang === 'en' ? 'vs same point last week' : 'عن نفس الوقت الأسبوع الماضي');
  }
  function renderStats() {
    var sessions = loadStudyStats(),
      ws = startOfWeek(),
      days = [0, 0, 0, 0, 0, 0, 0],
      dayHasStudy = [false, false, false, false, false, false, false];
    sessions.forEach(function (x) {
      var d = new Date(x.at),
        diff = dayDiff(ws, d);
      if (diff >= 0 && diff < 7) {
        var mins = +x.minutes || 0;
        days[diff] += mins;
        if (mins > 0) dayHasStudy[diff] = true;
      }
    });
    var total = days.reduce(function (a, b) {
      return a + b;
    }, 0);
    var prevWs = addDays(ws, -7),
      prevWe = addDays(new Date(), -7).getTime(),
      previousTotal = 0;
    sessions.forEach(function (x) {
      if (x.at >= prevWs.getTime() && x.at < prevWe) previousTotal += +x.minutes || 0;
    });
    updateProgressHero(total, previousTotal);
    var sk = getStudyStreak(),
      skEl = $('progressHeroStreak');
    if (skEl) {
      skEl.className = 'progressHero__streak' + (sk.todayStudied ? ' is-safe' : '');
      skEl.textContent =
        sk.current > 0
          ? '🔥 ' +
            sk.current +
            ' ' +
            (lang === 'en' ? (sk.current === 1 ? 'day streak' : 'day streak') : 'يوم متتالي') +
            (sk.todayStudied
              ? ''
              : lang === 'en'
                ? ' · study today to keep it'
                : ' · ذاكر النهارده علشان تحافظ عليه')
          : lang === 'en'
            ? 'Start a streak today'
            : 'ابدأ سلسلة أيامك النهارده';
    }
    var weekSessions = sessions.filter(function (x) {
      return x.at >= ws.getTime();
    }).length;
    var done = state.homework.filter(function (h) {
        return h.done;
      }).length,
      all = state.homework.length,
      rate = all ? Math.round((done / all) * 100) : 0;
    var activeDays = dayHasStudy.filter(Boolean).length;
    var elapsedDays = Math.min(7, todayIdx() + 1),
      avg = Math.round(total / elapsedDays);
    var best = Math.max.apply(null, days.concat([0]));
    var streakInfo = getStudyStreak(),
      streak = streakInfo.current,
      longest = streakInfo.longest;
    $('statMinutes').textContent = total;
    $('statSessions').textContent = weekSessions;
    $('statHwRate').textContent = rate + '%';
    $('statActiveDays').textContent = activeDays + '/7';
    $('statAvgDay').textContent = avg + (lang === 'en' ? ' min' : ' دقيقة');
    $('statBestDay').textContent = best + (lang === 'en' ? ' min' : ' دقيقة');
    $('statStreak').textContent = streak + ' ' + (lang === 'en' ? 'days' : 'يوم');
    $('statLongestStreak').textContent = longest + ' ' + (lang === 'en' ? 'days' : 'يوم');
    $('cyclesLabel').textContent = lang === 'en' ? 'Completed study cycles' : 'دورات النظام المكتملة';
    $('statCycles').textContent = studySystems.reduce(function (a, x) {
      return a + (x.cycles || 0);
    }, 0);
    var bestIndex = days.indexOf(best),
      weekDayName = DAYS[bestIndex] || '—';
    if ($('progressBestDayValue2'))
      $('progressBestDayValue2').textContent = best ? weekDayName + ' · ' + formatStudyMinutes(best) : '—';
    if ($('progressBestDaySub2'))
      $('progressBestDaySub2').textContent = best
        ? lang === 'en'
          ? 'Your highest study time day'
          : 'أعلى وقت مذاكرة في يوم'
        : '—';
    if ($('progressFocusDaysValue')) $('progressFocusDaysValue').textContent = activeDays + '/7';
    if ($('progressFocusDaysSub'))
      $('progressFocusDaysSub').textContent =
        lang === 'en' ? 'Active days this week' : 'أيام المذاكرة هذا الأسبوع';
    var insight = $('progressInsightText'),
      insightSub = $('progressInsightSub'),
      goalNow = loadWeeklyGoal(),
      remainingNow = Math.max(0, goalNow - total),
      delta = total - previousTotal;
    if (insight && insightSub) {
      if (total >= goalNow) {
        insight.textContent = lang === 'en' ? 'Goal reached 🎉' : 'وصلت للهدف 🎉';
        insightSub.textContent = lang === 'en' ? 'You hit your weekly target.' : 'حققت هدفك الأسبوعي.';
      } else if (total === 0) {
        insight.textContent = lang === 'en' ? 'Start your week' : 'ابدأ أسبوعك';
        insightSub.textContent =
          lang === 'en' ? 'Start a study session to build your week.' : 'ابدأ جلسة مذاكرة علشان تبني أسبوعك.';
      } else {
        insight.textContent =
          delta > 0
            ? lang === 'en'
              ? 'More study time than last week'
              : 'مذاكرتك أعلى من الأسبوع اللي فات'
            : delta < 0
              ? lang === 'en'
                ? 'Less study time than last week'
                : 'مذاكرتك أقل من الأسبوع اللي فات'
              : lang === 'en'
                ? 'Steady week'
                : 'أسبوع ثابت';
        insightSub.textContent =
          lang === 'en'
            ? formatStudyMinutes(remainingNow) + ' left to reach your goal.'
            : 'متبقي ' + formatStudyMinutes(remainingNow) + ' للوصول لهدفك.';
      }
    }
    var strip = $('progressWeekStripDays');
    if (strip) {
      strip.innerHTML = days
        .map(function (v, i) {
          var d = addDays(ws, i),
            isToday = localDateKey(d) === localDateKey(new Date()),
            active = v > 0,
            future = i > todayIdx();
          return (
            '<div class="progressDay' +
            (active ? ' is-active' : '') +
            (isToday ? ' is-today' : '') +
            (future ? ' is-future' : '') +
            (active && v === best ? ' is-best' : '') +
            '" title="' +
            esc(fmtDate(d) + ' · ' + formatStudyMinutes(v)) +
            '"><span class="progressDay__name">' +
            esc(DAYS[i]) +
            '</span><span class="progressDay__dot">' +
            (active ? (v === best ? '★' : '✓') : '·') +
            '</span><span class="progressDay__mins">' +
            (future ? '—' : esc(formatStudyMinutes(v))) +
            '</span><span class="progressDay__bar"><i style="width:' +
            Math.min(100, Math.round((v / Math.max(best, 30)) * 100)) +
            '%"></i></span></div>'
          );
        })
        .join('');
    }
    var tIdx = todayIdx(),
      tMin = days[tIdx],
      tGoal = Math.max(1, Math.round(goalNow / 7)),
      tPct = Math.min(100, Math.round((tMin / tGoal) * 100));
    if ($('progressTodayValue')) {
      $('progressTodayLabel').textContent = lang === 'en' ? 'Today' : 'النهارده';
      $('progressTodayValue').textContent = formatStudyMinutes(tMin);
      $('progressTodayBar').style.width = tPct + '%';
      $('progressTodaySub').textContent =
        tMin >= tGoal
          ? lang === 'en'
            ? 'Daily target done 🎯'
            : 'خلّصت هدف اليوم 🎯'
          : lang === 'en'
            ? formatStudyMinutes(tGoal - tMin) + " left for today's target"
            : 'فاضل ' + formatStudyMinutes(tGoal - tMin) + ' لهدف النهارده';
    }
    var consistency = Math.round((activeDays / 7) * 100);
    $('progressRing').style.setProperty('--progress', consistency + '%');
    $('progressRingValue').textContent = consistency + '%';
    $('hwDonut').style.background = 'conic-gradient(var(--ok) ' + rate + '%,var(--line-soft) 0)';
    $('hwDonutLabel').innerHTML = rate + '%<small>' + (lang === 'en' ? 'completed' : 'مكتمل') + '</small>';
    drawStudyChart(days);
    if ($('progressCopyBtn'))
      $('progressCopyBtn').textContent = lang === 'en' ? 'Copy summary' : 'نسخ الملخص';
    if ($('chartKeyText'))
      $('chartKeyText').textContent =
        (lang === 'en' ? 'Dashed line = daily target (' : 'الخط المتقطع = هدف اليوم (') +
        formatStudyMinutes(Math.round(goalNow / 7)) +
        ')';
    var rows = state.subjects
      .map(function (sub) {
        var lessons = state.entries.filter(function (e) {
          return e.subjectId === sub.id;
        }).length;
        var hw = state.homework.filter(function (h) {
          return h.subjectId === sub.id && !h.done;
        }).length;
        return {
          name: sub.name,
          color: sub.color || DEFAULT_COLOR,
          value: lessons + hw,
          lessons: lessons,
          hw: hw,
        };
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    var max = Math.max.apply(
      null,
      rows
        .map(function (r) {
          return r.value;
        })
        .concat([1]),
    );
    $('subjectBars').innerHTML = rows.length
      ? rows
          .map(function (r) {
            return (
              '<div class="subjectBar"><span>' +
              esc(r.name) +
              '</span><i><b style="width:' +
              (r.value / max) * 100 +
              '%;background:' +
              esc(r.color) +
              '"></b></i><em>' +
              r.value +
              '</em></div>'
            );
          })
          .join('')
      : '<div class="empty">' +
        (lang === 'en' ? 'Add subjects to see their workload.' : 'ضيف مواد علشان يظهر توزيع الحِمل.') +
        '</div>';
    renderSubjectStudyTracking();
  }
  function drawStudyChart(values) {
    var c = $('studyChart'),
      rect = c.getBoundingClientRect(),
      dpr = window.devicePixelRatio || 1;
    c.width = Math.max(1, Math.round(rect.width * dpr));
    c.height = Math.max(1, Math.round(rect.height * dpr));
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var w = rect.width,
      h = rect.height,
      pad = { l: 38, r: 12, t: 18, b: 34 };
    var max = Math.max.apply(null, values.concat([30, Math.round(loadWeeklyGoal() / 7)]));
    max = Math.ceil(max / 30) * 30;
    var css = getComputedStyle(document.documentElement),
      line = css.getPropertyValue('--line').trim(),
      ink = css.getPropertyValue('--ink-faint').trim(),
      mark = css.getPropertyValue('--mark').trim(),
      ok = css.getPropertyValue('--ok').trim();
    ctx.font = '12px "IBM Plex Sans Arabic", sans-serif';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = line;
    ctx.fillStyle = ink;
    ctx.lineWidth = 1;
    [0, 0.5, 1].forEach(function (t) {
      var y = pad.t + (h - pad.t - pad.b) * (1 - t);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillStyle = ink;
      ctx.fillText(Math.round(max * t), pad.l - 7, y - 7);
    });
    var tg = Math.round(loadWeeklyGoal() / 7),
      ty = pad.t + (h - pad.t - pad.b) * (1 - tg / max);
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = ok;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, ty);
    ctx.lineTo(w - pad.r, ty);
    ctx.stroke();
    ctx.restore();
    var inner = w - pad.l - pad.r,
      gap = Math.max(7, Math.min(14, inner * 0.018)),
      bw = Math.max(10, (inner - gap * 8) / 7);
    values.forEach(function (v, i) {
      var bh = (h - pad.t - pad.b) * (v / max),
        x = pad.l + gap + i * (bw + gap),
        y = h - pad.b - bh;
      var grad = ctx.createLinearGradient(0, y, 0, h - pad.b);
      grad.addColorStop(0, mark);
      grad.addColorStop(1, ok);
      ctx.globalAlpha = i > todayIdx() ? 0.3 : 1;
      ctx.fillStyle = grad;
      var rr = Math.min(8, bw / 2, bh / 2);
      ctx.beginPath();
      ctx.roundRect(x, y, bw, Math.max(1, bh), rr);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (i === todayIdx()) {
        ctx.save();
        ctx.strokeStyle = mark;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = i === todayIdx() ? mark : ink;
      ctx.textAlign = 'center';
      ctx.fillText(DAYS[i].slice(0, 3), x + bw / 2, h - pad.b + 8);
      if (v) {
        ctx.fillText(v, x + bw / 2, Math.max(1, y - 17));
      }
    });
  }
  window.addEventListener('resize', function () {
    if (activeView === 'stats')
      drawStudyChart(
        (function () {
          var a = [0, 0, 0, 0, 0, 0, 0],
            ws = startOfWeek();
          loadStudyStats().forEach(function (x) {
            var d = dayDiff(ws, new Date(x.at));
            if (d >= 0 && d < 7) a[d] += +x.minutes || 0;
          });
          return a;
        })(),
      );
  });
  function renderSubjects() {
    if (!state.subjects.length) {
      $('subList').innerHTML =
        '<div class="empty">ضيف موادك الأول، وبعدين لوّن بيها الجدول والواجبات.<br><button class="add" type="button" data-add="subject">ضيف مادة</button></div>';
      return;
    }
    var html = '<div class="subs">';
    state.subjects
      .slice()
      .sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', 'ar');
      })
      .forEach(function (s) {
        var count = state.entries.filter(function (e) {
          return e.subjectId === s.id;
        }).length;
        var hwOpen = state.homework.filter(function (h) {
          return h.subjectId === s.id && !h.done;
        }).length;
        var meta = [];
        if (s.teacher) meta.push(s.teacher);
        meta.push(count ? count + ' حصة في الأسبوع' : 'مش في الجدول');
        if (hwOpen) meta.push(hwOpen + ' واجب مفتوح');
        html +=
          '<button class="sub" type="button" data-edit-sub="' +
          esc(s.id) +
          '">' +
          '<span class="swatch" style="background:' +
          esc(s.color || DEFAULT_COLOR) +
          '"></span>' +
          '<span><b>' +
          esc(s.name) +
          '</b><span>' +
          esc(meta.join(' · ')) +
          '</span></span></button>';
      });
    html += '</div>';
    $('subList').innerHTML = html;
  }

  /* ---------------- dialogs ---------------- */
  function fillSubjectSelect(sel, value) {
    var opts = ['<option value="">' + esc(tr('noSubject')) + '</option>'];
    state.subjects
      .slice()
      .sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', 'ar');
      })
      .forEach(function (s) {
        opts.push('<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>');
      });
    sel.innerHTML = opts.join('');
    sel.value = value || '';
  }
  function paintDays() {
    $('e_days').innerHTML = DAYS.map(function (d, i) {
      return (
        '<button type="button" data-day="' +
        i +
        '" aria-pressed="' +
        (pickedDays.indexOf(i) >= 0 ? 'true' : 'false') +
        '">' +
        d +
        '</button>'
      );
    }).join('');
  }

  function syncTimePairVisibility() {
    $('e_timePair').style.display = $('e_notime').checked ? 'none' : 'grid';
  }

  function openEntry(id, dayPreset) {
    var e = null;
    if (id) {
      e =
        state.entries.filter(function (x) {
          return x.id === id;
        })[0] || null;
    }
    editing.entry = e ? e.id : null;
    $('entryTitle').textContent = e ? 'تعديل' : 'درس أو ميعاد جديد';
    $('e_title').value = e ? e.title || '' : '';
    fillSubjectSelect($('e_subject'), e ? e.subjectId : '');
    pickedDays = [e ? +e.day : dayPreset == null ? todayIdx() : dayPreset];
    paintDays();
    $('e_dayHint').textContent = e
      ? 'التعديل بيتطبق على اليوم ده؛ لو ضفت يوم زيادة هيتحفظ كنسخة جديدة'
      : 'تقدر تختار أكتر من يوم مرة واحدة';
    $('e_from').value = e ? e.from || '08:00' : '08:00';
    $('e_to').value = e ? e.to || '09:00' : '09:00';
    $('e_notime').checked = e ? !!e.noTime : false;
    syncTimePairVisibility();
    $('e_place').value = e ? e.place || '' : '';
    $('e_link').value = e ? e.link || '' : '';
    $('e_note').value = e ? e.note || '' : '';
    fillLinkPicker();
    $('e_del').hidden = !e;
    applyLanguage();
    $('dlgEntry').showModal();
    setTimeout(function () {
      $('e_title').focus();
    }, 30);
  }

  function saveEntry() {
    var title = $('e_title').value.trim();
    var subjectId = $('e_subject').value;
    if (!title && !subjectId) {
      toast('اكتب عنوان أو اختار مادة.');
      return;
    }
    var noTime = $('e_notime').checked;
    var from = '',
      to = '';
    if (!noTime) {
      from = $('e_from').value || '08:00';
      to = $('e_to').value || '';
      if (to && mins(to) <= mins(from)) {
        toast('ميعاد النهاية لازم بعد البداية.');
        return;
      }
    }
    var days = pickedDays.slice().sort(function (a, b) {
      return a - b;
    });
    if (!days.length) {
      toast('اختار يوم على الأقل.');
      return;
    }
    var base = {
      title: title,
      subjectId: subjectId,
      from: from,
      to: to,
      noTime: noTime,
      place: $('e_place').value.trim(),
      link: normUrl($('e_link').value),
      note: $('e_note').value.trim(),
    };
    if (editing.entry) {
      put('entries', editing.entry, Object.assign({}, base, { day: days[0] }));
      days.slice(1).forEach(function (d) {
        put('entries', null, Object.assign({}, base, { day: d }));
      });
    } else {
      days.forEach(function (d) {
        put('entries', null, Object.assign({}, base, { day: d }));
      });
      if (days.length > 1) toast('اتضافت في ' + days.length + ' أيام.');
    }
    $('dlgEntry').close();
  }

  function openHw(id) {
    var h = null;
    if (id) {
      h =
        state.homework.filter(function (x) {
          return x.id === id;
        })[0] || null;
    }
    editing.hw = h ? h.id : null;
    $('hwTitle').textContent = h ? 'تعديل الواجب' : 'واجب جديد';
    $('h_title').value = h ? h.title || '' : '';
    fillSubjectSelect($('h_subject'), h ? h.subjectId : '');
    $('h_due').value = h ? h.due || '' : ymd(new Date());
    $('h_link').value = h ? h.link || '' : '';
    $('h_note').value = h ? h.note || '' : '';
    $('h_del').hidden = !h;
    applyLanguage();
    $('dlgHw').showModal();
    setTimeout(function () {
      $('h_title').focus();
    }, 30);
  }

  function saveHw() {
    var title = $('h_title').value.trim();
    if (!title) {
      toast('اكتب الواجب الأول.');
      return;
    }
    var prev = editing.hw
      ? state.homework.filter(function (x) {
          return x.id === editing.hw;
        })[0]
      : null;
    put('homework', editing.hw, {
      title: title,
      subjectId: $('h_subject').value,
      due: $('h_due').value,
      link: normUrl($('h_link').value),
      note: $('h_note').value.trim(),
      done: prev ? !!prev.done : false,
    });
    $('dlgHw').close();
  }

  function fillLinkPicker() {
    var sel = $('e_linkpick');
    var opts = ['<option value="">' + esc(tr('chooseSavedLink')) + '</option>'];
    state.links.forEach(function (l) {
      var sub = subjectById(l.subjectId);
      var label = (l.title || hostOf(l.url)) + (sub ? ' — ' + sub.name : '');
      opts.push('<option value="' + esc(l.url) + '">' + esc(label) + '</option>');
    });
    sel.innerHTML = opts.join('');
    sel.value = '';
    sel.hidden = !state.links.length;
  }

  function openLink(id) {
    var l = null;
    if (id) {
      l =
        state.links.filter(function (x) {
          return x.id === id;
        })[0] || null;
    }
    editing.link = l ? l.id : null;
    $('linkTitle').textContent = l ? 'تعديل اللينك' : 'لينك جديد';
    $('l_title').value = l ? l.title || '' : '';
    $('l_url').value = l ? l.url || '' : '';
    fillSubjectSelect($('l_subject'), l ? l.subjectId : subjectFilter || '');
    $('l_note').value = l ? l.note || '' : '';
    $('l_del').hidden = !l;
    applyLanguage();
    $('dlgLink').showModal();
    setTimeout(function () {
      $('l_title').focus();
    }, 30);
  }

  function saveLink() {
    var url = normUrl($('l_url').value);
    if (!url) {
      toast('حط الرابط الأول (لازم يبدأ بـ http).');
      return;
    }
    put('links', editing.link, {
      title: $('l_title').value.trim() || hostOf(url),
      url: url,
      subjectId: $('l_subject').value,
      note: $('l_note').value.trim(),
    });
    $('dlgLink').close();
  }

  function openNote(id) {
    var n = null;
    if (id) {
      n =
        state.notes.filter(function (x) {
          return x.id === id;
        })[0] || null;
    }
    editing.note = n ? n.id : null;
    $('noteTitle').textContent = n ? 'تعديل النوتة' : 'نوتة جديدة';
    $('n_title').value = n ? n.title || '' : '';
    fillSubjectSelect($('n_subject'), n ? n.subjectId : subjectFilter || '');
    $('n_body').value = n ? n.body || '' : '';
    $('n_del').hidden = !n;
    applyLanguage();
    $('dlgNote').showModal();
    setTimeout(function () {
      $('n_title').focus();
    }, 30);
  }

  function saveNote() {
    var title = $('n_title').value.trim();
    var body = $('n_body').value.trim();
    if (!title && !body) {
      toast('اكتب حاجة في النوتة الأول.');
      return;
    }
    put('notes', editing.note, {
      title: title,
      subjectId: $('n_subject').value,
      body: body,
      updatedAt: Date.now(),
    });
    $('dlgNote').close();
  }

  function openExam(id) {
    var x = null;
    if (id) {
      x =
        state.exams.filter(function (e) {
          return e.id === id;
        })[0] || null;
    }
    editing.exam = x ? x.id : null;
    $('examTitle').textContent = x ? 'تعديل الامتحان' : 'امتحان جديد';
    $('x_title').value = x ? x.title || '' : '';
    fillSubjectSelect($('x_subject'), x ? x.subjectId : '');
    $('x_date').value = x ? x.date || '' : ymd(new Date());
    $('x_time').value = x ? x.time || '' : '';
    $('x_place').value = x ? x.place || '' : '';
    $('x_note').value = x ? x.note || '' : '';
    $('x_del').hidden = !x;
    applyLanguage();
    $('dlgExam').showModal();
    setTimeout(function () {
      $('x_title').focus();
    }, 30);
  }

  function saveExam() {
    var date = $('x_date').value;
    if (!date) {
      toast('حدد تاريخ الامتحان الأول.');
      return;
    }
    put('exams', editing.exam, {
      title: $('x_title').value.trim(),
      subjectId: $('x_subject').value,
      date: date,
      time: $('x_time').value || '',
      place: $('x_place').value.trim(),
      note: $('x_note').value.trim(),
    });
    $('dlgExam').close();
  }

  function openSearch() {
    // The search feature can be disabled permanently from Settings.
    if (document.documentElement.classList.contains('search-hidden')) return;
    $('sq').value = '';
    $('searchClear').hidden = true;
    $('searchMeta').textContent = '';
    $('searchResults').innerHTML =
      '<div class="empty">' + (lang === 'en' ? 'Type to search.' : 'اكتب عشان تدوّر.') + '</div>';
    $('dlgSearch').showModal();
    setTimeout(function () {
      $('sq').focus();
    }, 30);
  }

  function updateSearchMeta(count, hasQuery) {
    var meta = $('searchMeta');
    if (!meta) return;
    if (!hasQuery) {
      meta.textContent = '';
      return;
    }
    meta.textContent =
      lang === 'en' ? count + ' ' + (count === 1 ? 'result' : 'results') : count + ' ' + tr('results');
  }

  function runSearch() {
    var q = $('sq').value.trim().toLowerCase();
    var box = $('searchResults');
    $('searchClear').hidden = !q;
    if (!q) {
      updateSearchMeta(0, false);
      box.innerHTML =
        '<div class="empty">' + (lang === 'en' ? 'Type to search.' : 'اكتب عشان تدوّر.') + '</div>';
      return;
    }
    var terms = q.split(/\s+/).filter(Boolean);
    function has(text) {
      var value = String(text || '').toLowerCase();
      return terms.every(function (term) {
        return value.indexOf(term) !== -1;
      });
    }
    var out = [];
    state.entries.forEach(function (e) {
      var sub = subjectById(e.subjectId);
      if (has([e.title, e.place, e.note, e.link, sub ? sub.name : ''].join(' '))) {
        out.push({
          type: 'entry',
          id: e.id,
          tag: 'جدول',
          label: e.title || (sub ? sub.name : 'حصة'),
          extra: DAYS[e.day] + (e.noTime ? ' — طول اليوم' : ' ' + fmtTime(e.from)),
        });
      }
    });
    state.homework.forEach(function (h) {
      var sub = subjectById(h.subjectId);
      if (has([h.title, h.note, h.link, sub ? sub.name : ''].join(' '))) {
        out.push({
          type: 'hw',
          id: h.id,
          tag: 'واجب',
          label: h.title || 'واجب',
          extra: h.due ? fmtDate(parseYmd(h.due)) : '',
        });
      }
    });
    state.exams.forEach(function (x) {
      var sub = subjectById(x.subjectId);
      if (has([x.title, x.note, x.place, x.date, x.time, sub ? sub.name : ''].join(' '))) {
        out.push({
          type: 'exam',
          id: x.id,
          tag: 'امتحان',
          label: x.title || (sub ? sub.name : 'امتحان'),
          extra: x.date ? fmtDate(parseYmd(x.date)) : '',
        });
      }
    });
    state.links.forEach(function (l) {
      var sub = subjectById(l.subjectId);
      if (has([l.title, l.note, l.url, hostOf(l.url), sub ? sub.name : ''].join(' '))) {
        out.push({
          type: 'link',
          id: l.id,
          tag: 'شرح',
          label: l.title || hostOf(l.url),
          extra: hostOf(l.url),
        });
      }
    });
    state.notes.forEach(function (n) {
      var sub = subjectById(n.subjectId);
      if (has([n.title, n.body, sub ? sub.name : ''].join(' '))) {
        out.push({
          type: 'note',
          id: n.id,
          tag: 'نوتة',
          label: n.title || (n.body || '').split('\n')[0] || 'نوتة',
          extra: relativeDay(n.updatedAt),
        });
      }
    });
    state.subjects.forEach(function (s) {
      if (has([s.name, s.teacher].join(' '))) {
        out.push({ type: 'subject', id: s.id, tag: 'مادة', label: s.name, extra: s.teacher || '' });
      }
    });
    updateSearchMeta(out.length, true);
    if (!out.length) {
      box.innerHTML = '<div class="empty">' + (lang === 'en' ? 'No results.' : 'مفيش نتايج.') + '</div>';
      return;
    }
    box.innerHTML = out
      .map(function (r) {
        return (
          '<button class="sresult" type="button" data-open-type="' +
          esc(r.type) +
          '" data-open-id="' +
          esc(r.id) +
          '">' +
          '<span class="tag">' +
          esc(r.tag) +
          '</span>' +
          '<b>' +
          esc(r.label) +
          '</b>' +
          (r.extra ? '<span class="x">' + esc(r.extra) + '</span>' : '') +
          '</button>'
        );
      })
      .join('');
    translateRenderedUI();
  }

  function openSearchResult(type, id) {
    $('dlgSearch').close();
    if (type === 'entry') openEntry(id);
    else if (type === 'hw') openHw(id);
    else if (type === 'exam') openExam(id);
    else if (type === 'link') openLink(id);
    else if (type === 'note') openNote(id);
    else if (type === 'subject') openSub(id);
  }

  function openSub(id) {
    var s = null;
    if (id) {
      s = subjectById(id);
    }
    editing.sub = s ? s.id : null;
    $('subTitle').textContent = s ? 'تعديل المادة' : 'مادة جديدة';
    $('s_name').value = s ? s.name || '' : '';
    $('s_teacher').value = s ? s.teacher || '' : '';
    pickedColor = s && s.color ? s.color : PALETTE[state.subjects.length % PALETTE.length];
    paintSwatches();
    $('s_del').hidden = !s;
    applyLanguage();
    $('dlgSub').showModal();
    setTimeout(function () {
      $('s_name').focus();
    }, 30);
  }

  function paintSwatches() {
    $('s_colors').innerHTML = PALETTE.map(function (c) {
      return (
        '<button type="button" style="background:' +
        c +
        '" data-color="' +
        c +
        '" aria-label="' +
        esc(lang === 'en' ? 'Color' : 'لون') +
        '" aria-pressed="' +
        (c === pickedColor ? 'true' : 'false') +
        '"></button>'
      );
    }).join('');
  }

  function saveSub() {
    var name = $('s_name').value.trim();
    if (!name) {
      toast('اكتب اسم المادة.');
      return;
    }
    put('subjects', editing.sub, {
      name: name,
      color: pickedColor,
      teacher: $('s_teacher').value.trim(),
    });
    $('dlgSub').close();
  }

  function setActiveView(view) {
    var visible = appSettings.visibleSections || {};
    if (view !== 'settings' && visible[view] === false)
      view =
        appSettings.defaultView &&
        appSettings.defaultView !== 'settings' &&
        visible[appSettings.defaultView] !== false
          ? appSettings.defaultView
          : 'today';
    var t =
      document.querySelector('.tab[data-view="' + view + '"]') ||
      document.querySelector('.tab[data-view="today"]');
    if (!t) return;
    var previousView = activeView;
    activeView = t.dataset.view;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.setAttribute('aria-selected', b === t ? 'true' : 'false');
      if (b.getAttribute('role') === 'tab') b.tabIndex = b === t ? 0 : -1;
    });
    var moreBtn = $('moreNavBtn'),
      moreMenu = $('moreNavMenu');
    if (moreBtn) {
      var isMore = t && t.closest && t.closest('.navMore__menu');
      moreBtn.classList.toggle('is-active', !!isMore);
      moreBtn.classList.toggle('has-active', !!isMore);
      moreBtn.setAttribute('aria-expanded', moreMenu && !moreMenu.hidden ? 'true' : 'false');
    }
    [
      'dashboard',
      'today',
      'week',
      'track',
      'hw',
      'exams',
      'links',
      'notes',
      'flashcards',
      'pomo',
      'studyplan',
      'stats',
      'subjects',
      'themeStudio',
      'settings',
      'store',
      'learning',
    ].forEach(function (v) {
      var el = $('view-' + v);
      if (!el) return;
      el.hidden = activeView !== v;
      el.classList.remove('is-entering');
      if (v === activeView && previousView !== activeView) {
        void el.offsetWidth;
        el.classList.add('is-entering');
        el.addEventListener(
          'animationend',
          function () {
            el.classList.remove('is-entering');
          },
          { once: true },
        );
        window.setTimeout(function () {
          el.classList.remove('is-entering');
        }, 450);
      }
    });
    render();
    if (t.closest && t.closest('.navMore__menu')) {
      var activePanel = $('view-' + activeView),
        heading = activePanel && activePanel.querySelector('h1,h2,h3');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      } else $('moreNavBtn').focus();
    }
  }

  /* ---------------- events ---------------- */
  function closeMoreNav(restoreFocus) {
    var m = $('moreNavMenu'),
      b = $('moreNavBtn');
    if (m) m.hidden = true;
    if (b) {
      b.setAttribute('aria-expanded', 'false');
      if (restoreFocus) b.focus();
    }
  }
  function toggleMoreNav() {
    var m = $('moreNavMenu'),
      b = $('moreNavBtn');
    if (!m || !b) return;
    m.hidden = !m.hidden;
    b.setAttribute('aria-expanded', String(!m.hidden));
    if (!m.hidden) {
      var first = m.querySelector('[role="menuitem"]:not([hidden])');
      if (first) first.focus();
    }
  }
  $('moreNavBtn')?.addEventListener('click', function (ev) {
    ev.stopPropagation();
    toggleMoreNav();
  });
  $('moreNavBtn')?.addEventListener('keydown', function (ev) {
    if (ev.key !== 'ArrowDown') return;
    ev.preventDefault();
    var m = $('moreNavMenu');
    if (m && m.hidden) {
      m.hidden = false;
      this.setAttribute('aria-expanded', 'true');
    }
    var first = m && m.querySelector('[role="menuitem"]:not([hidden])');
    if (first) first.focus();
  });
  $('moreNavMenu')?.addEventListener('focusout', function () {
    var menu = this;
    window.setTimeout(function () {
      if (!menu.contains(document.activeElement)) closeMoreNav();
    }, 0);
  });
  document.querySelector('nav.tabs')?.addEventListener('keydown', function (ev) {
    var current = ev.target.closest ? ev.target.closest('.tab[role="tab"][data-view]') : null;
    if (!current) return;
    var tabs = Array.prototype.filter.call(
      this.querySelectorAll('.tab[role="tab"][data-view]'),
      function (tab) {
        return !tab.hidden;
      },
    );
    if (tabs.length < 2) return;
    var index = tabs.indexOf(current),
      nextIndex = index,
      rtl = document.documentElement.dir === 'rtl';
    if (ev.key === 'Home') nextIndex = 0;
    else if (ev.key === 'End') nextIndex = tabs.length - 1;
    else if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      var step = (ev.key === 'ArrowRight') !== rtl ? 1 : -1;
      nextIndex = (index + step + tabs.length) % tabs.length;
    } else return;
    ev.preventDefault();
    setActiveView(tabs[nextIndex].dataset.view);
    tabs[nextIndex].focus();
  });
  document.addEventListener('click', function (ev) {
    if (ev.target.closest && ev.target.closest('.navMore__menu .tab')) {
      closeMoreNav();
    } else if (!ev.target.closest || !ev.target.closest('.navMore')) {
      closeMoreNav();
    }
  });
  document.addEventListener('keydown', function (ev) {
    var menu = $('moreNavMenu');
    if (ev.key === 'Escape' && menu && !menu.hidden) {
      ev.preventDefault();
      closeMoreNav(true);
      return;
    }
    if (!menu || menu.hidden || !menu.contains(ev.target)) return;
    var items = Array.prototype.filter.call(menu.querySelectorAll('[role="menuitem"]'), function (item) {
      return !item.hidden && !item.disabled;
    });
    if (!items.length) return;
    var current = items.indexOf(document.activeElement),
      next = current;
    if (ev.key === 'ArrowDown') next = (current + 1 + items.length) % items.length;
    else if (ev.key === 'ArrowUp') next = (current - 1 + items.length) % items.length;
    else if (ev.key === 'Home') next = 0;
    else if (ev.key === 'End') next = items.length - 1;
    else return;
    ev.preventDefault();
    items[next].focus();
  });
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest
      ? ev.target.closest(
          '[data-add],[data-add-day],[data-edit-entry],[data-edit-hw],[data-edit-sub],[data-edit-link],[data-edit-note],[data-edit-exam],[data-open-type],[data-filter],[data-close],[data-color],[data-day],[data-search-clear],[data-switch-account],[data-delete-account],[data-dash-view],[data-store-buy],[data-store-use],[data-theme-filter],.tab',
        )
      : null;
    if (!t) return;

    if (t.dataset.switchAccount) {
      switchAccount(t.dataset.switchAccount);
      return;
    }
    if (t.dataset.deleteAccount) {
      deleteAccount(t.dataset.deleteAccount);
      return;
    }
    if (t.dataset.dashView) {
      setActiveView(t.dataset.dashView);
      return;
    }
    if (t.dataset.storeBuy) {
      buyStoreTheme(t.dataset.storeBuy);
      return;
    }
    if (t.dataset.storeUse) {
      buyStoreTheme(t.dataset.storeUse);
      return;
    }
    if (t.dataset.themeFilter !== undefined) {
      storeFilter = t.dataset.themeFilter;
      renderStore();
      return;
    }
    if (t.dataset.day !== undefined) {
      var d = +t.dataset.day,
        at = pickedDays.indexOf(d);
      if (at >= 0) pickedDays.splice(at, 1);
      else pickedDays.push(d);
      paintDays();
      return;
    }
    if (t.classList.contains('tab')) {
      setActiveView(t.dataset.view);
      return;
    }
    if (t.dataset.filter !== undefined) {
      subjectFilter = t.dataset.filter;
      render();
      return;
    }
    if (t.dataset.searchClear !== undefined) {
      $('sq').value = '';
      runSearch();
      $('sq').focus();
      return;
    }
    if (t.dataset.close !== undefined) {
      t.closest('dialog').close();
      return;
    }
    if (t.dataset.color) {
      pickedColor = t.dataset.color;
      paintSwatches();
      return;
    }
    if (t.dataset.add === 'entry') {
      openEntry(null, null);
      return;
    }
    if (t.dataset.add === 'hw') {
      openHw(null);
      return;
    }
    if (t.dataset.add === 'subject') {
      openSub(null);
      return;
    }
    if (t.dataset.add === 'link') {
      openLink(null);
      return;
    }
    if (t.dataset.editLink) {
      openLink(t.dataset.editLink);
      return;
    }
    if (t.dataset.add === 'note') {
      openNote(null);
      return;
    }
    if (t.dataset.editNote) {
      openNote(t.dataset.editNote);
      return;
    }
    if (t.dataset.add === 'exam') {
      openExam(null);
      return;
    }
    if (t.dataset.editExam) {
      openExam(t.dataset.editExam);
      return;
    }
    if (t.dataset.openType) {
      openSearchResult(t.dataset.openType, t.dataset.openId);
      return;
    }
    if (t.dataset.addDay !== undefined) {
      openEntry(null, +t.dataset.addDay);
      return;
    }
    if (t.dataset.editEntry) {
      openEntry(t.dataset.editEntry);
      return;
    }
    if (t.dataset.editHw) {
      openHw(t.dataset.editHw);
      return;
    }
    if (t.dataset.editSub) {
      openSub(t.dataset.editSub);
      return;
    }
  });

  document.addEventListener('change', function (ev) {
    var cb = ev.target;
    if (cb && cb.dataset && cb.dataset.toggleHw) {
      var h = state.homework.filter(function (x) {
        return x.id === cb.dataset.toggleHw;
      })[0];
      if (!h) return;
      var body = Object.assign({}, h);
      delete body.id;
      body.done = cb.checked;
      put('homework', h.id, body);
      if (cb.checked && window.KKMangaCharacterMoment)
        window.KKMangaCharacterMoment('yuji', 'homework-done');
    }
  });

  $('e_save').addEventListener('click', saveEntry);
  $('h_save').addEventListener('click', saveHw);
  $('s_save').addEventListener('click', saveSub);

  $('l_save').addEventListener('click', saveLink);
  $('formLink').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveLink();
  });
  $('n_save').addEventListener('click', saveNote);
  $('formNote').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveNote();
  });
  $('n_del').addEventListener('click', function () {
    if (editing.note && confirmText('تمسح النوتة دي؟', 'Delete this note?')) {
      remove('notes', editing.note);
      $('dlgNote').close();
    }
  });
  $('x_save').addEventListener('click', saveExam);
  $('formExam').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveExam();
  });
  $('x_del').addEventListener('click', function () {
    if (editing.exam && confirmText('تمسح الامتحان ده؟', 'Delete this exam?')) {
      remove('exams', editing.exam);
      $('dlgExam').close();
    }
  });
  $('searchBtn').addEventListener('click', openSearch);
  $('sq').addEventListener('input', runSearch);
  $('l_del').addEventListener('click', function () {
    if (editing.link && confirmText('تمسح اللينك ده؟', 'Delete this resource?')) {
      remove('links', editing.link);
      $('dlgLink').close();
    }
  });
  $('e_linkpick').addEventListener('change', function () {
    if (this.value) {
      $('e_link').value = this.value;
      this.value = '';
      toast('اتحط اللينك.');
    }
  });

  $('formEntry').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveEntry();
  });
  $('e_notime').addEventListener('change', syncTimePairVisibility);
  $('formHw').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveHw();
  });
  $('formSub').addEventListener('submit', function (ev) {
    ev.preventDefault();
    saveSub();
  });

  $('e_del').addEventListener('click', function () {
    if (editing.entry && confirmText('تمسح الميعاد ده؟', 'Delete this lesson or event?')) {
      remove('entries', editing.entry);
      $('dlgEntry').close();
    }
  });
  $('h_del').addEventListener('click', function () {
    if (editing.hw && confirmText('تمسح الواجب ده؟', 'Delete this homework?')) {
      remove('homework', editing.hw);
      $('dlgHw').close();
    }
  });
  $('s_del').addEventListener('click', function () {
    if (
      editing.sub &&
      confirmText(
        'تمسح المادة دي؟ الحصص والواجبات هتفضل موجودة من غير لون.',
        'Delete this subject? Its lessons and homework will stay without a color.',
      )
    ) {
      if (subjectFilter === editing.sub) subjectFilter = '';
      remove('subjects', editing.sub);
      $('dlgSub').close();
    }
  });

  function openAccountManager() {
    if (window.KashkoolCloudAccounts && typeof window.KashkoolCloudAccounts.open === 'function')
      window.KashkoolCloudAccounts.open();
    else if ($('dlgAccounts') && !$('dlgAccounts').open) $('dlgAccounts').showModal();
  }
  $('accountBtn').addEventListener('click', openAccountManager);
  $('manageAccountsBtn').addEventListener('click', openAccountManager);

  $('studySystems').addEventListener('click', function (e) {
    var del = e.target.closest ? e.target.closest('[data-delete-study-system]') : null;
    if (del) {
      e.preventDefault();
      e.stopPropagation();
      deleteStudySystem(del.dataset.deleteStudySystem);
      return;
    }
    var card = e.target.closest ? e.target.closest('[data-study-system]') : null;
    if (card) {
      activeStudySystemId = card.dataset.studySystem;
      saveActiveStudySystem();
      renderStudyPlan();
    }
  });
  $('studySteps').addEventListener('change', function (e) {
    if (!e.target.matches('[data-study-step]')) return;
    var s = currentStudySystem();
    if (!s) return;
    var step = s.steps.find(function (x) {
      return x.id === e.target.dataset.studyStep;
    });
    if (!step) return;
    step.done = e.target.checked;
    noteSystemCycle(s);
    saveStudySystems();
    updateStudyProgress();
    renderStudySystems();
  });
  $('studySubject').addEventListener('mousedown', function () {
    renderStudySubjectSelect(currentStudySystem());
  });
  $('studySubject').addEventListener('change', function () {
    var s = currentStudySystem();
    if (!s) return;
    s.subjectId = this.value;
    saveStudySystems();
    if (!pomo.running) {
      pomo.subjectId = s.subjectId;
      renderPomoSubjectOptions();
    }
  });
  $('studySteps').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-study-go]') : null;
    if (!b) return;
    e.preventDefault();
    var s = currentStudySystem();
    if (!s) return;
    pendingStep = { sys: s.id, step: b.dataset.studyGo };
    pomoPause(true);
    flushWorkTime(true);
    pomo.loggedSec = 0;
    pomo.subjectId = s.subjectId || pomo.subjectId || '';
    pomo.mode = 'work';
    pomo.total = pomoDurationSec('work');
    pomo.remaining = pomo.total;
    renderPomoSubjectOptions();
    setActiveView('pomo');
    pomoStart();
    toast(
      L(
        'بدأت الخطوة — هتتعلّم لوحدها لما الجلسة تخلص.',
        'Step started — it will be checked off when the session ends.',
      ),
    );
  });
  $('studyPlanReset').addEventListener('click', function () {
    var s = currentStudySystem();
    if (!s) return;
    (s.steps || []).forEach(function (step) {
      step.done = false;
      step.spent = 0;
    });
    s.cycleCounted = false;
    saveStudySystems();
    renderStudyPlan();
    toast(tr('resetStudySystem'));
  });
  $('studyAddSystem').addEventListener('click', openStudySystemDialog);
  $('studyAddStep').addEventListener('click', function () {
    newStudyStepDraft.push(makeStudyStepDraft('', ''));
    renderStudyStepEditor();
    var inputs = document.querySelectorAll('[data-step-ar]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });
  $('studyStepEditor').addEventListener('input', function (e) {
    var row = e.target.closest ? e.target.closest('[data-editor-step]') : null;
    if (!row) return;
    var i = +row.dataset.editorStep;
    if (!newStudyStepDraft[i]) return;
    if (e.target.matches('[data-step-ar]')) newStudyStepDraft[i].ar = e.target.value;
    if (e.target.matches('[data-step-en]')) newStudyStepDraft[i].en = e.target.value;
  });
  $('studyStepEditor').addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-step-remove]') : null;
    if (!btn) return;
    if (newStudyStepDraft.length <= 1) {
      toast(L('لازم تسيب خطوة واحدة على الأقل.', 'Keep at least one step.'));
      return;
    }
    newStudyStepDraft.splice(+btn.dataset.stepIndex, 1);
    renderStudyStepEditor();
  });
  $('ss_save').addEventListener('click', saveStudySystem);
  // Appearance mode is a setting for the default/classic theme only.
  function isDefaultStoreTheme() {
    var active = document.documentElement.getAttribute('data-store-theme');
    return !active || active === 'classic';
  }
  function isDarkAppearance() {
    var mode = document.documentElement.getAttribute('data-theme');
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function syncThemeToggleLabel() {
    var btn = $('themeBtn');
    if (btn) btn.textContent = tr(isDarkAppearance() ? 'light' : 'dark');
  }
  function applyTheme(mode) {
    if (!isDefaultStoreTheme()) {
      syncThemeToggleLabel();
      return;
    }
    if (mode === 'dark' || mode === 'light') document.documentElement.setAttribute('data-theme', mode);
    else document.documentElement.removeAttribute('data-theme');
    syncThemeToggleLabel();
    if (window.KashkoolThemeStudioRefreshMode) window.KashkoolThemeStudioRefreshMode();
  }
  try {
    appSettings.theme =
      JSON.parse(localStorage.getItem(scopedKey(LS_SETTINGS)) || 'null')?.theme ||
      localStorage.getItem(LS_THEME) ||
      'system';
  } catch (e) {
    appSettings.theme = 'system';
  }
  normalizeAppSettings();
  applyAppSettings();
  $('themeBtn').addEventListener('click', function () {
    var dark =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    appSettings.theme = next;
    saveAppSettings();
    applyTheme(next);
    try {
      localStorage.setItem(LS_THEME, next);
    } catch (e) {}
    syncSettingsUI();
  });

  // refresh the "now" marker every minute, tick the live countdown every second
  setInterval(function () {
    if (activeView === 'today') renderToday();
    if (activeView === 'dashboard') renderDashboard();
  }, 60000);
  setInterval(function () {
    if (activeView === 'today') tickCountdown();
  }, 1000);
  setInterval(function () {
    if (activeView === 'exams') tickExamHero();
  }, 1000);

  /* ---------------- pomodoro ---------------- */
  initAccounts(); // the active account must be known before any per-account key is read
  loadAppSettings();
  loadStudySystems();
  loadStoreState();
  applyStoreTheme();
  try {
    lang = localStorage.getItem(LS_LANG) === 'en' ? 'en' : 'ar';
  } catch (e) {
    lang = 'ar';
  }
  var LS_POMO = 'kashkool.pomo.v1',
    LS_POMO_STATE = 'kashkool.pomo.state.v1',
    LS_POMO_SUBJECT = 'kashkool.pomo.subject.v1';
  var LS_SOUND = 'kashkool.sound',
    LS_SOUND_TYPE = 'kashkool.sound.type',
    LS_SOUND_VOL = 'kashkool.sound.volume';
  var POMO_PRESETS = {
    classic: { work: 25, brk: 5, long: 15, rounds: 4 },
    focus: { work: 50, brk: 10, long: 30, rounds: 3 },
    sprint: { work: 15, brk: 3, long: 10, rounds: 4 },
  };
  var PRESET_NAMES = { classic: 'presetClassic', focus: 'presetFocus', sprint: 'presetSprint' };
  var pomoSettings = { work: 25, brk: 5, long: 15, rounds: 4, auto: true };
  try {
    var savedPomo = JSON.parse(localStorage.getItem(scopedKey(LS_POMO)) || 'null');
    if (savedPomo) pomoSettings = Object.assign(pomoSettings, savedPomo);
  } catch (e) {}
  var pendingStep = null;
  var pomo = {
    mode: 'work',
    round: 1,
    remaining: 0,
    total: 0,
    running: false,
    endAt: 0,
    timerId: null,
    dots: '',
    subjectId: '',
    loggedSec: 0,
  };

  function pomoLabel(mode) {
    return tr(mode === 'work' ? 'phaseWork' : mode === 'long' ? 'phaseLong' : 'phaseBreak');
  }
  function pomoDurationSec(mode) {
    var mins = mode === 'work' ? pomoSettings.work : mode === 'long' ? pomoSettings.long : pomoSettings.brk;
    return Math.max(1, mins) * 60;
  }
  function pomoNextMode() {
    return pomo.mode === 'work' ? (pomo.round >= pomoSettings.rounds ? 'long' : 'break') : 'work';
  }
  function fmtMMSS(totalSec) {
    totalSec = Math.max(0, Math.ceil(totalSec));
    return pad2(Math.floor(totalSec / 60)) + ':' + pad2(totalSec % 60);
  }
  pomo.total = pomoDurationSec('work');
  pomo.remaining = pomo.total;

  /* ----- alert sounds (synthesized, no audio files) ----- */
  var soundType = 'classic',
    soundVolume = 0.7;
  var pomoCtx = null,
    pomoMaster = null;
  var SOUND_KEYS = ['classic', 'bell', 'chime', 'digital', 'soft'];
  var SOUND_NAMES = {
    classic: 'soundClassic',
    bell: 'soundBell',
    chime: 'soundChime',
    digital: 'soundDigital',
    soft: 'soundSoft',
  };
  function applyMasterVolume() {
    if (pomoMaster) pomoMaster.gain.value = soundVolume * soundVolume;
  }
  function ensureAudioCtx() {
    if (!pomoCtx) {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) pomoCtx = new Ctx();
      } catch (e) {}
    }
    if (pomoCtx && !pomoMaster) {
      pomoMaster = pomoCtx.createGain();
      pomoMaster.connect(pomoCtx.destination);
      applyMasterVolume();
    }
    if (pomoCtx && pomoCtx.state === 'suspended') pomoCtx.resume().catch(function () {});
    return pomoCtx;
  }
  function tone(ctx, o) {
    var osc = ctx.createOscillator(),
      g = ctx.createGain(),
      t0 = ctx.currentTime + (o.start || 0);
    var peak = o.gain || 0.3,
      atk = o.attack || 0.015,
      dur = o.dur || 0.3;
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(pomoMaster);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }
  var SOUND_PLAYERS = {
    classic: function (ctx) {
      [0, 0.45, 0.9].forEach(function (d, i) {
        tone(ctx, { freq: i === 1 ? 1046 : 880, start: d, dur: 0.32, gain: 0.4 });
      });
    },
    bell: function (ctx) {
      [0, 0.95].forEach(function (d) {
        [
          [1, 0.5, 2.2],
          [2.76, 0.22, 1.6],
          [5.4, 0.12, 1.0],
          [8.93, 0.06, 0.7],
        ].forEach(function (p) {
          tone(ctx, { freq: 660 * p[0], start: d, dur: p[2], gain: p[1], attack: 0.004 });
        });
      });
    },
    chime: function (ctx) {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone(ctx, { freq: f, start: i * 0.16, dur: 0.95, gain: 0.3, attack: 0.01 });
      });
    },
    digital: function (ctx) {
      [0, 0.22, 0.44, 0.66].forEach(function (d) {
        tone(ctx, { type: 'square', freq: 1320, start: d, dur: 0.12, gain: 0.14, attack: 0.005 });
      });
    },
    soft: function (ctx) {
      tone(ctx, { type: 'triangle', freq: 587.33, start: 0, dur: 1.1, gain: 0.35, attack: 0.03 });
      tone(ctx, { type: 'triangle', freq: 440, start: 0.5, dur: 1.5, gain: 0.35, attack: 0.03 });
    },
  };
  function playSound(type, force) {
    if (!force && !soundEnabled) return;
    var ctx = ensureAudioCtx();
    if (!ctx || !pomoMaster) return;
    try {
      (SOUND_PLAYERS[type] || SOUND_PLAYERS.classic)(ctx);
    } catch (e) {}
  }
  function beep() {
    playSound(soundType, false);
  }
  function loadSoundPrefs() {
    try {
      soundEnabled = localStorage.getItem(LS_SOUND) !== '0';
      var t = localStorage.getItem(LS_SOUND_TYPE);
      if (t && SOUND_PLAYERS[t]) soundType = t;
      var v = parseFloat(localStorage.getItem(LS_SOUND_VOL));
      if (!isNaN(v)) soundVolume = Math.min(1, Math.max(0, v));
    } catch (e) {}
  }
  function saveSoundPrefs() {
    try {
      localStorage.setItem(LS_SOUND, soundEnabled ? '1' : '0');
      localStorage.setItem(LS_SOUND_TYPE, soundType);
      localStorage.setItem(LS_SOUND_VOL, String(soundVolume));
    } catch (e) {}
  }
  function renderSoundOptions() {
    var box = $('soundOptions');
    if (!box) return;
    box.innerHTML = SOUND_KEYS.map(function (k) {
      var name = tr(SOUND_NAMES[k]);
      return (
        '<label class="soundOpt"><input type="radio" name="soundType" value="' +
        k +
        '"' +
        (k === soundType ? ' checked' : '') +
        '>' +
        '<span>' +
        esc(name) +
        '</span>' +
        '<button type="button" class="soundPlay" data-play-sound="' +
        k +
        '" aria-label="' +
        esc(tr('preview') + ': ' + name) +
        '">▶</button></label>'
      );
    }).join('');
    syncSoundUI();
  }
  function syncSoundUI() {
    if ($('soundEnabled')) $('soundEnabled').checked = soundEnabled;
    var sc = $('soundControls');
    if (sc) {
      sc.classList.toggle('is-off', !soundEnabled);
      Array.prototype.forEach.call(sc.querySelectorAll('input,button'), function (el) {
        el.disabled = !soundEnabled;
      });
    }
    var vol = Math.round(soundVolume * 100);
    if ($('soundVolume')) $('soundVolume').value = vol;
    if ($('soundVolumeValue')) $('soundVolumeValue').textContent = vol + '%';
    var pb = $('pomoSound');
    if (pb) {
      var label = tr(soundEnabled ? 'soundMute' : 'soundUnmute');
      pb.textContent = soundEnabled ? '🔔' : '🔕';
      pb.classList.toggle('is-muted', !soundEnabled);
      pb.title = label;
      pb.setAttribute('aria-label', label);
    }
  }

  /* ----- timer state (survives reloads) ----- */
  function savePomoState() {
    try {
      localStorage.setItem(
        scopedKey(LS_POMO_STATE),
        JSON.stringify({
          mode: pomo.mode,
          round: pomo.round,
          total: pomo.total,
          remaining: pomo.remaining,
          running: pomo.running,
          endAt: pomo.endAt,
          subjectId: pomo.subjectId || '',
          loggedSec: pomo.loggedSec || 0,
        }),
      );
    } catch (e) {}
  }
  function pomoAnnounce(msg) {
    var a = $('pomoAnnounce');
    if (!a) return;
    a.textContent = '';
    setTimeout(function () {
      a.textContent = msg;
    }, 30);
  }
  function refreshPomoToday() {
    var el = $('pomoToday');
    if (!el) return;
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var list = loadStudyStats().filter(function (x) {
      return x.at >= start.getTime();
    });
    var mins = list.reduce(function (a, x) {
      return a + (+x.minutes || 0);
    }, 0);
    el.textContent = list.length
      ? L(
          'النهاردة: ' + list.length + ' جلسة · ' + mins + ' دقيقة',
          'Today: ' + list.length + (list.length === 1 ? ' session' : ' sessions') + ' · ' + mins + ' min',
        )
      : L('لسه مفيش جلسات مذاكرة النهاردة.', 'No study sessions yet today.');
  }
  function currentPresetKey() {
    var found = '';
    Object.keys(POMO_PRESETS).forEach(function (k) {
      var p = POMO_PRESETS[k];
      if (
        p.work === pomoSettings.work &&
        p.brk === pomoSettings.brk &&
        p.long === pomoSettings.long &&
        p.rounds === pomoSettings.rounds
      )
        found = k;
    });
    return found;
  }
  function renderPomoPresets() {
    var box = $('pomoPresets');
    if (!box) return;
    box.setAttribute('aria-label', tr('presetsLabel'));
    var cur = currentPresetKey();
    box.innerHTML = Object.keys(POMO_PRESETS)
      .map(function (k) {
        var p = POMO_PRESETS[k];
        return (
          '<button type="button" class="fchip" data-pomo-preset="' +
          k +
          '" aria-pressed="' +
          (cur === k ? 'true' : 'false') +
          '">' +
          esc(tr(PRESET_NAMES[k])) +
          ' <span dir="ltr">' +
          p.work +
          '/' +
          p.brk +
          '</span></button>'
        );
      })
      .join('');
  }
  function syncPomoUI() {
    var box = $('pomoBox');
    box.className =
      'pomo' +
      (pomo.mode === 'break' ? ' mode-break' : pomo.mode === 'long' ? ' mode-long' : '') +
      (pomo.running && pomo.remaining <= 10 ? ' is-ending' : '');
    var phase = pomoLabel(pomo.mode),
      time = fmtMMSS(pomo.remaining);
    $('pomoMode').textContent = phase;
    var clock = $('pomoClock');
    clock.textContent = time;
    clock.setAttribute('aria-label', phase + ' — ' + time);
    $('pomoRound').textContent = L(
      'الجولة ' + pomo.round + ' من ' + pomoSettings.rounds,
      'Round ' + pomo.round + ' of ' + pomoSettings.rounds,
    );
    if ($('pomoSubject') && $('pomoSubject').value !== (pomo.subjectId || ''))
      $('pomoSubject').value = pomo.subjectId || '';
    if ($('focusSubject')) {
      var focusSub = subjectById(pomo.subjectId);
      $('focusSubject').textContent = focusSub ? focusSub.name : tr('noStudySubject');
    }
    $('pomoToggle').textContent = pomo.running
      ? tr('pause')
      : pomo.remaining < pomo.total
        ? tr('resume')
        : tr('start');
    $('pomoToggle').setAttribute('data-running', pomo.running ? '1' : '0');
    $('pomoHint').textContent = pomo.running
      ? tr('runningHint')
      : pomo.remaining < pomo.total
        ? tr('pausedHint')
        : tr('readyHint');
    $('pomoNext').textContent = tr('nextUp') + pomoLabel(pomoNextMode());
    var done = pomo.mode === 'work' ? pomo.round - 1 : pomo.round,
      dots = '';
    for (var i = 1; i <= pomoSettings.rounds; i++) {
      dots +=
        '<i class="pomo__dot' +
        (i <= done ? ' is-done' : i === pomo.round && pomo.mode === 'work' ? ' is-current' : '') +
        '"></i>';
    }
    if (pomo.dots !== dots) {
      $('pomoDots').innerHTML = dots;
      pomo.dots = dots;
    }
    var progress = pomo.total ? Math.max(0, Math.min(100, (1 - pomo.remaining / pomo.total) * 100)) : 0;
    $('pomoRing').style.setProperty('--progress', progress.toFixed(2) + '%');
    document.title = pomo.running ? time + ' · ' + phase + ' — ' + tr('title') : baseTitle();
    var cm = Math.floor(Math.max(0, pomo.total - pomo.remaining) / 60),
      ct =
        pomo.mode === 'work' && pomo.remaining < pomo.total
          ? L(
              'هيتحسب من الجولة دي: ' + cm + ' دقيقة — حتى لو وقّفت قبل ما تخلص',
              'Counted from this round: ' + cm + ' min — even if you stop early',
            )
          : '';
    if ($('pomoCounted')) $('pomoCounted').textContent = ct;
    if ($('focusCounted')) $('focusCounted').textContent = ct;
    document.body.classList.toggle('pomo-running', !!pomo.running);
    if (focusModeActive) syncFocusUI();
  }

  function pomoStopInterval() {
    if (pomo.timerId) clearInterval(pomo.timerId);
    pomo.timerId = null;
    pomo.endAt = 0;
  }
  function flushWorkTime(final) {
    if (pomo.mode !== 'work') return;
    var rem = pomo.running ? Math.max(0, Math.ceil((pomo.endAt - Date.now()) / 1000)) : pomo.remaining;
    var el = Math.max(0, pomo.total - rem) - (pomo.loggedSec || 0),
      m = final ? Math.round(el / 60) : Math.floor(el / 60);
    if (m >= 1) {
      logStudySession(m, pomo.subjectId);
      pomo.loggedSec = (pomo.loggedSec || 0) + m * 60;
      refreshPomoToday();
      savePomoState();
    }
  }
  function pomoRestMinutes() {
    var done = pomo.loggedSec || 0,
      rest = pomo.total - done;
    return Math.max(done === 0 ? 1 : 0, Math.round(rest / 60));
  }
  function pomoExtend() {
    pomo.total += 300;
    pomo.remaining += 300;
    if (pomo.running) pomo.endAt += 300000;
    syncPomoUI();
    savePomoState();
    pomoAnnounce(L('اتزوّد 5 دقايق', 'Added 5 minutes'));
  }
  function pomoAdvance() {
    pomo.loggedSec = 0;
    if (pomo.mode === 'work') {
      pomo.mode = pomo.round >= pomoSettings.rounds ? 'long' : 'break';
    } else {
      if (pomo.mode === 'long') pomo.round = 1;
      else pomo.round += 1;
      pomo.mode = 'work';
    }
    pomo.total = pomoDurationSec(pomo.mode);
    pomo.remaining = pomo.total;
  }
  function pomoStart(quiet) {
    if (pomo.running) return;
    var csys = currentStudySystem();
    if (pomo.mode === 'work' && !pomo.subjectId && csys && csys.subjectId) {
      pomo.subjectId = csys.subjectId;
      renderPomoSubjectOptions();
    }
    if (pomo.remaining <= 0) pomo.remaining = pomo.total;
    ensureAudioCtx();
    pomo.running = true;
    pomo.endAt = Date.now() + pomo.remaining * 1000;
    pomo.timerId = setInterval(pomoTick, 250);
    syncPomoUI();
    savePomoState();
    if (!quiet) {
      if (appSettings.focusAuto) enterFocusMode();
      pomoAnnounce(pomoLabel(pomo.mode) + L(' بدأت', ' started'));
    }
  }
  function pomoPause(quiet) {
    if (pomo.running) pomo.remaining = Math.max(0, Math.ceil((pomo.endAt - Date.now()) / 1000));
    pomo.running = false;
    pomoStopInterval();
    flushWorkTime(false);
    syncPomoUI();
    savePomoState();
    if (!quiet) pomoAnnounce(L('المؤقّت واقف مؤقتًا', 'Timer paused'));
  }
  function completePendingStep() {
    if (!pendingStep) return;
    var sys = studySystems.find(function (x) {
        return x.id === pendingStep.sys;
      }),
      st =
        sys &&
        sys.steps.find(function (x) {
          return x.id === pendingStep.step;
        });
    pendingStep = null;
    if (!st) return;
    st.done = true;
    noteSystemCycle(sys);
    saveStudySystems();
    renderStudyPlan();
  }
  function pomoFinish() {
    var finished = pomo.mode,
      minutes = pomoRestMinutes();
    pomo.running = false;
    pomoStopInterval();
    if (finished === 'work') {
      var kkFinishedTaskId = '';
      try {
        kkFinishedTaskId = localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
      } catch (e) {}
      if (minutes > 0) logStudySession(minutes, pomo.subjectId);
      try {
        if (kkFinishedTaskId && window.KashKoolLearningOS && window.KashKoolLearningOS.onTaskSessionFinished)
          window.KashKoolLearningOS.onTaskSessionFinished(kkFinishedTaskId, minutes);
      } catch (e) {}
      trkClearActiveTask();
      refreshPomoToday();
      completePendingStep();
      if (window.KKMangaCharacterMoment) window.KKMangaCharacterMoment('gojo', 'focus-session');
      if (focusModeActive) showFocusSummary(Math.round(pomo.total / 60));
    }
    beep();
    // The notification module is loaded after the core app, so this hook stays optional.
    try {
      if (window.KashKoolNotifications) window.KashKoolNotifications.timerFinished(finished);
    } catch (e) {}
    var msg =
      finished === 'work'
        ? L('مذاكرة خلصت — وقت الاستراحة', 'Study finished — break time')
        : L(pomoLabel(finished) + ' خلصت — نرجع للمذاكرة', pomoLabel(finished) + ' finished — back to study');
    pomoAdvance();
    if (pomoSettings.auto) {
      toast(msg);
      pomoAnnounce(msg);
      pomoStart(true);
    } else {
      msg += L(' — دوس ابدأ لما تجهز', " — press Start when you're ready");
      toast(msg);
      pomoAnnounce(msg);
      syncPomoUI();
      savePomoState();
    }
  }
  function pomoTick() {
    if (!pomo.running) return;
    var left = Math.max(0, Math.ceil((pomo.endAt - Date.now()) / 1000));
    if (left <= 0) {
      pomo.remaining = 0;
      pomoFinish();
      return;
    }
    if (left !== pomo.remaining) {
      pomo.remaining = left;
      syncPomoUI();
    }
  }
  function pomoReset() {
    pomoPause(true);
    flushWorkTime(true);
    trkClearActiveTask();
    pomo.loggedSec = 0;
    pomo.mode = 'work';
    pomo.round = 1;
    pomo.total = pomoDurationSec('work');
    pomo.remaining = pomo.total;
    syncPomoUI();
    savePomoState();
    pomoAnnounce(L('اتعمل إعادة ضبط للمؤقّت', 'Timer reset'));
  }
  function pomoSkip() {
    var wasRunning = pomo.running;
    if (wasRunning) pomoPause(true);
    flushWorkTime(true);
    if (pomo.mode === 'work') trkClearActiveTask();
    pomoAdvance();
    if (wasRunning) pomoStart(true);
    else {
      syncPomoUI();
      savePomoState();
    }
    pomoAnnounce(L('دلوقتي: ', 'Now: ') + pomoLabel(pomo.mode));
  }
  function restorePomoState() {
    var s = null;
    try {
      s = JSON.parse(localStorage.getItem(scopedKey(LS_POMO_STATE)) || 'null');
    } catch (e) {
      s = null;
    }
    if (!s || ['work', 'break', 'long'].indexOf(s.mode) < 0) return;
    pomo.mode = s.mode;
    pomo.loggedSec = Math.max(0, +s.loggedSec || 0);
    pomo.subjectId = String(s.subjectId || pomo.subjectId || '');
    if (
      pomo.subjectId &&
      !state.subjects.some(function (sub) {
        return sub.id === pomo.subjectId;
      })
    )
      pomo.subjectId = '';
    pomo.round = Math.min(Math.max(1, +s.round || 1), pomoSettings.rounds);
    pomo.total = +s.total > 0 ? +s.total : pomoDurationSec(pomo.mode);
    pomo.remaining = Math.min(pomo.total, Math.max(1, +s.remaining || pomo.total));
    if (s.running && +s.endAt > 0) {
      var left = Math.ceil((+s.endAt - Date.now()) / 1000);
      if (left > 0) {
        pomo.remaining = Math.min(pomo.total, left);
        pomoStart(true);
      } else {
        var finished = pomo.mode;
        if (finished === 'work') {
          var rm = pomoRestMinutes();
          if (rm > 0) logStudySession(rm, pomo.subjectId);
        }
        pomoAdvance();
        toast(
          L(
            'خلصت مرحلة ' + pomoLabel(finished) + ' وانت بعيد.',
            pomoLabel(finished) + ' finished while you were away.',
          ),
        );
      }
    }
  }

  var focusModeActive = false;
  var focusReturnElement = null;
  var focusSelectedStepIndex = null;
  var focusSelectedSystemId = null;
  var focusCloseTimer = null;
  function attributeStepTime(m) {
    var st = null;
    if (pendingStep) {
      var ps = studySystems.find(function (x) {
        return x.id === pendingStep.sys;
      });
      st =
        ps &&
        ps.steps.find(function (x) {
          return x.id === pendingStep.step;
        });
    } else if (focusModeActive) {
      var c = focusCurrentStep();
      st = c && c.step;
    }
    if (st && !st.done) {
      st.spent = (st.spent || 0) + m;
      saveStudySystems();
    }
  }
  function stepSpentTag(i) {
    var s = currentStudySystem(),
      st = s && s.steps && s.steps[i];
    return st && st.spent ? ' · ⏱ ' + st.spent + (lang === 'en' ? ' min' : ' د') : '';
  }
  function focusCompleteStep() {
    var s = currentStudySystem(),
      cur = focusCurrentStep();
    if (!s || !cur || cur.step.done) return;
    cur.step.done = true;
    noteSystemCycle(s);
    saveStudySystems();
    focusSelectedStepIndex = null;
    renderStudyPlan();
    if (focusModeActive) syncFocusUI();
    if (window.KKMangaCharacterMoment) {
      window.KKMangaCharacterMoment('tsukasa', 'focus-step');
      window.KKMangaCharacterMoment('yuji', 'focus-step');
    }
  }
  function focusNextOpen() {
    var s = currentStudySystem(),
      steps = s && s.steps ? s.steps : [];
    for (var i = 0; i < steps.length; i++) if (!steps[i].done) return { step: steps[i], index: i };
    return null;
  }
  function focusCurrentStep() {
    var s = currentStudySystem(),
      steps = s && s.steps ? s.steps : [];
    if (!steps.length) return null;
    if (focusSelectedSystemId !== s.id) {
      focusSelectedSystemId = s.id;
      focusSelectedStepIndex = null;
    }
    if (
      focusSelectedStepIndex !== null &&
      focusSelectedStepIndex >= 0 &&
      focusSelectedStepIndex < steps.length
    ) {
      return { step: steps[focusSelectedStepIndex], index: focusSelectedStepIndex };
    }
    for (var i = 0; i < steps.length; i++) {
      if (!steps[i].done) {
        focusSelectedStepIndex = i;
        return { step: steps[i], index: i };
      }
    }
    focusSelectedStepIndex = 0;
    return { step: steps[0], index: 0 };
  }
  function setFocusStep(index) {
    var s = currentStudySystem(),
      steps = s && s.steps ? s.steps : [];
    if (!steps.length) return;
    index = Math.max(0, Math.min(steps.length - 1, Number(index) || 0));
    focusSelectedSystemId = s.id;
    focusSelectedStepIndex = index;
    if (focusModeActive) syncFocusUI();
  }
  function moveFocusStep(delta) {
    var cur = focusCurrentStep();
    if (!cur) return;
    setFocusStep(cur.index + delta);
  }
  function syncFocusUI() {
    if (!$('focusOverlay')) return;
    var phase = pomoLabel(pomo.mode),
      time = fmtMMSS(pomo.remaining),
      progress = pomo.total ? Math.max(0, Math.min(100, (1 - pomo.remaining / pomo.total) * 100)) : 0;
    var overlay = $('focusOverlay');
    overlay.dataset.focusState = pomo.running ? 'running' : pomo.remaining < pomo.total ? 'paused' : 'ready';
    overlay.dataset.focusPhase = pomo.mode || 'work';
    overlay.style.setProperty('--focus-progress', progress.toFixed(2) + '%');
    $('focusPhase').textContent = phase;
    $('focusClock').textContent = time;
    $('focusRound').textContent = L(
      'الجولة ' + pomo.round + ' من ' + pomoSettings.rounds,
      'Round ' + pomo.round + ' of ' + pomoSettings.rounds,
    );
    $('focusProgressBar').style.width = progress.toFixed(2) + '%';
    $('focusToggle').textContent = pomo.running
      ? tr('pause')
      : pomo.remaining < pomo.total
        ? tr('resume')
        : tr('start');
    $('focusStatus').textContent = pomo.running
      ? tr('focusRunning')
      : pomo.remaining < pomo.total
        ? tr('focusPaused')
        : tr('focusReady');
    $('focusBrand').textContent = tr('focusMode');
    $('focusExit').textContent = tr('exitFocus');
    $('focusFooter').textContent = tr('focusShortcut');
    var card = $('focusSystemCard');
    if (!card) return;
    card.hidden = !appSettings.focusShowSteps;
    overlay.classList.toggle('focus-has-system', !card.hidden);
    if ($('focusStepNow')) $('focusStepNow').hidden = card.hidden;
    if (card.hidden) return;
    var ss = currentStudySystem();
    if (!ss) {
      if ($('focusStepNow')) $('focusStepNow').hidden = true;
      $('focusSystemTitle').innerHTML = bilingualPair(tr('studySystem'), 'Study system');
      $('focusSystemProgress').textContent = '0/0';
      $('focusStepList').innerHTML = '<div class="focusNoSystem">' + esc(tr('noStudySystems')) + '</div>';
      $('focusPrevStep').disabled = true;
      $('focusNextStep').disabled = true;
      return;
    }
    var steps = ss.steps || [],
      done = steps.filter(function (x) {
        return x.done;
      }).length,
      current = focusCurrentStep();
    var nowBox = $('focusStepNow'),
      nxt = focusNextOpen();
    if (nowBox) {
      nowBox.hidden = !steps.length;
      if (current) {
        var showStep = current.step.done && nxt ? nxt : current;
        $('focusStepNowLabel').textContent = !nxt
          ? L('🎉 كل الخطوات خلصت', '🎉 All steps done')
          : L(
              'الخطوة ' + (showStep.index + 1) + ' من ' + steps.length,
              'Step ' + (showStep.index + 1) + ' of ' + steps.length,
            );
        $('focusStepNowText').textContent = nxt ? studyStepText(showStep.step) : '';
        var db = $('focusStepDone');
        db.hidden = !nxt;
        db.textContent = L('✓ خلّصت الخطوة', '✓ Step done');
        db.disabled = !!showStep.step.done;
      }
    }
    var sel = $('focusSystemSelect');
    if (sel) {
      var key = studySystems
        .map(function (x) {
          return x.id + '|' + studyText(x);
        })
        .join('~');
      if (sel.dataset.key !== key) {
        sel.innerHTML = studySystems
          .map(function (x) {
            return '<option value="' + esc(x.id) + '">' + esc(studyText(x)) + '</option>';
          })
          .join('');
        sel.dataset.key = key;
      }
      if (sel.value !== ss.id) sel.value = ss.id;
    }
    $('focusSystemTitle').innerHTML = studyTitlePair(ss);
    $('focusSystemProgress').textContent = done + '/' + steps.length;
    $('focusPrevStep').textContent = tr('focusPrev');
    $('focusNextStep').textContent = tr('focusNext');
    $('focusStageHelp').textContent = L(
      'اختار أي مرحلة للتنقّل، أو استخدم السابق / التالي',
      'Select any stage, or use Previous / Next',
    );
    $('focusPrevStep').disabled = !steps.length || !current || current.index <= 0;
    $('focusNextStep').disabled = !steps.length || !current || current.index >= steps.length - 1;
    $('focusStepList').innerHTML = steps.length
      ? steps
          .map(function (step, i) {
            var cls = (step.done ? ' is-done' : '') + (current && current.index === i ? ' is-current' : '');
            var selected =
              current && current.index === i ? ' aria-selected="true"' : ' aria-selected="false"';
            var status = step.done
              ? L('تمت', 'Done')
              : current && current.index === i
                ? L('المرحلة الحالية', 'Current stage')
                : L('مرحلة', 'Stage');
            return (
              '<button type="button" class="focusStep' +
              cls +
              '" data-focus-step="' +
              i +
              '"' +
              selected +
              '><div class="focusStep__num">' +
              (i + 1) +
              '</div><div class="focusStep__labels">' +
              studyStepPair(step) +
              '<span class="focusStep__status">' +
              esc(status + stepSpentTag(i)) +
              '</span></div></button>'
            );
          })
          .join('')
      : '<div class="focusNoSystem">' + esc(tr('noSteps')) + '</div>';
  }
  function enterFocusMode() {
    if (focusModeActive) return;
    if (focusCloseTimer) {
      clearTimeout(focusCloseTimer);
      focusCloseTimer = null;
    }
    focusReturnElement = document.activeElement;
    var initialSystem = currentStudySystem();
    focusSelectedSystemId = initialSystem ? initialSystem.id : null;
    focusSelectedStepIndex = null;
    loadFocusGoal();
    focusModeActive = true;
    var overlay = $('focusOverlay');
    overlay.hidden = false;
    overlay.classList.remove('is-closing');
    document.body.classList.add('focus-active');
    syncFocusUI();
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      if (window.KKMangaCharacterMoment) window.KKMangaCharacterMoment('naruto', 'focus-enter');
      var target = $('focusToggle');
      if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
    });
  }
  var focusExitTimer = null;
  function saveFocusGoal() {
    try {
      localStorage.setItem(scopedKey('kashkool.focus.goal.v1'), $('focusGoal').value);
    } catch (e) {}
  }
  function loadFocusGoal() {
    var g = $('focusGoal');
    if (!g) return;
    g.placeholder = L(
      '🎯 هدف الجلسة: هتخلّص إيه في الجولة دي؟',
      '🎯 Session goal: what will you finish this round?',
    );
    if (!g.value) {
      try {
        g.value = localStorage.getItem(scopedKey('kashkool.focus.goal.v1')) || '';
      } catch (e) {}
    }
  }
  function hideExitConfirm() {
    clearInterval(focusExitTimer);
    var c = $('focusExitConfirm');
    if (c) c.hidden = true;
  }
  function showFocusSummary(mins) {
    var g = ($('focusGoal').value || '').trim(),
      start = new Date();
    start.setHours(0, 0, 0, 0);
    var today = loadStudyStats()
      .filter(function (x) {
        return x.at >= start.getTime();
      })
      .reduce(function (a, x) {
        return a + (+x.minutes || 0);
      }, 0);
    var ss = currentStudySystem(),
      steps = ss ? ss.steps || [] : [],
      done = steps.filter(function (x) {
        return x.done;
      }).length;
    $('focusSumTitle').textContent = L('🎉 خلّصت جولة تركيز', '🎉 Focus round complete');
    $('focusSumStats').innerHTML =
      '<div><b>' +
      mins +
      '</b><span>' +
      esc(L('دقيقة اتحسبت', 'min counted')) +
      '</span></div><div><b>' +
      today +
      '</b><span>' +
      esc(L('إجمالي النهارده', 'today total')) +
      '</span></div>' +
      (steps.length
        ? '<div><b>' +
          done +
          '/' +
          steps.length +
          '</b><span>' +
          esc(L('خطوات النظام', 'system steps')) +
          '</span></div>'
        : '');
    $('focusSumGoalBox').hidden = !g;
    $('focusSumGoalText').textContent = '🎯 ' + g;
    $('focusSumHit').textContent = L('حققته ✓', 'Done ✓');
    $('focusSumMiss').textContent = L('لسه', 'Not yet');
    $('focusSumHit').hidden = false;
    $('focusSumMiss').hidden = false;
    var sb = $('focusSumStepBox'),
      cur0 = focusCurrentStep();
    if (cur0 && cur0.step.done) {
      focusSelectedStepIndex = null;
      cur0 = focusCurrentStep();
    }
    var open0 = focusNextOpen();
    if (steps.length) {
      sb.hidden = false;
      if (!open0) {
        $('focusSumStepText').textContent = L('🎉 خلّصت كل خطوات النظام!', '🎉 You finished every step!');
        $('focusSumStepYes').hidden = true;
        $('focusSumStepNo').hidden = true;
      } else {
        $('focusSumStepText').textContent = L(
          'خلّصت «' + studyStepText(cur0.step) + '»؟',
          'Finished “' + studyStepText(cur0.step) + '”?',
        );
        $('focusSumStepYes').hidden = false;
        $('focusSumStepNo').hidden = false;
      }
      $('focusSumStepYes').textContent = L('خلّصتها ✓', 'Done ✓');
      $('focusSumStepNo').textContent = L('لسه', 'Not yet');
    } else sb.hidden = true;
    $('focusSumClose').textContent = L('كمّل', 'Continue');
    $('focusSummary').hidden = false;
    $('focusSumClose').focus();
  }
  function exitFocusMode() {
    if (!focusModeActive) return;
    var c = $('focusExitConfirm');
    if (c && !c.hidden) {
      hideExitConfirm();
      return;
    }
    if (pomo.running && pomo.mode === 'work' && c) {
      $('focusExitTitle').textContent = L('متأكد إنك عايز تخرج؟', 'Leave focus mode?');
      $('focusExitText').textContent = L(
        'فاضل ' + fmtMMSS(pomo.remaining) + ' على نهاية الجولة، والمؤقّت هيفضل شغّال بعد ما تخرج.',
        fmtMMSS(pomo.remaining) + ' left in this round, and the timer keeps running after you leave.',
      );
      $('focusExitNo').textContent = L('كمّل تركيز', 'Keep focusing');
      var yes = $('focusExitYes'),
        n = 3;
      yes.disabled = true;
      yes.textContent = L('اخرج (' + n + ')', 'Leave (' + n + ')');
      clearInterval(focusExitTimer);
      focusExitTimer = setInterval(function () {
        n--;
        if (n <= 0) {
          clearInterval(focusExitTimer);
          yes.disabled = false;
          yes.textContent = L('اخرج', 'Leave');
        } else yes.textContent = L('اخرج (' + n + ')', 'Leave (' + n + ')');
      }, 1000);
      c.hidden = false;
      $('focusExitNo').focus();
      return;
    }
    reallyExitFocus();
  }
  function reallyExitFocus() {
    if (!focusModeActive) return;
    hideExitConfirm();
    if ($('focusSummary')) $('focusSummary').hidden = true;
    focusModeActive = false;
    var overlay = $('focusOverlay');
    overlay.classList.remove('is-open');
    overlay.classList.add('is-closing');
    document.body.classList.remove('focus-active');
    focusCloseTimer = setTimeout(function () {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
      focusCloseTimer = null;
      if (
        focusReturnElement &&
        document.contains(focusReturnElement) &&
        typeof focusReturnElement.focus === 'function'
      ) {
        focusReturnElement.focus({ preventScroll: true });
      }
      focusReturnElement = null;
    }, 360);
  }
  function toggleFocusMode() {
    focusModeActive ? exitFocusMode() : enterFocusMode();
  }

  /* ----- timer settings ----- */
  function fillPomoSettingsForm() {
    $('p_work').value = pomoSettings.work;
    $('p_break').value = pomoSettings.brk;
    $('p_long').value = pomoSettings.long;
    $('p_rounds').value = pomoSettings.rounds;
    $('p_auto').checked = pomoSettings.auto !== false;
  }
  function applyPomoSettings() {
    var wasRunning = pomo.running;
    if (wasRunning) pomoPause(true);
    var w = Math.min(180, Math.max(1, +$('p_work').value || pomoSettings.work));
    var b = Math.min(60, Math.max(1, +$('p_break').value || pomoSettings.brk));
    var l = Math.min(120, Math.max(1, +$('p_long').value || pomoSettings.long));
    var r = Math.min(12, Math.max(1, +$('p_rounds').value || pomoSettings.rounds));
    pomoSettings = { work: w, brk: b, long: l, rounds: r, auto: $('p_auto').checked };
    try {
      localStorage.setItem(scopedKey(LS_POMO), JSON.stringify(pomoSettings));
    } catch (e) {}
    var elapsed = pomo.total - pomo.remaining;
    pomo.round = Math.min(pomo.round, pomoSettings.rounds);
    pomo.total = pomoDurationSec(pomo.mode);
    pomo.remaining = elapsed > 0 && elapsed < pomo.total ? pomo.total - elapsed : pomo.total;
    fillPomoSettingsForm();
    renderPomoPresets();
    if (wasRunning) pomoStart(true);
    else {
      syncPomoUI();
      savePomoState();
    }
    toast(L('اتحفظت إعدادات المؤقّت.', 'Timer settings saved.'));
  }

  /* ----- wiring ----- */
  loadSoundPrefs();
  fillPomoSettingsForm();
  restorePomoState();
  applyLanguage();
  $('langBtn').addEventListener('click', function () {
    lang = lang === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem(LS_LANG, lang);
    } catch (e) {}
    applyLanguage();
    applySettingsLanguage();
    render();
  });
  $('settingsLangBtn').addEventListener('click', function () {
    lang = lang === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem(LS_LANG, lang);
    } catch (e) {}
    applyLanguage();
    applySettingsLanguage();
    render();
  });
  $('themeSetting').addEventListener('change', function () {
    appSettings.theme = this.value;
    saveAppSettings();
    applyAppSettings();
    try {
      localStorage.setItem(LS_THEME, appSettings.theme);
    } catch (e) {}
    syncSettingsUI();
  });
  $('fontSizeSetting').addEventListener('change', function () {
    appSettings.fontSize = this.value;
    saveAppSettings();
    syncSettingsUI();
  });
  $('compactSetting').addEventListener('change', function () {
    appSettings.compact = this.checked;
    saveAppSettings();
    syncSettingsUI();
  });
  $('reduceMotionSetting').addEventListener('change', function () {
    appSettings.reduceMotion = this.checked;
    saveAppSettings();
    syncSettingsUI();
  });
  $('motionProfileSetting').addEventListener('change', function () {
    appSettings.motionProfile = this.value;
    saveAppSettings();
    applyAppSettings();
    syncSettingsUI();
  });
  $('accentSetting').addEventListener('change', function () {
    appSettings.accent = this.value;
    saveAppSettings();
    syncSettingsUI();
  });
  $('radiusSetting').addEventListener('change', function () {
    appSettings.radius = this.value;
    saveAppSettings();
    syncSettingsUI();
  });
  $('densitySetting').addEventListener('change', function () {
    appSettings.density = this.value;
    appSettings.compact = this.value === 'compact';
    saveAppSettings();
    syncSettingsUI();
  });
  $('visibleSectionsGrid').addEventListener('change', function (e) {
    var cb = e.target && e.target.closest ? e.target.closest('[data-visible-section]') : null;
    if (!cb) return;
    var view = cb.dataset.visibleSection;
    appSettings.visibleSections = appSettings.visibleSections || {};
    var enabled = cb.checked;
    if (
      !enabled &&
      Object.keys(appSettings.visibleSections).filter(function (v) {
        return appSettings.visibleSections[v] !== false;
      }).length <= 1
    ) {
      cb.checked = true;
      return;
    }
    appSettings.visibleSections[view] = enabled;
    saveAppSettings();
    syncSettingsUI();
  });
  $('defaultViewSetting').addEventListener('change', function () {
    appSettings.defaultView = this.value;
    saveAppSettings();
  });
  $('confirmDeleteSetting').addEventListener('change', function () {
    appSettings.confirmDelete = this.checked;
    saveAppSettings();
  });
  $('focusAutoSetting').addEventListener('change', function () {
    appSettings.focusAuto = this.checked;
    saveAppSettings();
  });
  $('focusStepsSetting').addEventListener('change', function () {
    appSettings.focusShowSteps = this.checked;
    saveAppSettings();
    if (focusModeActive) syncFocusUI();
  });
  $('openFocusFromSettings').addEventListener('click', enterFocusMode);
  $('pomoFocusBtn').addEventListener('click', toggleFocusMode);
  $('focusToggle').addEventListener('click', function () {
    pomo.running ? pomoPause() : pomoStart();
  });
  $('focusSkip').addEventListener('click', pomoSkip);
  $('focusReset').addEventListener('click', pomoReset);
  $('focusExtend').addEventListener('click', pomoExtend);
  $('focusStepDone').addEventListener('click', focusCompleteStep);
  $('focusSystemSelect').addEventListener('change', function () {
    activeStudySystemId = this.value;
    saveActiveStudySystem();
    focusSelectedStepIndex = null;
    renderStudyPlan();
    syncFocusUI();
  });
  $('focusSumStepYes').addEventListener('click', function () {
    focusCompleteStep();
    var n = focusNextOpen();
    $('focusSumStepText').textContent = n
      ? L(
          '✓ تمت. الخطوة الجاية: «' + studyStepText(n.step) + '»',
          '✓ Done. Next: “' + studyStepText(n.step) + '”',
        )
      : L('🎉 خلّصت كل خطوات النظام!', '🎉 You finished every step!');
    $('focusSumStepYes').hidden = true;
    $('focusSumStepNo').hidden = true;
  });
  $('focusSumStepNo').addEventListener('click', function () {
    $('focusSumStepText').textContent = L('تمام — هتكمّل نفس الخطوة.', "OK — you'll continue this step.");
    $('focusSumStepYes').hidden = true;
    $('focusSumStepNo').hidden = true;
  });
  $('focusGoal').addEventListener('input', saveFocusGoal);
  $('focusExitYes').addEventListener('click', function () {
    hideExitConfirm();
    reallyExitFocus();
  });
  $('focusExitNo').addEventListener('click', hideExitConfirm);
  $('focusSumClose').addEventListener('click', function () {
    $('focusSummary').hidden = true;
  });
  $('focusSumHit').addEventListener('click', function () {
    $('focusGoal').value = '';
    saveFocusGoal();
    $('focusSumGoalText').textContent = L('🎯 الهدف اتحقق — برافو!', '🎯 Goal achieved — well done!');
    $('focusSumHit').hidden = true;
    $('focusSumMiss').hidden = true;
  });
  $('focusSumMiss').addEventListener('click', function () {
    $('focusSumGoalText').textContent = L(
      '🎯 هيفضل هدفك للجولة الجاية: ' + $('focusGoal').value,
      '🎯 Goal kept for next round: ' + $('focusGoal').value,
    );
    $('focusSumHit').hidden = true;
    $('focusSumMiss').hidden = true;
  });
  $('pomoExtend').addEventListener('click', pomoExtend);
  $('focusExit').addEventListener('click', exitFocusMode);
  $('focusPrevStep').addEventListener('click', function () {
    moveFocusStep(-1);
  });
  $('focusNextStep').addEventListener('click', function () {
    moveFocusStep(1);
  });
  $('focusStepList').addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-focus-step]');
    if (!btn) return;
    setFocusStep(+btn.dataset.focusStep);
  });
  $('saveTimerFromSettings').addEventListener('click', function () {
    $('p_work').value = $('settingsWork').value;
    $('p_break').value = $('settingsBreak').value;
    $('p_long').value = $('settingsLong').value;
    $('p_rounds').value = $('settingsRounds').value;
    $('p_auto').checked = $('settingsAuto').checked;
    applyPomoSettings();
    syncSettingsUI();
  });
  $('openTimerSettings').addEventListener('click', function () {
    setActiveView('pomo');
    var details = document.querySelector('#view-pomo .pomo__settings');
    if (details) details.open = true;
  });
  $('exportDataBtn').addEventListener('click', exportAppData);
  $('importDataBtn').addEventListener('click', function () {
    $('importDataFile').click();
  });
  $('importDataFile').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        importAppData(JSON.parse(rd.result));
      } catch (e) {
        toast(tr('invalidImport'));
      }
    };
    rd.readAsText(f);
    this.value = '';
  });
  $('resetDataBtn').addEventListener('click', resetAccountData);
  var recycleRestoreBtn = document.getElementById('kk-restore-deleted');
  if (recycleRestoreBtn) recycleRestoreBtn.addEventListener('click', restoreLatestDeletedItem);
  $('pomoToggle').addEventListener('click', function () {
    pomo.running ? pomoPause() : pomoStart();
  });
  $('pomoSkip').addEventListener('click', pomoSkip);
  $('pomoReset').addEventListener('click', pomoReset);
  $('p_apply').addEventListener('click', applyPomoSettings);
  $('progressGoalEdit').addEventListener('click', function () {
    var current = loadWeeklyGoal();
    $('goalMinutesInput').value = current;
    document.querySelectorAll('.goalPreset').forEach(function (b) {
      b.classList.toggle('is-selected', +b.dataset.goal === current);
    });
    $('goalDialogTitle').textContent = lang === 'en' ? 'Weekly goal' : 'هدف الأسبوع';
    $('goalMinutesLabel').textContent = lang === 'en' ? 'Goal in minutes' : 'الهدف بالدقائق';
    $('goalDialogHint').textContent =
      lang === 'en' ? 'Choose a preset or enter your own target.' : 'اختار هدف جاهز أو اكتب هدفك بنفسك.';
    $('goalSaveBtn').textContent = lang === 'en' ? 'Save goal' : 'حفظ الهدف';
    $('dlgGoal').showModal();
  });
  document.querySelectorAll('.goalPreset').forEach(function (b) {
    b.addEventListener('click', function () {
      $('goalMinutesInput').value = b.dataset.goal;
      document.querySelectorAll('.goalPreset').forEach(function (x) {
        x.classList.toggle('is-selected', x === b);
      });
    });
  });
  $('progressCopyBtn').addEventListener('click', function () {
    var t = [
      $('progressHeroEyebrow').textContent + ': ' + $('progressHeroMinutes').textContent,
      $('progressGoalTitle').textContent +
        ': ' +
        $('progressGoalMeta').textContent +
        ' (' +
        $('progressGoalPercent').textContent +
        ')',
      $('progressHeroStreak').textContent,
      $('progressBestDayLabel2').textContent + ': ' + $('progressBestDayValue2').textContent,
    ].join('\n');
    var ok = function () {
        toast(lang === 'en' ? 'Summary copied.' : 'اتنسخ ملخص الأسبوع.');
      },
      no = function () {
        toast(lang === 'en' ? "Couldn't copy." : 'معرفتش أنسخ الملخص.');
      };
    try {
      navigator.clipboard.writeText(t).then(ok, no);
    } catch (e) {
      no();
    }
  });
  $('goalSaveBtn').addEventListener('click', function () {
    var n = Math.round(+$('goalMinutesInput').value);
    if (!isFinite(n)) return;
    n = Math.max(30, Math.min(6000, n));
    saveWeeklyGoal(n);
    $('dlgGoal').close();
    renderStats();
    toast(lang === 'en' ? 'Weekly goal updated.' : 'اتحدث هدف الأسبوع.');
  });
  ['p_work', 'p_break', 'p_long', 'p_rounds'].forEach(function (id) {
    $(id).addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPomoSettings();
      }
    });
  });
  $('pomoPresets').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-pomo-preset]') : null;
    var p = b ? POMO_PRESETS[b.dataset.pomoPreset] : null;
    if (!p) return;
    $('p_work').value = p.work;
    $('p_break').value = p.brk;
    $('p_long').value = p.long;
    $('p_rounds').value = p.rounds;
    applyPomoSettings();
  });
  $('pomoSubject').addEventListener('change', function () {
    savePomoSubject(this.value);
  });
  $('soundEnabled').addEventListener('change', function () {
    soundEnabled = this.checked;
    saveSoundPrefs();
    syncSoundUI();
  });
  $('pomoSound').addEventListener('click', function () {
    soundEnabled = !soundEnabled;
    saveSoundPrefs();
    syncSoundUI();
    if (soundEnabled) playSound(soundType, true);
  });
  $('soundVolume').addEventListener('input', function () {
    soundVolume = (+this.value || 0) / 100;
    $('soundVolumeValue').textContent = Math.round(soundVolume * 100) + '%';
    applyMasterVolume();
  });
  $('soundVolume').addEventListener('change', function () {
    saveSoundPrefs();
    playSound(soundType, true);
  });
  $('soundOptions').addEventListener('change', function (e) {
    if (e.target && e.target.name === 'soundType') {
      soundType = e.target.value;
      saveSoundPrefs();
      playSound(soundType, true);
    }
  });
  $('soundOptions').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-play-sound]') : null;
    if (b) {
      e.preventDefault();
      playSound(b.dataset.playSound, true);
    }
  });
  $('testSoundBtn').addEventListener('click', function () {
    playSound(soundType, true);
  });
  // a timer restored after a reload needs one user gesture before the browser lets it play sound
  function unlockAudioOnce() {
    if (!pomo.running) return;
    ensureAudioCtx();
    if (pomoCtx && pomoCtx.state === 'running') {
      document.removeEventListener('pointerdown', unlockAudioOnce, true);
      document.removeEventListener('keydown', unlockAudioOnce, true);
    }
  }
  document.addEventListener('pointerdown', unlockAudioOnce, true);
  document.addEventListener('keydown', unlockAudioOnce, true);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pomoTick();
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyF') {
      e.preventDefault();
      if (!document.querySelector('dialog[open]')) toggleFocusMode();
      return;
    }
    if (e.code === 'Escape' && focusModeActive) {
      e.preventDefault();
      exitFocusMode();
      return;
    }
    if (
      (activeView !== 'pomo' && !focusModeActive) ||
      e.code !== 'Space' ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.shiftKey
    )
      return;
    var t = e.target,
      tag = t && t.tagName;
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      tag === 'BUTTON' ||
      tag === 'SUMMARY' ||
      tag === 'A' ||
      (t && t.isContentEditable)
    )
      return;
    if (document.querySelector('dialog[open]')) return;
    e.preventDefault();
    pomo.running ? pomoPause() : pomoStart();
  });

  /* ---------------- boot ---------------- */
  render();
  (function boot() {
    startLocal();
  })();

  function startLocal() {
    mode = 'local';
    loadLocal();
    loadPomoSubject();
    notice('الحفظ دلوقتي على الجهاز ده بس. لو فتحت الصفحة من موبايل تاني مش هتلاقي نفس البيانات.');
    setActiveView(currentDefaultView());
  }
  /* v50 modular bridge: the Learning OS layer reads/writes through this narrow API. */
  function kkSetTaskDependencies(taskId, dependencyIds) {
    trkLoad();
    var task = trkTaskById(String(taskId || ''));
    if (!task || !Array.isArray(dependencyIds)) return false;
    var next = [];
    for (var i = 0; i < dependencyIds.length; i++) {
      var depId = String(dependencyIds[i] || ''),
        dep = trkTaskById(depId);
      if (!dep || dep.id === task.id || dep.trackId !== task.trackId) return false;
      if (next.indexOf(depId) < 0) next.push(depId);
    }
    function reaches(fromId, targetId, seen) {
      if (fromId === targetId) return true;
      if (seen[fromId]) return false;
      seen[fromId] = true;
      var from = trkTaskById(fromId);
      if (!from) return false;
      return (from.dependsOn || []).some(function (parentId) {
        return reaches(parentId, targetId, seen);
      });
    }
    for (var j = 0; j < next.length; j++) {
      if (reaches(next[j], task.id, Object.create(null))) return false;
    }
    task.dependsOn = next;
    if (!trkSave()) return false;
    try {
      renderTrack();
    } catch (e) {}
    return true;
  }
  window.KashKoolCore = {
    getAccountId: function () {
      return String(activeAccountId || 'default');
    },
    getData: function () {
      try {
        return JSON.parse(JSON.stringify(state));
      } catch (e) {
        return state;
      }
    },
    getTrackData: function () {
      trkLoad();
      try {
        return JSON.parse(JSON.stringify(TRK));
      } catch (e) {
        return TRK;
      }
    },
    getFlashcards: function () {
      try {
        var v = JSON.parse(localStorage.getItem('kashkool.flashcards.v1.' + activeAccountId) || '[]');
        return Array.isArray(v) ? v : [];
      } catch (e) {
        return [];
      }
    },
    getStudyStats: function () {
      try {
        return loadStudyStats();
      } catch (e) {
        return [];
      }
    },
    getPomoState: function () {
      return {
        running: !!(pomo && pomo.running),
        mode: (pomo && pomo.mode) || 'work',
        subjectId: (pomo && pomo.subjectId) || '',
        remaining: (pomo && pomo.remaining) || 0,
      };
    },
    getActiveTaskId: function () {
      try {
        return localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '';
      } catch (e) {
        return '';
      }
    },
    goTo: function (view) {
      setActiveView(view);
      return activeView === view;
    },
    setTaskDependencies: kkSetTaskDependencies,
    startTask: function (id) {
      trkLoad();
      var task = trkTaskById(String(id || ''));
      if (!task) return false;
      var unmet = (task.dependsOn || []).map(trkTaskById).filter(function (dep) {
        return dep && dep.status !== 'done';
      });
      if (unmet.length || (pomo && pomo.running)) return false;
      trkStartTask(task.id);
      return String(localStorage.getItem(scopedKey('kashkool.track.activeTask.v1')) || '') === task.id;
    },
    setTaskStatus: function (id, status) {
      trkLoad();
      var task = trkTaskById(String(id || ''));
      if (!task) return false;
      var unmet = (task.dependsOn || []).map(trkTaskById).filter(function (dep) {
        return dep && dep.status !== 'done';
      });
      if ((status === 'doing' || status === 'done') && unmet.length) return false;
      trkSetTaskStatus(task.id, status);
      return true;
    },
    saveTaskReview: function (id, review) {
      trkLoad();
      var task = trkTaskById(String(id || ''));
      if (!task || !review || typeof review !== 'object') return false;
      var safe = {
        outcome:
          ['completed', 'partial', 'difficult'].indexOf(review.outcome) >= 0 ? review.outcome : 'partial',
        note: String(review.note || '').slice(0, 1200),
        nextStep: String(review.nextStep || '').slice(0, 140),
        minutes: Math.max(0, Math.min(1440, Math.round(Number(review.minutes) || 0))),
        at: Math.max(0, Number(review.at) || Date.now()),
      };
      task.sessionReviews = Array.isArray(task.sessionReviews) ? task.sessionReviews : [];
      task.sessionReviews.push(safe);
      task.sessionReviews = task.sessionReviews.slice(-10);
      task.lastSessionReview = safe.at;
      return trkSave();
    },
  };
})();
