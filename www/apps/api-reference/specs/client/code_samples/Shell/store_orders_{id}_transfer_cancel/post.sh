curl -X POST '{backend_url}/store/orders/{id}/transfer/cancel' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'x-publishable-api-key: {your_publishable_api_key}'