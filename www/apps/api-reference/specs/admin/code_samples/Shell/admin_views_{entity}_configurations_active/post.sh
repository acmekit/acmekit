curl -X POST '{backend_url}/admin/views/{entity}/configurations/active' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "view_configuration_id": "{value}"
}'