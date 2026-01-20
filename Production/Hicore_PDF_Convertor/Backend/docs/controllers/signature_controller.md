Signature Controller — `/signature`

Purpose
- Add or remove signatures to PDFs. Supports three signature types: `draw` (base64 image), `upload` (uploaded image), `text` (rendered text signature).
- Hybrid input: The `page` field now accepts both string (list/range) and JSON array formats for page selection.

Endpoint
- POST `/signature` (multipart/form-data)

Required form fields
- `action` (string): usually `add_signature` or `remove_signature`.
- `file` (file): the PDF to sign.
- `signature_type` (string): one of `draw`, `upload`, `text`.

Signature data fields (one of the following per `signature_type`)
- For `draw`: `signature_data` (base64 PNG data string) — required.
- For `upload`: upload the file field `signature_file` (file) — required.
- For `text`: `signature_text` (string) — required.

Positioning and page selection
- `page` (string or JSON array): target pages. Accepts a string (e.g., `"1"`, `"1,2"`, `"1-3,5"`) or a JSON array (e.g., `[1,2,3]` or `[[1,3],[5]]`). The backend parses both formats into a pages list.
- `x`, `y` (float): coordinates for placement.
- `width`, `height` (int): size for the signature.
- `signature_font`, `signature_font_size`, `signature_color`: text signature style options.

Other options
- `add_datetime` (bool): add timestamp to signature when supported.
- `flatten_pdf` (bool): flatten annotations into PDF.

Examples
1) Draw signature (base64 data, string page)
```bash
curl -X POST "http://localhost:8000/signature" \
  -F "action=add_signature" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "signature_type=draw" \
  -F "signature_data=<BASE64_PNG_DATA>" \
  -F "page=1" \
  -F "x=100" -F "y=200"
```

2) Upload signature image (string page)
```bash
curl -X POST "http://localhost:8000/signature" \
  -F "action=add_signature" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "signature_type=upload" \
  -F "signature_file=@sig.png;type=image/png" \
  -F "page=1-2" \
  -F "x=120" -F "y=220"
```

3) Draw signature (JSON array page)
```bash
curl -X POST "http://localhost:8000/signature" \
  -F "action=add_signature" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "signature_type=draw" \
  -F "signature_data=<BASE64_PNG_DATA>" \
  -F "page=[1,2,3]" \
  -F "x=100" -F "y=200"
```

Validation and errors
- `page` is validated and parsed; invalid values return HTTP 400.
- Missing signature payload (data/file/text) for the chosen `signature_type` returns HTTP 400.
- On success, returns the signed PDF as a download.

Notes for frontend
- Pass `page` as either a string (list/range) or a JSON array for flexibility. Both formats are supported and parsed by the backend.
- Ensure `signature_file` is included when using `upload` type; otherwise backend will complain.
- Use `add_datetime` and `flatten_pdf` flags as `true` or `false` via form fields.
- The backend saves temporary files and will return the processed PDF; it’s responsible for cleanup.