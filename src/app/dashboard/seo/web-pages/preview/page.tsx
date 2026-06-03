"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getBaseUrl } from "@/lib/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Laptop, Share2, HelpCircle, CheckSquare, Layers } from "lucide-react"
import RoleGuard from "@/components/auth/role-guard"

interface WebPage {
  _id: string
  title: string
  h2: string
  content: string
  keywords: string
  excerpt: string
  slug: string
  status: string
  categoryId: {
    name: string
  }
  locationId?: {
    name: string
    type: string
  }
  sections?: Array<{
    title: string
    content: string
    cta: boolean
    _id: string
  }>
  faqs?: Array<{
    question: string
    answer: string
    _id: string
  }>
}

function WebPagesPreviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pageId = searchParams.get("pageId")
  const [pageData, setPageData] = useState<WebPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageId) return

    const fetchPage = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/web-pages/${pageId}`)
        if (res.ok) {
          const data = await res.json()
          setPageData(data)
        }
      } catch (err) {
        console.error("Error fetching preview page data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [pageId])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">Loading landing page preview simulation...</p>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Web Page Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested generated landing page could not be located.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SEO Web Page Live Preview</h1>
            <p className="text-muted-foreground">
              Mock preview of dynamic contents resolved for {pageData.categoryId?.name} in {pageData.locationId?.name}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 capitalize">
            {pageData.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Share / PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Metadata & Details inspector */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                SEO Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">URL Path</span>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded break-all block mt-1">
                  /{pageData.slug}
                </code>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">Keywords</span>
                <p className="text-foreground mt-1 text-xs">{pageData.keywords || "-"}</p>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">Meta Description</span>
                <p className="text-foreground mt-1 text-xs leading-relaxed">{pageData.excerpt || "-"}</p>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">Course Category</span>
                <p className="text-foreground mt-0.5 font-medium">{pageData.categoryId?.name}</p>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">Target Location</span>
                <p className="text-foreground mt-0.5 font-medium capitalize">
                  {pageData.locationId?.name} ({pageData.locationId?.type})
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Simulated Live Website viewport */}
        <div className="lg:col-span-3">
          <Card className="border border-slate-200 shadow-md rounded-lg overflow-hidden">
            {/* Mock browser top bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                <span className="w-3 h-3 rounded-full bg-green-400 block" />
              </div>
              <div className="bg-white rounded border text-xs text-muted-foreground px-3 py-1 font-mono text-center flex-1 max-w-xl mx-auto shadow-sm truncate">
                https://northstaracademy.in/{pageData.slug}
              </div>
            </div>

            {/* Simulated viewport body */}
            <div className="p-6 md:p-10 space-y-10 bg-white min-h-[600px] text-slate-800">
              
              {/* Hero Section */}
              <div className="border-b pb-8 space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  {pageData.title}
                </h1>
                <p className="text-xl md:text-2xl font-medium text-slate-600">
                  {pageData.h2}
                </p>
              </div>

              {/* Initial content */}
              {pageData.content && (
                <div 
                  className="prose max-w-none text-slate-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              )}

              {/* Dynamic Sections Loop */}
              {pageData.sections && pageData.sections.length > 0 && (
                <div className="space-y-8 border-t pt-8">
                  <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Additional Landing Sections
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {pageData.sections.map((section, sIdx) => (
                      <div key={section._id || sIdx} className="bg-slate-50 border rounded-lg p-5 space-y-3">
                        <h4 className="text-lg font-bold text-slate-900">{section.title}</h4>
                        <div 
                          className="prose max-w-none text-sm text-slate-700 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                        {section.cta && (
                          <div className="mt-4 pt-2">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                              Enquire for {pageData.categoryId?.name} classes
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic FAQs Loop */}
              {pageData.faqs && pageData.faqs.length > 0 && (
                <div className="space-y-6 border-t pt-8">
                  <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {pageData.faqs.map((faq, fIdx) => (
                      <div key={faq._id || fIdx} className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-start gap-2">
                          <span className="font-bold text-primary">Q.</span>
                          <span>{faq.question}</span>
                        </h4>
                        <div 
                          className="prose max-w-none text-sm text-slate-700 pl-6 border-l-2 border-slate-100" 
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function WebPagesPreviewPage() {
  return (
    <RoleGuard>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-muted-foreground">Loading preview simulation viewport...</p>
        </div>
      }>
        <WebPagesPreviewContent />
      </Suspense>
    </RoleGuard>
  )
}
