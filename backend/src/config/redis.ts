import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Redis istemcisi örneği
export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true, // Bağlantının hemen başlatılmaması için
  maxRetriesPerRequest: 3, // Her istek için maksimum yeniden deneme sayısı
});

// Redis hata ve bağlantı olaylarını logla
redis.on('error', (err) => logger.error({ err }, 'Redis hatası'));
redis.on('connect', () => logger.info('Redis bağlantısı kuruldu'));

// Redis sunucusuna bağlanır (Eğer bağlıysa işlem yapmaz)
export async function connectRedis() {
  if (redis.status === 'ready' || redis.status === 'connecting') return;
  await redis.connect();
}

// Redis bağlantısını güvenli bir şekilde kapatır
export async function disconnectRedis() {
  await redis.quit();
}
