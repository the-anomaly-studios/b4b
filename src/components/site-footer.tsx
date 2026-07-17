import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink bg-ink text-canvas">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <p className="font-display text-4xl font-extrabold uppercase tracking-[-0.035em]">
            The field is talking.
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-canvas/65">
            Discover the performances, traditions, and schools moving HBCU band
            culture forward.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-semibold"
        >
          <Link className="hover:text-accent" href="/">
            Performances
          </Link>
          <Link className="hover:text-accent" href="/leaderboard">
            Rankings
          </Link>
          <Link className="hover:text-accent" href="/schools">
            Schools
          </Link>
          <Link className="hover:text-accent" href="/about">
            How scoring works
          </Link>
        </nav>
      </div>
      <div className="border-t border-canvas/15 px-4 py-5 text-xs text-canvas/55 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Band for Band</span>
          <span>Built to celebrate HBCU band culture</span>
        </div>
      </div>
    </footer>
  );
}
