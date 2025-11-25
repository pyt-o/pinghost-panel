# Instrukcja Instalacji i Konfiguracji PingHost Panel

## 1. Wymagania Wstępne

Przed rozpoczęciem instalacji upewnij się, że masz zainstalowane następujące oprogramowanie:

*   **Node.js** (wersja 18.x lub nowsza)
*   **npm** lub **pnpm** (zalecane)
*   **MySQL** (lub kompatybilna baza danych, np. MariaDB)
*   **Git**
*   **GitHub CLI** (do klonowania repozytorium)

## 2. Klonowanie Repozytorium

Sklonuj projekt z GitHub i przejdź do katalogu projektu:

\`\`\`bash
gh repo clone Pyt-o/pinghost-panel
cd pinghost-panel
\`\`\`

## 3. Konfiguracja Środowiska

Utwórz plik konfiguracyjny `.env` w głównym katalogu projektu, kopiując plik wzorcowy:

\`\`\`bash
cp .env.example .env
\`\`\`

Następnie edytuj plik `.env`, uzupełniając zmienne środowiskowe, w szczególności dane dostępowe do bazy danych:

\`\`\`
# Baza Danych
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# Uwierzytelnianie
JWT_SECRET="TWOJ_BARDZO_SEKRETNY_KLUCZ"

# AI Chatbot (opcjonalnie)
OPENAI_API_KEY="TWOJ_KLUCZ_OPENAI"
\`\`\`

## 4. Instalacja Zależności

Zainstaluj zależności dla backendu i frontendu. Zalecane jest użycie `pnpm`:

\`\`\`bash
pnpm install
\`\`\`

## 5. Konfiguracja Bazy Danych (Drizzle ORM)

Użyj Drizzle ORM do migracji schematu bazy danych.

### 5.1. Migracja Schematu

Uruchom migrację, aby utworzyć wszystkie niezbędne tabele (użytkownicy, serwery, eggs, marketplace, 2FA, backups itp.):

\`\`\`bash
pnpm run db:migrate
\`\`\`

### 5.2. Seedowanie Danych (Opcjonalne)

Jeśli chcesz załadować przykładowe dane (np. użytkownika admina, przykładowe eggs, elementy marketplace), użyj polecenia seed:

\`\`\`bash
pnpm run db:seed
\`\`\`

## 6. Uruchomienie Aplikacji

Projekt składa się z dwóch części: backendu (API tRPC) i frontendu (React).

### 6.1. Uruchomienie Backendu

Backend zostanie uruchomiony na porcie 3001 (domyślnie):

\`\`\`bash
pnpm run start:server
\`\`\`

### 6.2. Uruchomienie Frontendu

Frontend zostanie uruchomiony na porcie 3000 (domyślnie):

\`\`\`bash
pnpm run start:client
\`\`\`

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`.

## 7. Pierwsze Logowanie

Jeśli użyłeś komendy `db:seed`, domyślne dane logowania administratora to:

*   **Email:** `admin@pinghost.pl`
*   **Hasło:** `password` (Zmień je natychmiast po pierwszym logowaniu!)

## 8. Dalsza Konfiguracja

Po zalogowaniu jako administrator, przejdź do Panelu Administracyjnego, aby:

*   Dodać **Nody** (serwery fizyczne/VPS, na których będą działać serwery gier).
*   Skonfigurować **Pakiety** hostingowe.
*   Dodać **Szablony (Eggs)** dla różnych gier.
*   Zarządzać **Marketplace** i **Administratorami**.
