import { Database } from './database.types'

export type Tables = Database['public']['Tables']

export type Administrator = Tables['administrators']['Row']
export type AdministratorInsert = Tables['administrators']['Insert']
export type AdministratorUpdate = Tables['administrators']['Update']

export type Contract = Tables['contracts']['Row']
export type ContractInsert = Tables['contracts']['Insert']
export type ContractUpdate = Tables['contracts']['Update']

export type Profile = Tables['profiles']['Row']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']

export type Property = Tables['properties']['Row']
export type PropertyInsert = Tables['properties']['Insert']
export type PropertyUpdate = Tables['properties']['Update']

export type Tenant = Tables['tenants']['Row']
export type TenantInsert = Tables['tenants']['Insert']
export type TenantUpdate = Tables['tenants']['Update']