Organizer Controller — `/organize`

Purpose
- Merge, split, rotate, compress, delete pages, reorder, remove duplicates, and extract pages from PDFs.

Endpoint
- POST `/organize` (multipart/form-data)

Required form fields
- `action` (string): one of `merge_pdf`, `split_pdf`, `rotate_pdf`, `compress_pdf`, `delete_pages`, `extract_pages`, `reorder_pdf`, `remove_duplicate_pages`.
- `files` (file[]): one or more PDF files (most actions use a single file; `merge_pdf` accepts many).

Page-selection fields (use `pages` as canonical)
- `pages` (string): canonical field for page-selection. Accepts comma/range strings like `1,3,5-7`.
- `page_ranges` (string): legacy; values like `1-3,5-7` — still supported but prefer `pages`.
- `pages_to_delete` (string): comma-separated integers (e.g., `2,4,7`) for delete_pages action.
- `order` (string): comma-separated integers. For `merge_pdf`, this reorders uploaded files (1-indexed positions, e.g., `2,1,3`). For `reorder_pdf`, this defines the new page order within a single PDF.
- `mode` (string): for `extract_pages`, `merge` (default) or `separate` (return separate files)

Other fields
- `degrees` (string/int): for rotation.

Behavior and validation
- `pages` is parsed as a list of unique 1-based page ints preserving order.
- For `extract_pages`, `pages` is required — server will return 400 if missing.
- `page_ranges` still accepted for split/advanced operations.
- `files` are saved server-side and passed to the organizer manager.

Hybrid pages input (updated)
- You can now send `pages` as either:
  - Comma/range string: `"1,3,5-7"` (parsed by backend using helpers.parse_page_list)
  - JSON array of ints: `[1,3,5]`
  - JSON array of ranges: `[[1,3],[5,7]]` (expands to 1,2,3,5,6,7)
- The backend will first try to parse JSON, then fallback to string parsing using the shared helper.

Examples
1) Extract pages 1, 3 and 5-7, merge result into a single PDF
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=extract_pages" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F "pages=1,3,5-7" \
  -F "mode=merge"
```

2) Delete pages 2 and 4
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=delete_pages" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F "pages_to_delete=2,4"
```

3) Split into ranges (legacy `page_ranges` format)
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=split_pdf" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F "page_ranges=1-3,4-6"
```

4) Extract pages 1, 3, 5-7 (string):
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=extract_pages" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F "pages=1,3,5-7" \
  -F "mode=merge"
```
5) Extract pages as JSON array:
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=extract_pages" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F 'pages=[1,3,5,6,7]'
```
6) Extract ranges as JSON array:
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=extract_pages" \
  -F "files=@sample.pdf;type=application/pdf" \
  -F 'pages=[[1,3],[5,7]]'
```

7) Merge three PDFs in a custom order (file positions)
```bash
curl -X POST "http://localhost:8000/organize" \
  -F "action=merge_pdf" \
  -F "files=@first.pdf;type=application/pdf" \
  -F "files=@second.pdf;type=application/pdf" \
  -F "files=@third.pdf;type=application/pdf" \
  -F "order=2,1,3"   # merge second file first, then first, then third
```

Errors you may see
- 400: invalid or missing parameters (e.g., missing `pages` for `extract_pages`, invalid `degrees`)
- 422: invalid page range formats
- 500: processing error (manager failed)

Notes for frontend
- Prefer `pages` as the single source for page selection; avoid sending both `pages` and `page_ranges`.
- Replace Swagger placeholder `string` with a real value when testing via UI.
- For `merge_pdf`, upload multiple files in the `files` field; use `order` to set the merge sequence (1-indexed by uploaded file position).
- For `reorder_pdf`, `order` applies to page positions inside the PDF (also 1-indexed).
- API expects 1-based page numbers (page 1 is the first page).
- You can send any of the above formats for `pages`.
- For legacy clients, `page_ranges` and `pages_to_delete` are still supported.
- Prefer `pages` for all new integrations.