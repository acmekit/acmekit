curl -X POST '{backend_url}/admin/stock-locations/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "address_id": "{value}",
  "metadata": {}
}'