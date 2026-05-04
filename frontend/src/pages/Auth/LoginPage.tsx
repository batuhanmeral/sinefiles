import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { AuthShell } from '@/components/auth/AuthShell';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { useAuthStore } from '@/features/auth/authStore';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values.identifier, values.password);
      const target = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(target, { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string } | undefined)?.message
          : null;
      setServerError(message ?? t('auth.errors.unexpected'));
    }
  });

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            {t('auth.register')}
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="identifier">
            {t('auth.identifier')}
          </label>
          <input
            id="identifier"
            autoComplete="username"
            className="input"
            placeholder="mehmet / mehmet@test.dev"
            {...register('identifier')}
          />
          {errors.identifier && <p className="form-error">{t(errors.identifier.message!)}</p>}
        </div>

        <div>
          <label className="label" htmlFor="password">
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && <p className="form-error">{t(errors.password.message!)}</p>}
        </div>

        {serverError && (
          <div className="rounded-md bg-rating-low/10 px-3 py-2 text-sm text-rating-low">
            {serverError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>
    </AuthShell>
  );
}
