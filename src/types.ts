export type ModelCategory = 'all' | 'glamour' | 'editorial' | 'beach' | 'streetwear' | 'lifestyle';

export interface ModelPhoto {
  id: string;
  name: string;
  category: ModelCategory;
  imageUrl: string;
  videoUrl?: string;
  duration?: string;
  aspectRatio: '3:4';
  resolution: string;
  location: string;
  views: number;
  downloads: number;
  likes: number;
  tags: string[];
}
