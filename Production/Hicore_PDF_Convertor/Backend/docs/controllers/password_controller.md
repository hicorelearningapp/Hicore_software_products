Password Controller — `/password`

Purpose
- Add or remove password protection on PDF files.

Endpoint
- POST `/password` (multipart/form-data)

Required form fields
- `action` (string): `add_password` or `remove_password`.
- `file` (file): the PDF to operate on.
- `password` (string): password to add (or the password to remove).

Example: add a password
```bash
curl -X POST "http://localhost:8000/password" \
  -F "action=add_password" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "password=MySecret123"
```

Example: remove a password
```bash
curl -X POST "http://localhost:8000/password" \
  -F "action=remove_password" \
  -F "file=@protected.pdf;type=application/pdf" \
  -F "password=MySecret123"
```

Response
- Downloads the resulting PDF on success.
- 400 for invalid action, 500 for processing errors.

Notes for frontend
- Validate the `action` value before sending.
- Return the resulting file to the user as a download. The backend runs a cleanup task that removes the uploaded temp file after response.