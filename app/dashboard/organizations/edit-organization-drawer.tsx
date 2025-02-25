"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Building2, Loader2 } from "lucide-react"
import { SearchableOrganizationSelect } from "@/components/SearchableOrganizationSelect"
import { updateOrganization, fetchOrganizationDetail } from "@/lib/api"
import type { Organization, UpdateOrganizationRequest } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import type React from "react"

interface EditOrganizationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  organization: Organization | null
}

export function EditOrganizationDrawer({ open, onOpenChange, onSuccess, organization }: EditOrganizationDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    parent_id: null,
    slug: "",
    names: [
      { name: "", lang: "tk" },
      { name: "", lang: "ru" },
      { name: "", lang: "en" },
    ],
  })
  const [originalData, setOriginalData] = useState<UpdateOrganizationRequest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadOrganizationDetails() {
      if (!organization?.id) return

      try {
        setIsLoadingDetails(true)
        const response = await fetchOrganizationDetail(organization.id, "tk")
        const orgData = response.payload

        const names = [
          { name: orgData.names.find((n) => n.lang === "tk")?.name || "", lang: "tk" },
          { name: organization.names.find((n) => n.lang === "ru")?.name || "", lang: "ru" },
          { name: organization.names.find((n) => n.lang === "en")?.name || "", lang: "en" },
        ]

        const initialData = {
          parent_id: orgData.parent_id,
          slug: orgData.slug,
          names: names,
        }

        setFormData(initialData)
        setOriginalData(initialData)
      } catch (error) {
        console.error("Error loading organization details:", error)
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить данные организации",
        })
        onOpenChange(false)
      } finally {
        setIsLoadingDetails(false)
      }
    }

    if (open && organization?.id) {
      loadOrganizationDetails()
    }
  }, [open, organization, toast, onOpenChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organization?.id || !originalData) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "ID организации не найден или отсутствуют исходные данные",
      })
      return
    }

    const missingLanguages = formData.names.filter((name) => !name.name.trim())
    if (missingLanguages.length > 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Необходимо заполнить название организации на всех языках",
      })
      return
    }

    try {
      setIsLoading(true)

      const changedFields: Partial<UpdateOrganizationRequest> = {}
      if (formData.parent_id !== originalData.parent_id) {
        changedFields.parent_id = formData.parent_id
      }
      if (formData.slug !== originalData.slug) {
        changedFields.slug = formData.slug
      }
      if (JSON.stringify(formData.names) !== JSON.stringify(originalData.names)) {
        changedFields.names = formData.names
      }

      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "Нет изменений",
          description: "Данные организации не были изменены",
        })
        onOpenChange(false)
        return
      }

      await updateOrganization(organization.id, changedFields)

      toast({
        title: "Организация обновлена",
        description: "Данные организации были успешно обновлены",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating organization:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить организацию. Пожалуйста, попробуйте снова.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      names: prev.names.map((name) => (name.lang === lang ? { ...name, name: value } : name)),
    }))
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    </div>
  )

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "tk":
        return "Türkmençe"
      case "ru":
        return "Русский"
      case "en":
        return "English"
      default:
        return lang
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] border-l">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 border-b pb-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <SheetTitle className="text-lg font-semibold">Редактировать организацию</SheetTitle>
              <SheetDescription className="text-sm">Измените информацию об организации в форме ниже</SheetDescription>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {isLoadingDetails ? (
              <LoadingSkeleton />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Родительская организация</Label>
                  <SearchableOrganizationSelect
                    onSelect={(id) => setFormData((prev) => ({ ...prev, parent_id: id }))}
                    language="tk"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Идентификатор
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-3 rounded-lg p-3 bg-muted/50">
                  <h3 className="font-medium">Названия организации</h3>
                  {formData.names
                    .sort((a, b) => {
                      const order = { tk: 1, ru: 2, en: 3 }
                      return order[a.lang as keyof typeof order] - order[b.lang as keyof typeof order]
                    })
                    .map((name) => (
                      <div key={name.lang} className="space-y-2">
                        <Label htmlFor={`name-${name.lang}`} className="text-sm font-medium">
                          {getLanguageLabel(name.lang)}
                        </Label>
                        <Input
                          id={`name-${name.lang}`}
                          value={name.name}
                          onChange={(e) => handleNameChange(name.lang, e.target.value)}
                          placeholder={`Введите название на ${getLanguageLabel(name.lang)}`}
                          required
                        />
                      </div>
                    ))}
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4 mt-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button
              onClick={(e) => handleSubmit(e as any)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || isLoadingDetails}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить изменения"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

