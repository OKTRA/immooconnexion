import { Database } from './database.types'

export type Tables = Database['public']['Tables']

// Administrators
export type Administrator = Tables['administrators']['Row']
export type AdministratorInsert = Tables['administrators']['Insert']
export type AdministratorUpdate = Tables['administrators']['Update']

// Properties
export type Property = Tables['properties']['Row']
export type PropertyInsert = Tables['properties']['Insert']
export type PropertyUpdate = Tables['properties']['Update']

// Profiles
export type Profile = Tables['profiles']['Row']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']

// Contracts
export type Contract = Tables['contracts']['Row']
export type ContractInsert = Tables['contracts']['Insert']
export type ContractUpdate = Tables['contracts']['Update']