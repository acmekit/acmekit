curl -X POST '{backend_url}/admin/claims/{id}/outbound/shipping-method' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "shipping_option_id": "{value}"
}'