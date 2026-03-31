// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-900">
        <h1 className="text-white font-bold text-xl tracking-tight">
          exac<span className="text-indigo-500">.</span>draw
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-zinc-400 hover:text-white transition-colors text-sm px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-xs font-medium">
            Real-time collaborative canvas
          </span>
        </div>

        {/* heading */}
        <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
          Draw together,
          <br />
          <span className="text-indigo-500">in real time</span>
        </h2>

        {/* subheading */}
        <p className="text-zinc-500 text-lg max-w-md mb-10">
          Create rooms, invite anyone, and collaborate on a shared canvas
          instantly. No setup needed.
        </p>

        {/* cta */}
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Start drawing free
          </Link>
          <Link
            href="/signin"
            className="text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Sign in
          </Link>
        </div>

        {/* features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            {
              title: "Real-time sync",
              desc: "Every stroke synced instantly across all users in the room",
            },
            {
              title: "Persistent canvas",
              desc: "Your drawings are saved — rejoin any time and pick up where you left off",
            },
            {
              title: "No friction",
              desc: "Create a room in seconds. Share the link. Start drawing.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[#111111] border border-zinc-800 rounded-xl p-5 text-left"
            >
              <h3 className="text-white text-sm font-medium mb-1">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* footer */}
      {/* footer */}
      <footer className="px-8 py-8 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          {/* builder info */}
          <div className="flex items-center gap-3">
            {/* github avatar */}
            <img
              src="https://avatars.githubusercontent.com/m-taaha"
              alt="Mohammad Taaha"
              className="w-8 h-8 rounded-full border border-zinc-700"
            />
            <p className="text-zinc-500 text-sm">
              Built by{" "}
              <span className="text-zinc-300 font-medium">Mohammad Taaha</span>
            </p>
          </div>

          {/* socials */}
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/m-taaha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>

            {/* Twitter */}
            <a
              href="https://x.com/_mohammadTaaha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              Twitter
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mohammad-taaha-ashraf-560718248/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
