# S3 questions for the owner

## Q1 (needs an answer) - `docs/template-engine/README.md` does not exist

The slice's "Read first" lists `docs/template-engine/README.md` for "field validation", but there is no `docs/template-engine/` directory in the repo (same finding as S1, whose questions raised it). Task 2 states the limits explicitly (name 80, category 80, description 600, about 4000, item title 80, address 200, services 12, features 8, plain text, http(s) URLs, lenient email/phone), so S3 is implemented against those numbers and the `SiteData` field names from `sample-data.ts`.

Please either confirm "Task 2 is the field-validation spec" (my assumption) or point me at the real document. Anything it says that differs from Task 2 (e.g. the missing "item description 300" and per-field hints) should be fixed in a follow-up commit.

## Q2 (needs an answer) - the "item description 300" limit has no field in S3

Task 2 lists "item title 80, item description 300", but `SiteData` defines `profile.services`/`profile.features` as plain `LocalizedValue[]` - one text per item, no description. I read the pair as the S4 project item shape (project title + project description) and applied the item limit of 80 to S3's lists. Confirm, or tell me which field the 300 limit is for and I will add it.

## Q3 (needs an answer) - list-item ids are editor-only

Task 1 says "every item in a list needs a stable `id`; add it to the type if missing", while the same slice's "Do NOT" says "accept ids from the client" and `03-DATA-MODEL.md` stores `services`/`features` as `LocalizedValue[]`. I resolved the conflict by keeping the ids **client-side only**: the editor holds `{id, en, ar}` per item (ids from `crypto.randomUUID()`, stable while the page is open, used as React keys and for move/remove), and saves the whole ordered array as `{en, ar}[]` without ids. `model.ts` was therefore not touched, and `updateSiteSchema` actively rejects a client `id`.

Consequence: item identity is not persisted, so ids are regenerated on reload, and a list edit replaces the array (both locales for that list, exactly as loaded) rather than merging per item. Reordering still persists as the new order.

If you want ids persisted instead, that is a small follow-up: add `id` to `LocalizedValue` list items in `types/site.ts` + `model.ts`, generate them server-side in `applyEdit` when missing, and keep rejecting client-supplied ids on write.

## Q4 (approve or replace) - the new Arabic strings

Tabs/checkboxes use endonyms in both catalogs ("English" / "العربية").

- `dashboard.nav.content`: "المحتوى"
- `dashboard.overview.editAction`: "تعديل المحتوى" (was "تعديل البيانات")
- `siteSetup.edit.title`: "محتوى الموقع"; `siteSetup.edit.description`: "اكتب محتوى موقعك بالعربية والإنجليزية. تُحفظ كل لغة على حدة، ولا يغيّر تبديل لسان اللغة نصّك."
- `siteSetup.editor.languageLabel`: "لغة المحتوى"; `siteSetup.editor.missing`: "ناقص"; `siteSetup.editor.optional`: "اختياري"; `siteSetup.editor.counter`: "{count}/{max}"
- `siteSetup.editor.itemLabel`: "العنصر {number}"; `listCount`: "{count} من {max}"; `listEmpty`: "لا توجد عناصر بعد. أضف العنصر الأول."; `limitReached`: "لقد وصلت إلى الحد الأقصى وهو {max} عناصر."
- `siteSetup.editor.languageRequired`: "أبقِ لغة واحدة على الأقل."; `noChanges`: "لم تُجرِ أي تعديل بعد."; `previewHint`: "احفظ تعديلاتك قبل المعاينة."
- `siteSetup.editor.sections`: "بيانات الشركة"، "نبذة عن نشاطك"، "بيانات التواصل"، "الخدمات"، "المزايا"، "لغات الموقع"
- `siteSetup.editor.fields`: "مقدمة صفحة من نحن"، "قصتك"، "ساعات العمل"
- `siteSetup.editor.actions`: "إضافة عنصر"، "إزالة"، "تحريك لأعلى"، "تحريك لأسفل"، "معاينة"
- `siteSetup.validation` (new): `phoneInvalid` "أدخل رقم هاتف صالحًا."، `maxLength` "هذا النص طويل جدًا."، `listTooMany` "عدد العناصر يتجاوز ما تسمح به هذه الخانة."، `languageRequired` "أبقِ لغة واحدة على الأقل."، `invalid` "هذه القيمة غير صالحة."، `emptyEdit` "لا يوجد ما يمكن حفظه."

## Q5 (FYI) - field-error wording depends on the transport

Server-side validation reaches the form in two shapes: zod codes (`too_big`, `invalid_format`, `custom`, ...) from the route's `zodFields`, and message keys (`siteSetup.validation.*`) from the merged "name/category empty in both locales" check. The editor maps both, but that means a payload sent directly to the API shows the generic `errors.field.too_big` wording rather than the field-specific text; the specific text comes from the identical client-side schema check that runs before any request. Unifying this would touch S1's shared `zodFields` - tell me if you want that in S4's slice.

## Still open from earlier slices
- S2-Q1: unknown draft-preview URLs render the not-found UI with HTTP 200 (the dashboard shell streams first). Decision pending.
- S2-Q3: the sample route's language switch still drops the project id.
- S0: the two deleted dev `user` documents still need a name/email or a re-registration to sign in locally.
