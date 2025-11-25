/**
 * Translations for PingHost Panel
 * Supported languages: Polish (pl), English (en)
 */

export type Language = 'pl' | 'en';

export const translations = {
  pl: {
    // Common
    common: {
      app_name: 'PingHost Panel',
      dashboard: 'Dashboard',
      logout: 'Wyloguj się',
      settings: 'Ustawienia',
      language: 'Język',
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      create: 'Utwórz',
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      back: 'Wróć',
      search: 'Szukaj',
      filter: 'Filtruj',
      status: 'Status',
      actions: 'Akcje',
      details: 'Szczegóły',
      close: 'Zamknij',
      confirm: 'Potwierdź',
      yes: 'Tak',
      no: 'Nie',
      all: 'Wszystkie',
      free: 'Darmowy',
      change: 'Zmień',
      coming_soon: 'Wkrótce',
    },

    // Navigation
    nav: {
      admin: 'Panel Administracyjny',
      dashboard: 'Dashboard',
      users: 'Użytkownicy',
      nodes: 'Nody',
      packages: 'Pakiety',
      servers: 'Serwery',
      tickets: 'Tickety',
      my_servers: 'Moje Serwery',
      support: 'Wsparcie',
      credits: 'Kredyty',
      profile: 'Profil',
      marketplace: 'Marketplace',
      eggs: 'Szablony Serwerów',
      admin_marketplace: 'Marketplace (Admin)',
      administrators: 'Administratorzy',
    },

    // Admin Dashboard
    admin: {
      dashboard_title: 'Dashboard Administracyjny',
      dashboard_subtitle: 'Przegląd systemu i statystyki',
      total_users: 'Razem Użytkowników',
      total_servers: 'Razem Serwerów',
      active_servers: 'Aktywne Serwery',
      total_nodes: 'Razem Nodów',
      open_tickets: 'Otwarte Tickety',
      recent_activity: 'Ostatnia Aktywność',
      no_recent_activity: 'Brak ostatniej aktywności',
    },

    // Users Management
    users: {
      title: 'Zarządzanie Użytkownikami',
      list: 'Lista Użytkowników',
      add_user: 'Dodaj Użytkownika',
      edit_user: 'Edytuj Użytkownika',
      delete_user: 'Usuń Użytkownika',
      name: 'Imię',
      email: 'Email',
      role: 'Rola',
      credits: 'Kredyty',
      created: 'Utworzono',
      actions: 'Akcje',
      confirm_delete: 'Czy na pewno chcesz usunąć tego użytkownika?',
      user_deleted: 'Użytkownik usunięty pomyślnie',
      user_updated: 'Użytkownik zaktualizowany pomyślnie',
      joined: 'Dołączył',
      admin: 'Administrator',
      user: 'Użytkownik',
    },

    // Nodes Management
    nodes: {
      title: 'Zarządzanie Nodami',
      list: 'Lista Nodów',
      add_node: 'Dodaj Nod',
      edit_node: 'Edytuj Nod',
      delete_node: 'Usuń Nod',
      name: 'Nazwa',
      location: 'Lokalizacja',
      ip_address: 'Adres IP',
      total_ram: 'Całkowita RAM',
      total_disk: 'Całkowity Dysk',
      ram_usage: 'Użycie RAM',
      disk_usage: 'Użycie Dysku',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Konserwacja',
      is_public: 'Publiczny',
      confirm_delete: 'Czy na pewno chcesz usunąć ten nod?',
      node_deleted: 'Nod usunięty pomyślnie',
      node_updated: 'Nod zaktualizowany pomyślnie',
      node_created: 'Nod utworzony pomyślnie',
      create_error: 'Błąd podczas tworzenia noda',
      update_error: 'Błąd podczas aktualizacji noda',
      delete_error: 'Błąd podczas usuwania noda',
    },





































































    // Backups Management
    backups: {
      title: 'Kopie Zapasowe',
      description: 'Zarządzaj kopiami zapasowymi swojego serwera.',
      list: 'Lista Kopii Zapasowych',
      name: 'Nazwa',
      status: 'Status',
      size: 'Rozmiar',
      created_at: 'Utworzono',
      completed: 'Zakończono',
      pending: 'Oczekuje',
      failed: 'Niepowodzenie',
      create_new: 'Utwórz Nową Kopię',
      restore: 'Przywróć',
      deleting: 'Usuwanie kopii zapasowej...',
      restoring: 'Przywracanie kopii zapasowej...',
      creating_backup: 'Tworzenie kopii zapasowej...',
      backup_created: 'Kopia zapasowa utworzona pomyślnie!',
      backup_deleted: 'Kopia zapasowa usunięta pomyślnie!',
      no_backups: 'Brak kopii zapasowych.',
      restore_failed_status: "Nie można przywrócić kopii zapasowej o statusie innym niż 'Zakończono'.",
    },

    // Backups Management
    backups: {
      title: 'Backups',
      description: 'Manage your server backups.',
      list: 'Backup List',
      name: 'Name',
      status: 'Status',
      size: 'Size',
      created_at: 'Created At',
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      create_new: 'Create New Backup',
      restore: 'Restore',
      deleting: 'Deleting backup...',
      restoring: 'Restoring backup...',
      creating_backup: 'Creating backup...',
      backup_created: 'Backup created successfully!',
      backup_deleted: 'Backup deleted successfully!',
      no_backups: 'No backups found.',
      restore_failed_status: "Cannot restore a backup with status other than 'Completed'.",
    },

    // Packages Management
    packages: {
      title: 'Zarządzanie Pakietami',
      list: 'Lista Pakietów',
      add_package: 'Dodaj Pakiet',
      edit_package: 'Edytuj Pakiet',
      delete_package: 'Usuń Pakiet',
      name: 'Nazwa',
      description: 'Opis',
      ram: 'RAM (MB)',
      disk: 'Dysk (MB)',
      cpu: 'CPU (%)',
      databases: 'Bazy Danych',
      backups: 'Backupy',
      price_hour: 'Cena/godz.',
      price_day: 'Cena/dzień',
      price_month: 'Cena/mies.',
      is_active: 'Aktywny',
      confirm_delete: 'Czy na pewno chcesz usunąć ten pakiet?',
      package_deleted: 'Pakiet usunięty pomyślnie',
      package_updated: 'Pakiet zaktualizowany pomyślnie',
      package_created: 'Pakiet utworzony pomyślnie',
      create_error: 'Błąd podczas tworzenia pakietu',
      update_error: 'Błąd podczas aktualizacji pakietu',
      delete_error: 'Błąd podczas usuwania pakietu',
    },





    // Eggs Management
    eggs: {
      title: 'Zarządzanie Szablonami Serwerów (Eggs)',
      description: 'Twórz, edytuj i zarządzaj szablonami serwerów (Eggs) dla różnych gier i aplikacji.',
      create: 'Utwórz Egg',
      createTitle: 'Tworzenie Nowego Egga',
      createDescription: 'Wprowadź szczegóły nowego szablonu serwera.',
      editTitle: 'Edycja Egga',
      editDescription: 'Zmień konfigurację szablonu serwera.',
      deleteConfirm: 'Czy na pewno chcesz usunąć ten szablon serwera (Egg)?',
      list: 'Lista Szablonów Serwerów',
      listDescription: 'Wszystkie dostępne szablony serwerów.',
      name: 'Nazwa',
      category: 'Kategoria',
      author: 'Autor',
      requirements: 'Wymagania',
      downloads: 'Pobrania',
      status: 'Status',
      selectCategory: 'Wybierz kategorię',
      dockerImage: 'Obraz Docker',
      startupCommand: 'Komenda Startowa',
      minRam: 'Min. RAM',
      minDisk: 'Min. Dysk',
      minCpu: 'Min. CPU',
      created: 'Utworzono pomyślnie',
      updated: 'Zaktualizowano pomyślnie',
      deleted: 'Usunięto pomyślnie',
      createError: 'Błąd podczas tworzenia Egga',
      updateError: 'Błąd podczas aktualizacji Egga',
      deleteError: 'Błąd podczas usuwania Egga',
    },

    // Marketplace Management
    marketplace: {
      title: 'Marketplace Dodatków',
      description: 'Przeglądaj i zarządzaj pluginami, modami i dodatkami dostępnymi dla użytkowników.',
      create: 'Dodaj Element',
      createTitle: 'Dodawanie Nowego Elementu do Marketplace',
      createDescription: 'Wprowadź szczegóły nowego elementu do Marketplace.',
      editTitle: 'Edycja Elementu Marketplace',
      editDescription: 'Zmień konfigurację elementu Marketplace.',
      deleteConfirm: 'Czy na pewno chcesz usunąć ten element z Marketplace?',
      list: 'Lista Elementów Marketplace',
      listDescription: 'Wszystkie elementy dostępne w Marketplace.',
      name: 'Nazwa',
      category: 'Kategoria',
      author: 'Autor',
      serverType: 'Typ Serwera',
      version: 'Wersja',
      price: 'Cena',
      downloads: 'Pobrania',
      rating: 'Ocena',
      status: 'Status',
      selectCategory: 'Wybierz kategorię',
      selectServerType: 'Wybierz typ serwera',
      downloadUrl: 'URL Pliku',
      installScript: 'Skrypt Instalacyjny',
      created: 'Utworzono pomyślnie',
      updated: 'Zaktualizowano pomyślnie',
      deleted: 'Usunięto pomyślnie',
      createError: 'Błąd podczas tworzenia elementu',
      updateError: 'Błąd podczas aktualizacji elementu',
      deleteError: 'Błąd podczas usuwania elementu',
      // User Marketplace
      by: 'przez',
      noDescription: 'Brak opisu',
      install: 'Zainstaluj',
      installSuccess: 'Instalacja rozpoczęta pomyślnie!',
      installError: 'Błąd podczas rozpoczynania instalacji',
      installTitle: 'Instalacja Dodatku',
      installDescription: 'Wybierz serwer, na którym chcesz zainstalować ten dodatek.',
      selectServer: 'Wybierz Serwer',
      chooseServer: 'Wybierz serwer...',
      cost: 'Koszt',
      balanceAfter: 'Saldo po instalacji',
      insufficientCredits: 'Niewystarczająca ilość kredytów!',
      installing: 'Instalowanie...',
      noItems: 'Brak elementów w Marketplace.',
    },

    // Servers Management
    servers: {
      title: 'Zarządzanie Serwerami',
      list: 'Lista Serwerów',
      add_server: 'Dodaj Serwer',
      edit_server: 'Edytuj Serwer',
      delete_server: 'Usuń Serwer',
      name: 'Nazwa',
      node: 'Nod',
      package: 'Pakiet',
      user: 'Użytkownik',
      type: 'Typ',
      status: 'Status',
      running: 'Działa',
      stopped: 'Zatrzymany',
      installing: 'Instalowanie',
      suspended: 'Zawieszony',
      error: 'Błąd',
      auto_start: 'Auto Start',
      billing_cycle: 'Cykl Rozliczeniowy',
      hourly: 'Godzinowy',
      daily: 'Dzienny',
      monthly: 'Miesięczny',
      confirm_delete: 'Czy na pewno chcesz usunąć ten serwer?',
      server_deleted: 'Serwer usunięty pomyślnie',
      server_updated: 'Serwer zaktualizowany pomyślnie',
      server_created: 'Serwer utworzony pomyślnie',
      create_error: 'Błąd podczas tworzenia serwera',
      update_error: 'Błąd podczas aktualizacji serwera',
      delete_error: 'Błąd podczas usuwania serwera',
      start: 'Start',
      stop: 'Stop',
      restart: 'Restart',
      reinstall: 'Reinstaluj',
      console: 'Konsola',
      files: 'Pliki',
      databases: 'Bazy Danych',
      settings: 'Ustawienia',
      details: 'Szczegóły Serwera',
      create_new: 'Utwórz Nowy Serwer',
      select_node: 'Wybierz Nod',
      select_package: 'Wybierz Pakiet',
      select_egg: 'Wybierz Szablon (Egg)',
      server_type: 'Typ Serwera',
      image_tag: 'Tag Obrazu Docker',
      billing_info: 'Informacje Rozliczeniowe',
      cost_per_hour: 'Koszt/godzinę',
      expires_at: 'Wygasa',
      last_billed: 'Ostatnio rozliczony',
      console_placeholder: 'Wpisz komendę...',
      send_command: 'Wyślij',
      upload_file: 'Upload Pliku',
      create_folder: 'Nowy Folder',
      current_path: 'Aktualna ścieżka',
      file_name: 'Nazwa Pliku',
      file_type: 'Typ',
      file_size: 'Rozmiar',
      last_modified: 'Ostatnia Modyfikacja',
      folder: 'Folder',
      file: 'Plik',
      download: 'Pobierz',
      no_files: 'Brak plików w tym katalogu.',
      settings_saved: 'Ustawienia serwera zapisane pomyślnie!',
      settings_description: 'Zarządzaj podstawowymi ustawieniami serwera.',
      auto_start_description: 'Automatycznie uruchamiaj serwer po restarcie noda.',
      auto_renew: 'Automatyczne Odnawianie',
      auto_renew_description: 'Automatycznie odnawiaj serwer z kredytów przed wygaśnięciem.',
      reinstall_confirm: 'Czy na pewno chcesz przeinstalować serwer? Spowoduje to utratę wszystkich danych.',
      reinstall_warning: 'Spowoduje to usunięcie wszystkich plików i ponowną instalację systemu serwera.',
    },

    // Tickets Management
    tickets: {
      title: 'Zarządzanie Ticketami',
      list: 'Lista Ticketów',
      add_ticket: 'Dodaj Ticket',
      subject: 'Temat',
      priority: 'Priorytet',
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki',
      urgent: 'Pilny',
      status: 'Status',
      open: 'Otwarty',
      in_progress: 'W Trakcie',
      waiting_user: 'Oczekuje na Użytkownika',
      closed: 'Zamknięty',
      category: 'Kategoria',
      technical: 'Techniczny',
      billing: 'Płatności',
      general: 'Ogólny',
      related_server: 'Powiązany Serwer',
      created: 'Utworzono',
      last_reply: 'Ostatnia Odpowiedź',
      reply: 'Odpowiedz',
      message: 'Wiadomość',
      send: 'Wyślij',
      ticket_created: 'Ticket utworzony pomyślnie',
      ticket_updated: 'Ticket zaktualizowany pomyślnie',
      reply_sent: 'Odpowiedź wysłana pomyślnie',
      create_error: 'Błąd podczas tworzenia ticketu',
      update_error: 'Błąd podczas aktualizacji ticketu',
      reply_error: 'Błąd podczas wysyłania odpowiedzi',
      details_title: 'Szczegóły Ticketu',
      close_ticket: 'Zamknij Ticket',
      reopen_ticket: 'Otwórz Ponownie Ticket',
      confirm_close: 'Czy na pewno chcesz zamknąć ten ticket?',
      confirm_reopen: 'Czy na pewno chcesz ponownie otworzyć ten ticket?',
    },

    // Payments and Credits
    credits: {
      title: 'Kredyty i Płatności',
      balance: 'Aktualne Saldo',
      buy_credits: 'Kup Kredyty',
      history: 'Historia Transakcji',
      amount: 'Kwota',
      type: 'Typ',
      description: 'Opis',
      date: 'Data',
      purchase: 'Zakup',
      usage: 'Użycie',
      refund: 'Zwrot',
      bonus: 'Bonus',
      admin_adjustment: 'Korekta Admina',
      payment_history: 'Historia Płatności',
      payment_id: 'ID Płatności',
      status: 'Status',
      completed: 'Zakończono',
      failed: 'Niepowodzenie',
      pending: 'Oczekuje',
      refunded: 'Zwrócono',
      checkout_title: 'Kup Kredyty',
      checkout_description: 'Wybierz pakiet kredytów do zakupu.',
      package: 'Pakiet',
      price: 'Cena',
      credits_amount: 'Ilość Kredytów',
      buy_now: 'Kup Teraz',
    },

    // User Dashboard
    user: {
      welcome: 'Witaj powrót,',
      account_overview: 'Przegląd Twojego konta',
      manage_servers: 'Zarządzaj Serwerami',
      view_and_control: 'Wyświetl i kontroluj swoje serwery',
      get_help: 'Uzyskaj Pomoc',
      get_help_from_team: 'Uzyskaj pomoc od naszego zespołu',
      add_credits: 'Dodaj Kredyty',
      add_credits_to_account: 'Dodaj kredyty do swojego konta',
      quick_actions: 'Szybkie Akcje',
    },

    // Settings
    settings: {
      title: 'Ustawienia Konta',
      preferences: 'Zarządzaj swoimi preferencjami i ustawieniami bezpieczeństwa.',
      language_preference: 'Preferencje Językowe',
      language_description: 'Wybierz preferowany język interfejsu.',
      select_language: 'Wybierz Język',
      polish: 'Polski',
      english: 'Angielski',
      settings_saved: 'Ustawienia zapisane pomyślnie',
      account: 'Konto',
      account_description: 'Informacje o Twoim koncie.',
      security: 'Bezpieczeństwo',
      security_description: 'Zarządzaj hasłem i uwierzytelnianiem dwuskładnikowym.',
      change_password: 'Zmień Hasło',
      enable_2fa: 'Włącz 2FA',
      coming_soon: 'Wkrótce',
      edit_profile: 'Edytuj Profil',
      edit_profile_description: 'Zmień swoje imię i nazwisko.',
      enter_name: 'Wprowadź imię',
      profile_updated: 'Profil zaktualizowany pomyślnie',
      "passwords_dont_match": "Hasła nie są zgodne",
    "2fa": {
      "title": "Uwierzytelnianie dwuskładnikowe (2FA)",
      "setup_started": "Rozpoczęto konfigurację 2FA",
      "scan_qr": "Zeskanuj kod QR za pomocą aplikacji uwierzytelniającej",
      "enabled_title": "2FA włączone",
      "enabled_description": "Uwierzytelnianie dwuskładnikowe zostało pomyślnie włączone.",
      "disabled_title": "2FA wyłączone",
      "disabled_description": "Uwierzytelnianie dwuskładnikowe zostało wyłączone.",
      "token_and_secret_required": "Token i sekret są wymagane",
      "token_required": "Token jest wymagany",
      "disable_prompt": "Aby wyłączyć 2FA, wprowadź token z aplikacji uwierzytelniającej.",
      "token": "Token 2FA",
      "disable_button": "Wyłącz 2FA",
      "setup_step_1": "Krok 1: Zeskanuj kod QR",
      "secret_key": "Klucz sekretny",
      "setup_step_2": "Krok 2: Wprowadź token",
      "enable_button": "Włącz 2FA",
      "setup_button": "Skonfiguruj 2FA",
      "status_enabled": "Uwierzytelnianie dwuskładnikowe jest obecnie włączone.",
      "status_disabled": "Uwierzytelnianie dwuskładnikowe jest obecnie wyłączone."
    },
    "marketplace": {
      "reviews": "Recenzje",
      "reviews_for": "Recenzje dla",
      "reviews_description": "Zobacz, co inni użytkownicy sądzą o tym elemencie.",
      "user": "Użytkownik",
      "no_reviews": "Brak recenzji dla tego elementu.",
      "submit_review": "Prześlij recenzję",
      "rating_required": "Ocena jest wymagana",
      "review_submitted": "Recenzja została przesłana",
      "review_error": "Wystąpił błąd podczas przesyłania recenzji",
      "review_placeholder": "Napisz swoją recenzję...",
      "stars": "gwiazdek",
      "submit": "Prześlij"
      },
      password_too_short: 'Hasło musi mieć co najmniej 8 znaków',
      password_changed: 'Hasło zmienione pomyślnie',
      current_password: 'Aktualne Hasło',
      new_password: 'Nowe Hasło',
      confirm_password: 'Potwierdź Nowe Hasło',
      enter_current_password: 'Wprowadź aktualne hasło',
      enter_new_password: 'Wprowadź nowe hasło',
      confirm_new_password: 'Potwierdź nowe hasło',
      change_email: 'Zmień Email',
      change_email_description: 'Zmień adres email powiązany z Twoim kontem.',
      new_email: 'Nowy Email',
      enter_new_email: 'Wprowadź nowy email',
      invalid_email: 'Nieprawidłowy format email',
      email_changed: 'Email zmieniony pomyślnie. Wymagana weryfikacja.',
      email_verification_notice: 'Zmiana adresu email wymaga weryfikacji. Na nowy adres zostanie wysłany link aktywacyjny.',
    },

    // Admin Administrators
    administrators: {
      title: 'Zarządzanie Administratorami',
      description: 'Zarządzaj użytkownikami z uprawnieniami administratora.',
      current: 'Aktualni Administratorzy',
      currentDescription: 'Lista użytkowników z pełnym dostępem administracyjnym.',
      regularUsers: 'Zwykli Użytkownicy',
      regularUsersDescription: 'Lista użytkowników, których możesz awansować na administratorów.',
      demote: 'Degraduj',
      promote: 'Awansuj',
      promoteTitle: 'Awansowanie na Administratora',
      promoteDescription: 'Czy na pewno chcesz nadać temu użytkownikowi uprawnienia administratora?',
      promoteWarning: 'OSTRZEŻENIE: Pełny Dostęp',
      promoteWarningDetails: 'Administratorzy mają pełny dostęp do wszystkich funkcji panelu, w tym do zarządzania użytkownikami, serwerami i finansami.',
      demoteTitle: 'Degradacja Administratora',
      demoteDescription: 'Czy na pewno chcesz odebrać temu użytkownikowi uprawnienia administratora?',
      demoteWarning: 'OSTRZEŻENIE: Utrata Dostępu',
      demoteWarningDetails: 'Użytkownik straci dostęp do panelu administracyjnego i wszystkich funkcji administracyjnych.',
      confirm: 'Potwierdź Akcję',
      roleUpdated: 'Rola użytkownika zaktualizowana pomyślnie',
      roleUpdateError: 'Błąd podczas aktualizacji roli',
    },

    // AI Chatbot
    chat: {
      ticket_created_success: "Ticket został pomyślnie utworzony",
      ticket_created_error: "Wystąpił błąd podczas tworzenia ticketu",
      user_label: "Użytkownik",
      assistant_label: "Asystent",
      ticket_subject: "Eskalacja z AI Chat",
      ticket_initial_message: "Ten ticket został automatycznie utworzony z sesji czatu AI.",
      chat_history: "Historia czatu",
      escalate_to_ticket: "Eskaluj do ticketu wsparcia",
      title: 'Asystent PingHost AI',
      placeholder: 'Zadaj pytanie...',
      emptyState: 'Rozpocznij rozmowę z Asystentem AI',
      prompts: {
        packages: 'Jakie pakiety hostingowe oferujecie?',
        createServer: 'Jak mogę stworzyć serwer?',
        pricing: 'Jakie są ceny?',
        support: 'Potrzebuję pomocy technicznej'
      }
    },

    },

    // Messages
    messages: {
      loading: 'Ładowanie...',
      error_loading: 'Błąd podczas ładowania danych',
      error_saving: 'Błąd podczas zapisywania',
      error_deleting: 'Błąd podczas usuwania',
      try_again: 'Spróbuj Ponownie',
      unauthorized: 'Nie masz uprawnień do tej akcji',
      not_found: 'Nie znaleziono',
      server_error: 'Błąd serwera',
      connection_error: 'Błąd połączenia',
      redirecting_checkout: 'Przekierowanie do kasy...',
      checkout_failed: 'Nie udało się utworzyć sesji kasy',
    },
  
    en: {
    // Common
    common: {
      app_name: 'PingHost Panel',
      dashboard: 'Dashboard',
      logout: 'Logout',
      settings: 'Settings',
      language: 'Language',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      status: 'Status',
      actions: 'Actions',
      details: 'Details',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      all: 'All',
      free: 'Free',
      change: 'Change',
      coming_soon: 'Coming Soon',
    },

    // Navigation
    nav: {
      admin: 'Admin Panel',
      dashboard: 'Dashboard',
      users: 'Users',
      nodes: 'Nodes',
      packages: 'Packages',
      servers: 'Servers',
      tickets: 'Tickets',
      my_servers: 'My Servers',
      support: 'Support',
      credits: 'Credits',
      profile: 'Profile',
      marketplace: 'Marketplace',
      eggs: 'Server Templates (Eggs)',
      admin_marketplace: 'Marketplace (Admin)',
      administrators: 'Administrators',
    },

    // Admin Dashboard
    admin: {
      dashboard_title: 'Admin Dashboard',
      dashboard_subtitle: 'System overview and statistics',
      total_users: 'Total Users',
      total_servers: 'Total Servers',
      active_servers: 'Active Servers',
      total_nodes: 'Total Nodes',
      open_tickets: 'Open Tickets',
      recent_activity: 'Recent Activity',
      no_recent_activity: 'No recent activity',
    },

    // Users Management
    users: {
      title: 'User Management',
      list: 'User List',
      add_user: 'Add User',
      edit_user: 'Edit User',
      delete_user: 'Delete User',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      credits: 'Credits',
      created: 'Created',
      actions: 'Actions',
      confirm_delete: 'Are you sure you want to delete this user?',
      user_deleted: 'User deleted successfully',
      user_updated: 'User updated successfully',
      joined: 'Joined',
      admin: 'Administrator',
      user: 'User',
    },

    // Nodes Management
    nodes: {
      title: 'Node Management',
      list: 'Node List',
      add_node: 'Add Node',
      edit_node: 'Edit Node',
      delete_node: 'Delete Node',
      name: 'Name',
      location: 'Location',
      ip_address: 'IP Address',
      total_ram: 'Total RAM',
      total_disk: 'Total Disk',
      ram_usage: 'RAM Usage',
      disk_usage: 'Disk Usage',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Maintenance',
      is_public: 'Public',
      confirm_delete: 'Are you sure you want to delete this node?',
      node_deleted: 'Node deleted successfully',
      node_updated: 'Node updated successfully',
      node_created: 'Node created successfully',
      create_error: 'Error creating node',
      update_error: 'Error updating node',
      delete_error: 'Error deleting node',
    },





































































    // Backups Management
    backups: {
      title: 'Kopie Zapasowe',
      description: 'Zarządzaj kopiami zapasowymi swojego serwera.',
      list: 'Lista Kopii Zapasowych',
      name: 'Nazwa',
      status: 'Status',
      size: 'Rozmiar',
      created_at: 'Utworzono',
      completed: 'Zakończono',
      pending: 'Oczekuje',
      failed: 'Niepowodzenie',
      create_new: 'Utwórz Nową Kopię',
      restore: 'Przywróć',
      deleting: 'Usuwanie kopii zapasowej...',
      restoring: 'Przywracanie kopii zapasowej...',
      creating_backup: 'Tworzenie kopii zapasowej...',
      backup_created: 'Kopia zapasowa utworzona pomyślnie!',
      backup_deleted: 'Kopia zapasowa usunięta pomyślnie!',
      no_backups: 'Brak kopii zapasowych.',
      restore_failed_status: "Nie można przywrócić kopii zapasowej o statusie innym niż 'Zakończono'.",
    },

    // Backups Management
    backups: {
      title: 'Backups',
      description: 'Manage your server backups.',
      list: 'Backup List',
      name: 'Name',
      status: 'Status',
      size: 'Size',
      created_at: 'Created At',
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      create_new: 'Create New Backup',
      restore: 'Restore',
      deleting: 'Deleting backup...',
      restoring: 'Restoring backup...',
      creating_backup: 'Creating backup...',
      backup_created: 'Backup created successfully!',
      backup_deleted: 'Backup deleted successfully!',
      no_backups: 'No backups found.',
      restore_failed_status: "Cannot restore a backup with status other than 'Completed'.",
    },

    // Packages Management
    packages: {
      title: 'Package Management',
      list: 'Package List',
      add_package: 'Add Package',
      edit_package: 'Edit Package',
      delete_package: 'Delete Package',
      name: 'Name',
      description: 'Description',
      ram: 'RAM (MB)',
      disk: 'Disk (MB)',
      cpu: 'CPU (%)',
      databases: 'Databases',
      backups: 'Backups',
      price_hour: 'Price/hour',
      price_day: 'Price/day',
      price_month: 'Price/month',
      is_active: 'Active',
      confirm_delete: 'Are you sure you want to delete this package?',
      package_deleted: 'Package deleted successfully',
      package_updated: 'Package updated successfully',
      package_created: 'Package created successfully',
      create_error: 'Error creating package',
      update_error: 'Error updating package',
      delete_error: 'Error deleting package',
    },





    // Eggs Management
    eggs: {
      title: 'Server Template (Eggs) Management',
      description: 'Create, edit, and manage server templates (Eggs) for various games and applications.',
      create: 'Create Egg',
      createTitle: 'Create New Egg',
      createDescription: 'Enter details for the new server template.',
      editTitle: 'Edit Egg',
      editDescription: 'Modify the server template configuration.',
      deleteConfirm: 'Are you sure you want to delete this server template (Egg)?',
      list: 'Server Template List',
      listDescription: 'All available server templates.',
      name: 'Name',
      category: 'Category',
      author: 'Author',
      requirements: 'Requirements',
      downloads: 'Downloads',
      status: 'Status',
      selectCategory: 'Select category',
      dockerImage: 'Docker Image',
      startupCommand: 'Startup Command',
      minRam: 'Min. RAM',
      minDisk: 'Min. Disk',
      minCpu: 'Min. CPU',
      created: 'Egg created successfully',
      updated: 'Egg updated successfully',
      deleted: 'Egg deleted successfully',
      createError: 'Error creating Egg',
      updateError: 'Error updating Egg',
      deleteError: 'Error deleting Egg',
    },

    // Marketplace Management
    marketplace: {
      title: 'Addon Marketplace',
      description: 'Browse and manage plugins, mods, and addons available to users.',
      create: 'Add Item',
      createTitle: 'Adding New Marketplace Item',
      createDescription: 'Enter details for the new Marketplace item.',
      editTitle: 'Edit Marketplace Item',
      editDescription: 'Modify the Marketplace item configuration.',
      deleteConfirm: 'Are you sure you want to delete this Marketplace item?',
      list: 'Marketplace Item List',
      listDescription: 'All items available in the Marketplace.',
      name: 'Name',
      category: 'Category',
      author: 'Author',
      serverType: 'Server Type',
      version: 'Version',
      price: 'Price',
      downloads: 'Downloads',
      rating: 'Rating',
      status: 'Status',
      selectCategory: 'Select category',
      selectServerType: 'Select server type',
      downloadUrl: 'File URL',
      installScript: 'Installation Script',
      created: 'Item created successfully',
      updated: 'Item updated successfully',
      deleted: 'Item deleted successfully',
      createError: 'Error creating item',
      updateError: 'Error updating item',
      deleteError: 'Error deleting item',
      // User Marketplace
      by: 'by',
      noDescription: 'No description',
      install: 'Install',
      installSuccess: 'Installation started successfully!',
      installError: 'Error starting installation',
      installTitle: 'Install Addon',
      installDescription: 'Select the server where you want to install this addon.',
      selectServer: 'Select Server',
      chooseServer: 'Choose a server...',
      cost: 'Cost',
      balanceAfter: 'Balance after installation',
      insufficientCredits: 'Insufficient credits!',
      installing: 'Installing...',
      noItems: 'No items in the Marketplace.',
    },

    // Servers Management
    servers: {
      title: 'Server Management',
      list: 'Server List',
      add_server: 'Add Server',
      edit_server: 'Edit Server',
      delete_server: 'Delete Server',
      name: 'Name',
      node: 'Node',
      package: 'Package',
      user: 'User',
      type: 'Type',
      status: 'Status',
      running: 'Running',
      stopped: 'Stopped',
      installing: 'Installing',
      suspended: 'Suspended',
      error: 'Error',
      auto_start: 'Auto Start',
      billing_cycle: 'Billing Cycle',
      hourly: 'Hourly',
      daily: 'Daily',
      monthly: 'Monthly',
      confirm_delete: 'Are you sure you want to delete this server?',
      server_deleted: 'Server deleted successfully',
      server_updated: 'Server updated successfully',
      server_created: 'Server created successfully',
      create_error: 'Error creating server',
      update_error: 'Error updating server',
      delete_error: 'Error deleting server',
      start: 'Start',
      stop: 'Stop',
      restart: 'Restart',
      reinstall: 'Reinstall',
      console: 'Console',
      files: 'Files',
      databases: 'Databases',
      settings: 'Settings',
      details: 'Server Details',
      create_new: 'Create New Server',
      select_node: 'Select Node',
      select_package: 'Select Package',
      select_egg: 'Select Template (Egg)',
      server_type: 'Server Type',
      image_tag: 'Docker Image Tag',
      billing_info: 'Billing Information',
      cost_per_hour: 'Cost/hour',
      expires_at: 'Expires At',
      last_billed: 'Last Billed',
      console_placeholder: 'Enter command...',
      send_command: 'Send',
      upload_file: 'Upload File',
      create_folder: 'New Folder',
      current_path: 'Current Path',
      file_name: 'File Name',
      file_type: 'Type',
      file_size: 'Size',
      last_modified: 'Last Modified',
      folder: 'Folder',
      file: 'File',
      download: 'Download',
      no_files: 'No files in this directory.',
      settings_saved: 'Server settings saved successfully!',
      settings_description: 'Manage basic server settings.',
      auto_start_description: 'Automatically start the server after a node restart.',
      auto_renew: 'Automatic Renewal',
      auto_renew_description: 'Automatically renew the server using credits before expiration.',
      reinstall_confirm: 'Are you sure you want to reinstall the server? This will result in the loss of all data.',
      reinstall_warning: 'This will delete all files and reinstall the server system.',
    },

    // Tickets Management
    tickets: {
      title: 'Ticket Management',
      list: 'Ticket List',
      add_ticket: 'Add Ticket',
      subject: 'Subject',
      priority: 'Priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      status: 'Status',
      open: 'Open',
      in_progress: 'In Progress',
      waiting_user: 'Waiting for User',
      closed: 'Closed',
      category: 'Category',
      technical: 'Technical',
      billing: 'Billing',
      general: 'General',
      related_server: 'Related Server',
      created: 'Created',
      last_reply: 'Last Reply',
      reply: 'Reply',
      message: 'Message',
      send: 'Send',
      ticket_created: 'Ticket created successfully',
      ticket_updated: 'Ticket updated successfully',
      reply_sent: 'Reply sent successfully',
      create_error: 'Error creating ticket',
      update_error: 'Error updating ticket',
      reply_error: 'Error sending reply',
      details_title: 'Ticket Details',
      close_ticket: 'Close Ticket',
      reopen_ticket: 'Reopen Ticket',
      confirm_close: 'Are you sure you want to close this ticket?',
      confirm_reopen: 'Are you sure you want to reopen this ticket?',
    },

    // Payments and Credits
    credits: {
      title: 'Credits & Payments',
      balance: 'Current Balance',
      buy_credits: 'Buy Credits',
      history: 'Transaction History',
      amount: 'Amount',
      type: 'Type',
      description: 'Description',
      date: 'Date',
      purchase: 'Purchase',
      usage: 'Usage',
      refund: 'Refund',
      bonus: 'Bonus',
      admin_adjustment: 'Admin Adjustment',
      payment_history: 'Payment History',
      payment_id: 'Payment ID',
      status: 'Status',
      completed: 'Completed',
      failed: 'Failed',
      pending: 'Pending',
      refunded: 'Refunded',
      checkout_title: 'Buy Credits',
      checkout_description: 'Select a credit package to purchase.',
      package: 'Package',
      price: 'Price',
      credits_amount: 'Credit Amount',
      buy_now: 'Buy Now',
    },

    // User Dashboard
    user: {
      welcome: 'Welcome back,',
      account_overview: 'Here is an overview of your account',
      manage_servers: 'Manage Servers',
      view_and_control: 'View and control your servers',
      get_help: 'Get Help',
      get_help_from_team: 'Get help from our support team',
      add_credits: 'Add Credits',
      add_credits_to_account: 'Add credits to your account',
      quick_actions: 'Quick Actions',
    },

    // Settings
    settings: {
      title: 'Account Settings',
      preferences: 'Manage your preferences and security settings.',
      language_preference: 'Language Preference',
      language_description: 'Select your preferred interface language.',
      select_language: 'Select Language',
      polish: 'Polish',
      english: 'English',
      settings_saved: 'Settings saved successfully',
      account: 'Account',
      account_description: 'Your account information.',
      security: 'Security',
      security_description: 'Manage your password and two-factor authentication.',
      change_password: 'Change Password',
      enable_2fa: 'Enable 2FA',
      coming_soon: 'Coming Soon',
      edit_profile: 'Edit Profile',
      edit_profile_description: 'Change your name.',
      enter_name: 'Enter name',
      profile_updated: 'Profile updated successfully',
      passwords_dont_match: 'Passwords do not match',
      password_too_short: 'Password must be at least 8 characters long',
      password_changed: 'Password changed successfully',
      current_password: 'Current Password',
      new_password: 'New Password',
      confirm_password: 'Confirm New Password',
      enter_current_password: 'Enter current password',
      enter_new_password: 'Enter new password',
      confirm_new_password: 'Confirm new password',
      change_email: 'Change Email',
      change_email_description: 'Change the email address associated with your account.',
      new_email: 'New Email',
      enter_new_email: 'Enter new email',
      invalid_email: 'Invalid email format',
      email_changed: 'Email changed successfully. Verification required.',
      email_verification_notice: 'Changing your email requires verification. An activation link will be sent to the new address.',
    },

    // Admin Administrators
    administrators: {
      title: 'Administrator Management',
      description: 'Manage users with administrator privileges.',
      current: 'Current Administrators',
      currentDescription: 'List of users with full administrative access.',
      regularUsers: 'Regular Users',
      regularUsersDescription: 'List of users you can promote to administrators.',
      demote: 'Demote',
      promote: 'Promote',
      promoteTitle: 'Promote to Administrator',
      promoteDescription: 'Are you sure you want to grant this user administrator privileges?',
      promoteWarning: 'WARNING: Full Access',
      promoteWarningDetails: 'Administrators have full access to all panel functions, including user, server, and finance management.',
      demoteTitle: 'Demote Administrator',
      demoteDescription: 'Are you sure you want to revoke administrator privileges from this user?',
      demoteWarning: 'WARNING: Loss of Access',
      demoteWarningDetails: 'The user will lose access to the administrative panel and all administrative functions.',
      confirm: 'Confirm Action',
      roleUpdated: 'User role updated successfully',
      roleUpdateError: 'Error updating user role',
    },

    // AI Chatbot
    chat: {
      title: 'PingHost AI Assistant',
      placeholder: 'Ask a question...',
      emptyState: 'Start a conversation with the AI Assistant',
      prompts: {
        packages: 'What hosting packages do you offer?',
        createServer: 'How do I create a new server?',
        pricing: 'How much does the cheapest server cost?',
        support: 'I want to create a support ticket.',
      },
    },

    // Messages
    messages: {
      loading: 'Loading...',
      error_loading: 'Error loading data',
      error_saving: 'Error saving data',
      error_deleting: 'Error deleting data',
      try_again: 'Try Again',
      unauthorized: 'You do not have permission for this action',
      not_found: 'Not found',
      server_error: 'Server error',
      connection_error: 'Connection error',
      redirecting_checkout: 'Redirecting to checkout...',
      checkout_failed: 'Failed to create checkout session',
    },
  }
  
  /**
 * Get translation by language and key path
 * Example: t('pl', 'common.app_name') => 'PingHost Panel'
 */
export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a language
 */
export function getAllTranslations(language: Language) {
  return translations[language];
}
