/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { BlogForm } from "@/components/dashboard/blog-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { getBaseUrl } from "@/lib/api-config"

export default function EditBlogPage() {
  const params = useParams()
  const id = params?.id as string
  const [blogData, setBlogData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchBlogData(id)
    }
  }, [id])

  const fetchBlogData = async (blogId: string) => {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/blogs/${blogId}`)
      if (res.ok) {
        const data = await res.json()
        
        // Transform data to match form expectations
        const formattedData = {
          ...data,
          // Ensure categoryId is in the format { _id: "..." }
          categoryId: data.categoryId?._id ? data.categoryId : { _id: data.categoryId },
          sections: (data.sections || []).map((s: any) => ({
            title: s.section || s.title || "",
            content: s.content || "",
            cta: s.cta === "yes" || s.cta === true
          })),
          // Ensure faqs are present and correctly formatted
          faqs: (data.faqs || []).map((f: any) => ({
            question: f.question || "",
            answer: f.answer || ""
          }))
        }
        
        setBlogData(formattedData)
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

  if (!blogData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8 items-center justify-center">
        <p>Blog not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <BlogForm initialData={blogData} isEditing={true} />
    </div>
  )
}
