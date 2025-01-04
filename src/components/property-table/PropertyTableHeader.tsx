import { ResponsiveTable } from "@/components/ui/responsive-table"

export function PropertyTableHeader() {
  return (
    <ResponsiveTable.Header>
      <ResponsiveTable.Row>
        <ResponsiveTable.Head className="w-[100px]">Photo</ResponsiveTable.Head>
        <ResponsiveTable.Head>Nom</ResponsiveTable.Head>
        <ResponsiveTable.Head>Ville</ResponsiveTable.Head>
        <ResponsiveTable.Head>Unités totales</ResponsiveTable.Head>
        <ResponsiveTable.Head>Propriétaire</ResponsiveTable.Head>
        <ResponsiveTable.Head>Téléphone</ResponsiveTable.Head>
        <ResponsiveTable.Head>Statut</ResponsiveTable.Head>
        <ResponsiveTable.Head className="text-right">Actions</ResponsiveTable.Head>
      </ResponsiveTable.Row>
    </ResponsiveTable.Header>
  )
}