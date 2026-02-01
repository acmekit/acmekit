import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@acmekit/types"
import { Button, Input, toast } from "@acmekit/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateStore } from "../../../../../hooks/api/store"

type EditStoreFormProps = {
  store: HttpTypes.AdminStore
}

const EditStoreSchema = z.object({
  name: z.string().min(1),
})

export const EditStoreForm = ({ store }: EditStoreFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const form = useForm<z.infer<typeof EditStoreSchema>>({
    defaultValues: {
      name: store.name,
    },
    resolver: zodResolver(EditStoreSchema),
  })

  const { mutateAsync, isPending } = useUpdateStore(store.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(t("store.toast.update"))
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="overflow-y-auto">
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("fields.name")}</Form.Label>
                  <Form.Control>
                    <Input placeholder="ACME" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" isLoading={isPending} type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
