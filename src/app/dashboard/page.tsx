/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  ListFilter,
  MoreVertical,
  Search,
  Truck,
  Users,
  TrendingUp,
  FileText,
  Activity,
  Plus
} from "lucide-react"
import { BlogStatusBadge } from "@/components/dashboard/blog-status-badge"
import { format } from "date-fns"

interface DashboardStats {
  totalUsers: number
  totalBlogs: number
  activeBlogs: number
  categoriesCount: number
  trends: {
    newBlogsLast30Days: number
    newUsersLast30Days: number
  }
}

interface RecentBlog {
  _id: string
  title: string
  categoryId: {
    _id: string
    name: string
  } | null
  status: string
  date: string
  votes: number
  image?: string
  approvedOn?: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const userStr = localStorage.getItem("user")
        let queryParams = ""
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          if (userData.role === "Team Member") {
            queryParams = `?role=Team Member&userId=${userData.id}`
          }
        }

        // Fetch Stats
        const statsRes = await fetch(`https://consoleapis-qqtlx.ondigitalocean.app/dashboard/stats${queryParams}`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        // Fetch Recent Blogs (using queryParams for role filtering)
        const blogsRes = await fetch(`https://consoleapis-qqtlx.ondigitalocean.app/dashboard/recent-blogs${queryParams}`)
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json()
          setRecentBlogs(blogsData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your platform&apos;s performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/dashboard/blogs/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {user?.role !== "Team Member" && (
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : stats?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-600 font-medium">+{stats?.trends.newUsersLast30Days || 0}</span>
                <span className="ml-1">last 30 days</span>
              </p>
            </CardContent>
          </Card>
        )}
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <File className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : stats?.totalBlogs || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-600 font-medium">+{stats?.trends.newBlogsLast30Days || 0}</span>
              <span className="ml-1">last 30 days</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <ListFilter className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : stats?.categoriesCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-muted-foreground">Unique categories</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Blogs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : stats?.activeBlogs || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-green-600 font-medium">Published & Approved</span>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card className="shadow-md border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>
              Manage your blogs and view their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search blogs..."
                  className="pl-8 bg-background"
                />
              </div>
              <div className="flex items-center gap-2">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell font-semibold">
                      Image
                    </TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">
                      Date Posted
                    </TableHead>
                    <TableHead className="text-right font-semibold">Votes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading recent blogs...
                      </TableCell>
                    </TableRow>
                  ) : recentBlogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No blogs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentBlogs.map((blog) => (
                      <TableRow key={blog._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="hidden sm:table-cell">
                          <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs overflow-hidden">
                             {blog.image ? (
                               <img src={blog.image} alt="" className="w-full h-full object-cover" />
                             ) : (
                               "IMG"
                             )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {blog.title}
                        </TableCell>
                        <TableCell>
                          <BlogStatusBadge status={blog.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {blog.categoryId?.name || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-medium">{blog.votes || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
