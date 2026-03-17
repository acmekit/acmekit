curl -X POST '{backend_url}/admin/tax-rates/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'