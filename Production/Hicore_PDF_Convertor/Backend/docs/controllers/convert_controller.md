Convert Controller — `/convert`

Purpose
- Convert documents between formats (PDF ↔ Word, Excel, PowerPoint, Image, etc.).

Endpoint
- POST `/convert` (multipart/form-data)

Required form fields
- `file` (file): The file to convert. Required.
- `action` (string): Conversion action. Required. See "Actions" below.

Optional form fields
- `tool` (string): default `convert` (not used by logic, present for Swagger).
- `session_id` (string): optional session id to group uploads.
- `page_format` (string): only for `image_to_pdf`; `a4` (default, fit image to A4) or `original` (keep source dimensions).
- Additional dynamic settings: any other form fields are accepted and will be parsed into `settings` (values `on`/`true` => True, `false`/empty => False, numeric strings => int, otherwise kept as string).

Actions (valid values and required input file extensions)
- `pdf_to_word`: requires `.pdf`
- `word_to_pdf`: requires `.docx`
- `pdf_to_excel`: requires `.pdf`
- `excel_to_pdf`: requires `.xlsx`
- `pdf_to_powerpoint`: requires `.pdf`
- `powerpoint_to_pdf`: requires `.pptx`
- `pdf_to_image`: requires `.pdf`
- `image_to_pdf`: requires `.png`, `.jpg`, `.jpeg`
- `merge_pdf`: requires `.pdf`
- `split_pdf`: requires `.pdf`

Validation behavior
- If `file` missing → 400
- If `action` missing or unknown → 400
- If uploaded file extension does not match expected for `action` → 422 with details
- On conversion failure → 500

Examples
1) Word to PDF
```bash
curl -X POST "http://localhost:8000/convert" \
  -F "file=@sample.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document" \
  -F "action=word_to_pdf"
```

2) PDF to images (extra settings parsed automatically)
```bash
curl -X POST "http://localhost:8000/convert" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "action=pdf_to_image" \
  -F "dpi=200"
```

Response
- Success: returns the converted file as a file download with appropriate `Content-Type` and `Content-Disposition`.
- Errors: JSON error with appropriate HTTP status code.

Notes for frontend
- Always set `action` to one of the allowed values.
- Ensure the uploaded file extension matches the required extensions (frontend should validate before upload).
- For `image_to_pdf`, pass `page_format=original` when you want each image kept at its native dimensions; default `a4` will fit onto an A4 page.
- Additional boolean/number fields can be passed as form fields and will be parsed into settings by the backend.