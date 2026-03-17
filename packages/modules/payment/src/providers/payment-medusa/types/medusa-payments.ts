import stripe from "stripe"

export interface CreatePaymentRequest extends stripe.PaymentIntentCreateParams {
  account_holder_id?: string
  idempotency_key?: string
}

export interface MedusaPayment extends stripe.PaymentIntent {
  account_holder_id?: string
}

export interface RefundPaymentRequest extends stripe.RefundCreateParams {
  idempotency_key?: string
}

export interface MedusaRefund extends stripe.Refund {}

export interface CreateAccountHolderRequest
  extends stripe.CustomerCreateParams {}

export interface UpdateAccountHolderRequest
  extends stripe.CustomerUpdateParams {}

export interface MedusaAccountHolder extends stripe.Customer {}

export interface MedusaPaymentMethod extends stripe.PaymentMethod {
  account_holder_id?: string
}

export interface MedusaPaymentMethodSession extends stripe.SetupIntent {}
