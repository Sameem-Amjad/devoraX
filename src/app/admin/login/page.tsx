"use client";
import { LoginScreen } from "@/app/admin/login/_components/login";

export default function LoginPage() {
  return (
    // noindex comes from app/admin/layout.tsx: a "use client" page can't
    // export metadata.
    <LoginScreen onLogin={() => { }} />
  );
}
