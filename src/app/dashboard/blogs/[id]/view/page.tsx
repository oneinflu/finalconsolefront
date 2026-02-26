/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, User } from "lucide-react"
import { format } from "date-fns"

export default function ViewBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchBlogData(id as string)
    }
  }, [id])

  const fetchBlogData = async (blogId: string) => {
    try {
      const res = await fetch(`http://localhost:3003/blogs/${blogId}`)
      if (res.ok) {
        const data = await res.json()
        setBlog(data)
      }
    } catch (error) {
      console.error("Failed to fetch blog", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8 items-center justify-center">
        <p>Loading blog details...</p>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8 items-center justify-center">
        <p>Blog not found.</p>
        <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard/blogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>
          <div className="flex gap-2">
            {blog.status === "DRAFT" && user?.role !== "Team Member" && (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  if (confirm("Are you sure you want to approve this blog?")) {
                    try {
                      const res = await fetch(`http://localhost:3003/blogs/${blog._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...blog, status: "APPROVED" })
                      })
                      if (res.ok) {
                        setBlog({ ...blog, status: "APPROVED" })
                        alert("Blog approved successfully!")
                      } else {
                        alert("Failed to approve blog")
                      }
                    } catch (error) {
                      console.error("Error approving blog", error)
                      alert("Error approving blog")
                    }
                  }
                }}
              >
                Approve Blog
              </Button>
            )}
            <Button onClick={() => router.push(`/dashboard/blogs/${id}`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Blog
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          {blog.image && (
            <div className="w-full h-64 md:h-96 relative">
              <img 
                src={blog.image} 
                alt={blog.altTag || blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={blog.status === "APPROVED" ? "default" : "secondary"}>
                {blog.status}
              </Badge>
              {blog.date && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {format(new Date(blog.date), "PPP")}
                </span>
              )}
            </div>
            <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {blog.title}
            </CardTitle>
            {blog.h2 && (
              <h2 className="text-xl text-muted-foreground font-medium">
                {blog.h2}
              </h2>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <User className="h-4 w-4" />
              <span>{blog.authorName || "Unknown Author"}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Initial Content */}
            <Card>
              <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.initialContent }} />
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            {blog.sections?.map((section: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.section}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  {section.cta === "yes" && (
                    <div className="mt-6 p-4 bg-muted rounded-lg border text-center">
                      <p className="font-semibold mb-2">Interested? Take action now!</p>
                      <Button>Call to Action</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* FAQs */}
            {blog.faqs?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {blog.faqs.map((faq: any, index: number) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <div 
                        className="text-muted-foreground prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }} 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="font-mono text-sm break-all">{blog.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blog.keywords?.split(",").map((k: string, i: number) => (
                      <Badge key={i} variant="outline">{k.trim()}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category ID</p>
                  <p className="text-sm">{blog.categoryId?.name || blog.categoryId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}