import argon2 from 'argon2';
import { storage } from './storage';
import type { User } from '../shared/schema';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error('Giriş yapmanız gerekiyor');
  }
  return user;
}

export function requireRole(user: AuthUser | null, allowedRoles: string[]): AuthUser {
  const authUser = requireAuth(user);
  if (!allowedRoles.includes(authUser.role)) {
    throw new Error('Bu işlem için yetkiniz bulunmuyor');
  }
  return authUser;
}
