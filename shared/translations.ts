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
      node_created: 'Nod utworzony pomyślnie',
      node_deleted: 'Nod usunięty pomyślnie',
    },

    // Packages
    packages: {
      title: 'Zarządzanie Pakietami',
      list: 'Lista Pakietów',
      add_package: 'Dodaj Pakiet',
      edit_package: 'Edytuj Pakiet',
      delete_package: 'Usuń Pakiet',
      name: 'Nazwa',
      ram: 'RAM',
      disk: 'Dysk',
      cpu: 'CPU',
      price: 'Cena/Miesiąc',
      active: 'Aktywny',
      inactive: 'Nieaktywny',
      package_created: 'Pakiet utworzony pomyślnie',
      package_updated: 'Pakiet zaktualizowany pomyślnie',
    },

    // Servers
    servers: {
      title: 'Zarządzanie Serwerami',
      my_servers: 'Moje Serwery',
      all_servers: 'Wszystkie Serwery',
      create_server: 'Utwórz Serwer',
      server_name: 'Nazwa Serwera',
      server_type: 'Typ Serwera',
      status: 'Status',
      running: 'Uruchomiony',
      stopped: 'Zatrzymany',
      error: 'Błąd',
      starting: 'Uruchamianie',
      ram: 'RAM',
      disk: 'Dysk',
      cpu: 'CPU',
      start: 'Uruchom',
      stop: 'Zatrzymaj',
      restart: 'Uruchom Ponownie',
      delete: 'Usuń Serwer',
      confirm_delete: 'Czy na pewno chcesz usunąć ten serwer?',
      server_created: 'Serwer utworzony pomyślnie',
      server_deleted: 'Serwer usunięty pomyślnie',
      no_servers: 'Nie masz żadnych serwerów',
      create_first: 'Utwórz swój pierwszy serwer',
    },

    // Tickets
    tickets: {
      title: 'Tickety Wsparcia',
      my_tickets: 'Moje Tickety',
      all_tickets: 'Wszystkie Tickety',
      create_ticket: 'Utwórz Ticket',
      subject: 'Temat',
      message: 'Wiadomość',
      priority: 'Priorytet',
      urgent: 'Pilne',
      high: 'Wysoki',
      medium: 'Średni',
      low: 'Niski',
      status: 'Status',
      open: 'Otwarty',
      in_progress: 'W Trakcie',
      closed: 'Zamknięty',
      reply: 'Odpowiedz',
      send: 'Wyślij',
      ticket_created: 'Ticket utworzony pomyślnie',
      ticket_updated: 'Ticket zaktualizowany pomyślnie',
      no_tickets: 'Brak ticketów',
    },

    // Credits
    credits: {
      title: 'Kredyty i Rozliczenia',
      balance: 'Saldo Kredytów',
      available_credits: 'Dostępne Kredyty',
      buy_credits: 'Kup Kredyty',
      transaction_history: 'Historia Transakcji',
      date: 'Data',
      type: 'Typ',
      description: 'Opis',
      amount: 'Kwota',
      balance_after: 'Saldo Po',
      purchase: 'Zakup',
      usage: 'Użycie',
      refund: 'Zwrot',
      no_transactions: 'Brak transakcji',
      credit_packages: {
        credits_100: '100 Kredytów',
        credits_500: '500 Kredytów',
        credits_1000: '1000 Kredytów',
        credits_5000: '5000 Kredytów',
        perfect_testing: 'Idealne do testowania',
        great_small_projects: 'Świetne dla małych projektów',
        best_value: 'Najlepsza wartość dla zwykłych użytkowników',
        for_power_users: 'Dla zaawansowanych użytkowników',
        most_popular: 'NAJPOPULARNIEJSZY',
        buy_now: 'Kup Teraz',
        processing: 'Przetwarzanie...',
      },
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
      title: 'Ustawienia',
      account: 'Konto',
      preferences: 'Preferencje',
      security: 'Bezpieczeństwo',
      language_preference: 'Preferencja Języka',
      select_language: 'Wybierz język',
      polish: 'Polski',
      english: 'English',
      theme: 'Motyw',
      dark: 'Ciemny',
      light: 'Jasny',
      settings_saved: 'Ustawienia zapisane pomyślnie',
      change_password: 'Zmień Hasło',
      two_factor: 'Uwierzytelnianie Dwuskładnikowe',
      enable_2fa: 'Włącz 2FA',
      disable_2fa: 'Wyłącz 2FA',
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
      node_created: 'Node created successfully',
      node_deleted: 'Node deleted successfully',
    },

    // Packages
    packages: {
      title: 'Package Management',
      list: 'Package List',
      add_package: 'Add Package',
      edit_package: 'Edit Package',
      delete_package: 'Delete Package',
      name: 'Name',
      ram: 'RAM',
      disk: 'Disk',
      cpu: 'CPU',
      price: 'Price/Month',
      active: 'Active',
      inactive: 'Inactive',
      package_created: 'Package created successfully',
      package_updated: 'Package updated successfully',
    },

    // Servers
    servers: {
      title: 'Server Management',
      my_servers: 'My Servers',
      all_servers: 'All Servers',
      create_server: 'Create Server',
      server_name: 'Server Name',
      server_type: 'Server Type',
      status: 'Status',
      running: 'Running',
      stopped: 'Stopped',
      error: 'Error',
      starting: 'Starting',
      ram: 'RAM',
      disk: 'Disk',
      cpu: 'CPU',
      start: 'Start',
      stop: 'Stop',
      restart: 'Restart',
      delete: 'Delete Server',
      confirm_delete: 'Are you sure you want to delete this server?',
      server_created: 'Server created successfully',
      server_deleted: 'Server deleted successfully',
      no_servers: 'You have no servers',
      create_first: 'Create your first server',
    },

    // Tickets
    tickets: {
      title: 'Support Tickets',
      my_tickets: 'My Tickets',
      all_tickets: 'All Tickets',
      create_ticket: 'Create Ticket',
      subject: 'Subject',
      message: 'Message',
      priority: 'Priority',
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      status: 'Status',
      open: 'Open',
      in_progress: 'In Progress',
      closed: 'Closed',
      reply: 'Reply',
      send: 'Send',
      ticket_created: 'Ticket created successfully',
      ticket_updated: 'Ticket updated successfully',
      no_tickets: 'No tickets',
    },

    // Credits
    credits: {
      title: 'Credits & Billing',
      balance: 'Credit Balance',
      available_credits: 'Available Credits',
      buy_credits: 'Buy Credits',
      transaction_history: 'Transaction History',
      date: 'Date',
      type: 'Type',
      description: 'Description',
      amount: 'Amount',
      balance_after: 'Balance After',
      purchase: 'Purchase',
      usage: 'Usage',
      refund: 'Refund',
      no_transactions: 'No transactions',
      credit_packages: {
        credits_100: '100 Credits',
        credits_500: '500 Credits',
        credits_1000: '1000 Credits',
        credits_5000: '5000 Credits',
        perfect_testing: 'Perfect for testing',
        great_small_projects: 'Great for small projects',
        best_value: 'Best value for regular users',
        for_power_users: 'For power users',
        most_popular: 'MOST POPULAR',
        buy_now: 'Buy Now',
        processing: 'Processing...',
      },
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
      title: 'Settings',
      account: 'Account',
      preferences: 'Preferences',
      security: 'Security',
      language_preference: 'Language Preference',
      select_language: 'Select Language',
      polish: 'Polski',
      english: 'English',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      settings_saved: 'Settings saved successfully',
      change_password: 'Change Password',
      two_factor: 'Two-Factor Authentication',
      enable_2fa: 'Enable 2FA',
      disable_2fa: 'Disable 2FA',
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
  },
} as const;

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
