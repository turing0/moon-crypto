"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

import { adminConfig } from "@/config/admin";
import { dashboardConfig } from "@/config/dashboard";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import { UserAccountNav } from "./user-account-nav";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const selectedLayout = useSelectedLayoutSegment();
  const admin = selectedLayout === "admin";
  const dashBoard = selectedLayout === "dashboard";
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
    dashboard: dashboardConfig.mainNav,
  };

  const links =
    // (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;
    (selectedLayout && configMap[selectedLayout]) || (session ? dashboardConfig.mainNav : marketingConfig.mainNav);
  const copyTradingLinks = [
    {
      title: "Positions",
      href: "/positions",
    },
    {
      title: "Top Traders",
      href: "/traders",
    },
    {
      title: "Manage Copy-Trading",
      href: "/traders",
    },
  ]
  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {(admin ? adminConfig.mainNav : links).map((item, index) => (
                
              item.dropdown ? (
                <div
                  key={index}
                  className={cn(
                    "relative flex cursor-pointer items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    "text-foreground/60" // Apply the same color as other navigation links
                  )}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {/* <Link href="/positions" className="flex items-center"> */}
                  <Link href={item.dropdown[0].href} className="flex items-center">
                    {item.title} <Icons.chevronDown size="12"/>
                  </Link>
                  {/* {item.title} <Icons.chevronDown size="12"/> */}
                  {isDropdownOpen && (
                    <div
                      className="absolute left-0 top-full w-48 rounded-md border border-gray-200 bg-white shadow-lg"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                            // dropdownItem.disabled && "cursor-not-allowed opacity-80"
                          )}
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                  <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              )
              ))}
              
              {/* <div
                className={cn(
                  "relative flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm cursor-pointer",
                  "text-foreground/60" // Apply the same color as other navigation links
                )}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link href="/positions" className="flex items-center">
                  Copy-Trading <Icons.chevronDown size="12"/>
                </Link>
                {isDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {copyTradingLinks.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                          // item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div> */}

            </nav>
          ) : null}

        </div>

        <div className="flex items-center space-x-3">
          {/* right header for docs */}
          {documentation ? (
            <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
              <div className="hidden lg:flex lg:grow-0">
                <DocsSearch />
              </div>
              <div className="flex lg:hidden">
                <Icons.search className="size-6 text-muted-foreground" />
              </div>
              {/* <div className="flex space-x-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="size-7" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div> */}
            </div>
          ) : null}

          {session ? (
            <>
              {dashBoard || admin ? (
                <div className="flex items-center space-x-3">
                  {dashBoard && session.user.role === "ADMIN" ? (
                    <Link href="/admin" className="hidden md:block">
                      <Button
                        className="gap-2 px-4"
                        variant="outline"
                        size="sm"
                        rounded="xl"
                      >
                        <span>Admin</span>
                      </Button>
                    </Link>
                  ) : null}
                  <UserAccountNav user={session.user} />
                </div>
              ) : (
                // <Link
                //   href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                //   className="hidden md:block"
                // >
                //   <Button
                //     className="gap-2 px-4"
                //     variant="default"
                //     size="sm"
                //     rounded="full"
                //   >
                //     <span>Dashboard</span>
                //   </Button>
                // </Link>
                <UserAccountNav user={session.user} />
              )}
            </>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 px-4 md:flex"
              variant="default"
              size="sm"
              rounded="full"
              onClick={() => setShowSignInModal(true)}
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : (
            <div className="hidden lg:flex">
              {dashBoard || admin ? (
                <Skeleton className="size-9 rounded-full" />
              ) : (
                <Skeleton className="h-9 w-24 rounded-full" />
              )}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
