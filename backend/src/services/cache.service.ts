import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Verilen anahtara göre değeri Redis önbelleğinde arar
// Eğer değer varsa oradan döner, yoksa fetcher fonksiyonunu çalıştırarak
// veriyi kaynağından alır, Redis'e kaydeder ve döner
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    // Önbellekten okumaya çalış
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit) as T; // Bulunursa parse edip dön
  } catch (err) {
    logger.warn({ err, key }, 'Cache okuma hatası, kaynağa düşülüyor');
  }

  // Önbellekte yoksa asıl kaynaktan veriyi çek
  const value = await fetcher();

  try {
    // Kaynaktan alınan veriyi önbelleğe yaz (Süreli olarak - EX)
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    logger.warn({ err, key }, 'Cache yazma hatası');
  }

  return value; // Veriyi dön
}
