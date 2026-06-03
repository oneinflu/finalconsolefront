import { LocationList } from "@/components/dashboard/location-list"
import RoleGuard from "@/components/auth/role-guard"

export default function LocationsPage() {
  return (
    <RoleGuard>
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
        <LocationList />
      </div>
    </RoleGuard>
  )
}
