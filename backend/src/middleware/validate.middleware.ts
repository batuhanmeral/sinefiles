import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

// Doğrulanacak veri kaynağının türleri
type Source = 'body' | 'query' | 'params';

// Gelen isteğin belirli bir kısmını Zod şeması ile doğrulayan middleware oluşturucu
export const validate =
  (schema: ZodSchema, source: Source = 'body'): RequestHandler =>
    (req, _res, next) => {
      // Şema ile veriyi doğrula ve parse et
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        // Hata varsa bir sonraki middleware'e (genellikle errorHandler) aktar
        next(result.error);
        return;
      }
      // Parse edilmiş veriyi req nesnesine geri yaz (böylece handler'lar tiplenmiş ve dönüştürülmüş veriyi kullanabilir)
      (req as unknown as Record<Source, unknown>)[source] = result.data;
      next();
    };
