import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { sdk } from "../lib/sdk"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

const translations = {
  en: {
    title: "Invoice",
    description: "Generate and download invoice for this order",
    download: "Download Invoice",
    success: "Invoice generated and downloaded successfully",
    error: "Failed to generate invoice",
  },
  de: {
    title: "Rechnung",
    description: "Rechnung für diese Bestellung erstellen und herunterladen",
    download: "Rechnung herunterladen",
    success: "Rechnung erfolgreich erstellt und heruntergeladen",
    error: "Rechnung konnte nicht erstellt werden",
  },
}

const OrderInvoiceWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const { i18n } = useTranslation()

  const lang = useMemo(() => {
    return i18n.language?.startsWith("de") ? "de" : "en"
  }, [i18n.language])

  const t = translations[lang]

  const downloadInvoice = async () => {
    setIsDownloading(true)

    try {
      const response: Response = await sdk.client.fetch(
        `/admin/orders/${order.id}/invoices`,
        {
          method: "GET",
          headers: {
            accept: "application/pdf",
          },
        }
      )

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")

      a.href = url
      a.download = `byb-${order.display_id}.pdf`

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(t.success)
    } catch (error) {
      toast.error(`${t.error}: ${error}`)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">{t.title}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t.description}
          </Text>
        </div>
      </div>

      <div className="flex items-center justify-end px-6 py-4">
        <Button
          variant="secondary"
          disabled={isDownloading}
          onClick={downloadInvoice}
          isLoading={isDownloading}
        >
          {t.download}
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default OrderInvoiceWidget