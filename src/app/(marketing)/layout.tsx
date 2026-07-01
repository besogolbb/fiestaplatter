import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {/* pb accounts for the sticky mobile order bar */}
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <FloatingCta />
    </div>
  );
}
