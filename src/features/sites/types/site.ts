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

export interface SiteDocument {
  ownerUserId: string;
  templateId: string;
  status: 'draft';
  profile: SiteProfile;
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type NewSite = Pick<SiteDocument, 'ownerUserId' | 'templateId' | 'status' | 'profile' | 'content'>;
