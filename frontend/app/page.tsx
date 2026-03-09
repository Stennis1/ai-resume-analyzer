import ThemeToggle from "@/components/ThemeToggle";
import ResumeForm from "@/components/ResumeForm";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute top-0 left-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(22,163,74,0.24),_transparent_60%)] blur-3xl" />
        <div className="absolute right-[-8rem] bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.22),_transparent_60%)] blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
              Intelligent Career Review
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Resume analysis for modern hiring teams
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <ResumeForm />
      </main>
    </div>
  );
}
