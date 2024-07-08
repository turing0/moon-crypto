import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/utils";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Page Not Found – Moon Crypto",
  description: "404 page not found.",
});

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <NavMobile />
      <NavBar scroll={false} />
      <div className="flex grow flex-col items-center justify-center">
        <h1 className="mb-4 text-8xl font-bold">404</h1>
        <p className="mb-4 text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/">
          <Button>
          {"<-"} Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
