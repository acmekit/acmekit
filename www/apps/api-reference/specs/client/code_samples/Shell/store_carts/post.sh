curl -X POST '{backend_url}/store/carts' \
-H 'Content-Type: application/json' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
--data-raw '{
  "region_id": "reg_123"
}'