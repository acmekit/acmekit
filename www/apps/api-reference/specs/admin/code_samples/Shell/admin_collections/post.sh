curl -X POST '{backend_url}/admin/collections' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "metadata": {}
}'