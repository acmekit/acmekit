curl -X POST '{backend_url}/admin/draft-orders/{id}/edit/items/item/{item_id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "quantity": 0
}'