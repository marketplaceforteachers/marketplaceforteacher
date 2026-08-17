import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, AuthRequest } from './authMiddleware';
import { getDbPool } from './db';

// In-memory fallback user store when MySQL credentials are not yet connected in cPanel
const inMemoryUsers: Array<any> = [
  {
    id: 'usr-super-admin-01',
    email: 'admin@marketplaceforteachers.com',
    name: 'Platform Operations HQ (Super Admin)',
    password_hash: bcrypt.hashSync('TeacherAdmin2025!', 10),
    role: 'admin',
    schoolName: 'Platform Operations HQ',
    district: 'Marketplace For Teachers Admin Network',
    state: 'OK',
    city: 'Oklahoma City',
    zip: '73159',
    verifiedTeacher: true,
    verified: true,
    rating: 5.0,
    reviewCount: 380,
    salesCount: 1420,
    balance: 4250.0,
  },
  {
    id: 'usr-teacher-01',
    email: 'sarah.jenkins@okcps.org',
    name: 'Sarah Jenkins, M.Ed.',
    password_hash: bcrypt.hashSync('Teacher123!', 10),
    role: 'teacher',
    schoolName: 'Westmoore High School',
    district: 'Oklahoma City Public Schools (OKCPS)',
    state: 'OK',
    city: 'Oklahoma City',
    zip: '73159',
    verifiedTeacher: true,
    verified: true,
    rating: 4.98,
    reviewCount: 42,
    salesCount: 68,
    balance: 340.0,
  },
];

export async function handleRegister(req: Request, res: Response) {
  try {
    const { name, email, password, role, schoolName, district, state, city, zip } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === 'admin' ? 'teacher' : role || 'teacher'; // prevent self-assigning admin

    // Try MySQL insertion
    try {
      if (process.env.DB_HOST && process.env.DB_NAME) {
        const pool = getDbPool();
        const uuid = `usr-${Date.now()}`;
        const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (existing && existing.length > 0) {
          return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
        }

        await pool.query(
          `INSERT INTO users (uuid, name, email, password_hash, role, school_name, district, state, city, zip_code, verified_teacher)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuid,
            name,
            cleanEmail,
            passwordHash,
            assignedRole,
            schoolName || '',
            district || '',
            state || 'OK',
            city || 'Oklahoma City',
            zip || '73159',
            cleanEmail.endsWith('.edu') || cleanEmail.endsWith('.org') ? 1 : 0,
          ]
        );

        const token = generateToken({
          id: uuid,
          email: cleanEmail,
          name,
          role: assignedRole,
          verifiedTeacher: cleanEmail.endsWith('.edu') || cleanEmail.endsWith('.org'),
        });

        return res.json({
          success: true,
          token,
          user: {
            id: uuid,
            name,
            email: cleanEmail,
            role: assignedRole,
            schoolName,
            district,
            state: state || 'OK',
            city: city || 'Oklahoma City',
            zip: zip || '73159',
            verifiedTeacher: cleanEmail.endsWith('.edu') || cleanEmail.endsWith('.org'),
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('[Auth DB] MySQL not available, using store:', dbErr.message);
    }

    // Memory fallback
    const exists = inMemoryUsers.find((u) => u.email === cleanEmail);
    if (exists) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      password_hash: passwordHash,
      role: assignedRole,
      schoolName: schoolName || '',
      district: district || '',
      state: state || 'OK',
      city: city || 'Oklahoma City',
      zip: zip || '73159',
      verifiedTeacher: cleanEmail.endsWith('.edu') || cleanEmail.endsWith('.org'),
      verified: true,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      balance: 0,
    };
    inMemoryUsers.push(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      verifiedTeacher: newUser.verifiedTeacher,
    });

    const { password_hash, ...safeUser } = newUser;
    return res.json({ success: true, token, user: safeUser });
  } catch (err: any) {
    console.error('[Auth Register Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to complete registration.' });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check MySQL
    try {
      if (process.env.DB_HOST && process.env.DB_NAME) {
        const pool = getDbPool();
        const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
        if (rows && rows.length > 0) {
          const dbUser = rows[0];
          const isValid = await bcrypt.compare(password, dbUser.password_hash);
          if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid password. Please verify your credentials.' });
          }

          const token = generateToken({
            id: dbUser.uuid || dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            verifiedTeacher: !!dbUser.verified_teacher,
          });

          return res.json({
            success: true,
            token,
            user: {
              id: dbUser.uuid || dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
              schoolName: dbUser.school_name,
              district: dbUser.district,
              state: dbUser.state,
              city: dbUser.city,
              zip: dbUser.zip_code,
              verifiedTeacher: !!dbUser.verified_teacher,
              rating: parseFloat(dbUser.rating) || 5.0,
              reviewCount: dbUser.review_count || 0,
              salesCount: dbUser.sales_count || 0,
              balance: parseFloat(dbUser.balance) || 0,
            },
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('[Auth Login DB Note]', dbErr.message);
    }

    // Memory fallback check
    const user = inMemoryUsers.find((u) => u.email === cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: 'No account found with this email address.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verifiedTeacher: user.verifiedTeacher,
    });

    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, token, user: safeUser });
  } catch (err: any) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to process login.' });
  }
}

export async function handleGetMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated.' });
  }

  return res.json({
    success: true,
    user: req.user,
  });
}
