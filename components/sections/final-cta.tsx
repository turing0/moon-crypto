import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FinalCTA() {
  return (
    <>
    {/* <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 sm:py-24"> */}
    <section className="from-primary/10 via-primary/5 to-background py-10 sm:py-16">
      <div className="container flex max-w-5xl flex-col items-center text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {/* Expert Moves, Your Gains */}
          Ready, Set, Auto Trading!
        </h2>
        <p className="mb-6 max-w-2xl text-balance text-muted-foreground sm:text-xl sm:leading-8">
          Copy top traders. Optimize your strategy. Boost your returns.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "w-full sm:w-auto"
            )}
          >
            Start Trading Now
          </Link>
          {/* <Link
            href="/waitlist"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg", rounded: "full" }),
              "w-full sm:w-auto"
            )}
          >
            Join Waitlist
          </Link> */}
        </div>
      </div>
    </section>

    {/* <section className="space-y-6 py-12 sm:py-20 lg:py-20 text-center">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Ready to Elevate Your Trading Game?
        </h2>
        <p className="mt-4 text-lg sm:text-xl">
          Don’t miss out on the opportunity to trade alongside the best. 
          Our platform is designed to maximize your returns with minimal effort.
        </p>
        <p className="mt-2 text-lg sm:text-xl">
          Join our growing community of successful traders today and start seeing real results.
        </p>
        <div className="mt-8">
          <Link
            href="/waitlist"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            )}
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section> */}
    </>
  );
}