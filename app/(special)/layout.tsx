import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavMobile } from "@/components/layout/mobile-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      {/* <main className="flex-1">{children}</main> */}
      <main className="flex-1 p-4 xl:px-8">
        <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
          {children}
        </MaxWidthWrapper>
      </main>
      <SiteFooter />
    </div>
  );
}
