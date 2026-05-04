import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Test ortamında hız sınırlandırmasını atlamak için yardımcı fonksiyon
const skipInTest = () => env.NODE_ENV === 'test';

// Kimlik doğrulama rotaları için özel hız sınırlandırıcı
export const authRateLimiter = rateLimit({
  windowMs: 60_000, // 1 dakika (60.000 ms)
  limit: 5, // Dakikada maksimum 5 istek
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    code: 'RATE_LIMIT',
    message: 'Çok fazla deneme. Lütfen bir dakika sonra tekrar deneyin.',
  },
});

// Genel API rotaları için standart hız sınırlandırıcı
export const generalRateLimiter = rateLimit({
  windowMs: 60_000, // 1 dakika (60.000 ms)
  limit: 120, // Dakikada maksimum 120 istek
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: skipInTest,
});
