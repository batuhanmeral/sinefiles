export interface ReviewUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  rating: number;
  body: string | null;
  containsSpoiler: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface ReviewPage {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Review[];
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  body: string;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export type ReviewSort = 'newest' | 'popular';
