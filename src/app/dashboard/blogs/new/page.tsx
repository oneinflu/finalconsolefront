import { BlogForm } from "@/components/dashboard/blog-form"

export default function NewBlogPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-4 md:p-8">
      <BlogForm />
    </div>
  )
}
