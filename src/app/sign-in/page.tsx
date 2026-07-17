import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Member access",
  description: "Sign in to support and upload HBCU band performances.",
};

type SignInPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1">
      <div className="grid min-h-[68vh] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center bg-ink px-5 py-14 text-canvas sm:px-10 lg:px-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
            Member access
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(4rem,8vw,7rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
            Put your school behind every vote.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-canvas/65">
            Join the community behind the performances. Your account keeps every
            vote verified and connects your support to the school you represent.
          </p>
        </section>
        <section className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-16">
          <LockKeyhole aria-hidden="true" className="text-accent" size={28} />
          <h2 className="mt-5 font-display text-4xl font-extrabold uppercase">
            Your seat is waiting
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Sign in to support performances, choose your school, and prepare to
            share your own field moments.
          </p>
          <div className="mt-7">
            <AuthForm next={params.next} error={params.error} />
          </div>
        </section>
      </div>
    </main>
  );
}
