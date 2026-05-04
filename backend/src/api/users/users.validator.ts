import { z } from 'zod';

// Kullanıcı profilini güncelleme işlemi için giriş verisi doğrulama şeması.
// Tüm alanlar opsiyoneldir, sadece gönderilen alanlar güncellenir.
export const updateMeSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  bio: z.string().max(280).optional(),
  language: z.enum(['TR', 'EN']).optional(),
  avatarUrl: z.string().url().optional(),
  email: z.string().email('Geçerli bir e-posta girin').optional(),
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı').max(24).regex(/^[a-z0-9_]+$/, 'Kullanıcı adı sadece küçük harf, rakam ve _ içerebilir').optional(),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı').optional(),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
