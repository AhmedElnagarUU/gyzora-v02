import type {Types} from 'mongoose';

import type {LocalizedValue} from '@/features/sites/types/site';

export interface ImageRef {
  key: string;
  alt: LocalizedValue;
}

export interface ProjectMetadata {
  year?: number;
  areaSqm?: number;
  client?: string;
}

export interface ProjectDocument {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  location: LocalizedValue;
  coverImage: ImageRef | null;
  gallery: ImageRef[];
  metadata: ProjectMetadata;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewProject = Omit<ProjectDocument, '_id' | 'createdAt' | 'updatedAt'>;

export type ProjectUpdate = Pick<
  ProjectDocument,
  'title' | 'description' | 'category' | 'location' | 'coverImage' | 'gallery' | 'metadata' | 'featured'
>;

export interface ProjectView {
  id: string;
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  location: LocalizedValue;
  coverImage: ImageRef | null;
  gallery: ImageRef[];
  metadata: ProjectMetadata;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
