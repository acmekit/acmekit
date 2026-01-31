curl -X POST '{backend_url}/admin/gift-cards/{id}/redeem' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "customer_id": "{value}"
}'