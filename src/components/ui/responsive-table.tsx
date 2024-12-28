import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ResponsiveTableProps {
  children: React.ReactNode
}

export function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>{children}</Table>
    </div>
  )
}

ResponsiveTable.Header = TableHeader
ResponsiveTable.Head = TableHead
ResponsiveTable.Body = TableBody
ResponsiveTable.Row = TableRow
ResponsiveTable.Cell = TableCell