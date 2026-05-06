"use client"

import { useEffect, useState } from "react"
import { getBaseUrl } from "@/lib/api-config"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Settings2 } from "lucide-react"

interface Permission {
  _id: string
  groupName: string
  actionName: string
  createdAt: string
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/team/permissions`)
        if (!res.ok) throw new Error("Failed to fetch permissions")
        const data = await res.json()
        setPermissions(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings2 className="h-8 w-8 text-primary" />
          Permissions
        </h1>
        <p className="text-muted-foreground mt-1">Manage system permissions and access controls.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Permissions</CardTitle>
          <CardDescription>A comprehensive list of system permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Group</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Loading permissions...
                    </TableCell>
                  </TableRow>
                ) : permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No permissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((perm) => (
                    <TableRow key={perm._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <Badge variant="secondary">{perm.groupName}</Badge>
                      </TableCell>
                      <TableCell>
                        {perm.actionName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(perm.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
