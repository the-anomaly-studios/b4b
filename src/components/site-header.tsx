import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

const navigation = [
  { href: "/", label: "Watch" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/schools", label: "Schools" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink/15 bg-canvas">
      <a
        href="#main-content"
        className="sr-only z-50 bg-ink px-4 py-3 text-canvas focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="shrink-0 font-display text-[1.65rem] font-extrabold uppercase leading-none tracking-[-0.04em] text-ink"
          aria-label="Band for Band home"
        >
          Band <span className="text-accent">for</span> Band
        </Link>

        <nav
          className="ml-auto hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.08em] md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="decoration-2 underline-offset-8 transition-colors hover:text-accent hover:underline focus-visible:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AuthNav />
      </div>

      <nav
        className="flex overflow-x-auto border-t border-ink/10 px-4 md:hidden"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="min-h-12 shrink-0 px-4 py-4 text-xs font-bold uppercase tracking-[0.1em] first:pl-0"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
