export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="max-w-2xl text-center">
        <span className="inline-block rounded-full border border-neutral-700 px-4 py-1 text-sm text-neutral-300">
          🚧 Coming Soon
        </span>

        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
          AI Job Tracker
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-400">
          An AI-powered platform to help you organize job applications, manage
          companies, track interviews, and accelerate your job search.
        </p>

        <p className="mt-8 text-xl font-medium text-white">
          The app is coming soon. 🚀
        </p>

        <p className="mt-4 text-sm text-neutral-500">
          Built with Next.js 16, Strapi 5, TypeScript, Tailwind CSS, and pnpm
          Workspaces.
        </p>
      </div>
    </main>
  );
}
