"use client"

import { Label } from "@/components/label"
import { Text } from "@/components/text"
import React, {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
} from "react"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form"

const FormProviderContext = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = { id: string }

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField must be used within a Form.Field")
  }

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formLabelId: `${itemContext.id}-form-label`,
    formDescriptionId: `${itemContext.id}-form-description`,
    formErrorMessageId: `${itemContext.id}-form-message`,
    ...fieldState,
  }
}

const FormItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={className} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => {
  const { formLabelId, formItemId } = useFormField()
  return (
    <Label
      ref={ref}
      id={formLabelId}
      htmlFor={formItemId}
      className={className}
      size="small"
      weight="plus"
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => {
  const {
    error,
    formItemId,
    formDescriptionId,
    formErrorMessageId,
    formLabelId,
  } = useFormField()

  const child = React.Children.only(children)
  const mergedProps =
    React.isValidElement(child) && typeof child.type !== "string"
      ? { id: formItemId, "aria-invalid": !!error }
      : {}

  return (
    <div
      ref={ref}
      role="group"
      aria-describedby={
        error ? `${formDescriptionId} ${formErrorMessageId}` : formDescriptionId
      }
      aria-labelledby={formLabelId}
      {...props}
    >
      {React.isValidElement(child)
        ? React.cloneElement(
            child as React.ReactElement<{
              id?: string
              "aria-invalid"?: boolean
            }>,
            mergedProps
          )
        : children}
    </div>
  )
})
FormControl.displayName = "FormControl"

const FormErrorMessage = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => {
  const { error, formErrorMessageId } = useFormField()
  const msg = error?.message ?? children

  if (!msg) return null

  return (
    <Text
      ref={ref}
      id={formErrorMessageId}
      size="small"
      className={className}
      {...props}
    >
      {String(msg)}
    </Text>
  )
})
FormErrorMessage.displayName = "FormErrorMessage"

const FormHint = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return (
    <Text
      ref={ref}
      id={formDescriptionId}
      size="small"
      className={className}
      {...props}
    />
  )
})
FormHint.displayName = "FormHint"

export const Form = Object.assign(FormProviderContext, {
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Hint: FormHint,
  ErrorMessage: FormErrorMessage,
  Field: FormField,
})
