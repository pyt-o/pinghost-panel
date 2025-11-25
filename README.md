# PingHost Panel - Kompletny Panel Hostingowy

Kompletny, nowoczesny panel hostingowy do zarządzania serwerami gier i instancjami VPS. Zbudowany z wykorzystaniem React, TypeScript, tRPC i Tailwind CSS.

![PingHost Panel](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Funkcjonalności

### 🎯 Podstawowe Funkcje

- **Zarządzanie Użytkownikami** - Pełny system uwierzytelniania i autoryzacji.
- **Zarządzanie Serwerami** - Tworzenie, uruchamianie, zatrzymywanie, restartowanie i usuwanie serwerów gier.
- **Zarządzanie Nodami** - Zarządzanie fizycznymi/wirtualnymi nodami hostującymi serwery.
- **System Pakietów** - Predefiniowane konfiguracje serwerów z alokacją zasobów.
- **System Kredytów** - Wirtualna waluta do płatności za usługi.
- **Integracja Płatności** - Integracja Stripe do zakupu kredytów.
- **Tickety Wsparcia** - Wbudowany system ticketów do obsługi klienta.
- **Logi Aktywności** - Kompleksowy dziennik audytu dla wszystkich działań.

### ✨ Nowe Funkcje (v2.0)

- **System Eggs (Szablony Serwerów)** - Definiowanie i wybór szablonów serwerów (np. Minecraft, CS:GO, VPS) przy tworzeniu.
- **Marketplace Dodatków** - Instalacja pluginów/modów na serwerach z systemem kategorii, filtrowania i **Ocen/Recenzji**.
- **AI Chatbot** - Asystent AI z kontekstem hostingu i możliwością **Eskalacji do Ticketu Wsparcia**.
- **Konsola Serwera (Real-time)** - Interaktywna konsola serwera w czasie rzeczywistym.
- **Menedżer Plików** - Graficzny interfejs do zarządzania plikami serwera.
- **Backupy i Restore** - System tworzenia i przywracania kopii zapasowych.
- **Automatyczne Odnawianie** - Opcja automatycznego odnawiania serwera.
- **Uwierzytelnianie Dwuskładnikowe (2FA)** - Zwiększone bezpieczeństwo konta.

### 👨‍💼 Panel Administratora

- **Zaawansowany Dashboard** - Statystyki systemowe, w tym **Całkowity Przychód, Średni Uptime i Zużycie Dysku**.
- **Zarządzanie Użytkownikami** - Kredyty, role, uprawnienia.
- **Zarządzanie Administratorami** - Dodawanie i usuwanie administratorów.
- **Zarządzanie Nodami** - CRUD, monitorowanie zasobów.
- **Zarządzanie Pakietami** - Ceny, zasoby.
- **Zarządzanie Serwerami** - Nadzór nad wszystkimi serwerami użytkowników.
- **Zarządzanie Ticketami** - Obsługa ticketów.
- **Zarządzanie Eggs i Marketplace** - Pełna kontrola nad szablonami serwerów i elementami Marketplace.
- **Logi Aktywności** - Dziennik audytu.

### 👤 Panel Użytkownika

- Osobisty dashboard z przeglądem serwerów.
- Pełne zarządzanie serwerami (tworzenie, kontrola, usuwanie).
- Dostęp do Konsoli i Menedżera Plików.
- Saldo kredytów i historia transakcji.
- System ticketów wsparcia.
- Integracja płatności.
- Ustawienia konta z 2FA.

## Stos Technologiczny

### Frontend
- **React 19** - Framework UI.
- **TypeScript** - Bezpieczeństwo typów.
- **Tailwind CSS 4** - Stylizacja.
- **tRPC** - End-to-end typowane API.
- **Wouter** - Lekki routing.
- **shadcn/ui** - Biblioteka komponentów.

### Backend
- **Node.js** - Środowisko uruchomieniowe.
- **Express 4** - Framework webowy.
- **tRPC 11** - Warstwa API.
- **Drizzle ORM** - Toolkit bazodanowy.
- **MySQL/TiDB** - Baza danych.
- **Stripe** - Obsługa płatności.
- **WebSocket** - Dla konsoli serwera (Real-time).

## Instalacja

Szczegółowa instrukcja instalacji i konfiguracji znajduje się w pliku **[INSTALLATION_GUIDE.pdf](./docs/INSTALLATION_GUIDE.pdf)**.

### Wymagania Wstępne

- Node.js 22+
- MySQL lub TiDB
- Konto Stripe (dla płatności)

### Szybki Start

1.  **Sklonuj repozytorium**
    \`\`\`bash
    git clone https://github.com/Pyt-o/pinghost-panel.git
    cd pinghost-panel
    \`\`\`

2.  **Zainstaluj zależności**
    \`\`\`bash
    pnpm install
    \`\`\`

3.  **Skonfiguruj zmienne środowiskowe**
    Skopiuj `.env.example` do `.env` i uzupełnij klucze.

4.  **Zainicjuj bazę danych**
    \`\`\`bash
    pnpm db:migrate
    \`\`\`

5.  **Uruchom serwer deweloperski**
    \`\`\`bash
    pnpm dev
    \`\`\`

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Struktura Projektu

\`\`\`
pinghost-panel/
├── client/                 # Aplikacja frontendowa
│   └── src/
│       ├── pages/         # Strony
│       ├── components/    # Komponenty
│       └── ...
├── server/                # Aplikacja backendowa
│   ├── _core/            # Rdzeń serwera
│   ├── db.ts             # Helpery bazy danych
│   └── routers.ts        # Routery tRPC
├── drizzle/              # Schemat i migracje bazy danych
└── shared/               # Współdzielone typy i stałe
\`\`\`

## Dokumentacja API (tRPC)

Aplikacja wykorzystuje tRPC do komunikacji API z bezpieczeństwem typów. Główne routery obejmują:

### Nowe Routery

- **`eggs`** - Zarządzanie szablonami serwerów (Eggs).
- **`marketplace`** - Zarządzanie elementami Marketplace i instalacją.
- **`marketplaceReviews`** - Oceny i recenzje elementów Marketplace.
- **`chat`** - Komunikacja z AI Chatbotem.
- **`twoFactorAuth`** - Zarządzanie 2FA.
- **`backups`** - Zarządzanie backupami serwerów.

### Istniejące Routery (Rozszerzone)

- **`servers`** - Dodano obsługę automatycznego odnawiania.
- **`system`** - Dodano `getAdvancedStats` (admin only).
- **`users`** - Dodano `updateProfile` i `updatePassword`.

## Wsparcie

W przypadku problemów i pytań:
- Utwórz ticket w aplikacji.
- Otwórz Issue na GitHub.

## Podziękowania

Zbudowane z ❤️ przy użyciu nowoczesnych technologii webowych.

- React Team
- Vercel (tRPC)
- Drizzle Team (Drizzle ORM)
- Stripe (płatności)
- shadcn (komponenty UI)
- **PingHost** - kompletne rozwiązanie do zarządzania hostingiem

---

**Wersja**: 2.0.0 (Rozszerzona)
**Ostatnia Aktualizacja**: Listopad 2025
**Autor**: PingHost Team
