"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getBaseUrl } from "@/lib/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Trash2, Eye } from "lucide-react"
import RoleGuard from "@/components/auth/role-guard"

interface WebPage {
  _id: string
  title: string
  slug: string
  categoryId: {
    _id: string
    name: string
  }
  locationId?: {
    name: string
    type: string
  }
}

function WebPagesViewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get("categoryId")
  const [pages, setPages] = useState<WebPage[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryId) return

    const fetchPages = async () => {
      try {
        const baseUrl = getBaseUrl()
        // Fetch pages filtered by category
        const res = await fetch(`${baseUrl}/web-pages?categoryId=${categoryId}`)
        if (res.ok) {
          const data = await res.json()
          setPages(data)
          if (data.length > 0 && data[0].categoryId) {
            setCategoryName(data[0].categoryId.name)
          } else {
            // Retrieve category name from categories list if no pages generated yet
            const catRes = await fetch(`${baseUrl}/categories`)
            if (catRes.ok) {
              const cats = await catRes.json()
              const found = cats.find((c: any) => c._id === categoryId)
              if (found) setCategoryName(found.name)
            }
          }
        }
      } catch (err) {
        console.error("Error loading generated pages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [categoryId])

  const handleDelete = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this web page?")) return

    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/web-pages/${pageId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setPages(prev => prev.filter(p => p._id !== pageId))
      } else {
        alert("Failed to delete web page")
      }
    } catch (err) {
      console.error(err)
      alert("Error deleting web page")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/seo/web-pages")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Generated Pages: <span className="text-primary">{categoryName || "Loading..."}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            List of generated paths and landing pages active for this course category.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Page Directory</CardTitle>
              <CardDescription>
                Live SEO routes matching your target locations matrix.
              </CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Page Title</TableHead>
                  <TableHead className="font-semibold">Target Location</TableHead>
                  <TableHead className="font-semibold">URL Slug</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading pages...
                    </TableCell>
                  </TableRow>
                ) : pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No web pages generated for this course category yet. Click 'Generate Web Pages' on the previous page.
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow key={page._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                          {page.locationId?.name} ({page.locationId?.type})
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        /{page.slug}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => router.push(`/dashboard/seo/web-pages/preview?pageId=${page._id}`)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview Page
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(page._id)}
                          >
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
        </CardContent>
      </Card>
    </div>
  )
}

export default function WebPagesViewPage() {
  return (
    <RoleGuard>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-muted-foreground">Loading view page directory...</p>
        </div>
      }>
        <WebPagesViewContent />
      </Suspense>
    </RoleGuard>
  )
}
