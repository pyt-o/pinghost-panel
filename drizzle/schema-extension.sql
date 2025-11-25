-- Eggs (szablony serwerów)
CREATE TABLE IF NOT EXISTS eggs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  dockerImage VARCHAR(255) NOT NULL,
  startupCommand TEXT NOT NULL,
  configFiles TEXT, -- JSON array of config file templates
  category VARCHAR(100) NOT NULL, -- e.g., "minecraft", "csgo", "nodejs", "python"
  icon VARCHAR(255), -- URL to icon image
  minRam INT NOT NULL DEFAULT 512, -- Minimum RAM in MB
  minDisk INT NOT NULL DEFAULT 1024, -- Minimum disk in MB
  minCpu INT NOT NULL DEFAULT 50, -- Minimum CPU percentage
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  downloadCount INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Marketplace items (pluginy, mody, dodatki)
CREATE TABLE IF NOT EXISTS marketplaceItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  category VARCHAR(100) NOT NULL, -- e.g., "plugin", "mod", "theme", "script"
  serverType VARCHAR(100) NOT NULL, -- Compatible server type (e.g., "minecraft", "csgo")
  version VARCHAR(50) NOT NULL,
  downloadUrl TEXT NOT NULL,
  installScript TEXT, -- Script to install the item
  icon VARCHAR(255), -- URL to icon image
  price INT NOT NULL DEFAULT 0, -- Credits required (0 = free)
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  downloadCount INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00, -- Average rating 0.00-5.00
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Server installed items (tracking what's installed on each server)
CREATE TABLE IF NOT EXISTS serverInstalledItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serverId INT NOT NULL,
  marketplaceItemId INT NOT NULL,
  installedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('installing', 'installed', 'failed', 'uninstalled') NOT NULL DEFAULT 'installing',
  FOREIGN KEY (serverId) REFERENCES servers(id) ON DELETE CASCADE,
  FOREIGN KEY (marketplaceItemId) REFERENCES marketplaceItems(id) ON DELETE CASCADE
);

-- Chat messages (AI chatbot history)
CREATE TABLE IF NOT EXISTS chatMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  sessionId VARCHAR(255) NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
