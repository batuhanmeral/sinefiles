import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/authStore';

export function ProfileMenu() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="btn-outline hidden sm:inline-flex">
          {t('auth.login')}
        </Link>
        <Link to="/register" className="btn-primary">
          {t('auth.register')}
        </Link>
      </div>
    );
  }

  const initial = (user.displayName || user.username).charAt(0).toUpperCase();

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan
                   font-semibold text-surface ring-2 ring-transparent transition-all
                   hover:ring-accent/50 focus-visible:ring-accent"
        aria-label={t('nav.profileMenu')}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </button>
      <div
        className="invisible absolute right-0 top-full mt-2 w-56 origin-top-right scale-95 opacity-0 transition-all
                   group-hover:visible group-hover:scale-100 group-hover:opacity-100
                   group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        <div className="glass overflow-hidden rounded-xl py-1.5 shadow-card">
          <div className="border-b border-white/5 px-3 py-2">
            <p className="text-sm font-semibold text-ink">{user.displayName ?? user.username}</p>
            <p className="text-xs text-ink-muted">@{user.username}</p>
          </div>
          <Link
            to={`/u/${user.username}`}
            className="block px-3 py-2 text-sm text-ink hover:bg-surface-muted"
          >
            {t('nav.viewProfile')}
          </Link>
          <Link to="/settings" className="block px-3 py-2 text-sm text-ink hover:bg-surface-muted">
            {t('nav.settings')}
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="block w-full px-3 py-2 text-left text-sm text-rating-low hover:bg-surface-muted"
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
