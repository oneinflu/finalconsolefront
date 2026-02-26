/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useEffect } from "react"

interface BlogFormProps {
  initialData?: any
  isEditing?: boolean
}

interface Category {
  _id: string
  name: string
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    h2: initialData?.h2 || "",
    content: initialData?.initialContent || "",
    image: initialData?.image || "",
    categoryId: initialData?.categoryId?._id || "",
    // status and date are handled by backend automatically
    keywords: initialData?.keywords || "",
    excerpt: initialData?.excerpt || "",
    altTag: initialData?.altTag || "",
    authorName: initialData?.authorName || "NorthStar Academy",
    sections: initialData?.sections?.length > 0 ? initialData.sections : [{ title: "", content: "", cta: false }],
    faqs: initialData?.faqs?.length > 0 ? initialData.faqs : [{ question: "", answer: "" }],
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://consoleapis-qqtlx.ondigitalocean.app/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  // Dynamic Sections Handlers
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "", cta: false }]
    }))
  }

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...formData.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  const removeSection = (index: number) => {
    const newSections = formData.sections.filter((_: any, i: number) => i !== index)
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  // Dynamic FAQs Handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }))
  }

  const updateFaq = (index: number, field: string, value: any) => {
    const newFaqs = [...formData.faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setFormData(prev => ({ ...prev, faqs: newFaqs }))
  }

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_: any, i: number) => i !== index)
    setFormData(prev => ({ ...prev, faqs: newFaqs }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    // Date handling removed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty sections and FAQs
    const cleanSections = formData.sections.filter((s: any) => s.title && s.content)
    const cleanFaqs = formData.faqs.filter((f: any) => f.question && f.answer)

    const payload = {
      ...formData,
      sections: cleanSections,
      faqs: cleanFaqs
    }

    try {
      const url = isEditing 
        ? `https://consoleapis-qqtlx.ondigitalocean.app/blogs/${initialData._id}` // Update URL (needs PUT endpoint)
        : "https://consoleapis-qqtlx.ondigitalocean.app/blogs"

      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert(isEditing ? "Blog updated successfully!" : "Blog created successfully!")
        router.push("/dashboard/blogs")
      } else {
        const error = await res.json()
        alert(`Failed to save blog: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to save blog", error)
      alert("An error occurred while saving the blog.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" type="button" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Blog" : "Create New Blog"}</h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your blog post details." : "Fill in the details to create a new blog post."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/blogs")}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category <span className="text-red-500">*</span></Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="h2">Heading 2 / Sub-heading <span className="text-red-500">*</span></Label>
                <Input
                  id="h2"
                  name="h2"
                  placeholder="Enter a subtitle or H2"
                  value={formData.h2}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Initial Content <span className="text-red-500">*</span></Label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sections</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" /> Add Section
              </Button>
            </div>
            
            {formData.sections.map((section: any, index: number) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Section {index + 1}</CardTitle>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                      value={section.title} 
                      onChange={(e) => updateSection(index, 'title', e.target.value)} 
                      placeholder="Section Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Content</Label>
                    <RichTextEditor 
                      value={section.content} 
                      onChange={(val) => updateSection(index, 'content', val)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`cta-${index}`}
                      checked={section.cta} 
                      onChange={(e) => updateSection(index, 'cta', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`cta-${index}`} className="mb-0 cursor-pointer">Include CTA after this section?</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dynamic FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                <Plus className="h-4 w-4 mr-2" /> Add FAQ
              </Button>
            </div>
            
            {formData.faqs.map((faq: any, index: number) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">FAQ {index + 1}</CardTitle>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input 
                      value={faq.question} 
                      onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <RichTextEditor 
                      value={faq.answer} 
                      onChange={(val) => updateFaq(index, 'answer', val)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0]
                        const formData = new FormData()
                        formData.append("file", file)

                        try {
                          const res = await fetch("https://consoleapis-qqtlx.ondigitalocean.app/upload", {
                            method: "POST",
                            body: formData,
                          })
                          
                          if (res.ok) {
                            const data = await res.json()
                            setFormData(prev => ({ ...prev, image: data.url }))
                          } else {
                            console.error("Image upload failed")
                            alert("Failed to upload image")
                          }
                        } catch (error) {
                          console.error("Error uploading image:", error)
                          alert("Error uploading image")
                        }
                      }
                    }} />
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="altTag">Image Alt Tag <span className="text-red-500">*</span></Label>
                <Input
                  id="altTag"
                  name="altTag"
                  placeholder="Image description"
                  value={formData.altTag}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {formData.image && (
                <div className="mt-4 rounded-md overflow-hidden border aspect-video relative group">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    placeholder="Comma separated keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Meta Description</Label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Short summary for SEO..."
                    value={formData.excerpt}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name Override</Label>
                  <Input
                    id="authorName"
                    name="authorName"
                    placeholder="e.g. John Doe"
                    value={formData.authorName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
