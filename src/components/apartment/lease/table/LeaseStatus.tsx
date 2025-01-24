interface LeaseStatusProps {
  status: string
}

export function LeaseStatus({ status }: LeaseStatusProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        status === "active"
          ? "bg-green-50 text-green-700"
          : status === "expired"
          ? "bg-red-50 text-red-700"
          : "bg-yellow-50 text-yellow-700"
      }`}
    >
      {status === "active"
        ? "Actif"
        : status === "expired"
        ? "Expiré"
        : "En attente"}
    </span>
  )
}