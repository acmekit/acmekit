curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Layla"
}'