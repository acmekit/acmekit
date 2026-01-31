curl -X POST '{backend_url}/admin/exchanges/{id}/inbound/shipping-method' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "shipping_option_id": "{value}"
}'