import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TenantReceipt } from "../TenantReceipt"
import { TenantReceiptData } from "@/types/tenant"

interface ReceiptDialogsProps {
  showReceipt: boolean
  setShowReceipt: (show: boolean) => void
  showEndReceipt: boolean
  setShowEndReceipt: (show: boolean) => void
  tenant: TenantReceiptData
  currentLease?: any
}

export function ReceiptDialogs({
  showReceipt,
  setShowReceipt,
  showEndReceipt,
  setShowEndReceipt,
  tenant,
  currentLease
}: ReceiptDialogsProps) {
  return (
    <>
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt 
            tenant={tenant}
            isInitialReceipt={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEndReceipt} onOpenChange={setShowEndReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt 
            tenant={tenant}
            isEndReceipt={true}
            inspection={currentLease?.inspection}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}