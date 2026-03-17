curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}/images/batch' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "add": ["img_123", "img_456"],
  "remove": ["img_789"]
}'