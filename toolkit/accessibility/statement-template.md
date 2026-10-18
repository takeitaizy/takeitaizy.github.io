# Accessibility statement template (Hebrew + English)

Based on the takeitaizy.dev statement (18 October 2026), which follows the
structure of Or Tzuberi's statement. Use it for any public site or app we
build for a client.

**How to use**

1. Copy the Hebrew and English text into the client's site (a page linked
   from the footer of every page, in both languages if the site is bilingual).
2. Replace every `{{FIELD}}`. Keep a bullet or a sentence only if it is true
   for this site. The notes marked **לוודא** (verify) say what has to be
   checked before it stays in. Delete the notes before publishing.
3. Run `a11y-check.mjs` on every page of the site. Paste nothing into the
   statement that the check or a person didn't confirm.
4. The statement is the client's (the site operator's). They approve the
   final text and the accessibility contact. We supply the template and the
   test results; we don't sign the statement for them.

Never write "the site complies" or "the site is fully accessible". We say
what was built, what was checked and what is known to be missing.

---

## עברית

### הצהרת נגישות

עודכן לאחרונה: {{תאריך}}

> לוודא: התאריך הוא יום הבדיקה האחרונה, לא יום ההעלאה. מעדכנים אותו בכל שינוי משמעותי באתר.

{{משפט פתיחה אחד על האתר ועל מי שהוא משרת}}

#### מחויבות לנגישות

{{שם המפעיל}} מחויבת להנגשת האתר לאנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 ותקנותיו, ובהתאם לתקן הישראלי ת"י 5568, המבוסס על הנחיות WCAG 2.1 ברמה AA. האתר נבנה מתוך כוונה לעמוד בתקן הזה, ואנחנו ממשיכים לשפר אותו.

> לוודא: לא לכתוב "האתר עומד בתקן" או "האתר נגיש באופן מלא". הניסוח "נבנה מתוך כוונה לעמוד" הוא מה שאפשר לגבות.

#### אמצעי הנגישות באתר

- מבנה כותרות ואזורים סמנטיים, כך שקורא מסך יכול לנווט בדף.
- ניווט מלא במקלדת, קישור "דלגו לתוכן" וסימון מיקוד ברור על כל רכיב אינטראקטיבי.
- טפסים עם תוויות מקושרות לשדות הקלט.
- תיאורים חלופיים (alt) לתמונות.
- ניגודיות צבעים שנבדקה, וגודל מינימלי נוח ללחיצה על כפתורים בנייד.
- שפת הדף וכיוון הקריאה מוגדרים נכון{{ בעברית ובאנגלית, והדף משתנה בהתאם למעבר בין השפות}}.
- התאמה להעדפות המערכת של המשתמש: {{הפחתת תנועה, הפחתת שקיפות וניגודיות גבוהה}}.
- התאמה לשימוש בנייד ולהגדלת טקסט.
- {{כתוביות לסרטונים / תמלול להקלטות, אם יש}}

> לוודא, שורה אחרי שורה:
> - כותרות ואזורים: יש `main`, `header`, `footer`, ו-`h1` אחד בכל דף. axe לא מתלונן על `region` או `heading-order`.
> - מקלדת: הבדיקה עוברת, ה-Tab הראשון הוא "דלגו לתוכן", ותפריט נייד נפתח ונסגר במקלדת.
> - טפסים: לכל שדה יש `label` מקושר. טופס מוטמע מצד שלישי נבדק בנפרד, ואם לא נבדק עובר ל"מגבלות ידועות".
> - alt: לכל תמונה יש תיאור שאדם קרא ואישר. תמונה דקורטיבית מקבלת `alt=""`.
> - ניגודיות: axe בלי `color-contrast`, גם במצב כהה אם יש.
> - שפה וכיוון: `lang` ו-`dir` נכונים בכל דף ובכל שפה.
> - העדפות מערכת: לכתוב רק את מה שיש בקוד (`prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`).
> - כתוביות: רק אם לכל סרטון יש כתוביות. אחרת מוחקים את השורה וכותבים במגבלות.

#### התאמות אישיות

באתר אין תוסף נגישות. את התצוגה אפשר להתאים בדפדפן ובמערכת ההפעלה: הגדלת טקסט והגדלה של הדף, ניגודיות גבוהה, וקורא מסך לבחירתכם.

> לוודא: אם הלקוח מתקין תוסף נגישות, מחליפים את הפסקה בתיאור של מה שהתוסף עושה בפועל. תוסף לא מחליף את התיקונים בקוד, ולא מבטיח עמידה בתקן.

#### איך בדקנו

הבדיקה נעשתה בכלי בדיקה אוטומטי (axe-core) ובבדיקה ידנית של ניווט במקלדת, בדסקטופ ובנייד. בדיקה אוטומטית לא מוצאת הכול, ולכן ייתכן שנותרו מקומות שדורשים שיפור.

> לוודא: לשמור את פלט הבדיקה (`--json`) עם התאריך בתיקיית הפרויקט. אם נעשתה בדיקה עם קורא מסך (NVDA, VoiceOver), להוסיף אותה כאן. אם לא, לא לכתוב.

#### דפדפנים נתמכים

האתר מיועד לעבוד בגרסאות העדכניות של הדפדפנים הנפוצים: Chrome, Firefox, Safari ו-Edge. בדקנו אותו בפועל ב-{{הדפדפנים שנבדקו}}. לחוויה מיטבית מומלץ להשתמש בגרסה העדכנית ביותר של הדפדפן.

> לוודא: "בדקנו בפועל" רק בדפדפנים שבהם הדף נפתח ונבדק באמת.

#### מגבלות ידועות

{{רשימה של מה שלא נגיש או לא נבדק: טופס או וידג'ט של צד שלישי, מסמכי PDF ישנים, סרטונים בלי כתוביות, מפה מוטמעת. לכל אחד: מה הדרך החלופית}}

> לוודא: הסעיף לא נשאר ריק ולא נמחק בלי לחשוב. כל תוכן שהלקוח מעלה בעצמו (PDF, סרטון, תמונה) ולא עבר בדיקה נכנס לכאן.

#### פניות בנושא נגישות

אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור, נשמח לשמוע מכם. כתבו אלינו ל-{{אימייל}}, ציינו באיזה דף ומה לא עבד, ונעשה כמיטב יכולתנו לטפל בכל פנייה תוך זמן סביר. אפשר גם לבקש לקבל את המידע שבאתר בדרך אחרת.

{{רכז/ת הנגישות: שם, טלפון, אימייל}}

האתר מופעל על ידי {{שם המפעיל}} ({{ח.פ. / ע.מ.}}), {{כתובת}}.

> לוודא: פרטי הקשר הם של הלקוח, לא שלנו. האם הלקוח חייב למנות רכז נגישות ולפרסם את פרטיו (לפי גודל הארגון וסוג השירות) זו שאלה לעורך הדין של הלקוח. לא מפרסמים כתובת מגורים של אדם פרטי ולא מספר תעודת זהות: עוסק שעובד מהבית מפרסם עיר ואימייל בלבד, עד שעורך דין יאמר אחרת.

---

## English

### Accessibility statement

Last updated: {{DATE}}

{{One sentence about the site and who it serves}}

#### Our commitment

{{OPERATOR_NAME}} is committed to making this site accessible to people with disabilities, in line with the Israeli Equal Rights for Persons with Disabilities Law, 1998 and its regulations, and Israeli Standard IS 5568, which is based on WCAG 2.1 level AA. The site was built with the intent to meet this standard, and we keep improving it.

#### Accessibility features

- Semantic headings and landmarks, so a screen reader can navigate the page.
- Full keyboard navigation, a "Skip to content" link and a clear focus indicator on every interactive element.
- Forms with labels linked to their inputs.
- Text alternatives (alt) for images.
- Checked color contrast, and comfortable minimum tap targets on mobile.
- Page language and reading direction set correctly{{ in Hebrew and English, and updated when you switch languages}}.
- Respects the user's system preferences: {{reduced motion, reduced transparency and high contrast}}.
- Works on mobile and with enlarged text.
- {{Captions for videos / transcripts for recordings, if any}}

#### Personal adjustments

The site has no accessibility plugin. You can adjust the display in your browser and operating system: text size and page zoom, high contrast, and the screen reader of your choice.

#### How we tested

We tested with an automated tool (axe-core) and a manual keyboard navigation check, on desktop and mobile. Automated testing doesn't find everything, so some areas may still need work.

#### Supported browsers

The site is intended to work in current versions of the common browsers: Chrome, Firefox, Safari and Edge. We tested it in {{BROWSERS_TESTED}}. For the best experience, use the latest version of your browser.

#### Known limitations

{{What is not accessible or not tested, and the alternative for each}}

#### Accessibility contact

If you run into an accessibility problem on the site, or have a suggestion, we'd like to hear from you. Write to {{EMAIL}}, tell us which page and what didn't work, and we will do our best to handle every request within a reasonable time. You can also ask to receive the site's information in another way.

{{ACCESSIBILITY_COORDINATOR: name, phone, email}}

This site is operated by {{OPERATOR_NAME}} ({{COMPANY_ID}}), {{ADDRESS}}.
