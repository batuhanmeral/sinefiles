import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// 404 Not Found durumları için middleware
// Eşleşmeyen bir route'a istek atıldığında çalışır
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}`,
  });
};

// Genel hata yakalama middleware
// Uygulamanın herhangi bir yerinde fırlatılan hataları yakalar ve uygun HTTP formatında döner
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod şema doğrulama hataları
  if (err instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Doğrulama hatası',
      details: err.flatten(),
    });
    return;
  }

  // Özel uygulama hataları (AppError tabanlı)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  // Beklenmeyen sistem hataları
  logger.error({ err }, 'Beklenmeyen hata');
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Sunucu hatası',
  });
};
