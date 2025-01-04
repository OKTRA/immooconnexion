import { ResponsiveTable } from "@/components/ui/responsive-table"

interface PropertyTableHeaderProps {
  type?: 'property' | 'apartment'
}

export function PropertyTableHeader({ type = 'property' }: PropertyTableHeaderProps) {
  if (type === 'apartment') {
    return (
      <ResponsiveTable.Header>
        <ResponsiveTable.Row>
          <ResponsiveTable.Head className="w-[100px]">Photo</ResponsiveTable.Head>
          <ResponsiveTable.Head>Nom</ResponsiveTable.Head>
          <ResponsiveTable.Head>Ville</ResponsiveTable.Head>
          <ResponsiveTable.Head>Unités</ResponsiveTable.Head>
          <ResponsiveTable.Head>Propriétaire</ResponsiveTable.Head>
          <ResponsiveTable.Head>Contact</ResponsiveTable.Head>
          <ResponsiveTable.Head>Statut</ResponsiveTable.Head>
          <ResponsiveTable.Head className="text-right">Actions</ResponsiveTable.Head>
        </ResponsiveTable.Row>
      </ResponsiveTable.Header>
    )
  }

  return (
    <ResponsiveTable.Header>
      <ResponsiveTable.Row>
        <ResponsiveTable.Head className="w-[100px]">Photo</ResponsiveTable.Head>
        <ResponsiveTable.Head>Bien</ResponsiveTable.Head>
        <ResponsiveTable.Head>Type</ResponsiveTable.Head>
        <ResponsiveTable.Head>Chambres</ResponsiveTable.Head>
        <ResponsiveTable.Head>Ville</ResponsiveTable.Head>
        <ResponsiveTable.Head>Loyer</ResponsiveTable.Head>
        <ResponsiveTable.Head>Statut</ResponsiveTable.Head>
        <ResponsiveTable.Head className="text-right">Actions</ResponsiveTable.Head>
      </ResponsiveTable.Row>
    </ResponsiveTable.Header>
  )
}