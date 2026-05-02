import {
  LoaderOptions,
  IMedusaInternalService,
} from "@medusajs/framework/types"
import { InvoiceConfig } from "../models/invoice-config"

export default async function createDefaultConfigLoader({
  container,
}: LoaderOptions) {
  const service: IMedusaInternalService<
    typeof InvoiceConfig
  > = container.resolve("invoiceConfigService")

  const [_, count] = await service.listAndCount()

  if (count > 0) {
    return
  }

  await service.create({
    company_name: "Backyardboys Design",
    company_address: "Maria Lanzendorferstraße 10/3/10,\n2333 Leopoldsdorf\nAustria",
    company_phone: "+43 670 6516029",
    company_email: "office@backyardboys.at",
  })
}