import { headers } from "next/headers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { getBusinessHours } from "@/lib/business-hours";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const { hours, manualOverride } = await getBusinessHours();

  return (
    <>
      <Nav />
      {children}
      <Footer hours={hours} manualOverride={manualOverride} />
    </>
  );
}
