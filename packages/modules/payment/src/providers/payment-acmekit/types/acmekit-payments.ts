import stripe from "stripe"

export interface CreatePaymentRequest extends stripe.PaymentIntentCreateParams {
  account_holder_id?: string
  idempotency_key?: string
}

export interface AcmeKitPayment extends stripe.PaymentIntent {
  account_holder_id?: string
}

export interface RefundPaymentRequest extends stripe.RefundCreateParams {
  idempotency_key?: string
}

export interface AcmeKitRefund extends stripe.Refund {}

export interface CreateAccountHolderRequest
  extends stripe.CustomerCreateParams {}

export interface UpdateAccountHolderRequest
  extends stripe.CustomerUpdateParams {}

export interface AcmeKitAccountHolder extends stripe.Customer {}

export interface AcmeKitPaymentMethod extends stripe.PaymentMethod {
  account_holder_id?: string
}

export interface AcmeKitPaymentMethodSession extends stripe.SetupIntent {}
