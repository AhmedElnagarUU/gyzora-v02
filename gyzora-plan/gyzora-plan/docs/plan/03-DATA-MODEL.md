# 03 - Data model

Raw MongoDB driver collections. Types live in each feature's `types.ts`. `Localized = { en: string; ar: string }` (empty string = missing).

## sites (S1; extended S3-S5, S8)
```ts
interface SiteDoc {
  _id: ObjectId;
  ownerUserId: string;                 // from session only. UNIQUE index
  templateId: TemplateId;              // validated against catalog
  slug: string;                        // UNIQUE, 3-40 chars, [a-z0-9-], generated in S1
  slugLocked: boolean;                 // true after first successful publish
  status: 'draft' | 'published' | 'unpublished';
  unpublishReason: null | 'manual' | 'admin' | 'trial_expired' | 'subscription_ended' | 'payment_failed';
  data: StoredSiteData;                // = SiteData (renderer contract) WITHOUT projects
  revision: number;                    // +1 on every draft save (optimistic concurrency)
  draftUpdatedAt: Date;                // bumped by site AND project writes
  published: PublishedSnapshot | null;
  trialStartedAt: Date | null;         // set once at first publish (never reset)
  billing: { manualProUntil: Date | null; polar: PolarState | null };
  createdAt: Date; updatedAt: Date;
}
interface PolarState {
  customerId: string | null; subscriptionId: string | null;
  status: 'active' | 'past_due' | 'canceled' | 'ended';
  currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean;
  pastDueSince: Date | null; providerUpdatedAt: Date | null;
}
interface PublishedSnapshot {
  templateId: TemplateId; slug: string; locales: ('en'|'ar')[];
  data: StoredSiteData; projects: ProjectSnapshot[]; imageKeys: string[];
  publishedAt: Date; sourceRevision: number;
}
```
`SiteData` = the exact shape consumed by the renderer and produced in `src/features/templates/sample-data.ts` (`SAMPLE_SITE_DATA`). If it is not exported as a named type from `templates/types.ts`, S1 exports it WITHOUT changing the shape. `StoredSiteData = Omit<SiteData, 'projects'>`. Projects are merged at render time from the `projects` collection (draft) or the snapshot (published).
Legacy fields `profile` and `content` are removed in S1 (dev data is wiped by the owner; no migration code).

## projects (S4)
```ts
interface ProjectDoc {
  _id: ObjectId; siteId: ObjectId;     // siteId is derived server-side from the session's site
  slug: string;                        // unique per site; stable route id for Project Details
  title: Localized; description: Localized; category: Localized; location: Localized;
  coverImage: ImageRef | null; gallery: ImageRef[];      // max 12
  metadata: { year?: number; areaSqm?: number; client?: string };
  featured: boolean;                   // max 6 featured per site
  createdAt: Date; updatedAt: Date;
}
interface ImageRef { key: string; alt: Localized }
type ProjectSnapshot = Omit<ProjectDoc, '_id' | 'siteId'>;
```
Order in lists/pages: `featured desc, createdAt desc` (manual reordering is out of scope).

## feedback (S6)
`{ _id, userId: string|null, email: string, type: 'suggestion'|'bug'|'question'|'other', message: string (10-2000), canContact: boolean, path: string, locale: 'en'|'ar', status: 'new'|'reviewed', createdAt }`

## auditLog (S6)
`{ _id, actorUserId, action: string, targetUserId?: string, targetSiteId?: string, details?: object (no secrets), createdAt }`

## paymentRequests (S9)
`{ _id, userId, siteId, method: 'vodafone_cash'|'etisalat_cash'|'orange_cash'|'instapay'|'other', amountEgp: number, senderWallet: string, reference?: string, receiptKey: string, status: 'pending'|'approved'|'rejected', rejectionReason?: string, reviewedBy?: string, reviewedAt?: Date, grantedUntil?: Date, createdAt }`

## rateLimits (S6)
`{ _id: string (key), count: number, expiresAt: Date }` with TTL index on `expiresAt`.

## Indexes (created by `shared/db/indexes.ts`, called once lazily from `getDatabase()`)
| Collection | Index | Slice |
|---|---|---|
| sites | `{ownerUserId:1}` unique | S0 |
| sites | `{slug:1}` unique | S1 |
| sites | `{status:1}` | S5 |
| projects | `{siteId:1, slug:1}` unique; `{siteId:1, featured:-1, createdAt:-1}` | S4 |
| feedback | `{status:1, createdAt:-1}` | S6 |
| auditLog | `{createdAt:-1}` | S6 |
| paymentRequests | `{status:1, createdAt:-1}`; `{userId:1}` | S9 |
| rateLimits | `{expiresAt:1}` TTL (expireAfterSeconds: 0) | S6 |
If creating a unique index fails because of existing duplicates, throw a clear error telling the owner to clean the dev DB. Never swallow it.

## Invariants (must be tested)
1. At most one site per `ownerUserId`, even under concurrent creation (index + catching duplicate-key error 11000; no check-then-insert).
2. Every project query includes `siteId` from the session's site.
3. Editing draft never changes `published`.
4. `trialStartedAt` is written once.
5. `published` is replaced atomically; failure keeps the previous value.
6. Public rendering reads only `published`.
