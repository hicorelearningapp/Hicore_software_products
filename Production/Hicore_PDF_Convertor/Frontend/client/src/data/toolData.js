// src/data/toolData.js
import pdfIcon from "../assets/Toolbox/PDF.png"
import wordIcon from "../assets/Toolbox/Word.png";
import ExcelIcon from "../assets/Toolbox/Excel.png";
import powerpointIcon from "../assets/Toolbox/PPT.png";
import imageIcon from "../assets/Toolbox/Image.png";


import mergeIcon from "../assets/Toolbox/Merge.png";
import splitIcon from "../assets/Toolbox/Split.png";
import rotateIcon from "../assets/Toolbox/Rotate.png";
import compressIcon from "../assets/Toolbox/Compress.png";
import deleteIcon from "../assets/Toolbox/delete.png";
import extractIcon from "../assets/Toolbox/Extract.png";
import organizeIcon from "../assets/Toolbox/Organize.png";

import annotateIcon from "../assets/Toolbox/Annotate.png";
import editIcon from "../assets/Toolbox/Edit.png";
import cropIcon from "../assets/Toolbox/Crop.png";
import watermarkIcon from "../assets/Toolbox/Watermark.png";
import pagenumberIcon from "../assets/Toolbox/Pagenumber.png";

import smartIcon from "../assets/Toolbox/Sort.png";
import chatIcon from "../assets/Toolbox/Chat.png";
import translateIcon from "../assets/Toolbox/Translate.png";
import mergerIcon from "../assets/Toolbox/Merge.png";
import summarizerIcon from "../assets/Toolbox/Summarize.png";

import signatureIcon from "../assets/Toolbox/Sign.png";
import passwordIcon from "../assets/Toolbox/Password.png";
import unlockIcon from "../assets/Toolbox/Unlock.png";


import {
  RefreshCcw,
  Wrench,
  Edit3,
  PenTool,
  Lock,
  Brain,
} from "lucide-react";

export const toolSections = [
  {
    title: "Document Convertor",
    tools: [
      { icon: pdfIcon, label: "PDF to Word", path: "pdf-word" },
      { icon: wordIcon, label: "Word to PDF", path: "word-pdf" },
      { icon: pdfIcon, label: "PDF to Excel", path: "pdf-excel" },
      { icon: ExcelIcon, label: "Excel to PDF", path: "excel-pdf" },
      { icon: pdfIcon, label: "PDF to PowerPoint", path: "pdf-powerpoint" },
      {
        icon: powerpointIcon,
        label: "PowerPoint to PDF",
        path: "powerpoint-pdf",
      },
      { icon: pdfIcon, label: "PDF to Image", path: "pdf-image" },
      { icon: imageIcon, label: "Image to PDF", path: "image-pdf" },
    ],
  },
  {
    title: "PDF Organizer",
    tools: [
      { icon: mergeIcon, label: "Merge PDF", path: "merge-pdf" },
      { icon: deleteIcon, label: "Delete Pages", path: "delete-pages" },
      { icon: splitIcon, label: "Split PDF", path: "split-pdf" },
      { icon: extractIcon, label: "Extract Pages", path: "extract-pages" },
      { icon: rotateIcon, label: "Rotate PDF", path: "rotate-pdf" },
      { icon: organizeIcon, label: "Organize Pages", path: "organize-pages" },
      { icon: compressIcon, label: "Compress PDF", path: "compress-pdf" },
      { icon: extractIcon, label: "Extract Images", path: "extract-images" },
    ],
  },
  {
    title: "Edit PDF",
    tools: [
      { icon: annotateIcon, label: "Annotate PDF", path: "annotate-pdf" },
  //    { icon: editIcon, label: "Edit Text", path: "edit-text" },
      { icon: cropIcon, label: "Crop PDF", path: "crop-pdf" },
      { icon: watermarkIcon, label: "Add Watermark", path: "add-watermark" },
      {
        icon: pagenumberIcon,
        label: "Add Number Pages",
        path: "add-number-pages",
      },
      {
        icon: deleteIcon,
        label: "Remove Duplicates",
        path: "remove-duplicates",
      },
    ],
  },
  {
    title: "AI PDF",
    tools: [
      {
        icon: smartIcon,
        label: "Smart Classification",
        path: "smart-classification",
      },
      {
        icon: chatIcon,
        label: "Chat with PDF",
        path: "chat-with-pdf",
      },
      { icon: translateIcon, label: "Translate PDF", path: "translate-pdf" },
      {
        icon: mergerIcon,
        label: "Smart Merge",
        path: "smart-merge",
      },
      { icon: summarizerIcon, label: "PDF Summarizer", path: "pdf-summarize" },
    ],
  },
  {
    title: "Signature & Password",
    tools: [
      {
        icon: passwordIcon,
        label: "Protect with Password",
        path: "protect-password",
      },
      {
        icon: unlockIcon,
        label: "Unlock Password (Known)",
        path: "unlock-password",
      },
      { icon: signatureIcon, label: "Add Signature", path: "add-signature" },
    ],
  },
];

export const toolsData = [
  {
    title: "Convert",
    color: "bg-orange-400",
    icon: RefreshCcw,
    tools: [
      { label: "PDF - Word", path: "pdf-word" },
      { label: "Word - PDF", path: "word-pdf" },
      { label: "PDF - Excel", path: "pdf-excel" },
      { label: "Excel - PDF", path: "excel-pdf" },
      { label: "PDF - PowerPoint", path: "pdf-powerpoint" },
      { label: "PowerPoint - PDF", path: "powerpoint-pdf" },
      { label: "PDF - Image", path: "pdf-image" },
      { label: "Image - PDF", path: "image-pdf" },
    ],
  },

  {
    title: "Organize",
    color: "bg-yellow-300",
    icon: Wrench,
    tools: [
      { label: "Merge PDF", path: "merge-pdf" },
      { label: "Split PDF", path: "split-pdf" },
      { label: "Rotate PDF", path: "rotate-pdf" },
      { label: "Delete Pages", path: "delete-pages" },
      { label: "Extract Pages", path: "extract-pages" },
      { label: "Organize Pages", path: "organize-pages" },
      { label: "Compress PDF", path: "compress-pdf" },
      { label: "Extract Images", path: "extract-images" },
    ],
  },

  {
    title: "Edit",
    color: "bg-green-300",
    icon: Edit3,
    tools: [
      { label: "Annotate PDF", path: "annotate-pdf" },
     // { label: "Edit text", path: "edit-text" },
      { label: "Crop PDF", path: "crop-pdf" },
      { label: "Add Watermark", path: "add-watermark" },
      { label: "Add Number Pages", path: "add-numberpages" },
      { label: "Remove Duplicate", path: "remove-duplicate" },
    ],
  },

  {
    title: "Signature",
    color: "bg-cyan-300",
    icon: PenTool,
    tools: [
      { label: "Add Signature", path: "add-signature" },
      //   { label: "Request Signature", path: "request-signature" },
    ],
  },

  {
    title: "AI PDF",
    color: "bg-purple-300",
    icon: Brain,
    tools: [
      { label: "Smart classification", path: "smart-classification" },
      { label: "PDF Summarizer", path: "pdf-summarizer" },
      { label: "Chat with PDF", path: "chat-with-pdf" },
      { label: "Smart merge", path: "smart-merge" },
      //  { label: "Auto Naming", path: "auto-naming" },
      //  { label: "OCR Extraction", path: "ocr-extraction" },
      { label: "Multi-Language Translate", path: "mulitilanguage-translate" },
    ],
  },

  {
    title: "Password",
    color: "bg-pink-300",
    icon: Lock,
    tools: [
      { label: "Protect with Password", path: "protect-with-password" },
      { label: "Unlock Password (Known)", path: "unlock-password" },
    ],
  },
];
