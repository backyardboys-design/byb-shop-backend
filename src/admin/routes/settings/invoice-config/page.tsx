import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Button,
  Input,
  Label,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";
import { useForm } from "react-hook-form";
import * as zod from "@medusajs/framework/zod";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, Controller } from "react-hook-form";
import { useCallback, useEffect } from "react";
import i18n from "i18next"

type InvoiceConfig = {
  id: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_logo?: string;
  notes?: string;
};

const translations = {
  en: {
    menuTitle: "Invoice Config",
    title: "Invoice Config",
    companyName: "Company Name",
    companyAddress: "Company Address",
    companyPhone: "Company Phone",
    companyEmail: "Company Email",
    notes: "Notes",
    companyLogo: "Company Logo",
    save: "Save",
    success: "Invoice config updated successfully",
    logoAlt: "Company Logo",
    routeLabel: "Default Invoice Config",
  },
  de: {
    menuTitle: "Rechnungseinstellungen",
    title: "Rechnungseinstellungen",
    companyName: "Firmenname",
    companyAddress: "Firmenadresse",
    companyPhone: "Telefonnummer",
    companyEmail: "E-Mail-Adresse",
    notes: "Notizen",
    companyLogo: "Firmenlogo",
    save: "Speichern",
    success: "Rechnungseinstellungen erfolgreich gespeichert",
    logoAlt: "Firmenlogo",
    routeLabel: "Standard-Rechnungseinstellungen",
  },
};

const schema = zod.object({
  company_name: zod.string().optional(),
  company_address: zod.string().optional(),
  company_phone: zod.string().optional(),
  company_email: zod.string().email().optional(),
  company_logo: zod.string().url().optional(),
  notes: zod.string().optional(),
});

const InvoiceConfigPage = () => {
  const { i18n } = useTranslation();

  const lang = useMemo(() => {
    return i18n.language?.startsWith("de") ? "de" : "en";
  }, [i18n.language]);

  const t = translations[lang];

  const { data, isLoading, refetch } = useQuery<{
    invoice_config: InvoiceConfig;
  }>({
    queryFn: () => sdk.client.fetch("/admin/invoice-config"),
    queryKey: ["invoice-config"],
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: zod.infer<typeof schema>) =>
      sdk.client.fetch("/admin/invoice-config", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      refetch();
      toast.success(t.success);
    },
  });

  const getFormDefaultValues = useCallback(() => {
    return {
      company_name: data?.invoice_config.company_name || "",
      company_address: data?.invoice_config.company_address || "",
      company_phone: data?.invoice_config.company_phone || "",
      company_email: data?.invoice_config.company_email || "",
      company_logo: data?.invoice_config.company_logo || "",
      notes: data?.invoice_config.notes || "",
    };
  }, [data]);

  const form = useForm<zod.infer<typeof schema>>({
    defaultValues: getFormDefaultValues(),
  });

  const handleSubmit = form.handleSubmit((formData) => mutateAsync(formData));

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const { files } = await sdk.admin.upload.create({
      files: [file],
    });

    form.setValue("company_logo", files[0].url);
  };

  useEffect(() => {
    form.reset(getFormDefaultValues());
  }, [getFormDefaultValues]);

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{t.title}</Heading>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col overflow-hidden p-2 gap-2"
        >
          <Controller
            control={form.control}
            name="company_name"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.companyName}
                    </Label>
                  </div>
                  <Input
                    {...field}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="company_address"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.companyAddress}
                    </Label>
                  </div>
                  <Textarea {...field} />
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="company_phone"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.companyPhone}
                    </Label>
                  </div>
                  <Input {...field} />
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="company_email"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.companyEmail}
                    </Label>
                  </div>
                  <Input {...field} />
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.notes}
                    </Label>
                  </div>
                  <Textarea {...field} />
                </div>
              );
            }}
          />
          <Controller
            control={form.control}
            name="company_logo"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-x-1">
                    <Label size="small" weight="plus">
                      {t.companyLogo}
                    </Label>
                  </div>
                  <Input type="file" onChange={uploadLogo} className="py-1" />
                  {field.value && (
                    <img
                      src={field.value}
                      alt={t.logoAlt}
                      className="mt-2 h-24 w-24"
                    />
                  )}
                </div>
              );
            }}
          />
          <Button type="submit" disabled={isLoading || isPending}>
            {t.save}
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: i18n.language === "de"
    ? "Rechnungseinstellungen"
    : "Rechnungseinstellungen",
})

export default InvoiceConfigPage;
