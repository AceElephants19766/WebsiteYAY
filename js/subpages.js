
// Subpages Logic - Translations & Navigation

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check URL params for language
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'he'; // Default to Hebrew if not specified

    // 2. Translations Dictionary
    const translations = {
        'he': {
            'backValues': 'חזרה',
            'softwareTitle': 'צוות תוכנה',
            'softwareSubtitle': 'המוח מאחורי הרובוט',
            'softwareProcessTitle': 'התהליך שלנו',
            'softwareProcessText': 'כאן נכתוב על תהליך הפיתוח, האלגוריתמים, והשימוש ב-Java ו-OpenCV. התוכנה שלנו מאפשרת לרובוט לפעול באופן אוטונומי ולזהות אלמנטים במשחק בזמן אמת.',
            'softwareGalleryTitle': 'גלריה טכנית',

            'mechanicsTitle': 'צוות מכניקה',
            'mechanicsSubtitle': 'הכוח שמניע את הכל',
            'mechanicsProcessTitle': 'תכנון וייצור (CAD & Build)',
            'mechanicsProcessText': 'תהליך המכניקה שלנו מתחיל בשרטוטים ב-CAD, עובר להדפסות תלת-ממד וחיתוך לייזר, ומסתיים בהרכבה מדויקת. אנו משתמשים בחומרים מתקדמים ובטכניקות ייצור מגוונות כדי ליצור רובוט מהיר, חזק ואמין.',
            'mechanicsGalleryTitle': 'תהליך הבנייה',

            'marketingTitle': 'שיווק ומדיה',
            'marketingSubtitle': 'הקול והפנים של הקבוצה',
            'marketingProcessTitle': 'מיתוג ופרסום',
            'marketingProcessText': 'אנחנו דואגים שהעולם יידע מי אנחנו. ניהול רשתות חברתיות, גיוס ספונסרים, ועיצוב הזהות שלנו הם חלק בלתי נפרד מההצלחה של הקבוצה. אנו יוצרים תוכן ויזואלי, סרטונים ופוסטים כדי לשתף את המסע שלנו.',
            'marketingGalleryTitle': 'התוצרים שלנו',

            'communityTitle': 'קהילה',
            'communitySubtitle': 'להעביר את הידע הלאה',
            'communityProcessTitle': 'התנדבות והדרכה',
            'communityProcessText': 'אנחנו מאמינים בשיתוף ידע. אנחנו חונכים קבוצות צעירות (FLL), מארגנים פעילויות טכנולוגיות בקהילה, ופועלים להפצת ערכי ה-FIRST בכל מקום שאנחנו מגיעים אליו.',
            'communityGalleryTitle': 'הפעילות שלנו',

            'footerContact': 'צור קשר'
        },
        'en': {
            'backValues': '<i class="fas fa-arrow-left"></i> Back',
            'softwareTitle': 'Software Team',
            'softwareSubtitle': 'The Brain Behind the Robot',
            'softwareProcessTitle': 'Our Process',
            'softwareProcessText': 'Here we describe our development process, algorithms, and use of Java and OpenCV. Our software enables the robot to operate autonomously and detect game elements in real-time.',
            'softwareGalleryTitle': 'Technical Gallery',

            'mechanicsTitle': 'Mechanics Team',
            'mechanicsSubtitle': 'The Power Driving Everything',
            'mechanicsProcessTitle': 'Design & Manufacturing',
            'mechanicsProcessText': 'Our mechanical process starts with CAD designs, moves to 3D printing and laser cutting, and ends with precise assembly. We use advanced materials and diverse manufacturing techniques to create a fast, strong, and reliable robot.',
            'mechanicsGalleryTitle': 'Build Process',

            'marketingTitle': 'Marketing & Media',
            'marketingSubtitle': 'The Voice and Face of the Team',
            'marketingProcessTitle': 'Branding & Publicity',
            'marketingProcessText': 'We ensure the world knows who we are. Managing social media, recruiting sponsors, and designing our identity are integral parts of the team\'s success. We create visual content, videos, and posts to share our journey.',
            'marketingGalleryTitle': 'Our Creations',

            'communityTitle': 'Community',
            'communitySubtitle': 'Passing the Knowledge Forward',
            'communityProcessTitle': 'Volunteering & Mentoring',
            'communityProcessText': 'We believe in knowledge sharing. We mentor young FLL teams, organize technological community activities, and work to spread FIRST values wherever we go.',
            'communityGalleryTitle': 'Our Activities',

            'footerContact': 'Contact Us'
        }
    };

    // 3. Apply Translations
    const content = translations[lang];
    if (content) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

        // Helper to safe update
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if (el) el.innerText = txt;
        };
        const setHTML = (id, html) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = html;
        }

        // Apply Common IDs (Need to add these IDs to HTML files)
        setHTML('back-btn-text', content.backValues); // Handle icon + text
        setTxt('page-title', content.softwareTitle || content.mechanicsTitle || content.marketingTitle || content.communityTitle);
        // Note: The above simplistic mapping won't work well generically unless I know WHICH page it is.
        // Better: Query based on data-attributes or specific IDs.

        // Let's rely on data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (content[key]) {
                // Determine if it's text or HTML (for icon in button)
                if (key === 'backValues') el.innerHTML = content[key];
                else el.innerText = content[key];
            }
        });
    }

    // 4. Update Back Button Logic
    const backBtn = document.querySelector('.back-btn-fixed');
    if (backBtn) {
        if (lang === 'en') {
            backBtn.href = '../en.html#teams';
            // Update icon direction for LTR
            const icon = backBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-arrow-right');
                icon.classList.add('fa-arrow-left');
            }
        } else {
            backBtn.href = '../index.html#teams';
        }
    }
});
