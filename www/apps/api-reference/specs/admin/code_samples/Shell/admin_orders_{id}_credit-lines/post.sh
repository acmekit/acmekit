curl -X POST '{backend_url}/admin/orders/{id}/credit-lines' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "amount": 32,
  "reference": "{value}",
  "reference_id": "{value}"
}'