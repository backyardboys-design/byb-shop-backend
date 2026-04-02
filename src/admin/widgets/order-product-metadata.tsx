import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  AdminOrder,
  DetailWidgetProps,
} from "@medusajs/framework/types"
import {
  Container,
  Heading,
  Text,
} from "@medusajs/ui"

const OrderProductMetadataWidget = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const itemsWithMetadata =
    order.items?.filter((item) => {
      return item.metadata && Object.keys(item.metadata).length > 0
    }) || []

  if (!itemsWithMetadata.length) {
    return <></>
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Produkt-Metadaten</Heading>
      </div>

      <div className="divide-y">
        {itemsWithMetadata.map((item) => (
          <div key={item.id} className="px-6 py-4">
            <Text size="small" weight="plus">
              {item.title}
            </Text>

            {item.subtitle && (
              <Text size="small" className="text-ui-fg-subtle">
                {item.subtitle}
              </Text>
            )}

            <div className="mt-2 space-y-1">
              {Object.entries(item.metadata || {}).map(([key, value]) => (
                <Text
                  key={key}
                  size="small"
                  className="text-ui-fg-subtle"
                >
                  {key}: {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </Text>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderProductMetadataWidget