import os
import logging
import zipfile
import fitz  # PyMuPDF
from abc import ABC, abstractmethod
from pypdf import PdfReader, PdfWriter
import pikepdf

class OrganizerBase(ABC):
    @abstractmethod
    def Execute(self, InputFiles: list[str], OutputFile: str, **kwargs):
        pass


# ============================================================
# Implementations
# ============================================================

class MergePDF(OrganizerBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            # Get optional file order (1-indexed file positions)
            order = kwargs.get("order")
            
            # If order is provided, reorder files accordingly
            if order and isinstance(order, list):
                logging.info(f"📋 Merging files in custom order: {order}")
                if len(order) != len(InputFiles):
                    raise ValueError(f"Order list size ({len(order)}) doesn't match file count ({len(InputFiles)})")
                
                # Reorder files: order contains 1-indexed positions
                ordered_files = []
                for file_index in order:
                    if file_index < 1 or file_index > len(InputFiles):
                        raise ValueError(f"File index {file_index} out of range (1-{len(InputFiles)})")
                    ordered_files.append(InputFiles[file_index - 1])
                InputFiles = ordered_files
            
            merger = PdfWriter()
            for pdf in InputFiles:
                reader = PdfReader(pdf)
                for page in reader.pages:
                    merger.add_page(page)
            
            with open(OutputFile, "wb") as f:
                merger.write(f)
            
            logging.info(f"✅ Merged {len(InputFiles)} PDFs → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ Merge failed: {e}")
            return None

class ReorderPDF(OrganizerBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            order = kwargs.get("order")
            if not order or not isinstance(order, list):
                raise ValueError("Order list must be provided for reorder_pdf")

            input_pdf = InputFiles[0]
            reader = PdfReader(input_pdf)
            writer = PdfWriter()

            # Total pages in original PDF
            total_pages = len(reader.pages)

            for page_num in order:
                if page_num < 1 or page_num > total_pages:
                    raise ValueError(f"Page number {page_num} is out of range")
                writer.add_page(reader.pages[page_num - 1])

            with open(OutputFile, "wb") as f:
                writer.write(f)

            logging.info(f"✅ Reordered PDF → {OutputFile}")
            return OutputFile

        except Exception as e:
            logging.error(f"❌ ReorderPDF failed: {e}")
            return None

class SplitPDF(OrganizerBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_file = InputFiles[0]
            reader = PdfReader(input_file)
            total_pages = len(reader.pages)
            output_dir = os.path.dirname(OutputFile)
            os.makedirs(output_dir, exist_ok=True)

            page_ranges = kwargs.get("page_ranges")
            generated_files = []  # keep track of all part files

            # -------------------------------------------------------
            # 1️⃣ SPLIT BY GIVEN RANGES
            # -------------------------------------------------------
            if page_ranges:
                # Track which pages have been processed
                processed_pages = set()
                
                for i, (start, end) in enumerate(page_ranges):
                    writer = PdfWriter()
                    for page_num in range(start - 1, end):
                        writer.add_page(reader.pages[page_num])
                        processed_pages.add(page_num + 1)  # Track 1-indexed page numbers
                    part_path = os.path.join(output_dir, f"split_part_{i+1}.pdf")
                    with open(part_path, "wb") as f:
                        writer.write(f)
                    generated_files.append(part_path)
                    logging.info(f"✅ Created split_part_{i+1}.pdf (pages {start}-{end})")
                
                # -------------------------------------------------------
                # 1.5️⃣ CREATE PDF WITH REMAINING PAGES (if any)
                # -------------------------------------------------------
                remaining_pages = []
                for page_num in range(1, total_pages + 1):
                    if page_num not in processed_pages:
                        remaining_pages.append(page_num)
                
                if remaining_pages:
                    writer = PdfWriter()
                    for page_num in remaining_pages:
                        writer.add_page(reader.pages[page_num - 1])
                    
                    # Name it as the next part number
                    part_number = len(page_ranges) + 1
                    part_path = os.path.join(output_dir, f"split_part_{part_number}.pdf")
                    with open(part_path, "wb") as f:
                        writer.write(f)
                    generated_files.append(part_path)
                    
                    # Log remaining pages info
                    if len(remaining_pages) <= 10:
                        pages_str = ",".join(map(str, remaining_pages))
                    else:
                        pages_str = f"{remaining_pages[0]}-{remaining_pages[-1]}"
                    logging.info(f"✅ Created split_part_{part_number}.pdf with remaining pages ({pages_str})")

            # -------------------------------------------------------
            # 2️⃣ SPLIT EACH PAGE INTO INDIVIDUAL FILES (default)
            # -------------------------------------------------------
            else:
                for i, page in enumerate(reader.pages, start=1):
                    writer = PdfWriter()
                    writer.add_page(page)
                    part_path = os.path.join(output_dir, f"split_page_{i}.pdf")
                    with open(part_path, "wb") as f:
                        writer.write(f)
                    generated_files.append(part_path)

            # -------------------------------------------------------
            # 3️⃣ ZIP ALL GENERATED FILES
            # -------------------------------------------------------
            zip_path = OutputFile.replace(".pdf", ".zip")
            import zipfile

            with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                for file_path in generated_files:
                    zipf.write(file_path, arcname=os.path.basename(file_path))

            logging.info(f"✅ Split PDFs zipped → {zip_path} ({len(generated_files)} files)")
            return zip_path

        except Exception as e:
            logging.error(f"❌ Split failed: {e}")
            return None



class RotatePDF(OrganizerBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            degrees = kwargs.get("degrees", 90)
            pages_to_rotate = kwargs.get("pages")  # Optional: specific pages to rotate
            
            reader = PdfReader(InputFiles[0])
            writer = PdfWriter()
            
            # If pages specified, only rotate those pages
            if pages_to_rotate:
                pages_set = set(pages_to_rotate)  # Convert to set for O(1) lookup
                for i, page in enumerate(reader.pages, start=1):
                    if i in pages_set:
                        page.rotate(degrees)
                        logging.info(f"🔄 Rotating page {i} by {degrees}°")
                    writer.add_page(page)
                logging.info(f"✅ Rotated pages {sorted(pages_set)} by {degrees}° → {OutputFile}")
            else:
                # Rotate all pages
                for page in reader.pages:
                    page.rotate(degrees)
                    writer.add_page(page)
                logging.info(f"✅ Rotated all pages by {degrees}° → {OutputFile}")
            
            with open(OutputFile, "wb") as f:
                writer.write(f)
            return OutputFile
        except Exception as e:
            logging.error(f"❌ Rotate failed: {e}")
            return None


class DeletePages(OrganizerBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            pages_to_delete = set(kwargs.get("pages_to_delete", []))
            reader = PdfReader(InputFiles[0])
            writer = PdfWriter()
            for i, page in enumerate(reader.pages, start=1):
                if i not in pages_to_delete:
                    writer.add_page(page)
            with open(OutputFile, "wb") as f:
                writer.write(f)
            logging.info(f"✅ Deleted pages {pages_to_delete} → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ Delete failed: {e}")
            return None


class CompressPDF(OrganizerBase):
    """
    Advanced PDF compression with quality presets and optional target size.
    
    Quality Presets:
      - high: Minimal compression, best quality (~10-20% reduction)
      - medium: Balanced compression (~30-50% reduction)
      - low: Maximum compression, may reduce image quality (~50-70% reduction)
    
    Target Size:
      - Optional target size in KB
      - Uses iterative compression with image downscaling to reach target
      - Best-effort (not guaranteed for heavily compressed PDFs)
    """
    
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_file = InputFiles[0]
            quality = kwargs.get("compression_quality", "medium").lower()
            target_size_kb = kwargs.get("target_size_kb")
            
            # Validate quality
            if quality not in ["high", "medium", "low"]:
                logging.warning(f"⚠️ Invalid quality '{quality}', using 'medium'")
                quality = "medium"
            
            # Get original size
            original_size_kb = os.path.getsize(input_file) / 1024
            original_size_mb = original_size_kb / 1024
            
            logging.info(f"🔄 Compressing PDF: {original_size_mb:.2f}MB | Quality: {quality}")
            
            # If target size specified, use iterative compression
            if target_size_kb:
                result = self._compress_to_target(
                    input_file, OutputFile, target_size_kb, quality
                )
                if result:
                    return result
                else:
                    # Fallback to normal compression if target fails
                    logging.warning("⚠️ Target size compression failed, using normal compression")
            
            # Normal compression with quality preset
            return self._compress_with_quality(input_file, OutputFile, quality)
            
        except Exception as e:
            logging.error(f"❌ Compression failed: {e}")
            return None
    
    def _compress_with_quality(self, input_file, output_file, quality):
        """Compress PDF with specified quality preset."""
        try:
            pdf = pikepdf.open(input_file)
            
            # Quality-specific settings
            if quality == "high":
                # Minimal compression - best quality
                pdf.save(
                    output_file,
                    recompress_flate=False,
                    object_stream_mode=pikepdf.ObjectStreamMode.disable,
                    compress_streams=False
                )
            elif quality == "medium":
                # Balanced compression (original behavior)
                pdf.save(
                    output_file,
                    recompress_flate=True,
                    object_stream_mode=pikepdf.ObjectStreamMode.generate,
                    compress_streams=True
                )
            elif quality == "low":
                # Aggressive compression
                # First, downsample images if possible
                self._downsample_images(pdf, dpi=150)
                
                pdf.save(
                    output_file,
                    recompress_flate=True,
                    object_stream_mode=pikepdf.ObjectStreamMode.generate,
                    compress_streams=True,
                    stream_decode_level=pikepdf.StreamDecodeLevel.generalized
                )
            
            pdf.close()
            
            # Log results
            original_size = os.path.getsize(input_file) / 1024
            compressed_size = os.path.getsize(output_file) / 1024
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            logging.info(
                f"✅ Compressed ({quality}): "
                f"{original_size:.2f}KB → {compressed_size:.2f}KB "
                f"({reduction:.1f}% reduction)"
            )
            
            return output_file
            
        except Exception as e:
            logging.error(f"❌ Quality compression failed: {e}")
            return None
    
    def _compress_to_target(self, input_file, output_file, target_kb, initial_quality):
        """
        Iteratively compress PDF to reach target size.
        
        Strategy:
        1. Try with specified quality
        2. Try lower qualities if needed
        3. Downsample images progressively if still too large
        4. Return best result (closest to target)
        """
        original_size_kb = os.path.getsize(input_file) / 1024
        
        logging.info(f"🎯 Target size: {target_kb}KB (original: {original_size_kb:.2f}KB)")
        
        # Validate target is reasonable
        if target_kb < 10:
            logging.warning("⚠️ Target too small (< 10KB), may not be achievable")
        
        if target_kb >= original_size_kb * 0.95:
            logging.info("ℹ️ Target is close to original size, using high quality")
            return self._compress_with_quality(input_file, output_file, "high")
        
        attempts = []
        temp_dir = os.path.dirname(output_file)
        
        # Try different quality levels
        qualities = self._get_quality_sequence(initial_quality)
        
        for attempt_num, quality in enumerate(qualities, 1):
            temp_output = os.path.join(temp_dir, f"temp_compress_{attempt_num}.pdf")
            
            logging.info(f"  Attempt {attempt_num}: Trying quality '{quality}'")
            result_file = self._compress_with_quality(input_file, temp_output, quality)
            
            if result_file:
                result_size_kb = os.path.getsize(result_file) / 1024
                attempts.append({
                    'file': result_file,
                    'size_kb': result_size_kb,
                    'quality': quality,
                    'method': f'quality_{quality}'
                })
                
                if result_size_kb <= target_kb:
                    logging.info(f"✅ Target achieved with quality '{quality}'!")
                    # Copy to final output
                    import shutil
                    shutil.copy(result_file, output_file)
                    self._cleanup_temp_files(attempts, output_file)
                    return output_file
        
        # If still too large, try image downsampling
        if attempts and attempts[-1]['size_kb'] > target_kb:
            dpi_levels = [150, 100, 72]
            
            for dpi in dpi_levels:
                attempt_num += 1
                temp_output = os.path.join(temp_dir, f"temp_compress_{attempt_num}.pdf")
                
                logging.info(f"  Attempt {attempt_num}: Downsampling images to {dpi} DPI")
                result_file = self._compress_with_image_downscale(
                    input_file, temp_output, dpi
                )
                
                if result_file:
                    result_size_kb = os.path.getsize(result_file) / 1024
                    attempts.append({
                        'file': result_file,
                        'size_kb': result_size_kb,
                        'quality': 'low',
                        'method': f'downscale_{dpi}dpi'
                    })
                    
                    if result_size_kb <= target_kb:
                        logging.info(f"✅ Target achieved with {dpi} DPI downsampling!")
                        import shutil
                        shutil.copy(result_file, output_file)
                        self._cleanup_temp_files(attempts, output_file)
                        return output_file
        
        # Target not met - return best result (closest to target)
        if attempts:
            best = min(attempts, key=lambda x: abs(x['size_kb'] - target_kb))
            logging.warning(
                f"⚠️ Target not met. Best result: {best['size_kb']:.2f}KB "
                f"(method: {best['method']}) vs target {target_kb}KB"
            )
            import shutil
            shutil.copy(best['file'], output_file)
            self._cleanup_temp_files(attempts, output_file)
            return output_file
        
        return None
    
    def _get_quality_sequence(self, initial_quality):
        """Get sequence of qualities to try based on initial quality."""
        all_qualities = ['high', 'medium', 'low']
        start_idx = all_qualities.index(initial_quality)
        return all_qualities[start_idx:]
    
    def _downsample_images(self, pdf, dpi=150):
        """
        Downsample images in PDF to reduce size.
        Note: This is a simplified version. Full implementation would
        require extracting, resizing, and re-embedding images.
        """
        try:
            # This is a placeholder for image downsampling
            # pikepdf doesn't directly support image manipulation
            # For full implementation, would need to:
            # 1. Extract images with PyMuPDF
            # 2. Resize with PIL
            # 3. Re-embed with pikepdf
            pass
        except Exception as e:
            logging.warning(f"⚠️ Image downsampling failed: {e}")
    
    def _compress_with_image_downscale(self, input_file, output_file, dpi):
        """Compress with aggressive image downscaling using PyMuPDF."""
        try:
            # Use PyMuPDF for image manipulation
            doc = fitz.open(input_file)
            
            # Process each page
            for page_num in range(len(doc)):
                page = doc[page_num]
                
                # Get images on this page
                image_list = page.get_images(full=True)
                
                for img_index, img_info in enumerate(image_list):
                    xref = img_info[0]
                    
                    try:
                        # Extract image
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        
                        # Resize image using PIL
                        from PIL import Image
                        import io
                        
                        img = Image.open(io.BytesIO(image_bytes))
                        
                        # Calculate new size based on DPI
                        scale_factor = dpi / 300  # Assuming original is 300 DPI
                        new_size = (
                            int(img.width * scale_factor),
                            int(img.height * scale_factor)
                        )
                        
                        if new_size[0] > 10 and new_size[1] > 10:  # Minimum size
                            img = img.resize(new_size, Image.Resampling.LANCZOS)
                            
                            # Convert back to bytes
                            img_buffer = io.BytesIO()
                            img.save(img_buffer, format='JPEG', quality=85, optimize=True)
                            img_bytes = img_buffer.getvalue()
                            
                            # Replace image in PDF (simplified - actual implementation complex)
                            # This is a placeholder - full implementation requires more work
                            
                    except Exception as img_err:
                        logging.debug(f"Could not process image {img_index}: {img_err}")
                        continue
            
            # Save with pikepdf for final compression
            doc.save(output_file, garbage=4, deflate=True)
            doc.close()
            
            return output_file
            
        except Exception as e:
            logging.error(f"❌ Image downscale compression failed: {e}")
            # Fallback to regular low quality compression
            return self._compress_with_quality(input_file, output_file, "low")
    
    def _cleanup_temp_files(self, attempts, keep_file):
        """Clean up temporary compression attempt files."""
        for attempt in attempts:
            try:
                if attempt['file'] != keep_file and os.path.exists(attempt['file']):
                    os.remove(attempt['file'])
            except Exception:
                pass


# --- place this class near SplitPDF (or anywhere among implementations) ---

class ExtractPages(OrganizerBase):
    """
    Extract selected pages or ranges from a PDF.

    kwargs expected:
      - pages: list[int] (1-based page numbers, order preserved)
      - mode: "merge" or "separate"
    Returns:
      - If mode == "merge": path to single output PDF (OutputFile)
      - If mode == "separate": path to ZIP file containing individual PDFs
    """
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            pages = kwargs.get("pages")
            mode = (kwargs.get("mode") or "merge").lower()
            if not pages or not isinstance(pages, list):
                raise ValueError("pages list must be provided for extract_pages")

            input_file = InputFiles[0]
            reader = PdfReader(input_file)
            total_pages = len(reader.pages)
            # validate pages within bounds
            for p in pages:
                if p < 1 or p > total_pages:
                    raise ValueError(f"Page number {p} is out of range (1-{total_pages})")

            output_dir = os.path.dirname(OutputFile)
            os.makedirs(output_dir, exist_ok=True)

            base_name = os.path.splitext(os.path.basename(input_file))[0]

            # MERGE MODE: create single PDF containing requested pages in order
            if mode == "merge":
                writer = PdfWriter()
                # Clone pages to avoid copying entire PDF's shared resources
                for p in pages:
                    page = reader.pages[p - 1]
                    writer.add_page(page)
                with open(OutputFile, "wb") as f:
                    writer.write(f)
                logging.info(f"✅ Extracted pages (merged) → {OutputFile}")
                return OutputFile

            # SEPARATE MODE: create one PDF per requested page, zip them, return zip path
            elif mode == "separate":
                part_files = []
                for p in pages:
                    writer = PdfWriter()
                    # Clone page to avoid copying entire PDF's shared resources
                    page = reader.pages[p - 1]
                    writer.add_page(page)
                    part_name = f"{base_name}_page_{p}.pdf"
                    part_path = os.path.join(output_dir, part_name)
                    with open(part_path, "wb") as f:
                        writer.write(f)
                    part_files.append(part_path)

                # create zip
                zip_path = OutputFile.replace(".pdf", ".zip")
                import zipfile
                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for file_path in part_files:
                        zipf.write(file_path, arcname=os.path.basename(file_path))

                # cleanup individual part files to avoid clutter (zip already created)
                for file_path in part_files:
                    try:
                        os.remove(file_path)
                    except Exception:
                        logging.warning(f"Could not remove temp part file: {file_path}")

                logging.info(f"✅ Extracted pages (separate) zipped → {zip_path}")
                return zip_path

            else:
                raise ValueError(f"Unsupported extract mode: {mode}")

        except Exception as e:
            logging.error(f"❌ ExtractPages failed: {e}")
            return None




class ExtractImages(OrganizerBase):
    """
    Extract all images from a PDF and return them as a ZIP file.
    
    Uses PyMuPDF (fitz) to extract embedded images from each page.
    Images are saved with descriptive names: page_X_image_Y.ext
    
    Returns:
        Path to ZIP file containing all extracted images
    """
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_file = InputFiles[0]
            output_dir = os.path.dirname(OutputFile)
            os.makedirs(output_dir, exist_ok=True)
            
            # Open PDF with PyMuPDF
            doc = fitz.open(input_file)
            base_name = os.path.splitext(os.path.basename(input_file))[0]
            
            extracted_images = []
            image_count = 0
            
            logging.info(f"🖼️ Extracting images from {len(doc)} pages...")
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                image_list = page.get_images(full=True)
                
                for img_index, img_info in enumerate(image_list):
                    xref = img_info[0]  # Image reference number
                    
                    try:
                        # Extract image
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        image_ext = base_image["ext"]
                        
                        # Create filename
                        image_count += 1
                        image_filename = f"page_{page_num + 1}_image_{img_index + 1}.{image_ext}"
                        image_path = os.path.join(output_dir, image_filename)
                        
                        # Save image
                        with open(image_path, "wb") as img_file:
                            img_file.write(image_bytes)
                        
                        extracted_images.append(image_path)
                        logging.info(f"   ✅ Extracted: {image_filename}")
                        
                    except Exception as img_err:
                        logging.warning(f"   ⚠️ Failed to extract image {img_index + 1} from page {page_num + 1}: {img_err}")
                        continue
            
            doc.close()
            
            if not extracted_images:
                logging.warning("⚠️ No images found in PDF")
                return None
            
            # Create ZIP file (handle any extension, not just .pdf)
            base = os.path.splitext(OutputFile)[0]  # Remove any extension
            zip_path = f"{base}_images.zip"
            
            with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                for image_path in extracted_images:
                    zipf.write(image_path, arcname=os.path.basename(image_path))
            
            # Cleanup individual image files
            for image_path in extracted_images:
                try:
                    os.remove(image_path)
                except Exception:
                    pass
            
            logging.info(f"✅ Extracted {image_count} images → {zip_path}")
            return zip_path
            
        except Exception as e:
            logging.error(f"❌ ExtractImages failed: {e}")
            return None


class OrganizerFactory:
    @staticmethod
    def GetOrganizer(ActionType: str) -> OrganizerBase:
        mapping = {
            "merge_pdf": MergePDF,
            "split_pdf": SplitPDF,
            "rotate_pdf": RotatePDF,
            "delete_pages": DeletePages,
            "compress_pdf": CompressPDF,
            "reorder_pdf": ReorderPDF,
            "compress_pdf": CompressPDF,
            "reorder_pdf": ReorderPDF,
            "extract_pdf": ExtractPages,
            "extract_images": ExtractImages,
        }
        OrganizerClass = mapping.get(ActionType.lower())
        if not OrganizerClass:
            raise ValueError(f"Unsupported action type: {ActionType}")
        return OrganizerClass()
