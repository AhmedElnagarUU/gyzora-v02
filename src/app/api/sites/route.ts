import {NextResponse} from 'next/server';

import {getSession} from '@/features/auth/lib/session';
import {createSite, findSiteByOwnerId} from '@/features/sites/repository';
import {createSiteSchema} from '@/features/sites/schemas/create-site-schema';
import {buildTemplateContent} from '@/features/sites/templates';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const json = await request.json().catch(() => null);

  if (!json) {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  const parsed = createSiteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({error: 'Validation failed'}, {status: 400});
  }

  const existingSite = await findSiteByOwnerId(session.user.id);

  if (existingSite) {
    return NextResponse.json({error: 'Site already exists for this account'}, {status: 409});
  }

  const {templateId} = parsed.data;

  const siteId = await createSite({
    ownerUserId: session.user.id,
    templateId,
    status: 'draft',
    profile: {
      companyName: {
        en: parsed.data.companyName,
        ar: parsed.data.companyName
      },
      category: {
        en: parsed.data.category,
        ar: parsed.data.category
      },
      description: {
        en: parsed.data.description,
        ar: parsed.data.description
      },
      services: [],
      features: [],
      languagePreferences: parsed.data.languagePreferences
    },
    content: buildTemplateContent(templateId, {
      companyName: parsed.data.companyName,
      category: parsed.data.category,
      description: parsed.data.description
    })
  });

  return NextResponse.json({siteId, status: 'draft'}, {status: 201});
}
