# EventMentoFrontend

EventMentoFrontend is a modern, responsive event management platform built with Next.js. It provides a seamless experience for event organizers to create and manage events, and for attendees to discover and view event details.

## 🚀 Key Features

- **Authentication & Security**: Secure user authentication integrated with Keycloak (OIDC).
- **Organizer Dashboard**: Dedicated dashboard for organizers to manage their events and view statistics.
- **Event Management**: Create, update, and manage event details including descriptions, dates, and locations.
- **Public Event Listings**: Browse available events with a user-friendly interface.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring compatibility across devices.
- **Modern Tech Stack**: Leveraging the latest features of Next.js 16 and React 19.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Keycloak](https://www.keycloak.org/) (via `react-oidc-context` and `oidc-client-ts`)
- **Icons**: [Lucide React](https://lucide.dev/) (implied/recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (Node Package Manager) or yarn

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd eventmento-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Ensure you have the necessary environment variables configured for Keycloak and your API endpoints. Refer to `.env.local` (create one if it doesn't exist) for configuration.

    Example `.env.local`:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080/realms/eventmento
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=eventmento-frontend
    ```

## 🚀 Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## 📂 Project Structure

A brief overview of the project's directory structure:

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages (protected)
│   ├── events/          # Public event pages
│   ├── layout.js        # Root layout
│   └── page.js          # Landing page
├── Componentes/         # Reusable UI components
│   ├── AuthWrapper.jsx  # Authentication wrapper component
│   ├── Common/          # Common components
│   ├── Dashboard/       # Dashboard-specific components
│   └── ...
├── domain/              # Domain logic and types
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[License Name] - see the [LICENSE](LICENSE) file for details.
