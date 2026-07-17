"use client";

import Link from "next/link";
import { ArrowUpRight, CircleUserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const username =
    typeof user?.user_metadata.username === "string"
      ? user.user_metadata.username
      : user?.email?.split("@")[0];

  async function signOut() {
    if (!configured) return;
    await createClient().auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="ml-auto flex items-stretch md:ml-4">
      <Link
        href={user ? "/account" : "/sign-in"}
        className="inline-flex min-h-11 items-center gap-2 border border-ink bg-ink px-4 text-sm font-bold text-canvas transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <CircleUserRound aria-hidden="true" size={18} />
        <span className="hidden max-w-28 truncate sm:inline">
          {user ? username : "Sign in"}
        </span>
        <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
      {user ? (
        <button
          type="button"
          onClick={signOut}
          className="hidden min-h-11 place-items-center border-y border-r border-ink px-3 transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut aria-hidden="true" size={17} />
        </button>
      ) : null}
    </div>
  );
}
