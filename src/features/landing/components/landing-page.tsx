import {useTranslations} from 'next-intl';

const featureIds = ['presence', 'portfolio', 'publishing'] as const;
const stepIds = ['details', 'projects', 'publish'] as const;
const industryIds = ['realEstate', 'construction', 'interiors', 'consulting'] as const;
const faqIds = ['website', 'languages', 'publishing'] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="text-sm font-semibold uppercase text-emerald-700 ltr:tracking-[0.18em] rtl:tracking-normal">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export function LandingPage() {
  const t = useTranslations('landing.page');

  return (
    <div className="overflow-hidden bg-white text-slate-950">
      <section
        id="home"
        className="scroll-mt-32 bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
              <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
              {t('hero.eyebrow')}
            </p>
            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {t('hero.title')}
              <span className="mt-1 block text-emerald-700">{t('hero.accent')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {t('hero.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                {t('hero.primaryAction')}
                <span aria-hidden="true" className="rtl:rotate-180">→</span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                {t('hero.secondaryAction')}
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-500">{t('hero.note')}</p>
          </div>

          <figure className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/70 via-cyan-100/60 to-amber-100/80 blur-2xl"
            />
            <div className="relative rounded-3xl border border-white bg-white p-3 shadow-2xl shadow-emerald-950/10 sm:p-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      {t('preview.workspace')}
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800 sm:text-xs">
                    {t('preview.sample')}
                  </span>
                </div>
                <div className="grid min-h-80 sm:grid-cols-[0.72fr_1.8fr]">
                  <div className="hidden flex-col gap-3 border-e border-slate-200 bg-white p-4 sm:flex">
                    <span className="mb-2 text-xs font-semibold text-slate-500">
                      {t('preview.menu')}
                    </span>
                    <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                      {t('preview.home')}
                    </span>
                    <span className="px-3 py-2 text-xs text-slate-500">{t('preview.services')}</span>
                    <span className="px-3 py-2 text-xs text-slate-500">{t('preview.projects')}</span>
                    <span className="px-3 py-2 text-xs text-slate-500">{t('preview.contact')}</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-700 p-5 text-white sm:p-7">
                      <p className="text-xs font-medium text-emerald-100">{t('preview.siteLabel')}</p>
                      <p className="mt-3 text-xl font-semibold sm:text-2xl">{t('preview.company')}</p>
                      <p className="mt-2 max-w-xs text-xs leading-5 text-emerald-50 sm:text-sm">
                        {t('preview.tagline')}
                      </p>
                      <span className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-medium sm:text-xs">
                        {t('preview.action')}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">{t('preview.projectsTitle')}</p>
                      <span className="text-xs font-medium text-emerald-700">{t('preview.viewAll')}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div aria-hidden="true" className="h-16 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 sm:h-20" />
                        <p className="truncate px-3 py-2 text-[11px] font-medium text-slate-700 sm:text-xs">
                          {t('preview.projectOne')}
                        </p>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div aria-hidden="true" className="h-16 bg-gradient-to-br from-cyan-100 via-sky-100 to-indigo-100 sm:h-20" />
                        <p className="truncate px-3 py-2 text-[11px] font-medium text-slate-700 sm:text-xs">
                          {t('preview.projectTwo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="sr-only">{t('preview.caption')}</figcaption>
          </figure>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t('features.eyebrow')}
            title={t('features.title')}
            description={t('features.description')}
            centered
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {featureIds.map((feature, index) => (
              <article
                key={feature}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-800">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {t(`features.items.${feature}.title`)}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {t(`features.items.${feature}.description`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t('steps.eyebrow')}
            title={t('steps.title')}
            description={t('steps.description')}
            centered
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {stepIds.map((step, index) => (
              <li key={step} className="relative rounded-3xl bg-white p-7 ring-1 ring-slate-200">
                <span className="text-sm font-semibold text-emerald-700">
                  {t('steps.number', {number: index + 1})}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {t(`steps.items.${step}.title`)}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {t(`steps.items.${step}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="industries" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow={t('industries.eyebrow')}
            title={t('industries.title')}
            description={t('industries.description')}
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {industryIds.map((industry) => (
              <li
                key={industry}
                className="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">
                  {t(`industries.items.${industry}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 bg-emerald-50/70 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow={t('faq.eyebrow')}
            title={t('faq.title')}
            description={t('faq.description')}
          />
          <div className="space-y-3">
            {faqIds.map((item) => (
              <details key={item} className="group rounded-2xl border border-emerald-100 bg-white p-5 open:shadow-sm">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                  <span className="flex items-center justify-between gap-4">
                    {t(`faq.items.${item}.question`)}
                    <span aria-hidden="true" className="text-xl font-normal text-emerald-700 group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-slate-600">
                  {t(`faq.items.${item}.answer`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-8 text-white shadow-xl shadow-emerald-900/10 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-emerald-100 ltr:tracking-[0.18em] rtl:tracking-normal">
              {t('closing.eyebrow')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t('closing.title')}
            </h2>
            <p className="mt-4 leading-7 text-emerald-50">{t('closing.description')}</p>
          </div>
          <a
            href="#how-it-works"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800"
          >
            {t('closing.action')}
            <span aria-hidden="true" className="rtl:rotate-180">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
