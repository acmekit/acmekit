curl -X POST '{backend_url}/admin/product-tags/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'