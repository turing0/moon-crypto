import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = constructMetadata({
  title: "Billing – Moon Crypto",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    redirect("/login");
  }

  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">

      <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Payment History</CardTitle>
            {/* <CardDescription>
              Recent orders from your store.
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Chain
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                  {/* <TableHead className="text-right">Amount</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* <TableRow className="bg-accent"> */}
                <TableRow>
                  <TableCell>
                    <div className="font-medium">ETH</div>
                    {/* <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div> */}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    ERC20
                  </TableCell>
                  <TableCell>2.50</TableCell>
                  <TableCell>0x112</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="secondary">
                      Fulfilled
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    2024-06-12 10:42:35
                  </TableCell>
                  {/* <TableCell className="text-right">$250.00</TableCell> */}
                  
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">USDT</div>
                    {/* <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div> */}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    TRC20
                  </TableCell>
                  <TableCell>150.00</TableCell>
                  <TableCell>0x113</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="outline">
                      Declined
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    2024-06-04 10:42:39
                  </TableCell>
                  {/* <TableCell className="text-right">$150.00</TableCell> */}
                  
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            SaaS Starter app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert> */}
        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
