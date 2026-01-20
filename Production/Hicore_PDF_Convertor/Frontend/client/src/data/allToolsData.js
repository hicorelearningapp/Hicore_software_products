// src/data/allToolsData.js
import pdfIcon from "../assets/Toolbox/PDF.png";
import wordIcon from "../assets/Toolbox/Word.png";
import deleteIcon from "../assets/Toolbox/delete.png";
import mergeIcon from "../assets/Toolbox/Merge.png";
import excelIcon from "../assets/Toolbox/Excel.png";
import splitIcon from "../assets/Toolbox/Split.png";
import extractIcon from "../assets/Toolbox/Extract.png";
import PowerPointIcon from "../assets/Toolbox/PPT.png";
import rotateIcon from "../assets/Toolbox/Rotate.png";
import organizeIcon from "../assets/Toolbox/Organize.png";
import imageIcon from "../assets/Toolbox/Image.png";
import compressIcon from "../assets/Toolbox/Compress.png";
import annotateIcon from "../assets/Toolbox/Annotate.png";
import cropIcon from "../assets/Toolbox/Crop.png";
import watermarkIcon from "../assets/Toolbox/Watermark.png";
import pagenumberIcon from "../assets/Toolbox/Pagenumber.png";
import duplicateIcon from "../assets/Toolbox/delete.png";
import signatureIcon from "../assets/Toolbox/Sign.png";
import sortIcon from "../assets/Toolbox/Sort.png";
import summarizeIcon from "../assets/Toolbox/Summarize.png";
import chatIcon from "../assets/Toolbox/Chat.png";
import translateIcon from "../assets/Toolbox/Translate.png";
import passwordIcon from "../assets/Toolbox/Password.png";
import unlockIcon from "../assets/Toolbox/Unlock.png";


export const allToolsData = [
  { title: "PDF to Word", icon: pdfIcon, path: "pdf-word" },
  { title: "Word to PDF", icon: wordIcon, path: "word-pdf" },
  { title: "PDF to Excel", icon: pdfIcon, path: "pdf-excel" },
  { title: "Excel to PDF", icon: excelIcon, path: "excel-pdf" },
  { title: "PDF to Powerpoint", icon: pdfIcon, path: "pdf-powerpoint" },
  { title: "Powerpoint to PDF", icon: PowerPointIcon, path: "powerpoint-pdf" },
  { title: "PDF to Image", icon: pdfIcon, path: "pdf-image" },
  { title: "Image to PDF", icon: imageIcon, path: "image-pdf" },

  { title: "Merge PDF", icon: mergeIcon, path: "merge-pdf" },
  { title: "Split PDF", icon: splitIcon, path: "split-pdf" },
  { title: "Rotate PDF", icon: rotateIcon, path: "rotate-pdf" },
  { title: "Delete Pages", icon: deleteIcon, path: "delete-pages" },
  { title: "Extract Pages", icon: extractIcon, path: "extract-pages" },
  { title: "Organize Pages", icon: organizeIcon, path: "organize-pages" },
  { title: "Compress PDF", icon: compressIcon, path: "compress-pdf" },
  { title: "Extract Images", icon: imageIcon, path: "extract-images" },

  { title: "Annotate PDF", icon: annotateIcon, path: "annotate-pdf" },
  { title: "Crop PDF", icon: cropIcon, path: "crop-pdf" },
  { title: "Add Watermark", icon: watermarkIcon, path: "add-watermark" },
  { title: "Add NumberPages", icon: pagenumberIcon, path: "add-numberpages" },
  { title: "Remove Duplicate", icon: duplicateIcon, path: "remove-duplicate" },

  { title: "Add Signature", icon: signatureIcon, path: "add-signature" },

  {
    title: "Smart Classification",
    icon: sortIcon,
    path: "smart-classification",
  },
  { title: "PDF Summarize", icon: summarizeIcon, path: "pdf-summarize" },
  { title: "Chat with PDF", icon: chatIcon, path: "chat-with-pdf" },
  { title: "Smart Merge", icon: mergeIcon, path: "smart-merge" },
  {
    title: "Translate PDF",
    icon: translateIcon,
    path: "mulitilanguage-translate",
  },

  {
    title: "Protect with Password",
    icon: passwordIcon,
    path: "protect-with-password",
  },
  {
    title: "Unlock Password (Known)",
    icon: unlockIcon,
    path: "unlock-password",
  },
];
