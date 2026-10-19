import mongoose, {type Model} from 'mongoose';

import type {SiteDocument} from './types/site';

const {Schema} = mongoose;

const localizedValueSchema = new Schema(
  {
    en: {type: String, default: ''},
    ar: {type: String, default: ''},
  },
  {_id: false}
);

const contactSchema = new Schema(
  {
    email: {type: String},
    phone: {type: String},
    address: {type: localizedValueSchema},
    workingHours: {type: localizedValueSchema},
  },
  {_id: false}
);

const profileSchema = new Schema(
  {
    companyName: {type: localizedValueSchema, required: true},
    category: {type: localizedValueSchema, required: true},
    description: {type: localizedValueSchema, required: true},
    logoUrl: {type: String},
    logoKey: {type: String},
    contact: {type: contactSchema},
    services: {type: [localizedValueSchema], default: []},
    features: {type: [localizedValueSchema], default: []},
    languagePreferences: {type: [String], default: []},
  },
  {_id: false}
);

const siteDataSchema = new Schema({profile: {type: profileSchema, required: true}}, {_id: false});

const polarStateSchema = new Schema(
  {
    customerId: {type: String, default: null},
    subscriptionId: {type: String, default: null},
    status: {type: String, required: true},
    currentPeriodEnd: {type: Date, default: null},
    cancelAtPeriodEnd: {type: Boolean, default: false},
    pastDueSince: {type: Date, default: null},
    providerUpdatedAt: {type: Date, default: null},
  },
  {_id: false}
);

const billingSchema = new Schema(
  {
    manualProUntil: {type: Date, default: null},
    polar: {type: polarStateSchema, default: null},
  },
  {_id: false}
);

const siteSchema = new Schema(
  {
    ownerUserId: {type: String, required: true},
    templateId: {type: String, required: true},
    slug: {type: String, required: true},
    slugLocked: {type: Boolean, required: true, default: false},
    status: {type: String, required: true},
    unpublishReason: {type: String, default: null},
    data: {type: siteDataSchema, required: true},
    revision: {type: Number, required: true, default: 0},
    draftUpdatedAt: {type: Date, required: true},
    // S4 replaces this with the published snapshot.
    published: {type: Schema.Types.Mixed, default: null},
    trialStartedAt: {type: Date, default: null},
    billing: {type: billingSchema, required: true},
  },
  {collection: 'sites', timestamps: true, versionKey: false, minimize: false}
);

export const SiteModel: Model<SiteDocument> =
  (mongoose.models.Site as Model<SiteDocument> | undefined) ??
  mongoose.model<SiteDocument>('Site', siteSchema);
