curl -X POST '{backend_url}/store/gift-cards/{idOrCode}/redeem' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'x-publishable-api-key: {your_publishable_api_key}'