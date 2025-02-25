"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OrganizationsTable } from "./organizations-table"
import { CreateOrganizationDrawer } from "./create-organization-drawer"
import { EditOrganizationDrawer } from "./edit-organization-drawer"
import { fetchOrganizations } from "@/lib/api"
import { organizationTranslations } from "./organization.translations"
import type { Organization, OrganizationsQueryParams } from "@/lib/types"

export default function OrganizationsPage() {
  const { language } = useLanguage()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)

  const [filters, setFilters] = useState<OrganizationsQueryParams>({
    skip: 1,
    limit: 10,
    lang: language,
    search_query: "",
    order_by: "id",
    order_direction: "DESC",
  })

  const translate = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      let translation: any = organizationTranslations[language as keyof typeof organizationTranslations] ?? {}
      for (const k of keys) {
        translation = translation[k] ?? key
        if (typeof translation === "string") break
      }
      return translation
    },
    [language],
  )

  const loadOrganizations = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchOrganizations(filters)
      setOrganizations(response?.payload ?? [])
      setTotal(response?.total ?? 0)
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const handleCreateOrganization = () => {
    setIsCreateDrawerOpen(true)
  }

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization)
    setIsEditDrawerOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setFilters((prev) => ({ ...prev, skip: (page - 1) * prev.limit }))
  }

  const handleSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, search_query: term, skip: 0 }))
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }))
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{translate("organizations.title")}</h1>
        <Button onClick={handleCreateOrganization}>
          <Plus className="mr-2 h-4 w-4" /> {translate("organizations.createNew")}
        </Button>
      </div>

      <OrganizationsTable
        organizations={organizations}
        total={total}
        currentPage={currentPage}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        loading={isLoading}
        onEditOrganization={handleEditOrganization}
        currentLanguage={language}
        translations={{
          noData: translate("organizations.noOrganizationsFound"),
          search: translate("organizations.search"),
        }}
      />

      <CreateOrganizationDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onOrganizationCreated={loadOrganizations}
      />

      <EditOrganizationDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        organization={editingOrganization}
        onOrganizationUpdated={loadOrganizations}
      />
    </div>
  )
}

