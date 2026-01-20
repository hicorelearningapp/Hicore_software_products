Edit Controller — `/edit`

Purpose
- Edit or annotate PDF files: annotate, add watermark, crop, add page numbers, etc.

Endpoint
- POST `/edit` (multipart/form-data)

Required form fields
- `action` (string): the edit action to perform (e.g., `annotate_pdf`).
- `file` (file): the PDF input file.

Special case: `annotate_pdf`
- Use the `annotations` form field to pass a JSON string describing annotations.
- `annotations` example (JSON string):
```json
[
  {"type": "label", "text": "Hello", "page": 1, "x": 100, "y": 200},
  {"type": "highlight", "page": 2, "rect": [50, 60, 300, 120], "color": [1, 1, 0]}
]
```

Annotation model (fields frontend can set)
- `type` (string): annotation type, e.g. `label`, `highlight`, `box`, `signature` (depending on backend capabilities).
- `text` (string): text content for label/text annotations.
- `page` (int): 1-based page number.
- `x`, `y` (ints): coordinates for point annotations.
- `rect` (list[int]): rectangle coordinates [x0, y0, x1, y1] for area annotations.
- `color` (list[float]): color as RGB floats (0-1) or other format depending on backend.

Other edit actions
- For non-annotation actions, pass individual form fields:
  - `text` (string)
  - `page` (int)
  - `position_x` (int), `position_y` (int)
  - `width` (int), `height` (int)

Examples
1) Annotate PDF with two annotations
```bash
curl -X POST "http://localhost:8000/edit" \
  -F "action=annotate_pdf" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F 'annotations=[{"type":"label","text":"Hi","page":1,"x":100,"y":200}]'
```

2) Add watermark (example action `add_watermark`, fields depend on manager)
```bash
curl -X POST "http://localhost:8000/edit" \
  -F "action=add_watermark" \
  -F "file=@sample.pdf;type=application/pdf" \
  -F "text=CONFIDENTIAL" \
  -F "page=1"
```

Response
- Returns edited file as a download on success.
- Errors: 400 for missing `annotations` when `annotate_pdf`, 422 for malformed JSON, 500 for processing errors.

Notes for frontend
- `annotations` must be a valid JSON string when passed in multipart/form-data.
- Validate annotation payload locally where possible (page numbers, rect lengths, types) to reduce server errors.
- The backend removes the temporary uploaded file after returning the output (background cleanup).