export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
}