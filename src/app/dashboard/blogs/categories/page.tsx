import { CategoryList } from "@/components/dashboard/category-list"
import RoleGuard from "@/components/auth/role-guard"

export default function BlogCategoriesPage() {
  return (
    <RoleGuard restrictedRoles={["Team Member"]}>
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
        <CategoryList />
      </div>
    </RoleGuard>
  )
}
