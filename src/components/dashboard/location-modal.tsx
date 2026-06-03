"use client"

import { useEffect, useState } from "react"
import { getBaseUrl } from "@/lib/api-config"
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
import { Plus, Trash2 } from "lucide-react"

interface Location {
  _id: string
  name: string
  type: string
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  locationToEdit?: Location | null
}

export function LocationModal({
  isOpen,
  onClose,
  onSuccess,
  locationToEdit
}: LocationModalProps) {
  const [inputs, setInputs] = useState<Array<{ name: string; type: string }>>([{ name: "", type: "city" }])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (locationToEdit) {
      setInputs([{ name: locationToEdit.name, type: locationToEdit.type || "city" }])
    } else {
      setInputs([{ name: "", type: "city" }])
    }
  }, [locationToEdit, isOpen])

  const handleAddInput = () => {
    setInputs([...inputs, { name: "", type: "city" }])
  }

  const handleRemoveInput = (index: number) => {
    if (inputs.length === 1) return
    const updated = inputs.filter((_, i) => i !== index)
    setInputs(updated)
  }

  const handleNameChange = (index: number, nameValue: string) => {
    const updated = [...inputs]
    updated[index] = { ...updated[index], name: nameValue }
    setInputs(updated)
  }

  const handleTypeChange = (index: number, typeValue: string) => {
    const updated = [...inputs]
    updated[index] = { ...updated[index], type: typeValue }
    setInputs(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const baseUrl = getBaseUrl()
      if (locationToEdit) {
        // Edit single location
        const name = inputs[0]?.name?.trim()
        const type = inputs[0]?.type || "city"
        if (!name) {
          alert("Location name cannot be empty")
          setLoading(false)
          return
        }

        const res = await fetch(`${baseUrl}/locations/${locationToEdit._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type })
        })

        if (res.ok) {
          onSuccess()
          onClose()
        } else {
          const err = await res.json()
          alert(err.error || "Failed to update location")
        }
      } else {
        // Add multiple locations
        const validInputs = inputs
          .map(inp => ({ name: inp.name.trim(), type: inp.type }))
          .filter(inp => inp.name !== "")

        if (validInputs.length === 0) {
          alert("Please enter at least one location name")
          setLoading(false)
          return
        }

        // Send array payload
        const res = await fetch(`${baseUrl}/locations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validInputs)
        })

        if (res.ok) {
          onSuccess()
          onClose()
        } else {
          const err = await res.json()
          alert(err.error || "Failed to save locations")
        }
      }
    } catch (error) {
      console.error("Error saving locations:", error)
      alert("Error saving locations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{locationToEdit ? "Edit Location" : "Add Locations"}</DialogTitle>
          <DialogDescription>
            {locationToEdit 
              ? "Update the details of this target location." 
              : "Enter target locations and assign their geographical scope (Type)."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto px-1">
            {inputs.map((inputItem, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Input
                      placeholder="Name (e.g. London)"
                      value={inputItem.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={inputItem.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="city">City</option>
                      <option value="area">Area</option>
                      <option value="state">State</option>
                      <option value="country">Country</option>
                    </select>
                  </div>
                </div>
                {!locationToEdit && inputs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInput(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!locationToEdit && (
            <div className="flex justify-start mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInput}
                className="text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add More
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Locations"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
