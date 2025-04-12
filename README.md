# VM Marketplace

A modern, full-featured virtual machine marketplace built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Marketplace**: Browse and search for virtual machines
- **Custom VM Builder**: Create and configure custom virtual machines
- **Dashboard**: Manage your VMs and monitor usage
- **Authentication**: Secure user authentication and authorization
- **Payment Integration**: Stripe integration for secure payments
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Built-in dark mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts
- **State Management**: React Context
- **Date Handling**: date-fns
- **Validation**: Zod

## 📁 Project Structure

```
VM-Marketplace/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── marketplace/       # VM marketplace
│   ├── custom-vm/         # Custom VM builder
│   ├── payment/           # Payment processing
│   └── providers/         # Context providers
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── payment-methods/  # Payment method components
│   ├── stripe/           # Stripe integration components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Key Components

- **VM Listings**: Browse and filter available virtual machines
- **Custom VM Builder**: Configure custom virtual machines with:
  - OS selection
  - Region selection
  - Network configuration
  - Add-ons
  - Pricing summary
- **Dashboard**: Monitor VM usage and manage deployments
- **Payment System**: Secure payment processing with Stripe
- **Authentication**: User registration and login
- **Provider Registration**: VM provider onboarding

## 🔒 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: NextAuth.js URL

## 📝 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
