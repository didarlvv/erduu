// Define all types within this file

// External Mail Types
export interface Organization {
  // Define the Organization type here
  id: number
  name: string
  // Add other necessary properties
}

export interface Responsibility {
  // Define the Responsibility type here
  id: number
  name: string
  // Add other necessary properties
}

export interface MailType {
  // Define the MailType type here
  id: number
  name: string
  // Add other necessary properties
}

export interface ExternalMailsResponse {
  payload: {
    data: ExternalMail[]
    total: number
  }
}

export interface ExternalMailsQueryParams {
  skip?: number
  limit?: number
  order_direction?: "ASC" | "DESC"
  order_by?: string
  lang?: string
  type?: "inbox" | "outbox"
  is_archived?: boolean
  search?: string
  organization_id?: number
  responsibility_id?: number
  mail_type_id?: number
  status?: string
  start_date?: number
  end_date?: number
}

export interface CreateExternalMailRequest {
  full_name: string
  title: string
  description: string
  organization_id: number
  responsibility_id: number
  mail_type_id: number
  type: "inbox" | "outbox"
  file_ids: number[]
  received_time: number
  external_registration_code: string
  internal_registration_code: string
}

export interface ExternalMail {
  id: number
  title: string
  description: string
  full_name: string
  organization: Organization
  responsibility: Responsibility
  mail_type: MailType
  type: "inbox" | "outbox"
  status: string
  received_time: string
  sent_time: string
  created_at: string
  updated_at: string
  external_registration_code: string
  internal_registration_code: string
}

export interface ExternalMailDetail extends ExternalMail {
  files?: {
    id: number
    path: string
    original_name: string
    size: number
  }[]
  first_name: string
  last_name: string
}

// User Types
export interface Role {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Permission {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  username: string
  phone: number
  first_name: string
  last_name: string
  email: string
  status: "active" | "inactive" | "blocked"
  created_at: string
  roles: Role[]
  permissions: Permission[]
}

export interface CreateUserRequest {
  username: string
  phone: number
  password: string
  first_name: string
  last_name: string
  email: string
  role_ids: number[]
  permission_ids: number[]
  status: "active" | "inactive" | "blocked"
}

export interface UpdateUserRequest {
  username?: string
  phone?: number
  password?: string
  first_name?: string
  last_name?: string
  email?: string
  role_ids?: number[]
  permission_ids?: number[]
  status?: "active" | "inactive" | "blocked"
}

export interface UserFilters {
  order_direction: string
  order_by: string
  lang: string
  limit: number
}

export interface UsersTableProps {
  users: User[]
  total: number
  currentPage: number
  isLoading: boolean
  searchTerm: string
  status: string
  isFiltersOpen: boolean
  filters: UserFilters
  isAnyFilterApplied: boolean
  hasUpdatePermission: boolean
  onSearch: (term: string) => void
  onStatusFilter: (status: string) => void
  onFilterChange: (key: string, value: string | number) => void
  setIsFiltersOpen: (isOpen: boolean) => void
  clearAllFilters: () => void
  handleEditUser: (user: User) => void
  setCurrentPage: (page: number) => void
  translate: (key: string, language: string) => string
}

export interface CreateUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export interface EditUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user: User | null
}

// Role Types
export interface CreateRoleRequest {
  name: string
  slug: string
  permission_ids: number[]
}

export interface UpdateRoleRequest {
  name?: string
  slug?: string
  permission_ids?: number[]
}

export interface RoleFilters {
  search?: string
  status?: string
  order_direction?: "ASC" | "DESC"
  order_by?: string
  lang?: string
  limit?: number
}

export interface RolesTableProps {
  roles: Role[]
  total: number
  currentPage: number
  isLoading: boolean
  searchTerm: string
  isFiltersOpen: boolean
  filters: RoleFilters
  isAnyFilterApplied: boolean
  hasUpdatePermission: boolean
  onSearch: (term: string) => void
  onFilterChange: (key: string, value: any) => void
  setIsFiltersOpen: (isOpen: boolean) => void
  clearAllFilters: () => void
  handleEditRole: (role: Role) => void
  setCurrentPage: (page: number) => void
}

export interface CreateRoleDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export interface EditRoleDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  role: Role | null
}

// Responsibility Types
export interface CreateResponsibilityDto {
  slug: string
  to_read_all: boolean
  to_send_all: boolean
  organization_id: number
  user_id: number
  names: { name: string; lang: string }[]
}

export interface UpdateResponsibilityDto {
  slug?: string
  to_read_all?: boolean
  to_send_all?: boolean
  organization_id?: number
  user_id?: number
  names?: { name: string; lang: string }[]
}

export interface ResponsibilityFilters {
  order_direction: "ASC" | "DESC"
  order_by: string
  lang: string
  limit: number
}

export interface ResponsibilitiesTableProps {
  responsibilities: Responsibility[]
  total: number
  currentPage: number
  isLoading: boolean
  searchTerm: string
  isFiltersOpen: boolean
  filters: ResponsibilityFilters
  isAnyFilterApplied: boolean
  hasUpdatePermission: boolean
  onSearch: (term: string) => void
  onFilterChange: (key: string, value: string | number) => void
  setIsFiltersOpen: (open: boolean) => void
  clearAllFilters: () => void
  handleEditResponsibility: (responsibility: Responsibility) => void
  setCurrentPage: (page: number) => void
  translate: (key: string, lang: string) => string
}

// Organization Types
export interface CreateOrganizationRequest {
  parent_id: number | null
  slug: string
  names: { name: string; lang: string }[]
}

export interface UpdateOrganizationRequest {
  parent_id?: number | null
  slug?: string
  names?: { name: string; lang: string }[]
}

export interface OrganizationFilters {
  order_direction: string
  order_by: string
  lang: string
  limit: number
}

export interface OrganizationsTableProps {
  organizations: Organization[]
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onSearch: (term: string) => void
  onLanguageChange: (lang: string) => void
  loading: boolean
  onEditOrganization?: (organization: Organization) => void
  currentLanguage: string
  translations: {
    noData: string
    loading: string
  }
}

export interface CreateOrganizationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export interface EditOrganizationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  organization: Organization | null
}

