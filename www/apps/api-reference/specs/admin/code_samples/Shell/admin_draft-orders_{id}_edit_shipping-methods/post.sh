curl -X POST '{backend_url}/admin/draft-orders/{id}/edit/shipping-methods' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "shipping_option_id": "{value}"
}'