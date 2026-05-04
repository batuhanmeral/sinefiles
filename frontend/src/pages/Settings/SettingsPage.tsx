import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/authStore';
import type { Language } from '@/types/auth';

const LANG_TO_I18N: Record<Language, 'tr' | 'en'> = { TR: 'tr', EN: 'en' };
const I18N_TO_LANG: Record<'tr' | 'en', Language> = { tr: 'TR', en: 'EN' };

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLanguageChange = async (code: 'tr' | 'en') => {
    setError(null);
    setSaving(true);
    const previous = i18n.resolvedLanguage as 'tr' | 'en' | undefined;
    try {
      // UI'yi anında çevir
      await i18n.changeLanguage(code);
      // Sunucuyla senkronize
      await updateProfile({ language: I18N_TO_LANG[code] });
    } catch (err) {
      // Geri al
      if (previous) await i18n.changeLanguage(previous);
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string } | undefined)?.message
          : null;
      setError(message ?? t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('settings.subtitle')}</p>
      </header>

      <section className="card">
        <h2 className="text-base font-semibold text-ink">{t('settings.account')}</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const input = Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== '')
            ) as any;

            setSaving(true);
            setError(null);
            try {
              await updateProfile(input);
              const pwdInput = document.getElementById('password') as HTMLInputElement;
              if (pwdInput) pwdInput.value = '';
              alert('Profil güncellendi');
            } catch (err) {
              let message = t('settings.saveError');
              if (err instanceof AxiosError && err.response?.data) {
                const resData = err.response.data as any;
                if (resData.code === 'VALIDATION_ERROR' && resData.details?.fieldErrors) {
                  const fields = Object.values(resData.details.fieldErrors).flat();
                  if (fields.length > 0) message = fields.join(', ');
                } else if (resData.message) {
                  message = resData.message;
                }
              }
              setError(message);
            } finally {
              setSaving(false);
            }
          }}
        >
          <div>
            <label className="label" htmlFor="email">{t('auth.email')}</label>
            <input className="input" id="email" name="email" type="email" defaultValue={user?.email} />
          </div>
          <div>
            <label className="label" htmlFor="username">{t('auth.username')}</label>
            <input className="input" id="username" name="username" defaultValue={user?.username} />
          </div>
          <div>
            <label className="label" htmlFor="displayName">{t('auth.displayName')}</label>
            <input className="input" id="displayName" name="displayName" defaultValue={user?.displayName || ''} />
          </div>
          <div>
            <label className="label" htmlFor="password">{t('auth.password')}</label>
            <input className="input" id="password" name="password" type="password" placeholder="Yeni şifre (opsiyonel)" />
          </div>
          <button className="btn-primary" type="submit" disabled={saving}>
            Bilgileri Güncelle
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="text-base font-semibold text-ink">{t('settings.language')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('settings.languageHelp')}</p>
        <div className="mt-3 flex gap-2">
          {(['tr', 'en'] as const).map((code) => {
            const active = i18n.resolvedLanguage === code;
            const persisted = user && LANG_TO_I18N[user.language] === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => void onLanguageChange(code)}
                disabled={saving || active}
                className={active ? 'btn-primary' : 'btn-outline'}
              >
                {code.toUpperCase()}
                {persisted && (
                  <span className="ml-1 text-[10px] font-bold uppercase text-accent">●</span>
                )}
              </button>
            );
          })}
          {saving && (
            <span className="self-center text-xs text-ink-muted">{t('settings.saving')}</span>
          )}
        </div>
        {error && <p className="form-error mt-2">{error}</p>}
      </section>
    </div>
  );
}
