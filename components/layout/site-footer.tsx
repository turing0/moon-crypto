import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

const socialLinks = [
  { icon: Icons.twitter, href: 'https://twitter.com/yourcompany' },
  { icon: Icons.twitter, href: 'https://linkedin.com/company/yourcompany' },
];

export function SiteFooter({ className, showLinks = false }: React.HTMLAttributes<HTMLElement >& { showLinks?: boolean }) {
  return (
    <footer className={cn("border-t", className)}>
      {/* {showLinks && (<div className="container grid max-w-6xl grid-cols-1 gap-6 py-14 sm:grid-cols-2 md:grid-cols-5"> */}
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-3">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div> */}
      </div>
      {/* <div className="container max-w-6xl py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <span className="text-sm font-medium text-foreground">
                {section.title}
              </span>
              <ul className="mt-4 space-y-3">
                {section.items?.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Site Name</h2>
            <p className="text-sm text-muted-foreground">Your catchy tagline goes here. Showcase your brand's essence.</p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }) => (
                <Link key={href} href={href} className="text-muted-foreground hover:text-primary">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      
      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
          <p className="text-left text-sm text-muted-foreground">
            © 2024{" "}
            <Link
              // href={siteConfig.links.twitter}
              href="/"
              target="_blank"
              rel="noreferrer"
              // className="font-medium underline underline-offset-4"
              className="font-medium"
            >
              MoonCrypto
            </Link>
              {" "}- Utilizing methods from top crypto trading experts.
            {/* <Link
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link> */}
          </p>

          <div className="flex items-center gap-3">
            {/* <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <Icons.gitHub className="size-5" />
            </Link> */}
            {/* <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.icon.name}</span>
                </Link>
              ))}
            </div> */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
