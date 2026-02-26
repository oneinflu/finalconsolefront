import { Badge } from "@/components/ui/badge"

export function BlogStatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        APPROVED
      </Badge>
    )
  }

  if (status === "DRAFT") {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
        DRAFT
      </Badge>
    )
  }
  
  return (
    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
      {status}
    </Badge>
  )
}
