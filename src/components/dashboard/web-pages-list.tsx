"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Layout, RefreshCw, FileText, CheckCircle, ArrowRight, Eye, Trash2, Edit } from "lucide-react"

interface Category {
  _id: string
  name: string
}

interface WebPage {
  _id: string
  title: string
  slug: string
  locationId?: {
    name: string
  }
}

export function WebPagesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const baseUrl = getBaseUrl()
      // Fetch categories
      const catRes = await fetch(`${baseUrl}/categories`)
      let categoriesData: Category[] = []
      if (catRes.ok) {
        categoriesData = await catRes.json()
        setCategories(categoriesData)
      }

      // Fetch page counts
      const countsRes = await fetch(`${baseUrl}/web-pages/counts`)
      if (countsRes.ok) {
        const countsData = await countsRes.json()
        setCounts(countsData)
      }
    } catch (error) {
      console.error("Failed to load initial data", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle generating pages
  const handleGenerate = async (categoryId: string, categoryName: string) => {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/web-pages/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId })
      })

      if (res.ok) {
        const result = await res.json()
        alert(`Successfully generated web pages for ${categoryName}! (${result.generatedCount} new pages created)`)
        // Refresh counts
        const countsRes = await fetch(`${baseUrl}/web-pages/counts`)
        if (countsRes.ok) {
          const countsData = await countsRes.json()
          setCounts(countsData)
        }
      } else {
        const err = await res.json()
        alert(err.error || "Failed to generate pages")
      }
    } catch (error) {
      console.error("Error generating pages:", error)
      alert("Error generating pages")
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Course Web Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage dynamically generated SEO landers per course category.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/seo/web-pages/content")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
          <Edit className="mr-2 h-4 w-4" /> Update Web page content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Pages Matrix</CardTitle>
              <CardDescription>
                Overview of SEO landing page counts generated per Course Category.
              </CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Layout className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Course Name</TableHead>
                  <TableHead className="font-semibold">Web Pages Count</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Loading course web pages data...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No courses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => {
                    const count = counts[category._id] || 0
                    return (
                      <TableRow key={category._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            count > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${count > 0 ? "bg-green-500" : "bg-orange-500"}`} />
                            {count} Pages
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Button 
                              variant="outline"
                              size="sm" 
                              onClick={() => handleGenerate(category._id, category.name)}
                              className="text-amber-700 border-amber-200 hover:bg-amber-50 hover:text-amber-800"
                            >
                              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Generate Web Pages
                            </Button>
                            <Button 
                              variant="default"
                              size="sm"
                              disabled={count === 0}
                              onClick={() => router.push(`/dashboard/seo/web-pages/view?categoryId=${category._id}`)}
                              className="bg-primary hover:bg-primary/95"
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" /> View Web Pages
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </>
  )
}
