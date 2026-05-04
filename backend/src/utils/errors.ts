// Uygulama genelinde kullanılacak temel hata sınıfı
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Geçersiz veri gönderildiğinde kullanılır
export class BadRequestError extends AppError {
  constructor(message = 'Geçersiz istek', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

// Kimlik doğrulama başarısız olduğunda veya token eksik olduğunda kullanılır
export class UnauthorizedError extends AppError {
  constructor(message = 'Yetkisiz erişim') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Kullanıcının ilgili işlemi yapmaya yetkisi olmadığında kullanılır
export class ForbiddenError extends AppError {
  constructor(message = 'Bu işlem için yetkiniz yok') {
    super(message, 403, 'FORBIDDEN');
  }
}

// İstenilen kaynak bulunamadığında kullanılır
export class NotFoundError extends AppError {
  constructor(message = 'Kaynak bulunamadı') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Mevcut durumla çakışan bir işlem yapılmak istendiğinde kullanılır
export class ConflictError extends AppError {
  constructor(message = 'Çakışma', details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}
