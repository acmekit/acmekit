curl -X POST '{backend_url}/admin/shipping-option-types' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "label": "{value}",
  "code": "{value}"
}'