export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: {
    url: string;
    localPath: string;
  };
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  expertise: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  instructor: Instructor;
  price: number;
  rating: number;
  category: string;
  duration: string;
  enrolled: boolean;
  bookmarked: boolean;
}

export interface RandomUser {
  login: { uuid: string };
  name: { first: string; last: string };
  email: string;
  picture: { large: string; medium: string };
  location: { country: string };
}

export interface RandomProduct {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  price: number;
  rating: number;
  category: string;
  brand: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: {
    data: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    nextPage: number | null;
    previousPage: number | null;
    serialNumberStartFrom: number;
  };
  message: string;
  success: boolean;
}

export interface NotificationData {
  courseId?: string;
  type: 'bookmark' | 'reminder' | 'enrollment';
}
