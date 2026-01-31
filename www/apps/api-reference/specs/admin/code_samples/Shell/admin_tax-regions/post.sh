curl -X POST '{backend_url}/admin/tax-regions' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "country_code": "{value}",
  "province_code": "us-ca",
  "parent_id": "{value}",
  "metadata": {}
}'