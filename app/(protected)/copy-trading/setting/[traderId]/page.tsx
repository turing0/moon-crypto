import { DashboardShell } from "@/components/dashboard/shell";


export default function CopyTradingSettingPage({ params }: { params: { traderId: string } }) {
  
  return (
    <DashboardShell>

    <div>traderId: {params.traderId}</div>
    </DashboardShell>
  )
}
