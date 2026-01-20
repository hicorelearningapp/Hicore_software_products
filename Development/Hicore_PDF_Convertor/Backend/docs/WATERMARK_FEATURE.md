# Watermark Feature Documentation

## Overview

The `add_watermark` action supports two types of watermarks:
1. **Text Watermark** - Diagonal text overlay (original behavior)
2. **Image Watermark** - Image file positioned anywhere on PDF pages

---

## Text Watermark (Default)

### API Endpoint
```
POST /edit
```

### Parameters
- `action`: `"add_watermark"`
- `file`: PDF file to watermark
- `text`: Watermark text (default: "CONFIDENTIAL")
- `watermark_opacity`: Opacity 0-1 (default: 0.3)

### Example Request (curl)
```bash
curl -X POST "http://localhost:8000/edit" \
  -F "action=add_watermark" \
  -F "file=@document.pdf" \
  -F "text=DRAFT" \
  -F "watermark_opacity=0.4"
```

### Example Request (Python)
```python
import requests

files = {'file': open('document.pdf', 'rb')}
data = {
    'action': 'add_watermark',
    'text': 'CONFIDENTIAL',
    'watermark_opacity': 0.3
}

response = requests.post('http://localhost:8000/edit', files=files, data=data)
with open('watermarked.pdf', 'wb') as f:
    f.write(response.content)
```

---

## Image Watermark

### API Endpoint
```
POST /edit
```

### Parameters
- `action`: `"add_watermark"`
- `file`: PDF file to watermark
- `watermark_type`: `"image"` (required)
- `watermark_image`: Image file (PNG, JPG, etc.)
- `watermark_x`: X position, normalized 0-1 (default: 0.85, bottom-right)
- `watermark_y`: Y position, normalized 0-1 (default: 0.05, bottom-right)
- `watermark_scale`: Scale factor (default: 0.15, 15% of page width)
- `watermark_opacity`: Opacity 0-1 (default: 0.5)
- `page`: Page number or `"all"` (default: "all")

### Coordinate System
- **Origin**: Bottom-left corner of page
- **X-axis**: 0 (left edge) → 1 (right edge)
- **Y-axis**: 0 (bottom edge) → 1 (top edge)

### Common Positions
| Position | X | Y | Description |
|----------|---|---|-------------|
| Bottom-right | 0.85 | 0.05 | Default, logo corner |
| Bottom-left | 0.05 | 0.05 | Left corner |
| Top-right | 0.85 | 0.90 | Header area |
| Top-left | 0.05 | 0.90 | Header left |
| Center | 0.45 | 0.45 | Page center |

### Example Request (curl)
```bash
curl -X POST "http://localhost:8000/edit" \
  -F "action=add_watermark" \
  -F "file=@document.pdf" \
  -F "watermark_type=image" \
  -F "watermark_image=@logo.png" \
  -F "watermark_x=0.85" \
  -F "watermark_y=0.05" \
  -F "watermark_scale=0.1" \
  -F "watermark_opacity=0.6" \
  -F "page=all"
```

### Example Request (Python)
```python
import requests

files = {
    'file': open('document.pdf', 'rb'),
    'watermark_image': open('logo.png', 'rb')
}

data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.85,      # Bottom-right
    'watermark_y': 0.05,
    'watermark_scale': 0.15,  # 15% of page width
    'watermark_opacity': 0.5,
    'page': 'all'
}

response = requests.post('http://localhost:8000/edit', files=files, data=data)
with open('watermarked.pdf', 'wb') as f:
    f.write(response.content)
```

### Example Request (JavaScript/Frontend)
```javascript
const formData = new FormData();
formData.append('action', 'add_watermark');
formData.append('file', pdfFile);  // File object from input
formData.append('watermark_type', 'image');
formData.append('watermark_image', logoFile);  // File object from input
formData.append('watermark_x', 0.85);
formData.append('watermark_y', 0.05);
formData.append('watermark_scale', 0.1);
formData.append('watermark_opacity', 0.6);
formData.append('page', 'all');

const response = await fetch('/edit', {
    method: 'POST',
    body: formData
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Use url to download or display
```

---

## Use Cases

### 1. Company Logo on All Pages
```python
data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.85,
    'watermark_y': 0.05,
    'watermark_scale': 0.12,
    'watermark_opacity': 0.7,
    'page': 'all'
}
```

### 2. "DRAFT" Stamp on First Page Only
```python
data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.4,
    'watermark_y': 0.4,
    'watermark_scale': 0.3,
    'watermark_opacity': 0.3,
    'page': 1
}
```

### 3. Signature Image in Bottom-Left
```python
data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.05,
    'watermark_y': 0.05,
    'watermark_scale': 0.2,
    'watermark_opacity': 1.0,  # Fully opaque
    'page': 1
}
```

### 4. Large Background Watermark (Center)
```python
data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.3,  # Adjust to center based on scale
    'watermark_y': 0.3,
    'watermark_scale': 0.5,  # 50% of page width
    'watermark_opacity': 0.1,  # Very faint
    'page': 'all'
}
```

---

## Technical Details

### Image Aspect Ratio
The watermark maintains the original aspect ratio of the image. The `watermark_scale` parameter controls the width as a percentage of page width, and height is calculated automatically.

### Supported Image Formats
- PNG (recommended for transparency)
- JPG/JPEG
- GIF
- BMP
- Any format supported by PyMuPDF

### Performance
- Image watermarks use PyMuPDF's `insert_image()` method
- Maintains PDF quality
- Small file size increase (embedded image data)

### Transparency
- For PNG images with transparency, the alpha channel is preserved
- `watermark_opacity` applies additional transparency on top of image's alpha
- JPG images don't support transparency, so only `watermark_opacity` affects them

### Page Selection
- `page=1`: First page only
- `page=5`: Fifth page only
- `page="all"`: All pages (default)

---

## Error Handling

### Missing Image File
```json
{
  "detail": "image_path is required for image watermarks"
}
```
**Solution**: Include `watermark_image` file in request

### Invalid Image File
```json
{
  "detail": "Image file not found: /path/to/image.png"
}
```
**Solution**: Ensure image file is valid and accessible

### Invalid Coordinates
Coordinates are automatically clamped to 0-1 range:
- `watermark_x=-0.5` → clamped to `0.0`
- `watermark_y=1.5` → clamped to `1.0`

### Invalid Scale
Scale is clamped to minimum 0.01 (1% of page width)

---

## Migration Guide

### Existing Text Watermark Code
No changes needed! Existing code continues to work:

```python
# This still works exactly as before
data = {
    'action': 'add_watermark',
    'text': 'CONFIDENTIAL'
}
```

### Switching to Image Watermark
Just add `watermark_type="image"` and image file:

```python
# Old text watermark
data = {
    'action': 'add_watermark',
    'text': 'CONFIDENTIAL'
}

# New image watermark
files = {
    'file': pdf_file,
    'watermark_image': logo_file
}
data = {
    'action': 'add_watermark',
    'watermark_type': 'image',
    'watermark_x': 0.85,
    'watermark_y': 0.05,
    'watermark_scale': 0.15,
    'watermark_opacity': 0.5
}
```

---

## Backend Implementation

### Code Location
- **Operation Class**: `modules/edit/edit_operations.py` - `AddWatermark` class
- **API Controller**: `api/controllers/edit_controller.py` - `/edit` endpoint

### Key Methods
- `_add_text_watermark()`: Handles text watermarks (reportlab)
- `_add_image_watermark()`: Handles image watermarks (PyMuPDF)

### Coordinate Conversion
```python
# Normalized to PDF points
x = x_norm * page_width
y = y_norm * page_height

# Image dimensions
img_width = page_width * scale
img_height = img_width / img_aspect_ratio

# Placement rectangle
rect = fitz.Rect(x, y, x + img_width, y + img_height)
```

---

## Testing Checklist

- [ ] Text watermark on single PDF
- [ ] Text watermark with custom text
- [ ] Text watermark with custom opacity
- [ ] Image watermark (PNG) on all pages
- [ ] Image watermark (JPG) on specific page
- [ ] Image watermark at different positions (corners, center)
- [ ] Image watermark with different scales (0.05, 0.15, 0.5)
- [ ] Image watermark with different opacities (0.2, 0.5, 1.0)
- [ ] PNG with transparency maintains alpha channel
- [ ] Multi-page PDF with watermark on page 1 only
- [ ] Multi-page PDF with watermark on all pages

---

## FAQ

**Q: Can I add multiple watermarks?**  
A: Currently, one watermark per request. To add multiple, chain requests or modify backend to accept array of watermarks.

**Q: Can I rotate the image watermark?**  
A: Not currently supported. The image is placed at 0° rotation.

**Q: What happens if the image is larger than the page?**  
A: The `watermark_scale` parameter controls size relative to page width. Even large images scale down appropriately.

**Q: Can I use SVG images?**  
A: PyMuPDF doesn't natively support SVG. Convert to PNG first.

**Q: Does the watermark appear above or below PDF content?**  
A: Image watermarks are inserted on top of existing content (foreground layer).

---

## Version History

- **v1.0** (Dec 2025): Initial text watermark support
- **v2.0** (Dec 2025): Added image watermark support with positioning and scaling
