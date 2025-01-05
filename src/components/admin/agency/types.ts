export interface AgencyUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: 'admin' | 'user';
  agency_id: string;
  phone_number?: string | null;
}

export interface AgencyUserActionsProps {
  userId: string;
  onEditAuth?: () => void;
  refetch: () => void;
}

export interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  agencyId: string;
  onSuccess: () => void;
}