curl -X POST '{backend_url}/store/carts/{id}/store-credits' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "amount": 48
}'