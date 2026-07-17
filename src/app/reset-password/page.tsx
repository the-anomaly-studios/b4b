import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { UpdatePasswordForm } from "@/components/password-forms";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default function ResetPasswordPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <LockKeyhole aria-hidden="true" className="text-accent" size={30} />
      <p className="section-kicker mt-6">Secure your account</p>
      <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-[-0.04em]">
        Choose a new password
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
        Use at least eight characters and choose something you do not reuse on
        another service.
      </p>
      <UpdatePasswordForm />
    </main>
  );
}
