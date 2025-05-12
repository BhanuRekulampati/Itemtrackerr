# QR Code Lost and Found System

A web application that helps people recover lost items through QR codes. When a QR code attached to an item is scanned, it displays the owner's contact information.

## Features

- **User Authentication**: Secure login and registration system
- **QR Code Generation**: Create unique QR codes for your items
- **Item Management**: Add, edit, and remove items from your account
- **Contact Information**: When a QR code is scanned, it shows the owner's contact details
- **Scan Tracking**: Track when and how many times your QR codes have been scanned

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI Components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **QR Codes**: qrcode.react library

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/            # React source files
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── server/             # Backend Express server
│   ├── auth.ts         # Authentication logic
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage interface
├── shared/             # Shared code between frontend and backend
│   └── schema.ts       # Database schema definitions
└── ...                 # Configuration files
```

## Setting Up

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up the environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Secret for session encryption
4. Run database migrations with `npm run db:push`
5. Start the development server with `npm run dev`

## Usage

1. Register an account
2. Create QR codes for your valuable items
3. Print and attach the QR codes to your items
4. If someone finds your lost item, they can scan the QR code and contact you

## License

MIT