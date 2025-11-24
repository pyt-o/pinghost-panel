# PingHost Panel

A complete, modern hosting panel for managing game servers and VPS instances. Built with React, TypeScript, tRPC, and Tailwind CSS.

![PingHost Panel](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🎯 Core Functionality

- **User Management** - Complete user authentication and authorization system
- **Server Management** - Create, start, stop, restart, and delete game servers
- **Node Management** - Manage physical/virtual nodes that host servers
- **Package System** - Predefined server configurations with resource allocations
- **Credit System** - Virtual currency for service payments
- **Payment Integration** - Stripe integration for credit purchases
- **Support Tickets** - Built-in ticketing system for customer support
- **Activity Logs** - Comprehensive audit trail for all actions

### 👨‍💼 Admin Panel

- System statistics dashboard
- User management (credits, roles, permissions)
- Node management (CRUD, resource monitoring)
- Package management (pricing, resources)
- Server oversight (all users)
- Ticket management
- Activity logs

### 👤 User Panel

- Personal dashboard with server overview
- Server management (create, control, delete)
- Credit balance and transaction history
- Support ticket system
- Payment integration

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **tRPC** - End-to-end typesafe APIs
- **Wouter** - Lightweight routing
- **shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **tRPC 11** - API layer
- **Drizzle ORM** - Database toolkit
- **MySQL/TiDB** - Database
- **Stripe** - Payment processing

## Installation

### Prerequisites

- Node.js 22+
- MySQL or TiDB database
- Stripe account (for payments)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/pinghost-panel.git
cd pinghost-panel
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

The following environment variables are automatically configured by the Manus platform:
- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - OAuth login portal URL
- `OWNER_OPEN_ID`, `OWNER_NAME` - Owner information
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

4. **Initialize database**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
pinghost-panel/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── pages/         # Page components
│       │   ├── admin/     # Admin panel pages
│       │   └── user/      # User panel pages
│       ├── components/    # Reusable components
│       ├── lib/           # Utilities and tRPC client
│       └── App.tsx        # Main application component
├── server/                # Backend application
│   ├── _core/            # Core server infrastructure
│   ├── db.ts             # Database helpers
│   ├── routers.ts        # tRPC routers
│   ├── stripe.ts         # Stripe integration
│   ├── webhook.ts        # Stripe webhooks
│   └── products.ts       # Credit packages
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Database schema
└── shared/               # Shared types and constants
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts with authentication and credits
- **nodes** - Physical/virtual servers hosting game servers
- **packages** - Server configuration templates
- **servers** - Game servers created by users
- **serverDatabases** - MySQL/PostgreSQL databases for servers
- **creditTransactions** - Credit purchase and usage history
- **payments** - Stripe payment records
- **tickets** - Support tickets
- **ticketMessages** - Ticket conversation messages
- **activityLogs** - Audit trail for all actions

## API Documentation

The application uses tRPC for type-safe API communication. Main routers include:

### Auth Router
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Users Router
- `users.list` - List all users (admin only)
- `users.myCredits` - Get user credit balance
- `users.myCreditHistory` - Get credit transaction history
- `users.updateCredits` - Update user credits (admin only)
- `users.updateRole` - Update user role (admin only)

### Nodes Router
- `nodes.list` - List available nodes
- `nodes.create` - Create new node (admin only)
- `nodes.update` - Update node (admin only)
- `nodes.delete` - Delete node (admin only)

### Packages Router
- `packages.list` - List active packages
- `packages.listAll` - List all packages (admin only)
- `packages.create` - Create package (admin only)
- `packages.update` - Update package (admin only)

### Servers Router
- `servers.list` - List user's servers
- `servers.create` - Create new server
- `servers.updateStatus` - Start/stop/restart server
- `servers.delete` - Delete server

### Tickets Router
- `tickets.list` - List user's tickets
- `tickets.create` - Create new ticket
- `tickets.reply` - Reply to ticket
- `tickets.updateStatus` - Update ticket status

### Payment Router
- `payment.packages` - Get available credit packages
- `payment.createCheckout` - Create Stripe checkout session
- `payment.history` - Get payment history

### Stats Router
- `stats.system` - Get system statistics (admin only)
- `stats.userDashboard` - Get user dashboard statistics

## Stripe Integration

The application includes full Stripe integration for credit purchases:

1. **Test Mode**: Use card number `4242 4242 4242 4242` for testing
2. **Webhook Endpoint**: `/api/stripe/webhook`
3. **Supported Events**:
   - `checkout.session.completed` - Credits added after successful payment
   - `payment_intent.succeeded` - Payment confirmed
   - `payment_intent.payment_failed` - Payment failed

### Credit Packages

- **100 Credits** - $5.00 (Perfect for testing)
- **500 Credits** - $20.00 (Great for small projects) ⭐ Most Popular
- **1000 Credits** - $35.00 (Best value for regular users)
- **5000 Credits** - $150.00 (For power users)

## Testing

Run the test suite:

```bash
pnpm test
```

The project includes comprehensive unit tests for all tRPC procedures covering:
- Authentication and authorization
- User management
- Server operations
- Payment processing
- Ticket system
- Statistics and reporting

## Development

### Adding New Features

1. **Database Changes**
   - Update `drizzle/schema.ts`
   - Run `pnpm db:push`
   - Add helpers to `server/db.ts`

2. **Backend API**
   - Add procedures to `server/routers.ts`
   - Write tests in `server/*.test.ts`

3. **Frontend**
   - Create page components in `client/src/pages/`
   - Add routes in `client/src/App.tsx`
   - Use tRPC hooks for data fetching

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling

## Deployment

The application is designed to be deployed on the Manus platform, which provides:

- Automatic environment variable injection
- Database provisioning
- OAuth authentication
- Stripe integration
- SSL certificates
- CDN for static assets

To deploy:

1. Create a checkpoint: The application will create checkpoints automatically
2. Click "Publish" in the management UI
3. Configure custom domain (optional)

## Security

- **Authentication**: OAuth 2.0 via Manus platform
- **Authorization**: Role-based access control (admin/user)
- **Session Management**: HTTP-only cookies with JWT
- **Payment Security**: PCI-compliant via Stripe
- **Database**: Prepared statements via Drizzle ORM
- **API**: Type-safe with tRPC

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create a ticket in the application
- Open an issue on GitHub
- Contact support at https://help.manus.im

## Credits

Built with ❤️ using modern web technologies

- React Team for React
- Vercel for tRPC
- Drizzle Team for Drizzle ORM
- Stripe for payment processing
- shadcn for UI components
- Manus Platform for hosting infrastructure

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Author**: Manus AI
