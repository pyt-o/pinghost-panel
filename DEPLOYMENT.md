# Deployment Guide - PingHost Panel na VPS

Kompletna instrukcja wdrożenia panelu hostingowego na własnym serwerze VPS.

## Wymagania Systemowe

### Minimalne Wymagania
- **System**: Ubuntu 22.04 LTS lub nowszy
- **RAM**: 2GB (zalecane 4GB+)
- **CPU**: 2 rdzenie
- **Dysk**: 20GB wolnego miejsca
- **Dostęp**: Root lub sudo

### Wymagane Usługi
- Node.js 22.x
- MySQL 8.0+ lub MariaDB 10.6+
- Nginx (jako reverse proxy)
- PM2 (do zarządzania procesem)
- Certbot (dla SSL)

---

## Krok 1: Przygotowanie Serwera

### 1.1 Aktualizacja Systemu

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalacja Node.js 22

```bash
# Dodaj repozytorium NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Zainstaluj Node.js
sudo apt install -y nodejs

# Sprawdź wersję
node --version  # Powinno pokazać v22.x.x
npm --version
```

### 1.3 Instalacja pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 1.4 Instalacja MySQL

```bash
# Zainstaluj MySQL Server
sudo apt install -y mysql-server

# Uruchom skrypt bezpieczeństwa
sudo mysql_secure_installation

# Zaloguj się do MySQL
sudo mysql
```

W konsoli MySQL:

```sql
-- Utwórz bazę danych
CREATE DATABASE pinghost_panel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utwórz użytkownika
CREATE USER 'pinghost'@'localhost' IDENTIFIED BY 'TWOJE_SILNE_HASLO';

-- Nadaj uprawnienia
GRANT ALL PRIVILEGES ON pinghost_panel.* TO 'pinghost'@'localhost';
FLUSH PRIVILEGES;

-- Wyjdź
EXIT;
```

### 1.5 Instalacja Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.6 Instalacja PM2

```bash
sudo npm install -g pm2
pm2 startup systemd
```

Wykonaj polecenie, które wyświetli PM2.

---

## Krok 2: Deployment Aplikacji

### 2.1 Klonowanie Repozytorium

```bash
# Przejdź do katalogu domowego
cd /home/ubuntu

# Sklonuj repozytorium (zastąp URL swoim repo)
git clone https://github.com/TWOJ_USERNAME/pinghost-panel.git
cd pinghost-panel
```

### 2.2 Instalacja Zależności

```bash
pnpm install
```

### 2.3 Konfiguracja Zmiennych Środowiskowych

Utwórz plik `.env` w głównym katalogu projektu:

```bash
nano .env
```

Dodaj następujące zmienne:

```env
# Database
DATABASE_URL=mysql://pinghost:TWOJE_HASLO@localhost:3306/pinghost_panel

# JWT Secret (wygeneruj losowy string)
JWT_SECRET=wygeneruj_losowy_string_min_32_znaki

# OAuth (jeśli używasz Manus OAuth, w przeciwnym razie skonfiguruj własny)
VITE_APP_ID=twoj_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
OWNER_OPEN_ID=twoj_owner_id
OWNER_NAME=Twoje Imię

# Stripe (opcjonalne, dla płatności)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production
NODE_ENV=production
PORT=3000
```

**Generowanie JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Inicjalizacja Bazy Danych

```bash
pnpm db:push
```

### 2.5 Build Aplikacji

```bash
pnpm build
```

To utworzy folder `dist/` z zbudowaną aplikacją.

---

## Krok 3: Konfiguracja PM2

### 3.1 Utworzenie Pliku Konfiguracyjnego PM2

Utwórz plik `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Dodaj:

```javascript
module.exports = {
  apps: [{
    name: 'pinghost-panel',
    script: './server/_core/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 3.2 Uruchomienie Aplikacji

```bash
# Utwórz katalog na logi
mkdir -p logs

# Uruchom aplikację
pm2 start ecosystem.config.js

# Zapisz konfigurację PM2
pm2 save

# Sprawdź status
pm2 status
pm2 logs pinghost-panel
```

### 3.3 Przydatne Komendy PM2

```bash
# Restart aplikacji
pm2 restart pinghost-panel

# Stop aplikacji
pm2 stop pinghost-panel

# Monitoring
pm2 monit

# Logi
pm2 logs pinghost-panel --lines 100
```

---

## Krok 4: Konfiguracja Nginx

### 4.1 Utworzenie Konfiguracji Nginx

```bash
sudo nano /etc/nginx/sites-available/pinghost-panel
```

Dodaj:

```nginx
server {
    listen 80;
    server_name twoja-domena.com www.twoja-domena.com;

    # Zwiększ limity dla upload plików
    client_max_body_size 50M;

    # Stripe webhook - musi mieć raw body
    location /api/stripe/webhook {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Nie buforuj dla webhook
        proxy_buffering off;
    }

    # API endpoints
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files i SPA routing
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

### 4.2 Aktywacja Konfiguracji

```bash
# Utwórz symlink
sudo ln -s /etc/nginx/sites-available/pinghost-panel /etc/nginx/sites-enabled/

# Usuń domyślną konfigurację
sudo rm /etc/nginx/sites-enabled/default

# Sprawdź konfigurację
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Krok 5: Konfiguracja SSL (Certbot)

### 5.1 Instalacja Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Uzyskanie Certyfikatu SSL

```bash
sudo certbot --nginx -d twoja-domena.com -d www.twoja-domena.com
```

Postępuj zgodnie z instrukcjami. Certbot automatycznie zaktualizuje konfigurację Nginx.

### 5.3 Automatyczne Odnawianie

Certbot automatycznie dodaje cron job. Sprawdź:

```bash
sudo certbot renew --dry-run
```

---

## Krok 6: Konfiguracja Firewall

### 6.1 UFW (Ubuntu Firewall)

```bash
# Włącz firewall
sudo ufw enable

# Zezwól na SSH
sudo ufw allow 22/tcp

# Zezwól na HTTP i HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Sprawdź status
sudo ufw status
```

---

## Krok 7: Konfiguracja Stripe Webhook

### 7.1 Dodanie Webhook Endpoint w Stripe Dashboard

1. Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com)
2. Przejdź do **Developers** → **Webhooks**
3. Kliknij **Add endpoint**
4. URL: `https://twoja-domena.com/api/stripe/webhook`
5. Wybierz eventy:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Skopiuj **Signing secret** (whsec_...)
7. Dodaj go do `.env` jako `STRIPE_WEBHOOK_SECRET`

### 7.2 Restart Aplikacji

```bash
pm2 restart pinghost-panel
```

---

## Krok 8: Monitoring i Utrzymanie

### 8.1 Monitoring Logów

```bash
# Logi aplikacji
pm2 logs pinghost-panel

# Logi Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logi MySQL
sudo tail -f /var/log/mysql/error.log
```

### 8.2 Backup Bazy Danych

Utwórz skrypt backup:

```bash
nano ~/backup-db.sh
```

Dodaj:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

mysqldump -u pinghost -p'TWOJE_HASLO' pinghost_panel | gzip > $BACKUP_DIR/pinghost_panel_$DATE.sql.gz

# Usuń backupy starsze niż 7 dni
find $BACKUP_DIR -name "pinghost_panel_*.sql.gz" -mtime +7 -delete

echo "Backup completed: pinghost_panel_$DATE.sql.gz"
```

Nadaj uprawnienia:

```bash
chmod +x ~/backup-db.sh
```

Dodaj do crontab (codziennie o 2:00):

```bash
crontab -e
```

Dodaj linię:

```
0 2 * * * /home/ubuntu/backup-db.sh >> /home/ubuntu/backup.log 2>&1
```

### 8.3 Aktualizacja Aplikacji

```bash
cd /home/ubuntu/pinghost-panel

# Pobierz najnowszy kod
git pull

# Zainstaluj zależności
pnpm install

# Zaktualizuj bazę danych
pnpm db:push

# Zbuduj aplikację
pnpm build

# Restart
pm2 restart pinghost-panel
```

---

## Krok 9: Bezpieczeństwo

### 9.1 Zabezpieczenie MySQL

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Dodaj/zmień:

```ini
[mysqld]
bind-address = 127.0.0.1
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

### 9.2 Zabezpieczenie SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Zmień:

```
PermitRootLogin no
PasswordAuthentication no  # Jeśli używasz kluczy SSH
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### 9.3 Fail2Ban (Ochrona przed brute-force)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Rozwiązywanie Problemów

### Aplikacja się nie uruchamia

```bash
# Sprawdź logi
pm2 logs pinghost-panel --lines 100

# Sprawdź czy port 3000 jest wolny
sudo netstat -tulpn | grep 3000

# Sprawdź zmienne środowiskowe
pm2 env 0
```

### Błędy bazy danych

```bash
# Sprawdź czy MySQL działa
sudo systemctl status mysql

# Sprawdź połączenie
mysql -u pinghost -p -h localhost pinghost_panel
```

### Nginx zwraca 502 Bad Gateway

```bash
# Sprawdź czy aplikacja działa
pm2 status

# Sprawdź logi Nginx
sudo tail -f /var/log/nginx/error.log

# Sprawdź konfigurację Nginx
sudo nginx -t
```

### Stripe webhook nie działa

```bash
# Sprawdź logi aplikacji
pm2 logs pinghost-panel | grep Webhook

# Sprawdź czy endpoint jest dostępny
curl -X POST https://twoja-domena.com/api/stripe/webhook

# Sprawdź w Stripe Dashboard → Webhooks → Recent events
```

---

## Optymalizacja Wydajności

### 1. Zwiększ limity PM2

```javascript
// ecosystem.config.js
instances: 4,  // Zwiększ liczbę instancji
max_memory_restart: '2G'  // Zwiększ limit pamięci
```

### 2. Włącz Redis dla sesji (opcjonalne)

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
```

### 3. Optymalizacja MySQL

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Dodaj:

```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
```

Restart:

```bash
sudo systemctl restart mysql
```

---

## Checklist Deployment

- [ ] Serwer zaktualizowany (apt update && upgrade)
- [ ] Node.js 22.x zainstalowany
- [ ] MySQL zainstalowany i skonfigurowany
- [ ] Baza danych utworzona
- [ ] Repozytorium sklonowane
- [ ] Zależności zainstalowane (pnpm install)
- [ ] Plik .env skonfigurowany
- [ ] Baza danych zainicjalizowana (pnpm db:push)
- [ ] Aplikacja zbudowana (pnpm build)
- [ ] PM2 skonfigurowany i uruchomiony
- [ ] Nginx skonfigurowany
- [ ] SSL certyfikat zainstalowany
- [ ] Firewall skonfigurowany
- [ ] Stripe webhook skonfigurowany
- [ ] Backup bazy danych skonfigurowany
- [ ] Monitoring działa

---

## Wsparcie

W razie problemów:
- Sprawdź logi: `pm2 logs pinghost-panel`
- Sprawdź status: `pm2 status`
- Sprawdź Nginx: `sudo nginx -t`
- Sprawdź MySQL: `sudo systemctl status mysql`

**Kontakt**: https://help.manus.im

---

**Autor**: Manus AI  
**Data**: Listopad 2024  
**Wersja**: 1.0.0
