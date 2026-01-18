import ResumeForm from "@/components/ResumeForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* You can adjust max-w-7xl or use max-w-full for truly full width */}
        <div className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8 md:p-12">
          <ResumeForm />
        </div>
      </main>
    </div>
  );
}