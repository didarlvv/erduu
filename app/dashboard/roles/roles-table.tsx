"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Filter, ChevronDown, MoreHorizontal, Pencil, Trash2, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { TableWrapper } from "@/components/TableWrapper"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { translate } from "./role.translations"
import type { Role, RolesTableProps } from "@/lib/types"

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function RolesTable({
  roles,
  total,
  currentPage,
  isLoading,
  searchTerm,
  isFiltersOpen,
  filters,
  isAnyFilterApplied,
  hasUpdatePermission,
  onSearch,
  onFilterChange,
  setIsFiltersOpen,
  clearAllFilters,
  handleEditRole,
  setCurrentPage,
}: RolesTableProps) {
  const { language } = useLanguage()
  const [searchInputValue, setSearchInputValue] = useState(searchTerm)

  const handleSearch = useCallback(
    debounce((term: string) => {
      onSearch(term)
    }, 1000),
    [],
  )

  const columns = [
    { key: "role", header: translate("roles.title", language) },
    { key: "slug", header: translate("roles.slug", language) },
    { key: "actions", header: translate("common.actions", language) },
  ]

  const renderRoleRow = (role: Role) => {
    return (
      <TableRow key={role.id}>
        <TableCell className="font-medium">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <div>
              <div className="font-semibold">{role.name}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>{role.slug}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{translate("common.openMenu", language)}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{translate("common.actions", language)}</DropdownMenuLabel>
              {hasUpdatePermission && (
                <DropdownMenuItem onClick={() => handleEditRole(role)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>{translate("common.edit", language)}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{translate("common.delete", language)}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder={translate("roles.searchPlaceholder", language)}
              className="pl-8 w-[300px]"
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {translate("common.filters", language)}
            <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
          </Button>
          {isAnyFilterApplied && (
            <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2">
              {translate("common.clearFilters", language)}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filters.limit.toString()}
            onValueChange={(value) => onFilterChange("limit", Number.parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={translate("common.recordsPerPage", language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 {translate("common.records", language)}</SelectItem>
              <SelectItem value="10">10 {translate("common.records", language)}</SelectItem>
              <SelectItem value="20">20 {translate("common.records", language)}</SelectItem>
              <SelectItem value="50">50 {translate("common.records", language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{translate("common.sortBy", language)}</label>
                  <Select value={filters.order_by} onValueChange={(value) => onFilterChange("order_by", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate("common.selectField", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">ID</SelectItem>
                      <SelectItem value="created_at">{translate("common.creationDate", language)}</SelectItem>
                      <SelectItem value="name">{translate("roles.name", language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{translate("common.direction", language)}</label>
                  <Select
                    value={filters.order_direction}
                    onValueChange={(value) => onFilterChange("order_direction", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={translate("common.selectDirection", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">{translate("common.ascending", language)}</SelectItem>
                      <SelectItem value="DESC">{translate("common.descending", language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{translate("common.language", language)}</label>
                  <Select value={filters.lang} onValueChange={(value) => onFilterChange("lang", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate("common.selectLanguage", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tk">{translate("languageSelector.turkmen", language)}</SelectItem>
                      <SelectItem value="ru">{translate("languageSelector.russian", language)}</SelectItem>
                      <SelectItem value="en">{translate("languageSelector.english", language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <TableWrapper
        data={roles}
        columns={columns}
        loading={isLoading}
        renderRow={renderRoleRow}
        translations={{
          loading: translate("common.loading", language),
          noDataFound: translate("roles.noRolesFound", language),
        }}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {translate("common.showing", language)} {(currentPage - 1) * filters.limit + 1}{" "}
          {translate("common.to", language)} {Math.min(currentPage * filters.limit, total)}{" "}
          {translate("common.of", language)} {total} {translate("common.results", language)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            {translate("common.previous", language)}
          </Button>
          <div className="text-sm">
            {translate("common.page", language)} {currentPage} {translate("common.of", language)}{" "}
            {Math.ceil(total / filters.limit)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(total / filters.limit)))}
            disabled={currentPage === Math.ceil(total / filters.limit) || isLoading}
          >
            {translate("common.next", language)}
          </Button>
        </div>
      </div>
    </div>
  )
}

