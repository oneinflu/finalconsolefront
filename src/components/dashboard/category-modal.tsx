"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  _id: string
  name: string
  parentId?: {
    _id: string
    name: string
  } | null
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categoryToEdit?: Category | null
  allCategories: Category[]
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
  allCategories
}: CategoryModalProps) {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<string | "none">("none")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setParentId(categoryToEdit.parentId?._id || "none")
    } else {
      setName("")
      setParentId("none")
    }
  }, [categoryToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      parentId: parentId === "none" ? null : parentId
    }

    try {
      const url = categoryToEdit 
        ? `http://localhost:3003/categories/${categoryToEdit._id}`
        : "http://localhost:3003/categories"
      
      const method = categoryToEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        alert("Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Error saving category")
    } finally {
      setLoading(false)
    }
  }

  // Filter out the current category from parent options to avoid circular dependency
  const parentOptions = allCategories.filter(c => c._id !== categoryToEdit?._id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {categoryToEdit ? "Update category details." : "Create a new category for your blogs."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent" className="text-right">
                Parent
              </Label>
              <Select 
                value={parentId} 
                onValueChange={(val) => setParentId(val)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root Category)</SelectItem>
                  {parentOptions.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}