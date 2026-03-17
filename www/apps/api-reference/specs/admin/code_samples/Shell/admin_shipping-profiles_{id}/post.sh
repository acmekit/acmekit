curl -X POST '{backend_url}/admin/shipping-profiles/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'