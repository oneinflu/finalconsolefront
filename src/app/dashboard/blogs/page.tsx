"use client"

import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { FileText, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react"
import { BlogStatusBadge } from "@/components/dashboard/blog-status-badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface Blog {
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

interface Meta {
  total: number
  page: number
  limit: number
  pages: number
}

export default function BlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        // Get role and userId from localStorage
        const userStr = localStorage.getItem("user")
        let queryParams = `?page=${page}&limit=10`

        if (userStr) {
          const user = JSON.parse(userStr)
          if (user.role === "Team Member") {
            queryParams += `&role=Team Member&userId=${user.id}`
          }
        }

        const res = await fetch(`http://localhost:3003/blogs${queryParams}`)
        if (!res.ok) throw new Error("Failed to fetch blogs")
        const data = await res.json()
        setBlogs(data.data)
        setMeta(data.meta)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [page])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const res = await fetch(`http://localhost:3003/blogs/${id}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        setBlogs(prev => prev.filter(blog => blog._id !== id))
      } else {
        alert("Failed to delete blog")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("Error deleting blog")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Blogs
          </h1>
          <p className="text-muted-foreground mt-1">Manage and publish blog content.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/blogs/new")}>Create New Blog</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
          <CardDescription>View and manage all blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading blogs...
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No blogs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                          {blog.image && blog.image.includes("res.cloudinary.com") ? (
                            <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-full w-full flex items-center justify-center text-center bg-gray-50 text-gray-500 border-dashed">
                              Upload Image
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                          {blog.categoryId?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <BlogStatusBadge status={blog.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {blog.date ? format(new Date(blog.date), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => router.push(`/dashboard/blogs/${blog._id}/view`)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-700 hover:bg-amber-50" onClick={() => router.push(`/dashboard/blogs/${blog._id}`)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(blog._id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.pages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
