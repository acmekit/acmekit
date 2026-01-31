curl -X POST '{backend_url}/store/carts/{id}/gift-cards' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}"
}'