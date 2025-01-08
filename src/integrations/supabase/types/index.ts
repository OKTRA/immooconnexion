export * from './administrators';
export * from './contracts';
export * from './profiles';
export * from './properties';
export * from './tenants';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      administrators: {
        Row: Administrator;
        Insert: AdministratorInsert;
        Update: AdministratorUpdate;
        Relationships: [];
      };
      contracts: {
        Row: Contract;
        Insert: ContractInsert;
        Update: ContractUpdate;
        Relationships: [
          {
            foreignKeyName: "contracts_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      properties: {
        Row: Property;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
        Relationships: [];
      };
      tenants: {
        Row: Tenant;
        Insert: TenantInsert;
        Update: TenantUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}