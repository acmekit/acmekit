curl -X POST '{backend_url}/admin/index/sync' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "strategy": "full"
}'