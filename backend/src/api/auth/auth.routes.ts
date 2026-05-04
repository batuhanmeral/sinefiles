import { Router } from 'express';
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { loginSchema, refreshSchema, registerSchema } from './auth.validator.js';

export const authRouter = Router();

// Kayıt olma endpoint'i. Doğrulama ve rate limit (hız sınırlandırması) içerir.
authRouter.post('/register', authRateLimiter, validate(registerSchema), registerHandler);

// Giriş yapma endpoint'i. Doğrulama ve rate limit içerir.
authRouter.post('/login', authRateLimiter, validate(loginSchema), loginHandler);

// Token yenileme endpoint'i. Sadece veri doğrulaması (refreshSchema) içerir.
authRouter.post('/refresh', validate(refreshSchema), refreshHandler);

// Çıkış yapma endpoint'i.
authRouter.post('/logout', logoutHandler);
