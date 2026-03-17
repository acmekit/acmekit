curl -X POST '{backend_url}/admin/draft-orders/{id}/edit/promotions' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "promo_codes": [
    "{value}"
  ]
}'