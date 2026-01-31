curl -X POST '{backend_url}/admin/products/batch' \
-H 'Authorization: Bearer {jwt_token}' \
--data-raw '{
  "delete": [
    "prod_123"
  ]
}'