import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types";
import { Container, Heading, Text } from "@medusajs/ui";

const OrderProductMetadataWidget = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const itemsWithMetadata =
    order.items?.filter((item) => {
      return item.metadata && Object.keys(item.metadata).length > 0;
    }) || [];

  if (!itemsWithMetadata.length) {
    return <></>;
  }

  const metaSort = [
    "bike_brand",
    "bike_model",
    "bike_year",
    "plastic_parts_info",
    "colors",
    "design_notes",
    "base",
    "finish",
    "order_number",
    "parts",
    "adapt_fitment",
  ];

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Produkt-Details</Heading>
      </div>

      <div className="divide-y">
        {itemsWithMetadata.map((item) => (
          <div key={item.id} className="px-6 py-4">
            <Text size="small" weight="plus">
              {item.title}
            </Text>

            <div className="mt-2 space-y-1 ml-5">
              {Object.entries(item.metadata || {})
                .sort(([keyA], [keyB]) => {
                  return metaSort.indexOf(keyA) - metaSort.indexOf(keyB);
                })
                .map(([key, value]) => (
                  <Text key={key} size="small" className="text-ui-fg-subtle">
                    {keyToText(key)}:{" "}
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </Text>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
const keyToText = (key: string) => {
  switch (key) {
    case "bike_brand":
      return "Bike Marke";
    case "bike_model":
      return "Bike Modell";
    case "bike_year":
      return "Bike Baujahr";
    case "plastic_parts_info":
      return "Kunststoffteile";
    case "colors":
      return "Farben";
    case "design_notes":
      return "Design";
    case "base":
      return "Folie";
    case "finish":
      return "Finish";


    case "order_number":
      return "Bestellnummer";
    case "parts":
      return "Teile";
    case "adapt_fitment":
      return "Anpassung an neue Kunststoffteile";
    default:
      return key;
  }
};
export const config = defineWidgetConfig({
  zone: "order.details.after",
});

export default OrderProductMetadataWidget;
