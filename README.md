# 🤖 AI Job Tracker

An AI-powered job application tracking platform built with **Next.js 16**, **Strapi 5**, **TypeScript**, and **pnpm Workspaces**.

The project is structured as a modern monorepo, separating the frontend, CMS, and shared packages for scalability and maintainability.

---

## ✨ Features

- 📋 Track job applications
- 🤖 AI-assisted job application management
- 📝 Manage companies, applications, and notes
- 🔐 Authentication
- 📊 Dashboard and analytics
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Turbopack
- 🧩 Shared packages using pnpm Workspaces

---

## 📦 Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint

### Backend

- Strapi 5
- SQLite (development)
- REST API

### Monorepo

- pnpm Workspaces

---

## 📁 Project Structure

```text
ai-job-tracker/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── cms/                 # Strapi CMS
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared configuration
│   └── types/               # Shared TypeScript types
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

Verify your installation:

```bash
node -v
pnpm -v
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/mokone-september/ai-job-tracker.git
```

Move into the project:

```bash
cd ai-job-tracker
```

Install dependencies:

```bash
pnpm install
```

---

## ▶️ Development

### Run the Next.js application

```bash
pnpm dev:web
```

Runs on:

```
http://localhost:3000
```

---

### Run Strapi

```bash
pnpm dev:cms
```

Runs on:

```
http://localhost:1337/admin
```

---

## 📦 Workspace Commands

Install dependencies:

```bash
pnpm install
```

Add a package to the frontend:

```bash
pnpm --filter web add package-name
```

Add a package to Strapi:

```bash
pnpm --filter cms add package-name
```

Add a shared dependency:

```bash
pnpm add package-name -w
```

---

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start Next.js |
| `pnpm dev:cms` | Start Strapi |
| `pnpm install` | Install dependencies |

---

## 📈 Roadmap

- [ ] Authentication
- [ ] User accounts
- [ ] AI-powered CV analysis
- [ ] AI interview preparation
- [ ] Resume management
- [ ] Company tracker
- [ ] Job application dashboard
- [ ] Calendar integration
- [ ] Email reminders
- [ ] Analytics
- [ ] Dark mode
- [ ] Docker support
- [ ] CI/CD with GitHub Actions
- [ ] Testing with Playwright

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Thabiso Kenneth Mokone**

- GitHub: https://github.com/mokone-september
- LinkedIn: https://www.linkedin.com/in/mokone-september/

---

Built with ❤️ using Next.js, Strapi, TypeScript, and pnpm Workspaces.
