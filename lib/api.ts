import { createAuthenticatedAxios } from "./auth"
import type { LogResponse, LogsQueryParams } from "@/lib/types"
import type { FileResponse, FilesQueryParams } from "@/lib/types"
import type {
  RolesResponse,
  RolesQueryParams,
  UpdateRoleRequest,
  UpdateRoleResponse,
  RoleDetailResponse,
} from "@/lib/types"
import type {
  OrganizationsResponse,
  OrganizationsQueryParams,
  OrganizationDetailResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from "@/lib/types"
import type { ResponsibilitiesResponse, ResponsibilitiesQueryParams } from "@/lib/types"
import type {
  MailTypesResponse,
  MailTypesQueryParams,
  UpdateMailTypeRequest,
  UpdateMailTypeResponse,
  CreateMailTypeRequest,
  CreateMailTypeResponse,
} from "@/lib/types"
import type {
  ExternalMailsResponse,
  ExternalMailsQueryParams,
  CreateExternalMailRequest,
  ExternalMailDetail,
} from "@/lib/types"
import type {
  InternalMailsResponse,
  InternalMailsQueryParams,
  CreateInternalMailRequest,
  CreateInternalMailResponse,
  InternalMailDetail,
} from "@/lib/types"
import type { SpecialMailsResponse, SpecialMailsRequest } from "@/lib/types"
import type { NotificationCountResponse, NotificationsResponse } from "@/lib/types"
import type { UsersResponse, UsersQueryParams } from "@/lib/types"
import type { UpdateUserRequest, UpdateUserResponse } from "@/lib/types"
import type { UserDetailResponse } from "@/lib/types"
import type {
  PermissionsResponse,
  PermissionsQueryParams,
  UpdatePermissionRequest,
  UpdatePermissionResponse,
  PermissionDetailResponse,
} from "@/lib/types"
import type { ChatUsersResponse, ChatUsersQueryParams } from "@/lib/types"

const api = createAuthenticatedAxios()

// Dashboard
export async function fetchDashboardData() {
  return {
    totalUsers: 10234,
    activeUsers: 8901,
    newUsers: 1234,
    totalReports: 5678,
    revenueData: [
      { name: "Jan", revenue: 4000 },
      { name: "Feb", revenue: 3000 },
      { name: "Mar", revenue: 5000 },
      { name: "Apr", revenue: 4500 },
      { name: "May", revenue: 6000 },
      { name: "Jun", revenue: 5500 },
    ],
  }
}

// Logs
export async function fetchLogs(params: LogsQueryParams): Promise<LogResponse> {
  const response = await api.get("/manager/logs", { params })
  return response?.data ?? { payload: [], total: 0 }
}

// Files
export async function fetchFiles(params: FilesQueryParams): Promise<FileResponse> {
  const response = await api.get("/manager/files", { params })
  return response?.data ?? { payload: [], total: 0 }
}

export async function downloadFile(fileId: number): Promise<void> {
  const response = await api.get(`/manager/files/${fileId}`, { responseType: "blob" })
  const contentType = response.headers?.["content-type"] ?? "application/octet-stream"
  const blob = new Blob([response.data], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  const contentDisposition = response.headers?.["content-disposition"]
  const fileName = contentDisposition ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") : `file-${fileId}`
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export async function uploadFiles(files: File[]): Promise<number[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))
  const response = await api.post("/manager/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data?.payload ?? []
}

// Roles
export async function fetchRoles(params: RolesQueryParams): Promise<RolesResponse> {
  const response = await api.get("/manager/roles", { params })
  return response.data
}

export async function fetchRoleDetail(id: number): Promise<RoleDetailResponse> {
  const response = await api.get(`/manager/roles/${id}`)
  return response.data
}

export async function updateRole(id: number, data: Partial<UpdateRoleRequest>): Promise<UpdateRoleResponse> {
  const response = await api.patch(`/manager/roles/${id}`, data)
  return response.data
}

// Organizations
export async function fetchOrganizations(params: OrganizationsQueryParams): Promise<OrganizationsResponse> {
  const response = await api.get("/organizations", { params })
  return response.data
}

export async function fetchOrganizationDetail(id: number, lang: string): Promise<OrganizationDetailResponse> {
  const response = await api.get(`/organizations/specific/${id}`, { params: { lang } })
  return response.data
}

export async function updateOrganization(
  id: number,
  data: Partial<UpdateOrganizationRequest>,
): Promise<UpdateOrganizationResponse> {
  const response = await api.patch(`/organizations/${id}`, data)
  return response.data
}

export async function fetchOrganizationsExclude(params: OrganizationsQueryParams): Promise<OrganizationsResponse> {
  const response = await api.get("/organizations/exclude", { params })
  return response.data
}

// Responsibilities
export async function fetchResponsibilities(params: ResponsibilitiesQueryParams): Promise<ResponsibilitiesResponse> {
  const response = await api.get("/manager/responsibilities", { params })
  return response.data
}

export async function fetchResponsibilitiesWithPermissions(
  params: ResponsibilitiesQueryParams & { current_responsibility_id: number },
): Promise<ResponsibilitiesResponse> {
  const response = await api.get("/responsibilities/client/send/permissions", { params })
  return response.data
}

// Mail Types
export async function fetchMailTypes(params: MailTypesQueryParams): Promise<MailTypesResponse> {
  const response = await api.get("/manager/mail-types", { params })
  return response.data
}

export async function updateMailType(
  id: number,
  data: Partial<UpdateMailTypeRequest>,
): Promise<UpdateMailTypeResponse> {
  const response = await api.patch(`/manager/mail-types/${id}`, data)
  return response.data
}

export async function createMailType(data: CreateMailTypeRequest): Promise<CreateMailTypeResponse> {
  const response = await api.post("/manager/mail-types", data)
  return response.data
}

// Internal Mails
export async function fetchInternalSentMails(params: InternalMailsQueryParams): Promise<InternalMailsResponse> {
  const response = await api.get("/mails/sended", { params })
  return response.data
}

export async function fetchInternalReceivedMails(params: InternalMailsQueryParams): Promise<InternalMailsResponse> {
  const response = await api.get("/mails/received", { params })
  return response.data
}

export async function createInternalMail(data: CreateInternalMailRequest): Promise<CreateInternalMailResponse> {
  const mailData = { ...data, sent_time: Date.now(), status: "new" }
  const response = await api.post("/api/v1/mails", mailData)
  if (!response.data) throw new Error("Failed to create internal mail")
  return response.data
}

export async function fetchInternalMailDetail(id: number, lang: string): Promise<InternalMailDetail> {
  const response = await api.get(`/mails/specific/${id}?lang=${lang}`)
  return response.data.payload
}

export async function archiveInternalMail(id: number): Promise<void> {
  await api.post(`/mails/archive/${id}`)
}

// External Mails
export async function fetchExternalMails(params: ExternalMailsQueryParams): Promise<ExternalMailsResponse> {
  const response = await api.get("/manager/external-mail", { params })
  return response.data
}

export async function createExternalMail(data: CreateExternalMailRequest): Promise<void> {
  const mailData = { ...data, type: "inbox", received_time: Date.now(), sent_time: 0 }
  const response = await api.post("/manager/external-mail", mailData)
  if (!response.data) throw new Error("Failed to create external mail")
}

export async function archiveExternalMail(id: number): Promise<void> {
  try {
    await api.post(`/api/v1/manager/external-mail/archive/${id}`)
  } catch (error) {
    console.error("Failed to archive external mail:", error)
    throw new Error("Failed to archive external mail")
  }
}

// Special Mails
export async function fetchSpecialMails(params: SpecialMailsRequest): Promise<SpecialMailsResponse> {
  const response = await api.post("/special-mails", params)
  return response.data
}

// Notifications
export async function fetchNotificationCount(responsibility_ids: number[]): Promise<NotificationCountResponse> {
  const params = new URLSearchParams()
  responsibility_ids.forEach((id) => params.append("responsibility_ids", id.toString()))
  const response = await api.get("/notifications/new-mails/count", { params })
  return response.data
}

export async function fetchNotifications(responsibility_ids: number[]): Promise<NotificationsResponse> {
  const params = new URLSearchParams()
  responsibility_ids.forEach((id) => params.append("responsibility_ids", id.toString()))
  const response = await api.get("/notifications/new-mails", { params })
  return response.data
}

// Users
export async function fetchUserList(): Promise<UsersResponse> {
  const response = await api.get("/users")
  return response.data
}

export async function fetchUsers(params: UsersQueryParams): Promise<UsersResponse> {
  const response = await api.get("/manager/users", { params })
  return response.data
}

export async function updateUser(id: number, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await api.patch(`/manager/users/${id}`, data)
  return response.data
}

export async function fetchUserDetail(id: number): Promise<UserDetailResponse> {
  const response = await api.get(`/manager/users/${id}`)
  return response.data
}

// Permissions
export async function fetchPermissions(params: PermissionsQueryParams): Promise<PermissionsResponse> {
  const response = await api.get("/permissions", { params })
  return response.data
}

export async function updatePermission(
  id: number,
  data: Partial<UpdatePermissionRequest>,
): Promise<UpdatePermissionResponse> {
  const response = await api.patch(`/permissions/${id}`, data)
  return response.data
}

export async function fetchPermissionDetail(id: number): Promise<PermissionDetailResponse> {
  const response = await api.get(`/permissions/${id}`)
  return response.data
}

// Chat Users
export async function fetchChatUsers(params: ChatUsersQueryParams): Promise<ChatUsersResponse> {
  const response = await api.get("/manager/users/chat", { params })
  return response.data
}

// Add these functions at the end of the file

export async function fetchExternalMailDetail(id: number): Promise<ExternalMailDetail | null> {
  try {
    const response = await api.get(`/manager/external-mail/${id}`)
    return response.data?.payload ?? null
  } catch (error) {
    console.error("Failed to fetch external mail detail:", error)
    return null
  }
}

export async function proceedExternalMail(id: number): Promise<boolean> {
  try {
    await api.post(`/manager/external-mail/${id}/proceed`)
    return true
  } catch (error) {
    console.error("Failed to proceed external mail:", error)
    return false
  }
}

