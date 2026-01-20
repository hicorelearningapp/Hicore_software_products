Dispatcher Controller — `/tool-action` and `/tool-action-complete`

Purpose
- `tool-action`: validate a (tool, action) pair and return which endpoint the frontend should call next.
- `tool-action-complete`: testing endpoint that accepts files and runs the full pipeline in one call (useful for Swagger/manual testing).

Endpoints
1) POST `/tool-action`
- Request (JSON):
  - `tool`: string, one of: `convert`, `edit`, `organize`, `password`, `signature`
  - `action`: string, a valid action for the tool (see `VALID_ACTIONS` in code)
- Response (JSON):
  - `redirect_to`: the API path the frontend should POST to (e.g., `/convert`)
  - `action`: normalized action string
- Example request:
```json
POST /tool-action
{ "tool": "convert", "action": "pdf_to_word" }
```
- Example response:
```json
{ "redirect_to": "/convert", "action": "pdf_to_word" }
```

2) POST `/tool-action-complete` (multipart/form-data)
- Purpose: for manual testing via Swagger UI. Validates the tool/action, accepts files, runs the manager and returns the processed file.
- Common form fields:
  - `tool` (string)
  - `action` (string)
  - `files` (file[]) - one or more uploaded files
  - `password` (string) - for password tool, optional
  - `degrees` (int) - for rotate (organize) testing, optional

Example: test convert -> pdf_to_image
```bash
curl -X POST "http://localhost:8000/tool-action-complete" \
  -F "tool=convert" \
  -F "action=pdf_to_image" \
  -F "files=@sample.pdf;type=application/pdf"
```

Notes for frontend
- Call `/tool-action` first to validate available operations and learn the endpoint to call.
- Use `/tool-action-complete` only for manual testing. Production frontend should call the redirect endpoint (e.g., `/convert`, `/edit`) directly after receiving the redirect from `/tool-action`.
- The controller returns clear 400 errors when the tool or action is invalid.