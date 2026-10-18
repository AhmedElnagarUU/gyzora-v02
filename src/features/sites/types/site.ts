import type {Types} from 'mongoose';

import type {StoredSiteData, TemplateId} from '@/features/templates/types';

export type SiteLocale = 'en' | 'ar';

export interface LocalizedValue {
  en: string;
  ar: string;
}

export interface SiteProfile {
  companyName: LocalizedValue;
  category: LocalizedValue;
  description: LocalizedValue;
  logoUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: LocalizedValue;
    workingHours?: LocalizedValue;
  };
  services: LocalizedValue[];
  features: LocalizedValue[];
  languagePreferences: SiteLocale[];
}

export type SiteStatus = 'draft' | 'published' | 'unpublished';

export type UnpublishReason =
  | 'manual'
  | 'admin'
  | 'trial_expired'
  | 'subscription_ended'
  | 'payment_failed';

export interface PolarState {
  customerId: string | null;
  subscriptionId: string | null;
  status: 'active' | 'past_due' | 'canceled' | 'ended';
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  pastDueSince: Date | null;
  providerUpdatedAt: Date | null;
}

export interface SiteBilling {
  manualProUntil: Date | null;
  polar: PolarState | null;
}

export interface SiteDocument {
  _id: Types.ObjectId;
  ownerUserId: string;
  templateId: TemplateId;
  slug: string;
  slugLocked: boolean;
  status: SiteStatus;
  unpublishReason: UnpublishReason | null;
  data: StoredSiteData;
  revision: number;
  draftUpdatedAt: Date;
  published: null;
  trialStartedAt: Date | null;
  billing: SiteBilling;
  createdAt: Date;
  updatedAt: Date;
}

export type NewSite = Omit<SiteDocument, '_id' | 'createdAt' | 'updatedAt'>;
