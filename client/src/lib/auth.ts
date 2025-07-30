export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
}
