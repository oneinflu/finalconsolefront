"use client"

import { useEffect, useState, useRef } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Pencil, Trash2, Upload, Download } from "lucide-react"
import { LocationModal } from "./location-modal"

interface Location {
  _id: string
  name: string
  type: string
  createdAt: string
}

export function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/locations`)
      if (res.ok) {
        const data = await res.json()
        setLocations(data)
      }
    } catch (error) {
      console.error("Failed to fetch locations", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingLocation(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/locations/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        fetchLocations()
      } else {
        alert("Failed to delete location")
      }
    } catch (error) {
      console.error("Error deleting location:", error)
      alert("Error deleting location")
    }
  }

  // Handle CSV Import
  const handleUploadCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/import/locations`, {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        alert("Locations imported successfully!")
        fetchLocations()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to import locations")
      }
    } catch (err) {
      console.error("CSV import error:", err)
      alert("An error occurred during CSV import")
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Handle CSV Export
  const handleDownloadCSV = () => {
    const baseUrl = getBaseUrl()
    window.location.href = `${baseUrl}/locations/export`
  }

  // Helper to format type badge colors
  const getTypeBadgeStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case "country":
        return "border-purple-200 text-purple-700 bg-purple-50"
      case "state":
        return "border-blue-200 text-blue-700 bg-blue-50"
      case "city":
        return "border-emerald-200 text-emerald-700 bg-emerald-50"
      case "area":
        return "border-orange-200 text-orange-700 bg-orange-50"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your target locations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* CSV Import */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleUploadCSV}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          
          {/* CSV Export */}
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>

          {/* Add Location */}
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Locations</CardTitle>
              <CardDescription>
                List of all target locations configured in the system.
              </CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Created At</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading locations...
                    </TableCell>
                  </TableRow>
                ) : locations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No locations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                    <TableRow key={location._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${getTypeBadgeStyles(location.type)}`}>
                          {location.type || "city"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(location.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(location)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(location._id)}
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
      
      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLocations}
        locationToEdit={editingLocation}
      />
    </>
  )
}
