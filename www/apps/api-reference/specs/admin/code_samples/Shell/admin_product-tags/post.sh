curl -X POST '{backend_url}/admin/product-tags' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "value": "{value}",
  "metadata": {}
}'