import { WebPagesList } from "@/components/dashboard/web-pages-list"
import RoleGuard from "@/components/auth/role-guard"

export default function WebPagesPage() {
  return (
    <RoleGuard>
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
        <WebPagesList />
      </div>
    </RoleGuard>
  )
}
