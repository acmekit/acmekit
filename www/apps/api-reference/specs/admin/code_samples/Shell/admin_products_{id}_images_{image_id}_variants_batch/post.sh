curl -X POST '{backend_url}/admin/products/{id}/images/{image_id}/variants/batch' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "add": ["variant_123", "variant_456"],
  "remove": ["variant_789"]
}'