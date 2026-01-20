import os
import io
import base64
import logging
from abc import ABC, abstractmethod

import fitz
from PIL import Image, ImageDraw, ImageFont


class SignatureBase(ABC):
    @abstractmethod
    def Execute(self, InputFiles: list[str], OutputFile: str, **kwargs):
        pass


class AddSignature(SignatureBase):
    def Execute(self, InputFiles, OutputFile, **kwargs):
        doc = None
        temp_files = []

        try:
            input_pdf = InputFiles[0]
            logging.info(f"📋 Processing signature on PDF: {input_pdf}")

            # Load PDF
            doc = fitz.open(input_pdf)
            logging.info(f"✅ PDF opened, total pages: {len(doc)}")

            # Prepare list of signature configs
            configs = []
            if "signatures" in kwargs and isinstance(kwargs["signatures"], list) and len(kwargs["signatures"]) > 0:
                # Multi-signature mode
                for s in kwargs["signatures"]:
                    pages = s.get("pages")
                    if not pages:
                        pages = [int(s.get("page", 1))]

                    cfg = {
                        "type": "draw", # Frontend sends base64 image
                        "base64": s.get("image"),
                        "pages": pages,
                        "x": float(s.get("x", 100)),
                        "y": float(s.get("y", 100)),
                        "width": int(kwargs.get("width", 200)),  # Use global width/height or per-sig if available
                        "height": int(kwargs.get("height", 80))
                    }
                    configs.append(cfg)
            else:
                # Single signature mode (legacy/direct args)
                configs.append({
                    "type": kwargs.get("signature_type"),
                    "path": kwargs.get("signature_path"),
                    "base64": kwargs.get("signature_base64"),
                    "text": kwargs.get("signature_text"),
                    "font": kwargs.get("signature_font", "Helvetica"),
                    "font_size": int(kwargs.get("signature_font_size", 36)),
                    "color": kwargs.get("signature_color", "#000000"),
                    "pages": kwargs.get("pages", [1]),
                    "x": float(kwargs.get("x", 100)),
                    "y": float(kwargs.get("y", 100)),
                    "width": int(kwargs.get("width", 200)),
                    "height": int(kwargs.get("height", 80))
                })

            for cfg in configs:
                # Local variables for this iteration
                signature_type = cfg.get("type")
                x = cfg["x"]
                y = cfg["y"]
                width = cfg["width"]
                height = cfg["height"]
                pages = cfg["pages"]

                logging.info(f"📝 Processing signature: {signature_type} on pages {pages} at ({x}, {y})")

                for page_number in pages:
                    page_index = page_number - 1
                    if page_index < 0 or page_index >= len(doc):
                        continue

                    page = doc[page_index]

                    if signature_type == "upload":
                        sig_path = cfg.get("path")
                        if not sig_path or not os.path.exists(sig_path):
                            logging.warning("Signature file not found, skipping")
                            continue
                        rect = fitz.Rect(x, y, x + width, y + height)
                        page.insert_image(rect, filename=sig_path)

                    elif signature_type == "draw":
                        sig_data = cfg.get("base64")
                        if not sig_data: continue
                        
                        try:
                            # Handle data URI prefix if present
                            if "," in sig_data:
                                sig_data = sig_data.split(",")[1]
                            
                            img = Image.open(io.BytesIO(base64.b64decode(sig_data))).convert("RGBA")
                            img = img.resize((width, height), Image.Resampling.LANCZOS)
                            
                            temp_png = OutputFile.replace(".pdf", f"_draw_{page_number}_{x}_{y}.png")
                            img.save(temp_png, optimize=False, compress_level=1)
                            temp_files.append(temp_png)
                            
                            rect = fitz.Rect(x, y, x + width, y + height)
                            page.insert_image(rect, filename=temp_png)
                        except Exception as e:
                            logging.error(f"Failed to process draw signature: {e}")

                    elif signature_type == "text":
                        sig_text = cfg.get("text")
                        if not sig_text: continue
                        
                        sig_color = cfg.get("color", "#000000")
                        sig_font = cfg.get("font", "Helvetica")
                        sig_size = cfg.get("font_size", 36)
                        
                        r = int(sig_color[1:3], 16) / 255
                        g = int(sig_color[3:5], 16) / 255
                        b = int(sig_color[5:7], 16) / 255

                        try:
                            page.insert_text((x, y), sig_text, fontsize=sig_size, fontname=sig_font, color=(r, g, b))
                        except:
                            # Fallback to image generation for text
                            font = ImageFont.load_default()
                            try: font = ImageFont.truetype(sig_font, sig_size)
                            except: pass
                            
                            dummy = Image.new("RGBA", (10, 10))
                            d = ImageDraw.Draw(dummy)
                            bbox = d.textbbox((0, 0), sig_text, font=font)
                            w, h = bbox[2]-bbox[0], bbox[3]-bbox[1]
                            
                            img = Image.new("RGBA", (w+20, h+20), (255, 255, 255, 0))
                            d = ImageDraw.Draw(img)
                            d.text((10, 10), sig_text, font=font, fill=sig_color)
                            
                            temp_png = OutputFile.replace(".pdf", f"_text_{page_number}_{x}_{y}.png")
                            img.save(temp_png)
                            temp_files.append(temp_png)
                            
                            rect = fitz.Rect(x, y, x + w + 20, y + h + 20)
                            page.insert_image(rect, filename=temp_png)

            # Date/Time is global
            add_datetime = kwargs.get("add_datetime", False)
            flatten_pdf = kwargs.get("flatten_pdf", False)
            if add_datetime:
                import datetime
                now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                # Add to first page or all? Usually last page or next to signature. 
                # Let's just add to first page for now or skip if ambiguous
                if len(doc) > 0:
                     doc[0].insert_text((doc[0].rect.width - 200, 50), now, fontsize=10)

            # SAVE AFTER PROCESSING ALL PAGES
            logging.info(f"💾 Saving PDF to: {OutputFile}")
            doc.save(OutputFile)
            logging.info(f"✅ PDF saved successfully")

            # FLATTEN IF REQUIRED
            if flatten_pdf:
                logging.info(f"🔨 Flattening PDF...")
                doc2 = fitz.open(OutputFile)
                for p in doc2:
                    try:
                        p.flatten_annotations()
                    except:
                        pass
                doc2.save(OutputFile, incremental=True, encryption=fitz.PDF_ENCRYPT_KEEP)
                doc2.close()
                logging.info(f"✅ PDF flattened")

            logging.info(f"✅ Signature execution complete: {OutputFile}")
            result = OutputFile

        except Exception as e:
            logging.error(f"❌ AddSignature.Execute failed: {e}", exc_info=True)
            result = None

        finally:
            # Always clean up
            if doc:
                doc.close()
            # Clean up temporary image files
            for t in temp_files:
                if os.path.exists(t):
                    os.remove(t)
        
        return result

class SignatureFactory:
    @staticmethod
    def GetAction(ActionType: str):
        mapping = {
            "add_signature": AddSignature,
        }
        return mapping[ActionType]()
