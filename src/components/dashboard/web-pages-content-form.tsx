/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { getBaseUrl } from "@/lib/api-config"

export function WebPagesContentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    h2: "",
    content: "",
    image: "",
    keywords: "",
    excerpt: "",
    altTag: "",
    authorName: "NorthStar Academy",
    sections: [{ title: "", content: "", cta: false }],
    faqs: [{ question: "", answer: "" }],
  })

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const baseUrl = getBaseUrl()
        const res = await fetch(`${baseUrl}/web-pages/template`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            title: data.title || "",
            h2: data.h2 || "",
            content: data.content || "",
            image: data.image || "",
            keywords: data.keywords || "",
            excerpt: data.excerpt || "",
            altTag: data.altTag || "",
            authorName: data.authorName || "NorthStar Academy",
            sections: data.sections?.length > 0 ? data.sections : [{ title: "", content: "", cta: false }],
            faqs: data.faqs?.length > 0 ? data.faqs : [{ question: "", answer: "" }],
          })
        }
      } catch (error) {
        console.error("Failed to fetch template", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplate()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Filter out empty sections and FAQs
    const cleanSections = formData.sections.filter((s: any) => s.title && s.content)
    const cleanFaqs = formData.faqs.filter((f: any) => f.question && f.answer)

    const payload = {
      ...formData,
      sections: cleanSections,
      faqs: cleanFaqs
    }

    try {
      const baseUrl = getBaseUrl()
      const url = `${baseUrl}/web-pages/update-content`

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert("Web page content template updated successfully!")
        router.push("/dashboard/seo/web-pages")
      } else {
        const error = await res.json()
        alert(`Failed to save template: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to save template", error)
      alert("An error occurred while saving the web page template.")
    } finally {
      setSaving(false)
    }
  }

  // Component to render helper buttons for regular text input fields
  const VariableInserter = ({ targetField, elementId, onSectionField, sectionIndex }: {
    targetField: string
    elementId: string
    onSectionField?: 'title' | 'question'
    sectionIndex?: number
  }) => {
    const handleInsert = (variable: string) => {
      const el = document.getElementById(elementId) as HTMLInputElement | HTMLTextAreaElement
      if (el) {
        const start = el.selectionStart || 0
        const end = el.selectionEnd || 0
        const val = el.value
        const newVal = val.substring(0, start) + variable + val.substring(end)
        
        if (onSectionField !== undefined && sectionIndex !== undefined) {
          if (targetField === 'sections') {
            updateSection(sectionIndex, 'title', newVal)
          } else if (targetField === 'faqs') {
            updateFaq(sectionIndex, 'question', newVal)
          }
        } else {
          setFormData(prev => ({ ...prev, [targetField]: newVal }))
        }
        
        setTimeout(() => {
          el.focus()
          el.setSelectionRange(start + variable.length, start + variable.length)
        }, 5)
      } else {
        if (onSectionField !== undefined && sectionIndex !== undefined) {
          if (targetField === 'sections') {
            const currentVal = formData.sections[sectionIndex]?.title || ""
            updateSection(sectionIndex, 'title', currentVal + variable)
          } else if (targetField === 'faqs') {
            const currentVal = formData.faqs[sectionIndex]?.question || ""
            updateFaq(sectionIndex, 'question', currentVal + variable)
          }
        } else {
          setFormData(prev => ({ ...prev, [targetField]: (prev as any)[targetField] + variable }))
        }
      }
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 select-none">
        <span className="text-[10px]">Insert helper:</span>
        <button
          type="button"
          onClick={() => handleInsert('[course]')}
          className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-mono font-bold text-[10px] transition-colors"
        >
          [course]
        </button>
        <button
          type="button"
          onClick={() => handleInsert('[location]')}
          className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-mono font-bold text-[10px] transition-colors"
        >
          [location]
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">Loading content template details...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" type="button" onClick={() => router.push("/dashboard/seo/web-pages")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Update Web Page Content</h1>
            <p className="text-muted-foreground">
              Define the global SEO landing page contents, sections, and FAQ layouts.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/seo/web-pages")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </div>

      {/* Dynamic Variables Guide Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">Dynamic SEO Template Variables</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use the dynamic placeholders below in any input or text field. They will be auto-replaced with target course names and location names during page generation:
          </p>
          <div className="flex gap-2 mt-2 select-none">
            <code className="text-xs font-mono font-bold bg-amber-100/70 border border-amber-200 text-amber-800 px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-200/80 transition-colors" onClick={() => { navigator.clipboard.writeText('[course]'); alert('Copied [course]') }} title="Click to copy">[course]</code>
            <code className="text-xs font-mono font-bold bg-blue-100/70 border border-blue-200 text-blue-800 px-1.5 py-0.5 rounded cursor-pointer hover:bg-blue-200/80 transition-colors" onClick={() => { navigator.clipboard.writeText('[location]'); alert('Copied [location]') }} title="Click to copy">[location]</code>
            <span className="text-[10px] text-muted-foreground self-center italic">(Click tags to copy)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Page Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Hero Title Template <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter page main H1 title (e.g. Best [course] course near me)"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <VariableInserter targetField="title" elementId="title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="h2">Heading 2 / Sub-heading <span className="text-red-500">*</span></Label>
                <Input
                  id="h2"
                  name="h2"
                  placeholder="Enter a subtitle or H2 (e.g. Best [course] course in [location])"
                  value={formData.h2}
                  onChange={handleChange}
                  required
                />
                <VariableInserter targetField="h2" elementId="h2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Initial Content <span className="text-red-500">*</span></Label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                  showPlaceholders={true}
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
                    <Label htmlFor={`sec-title-${index}`}>Section Title</Label>
                    <Input 
                      id={`sec-title-${index}`}
                      value={section.title} 
                      onChange={(e) => updateSection(index, 'title', e.target.value)} 
                      placeholder="Section Title"
                    />
                    <VariableInserter targetField="sections" elementId={`sec-title-${index}`} onSectionField="title" sectionIndex={index} />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Content</Label>
                    <RichTextEditor 
                      value={section.content} 
                      onChange={(val) => updateSection(index, 'content', val)}
                      showPlaceholders={true}
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
                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                    <Input 
                      id={`faq-question-${index}`}
                      value={faq.question} 
                      onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                      placeholder="Enter question"
                    />
                    <VariableInserter targetField="faqs" elementId={`faq-question-${index}`} onSectionField="question" sectionIndex={index} />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <RichTextEditor 
                      value={faq.answer} 
                      onChange={(val) => updateFaq(index, 'answer', val)}
                      showPlaceholders={true}
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
                  <VariableInserter targetField="keywords" elementId="keywords" />
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
                  <VariableInserter targetField="excerpt" elementId="excerpt" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
