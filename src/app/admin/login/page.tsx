import { LoginScreen } from "@/app/admin/login/_components/login";
import { adminHref } from "@/lib/adminPath";

/* Rendered per request, so the secret address (lib/adminPath.ts) is read at
   request time and never written into a prerendered file by the build. */
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    // noindex comes from app/admin/layout.tsx. The dashboard's address is
    // secret and server-only, so it is handed to the form from here.
    <LoginScreen dashboardHref={adminHref("/dashboard")} />
  );
}
