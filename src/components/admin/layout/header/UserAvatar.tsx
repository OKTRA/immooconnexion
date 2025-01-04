import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Profile } from "@/types/profile"

interface UserAvatarProps {
  profile: Profile | null;
}

export function UserAvatar({ profile }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 border border-white/20">
        <AvatarFallback className="bg-white/10 text-white">
          {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium text-white">
          {profile?.first_name || profile?.email || 'Utilisateur'}
        </p>
        <p className="text-xs text-white/70">
          Super Admin
        </p>
      </div>
    </div>
  )
}