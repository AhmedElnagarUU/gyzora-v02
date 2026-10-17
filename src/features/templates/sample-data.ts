import type {TemplateId, TemplateSiteData} from './types';

export const SAMPLE_SITE_DATA: Record<TemplateId, TemplateSiteData> = {
  'modern-build': {
    profile: {
      companyName: {
        en: 'MODO Modular Architecture',
        ar: 'مودو للعمارة المعيارية والإنشاءات',
      },
      category: {
        en: 'Turnkey Modular Construction & Engineering',
        ar: 'الهندسة المعمارية والإنشاءات المعيارية المتكاملة',
      },
      description: {
        en: 'Pioneering precision-engineered modular buildings, prefabricated architectural systems, and rapid sustainable construction across the Middle East.',
        ar: 'رواد المباني المعيارية عالية الدقة والأنظمة المعمارية مسبقة الصنع والإنشاءات المستدامة السريعة في الشرق الأوسط.',
      },
      contact: {
        email: 'projects@modo-build.com',
        phone: '+966 11 482 9900',
        address: {
          en: '7420 King Fahd Road, Al-Olaya District, Riyadh 12214, Saudi Arabia',
          ar: '٧٤٢٠ طريق الملك فهد، حي العليا، الرياض ١٢٢١٤، المملكة العربية السعودية',
        },
        workingHours: {
          en: 'Sunday – Thursday: 8:00 AM – 6:00 PM',
          ar: 'الأحد – الخميس: ٨:٠٠ ص – ٦:٠٠ م',
        },
      },
      services: [
        {
          en: 'Turnkey Offsite Modular Construction',
          ar: 'الإنشاءات المعيارية متكاملة الحلول مسبقة الصنع',
        },
        {
          en: 'BIM 3D Precision Structural Engineering',
          ar: 'الهندسة الإنشائية ثلاثية الأبعاد ونمذجة معلومات المباني',
        },
        {
          en: 'Architectural Mass Timber & Steel Framing',
          ar: 'الهياكل المعدنية المعمارية والأخشاب المصفحة المتقدمة',
        },
        {
          en: 'High-Performance Insulated Facades & Glazing',
          ar: 'الواجهات والأنظمة الزجاجية عالية العزل الحراري',
        },
        {
          en: 'Rapid On-Site Assembly & Systems Integration',
          ar: 'التركيب السريع بالموقع ودمج الأنظمة الميكانيكية والكهربائية',
        },
      ],
      features: [
        {
          en: '60% Faster Project Delivery',
          ar: 'إنجاز أسرع بنسبة ٦٠٪ مقارنة بالبناء التقليدي',
        },
        {
          en: 'Millimeter-Accurate Factory Prefabrication',
          ar: 'تصنيع مسبق بدقة الملليمتر في بيئة خاضعة للرقابة',
        },
        {
          en: 'Net-Zero Thermal & Acoustic Envelope',
          ar: 'عزل حراري وصوتي فائق لتحقيق معايير الاستدامة',
        },
        {
          en: '10-Year Comprehensive Structural Warranty',
          ar: 'ضمان إنشائي شامل لمدة ١٠ سنوات',
        },
      ],
      languagePreferences: ['en', 'ar'],
    },
    pageCopy: {
      home: {
        introduction: {
          en: 'We build the future of architecture with modular precision, industrial efficiency, and uncompromised design excellence.',
          ar: 'نصنع مستقبل العمارة بدقة معيارية وكفاءة صناعية مع الالتزام بأعلى معايير الإتقان التصميمي.',
        },
        processSteps: [
          {
            en: '01 / Feasibility & Digital BIM Modeling — Comprehensive structural calculations, thermal simulations, and volumetric modular layout.',
            ar: '٠١ / دراسة الجدوى والنمذجة الرقمية — حسابات إنشائية دقيقة ومحاكاة حرارية وتخطيط للموديولات الفراغية.',
          },
          {
            en: '02 / Offsite Precision Fabrication — Factory-controlled welding, lightweight steel framing, MEP pre-installation, and quality audits.',
            ar: '٠٢ / التصنيع المسبق بالمعمل — هياكل معدنية خفيفة ومسبقة التجهيز الكهروميكانيكي واختبارات الجودة الصارمة.',
          },
          {
            en: '03 / Rapid Structural Assembly — Engineered crane hoisting, seismic interlocking, and weather-tight sealing in days.',
            ar: '٠٣ / التركيب الميداني فائق السرعة — تركيب الموديولات بأحدث الرافعات الهندسية وربط الهياكل خلال أيام.',
          },
          {
            en: '04 / Commissioning & Turnkey Handover — Comprehensive acoustic testing, energy certification, and immediate client occupancy.',
            ar: '٠٤ / الفحص النهائي والتسليم المتكامل — اختبارات صوتية وطاقية شاملة واعتماد التراخيص للتسليم الفوري.',
          },
        ],
        callToAction: {
          en: 'Ready to build faster, smarter, and with modular precision?',
          ar: 'هل أنت مستعد للبناء بسرعة أكبر ودقة معيارية فائقة؟',
        },
      },
      about: {
        introduction: {
          en: 'MODO transforms architectural visions into reality using industrial modular technology, cutting construction timelines while elevating craftsmanship.',
          ar: 'تحول مودو الرؤى المعمارية إلى واقع ملموس عبر التكنولوجيا المعيارية، مما يختصر جداول الإنشاء ويرتقي بجودة التنفيذ.',
        },
        story: {
          en: 'Founded by architects and structural engineers, MODO was built to answer the Middle East’s rapid urbanization demands with industrialized construction. By manufacturing up to 85% of building volumes inside our state-of-the-art facilities, we eliminate weather delays, reduce material waste by 70%, and guarantee unmatched architectural precision.',
          ar: 'تأسست مودو على يد نخبة من المعماريين والمهندسين الإنشائيين لتلبية متطلبات النهضة العمرانية السريعة بحلول بناء صناعية. عبر تصنيع حتى ٨٥٪ من حجم المباني داخل منشآتنا الحديثة، نقضي على تأخيرات الموقع ونقلل الهدر بنسبة ٧٠٪ مع ضمان دقة معمارية استثنائية.',
        },
      },
      services: {
        introduction: {
          en: 'End-to-end engineering, manufacturing, and erection services designed for commercial developers, civic authorities, and luxury residential projects.',
          ar: 'خدمات هندسية وتصنيعية وتنفيذية شاملة صممت للمطورين التجاريين والجهات الحكومية والمشاريع السكنية الراقية.',
        },
      },
      projects: {
        introduction: {
          en: 'A showcase of completed modular commercial facilities, pavilions, and sustainable architectural landmarks.',
          ar: 'استعراض لمشاريعنا المنجزة من المنشآت المعيارية التجارية والأجنحة المعمارية والمباني المستدامة.',
        },
      },
      contact: {
        introduction: {
          en: 'Consult with our engineering team on feasibility, modular timelines, and preliminary cost estimates for your upcoming development.',
          ar: 'تواصل مع فريقنا الهندسي لدراسة جدوى مشروعك وجداوله الزمنية وتقديرات التكلفة الأولية.',
        },
      },
    },
    projects: [
      {
        id: 'modo-tech-campus',
        title: {
          en: 'MODO Innovation Campus',
          ar: 'مجمع مودو للابتكار والتقنية',
        },
        category: {
          en: 'Modular Commercial HQ',
          ar: 'مقر تجاري معياري متكامل',
        },
        location: {
          en: 'Riyadh Tech District, KSA',
          ar: 'حي التقنية، الرياض، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '5,400 m²',
          ar: '٥,٤٠٠ م²',
        },
        description: {
          en: 'A four-story modular commercial headquarters engineered with lightweight galvanized steel framing, double-glazed curtain walls, and rooftop solar arrays. Erected on site in just 38 days with zero disruption to neighboring commercial traffic.',
          ar: 'مقر تجاري معياري من ٤ طوابق بهياكل فولاذية مجلفنة وواجهات زجاجية مزدوجة وألواح شمسية مدمجة بالسطح. تم تجميعه وتركيبه في الموقع خلال ٣٨ يومًا فقط دون تعطيل للحركة المحيطة.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'MODO Innovation Campus exterior', ar: 'الواجهة الخارجية لمجمع مودو للابتكار'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Modular facade detail', ar: 'تفاصيل الواجهة المعيارية'},
          },
          {
            src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Interior atrium and workspaces', ar: 'البهو الداخلي ومساحات العمل'},
          },
        ],
      },
      {
        id: 'apex-pavilion',
        title: {
          en: 'Apex Exhibition Pavilion',
          ar: 'جناح أبيكس للمعارض والفعاليات',
        },
        category: {
          en: 'Civic & Cultural Modular',
          ar: 'منشأة مدنية وثقافية معيارية',
        },
        location: {
          en: 'Diriyah Cultural District, KSA',
          ar: 'حي الدرعية الثقافي، المملكة العربية السعودية',
        },
        year: '2024',
        area: {
          en: '1,850 m²',
          ar: '١,٨٥٠ م²',
        },
        description: {
          en: 'An expansive column-free exhibition pavilion featuring cross-laminated timber arches and modular perforated bronze skin. Designed for full demountability and circular reuse.',
          ar: 'جناح معارض مفتوح دون أعمدة وسطية يتميز بأقواس خشبية مصفحة وواجهة نحاسية مخرمة معيارية. صمم لفك وتركيب مستدام يدعم الاقتصاد الدائري.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Apex Exhibition Pavilion', ar: 'جناح أبيكس للمعارض'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Structural assembly process', ar: 'مراحل التركيب الإنشائي'},
          },
        ],
      },
      {
        id: 'salman-park-facility',
        title: {
          en: 'Parkview Modular Medical Hub',
          ar: 'مركز بارك فيو الطبي المعياري',
        },
        category: {
          en: 'Healthcare & Specialized Facility',
          ar: 'مرفق صحي تخصصي سريع الإنجاز',
        },
        location: {
          en: 'King Salman Park, Riyadh, KSA',
          ar: 'حديقة الملك سلمان، الرياض، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '3,200 m²',
          ar: '٣,٢٠٠ م²',
        },
        description: {
          en: 'A state-of-the-art modular outpatient medical center with positive-pressure HEPA filtration zones, acoustic decoupling, and rapid expansion capabilities.',
          ar: 'مركز طبي متطور للمرضى الخارجيين بأنظمة ترشيح هواء عالية الكفاءة وعزل صوتي فائق وإمكانات توسع معيارية سريعة.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Medical hub exterior', ar: 'الواجهة الخارجية للمركز الطبي'},
        },
      },
    ],
  },

  atelier: {
    profile: {
      companyName: {
        en: 'Atelier Vane Architecture',
        ar: 'أتيلييه فان للعمارة والتصميم',
      },
      category: {
        en: 'Bespoke Interior Architecture & Finishing',
        ar: 'العمارة الداخلية الراقية والتشطيبات الفاخرة',
      },
      description: {
        en: 'Crafting soulful, sculptural residences and sensory commercial environments guided by warm materiality, natural light, and editorial restraint.',
        ar: 'تصميم مساحات سكنية وتجارية منحوتة بحس فني يجمع بين دفء المواد الطبيعية والضوء والهدوء المعماري الرفيع.',
      },
      contact: {
        email: 'studio@ateliervane.com',
        phone: '+966 11 210 4455',
        address: {
          en: 'Level 18, Al-Mamlaka Tower, Al-Olaya, Riyadh, Saudi Arabia',
          ar: 'الطابق ١٨، برج المملكة، حي العليا، الرياض، المملكة العربية السعودية',
        },
        workingHours: {
          en: 'Sunday – Thursday: 9:00 AM – 5:30 PM',
          ar: 'الأحد – الخميس: ٩:٠٠ ص – ٥:٣٠ م',
        },
      },
      services: [
        {
          en: 'Luxury Residential Interior Architecture',
          ar: 'العمارة الداخلية للقصور والمساكن الفاخرة',
        },
        {
          en: 'Bespoke Joinery & Custom Furniture Fabrication',
          ar: 'تصنيع أعمال النجارة والأثاث المخصص بأعلى معايير الإتقان',
        },
        {
          en: 'Curated Natural Stone & Plaster Finishing',
          ar: 'توريد وتنفيذ الأحجار الطبيعية والتشطيبات الجيرية الراقية',
        },
        {
          en: 'Architectural Lighting & Acoustic Sculpting',
          ar: 'تصميم الإضاءة المعمارية والمعالجات الصوتية المتطورة',
        },
      ],
      features: [
        {
          en: 'Artisan-Grade Material Palette',
          ar: 'مختارات منتقاة بعناية من الخامات الحرفية النادرة',
        },
        {
          en: 'Sculptural Spatial Planning',
          ar: 'تخطيط فراغي يوازن بين الراحة والأثر الجمالي',
        },
        {
          en: 'Zero-Defect Finishing Standards',
          ar: 'معايير إشراف وتنفيذ لا تقبل التنازل في التفاصيل',
        },
        {
          en: 'Turnkey Procurement & Installation',
          ar: 'إدارة متكاملة للتوريدات والتركيبات الخاصة',
        },
      ],
      languagePreferences: ['en', 'ar'],
    },
    pageCopy: {
      home: {
        introduction: {
          en: 'We approach each project as a tactile composition of volume, light, limestone, and aged timber.',
          ar: 'نتعامل مع كل مشروع كعمل نحتي متناغم يجمع بين الكتل والضوء والحجر الجيري والخشب العتيق.',
        },
        processSteps: [
          {
            en: '01 / Spatial Discovery & Material Curation — Deep dialogue on living habits, sensory preferences, and bespoke mood studies.',
            ar: '٠١ / اكتشاف الفراغ واختيار المواد — حوار معماري معمق حول نمط المعيشة والخيارات الحسية للمواد.',
          },
          {
            en: '02 / Detailed Millwork & Technical Drawing — Precision shop drawings for every joint, reveal, and integrated mechanical fixture.',
            ar: '٠٢ / الرسومات التنفيذية وأعمال النجارة — تفاصيل ملليمترية لكل فاصل ومفصل وعنصر ميكانيكي مدمج.',
          },
          {
            en: '03 / Master Craft Execution — Dedicated artisanal installation of hand-troweled lime plasters and bookmatched stone slabs.',
            ar: '٠٣ / التنفيذ بأيدي أمهر الحرفيين — تركيبات دقيقة للأحجار الطبيعية والتشطيبات الجيرية المنفذة يدوياً.',
          },
          {
            en: '04 / Curated Styling & Handover — Final acoustic balancing, lighting temperature fine-tuning, and curated object placement.',
            ar: '٠٤ / التنسيق النهائي والتسليم — ضبط درجات حرارة الإضاءة والمعايرة الصوتية وتسليم المساحة بالكامل.',
          },
        ],
        callToAction: {
          en: 'Transform your space into a timeless sanctuary.',
          ar: 'حوّل مساحتك الخاصة إلى ملاذ معماري يتحدى الزمن.',
        },
      },
      about: {
        introduction: {
          en: 'Atelier Vane is an international architecture and interior studio dedicated to the craft of poetic space and tactile permanence.',
          ar: 'أتيلييه فان استوديو معماري وتصميمي يكرس ممارسته لإبداع مساحات شاعرية تتميز بالأصالة والخلود.',
        },
        story: {
          en: 'Founded in 2018, Atelier Vane operates at the intersection of architecture, craft, and art curation. Rejecting transient trends, our studio develops enduring spaces defined by authentic natural materials, quiet luxury, and spatial harmony.',
          ar: 'تأسس أتيلييه فان عام ٢٠١٨ ليعمل في ملتقى العمارة والحرفة والفن. برفضنا للصرعات العابرة، نصنع مساحات دائمة الجمال تعتمد على المواد الطبيعية الأصلية والفخامة الهادئة والانسجام الفراغي.',
        },
      },
      services: {
        introduction: {
          en: 'Comprehensive spatial design and finishing services delivered with meticulous attention to detail and personalized attention.',
          ar: 'خدمات شاملة للتصميم الفراغي والتشطيب الراقي تنفذ بعناية فائقة واهتمام خاص بكل عميل.',
        },
      },
      projects: {
        introduction: {
          en: 'Selected private villas, penthouses, and boutique commercial salons designed by Atelier Vane.',
          ar: 'مختارات من الفلل الخاصة وشقق البنتهاوس والصالونات التجارية التي صممها أتيلييه فان.',
        },
      },
      contact: {
        introduction: {
          en: 'We accept a limited number of residential and boutique hospitality commissions each year to preserve intimacy and design focus.',
          ar: 'نستقبل عددًا محدودًا من المشاريع السكنية والتجارية سنويًا لضمان أعلى درجات التركيز والتفرد في التصميم.',
        },
      },
    },
    projects: [
      {
        id: 'palais-penthouse',
        title: {
          en: 'Palais Al-Nakheel Penthouse',
          ar: 'بنتهاوس قصر النخيل',
        },
        category: {
          en: 'Residential Interior Architecture',
          ar: 'عمارة داخلية سكنية فاخرة',
        },
        location: {
          en: 'Al-Nakheel District, Riyadh',
          ar: 'حي النخيل، الرياض',
        },
        year: '2025',
        area: {
          en: '720 m²',
          ar: '٧٢٠ م²',
        },
        description: {
          en: 'A warm minimalist penthouse featuring travertine stone monolithic counters, fluted oak millwork, and full-height pivot doors framing sunset desert vistas.',
          ar: 'بنتهاوس تبسيطي دافئ يتميز بكتل حجر الترافرتين الطبيعي وأعمال خشب البلوط المخدد وأبواب محورية بارتفاع كامل تطل على أفق الرياض الساحر.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Palais Penthouse interior', ar: 'المساحات الداخلية لبنتهاوس قصر النخيل'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Living salon detail', ar: 'تفاصيل صالون المعيشة الرئيسي'},
          },
        ],
      },
      {
        id: 'terracotta-villa',
        title: {
          en: 'Maison Terracotta Villa',
          ar: 'فيلا ميزون تيراكوتا',
        },
        category: {
          en: 'Private Villa Finishing',
          ar: 'تشطيبات فلل خاصة متكاملة',
        },
        location: {
          en: 'Diplomatic Quarter, Riyadh',
          ar: 'حي السفارات، الرياض',
        },
        year: '2024',
        area: {
          en: '1,250 m²',
          ar: '١,٢٥٠ م²',
        },
        description: {
          en: 'An earthy sanctuary composed of hand-applied terracotta plaster, sculpted archways, and a private stone bathing suite open to a sunken garden.',
          ar: 'ملاذ معماري هادئ بجدران طينية منفذة يدوياً وممرات مقوسة منحوتة وجناح استحمام حجري يطل على فناء نباتي خاص.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Maison Terracotta exterior and courtyard', ar: 'الفناء الخارجي لفيلا ميزون تيراكوتا'},
        },
      },
      {
        id: 'artisan-salon',
        title: {
          en: 'The Collector’s Private Gallery',
          ar: 'المعرض الخاص ومجلس الفنون',
        },
        category: {
          en: 'Private Gallery & Salon',
          ar: 'معرض فني ومجلس ضيافة خاص',
        },
        location: {
          en: 'Diriyah, KSA',
          ar: 'الدرعية، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '440 m²',
          ar: '٤٤٠ م²',
        },
        description: {
          en: 'A private salon designed for exhibiting rare sculptures and regional art, illuminated by museum-grade micro-fixtures concealed in dark bronze coves.',
          ar: 'صالون خاص لعرض المنحوتات النادرة والأعمال الفنية، بإضاءة متحفية دقيقة مدمجة في أسقف من البرونز الداكن.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Art gallery space', ar: 'مساحة المعرض الفني'},
        },
      },
    ],
  },

  'urban-estate': {
    profile: {
      companyName: {
        en: 'Crown & Stone Developments',
        ar: 'مجموعة كراون آند ستون العقارية',
      },
      category: {
        en: 'Prime Real Estate & Master Developments',
        ar: 'التطوير العقاري الفاخر والمجتمعات السكنية المتكاملة',
      },
      description: {
        en: 'Developing distinguished residential communities, landmark towers, and private gated estates that define modern Saudi luxury living.',
        ar: 'نطور مجتمعات سكنية متكاملة وأبراجاً مميزة ومجمعات خاصة تعيد تعريف معايير السكن الراقي في المملكة.',
      },
      contact: {
        email: 'invest@crownstone-estates.com',
        phone: '+966 11 800 2200',
        address: {
          en: 'Tower B, King Abdullah Financial District, Riyadh, Saudi Arabia',
          ar: 'البرج ب، مركز الملك عبد الله المالي، الرياض، المملكة العربية السعودية',
        },
        workingHours: {
          en: 'Sunday – Thursday: 8:30 AM – 6:00 PM',
          ar: 'الأحد – الخميس: ٨:٣٠ ص – ٦:٠٠ م',
        },
      },
      services: [
        {
          en: 'Masterplanned Community Development',
          ar: 'تطوير المخططات والمجتمعات السكنية الكبرى',
        },
        {
          en: 'Signature High-Rise Luxury Towers',
          ar: 'تطوير الأبراج السكنية والفندقية الفارهة',
        },
        {
          en: 'Gated Estate Communities & Private Clubs',
          ar: 'المجمعات السكنية المغلقة ونوادي الملاك الحصرية',
        },
        {
          en: 'Institutional Real Estate Asset Management',
          ar: 'إدارة وتنمية الأصول والمحافظ العقارية المؤسسية',
        },
      ],
      features: [
        {
          en: 'SAR 4.8B+ Delivered Portfolio Value',
          ar: 'محفظة مشاريع منفذة تتجاوز ٤.٨ مليار ريال سعودي',
        },
        {
          en: 'Prime Tier-1 Urban Locations',
          ar: 'مواقع استراتيجية في أبرز وأرقى أحياء العاصمة',
        },
        {
          en: 'LEED Gold Sustainability Certification',
          ar: 'شهادات الاستدامة الذهبية المعتمدة للمباني الخضراء',
        },
        {
          en: 'Comprehensive Resident Concierge Ecosystem',
          ar: 'منظومة خدمات فندقية وكونسيرج متكاملة للملاك',
        },
      ],
      languagePreferences: ['en', 'ar'],
    },
    pageCopy: {
      home: {
        introduction: {
          en: 'We shape urban skylines with landmark architecture and create gated residential enclaves that endure for generations.',
          ar: 'نصنع معالم معمارية تضيء أفق المدن ونؤسس مجتمعات سكنية فاخرة تعيش لأجيال متعاقبة.',
        },
        processSteps: [
          {
            en: '01 / Site Acquisition & Masterplanning — Strategic land identification in premier urban corridors and environmental impact modeling.',
            ar: '٠١ / الاستحواذ والتخطيط العام — اختيار أراضٍ استراتيجية وتخطيط مجتمعي بيئي يلبي أعلى المعايير.',
          },
          {
            en: '02 / Architectural Icon Design — Collaborating with world-class engineering consultancies to formulate enduring facades.',
            ar: '٠٢ / التصميم المعماري الأيقوني — التعاون مع بيوت الخبرة العالمية لابتكار واجهات فريدة وتصاميم مميزة.',
          },
          {
            en: '03 / Sustainable Tier-1 Construction — Strict adherence to green building practices and robust seismic/thermal standards.',
            ar: '٠٣ / البناء المستدام عالي الجودة — التزام صارم بأفضل ممارسات البناء المستدام ومقاومة العوامل الجوية.',
          },
          {
            en: '04 / Elite Handover & Lifestyle Concierge — White-glove property handover and seamless transition to long-term estate management.',
            ar: '٠٤ / التسليم الفاخر وإدارة المجمع — تسليم بمعايير فندقية راقية وإدارة مستمرة تضمن نمو قيمة العقار.',
          },
        ],
        callToAction: {
          en: 'Inquire today to secure your residence in our landmark developments.',
          ar: 'تواصل معنا اليوم لحجز وحدتك في أحدث مشاريعنا المتميزة.',
        },
      },
      about: {
        introduction: {
          en: 'Crown & Stone is a premier property development company setting the benchmark for architectural distinction across the Kingdom.',
          ar: 'كراون آند ستون شركة تطوير عقاري رائدة ترسي معايير التميز الهندسي في المملكة.',
        },
        story: {
          en: 'For more than two decades, Crown & Stone has built an impeccable reputation for developing prime estates that blend architectural elegance with enduring capital value. Our developments are designed to enhance resident wellbeing while contributing iconic silhouettes to Saudi Arabia’s urban renaissance.',
          ar: 'على مدار أكثر من عقدين، بنت كراون آند ستون سمعة راسخة في تطوير مشاريع عقارية تجمع بين الرقي المعماري والقيمة الاستثمارية المستدامة، معززة جودة حياة السكان ومواكبة للنهضة العمرانية في المملكة.',
        },
      },
      services: {
        introduction: {
          en: 'Our integrated development capabilities span land acquisition, architectural oversight, construction management, and resident services.',
          ar: 'تشمل قدراتنا التطويرية المتكاملة الاستحواذ على الأراضي والإشراف المعماري وإدارة التشييد وخدمات الملاك.',
        },
      },
      projects: {
        introduction: {
          en: 'Explore our portfolio of premier towers, private residential estates, and luxury communities.',
          ar: 'استكشف محفظتنا من الأبراج السكنية والمجتمعات الخاصة والفلل الفارهة.',
        },
      },
      contact: {
        introduction: {
          en: 'Connect with our private client advisory team to schedule an executive presentation or site visit.',
          ar: 'تواصل مع فريق استشارات كبار العملاء لتنسيق عرض خاص أو زيارة ميدانية لأحد مشاريعنا.',
        },
      },
    },
    projects: [
      {
        id: 'grand-crescent',
        title: {
          en: 'The Grand Crescent Residences',
          ar: 'مساكن الهلال الكبير الفاخرة',
        },
        category: {
          en: 'Masterplanned Luxury Living',
          ar: 'مجتمع سكني متكامل الخدمات',
        },
        location: {
          en: 'North Riyadh Corridor, KSA',
          ar: 'محور شمال الرياض، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '18,500 m²',
          ar: '١٨,٥٠٠ م²',
        },
        description: {
          en: 'A premier masterplanned private estate comprising 42 custom residences centered around a private botanic park, wellness club, and 24/7 security perimeter.',
          ar: 'مجتمع سكني خاص يضم ٤٢ فيلا متميزة تتوسطها حديقة نباتية ونادٍ صحي وخدمات حراسة وكونسيرج على مدار الساعة.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Grand Crescent estate aerial view', ar: 'إطلالة علوية على مساكن الهلال الكبير'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Estate villa front facade', ar: 'الواجهة الرئيسية لفلل المجمع'},
          },
        ],
      },
      {
        id: 'corniche-towers',
        title: {
          en: 'Belgravia Waterfront Towers',
          ar: 'أبراج بيلجرافيا الواجهة البحرية',
        },
        category: {
          en: 'High-Rise Luxury Mixed-Use',
          ar: 'أبراج سكنية وفندقية شاهقة',
        },
        location: {
          en: 'Jeddah Corniche, KSA',
          ar: 'كورنيش جدة، المملكة العربية السعودية',
        },
        year: '2024',
        area: {
          en: '34,000 m²',
          ar: '٣٤,٠٠٠ م²',
        },
        description: {
          en: 'Twin 38-story residential towers directly overlooking the Red Sea, featuring panoramic cantilevered balconies, private marina berths, and infinity sky lounges.',
          ar: 'برجان سكنيان من ٣٨ طابقاً بإطلالة مباشرة على البحر الأحمر، مع شرفات بانورامية معلقة ومراسٍ خاصة لليخوت ومسابح سحابية.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Belgravia Waterfront Towers', ar: 'أبراج بيلجرافيا الواجهة البحرية'},
        },
      },
      {
        id: 'amber-villas',
        title: {
          en: 'The Amber Oasis Villas',
          ar: 'فلل واحة العنبر السكنية',
        },
        category: {
          en: 'Gated Private Enclave',
          ar: 'مجمع فلل مسور حصري',
        },
        location: {
          en: 'Al-Malqa, Riyadh, KSA',
          ar: 'حي الملقا، الرياض، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '9,800 m²',
          ar: '٩,٨٠٠ م²',
        },
        description: {
          en: 'Exclusive private villas featuring natural Riyadh limestone facades, smart biometric home automation, and subterranean wellness suites.',
          ar: 'فلل حصرية بواجهات من حجر الرياض الطبيعي وأنظمة منزل ذكي متطورة وأجنحة صحية خاصة تحت الأرض.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Amber Oasis villa', ar: 'فيلا واحة العنبر'},
        },
      },
    ],
  },

  'interior-calm': {
    profile: {
      companyName: {
        en: 'Søren & Noor Interior Studio',
        ar: 'استوديو سورين ونور للتصميم الداخلي',
      },
      category: {
        en: 'Minimalist Scandinavian & Biophilic Interiors',
        ar: 'التصميم الداخلي الاسكندنافي المعاصر والمساحات الهادئة',
      },
      description: {
        en: 'Creating serene, luminous living spaces inspired by Scandinavian minimalism, organic materials, and gentle natural flow.',
        ar: 'نصنع مساحات سكنية ملهمة ومضيئة تستمد نقاءها من التبسيطية الاسكندنافية والمواد الطبيعية وانسيابية الضوء.',
      },
      contact: {
        email: 'hello@sorennoor.design',
        phone: '+966 11 445 1200',
        address: {
          en: 'Building 4, Riyadh Design Hub, Hittin, Riyadh 13512, Saudi Arabia',
          ar: 'المبنى ٤، واحة الرياض للتصميم، حي حطين، الرياض ١٣٥١٢، المملكة العربية السعودية',
        },
        workingHours: {
          en: 'Sunday – Thursday: 9:00 AM – 5:00 PM',
          ar: 'الأحد – الخميس: ٩:٠٠ ص – ٥:٠٠ م',
        },
      },
      services: [
        {
          en: 'Minimalist Residential Spatial Design',
          ar: 'التصميم الفراغي والسكني بأسلوب التبسيط الدافئ',
        },
        {
          en: 'Biophilic Lighting & Microclimate Planning',
          ar: 'تخطيط الإضاءة الحيوية والمناخ الداخلي المتوازن',
        },
        {
          en: 'Custom Nordic Joinery & Earth Plasters',
          ar: 'أعمال النجارة الاسكندنافية والطلاءات الطبيعية الصديقة للبيئة',
        },
        {
          en: 'Full Furniture Curation & Space Styling',
          ar: 'تأثيث وتنسيق فني شامل لقطع الديكور والأثاث',
        },
      ],
      features: [
        {
          en: '100% Non-Toxic Natural Materials',
          ar: 'مواد طبيعية صديقة للبيئة وخالية تماماً من الانبعاثات الضارة',
        },
        {
          en: 'Acoustic Calm Technology',
          ar: 'عزل ومعالجة صوتية تمنح الفراغ هدوءاً تاماً وراحة استثنائية',
        },
        {
          en: 'Customized Daylighting Strategies',
          ar: 'حلول ذكية لتعظيم الاستفادة من الضوء الطبيعي طوال اليوم',
        },
        {
          en: 'Turnkey Styling & Object Sourcing',
          ar: 'تنسيق متكامل للأثاث والقطع الفنية من دور التصميم العالمية',
        },
      ],
      languagePreferences: ['en', 'ar'],
    },
    pageCopy: {
      home: {
        introduction: {
          en: 'A quieter way of living. We strip away visual noise to uncover the true poetry of space, light, and natural texture.',
          ar: 'طريقة أكثر هدوءاً للعيش. نزيل التشويش البصري لنكشف عن جمال الفراغ والضوء والخامات النقية.',
        },
        processSteps: [
          {
            en: '01 / Lifestyle Immersion — Observing how you move, rest, and interact with light to formulate a bespoke spatial layout.',
            ar: '٠١ / دراسة نمط الحياة — رصد عادات المعيشة والحركة والتفاعل مع الضوء لتشكيل تخطيط مثالي.',
          },
          {
            en: '02 / Natural Material Palette — Selecting muted linens, unstained ash wood, chalky lime washes, and clay ceramics.',
            ar: '٠٢ / لوحة الخامات الطبيعية — اختيار أقمشة الكتان، وأخشاب الدردار النقية، والألوان الجيرية الهادئة.',
          },
          {
            en: '03 / Precise Artisan Execution — Seamless microcement floors, concealed storage, and perfectly aligned architectural shadow gaps.',
            ar: '٠٣ / التنفيذ الحرفي المتقن — أرضيات مايكروسمنت متصلة، وخزائن خفية، وفواصل ظل معمارية دقيقة.',
          },
          {
            en: '04 / Serene Handover — Scent layering, circadian lighting calibration, and handover of your private sanctuary.',
            ar: '٠٤ / التسليم في أبهى صورة — ضبط الإضاءة الحيوية وتوزيع النباتات وتسليم المساحة في أهدأ حالاتها.',
          },
        ],
        callToAction: {
          en: 'Invite calm and clarity into your everyday living environment.',
          ar: 'امنح حياتك اليومية مساحة من السكينة والوضوح.',
        },
      },
      about: {
        introduction: {
          en: 'Søren & Noor combines Nordic design principles with the warmth and hospitality of Middle Eastern domestic rituals.',
          ar: 'يجمع سورين ونور بين مبادئ التصميم النوردي ودفء الضيافة في العمارة الشرقية الأصيلة.',
        },
        story: {
          en: 'Founded as a collaborative studio between Stockholm and Riyadh, Søren & Noor envisions homes as restorative sanctuaries. We believe true luxury is not excess, but the luxury of silence, authentic materials, and rooms bathed in soft daylight.',
          ar: 'تأسس الاستوديو كثمرة تعاون بين ستوكهولم والرياض، لينظر إلى المنازل كملاذات لتجديد الطاقة والسكينة. نؤمن بأن الفخامة الحقيقية لا تعني التكلف، بل هدوء المكان، وأصالة المواد، والضوء الطبيعي المنساب بنعومة.',
        },
      },
      services: {
        introduction: {
          en: 'Refined interior design services crafted for discerning homeowners seeking mindful spatial balance.',
          ar: 'خدمات تصميم داخلي متقنة صممت لمن يبحثون عن التوازن والهدوء والجمال التبسيطي.',
        },
      },
      projects: {
        introduction: {
          en: 'A collection of serene family homes, calm work sanctuaries, and minimalist retreats.',
          ar: 'مجموعة من المنازل الهادئة ومساحات العمل المريحة والملاذات التبسيطية.',
        },
      },
      contact: {
        introduction: {
          en: 'Reach out to discuss your residence with our creative directors in Riyadh or Stockholm.',
          ar: 'تواصل معنا لمناقشة مشروعك مع المديرين الإبداعيين في استوديو الرياض أو ستوكهولم.',
        },
      },
    },
    projects: [
      {
        id: 'sage-residence',
        title: {
          en: 'The Sage & Stone Apartment',
          ar: 'شقة الحجر ودرجات المريمية',
        },
        category: {
          en: 'Residential Spatial Redesign',
          ar: 'إعادة تصميم شقة سكنية متكاملة',
        },
        location: {
          en: 'Al-Safat, Riyadh',
          ar: 'حي الصفاة، الرياض',
        },
        year: '2025',
        area: {
          en: '340 m²',
          ar: '٣٤٠ م²',
        },
        description: {
          en: 'A serene urban apartment featuring sage green microcement walls, raw linen drapery, and integrated solid birch display nooks bathed in morning light.',
          ar: 'شقة حضرية هادئة بجدران مايكروسمنت بدرجات المريمية الناعمة وستائر كتان طبيعية وأرفف مدمجة من خشب القضبان الطبيعي.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Sage residence living room', ar: 'غرفة المعيشة لشقة الحجر والمريمية'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Quiet reading corner', ar: 'ركن القراءة الهادئ'},
          },
        ],
      },
      {
        id: 'earth-courtyard',
        title: {
          en: 'Raw Earth Courtyard Studio',
          ar: 'استوديو الفناء الترابي الطبيعي',
        },
        category: {
          en: 'Minimalist Studio & Atelier',
          ar: 'استوديو ومساحة عمل تبسيطية',
        },
        location: {
          en: 'Al-Malaz Cultural Zone, Riyadh',
          ar: 'حي الملز الثقافي، الرياض',
        },
        year: '2024',
        area: {
          en: '280 m²',
          ar: '٢٨٠ م²',
        },
        description: {
          en: 'A tranquil design workspace organized around a gravel courtyard with native desert flora, clay-plastered walls, and oversized acoustic wool partitions.',
          ar: 'مساحة عمل وتصميم تتمحور حول فناء ترابي بنباتات صحراوية وجدران طينية عازلة وقواطع من الصوف العازل للصوت.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Courtyard studio', ar: 'فناء الاستوديو الهادئ'},
        },
      },
      {
        id: 'nordic-villa',
        title: {
          en: 'The Lightwell Residence',
          ar: 'فيلا بئر النور المعمارية',
        },
        category: {
          en: 'Custom Villa Interior',
          ar: 'تصميم داخلي لفيلا خاصة',
        },
        location: {
          en: 'Hittin, Riyadh',
          ar: 'حي حطين، الرياض',
        },
        year: '2025',
        area: {
          en: '620 m²',
          ar: '٦٢٠ م²',
        },
        description: {
          en: 'An architecturally transformed villa illuminated by a central glazed atrium that channels gentle natural light across two stories of open living areas.',
          ar: 'فيلا خضعت لتحول معماري كامل عبر بهو وسطي زجاجي يوزع الضوء الطبيعي بنعومة على طابقين من مساحات المعيشة المفتوحة.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Lightwell villa interior', ar: 'المساحات الداخلية لفيلا بئر النور'},
        },
      },
    ],
  },

  'craft-studio': {
    profile: {
      companyName: {
        en: 'Forma & Forge Architecture',
        ar: 'فورما آند فورج للعمارة والصناعة',
      },
      category: {
        en: 'Contemporary Architectural Craft & Metal Fabrication',
        ar: 'الممارسة المعمارية المعاصرة وتشكيل المعادن الإنشائية',
      },
      description: {
        en: 'A hybrid architectural practice and fabrication workshop crafting expressive copper facades, cast bronze details, and structural timber joinery.',
        ar: 'ممارسة معمارية وورشة صناعية متطورة تصنع واجهات النحاس الإنشائية وتفاصيل البرونز المسبوك وهياكل الخشب المتشابك.',
      },
      contact: {
        email: 'inquiries@formaforge.arch',
        phone: '+966 11 390 8822',
        address: {
          en: 'Sector 8, Industrial City 2, Riyadh 14331, Saudi Arabia',
          ar: 'القطاع ٨، المدينة الصناعية الثانية، الرياض ١٤٣٣١، المملكة العربية السعودية',
        },
        workingHours: {
          en: 'Saturday – Wednesday: 7:30 AM – 4:30 PM',
          ar: 'السبت – الأربعاء: ٧:٣٠ ص – ٤:٣٠ م',
        },
      },
      services: [
        {
          en: 'Parametric Architectural Metalwork & Copper Skins',
          ar: 'الهياكل المعدنية البارامترية وكسوات النحاس المعمارية',
        },
        {
          en: 'Engineered Heavy Timber & Mass Wood Joinery',
          ar: 'النجارة الإنشائية المتقدمة وهياكل الأخشاب الثقيلة',
        },
        {
          en: 'Bespoke Architectural Hardware & Cast Bronze Fixtures',
          ar: 'تصنيع إكسسوارات الأبواب المعمارية ومسبوكات البرونز الفاخرة',
        },
        {
          en: 'Complex Geometry Facade Engineering & Prototyping',
          ar: 'هندسة ونمذجة الواجهات ذات الهندسة الفراغية المعقدة',
        },
      ],
      features: [
        {
          en: 'In-House 5-Axis CNC & Waterjet Machining',
          ar: 'ورشة تصنيع متطورة بمكائن الخمسة محاور والقطع المائي',
        },
        {
          en: 'Natural Chemical Patination & Aging Labs',
          ar: 'مختبرات متخصصة لأكسدة وتشطيب أسطح المعادن الطبيعية',
        },
        {
          en: 'Full-Scale 1:1 Architectural Mockup Facilities',
          ar: 'قاعات مخصصة لاختبار النماذج المعمارية بالحجم الطبيعي ١:١',
        },
        {
          en: 'Zero-Tolerance Structural Fitting Assurance',
          ar: 'دقة تصنيع وتركيب تخضع لمعايير الجودة الصناعية الصارمة',
        },
      ],
      languagePreferences: ['en', 'ar'],
    },
    pageCopy: {
      home: {
        introduction: {
          en: 'We unite architectural vision with the heavy reality of making. Metal, timber, stone, and fire transformed into timeless building components.',
          ar: 'نجمع بين الرؤية المعمارية وحقيقة الصناعة الصلبة. نحول المعادن والأخشاب والأحجار إلى عناصر معمارية تدوم طويلاً.',
        },
        processSteps: [
          {
            en: '01 / Computational Geometry & Scripting — Developing custom parametric scripts to optimize sheet metal folding and timber connections.',
            ar: '٠١ / الهندسة الحسابية والبرمجة المعمارية — تطوير خوارزميات لتحسين ثني المعادن وربط الأخشاب الإنشائية.',
          },
          {
            en: '02 / Full-Scale 1:1 Physical Prototyping — Building working physical mockups to test joint tolerances, thermal expansion, and patina reaction.',
            ar: '٠٢ / بناء النماذج الأولية بالحجم الكامل — اختبار دقة الفواصل والتمدد الحراري واستجابة الأكسدة السطحية.',
          },
          {
            en: '03 / Precision CNC Workshop Fabrication — Direct-from-model robotic cutting, hand-patinating, and pre-assembly under strict QA.',
            ar: '٠٣ / التصنيع الرقمي والحرفي بالورشة — تشكيل بالروبوت وتشطيب يدوي للأكسدة وتجميع أولي خاضع لضبط الجودة.',
          },
          {
            en: '04 / Site Erection & Architectural Sign-off — Engineered rigging, structural torque verification, and seamless handover.',
            ar: '٠٤ / التركيب بالموقع والاعتماد المعماري — تثبيت إنشائي بأحدث المعدات وفحص عزم الشد وتسليم هندسي متكامل.',
          },
        ],
        callToAction: {
          en: 'Bring true craft and bespoke engineering to your architectural facade.',
          ar: 'أضف أصالة الصنعة الحرفية والهندسة المتقدمة إلى واجهات مشروعك.',
        },
      },
      about: {
        introduction: {
          en: 'Forma & Forge is an architectural practice and experimental workshop dedicated to the honest expression of materials and fabrication.',
          ar: 'فورما آند فورج ممارسة معمارية وورشة تجريبية تكرس جهودها للتعبير الصادق عن المواد وتقنيات التصنيع.',
        },
        story: {
          en: 'Dissatisfied with standard catalog construction, we established Forma & Forge to bring architectural craftsmanship back into the industrial era. Our team of architects, computational designers, and master fabricators works under one roof, bridging digital code and molten metal.',
          ar: 'انطلاقاً من رغبتنا في تجاوز الحلول النمطية الجاهزة، أسسنا فورما آند فورج لإعادة الحرفة المعمارية إلى العصر الصناعي. يعمل فريقنا من المعماريين والمصممين الرقميين والحرفيين تحت سقف واحد ليجمع بين البرمجة وتشكيل المعادن.',
        },
      },
      services: {
        introduction: {
          en: 'Specialized architectural design, parametric facade engineering, and custom metal fabrication.',
          ar: 'خدمات معمارية تخصصية تشمل هندسة الواجهات البارامترية وتصنيع الهياكل المعدنية المخصصة.',
        },
      },
      projects: {
        introduction: {
          en: 'Explore custom copper pavilions, parametric kinetic screens, and bespoke joinery installations.',
          ar: 'استعرض أجنحة النحاس المعماري، والشاشات الحركية البارامترية، والتركيبات الخشبية المبتكرة.',
        },
      },
      contact: {
        introduction: {
          en: 'Visit our fabrication facility or send architectural drawings for technical feasibility and sample fabrication.',
          ar: 'تفضل بزيارة ورشتنا الصناعية أو شاركنا مخططاتك المعمارية لدراسة الجدوى وتصنيع عينات أولية.',
        },
      },
    },
    projects: [
      {
        id: 'copper-monolith',
        title: {
          en: 'The Oxidized Copper Pavilion',
          ar: 'جناح النحاس المؤكسد المعماري',
        },
        category: {
          en: 'Parametric Metal Architecture',
          ar: 'عمارة معدنية بارامترية متقدمة',
        },
        location: {
          en: 'Riyadh Creative Quarter, KSA',
          ar: 'حي الرياض الإبداعي، المملكة العربية السعودية',
        },
        year: '2025',
        area: {
          en: '1,450 m²',
          ar: '١,٤٥٠ م²',
        },
        description: {
          en: 'A sculptural cultural pavilion wrapped in 1,200 unique CNC-folded copper cassettes treated with bespoke sulfur patinas to reflect shifting sunlight across the seasons.',
          ar: 'جناح ثقافي نحتي مغلف بأكثر من ١,٢٠٠ لوح نحاسي مطوي بالتحكم الرقمي ومعالج بأكسدة كبريتية خاصة تتفاعل مع الضوء عبر فصول السنة.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Copper pavilion facade', ar: 'واجهة جناح النحاس المؤكسد'},
        },
        gallery: [
          {
            src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
            alt: {en: 'Architectural drawings and fabrication', ar: 'المخططات المعمارية ومراحل التصنيع'},
          },
        ],
      },
      {
        id: 'timber-joinery-lab',
        title: {
          en: 'Cross-Laminated Timber Joinery Lab',
          ar: 'مختبر أبحاث النجارة الإنشائية المتقدمة',
        },
        category: {
          en: 'Mass Timber Research Facility',
          ar: 'منشأة أبحاث معمارية للأخشاب الثقيلة',
        },
        location: {
          en: 'KAFD, Riyadh, KSA',
          ar: 'مركز الملك عبد الله المالي، الرياض',
        },
        year: '2024',
        area: {
          en: '2,100 m²',
          ar: '٢,١٠٠ م²',
        },
        description: {
          en: 'A high-bay architectural testing facility engineered entirely with glued-laminated spruce beams locked by custom cast bronze tension pins.',
          ar: 'منشأة اختبارات معمارية شاهقة الارتفاع شيدت بالكامل من أخشاب الصنوبر المصفحة المثبتة بمسامير شد من البرونز المصبوب.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Timber joinery structural frame', ar: 'الهيكل الإنشائي للنجارة المتقدمة'},
        },
      },
      {
        id: 'brutalist-bronze-loft',
        title: {
          en: 'Board-Formed Concrete & Bronze House',
          ar: 'مسكن الخرسانة اللوحية والبرونز المعماري',
        },
        category: {
          en: 'Custom Craft Residence',
          ar: 'مسكن مخصص بصناعة يدوية',
        },
        location: {
          en: 'Al-Hada Escarpment, Riyadh',
          ar: 'مطل الهدا، الرياض',
        },
        year: '2025',
        area: {
          en: '890 m²',
          ar: '٨٩٠ م²',
        },
        description: {
          en: 'A cliffside residence combining rough board-marked architectural concrete with custom patinated bronze window envelopes and forged steel balustrades.',
          ar: 'مسكن على حافة الجرف يجمع بين الخرسانة المعمارية المطبوعة بخشب الألواح ونوافذ من البرونز المعتق ودرابزينات فولاذية مشغولة يدوياً.',
        },
        coverImage: {
          src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          alt: {en: 'Concrete and bronze house exterior', ar: 'المظهر الخارجي لمسكن الخرسانة والبرونز'},
        },
      },
    ],
  },
};

export function getSampleSiteData(templateId: TemplateId): TemplateSiteData {
  return SAMPLE_SITE_DATA[templateId] ?? SAMPLE_SITE_DATA['modern-build'];
}
