# PingHost Panel - TODO List

## Faza 1: Struktura bazy danych
- [ ] Zaprojektować schemat bazy danych dla wszystkich encji
- [ ] Utworzyć tabele: users, servers, nodes, packages, credits, tickets, payments

## Faza 2: Implementacja schematu bazy danych
- [x] Zaimplementować pełny schemat w drizzle/schema.ts
- [x] Uruchomić migrację bazy danych (pnpm db:push)
- [x] Utworzyć helpery w server/db.ts dla wszystkich tabel

## Faza 3: Backend API (tRPC)
- [x] API zarządzania użytkownikami (lista, edycja, usuwanie, role)
- [x] API zarządzania nodami (CRUD, monitoring zasobów)
- [x] API zarządzania serwerami (CRUD, start/stop/restart)
- [x] API zarządzania pakietami hostingowymi
- [x] API zarządzania kredytami użytkowników
- [x] API statystyk i monitoringu
- [x] Middleware dla ról (admin, user)

## Faza 4: Panel administracyjny
- [x] Dashboard admina z statystykami
- [x] Zarządzanie użytkownikami (lista, edycja, usuwanie, kredyty)
- [x] Zarządzanie nodami (dodawanie, edycja, monitoring)
- [x] Zarządzanie serwerami wszystkich użytkowników
- [x] Zarządzanie pakietami hostingowymi
- [x] System logów i audytu
- [ ] Ustawienia globalne systemu

## Faza 5: Panel użytkownika
- [x] Dashboard użytkownika z przeglądem serwerów
- [x] Lista serwerów użytkownika
- [ ] Tworzenie nowego serwera
- [x] Szczegóły serwera (informacje, status)
- [ ] Konsola serwera (terminal w czasie rzeczywistym)
- [ ] Menedżer plików serwera
- [ ] Zarządzanie bazami danych serwera
- [x] Ustawienia serwera (restart, reinstalacja)
- [ ] Historia użycia zasobów

## Faza 6: System płatności i kredytów
- [x] Integracja Stripe dla płatności
- [x] System kredytów/monet wirtualnych
- [x] Historia transakcji
- [ ] Automatyczne odnawianie serwerów
- [ ] Faktury i paragony
- [x] Pakiety kredytów do zakupu

## Faza 7: System ticketów wsparcia
- [x] Tworzenie nowego ticketu
- [x] Lista ticketów użytkownika
- [x] Szczegóły ticketu z historią wiadomości
- [x] System odpowiedzi (użytkownik i admin)
- [x] Statusy ticketów (otwarty, w trakcie, zamknięty)
- [ ] Powiadomienia o nowych odpowiedziach
- [x] Panel admina do zarządzania wszystkimi ticketami

## Faza 8: Testowanie i dokumentacja
- [x] Testy jednostkowe dla procedur tRPC
- [x] Dokumentacja API
- [x] Instrukcja instalacji i konfiguracji
- [x] README.md z opisem projektu
- [x] Utworzenie checkpointu

## Faza 9: Publikacja
- [ ] Przygotowanie repozytorium GitHub
- [ ] Publikacja kodu na GitHub
- [ ] Konfiguracja CI/CD (opcjonalnie)
- [ ] Dokumentacja deployment

## Dodatkowe funkcje (nice-to-have)
- [ ] Dwuskładnikowa autentykacja (2FA)
- [ ] System powiadomień email
- [ ] Backup i restore serwerów
- [ ] Marketplace z dodatkami/modami
- [ ] API publiczne dla integracji zewnętrznych
- [ ] Wielojęzyczność (i18n)
- [ ] Tryb ciemny/jasny
- [ ] Statystyki zaawansowane z wykresami
- [ ] System afiliacyjny
- [ ] Discord/Slack integracja dla powiadomień
