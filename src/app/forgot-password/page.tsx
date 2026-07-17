import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { PasswordResetRequestForm } from "@/components/password-forms";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a secure Band for Band password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <KeyRound aria-hidden="true" className="text-accent" size={30} />
      <p className="section-kicker mt-6">Account recovery</p>
      <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-[-0.04em]">
        Get back in the stands
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
        Enter the email attached to your account. We will send a secure link to
        choose a new password.
      </p>
      <PasswordResetRequestForm />
      <Link
        href="/sign-in"
        className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-1 underline-offset-4 hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to sign in
      </Link>
    </main>
  );
}
