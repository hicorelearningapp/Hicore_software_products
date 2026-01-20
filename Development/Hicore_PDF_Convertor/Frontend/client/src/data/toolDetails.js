// src/data/toolDetails.js

export const ToolDetails = {
  /* ----------------------------------------------------
     CONVERSION TOOLS (shared convert screen)
  ---------------------------------------------------- */
  "pdf-word": {
    title: "Convert PDF to Word",
    description: "Instantly turn your PDF documents into polished Word files.",
    button: "Upload Your PDF Document",
    formats: ".PDF",
    accept: ".pdf",
    convertAction: "Convert to Word",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload Your PDF File",
        description:
          "Click the “Upload” area or drag and drop your .pdf file from your device. We support files up to 100MB.",
      },
      {
        title: "Step 2: Adjust Settings (Optional)",
        description: "Standard conversion works great for most cases.",
      },
      {
        title: "Step 3: Convert",
        description: "We’ll convert your PDF into an editable Word document.",
      },
      {
        title: "Step 4: Download",
        description: "Save your new .docx file instantly.",
      },
    ],
  },

  "word-pdf": {
    title: "Convert Word to PDF",
    description: "Convert Word documents into secure, shareable PDFs.",
    button: "Upload Word Document",
    formats: ".DOC, .DOCX",
    accept: ".doc,.docx",
    convertAction: "Convert to PDF",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload Your Word File",
        description: "Upload .doc or .docx files from your device (100MB max).",
      },
      {
        title: "Step 2: Optional Formatting",
        description: "Adjust layout and margins if needed.",
      },
      {
        title: "Step 3: Convert",
        description: "We convert your Word into a high-quality PDF.",
      },
      {
        title: "Step 4: Download",
        description: "Securely download your PDF.",
      },
    ],
  },

  "pdf-excel": {
    title: "Convert PDF to Excel",
    description:
      "Extract tables from PDF and convert into editable Excel sheets.",
    formats: ".PDF",
    accept: ".pdf",
    button: "Upload PDF",
    convertAction: "Convert to Excel",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload a PDF containing table data (100MB max).",
      },
      {
        title: "Step 2: Table Detection",
        description: "Auto-detect table structure for accurate conversion.",
      },
      {
        title: "Step 3: Convert",
        description: "We generate a formatted .xlsx Excel sheet.",
      },
      {
        title: "Step 4: Download Excel",
        description: "Download and open in Excel instantly.",
      },
    ],
  },

  "excel-pdf": {
    title: "Convert Excel to PDF",
    description: "Export spreadsheets into print-ready PDFs easily.",
    formats: ".XLSX, .XLS",
    accept: ".xlsx,.xls",
    button: "Upload Excel File",
    convertAction: "Convert to PDF",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload Excel File",
        description: "Upload .xlsx or .xls up to 100MB.",
      },
      {
        title: "Step 2: Page Settings",
        description: "Control margins, layout and scaling if needed.",
      },
      {
        title: "Step 3: Convert",
        description: "Turn your spreadsheet into a clean PDF.",
      },
      {
        title: "Step 4: Download",
        description: "Save or share your PDF instantly.",
      },
    ],
  },

  "pdf-powerpoint": {
    title: "Convert PDF to PowerPoint",
    description: "Transform PDF pages into editable slide presentations.",
    formats: ".PDF",
    accept: ".pdf",
    button: "Upload PDF",
    convertAction: "Convert to PowerPoint",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Drop your PDF here (100MB max).",
      },
      {
        title: "Step 2: Slide Layout",
        description: "Auto-converts content into editable slides.",
      },
      {
        title: "Step 3: Convert",
        description: "We generate a .pptx presentation.",
      },
      {
        title: "Step 4: Download",
        description: "Edit directly in PowerPoint.",
      },
    ],
  },

  "powerpoint-pdf": {
    title: "Convert PowerPoint to PDF",
    description: "Make your slides easy to share by exporting as PDFs.",
    formats: ".PPTX, .PPT",
    accept: ".ppt,.pptx",
    button: "Upload PowerPoint File",
    convertAction: "Convert to PDF",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload PowerPoint",
        description: "Upload slide decks up to 100MB.",
      },
      {
        title: "Step 2: Page Layout",
        description: "Customize notes & layout if needed.",
      },
      {
        title: "Step 3: Convert",
        description: "Slides will be converted into a high-quality PDF.",
      },
      {
        title: "Step 4: Download",
        description: "Instant download.",
      },
    ],
  },

  "pdf-image": {
    title: "Convert PDF to Image",
    description: "Convert PDF pages into high-quality JPG/PNG images.",
    formats: ".PDF",
    accept: ".pdf",
    button: "Upload PDF",
    convertAction: "Convert to Image",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Every page will be converted into a separate image.",
      },
      {
        title: "Step 2: Select Image Format",
        description: "Choose JPG or PNG (optional).",
      },
      {
        title: "Step 3: Convert",
        description: "High-resolution images will be created.",
      },
      {
        title: "Step 4: Download Images",
        description: "Download one by one or all together.",
      },
    ],
  },

  "image-pdf": {
    title: "Convert Image to PDF",
    description: "Combine multiple JPG/PNG images into a single PDF.",
    formats: ".JPG, .PNG",
    accept: ".jpg,.jpeg,.png",
    button: "Upload Image Files",
    convertAction: "Convert to PDF",
    mode: "convert",
    steps: [
      {
        title: "Step 1: Upload Images",
        description: "Upload and reorder images if needed.",
      },
      {
        title: "Step 2: Page Options",
        description: "Adjust margins and layout optionally.",
      },
      {
        title: "Step 3: Convert",
        description: "Images will be merged into one PDF.",
      },
      {
        title: "Step 4: Download",
        description: "Download your final PDF.",
      },
    ],
  },

  /* ----------------------------------------------------
     ORGANIZE TOOLS (custom second page per tool)
  ---------------------------------------------------- */
  "merge-pdf": {
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single document.",
    button: "Upload Your PDF Files",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF Files",
        description: "Select one or more PDF files you want to merge.",
      },
      {
        title: "Step 2: Arrange Order",
        description:
          "Reorder the PDFs using up and down controls to set the merge sequence.",
      },
      {
        title: "Step 3: Merge PDFs",
        description:
          "Click the Merge PDF button to combine all files into one document.",
      },
      {
        title: "Step 4: Download",
        description:
          "Download the merged PDF instantly once processing is complete.",
      },
    ],
  },

  "split-pdf": {
    title: "Split PDF",
    description: "Split a PDF into separate pages or custom ranges.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Upload a PDF file you want to split into multiple documents.",
      },
      {
        title: "Step 2: Define Page Ranges",
        description:
          "Enter page ranges (e.g. 1-3, 5, 7-9) to decide how the PDF should be split.",
      },
      {
        title: "Step 3: Split PDF",
        description:
          "Click the Split PDF button to process your selected page ranges.",
      },
      {
        title: "Step 4: Download ZIP",
        description:
          "Download the ZIP file containing all the split PDF documents.",
      },
    ],
  },

  "rotate-pdf": {
    title: "Rotate PDF",
    description: "Rotate specific pages or the entire PDF.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file you want to rotate.",
      },
      {
        title: "Step 2: Choose Pages & Rotation",
        description:
          "Select the pages to rotate (optional) and choose the rotation angle (90°, 180°, 270°, or custom).",
      },
      {
        title: "Step 3: Rotate PDF",
        description:
          "Click the Rotate PDF button to apply the selected rotation settings.",
      },
      {
        title: "Step 4: Download",
        description:
          "Download the rotated PDF file once processing is complete.",
      },
    ],
  },

  "delete-pages": {
    title: "Delete Pages",
    description: "Remove unwanted pages from your PDF.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file from which you want to remove pages.",
      },
      {
        title: "Step 2: Select Pages to Delete",
        description:
          "Enter page numbers or ranges (e.g. 1,3,5-7) that you want to remove from the PDF.",
      },
      {
        title: "Step 3: Delete Pages",
        description:
          "Click the Delete Pages button to permanently remove the selected pages.",
      },
      {
        title: "Step 4: Download",
        description:
          "Download the updated PDF after the selected pages are removed.",
      },
    ],
  },

  "extract-pages": {
    title: "Extract Pages",
    description: "Extract one or more pages into a new PDF.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Upload the PDF file from which you want to extract specific pages.",
      },
      {
        title: "Step 2: Select Pages",
        description:
          "Enter the page numbers you want to extract (e.g. 1,3,5). The order will be preserved.",
      },
      {
        title: "Step 3: Extract Pages",
        description:
          "Click the Extract Pages button to create a new PDF with only the selected pages.",
      },
      {
        title: "Step 4: Download",
        description:
          "Download the newly created PDF containing the extracted pages.",
      },
    ],
  },
  "extract-images": {
    title: "Extract Images",
    description: "Extract one or more images into a new PDF.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Upload the PDF file from which you want to extract images.",
      },
      {
        title: "Step 2: Scan for Images",
        description:
          "The tool scans the entire PDF and detects all embedded images automatically.",
      },
      {
        title: "Step 3: Extract Images",
        description:
          "Click the Extract Images button to extract all detected images from the PDF.",
      },
      {
        title: "Step 4: Download ZIP",
        description:
          "Download a ZIP file containing all extracted images in their original quality.",
      },
    ],
  },

  "organize-pages": {
    title: "Organize Pages",
    description: "Rearrange, reorder, or remove pages visually.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file whose pages you want to reorder.",
      },
      {
        title: "Step 2: Define New Page Order",
        description:
          "Enter the new page sequence using comma-separated numbers (e.g. 3,1,2).",
      },
      {
        title: "Step 3: Organize Pages",
        description:
          "Click the Organize Pages button to reorder the pages as specified.",
      },
      {
        title: "Step 4: Download",
        description: "Download the reordered PDF once processing is complete.",
      },
    ],
  },

  "compress-pdf": {
    title: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file you want to compress.",
      },
      {
        title: "Step 2: Choose Compression Level",
        description:
          "Select a compression quality (High, Medium, or Low) to balance size and quality.",
      },
      {
        title: "Step 3: Compress PDF",
        description: "Click the Compress PDF button to reduce the file size.",
      },
      {
        title: "Step 4: Download",
        description: "Download the compressed PDF once processing is complete.",
      },
    ],
  },

  "annotate-pdf": {
    title: "Annotate PDF",
    description: "Highlight, comment, underline, and draw on PDFs.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file you want to annotate.",
      },
      {
        title: "Step 2: Select Page & Tools",
        description:
          "Choose the page and use tools like Pen, Highlight, Text, or Eraser to annotate.",
      },
      {
        title: "Step 3: Apply Annotations",
        description:
          "Draw, highlight, add text, undo or clear annotations as needed.",
      },
      {
        title: "Step 4: Save & Download",
        description:
          "Save your annotations and download the annotated PDF file.",
      },
    ],
  },

  "edit-text": {
    title: "Edit Text",
    description: "Modify text, add images, and update your PDF content.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file you want to edit.",
      },
      {
        title: "Step 2: Select Page",
        description:
          "Choose the page where you want to edit text or add images.",
      },
      {
        title: "Step 3: Edit Content",
        description:
          "Add or modify text, insert images, move, resize, zoom, or delete overlays.",
      },
      {
        title: "Step 4: Save & Download",
        description: "Save your changes and download the edited PDF file.",
      },
    ],
  },
  "crop-pdf": {
    title: "Crop Pdf",
    description: "Trim unwanted margins or focus on specific content",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Upload the PDF file you want to crop.",
      },
      {
        title: "Step 2: Select Crop Area",
        description:
          "Drag to select the area you want to keep on the page preview.",
      },
      {
        title: "Step 3: Choose Crop Options",
        description:
          "Select options like apply to all pages, keep aspect ratio, compress output, or flatten PDF.",
      },
      {
        title: "Step 4: Crop & Download",
        description:
          "Click Crop PDF to apply the crop and download the processed file.",
      },
    ],
  },
  "add-watermark": {
    title: "Add Watermark",
    description: "Trim unwanted margins or focus on specific content",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF file you want to watermark.",
      },
      {
        title: "Step 2: Choose Watermark",
        description:
          "Select text or image watermark and configure size, rotation, and style.",
      },
      {
        title: "Step 3: Place Watermark",
        description:
          "Click on the PDF preview to place the watermark and drag to adjust position.",
      },
      {
        title: "Step 4: Apply & Download",
        description:
          "Apply the watermark to the PDF and download the final file.",
      },
    ],
  },
  "add-numberpages": {
    title: "Add Number Pages",
    description:
      "Insert page numbers into your PDF in seconds. Choose position, style, and format.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF file where page numbers need to be added.",
      },
      {
        title: "Step 2: Configure Numbering",
        description:
          "Choose number format, font size, color, opacity, and starting number.",
      },
      {
        title: "Step 3: Select Pages",
        description:
          "Apply numbering to all pages or a specific page range and set skip options.",
      },
      {
        title: "Step 4: Apply & Download",
        description: "Add page numbers to the PDF and download the final file.",
      },
    ],
  },
  "add-signature": {
    title: "Add Signature",
    description:
      "Insert page numbers into your PDF in seconds. Choose position, style, and format.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Select the PDF document where you want to add a signature.",
      },
      {
        title: "Step 2: Create Signature",
        description:
          "Draw your signature or upload an image and adjust the signature size.",
      },
      {
        title: "Step 3: Place Signature",
        description:
          "Click on the PDF to place the signature, save it, or apply it to all pages.",
      },
      {
        title: "Step 4: Apply & Download",
        description:
          "Apply the signature to the PDF and download the signed file.",
      },
    ],
  },
  "chat-with-pdf": {
    title: "Chat With PDF",
    description:
      "Insert page numbers into your PDF in seconds. Choose position, style, and format.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF file you want to chat with.",
      },
      {
        title: "Step 2: Analyze Document",
        description:
          "Wait while the system analyzes and prepares the PDF for chat.",
      },
      {
        title: "Step 3: Ask Questions",
        description:
          "Type questions to search, summarize, or extract information from the PDF.",
      },
      {
        title: "Step 4: Get Answers",
        description: "Receive AI-powered responses based on the PDF content.",
      },
    ],
  },
  "pdf-summarizer": {
    title: "PDF Summarizer",
    description:
      "Get clean summaries, key points & insights from any PDF in seconds with AI-powered analysis.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF document you want to summarize.",
      },
      {
        title: "Step 2: Choose Summary Type",
        description:
          "Select short summary, detailed summary, or both versions.",
      },
      {
        title: "Step 3: Analyze Document",
        description:
          "Let the AI scan and understand the full document content.",
      },
      {
        title: "Step 4: Download Summary",
        description: "Download the generated summary as a PDF or ZIP file.",
      },
    ],
  },
  "mulitilanguage-translate": {
    title: "Translate PDF",
    description:
      "Insert page numbers into your PDF in seconds. Choose position, style, and format.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF document you want to translate.",
      },
      {
        title: "Step 2: Choose Language",
        description: "Select the target language for translation.",
      },
      {
        title: "Step 3: Translate Document",
        description: "AI processes and translates the entire PDF content.",
      },
      {
        title: "Step 4: Download File",
        description: "Download the translated PDF instantly.",
      },
    ],
  },
  "smart-classification": {
    title: "Smart Classification",
    description:
      "Upload a document and let AI instantly detect the type - invoices, resumes, certificates, forms & more.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF document you want to classify.",
      },
      {
        title: "Step 2: Configure Options",
        description:
          "Choose whether to show confidence scores and add classification tags.",
      },
      {
        title: "Step 3: Analyze Document",
        description:
          "AI scans the document and detects its type automatically.",
      },
      {
        title: "Step 4: Apply Classification",
        description:
          "Apply the classification and generate the tagged document.",
      },
    ],
  },
  "smart-merge": {
    title: "Smart Classification",
    description:
      "Combine multiple documents with AI suggestions for optimal order and related pages.",
    button: "Upload Your PDF to Smart Merge",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDFs",
        description: "Upload multiple PDF files that belong together.",
      },
      {
        title: "Step 2: Analyze Order",
        description:
          "AI analyzes document content and suggests the best merge order.",
      },
      {
        title: "Step 3: Review & Reorder",
        description:
          "Review the suggested order and drag files to adjust if needed.",
      },
      {
        title: "Step 4: Merge & Download",
        description: "Confirm the order and download the merged PDF file.",
      },
    ],
  },
  "auto-naming": {
    title: "Auto Naming",
    description:
      "Generate meaningful file names automatically by analyzing keywords, structure & context.",
    button: "Upload Your PDF to Auto Naming",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Select the PDF document you want to rename automatically.",
      },
      {
        title: "Analyze Content",
        description:
          "AI scans the document structure, keywords, and context to generate a suitable name.",
      },
      {
        title: "Step 3: Customize Name",
        description:
          "Review and customize the suggested name using style and formatting options.",
      },
      {
        title: "Apply & Save",
        description: "Apply the final name and save the renamed document.",
      },
    ],
  },
  "remove-duplicate": {
    title: "Remove Duplicate",
    description:
      "Remove blank pages, duplicates & fix structure automatically to optimize your PDFs.",
    button: "Upload Your PDF to Smart Cleanup",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description: "Select the PDF document you want to clean and optimize.",
      },
      {
        title: "Step 2: Select Cleanup Options",
        description:
          "Choose cleanup actions like removing duplicate pages, blank pages, or fixing orientation.",
      },
      {
        title: "Step 3: Process Document",
        description:
          "AI analyzes the PDF and applies the selected cleanup operations.",
      },
      {
        title: "Step 4: Download Clean PDF",
        description: "Download the cleaned and optimized PDF file.",
      },
    ],
  },
  "ocr-extraction": {
    title: "OCR Extraction",
    description:
      "Your file is secure. All uploads are encrypted and auto-deleted after 1 hour.",
    button: "Upload Your PDF to OCR Extraction",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Select the scanned or image-based PDF from which you want to extract text.",
      },
      {
        title: "Step 2: Choose OCR Options",
        description:
          "Select OCR preferences like auto-detection, printed or handwritten text, language, and layout preservation.",
      },
      {
        title: "Step 3: Extract Text",
        description:
          "AI-powered OCR analyzes the document and converts images into selectable text.",
      },
      {
        title: "Step 4: Download Result",
        description:
          "Download the text-extracted PDF or output file after OCR processing.",
      },
    ],
  },
  "protect-with-password": {
    title: "Protect PDF with Password",
    description: "Secure your PDF files with a password.",
    button: "Upload Your PDF File",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload PDF",
        description:
          "Select the PDF document you want to protect with a password.",
      },
      {
        title: "Step 2: Set Password & Options",
        description:
          "Enter a secure password and choose protection options like restrictions or encryption strength.",
      },
      {
        title: "Step 3: Protect Document",
        description:
          "The system encrypts your PDF using the selected password and security settings.",
      },
      {
        title: "Step 4: Download Protected PDF",
        description: "Download the password-protected PDF file securely.",
      },
    ],
  },
  "unlock-password": {
    title: "Unlock PDF (Remove Password)",
    description: "Easily remove a known password from your PDF file.",
    button: "Upload Your Password-Protected PDF",
    formats: ".PDF",
    accept: ".pdf",
    mode: "custom",
    steps: [
      {
        title: "Step 1: Upload Locked PDF",
        description:
          "Select the password-protected PDF document you want to unlock.",
      },
      {
        title: "Step 2: Enter Current Password",
        description:
          "Provide the correct password to decrypt and unlock the PDF file.",
      },
      {
        title: "Step 3: Unlock Document",
        description:
          "The system verifies the password and removes protection securely.",
      },
      {
        title: "Step 4: Download Unlocked PDF",
        description:
          "Download the decrypted PDF without password restrictions.",
      },
    ],
  },
};
