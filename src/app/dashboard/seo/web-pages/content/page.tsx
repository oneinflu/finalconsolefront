import { WebPagesContentForm } from "@/components/dashboard/web-pages-content-form"
import RoleGuard from "@/components/auth/role-guard"

export default function WebPagesContentPage() {
  return (
    <RoleGuard>
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
        <WebPagesContentForm />
      </div>
    </RoleGuard>
  )
}
