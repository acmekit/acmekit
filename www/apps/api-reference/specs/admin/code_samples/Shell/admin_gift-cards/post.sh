curl -X POST '{backend_url}/admin/gift-cards' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}",
  "value": 19,
  "currency_code": "bwp",
  "expires_at": "2025-07-20T15:47:23.951Z",
  "reference_id": "{value}",
  "reference": "{value}",
  "line_item_id": "{value}",
  "customer_id": "{value}",
  "metadata": {}
}'