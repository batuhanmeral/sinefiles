# SineFiles

> Sosyal Film/Dizi İnceleme Platformu — TMDB destekli, tam yığın sinema topluluğu.

## Teknoloji Yığını
- **Backend:** Node.js, Express, TypeScript, Prisma (PostgreSQL)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Query
- **Cache & Veri:** Redis, TMDB API
- **Güvenlik:** JWT, bcrypt, Helmet, Zod, rate limiting

## Monorepo Yapısı
```
SineFiles/
├── backend/         # Express API + Prisma
├── frontend/        # Vite + React SPA
├── docker-compose.yml
└── README.md
```

## Hızlı Başlangıç

### 1. Ön gereksinimler
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### 2. Veritabanı ve Redis'i ayağa kaldır
```bash
docker compose up -d
```
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 3. Backend
```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma migrate dev --name init
pnpm dev
```
API: <http://localhost:4000>

### 4. Frontend
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```
Web: <http://localhost:5173>

## Komutlar

### Backend
| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusu (tsx watch) |
| `pnpm build` | TypeScript derleme |
| `pnpm start` | Üretim çalıştırma |
| `pnpm prisma:studio` | Prisma Studio |

### Frontend
| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Üretim build |
| `pnpm preview` | Build önizleme |
