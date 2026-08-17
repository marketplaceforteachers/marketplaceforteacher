import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mft_prod_secret_key_9905_okc_2026';

export interface AuthenticatedUser {
  id: string | number;
  email: string;
  name: string;
  role: 'guest' | 'buyer' | 'teacher' | 'admin';
  verifiedTeacher?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verifiedTeacher: user.verifiedTeacher || false,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.mft_auth_token;

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid token. Please sign in again.' });
  }

  req.user = user;
  next();
}

export function requireRole(allowedRoles: Array<'buyer' | 'teacher' | 'admin'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role as any)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not have sufficient administrator or seller permissions.',
      });
    }

    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Super Administrator authorization required.',
    });
  }
  next();
}
