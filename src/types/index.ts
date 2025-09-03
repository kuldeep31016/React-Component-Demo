// Common types used throughout the application

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonVariant {
  primary: string;
  secondary: string;
  outline: string;
}

export interface SizeVariant {
  sm: string;
  md: string;
  lg: string;
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}
