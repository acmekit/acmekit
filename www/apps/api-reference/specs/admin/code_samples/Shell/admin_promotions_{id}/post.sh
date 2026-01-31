curl -X POST '{backend_url}/admin/promotions/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "campaign_id": "{value}"
}'