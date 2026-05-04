import { Router, type RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { NotFoundError, UnauthorizedError, ConflictError } from '../../utils/errors.js';
import { updateMeSchema } from './users.validator.js';

export const usersRouter = Router();

// Oturum açmış kullanıcının kendi profil bilgilerini getirir
const getMe: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new UnauthorizedError();
    const user = await prisma.user.findUnique({
      where: { id: req.auth.sub },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundError();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Oturum açmış kullanıcının kendi profil bilgilerini günceller
const updateMe: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new UnauthorizedError();
    const data = { ...req.body };
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 12);
      delete data.password;
    }
    const updated = await prisma.user.update({
      where: { id: req.auth.sub },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(updated);
  } catch (err: any) {
    if (err.code === 'P2002') {
      next(new ConflictError('Bu e-posta veya kullanıcı adı zaten kullanımda.'));
      return;
    }
    next(err);
  }
};

// Kullanıcı adına göre belirli bir kullanıcının herkese açık profilini ve istatistiklerini getirir
const getByUsername: RequestHandler = async (req, res, next) => {
  try {
    const username = (req.params.username ?? '').toLowerCase();
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { reviews: true, followers: true, following: true } },
      },
    });
    if (!user) throw new NotFoundError('Kullanıcı bulunamadı');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

usersRouter.get('/me', requireAuth, getMe);
usersRouter.patch('/me', requireAuth, validate(updateMeSchema), updateMe);
usersRouter.get('/:username', getByUsername);
