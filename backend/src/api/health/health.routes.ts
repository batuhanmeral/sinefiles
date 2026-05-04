import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { redis } from '../../config/redis.js';

export const healthRouter = Router();

// Temel sağlık kontrolü. Sunucunun çalışıp çalışmadığını gösterir.
healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Detaylı sağlık kontrolü (veritabanı ve Redis bağlantılarının durumunu kontrol eder)
healthRouter.get('/ready', async (_req, res) => {
  const checks: Record<string, 'ok' | 'fail'> = { db: 'fail', redis: 'fail' };

  // Veritabanı bağlantı kontrolü
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = 'ok';
  } catch {
    checks.db = 'fail';
  }

  // Redis bağlantı kontrolü
  try {
    const pong = await redis.ping();
    checks.redis = pong === 'PONG' ? 'ok' : 'fail';
  } catch {
    checks.redis = 'fail';
  }

  // Tüm kontroller başarılıysa 200, aksi takdirde 503 (Service Unavailable) dön
  const allOk = Object.values(checks).every((v) => v === 'ok');
  res.status(allOk ? 200 : 503).json({ status: allOk ? 'ready' : 'degraded', checks });
});
