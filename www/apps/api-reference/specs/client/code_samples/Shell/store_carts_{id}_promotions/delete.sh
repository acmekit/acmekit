curl -X DELETE '{backend_url}/store/carts/{id}/promotions' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "promo_codes": ["{value}"]
}'