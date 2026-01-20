import os
import io
import fitz  # PyMuPDF
from abc import ABC, abstractmethod
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from PIL import Image  # For reading image dimensions
import logging

# ============================================================
# 🧠 Base Class
# ============================================================
class EditBase(ABC):
    @abstractmethod
    def Execute(self, InputFiles: list[str], OutputFile: str, **kwargs):
        pass


# ============================================================
# ✏️ Implementations
# ============================================================

class AnnotatePDF(EditBase):
    """Adds text and ink annotations to PDF pages with normalized coordinates."""
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            doc = fitz.open(input_pdf)
            annotations = kwargs.get("annotations", [])

            for annot in annotations:
                page_index = annot.get("page", 1) - 1
                if page_index >= len(doc):
                    continue
                page = doc[page_index]
                page_rect = page.rect  # Get page dimensions
                page_width = page_rect.width
                page_height = page_rect.height
                
                annot_type = annot.get("type", "text").lower()

                if annot_type == "text":
                    # Text annotation with normalized coordinates
                    text = annot.get("text", "")
                    x_norm = annot.get("x", 0.5)  # Normalized 0-1
                    y_norm = annot.get("y", 0.5)  # Normalized 0-1
                    font_size = annot.get("font_size", 12)
                    color = annot.get("color", [0, 0, 0])  # RGB 0-1
                    
                    # Convert from top-left origin (canvas) to bottom-left origin (PDF)
                    # PDF Y-axis starts at bottom, canvas starts at top
                    x = x_norm * page_width
                    y = (1 - y_norm) * page_height  # Flip Y coordinate
                    
                    # Convert RGB 0-1 to tuple
                    color_tuple = tuple(color) if color else (0, 0, 0)
                    
                    page.insert_text((x, y), text, fontsize=font_size, color=color_tuple)
                    logging.info(f"✅ Added text annotation at ({x:.1f}, {y:.1f})")

                elif annot_type == "ink":
                    # Ink/drawing annotation with normalized point arrays
                    points_norm = annot.get("points", [])
                    color = annot.get("color", [0, 0, 0])
                    width = annot.get("width", 2)
                    opacity = annot.get("opacity", None)  # Optional opacity for translucent ink
                    
                    # Validate and clamp coordinates to 0-1 range
                    points_norm = [[min(max(pt[0], 0), 1), min(max(pt[1], 0), 1)] for pt in points_norm]
                    
                    # Convert from top-left origin (canvas) to bottom-left origin (PDF)
                    # Flip Y coordinates for PDF coordinate system
                    points_scaled = [
                        (pt[0] * page_width, (1 - pt[1]) * page_height) 
                        for pt in points_norm
                    ]
                    
                    # Draw directly on page content for better visual fidelity
                    # This makes the drawing permanent and looks exactly like the preview
                    color_tuple = tuple(color) if color else (0, 0, 0)
                    
                    # Create shape object for drawing
                    shape = page.new_shape()
                    
                    # Draw smooth path through all points
                    if len(points_scaled) > 0:
                        # Start at first point
                        shape.draw_line(points_scaled[0], points_scaled[0])
                        
                        # Draw lines connecting all points
                        for i in range(1, len(points_scaled)):
                            shape.draw_line(points_scaled[i-1], points_scaled[i])
                    
                    # Finish with styling for smooth appearance
                    finish_kwargs = {
                        "width": width,           # Line thickness
                        "color": color_tuple,     # Line color
                        "fill": None,            # No fill
                        "lineCap": 1,            # Round line caps for smooth appearance
                        "lineJoin": 1            # Round line joins for smooth corners
                    }
                    
                    # Add opacity if provided (for translucent pen strokes)
                    if opacity is not None:
                        finish_kwargs["stroke_opacity"] = opacity
                    
                    shape.finish(**finish_kwargs)
                    
                    # Commit the drawing to the page
                    shape.commit()
                    
                    opacity_str = f", opacity={opacity}" if opacity is not None else ""
                    logging.info(f"✅ Drew ink path with {len(points_scaled)} points, width={width}{opacity_str}")

                elif annot_type == "highlight":
                    # Translucent highlight effect (like a highlighter marker)
                    rect_norm = annot.get("rect", None)
                    points_norm = annot.get("points", None)
                    color = annot.get("color", [1, 1, 0])  # Default yellow
                    opacity = annot.get("opacity", 0.35)  # Default 35% transparent
                    width = annot.get("width", None)  # For stroke-style highlighting
                    
                    color_tuple = tuple(color) if color else (1, 1, 0)
                    shape = page.new_shape()
                    
                    if rect_norm:
                        # Rectangular highlight (most common for text highlighting)
                        # rect format: [x, y, width, height] in normalized coordinates
                        x, y, w, h = rect_norm
                        
                        # Validate and clamp coordinates to 0-1 range
                        x = min(max(x, 0), 1)
                        y = min(max(y, 0), 1)
                        w = min(max(w, 0), 1 - x)  # Ensure w doesn't exceed page boundary
                        h = min(max(h, 0), 1 - y)  # Ensure h doesn't exceed page boundary
                        
                        # Skip if dimensions are effectively zero
                        if w < 0.001 or h < 0.001:
                            logging.warning(f"⚠️ Skipping highlight with zero dimensions: w={w}, h={h}")
                            continue
                        
                        # Convert from top-left origin (canvas) to bottom-left origin (PDF)
                        # PDF Y-axis starts at bottom, so we need to flip the Y coordinate
                        y_pdf = 1 - y - h  # Flip Y to PDF coordinate system
                        
                        rect_scaled = fitz.Rect(
                            x * page_width,
                            y_pdf * page_height,
                            (x + w) * page_width,
                            (y_pdf + h) * page_height
                        )
                        shape.draw_rect(rect_scaled)
                        shape.finish(
                            fill=color_tuple,
                            fill_opacity=opacity,
                            stroke_opacity=0  # No border
                        )
                        logging.info(f"✅ Drew rectangular highlight at ({x:.2f}, {y:.2f}) size ({w:.2f}x{h:.2f})")
                    
                    elif points_norm:
                        # Freeform highlight path - can be either stroke-style or filled polygon
                        # Validate and clamp coordinates to 0-1 range
                        points_norm = [[min(max(pt[0], 0), 1), min(max(pt[1], 0), 1)] for pt in points_norm]
                        
                        # Convert from top-left origin (canvas) to bottom-left origin (PDF)
                        # Flip Y coordinates for PDF coordinate system
                        points_scaled = [
                            (pt[0] * page_width, (1 - pt[1]) * page_height) 
                            for pt in points_norm
                        ]
                        
                        if width:
                            # Draw as a thick translucent stroke (like a highlighter marker)
                            # This creates the visual effect of drawing with a highlighter pen
                            if len(points_scaled) > 0:
                                # Start at first point
                                shape.draw_line(points_scaled[0], points_scaled[0])
                                
                                # Draw lines connecting all points
                                for i in range(1, len(points_scaled)):
                                    shape.draw_line(points_scaled[i-1], points_scaled[i])
                            
                            # Finish with translucent stroke
                            shape.finish(
                                width=width,
                                color=color_tuple,
                                fill=None,
                                stroke_opacity=opacity,  # Translucent stroke
                                lineCap=1,  # Round caps
                                lineJoin=1  # Round joins
                            )
                            logging.info(f"✅ Drew highlight stroke with {len(points_scaled)} points, width={width}, opacity={opacity}")
                        else:
                            # Draw filled polygon for freeform highlight (no width specified)
                            if len(points_scaled) >= 3:
                                # Create a closed polygon from the points
                                shape.draw_polyline(points_scaled)
                                shape.finish(
                                    fill=color_tuple,
                                    fill_opacity=opacity,
                                    stroke_opacity=0
                                )
                                logging.info(f"✅ Drew freeform highlight polygon with {len(points_scaled)} points")
                            else:
                                logging.warning(f"⚠️ Highlight polygon needs at least 3 points, got {len(points_scaled)}")
                    
                    else:
                        logging.error("❌ Highlight requires either 'rect' or 'points'")
                        continue
                    
                    shape.commit()

                elif annot_type == "box":
                    # Legacy box support
                    rect = fitz.Rect(annot.get("rect", (100, 100, 300, 200)))
                    color = tuple(annot.get("color", (1, 0, 0)))
                    box = page.add_rect_annot(rect)
                    box.set_colors(stroke=color)
                    box.update()

            doc.save(OutputFile)
            logging.info(f"✅ Annotated PDF with {len(annotations)} annotation(s) → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ AnnotatePDF failed: {e}", exc_info=True)
            return None


class CropPDF(EditBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            crop_box = kwargs.get("crop_box", (50, 50, 500, 700))
            page_param = kwargs.get("page", "all")  # Can be int or "all"
            input_pdf = InputFiles[0]
            doc = fitz.open(input_pdf)
            
            logging.info(f"📐 Received crop_box: {crop_box}")
            logging.info(f"📄 Page parameter: {page_param}")
            
            # Get the first page to check dimensions
            first_page = doc[0]
            page_rect = first_page.rect
            logging.info(f"📏 Page dimensions: {page_rect.width} x {page_rect.height}")
            
            # Check if coordinates are normalized (0-1 range) and convert to PDF coordinates
            x0, y0, x1, y1 = crop_box
            
            # If all values are between 0 and 1, they're likely normalized coordinates
            if all(0 <= val <= 1 for val in [x0, y0, x1, y1]):
                logging.info("🔄 Converting normalized coordinates to PDF points")
                x0 = x0 * page_rect.width
                y0 = y0 * page_rect.height
                x1 = x1 * page_rect.width
                y1 = y1 * page_rect.height
                crop_box = (x0, y0, x1, y1)
                logging.info(f"📐 Converted crop_box: {crop_box}")
            
            # PyMuPDF uses (x0, y0, x1, y1) where (x0, y0) is bottom-left
            # Create a fitz.Rect from the crop box
            crop_rect = fitz.Rect(crop_box)
            logging.info(f"📦 Final crop rect: {crop_rect}")
            
            # Handle page parameter
            if page_param == "all" or page_param is None:
                # Crop all pages
                for page in doc:
                    page.set_cropbox(crop_rect)
                logging.info(f"✅ Cropped all {len(doc)} pages")
            else:
                # Crop specific page (1-indexed from frontend, 0-indexed in PyMuPDF)
                page_index = int(page_param) - 1
                if 0 <= page_index < len(doc):
                    page = doc[page_index]
                    page.set_cropbox(crop_rect)
                    logging.info(f"✅ Cropped page {page_param}")
                else:
                    logging.error(f"❌ Invalid page number: {page_param} (PDF has {len(doc)} pages)")
                    raise ValueError(f"Page {page_param} is out of range (1-{len(doc)})")
            
            doc.save(OutputFile)
            logging.info(f"✅ Cropped PDF saved → {OutputFile}")
        except Exception as e:
            logging.error(f"❌ CropPDF failed: {e}")
            raise
        finally:
            if 'doc' in locals():
                doc.close()
        return OutputFile


class AddWatermark(EditBase):
    """Add text or image watermark to PDF pages.
    
    Supports two modes:
    1. Text watermark (default): Diagonal text across the page
    2. Image watermark: Image file placed at specified position
    
    Can process multiple watermarks from frontend settings.
    
    Parameters:
        watermarks: List of watermark configurations (from frontend settings JSON)
            Each watermark has: type, x, y, page, image_path, text, etc.
        apply_to_all_pages: Boolean, apply watermarks to all pages
        
        Legacy single-watermark parameters:
            watermark_type: "text" or "image"
            text: Watermark text
            image_path: Path to image file
            x, y: Position coordinates
            scale: Image scale factor
            opacity: Opacity 0-1
            page: Page number or "all"
    """
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            
            # Check if we have the new watermarks array format
            watermarks = kwargs.get("watermarks")
            if watermarks:
                return self._add_multiple_watermarks(input_pdf, OutputFile, **kwargs)
            
            # Legacy single watermark support
            watermark_type = kwargs.get("watermark_type", "text").lower()
            if watermark_type == "image":
                return self._add_image_watermark(input_pdf, OutputFile, **kwargs)
            else:
                return self._add_text_watermark(input_pdf, OutputFile, **kwargs)
                
        except Exception as e:
            logging.error(f"❌ AddWatermark failed: {e}")
            return None
    
    def _add_multiple_watermarks(self, input_pdf, OutputFile, **kwargs):
        """Add multiple watermarks from frontend settings.
        
        Handles the format sent by frontend:
        {
            "watermarks": [
                {"type": "image", "x": 150, "y": 200, "page": 1, "image_path": "/path/to/image.png"},
                {"type": "text", "text": "DRAFT", "page": 2}
            ],
            "apply_to_all_pages": false
        }
        """
        watermarks = kwargs.get("watermarks", [])
        apply_to_all = kwargs.get("apply_to_all_pages", False)
        
        if not watermarks:
            logging.warning("⚠️ No watermarks provided, using default text watermark")
            return self._add_text_watermark(input_pdf, OutputFile, **kwargs)
        
        logging.info(f"📝 Processing {len(watermarks)} watermark(s), apply_to_all={apply_to_all}")
        doc = fitz.open(input_pdf)
        
        for idx, wm_config in enumerate(watermarks):
            wm_type = wm_config.get("type", "text").lower()
            page_num = wm_config.get("page", 1)
            
            logging.info(f"🔄 Processing watermark {idx+1}/{len(watermarks)}: type={wm_type}, page={page_num}")
            logging.info(f"   Config: {wm_config}")
            
            # Determine which pages to apply to
            if apply_to_all:
                pages_to_process = range(len(doc))
            else:
                # Convert to 0-indexed
                page_index = page_num - 1 if isinstance(page_num, int) else 0
                if 0 <= page_index < len(doc):
                    pages_to_process = [page_index]
                else:
                    logging.warning(f"⚠️ Page {page_num} out of range, skipping watermark")
                    continue
            
            # Process based on watermark type
            try:
                if wm_type == "image":
                    self._apply_image_watermark_to_pages(
                        doc, pages_to_process, wm_config
                    )
                else:
                    self._apply_text_watermark_to_pages(
                        doc, pages_to_process, wm_config
                    )
            except Exception as e:
                logging.error(f"❌ Error applying watermark {idx+1}: {e}", exc_info=True)
                raise  # Re-raise to propagate error
        
        doc.save(OutputFile)
        doc.close()
        logging.info(f"✅ {len(watermarks)} watermark(s) added → {OutputFile}")
        return OutputFile
    
    def _apply_image_watermark_to_pages(self, doc, pages, config):
        """Apply an image watermark to specified pages.
        
        Frontend sends absolute pixel coordinates (x, y) from canvas.
        We need to convert these to PDF coordinates.
        """
        # Convert pages to list to avoid iterator exhaustion
        pages = list(pages)
        
        image_path = config.get("image_path")
        
        logging.info(f"🖼️ Applying image watermark:")
        logging.info(f"   Image path: {image_path}")
        logging.info(f"   Full config: {config}")
        
        if not image_path:
            raise ValueError("❌ No image_path provided for image watermark")
        
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"❌ Image file not found: {image_path}")
        
        logging.info(f"✅ Image file exists")
        
        # Get position from frontend (absolute coordinates)
        x_px = config.get("x", 100)
        y_px = config.get("y", 100)
        opacity = config.get("opacity", 0.3)  # Default lower for watermark feel
        
        logging.info(f"   Position: x={x_px}px, y={y_px}px (canvas coordinates)")
        logging.info(f"   Opacity: {opacity}")
        
        # Optional: scale parameter (if frontend sends it)
        scale = config.get("scale", None)
        
        # Prepare image with transparency using Pillow
        from PIL import ImageEnhance
        import io
        
        img_bytes = None
        img_width_original = 0
        img_height_original = 0
        
        try:
            with Image.open(image_path) as img:
                img_width_original = img.width
                img_height_original = img.height
                
                # Convert to RGBA
                img = img.convert("RGBA")
                
                # Reduce opacity
                # Split channels, enhance alpha, merge back
                alpha = img.split()[3]
                alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
                img.putalpha(alpha)
                
                # Save to bytes for PyMuPDF
                buf = io.BytesIO()
                img.save(buf, format="PNG")
                img_bytes = buf.getvalue()
                
            logging.info(f"✅ Image processed with opacity {opacity}")
        except Exception as e:
            raise ValueError(f"❌ Failed to process image: {e}")
        
        for page_index in pages:
            page = doc[page_index]
            page_height = page.rect.height
            page_width = page.rect.width
            
            logging.info(f"   📄 Processing page {page_index + 1}: {page_width} x {page_height}")
            
            # Convert Y coordinate: Canvas (top-origin) → PDF (bottom-origin)
            # Frontend Y=0 is top, PDF Y=0 is bottom
            y_pdf = page_height - y_px - img_height_original
            
            # Determine image size
            if scale:
                img_width = page_width * scale
                img_aspect = img_width_original / img_height_original
                img_height = img_width / img_aspect
            else:
                # Use original dimensions
                img_width = img_width_original
                img_height = img_height_original
            
            # Create rectangle for image placement
            rect = fitz.Rect(x_px, y_pdf, x_px + img_width, y_pdf + img_height)
            
            # Insert image using stream (in-memory bytes)
            try:
                page.insert_image(rect, stream=img_bytes, overlay=True)
                logging.info(f"   ✅ Image inserted on page {page_index + 1}")
            except Exception as e:
                raise RuntimeError(f"❌ Failed to insert image on page {page_index + 1}: {e}")
        
        logging.info(f"🎉 Image watermark applied to {len(pages)} page(s)")
    
    def _apply_text_watermark_to_pages(self, doc, pages, config):
        """Apply text watermark to specified pages using PyMuPDF TextWriter.
        
        Creates a large diagonal watermark spanning the page.
        """
        import math
        
        # Convert pages to list to avoid iterator exhaustion
        pages = list(pages)
        
        text = config.get("text", "CONFIDENTIAL")
        x = config.get("x", None)
        y = config.get("y", None)
        
        # Watermark settings
        # Use very light gray for "translucent" look on white paper
        # 0.80 is a balanced light gray
        watermark_color = (0.80, 0.80, 0.80)
        angle = 45  # Degrees
        
        for page_index in pages:
            page = doc[page_index]
            page_width = page.rect.width
            page_height = page.rect.height
            
            # Calculate font size to span across the page
            diagonal_length = math.sqrt(page_width**2 + page_height**2)
            
            # Dynamic font size calculation
            # We want the text width to cover about 60-70% of the diagonal length
            # Average char width is approx 0.6 * font_size for Helvetica
            # text_width = len(text) * 0.6 * font_size
            # We want text_width = 0.6 * diagonal_length
            # So: font_size = diagonal_length / len(text)
            
            # Use a slightly more aggressive multiplier for visibility
            font_size = (diagonal_length * 1.0) / max(len(text), 1)
            # Clamp reasonable bounds
            font_size = max(50, min(font_size, 200))
            
            # Get font and text metrics
            font = fitz.Font("helv")
            text_width = font.text_length(text, fontsize=font_size)
            text_height = font_size
            
            # Determine Center Point (in PDF coordinates)
            if x is None or y is None:
                # Default: Center of page
                center_x = page_width / 2
                center_y = page_height / 2
            else:
                # User specified position (from Frontend Canvas)
                # Frontend Y is top-down, PDF Y is bottom-up
                center_x = x
                center_y = page_height - y
            
            # We want the text to be centered at (center_x, center_y) AFTER rotation.
            # PyMuPDF Matrix rotates around (0,0) by default, or we can specify pivot.
            
            # Actually simplest way with PyMuPDF TextWriter + Morph:
            # 1. Define text start position such that center of text is at specific point relative to insertion point.
            #    Start = (center_x - text_width/2, center_y + text_height/3)
            # 2. Define pivot at (center_x, center_y)
            # 3. Rotate around pivot.
            
            # Create a TextWriter
            tw = fitz.TextWriter(page.rect)
            
            start_x = center_x - text_width / 2
            start_y = center_y + text_height * 0.3  # Approx baseline offset to vertically center
            
            text_point = fitz.Point(start_x, start_y)
            
            # Add text to writer
            tw.append(
                text_point,
                text,
                font=font,
                fontsize=font_size
            )
            
            # Create rotation matrix around the center point
            # Matrix(alpha) is rotation by alpha degrees (clockwise in PDF?) no, counter-clockwise usually.
            # We want diagonal bottom-left to top-right.
            # Frontend visualization might be different, but standard watermark is 45 deg.
            
            # Use morph to rotate around the center point
            pivot = fitz.Point(center_x, center_y)
            rot_matrix = fitz.Matrix(angle) # Rotate 45 degrees
            
            # In PDF coords (Y up), +45 is counter-clockwise (flat -> diagonal up) which is desired.
            
            try:
                tw.write_text(
                    page,
                    color=watermark_color,
                    morph=(pivot, rot_matrix),
                    overlay=True
                )
                logging.info(f"✅ Watermark '{text}' added (size={font_size:.1f}, center={center_x:.1f},{center_y:.1f})")
            except Exception as e:
                logging.error(f"❌ Failed to add watermark: {e}")
                raise
    
    def _add_text_watermark(self, input_pdf, OutputFile, **kwargs):
        """Add diagonal text watermark using reportlab."""
        watermark_text = kwargs.get("text", "CONFIDENTIAL")
        opacity = kwargs.get("opacity", 0.3)

        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)
        can.setFont("Helvetica-Bold", 40)
        can.saveState()
        can.translate(300, 400)
        can.rotate(45)
        can.setFillAlpha(opacity)
        can.drawCentredString(0, 0, watermark_text)
        can.restoreState()
        can.save()
        packet.seek(0)

        watermark_pdf = PdfReader(packet)
        watermark_page = watermark_pdf.pages[0]

        reader = PdfReader(input_pdf)
        writer = PdfWriter()
        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        with open(OutputFile, "wb") as f:
            writer.write(f)
        logging.info(f"✅ Text watermark added → {OutputFile}")
        return OutputFile
    
    def _add_image_watermark(self, input_pdf, OutputFile, **kwargs):
        """Add image watermark using PyMuPDF (fitz).
        
        Uses normalized coordinates (0-1) for positioning:
        - (0, 0) = bottom-left corner
        - (1, 1) = top-right corner
        - Default (0.5, 0.5) = CENTER
        """
        image_path = kwargs.get("image_path")
        if not image_path:
            raise ValueError("image_path is required for image watermarks")
        
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        # Get parameters with defaults
        # CHANGED: Default to Center (0.5, 0.5) and Larger Scale (0.5)
        x_norm = kwargs.get("x", 0.5)  
        y_norm = kwargs.get("y", 0.5)  
        scale = kwargs.get("scale", 0.5)  # 50% of page width
        opacity = kwargs.get("opacity", 0.5)  # 50% transparent
        rotation = kwargs.get("rotation", 45) # Default 45 degrees
        page_param = kwargs.get("page", "all")  # All pages by default
        
        # Validate coordinates
        x_norm = min(max(x_norm, 0), 1)
        y_norm = min(max(y_norm, 0), 1)
        opacity = min(max(opacity, 0), 1)
        scale = max(scale, 0.01)  # Minimum 1% scale
        
        # Use Pillow to adjust opacity and rotation
        from PIL import ImageEnhance
        import io
        
        img_bytes = None
        img_width_original = 0
        img_height_original = 0
        img_aspect = 1.0

        try:
            with Image.open(image_path) as img:
                img_width_original = img.width
                img_height_original = img.height
                img_aspect = img.width / img.height
                
                # Convert to RGBA
                img = img.convert("RGBA")
                
                # Rotate (expand=True to fit the rotated image)
                if rotation != 0:
                    img = img.rotate(rotation, expand=True, resample=Image.BICUBIC)
                    logging.info(f"🔄 Image rotated by {rotation} degrees")
                
                # Reduce opacity
                alpha = img.split()[3]
                alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
                img.putalpha(alpha)
                
                # Update dimensions after rotation
                img_width_original = img.width
                img_height_original = img.height
                img_aspect = img.width / img.height

                # Save to bytes for PyMuPDF
                buf = io.BytesIO()
                img.save(buf, format="PNG")
                img_bytes = buf.getvalue()
                
            logging.info(f"✅ Image processed with opacity {opacity} and rotation {rotation}")
        except Exception as e:
             # Fallback if PIL fails
             logging.error(f"❌ Failed to process image with PIL: {e}")
             if not img_bytes:
                 try:
                     with open(image_path, "rb") as f:
                        img_bytes = f.read()
                 except:
                     raise ValueError(f"❌ Failed to read image: {image_path}")

        doc = fitz.open(input_pdf)
        
        # Determine which pages to watermark
        if isinstance(page_param, str) and page_param.lower() == "all":
            pages_to_watermark = range(len(doc))
        else:
            try:
                page_num = int(page_param) - 1  # Convert to 0-indexed
                if 0 <= page_num < len(doc):
                    pages_to_watermark = [page_num]
                else:
                    logging.warning(f"⚠️ Page {page_param} out of range, applying to all pages")
                    pages_to_watermark = range(len(doc))
            except (ValueError, TypeError):
                logging.warning(f"⚠️ Invalid page parameter: {page_param}, applying to all pages")
                pages_to_watermark = range(len(doc))
        
        for page_index in pages_to_watermark:
            page = doc[page_index]
            page_width = page.rect.width
            page_height = page.rect.height
            
            # Calculate image dimensions based on scale (relative to page width)
            img_width = page_width * scale
            img_height = img_width / img_aspect
            
            # Convert normalized coordinates to PDF points
            # Note: PDF Y-axis is bottom-up, so y_norm=0 is bottom
            x_center = x_norm * page_width
            y_center = y_norm * page_height
            
            # Calculate rect to center the image at (x_center, y_center)
            x0 = x_center - (img_width / 2)
            y0 = y_center - (img_height / 2)
            x1 = x_center + (img_width / 2)
            y1 = y_center + (img_height / 2)
            
            # Create rectangle for image placement
            rect = fitz.Rect(x0, y0, x1, y1)
            
            # Insert image using stream
            page.insert_image(
                rect,
                stream=img_bytes,
                overlay=True
            )
            
            logging.info(f"✅ Image watermark added to page {page_index + 1}")
        
        doc.save(OutputFile)
        doc.close()
        logging.info(f"✅ Image watermark added → {OutputFile}")
        return OutputFile


class AddPageNumbers(EditBase):
    def to_roman(self, n):
        if n <= 0: return ""
        val = [
            1000, 900, 500, 400,
            100, 90, 50, 40,
            10, 9, 5, 4,
            1
        ]
        syb = [
            "M", "CM", "D", "CD",
            "C", "XC", "L", "XL",
            "X", "IX", "V", "IV",
            "I"
        ]
        roman_num = ''
        i = 0
        while  n > 0:
            for _ in range(n // val[i]):
                roman_num += syb[i]
                n -= val[i]
            i += 1
        return roman_num

    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            temp_pdf = "temp_overlay.pdf"
            
            # Parse settings
            start_page = int(kwargs.get("start_page", 1))
            number_format = kwargs.get("number_format", "numbers")
            font_size = int(kwargs.get("font_size", 12))
            font_color = kwargs.get("font_color", "#000000")
            opacity = float(kwargs.get("opacity", 1.0))
            
            # Convert hex color to RGB tuple (0-1)
            try:
                if font_color.startswith("#"):
                    r = int(font_color[1:3], 16) / 255.0
                    g = int(font_color[3:5], 16) / 255.0
                    b = int(font_color[5:7], 16) / 255.0
                else:
                    r, g, b = 0, 0, 0
            except:
                r, g, b = 0, 0, 0

            reader = PdfReader(input_pdf)
            num_pages = len(reader.pages)

            c = canvas.Canvas(temp_pdf, pagesize=letter)
            
            for i in range(num_pages):
                current_num = start_page + i
                
                if number_format == "roman":
                    page_text = f"Page {self.to_roman(current_num)}"
                else:
                    page_text = f"Page {current_num}"
                
                c.setFont("Helvetica", font_size)
                c.setFillColorRGB(r, g, b, alpha=opacity)
                
                # Draw at bottom right (approx 520, 20)
                # Ideally should calculate width to right-align properly
                text_width = c.stringWidth(page_text, "Helvetica", font_size)
                x_pos = 550 - text_width  # Right margin 550
                y_pos = 20
                
                c.drawString(x_pos, y_pos, page_text)
                c.showPage()
            c.save()

            overlay_reader = PdfReader(temp_pdf)
            writer = PdfWriter()
            for i in range(num_pages):
                page = reader.pages[i]
                # Check for matching overlay page (robustness)
                if i < len(overlay_reader.pages):
                    page.merge_page(overlay_reader.pages[i])
                writer.add_page(page)

            with open(OutputFile, "wb") as f:
                writer.write(f)
            
            if os.path.exists(temp_pdf):
                os.remove(temp_pdf)
                
            logging.info(f"✅ Page numbers added ({number_format}) → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ AddPageNumbers failed: {e}")
            if os.path.exists("temp_overlay.pdf"):
                os.remove("temp_overlay.pdf")
            return None


class EditPDFContent(EditBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        import json
        try:
            input_pdf = InputFiles[0]
            doc = fitz.open(input_pdf)
            operation = kwargs.get("operation", "edit_text")
            
            if operation == "extract_text":
                extracted_data = {"pages": [], "total_pages": len(doc)}
                
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    blocks = page.get_text("dict")["blocks"]
                    page_data = {
                        "page_number": page_num + 1,
                        "width": page.rect.width,
                        "height": page.rect.height,
                        "text_blocks": []
                    }
                    
                    for block in blocks:
                        if block.get("type") != 0:
                            continue
                        for line in block.get("lines", []):
                            for span in line.get("spans", []):
                                text_info = {
                                    "text": span.get("text", ""),
                                    "bbox": span.get("bbox"),
                                    "font": span.get("font", ""),
                                    "size": span.get("size", 12),
                                    "color": span.get("color", 0),
                                    "flags": span.get("flags", 0)
                                }
                                page_data["text_blocks"].append(text_info)
                    
                    extracted_data["pages"].append(page_data)
                
                with open(OutputFile, "w", encoding="utf-8") as f:
                    json.dump(extracted_data, f, indent=2, ensure_ascii=False)
                
                doc.close()
                logging.info(f"✅ Text extracted → {OutputFile}")
                return extracted_data
            
            elif operation == "edit_text":
                edits = kwargs.get("edits", [])
                
                def _normalize_color(color_val):
                    try:
                        if not isinstance(color_val, (list, tuple)) or len(color_val) != 3:
                            return (0, 0, 0)
                        r, g, b = color_val
                        # If any component > 1, assume 0-255 and convert to 0-1
                        if (r is not None and r > 1) or (g is not None and g > 1) or (b is not None and b > 1):
                            return (float(r)/255.0, float(g)/255.0, float(b)/255.0)
                        return (float(r), float(g), float(b))
                    except Exception:
                        return (0, 0, 0)

                for edit in edits:
                    page_index = edit.get("page", 1) - 1
                    if page_index >= len(doc):
                        continue
                    
                    page = doc[page_index]
                    action = edit.get("action", "add").lower()
                    bbox = edit.get("bbox")
                    new_text = edit.get("new_text", "")
                    position = edit.get("position", [100, 100])
                    font = edit.get("font", "helv")
                    size = edit.get("size", 12)
                    color = _normalize_color(edit.get("color", [0, 0, 0]))
                    
                    try:
                        if action == "delete" and bbox:
                            rect = fitz.Rect(bbox)
                            page.add_redact_annot(rect, fill=(1, 1, 1))
                            page.apply_redactions()
                        
                        elif action == "edit" and bbox:
                            rect = fitz.Rect(bbox)
                            page.add_redact_annot(rect, fill=(1, 1, 1))
                            page.apply_redactions()
                            pos = edit.get("position") or [bbox[0], bbox[1]]
                            page.insert_text(pos, new_text, fontname=font, fontsize=size, color=color)
                        
                        elif action == "add":
                            page.insert_text(position, new_text, fontname=font, fontsize=size, color=color)
                    except Exception as ie:
                        logging.warning(f"⚠️ Skipped edit due to error: {ie}")
                
                doc.save(OutputFile)
                doc.close()
                logging.info(f"✅ Text edited → {OutputFile}")
                return OutputFile
            
            elif operation == "insert_images":
                images = kwargs.get("images", [])
                
                for img_data in images:
                    page_index = img_data.get("page", 1) - 1
                    if page_index >= len(doc):
                        continue
                    
                    page = doc[page_index]
                    image_path = img_data.get("image_path")
                    
                    if not image_path or not os.path.exists(image_path):
                        logging.warning(f"⚠️ Image not found: {image_path}")
                        continue
                    
                    rect = fitz.Rect(img_data.get("rect", [100, 100, 300, 300]))
                    rotate = img_data.get("rotate", 0)
                    overlay = img_data.get("overlay", True)
                    
                    page.insert_image(rect, filename=image_path, rotate=rotate, overlay=overlay)
                
                doc.save(OutputFile)
                doc.close()
                logging.info(f"✅ Images inserted → {OutputFile}")
                return OutputFile
                
        except Exception as e:
            logging.error(f"❌ EditPDFContent failed: {e}")
            return None


class RemoveDuplicatePages(EditBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            reader = PdfReader(input_pdf)
            writer = PdfWriter()

            seen_hashes = set()
            removed_pages = []
            kept_pages = []

            import hashlib

            # Loop through each page (1-based index)
            for page_num, page in enumerate(reader.pages, start=1):
                content = page.extract_text() or ""
                page_hash = hashlib.md5(content.encode("utf-8")).hexdigest()

                if page_hash in seen_hashes:
                    removed_pages.append(page_num)
                else:
                    seen_hashes.add(page_hash)
                    kept_pages.append(page_num)
                    writer.add_page(page)

            # Write final PDF
            with open(OutputFile, "wb") as f:
                writer.write(f)

            # Log full details
            logging.info("🔍 RemoveDuplicatePages summary:")
            logging.info(f"📄 Total pages before: {len(reader.pages)}")
            logging.info(f"📄 Total pages after: {len(kept_pages)}")
            logging.info(f"🗑 Removed pages: {removed_pages if removed_pages else 'None'}")
            logging.info(f"✅ Kept pages: {kept_pages}")

            logging.info(f"✅ Removed duplicate pages → {OutputFile}")
            return OutputFile

        except Exception as e:
            logging.error(f"❌ RemoveDuplicatePages failed: {e}")
            return None



class RemoveBlankPages(EditBase):
    """Remove blank or nearly blank pages from PDF."""
    
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            threshold = kwargs.get("blank_threshold", 100)  # Min characters to keep page
            
            reader = PdfReader(input_pdf)
            writer = PdfWriter()
            
            removed_pages = []
            kept_pages = []
            
            # Loop through each page
            for page_num, page in enumerate(reader.pages, start=1):
                content = page.extract_text() or ""
                # Remove whitespace and count characters
                clean_content = content.strip().replace(" ", "").replace("\n", "")
                char_count = len(clean_content)
                
                if char_count < threshold:
                    removed_pages.append(page_num)
                    logging.debug(f"  📄 Page {page_num}: {char_count} chars - REMOVED (blank)")
                else:
                    kept_pages.append(page_num)
                    writer.add_page(page)
                    logging.debug(f"  📄 Page {page_num}: {char_count} chars - KEPT")
            
            # Write final PDF
            with open(OutputFile, "wb") as f:
                writer.write(f)
            
            # Log summary
            logging.info("📋 RemoveBlankPages summary:")
            logging.info(f"  Total pages before: {len(reader.pages)}")
            logging.info(f"  Total pages after: {len(kept_pages)}")
            logging.info(f"  Removed blank pages: {removed_pages if removed_pages else 'None'}")
            logging.info(f"✅ Removed blank pages → {OutputFile}")
            
            return OutputFile
            
        except Exception as e:
            logging.error(f"❌ RemoveBlankPages failed: {e}")
            return None


class FixOrientation(EditBase):
    """Auto-detect and fix page orientation in PDF."""
    
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            doc = fitz.open(input_pdf)
            
            rotated_pages = []
            
            # Process each page
            for page_num in range(len(doc)):
                page = doc[page_num]
                
                # Get page dimensions
                rect = page.rect
                width = rect.width
                height = rect.height
                
                # Extract text to analyze orientation
                text = page.get_text()
                
                rotation_needed = 0
                current_rotation = page.rotation
                
                # Simple heuristic: if page is wider than tall but has text, might be rotated
                if width > height and len(text.strip()) > 50:
                    rotation_needed = 90
                elif height > width * 1.5 and current_rotation in [90, 270]:
                    rotation_needed = -current_rotation
                
                if rotation_needed != 0:
                    page.set_rotation((current_rotation + rotation_needed) % 360)
                    rotated_pages.append(f"Page {page_num + 1} (rotated {rotation_needed}°)")
                    logging.info(f"  🔄 Page {page_num + 1}: Rotated {rotation_needed}°")
            
            # Save the modified PDF
            doc.save(OutputFile)
            doc.close()
            
            logging.info("🔄 FixOrientation summary:")
            logging.info(f"  Total pages checked: {len(doc)}")
            logging.info(f"  Pages rotated: {len(rotated_pages)}")
            logging.info(f"✅ Fixed orientation → {OutputFile}")
            
            return OutputFile
            
        except Exception as e:
            logging.error(f"❌ FixOrientation failed: {e}")
            return None


class SmartCleanup(EditBase):
    """Combined cleanup operations: remove duplicates, blanks, fix orientation."""
    
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            remove_duplicates = kwargs.get("remove_duplicates", False)
            remove_blanks = kwargs.get("remove_blanks", False)
            fix_orientation_flag = kwargs.get("fix_orientation", False)
            
            logging.info("🧹 Starting Smart Cleanup...")
            logging.info(f"  Options: duplicates={remove_duplicates}, blanks={remove_blanks}, orientation={fix_orientation_flag}")
            
            import tempfile
            import shutil
            
            temp_dir = tempfile.mkdtemp()
            current_file = input_pdf
            step = 0
            
            try:
                reader = PdfReader(current_file)
                original_pages = len(reader.pages)
                
                # Step 1: Remove duplicate pages
                if remove_duplicates:
                    step += 1
                    temp_output = os.path.join(temp_dir, f"step{step}.pdf")
                    remover = RemoveDuplicatePages()
                    result = remover.Execute([current_file], temp_output)
                    if result:
                        current_file = result
                
                # Step 2: Remove blank pages
                if remove_blanks:
                    step += 1
                    temp_output = os.path.join(temp_dir, f"step{step}.pdf")
                    remover = RemoveBlankPages()
                    result = remover.Execute([current_file], temp_output)
                    if result:
                        current_file = result
                
                # Step 3: Fix orientation
                if fix_orientation_flag:
                    step += 1
                    temp_output = os.path.join(temp_dir, f"step{step}.pdf")
                    fixer = FixOrientation()
                    result = fixer.Execute([current_file], temp_output)
                    if result:
                        current_file = result
                
                # Copy final result to output
                shutil.copy(current_file, OutputFile)
                
                final_reader = PdfReader(OutputFile)
                final_pages = len(final_reader.pages)
                
                logging.info("✅ Smart Cleanup completed:")
                logging.info(f"  Pages: {original_pages} → {final_pages} (removed {original_pages - final_pages})")
                
                return OutputFile
                
            finally:
                try:
                    shutil.rmtree(temp_dir)
                except:
                    pass
                    
        except Exception as e:
            logging.error(f"❌ SmartCleanup failed: {e}")
            return None


# ============================================================
# 🏭 Factory
# ============================================================
class EditFactory:
    @staticmethod
    def GetEditor(ActionType: str) -> EditBase:
        mapping = {
            "annotate_pdf": AnnotatePDF,
            "crop_pdf": CropPDF,
            "add_watermark": AddWatermark,
            "add_page_numbers": AddPageNumbers,
            "edit_pdf_content": EditPDFContent,
            "remove_duplicate_pages": RemoveDuplicatePages,
            "remove_blank_pages": RemoveBlankPages,
            "fix_orientation": FixOrientation,
            "smart_cleanup": SmartCleanup,
        }
        EditorClass = mapping.get(ActionType.lower())
        if not EditorClass:
            raise ValueError(f"Unsupported edit action: {ActionType}")
        return EditorClass()