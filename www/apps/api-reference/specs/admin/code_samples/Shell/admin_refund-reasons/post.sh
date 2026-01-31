curl -X POST '{backend_url}/admin/refund-reasons' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "label": "{value}",
  "code": "{value}",
  "description": "{value}"
}'