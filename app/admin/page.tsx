// app/admin/page.tsx
//
// This route is protected by middleware.ts (redirects unauthenticated
// users to /admin/login before this ever renders), so no auth check is
// duplicated here — it only renders the actual staff dashboard.
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}
