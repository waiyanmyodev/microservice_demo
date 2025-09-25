export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile extends Omit<IUser, 'isActive'> {
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface ICreateUser {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IUpdateUser {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface IUserQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'username';
  sortOrder?: 'asc' | 'desc';
}