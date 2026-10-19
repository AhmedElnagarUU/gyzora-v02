import mongoose, {type Model, Types} from 'mongoose';

import {getDatabase} from '@/shared/db/mongodb';

import type {NewProject, ProjectDocument, ProjectUpdate} from './types';

const {Schema} = mongoose;

const localizedValueSchema = new Schema(
  {
    en: {type: String, default: ''},
    ar: {type: String, default: ''},
  },
  {_id: false}
);

const imageRefSchema = new Schema(
  {
    key: {type: String, required: true},
    alt: {type: localizedValueSchema, default: () => ({en: '', ar: ''})},
  },
  {_id: false}
);

const metadataSchema = new Schema(
  {
    year: {type: Number},
    areaSqm: {type: Number},
    client: {type: String},
  },
  {_id: false}
);

const projectSchema = new Schema(
  {
    siteId: {type: Schema.Types.ObjectId, required: true},
    slug: {type: String, required: true},
    title: {type: localizedValueSchema, required: true},
    description: {type: localizedValueSchema, required: true},
    category: {type: localizedValueSchema, required: true},
    location: {type: localizedValueSchema, required: true},
    coverImage: {type: imageRefSchema, default: null},
    gallery: {type: [imageRefSchema], default: []},
    metadata: {type: metadataSchema, default: () => ({})},
    featured: {type: Boolean, required: true, default: false},
  },
  {collection: 'projects', timestamps: true, versionKey: false, minimize: false}
);

export const ProjectModel: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument> | undefined) ??
  mongoose.model<ProjectDocument>('Project', projectSchema);

export function toObjectId(value: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;
}

export async function insertProject(project: NewProject): Promise<string> {
  await getDatabase();
  const created = await ProjectModel.create(project);

  return created._id.toString();
}

export async function findProjectsBySiteId(
  siteId: Types.ObjectId
): Promise<ProjectDocument[]> {
  await getDatabase();

  return ProjectModel.find({siteId})
    .sort({featured: -1, createdAt: -1})
    .lean<ProjectDocument[]>()
    .exec();
}

export async function findProjectById(
  siteId: Types.ObjectId,
  id: string
): Promise<ProjectDocument | null> {
  const objectId = toObjectId(id);

  if (!objectId) return null;

  await getDatabase();
  const project = await ProjectModel.findOne({_id: objectId, siteId})
    .lean<ProjectDocument>()
    .exec();

  return project ?? null;
}

export async function projectSlugExists(
  siteId: Types.ObjectId,
  slug: string
): Promise<boolean> {
  await getDatabase();
  const project = await ProjectModel.exists({siteId, slug});

  return project !== null;
}

export async function updateProjectById(
  siteId: Types.ObjectId,
  id: string,
  update: ProjectUpdate
): Promise<ProjectDocument | null> {
  const objectId = toObjectId(id);

  if (!objectId) return null;

  await getDatabase();
  const project = await ProjectModel.findOneAndUpdate(
    {_id: objectId, siteId},
    {$set: update},
    {new: true}
  )
    .lean<ProjectDocument>()
    .exec();

  return project ?? null;
}

export async function deleteProjectById(
  siteId: Types.ObjectId,
  id: string
): Promise<boolean> {
  const objectId = toObjectId(id);

  if (!objectId) return false;

  await getDatabase();
  const result = await ProjectModel.deleteOne({_id: objectId, siteId}).exec();

  return result.deletedCount === 1;
}

export async function countFeaturedProjects(
  siteId: Types.ObjectId,
  exceptId?: Types.ObjectId
): Promise<number> {
  await getDatabase();

  return ProjectModel.countDocuments({
    siteId,
    featured: true,
    ...(exceptId ? {_id: {$ne: exceptId}} : {}),
  }).exec();
}

export async function deleteProjectsBySiteId(siteId: Types.ObjectId): Promise<void> {
  await getDatabase();
  await ProjectModel.deleteMany({siteId}).exec();
}
