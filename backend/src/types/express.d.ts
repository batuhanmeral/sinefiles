import type { AccessTokenPayload } from '../utils/jwt.js';

// Express'in global tiplerini genişletiyoruz.
declare global {
  namespace Express {
    // Request arayüzüne auth özelliği ekle
    interface Request {
      auth?: AccessTokenPayload;
    }
  }
}

export { };
