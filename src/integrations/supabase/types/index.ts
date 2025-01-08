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
        Row: any;
        Insert: any;
        Update: any;
        Relationships: [];
      };
      contracts: {
        Row: any;
        Insert: any;
        Update: any;
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
        Row: any;
        Insert: any;
        Update: any;
        Relationships: [];
      };
      properties: {
        Row: any;
        Insert: any;
        Update: any;
        Relationships: [];
      };
      tenants: {
        Row: any;
        Insert: any;
        Update: any;
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