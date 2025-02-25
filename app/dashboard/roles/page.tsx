"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RolesTable } from "./roles-table"
import { CreateRoleDrawer } from "./create-role-drawer"
import { EditRoleDrawer } from "./edit-role-drawer"
import { fetchRoles } from "@/lib/api"
import { translate } from "./role.translations"
import { usePermission } from "@/hooks/usePermission"
import type { Role, RolesQueryParams } from "@/lib/types"

export default function RolesPage() {
  const { language } = useLanguage()
  const [roles, setRoles] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const hasCreatePermission = usePermission("manager.users.roles.create")
  const hasUpdatePermission = usePermission("manager.users.roles.update")

  const [filters, setFilters] = useState<RolesQueryParams>({
    skip: 0,
    limit: 10,
    lang: language,
    search_query: "",
    order_by: "id",
    order_direction: "DESC",
  })

  const loadRoles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchRoles(filters)
      setRoles(response?.payload ?? [])
      setTotal(response?.total ?? 0)
    } catch (error) {
      console.error("Failed to fetch roles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  const handleCreateRole = () => {
    setIsCreateDrawerOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setIsEditDrawerOpen(true)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setFilters((prev) => ({ ...prev, search_query: term, skip: 0 }))
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      skip: 0,
      limit: 10,
      lang: language,
      search_query: "",
      order_by: "id",
      order_direction: "DESC",
    })
    setSearchTerm("")
    setCurrentPage(1)
  }

  const isAnyFilterApplied =
    filters.search_query !== "" || filters.order_by !== "id" || filters.order_direction !== "DESC"

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{translate("roles.title", language)}</h1>
        {hasCreatePermission && (
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" /> {translate("roles.createNew", language)}
          </Button>
        )}
      </div>

      <RolesTable
        roles={roles}
        total={total}
        currentPage={currentPage}
        isLoading={isLoading}
        searchTerm={searchTerm}
        isFiltersOpen={isFiltersOpen}
        filters={filters}
        isAnyFilterApplied={isAnyFilterApplied}
        hasUpdatePermission={hasUpdatePermission}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        setIsFiltersOpen={setIsFiltersOpen}
        clearAllFilters={clearAllFilters}
        handleEditRole={handleEditRole}
        setCurrentPage={setCurrentPage}
        translate={(key) => translate(key, language)}
      />

      <CreateRoleDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onRoleCreated={loadRoles}
      />

      <EditRoleDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        role={editingRole}
        onRoleUpdated={loadRoles}
      />
    </div>
  )
}

