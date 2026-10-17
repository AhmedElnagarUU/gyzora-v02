import {siteSetupSchema, type SiteSetupValues} from './schemas/create-site-schema';

const SITE_SETUP_DRAFT_KEY = 'gyzora.site-setup-draft';

export type SiteSetupDraftSnapshot =
  | {status: 'saved'; values: SiteSetupValues}
  | {status: 'missing' | 'invalid' | 'unavailable'};

const MISSING_DRAFT: SiteSetupDraftSnapshot = {status: 'missing'};
const INVALID_DRAFT: SiteSetupDraftSnapshot = {status: 'invalid'};
const UNAVAILABLE_DRAFT: SiteSetupDraftSnapshot = {status: 'unavailable'};
const listeners = new Set<() => void>();
let cachedStorageValue: string | null | undefined;
let cachedSnapshot: SiteSetupDraftSnapshot = MISSING_DRAFT;

function invalidateSnapshot(): void {
  cachedStorageValue = undefined;
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

export function subscribeToSiteSetupDraft(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSiteSetupDraftSnapshot(): SiteSetupDraftSnapshot {
  if (typeof window === 'undefined') return MISSING_DRAFT;

  let savedDraft: string | null;
  try {
    savedDraft = window.sessionStorage.getItem(SITE_SETUP_DRAFT_KEY);
  } catch {
    return UNAVAILABLE_DRAFT;
  }

  if (savedDraft === cachedStorageValue) return cachedSnapshot;
  cachedStorageValue = savedDraft;

  if (!savedDraft) {
    cachedSnapshot = MISSING_DRAFT;
    return cachedSnapshot;
  }

  let value: unknown;
  try {
    value = JSON.parse(savedDraft);
  } catch {
    cachedSnapshot = INVALID_DRAFT;
    return cachedSnapshot;
  }

  const parsed = siteSetupSchema.safeParse(value);
  cachedSnapshot = parsed.success ? {status: 'saved', values: parsed.data} : INVALID_DRAFT;
  return cachedSnapshot;
}

export function getServerSiteSetupDraftSnapshot(): SiteSetupDraftSnapshot {
  return MISSING_DRAFT;
}

export function saveSiteSetupDraft(values: SiteSetupValues): void {
  window.sessionStorage.setItem(SITE_SETUP_DRAFT_KEY, JSON.stringify(values));
  invalidateSnapshot();
  notifyListeners();
}

export function readSiteSetupDraft(): SiteSetupValues | null {
  const snapshot = getSiteSetupDraftSnapshot();
  return snapshot.status === 'saved' ? snapshot.values : null;
}

export function clearSiteSetupDraft(): void {
  window.sessionStorage.removeItem(SITE_SETUP_DRAFT_KEY);
  invalidateSnapshot();
  notifyListeners();
}
