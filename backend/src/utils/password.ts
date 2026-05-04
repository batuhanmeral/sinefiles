import bcrypt from 'bcrypt';

// Şifre hashleme algoritması için işlem maliyeti (cost factor)
const COST = 10;

// Düz metin halindeki şifreyi bcrypt kullanarak hashler.
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

// Düz metin şifrenin, veritabanındaki hashlenmiş şifre ile eşleşip eşleşmediğini kontrol eder
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
