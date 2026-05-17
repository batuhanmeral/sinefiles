import { Outlet, Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';
import { ProfileMenu } from './ProfileMenu';

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/discover', key: 'nav.discover' },
  { to: '/lists', key: 'nav.lists' },
  { to: '/feed', key: 'nav.feed' },
] as const;

export function RootLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center font-display text-2xl sm:text-3xl font-black drop-shadow-md transition-transform duration-300 hover:scale-[1.02]">
            <span className="bg-gradient-to-r from-amber-300 via-rose-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.45)]">
              SINE
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-emerald-500 bg-clip-text font-black text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]">
              FILES
            </span>
          </Link>

          <div className="ml-auto flex flex-1 items-center justify-end gap-6">
            <nav className="hidden items-center gap-3 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-bold uppercase transition-colors ${
                      isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>

            <LanguageSwitcher />

            <SearchBar />

            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-ink-dim">
        © {new Date().getFullYear()} SineFiles · {t('footer.tagline')}
      </footer>
    </div>
  );
}
