# SineFiles — Takım Geliştirme Rehberi

Bu dosya, projeye yeni katılan ya da lokalde commit'leri bulunan ekip üyelerinin git workflow'una nasıl uyum sağlayacağını anlatır.

## 1. Tek seferlik kurulum

### SSH key oluştur ve GitHub'a ekle
```bash
ssh-keygen -t ed25519 -C "kendi-email@adresin.com" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```
Çıktıyı kopyala → https://github.com/settings/keys → **New SSH key** → yapıştır → Add.

Test:
```bash
ssh -T git@github.com
```

### Repo'yu SSH ile bağla
Eğer repo zaten klonluysa:
```bash
git remote set-url origin git@github.com:batuhanmeral/sinefiles.git
```
Yeni klonlayacaksan:
```bash
git clone git@github.com:batuhanmeral/sinefiles.git
```

### Git kimliği
```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "kendi-email@adresin.com"
```

## 2. Lokaldeki mevcut commit'leri kurtarma (sadece ilk 2 commit base'inde çalışmış olanlar için)

Eğer lokalde `3f33eb7` üzerine commit attıysan ama `main`'i hiç güncellemediysen:

```bash
# 1. Mevcut işini feature branch'e taşı (henüz push etmeden)
git switch -c feature/<isim>-<konu>     # örn: feature/ahmet-watchlist

# 2. İlk yedek push
git push -u origin feature/<isim>-<konu>

# 3. main'i çek
git switch main
git pull origin main

# 4. Feature branch'i güncel main üzerine rebase et
git switch feature/<isim>-<konu>
git rebase main
# Conflict çıkarsa: dosyaları düzelt → git add <dosya> → git rebase --continue
# Vazgeçmek istersen: git rebase --abort

# 5. Rebase sonrası force-with-lease ile push
git push --force-with-lease
```

> ⚠️ `--force-with-lease` sadece **kendi feature branch'inde** kullanılır. `main`'de ASLA force push yapılmaz (zaten branch protection engelliyor).

## 3. Günlük workflow

### Yeni iş başlatırken
```bash
git switch main
git pull origin main
git switch -c feature/<isim>-<konu>
```

### Çalışırken
- Küçük ve sık commit at
- Commit mesajı formatı:
  - `feat: ...` yeni özellik
  - `fix: ...` bug düzeltmesi
  - `refactor: ...` davranış değişmeden kod düzenleme
  - `style: ...` formatlama
  - `docs: ...` döküman
  - `chore: ...` build/config

### Güncel kalmak için
Uzun süren feature branch'lerde, main'deki yenilikleri almak için:
```bash
git fetch origin
git rebase origin/main
```

### Push ve PR
```bash
git push -u origin feature/<isim>-<konu>
gh pr create --base main --fill   # ya da GitHub UI'dan
```

## 4. PR kuralları

- Base branch: `main`
- En az **1 review** zorunlu (branch protection enforced)
- Reviewer onay verince **Squash and merge** kullan (history temiz kalır)
- Merge sonrası feature branch'i sil:
  ```bash
  git switch main
  git pull
  git branch -d feature/<isim>-<konu>
  git push origin --delete feature/<isim>-<konu>
  ```

## 5. Yasaklar

- ❌ `main`'e direkt commit / push
- ❌ `main`'de force push
- ❌ Başkasının feature branch'inde force push (ön anlaşma olmadan)
- ❌ Token / şifre / `.env` dosyalarını commit etmek
- ❌ Remote URL'ye token gömmek

## 6. Conflict çözümünde

1. `git status` ile çakışan dosyaları gör
2. Editörde `<<<<<<<`, `=======`, `>>>>>>>` işaretlerini düzenle
3. `git add <dosya>`
4. Rebase'deysen: `git rebase --continue`, merge'deysen: `git commit`

Emin değilsen `--abort` ile geri al, takıma sor.
