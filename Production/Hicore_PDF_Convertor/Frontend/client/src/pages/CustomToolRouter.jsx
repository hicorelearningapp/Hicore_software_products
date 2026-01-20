// src/pages/tools/CustomToolRouter.jsx
import React from "react";
import { useParams } from "react-router-dom";
import MergePdf from "./Organize/MergePdf";
import SplitPdf from "./Organize/SplitPdf";
import RotatePdf from "./Organize/RotatePdf";
import DeletePages from "./Organize/DeletePages";
import ExtractPages from "./Organize/ExtractPages";
import OrganizePages from "./Organize/OrganizePages";
import CompressPdf from "./Organize/CompressPdf";
import Annotate from "./Edit/Annotate";
import EditText from "./Edit/EditText";
import CropPdf from "./Edit/CropPdf";
import Addwatermark from "./Edit/Addwatermark";
import AddNumberPages from "./Edit/AddNumberPages";
import ChatwithPdf from "./AIPdf/ChatwithPdf";
import AddSignature from "./Signature/AddSignature";
import PdfSummarize from "./AIPdf/PdfSummarize";
import TranslatePdf from "./AIPdf/TranslatePdf";
import SmartClassification from "./AIPdf/SmartClassification";
import SmartMerge from "./AIPdf/SmartMerge";
import AutoNaming from "./AIPdf/AutoNaming";
import SmartCleanup from "./Edit/SmartCleanup";
import OCRExtraction from "./AIPdf/OCRExtraction";
import ProtectWithPassword from "./Password/ProtectWithPassword";
import UnlockPassword from "./Password/UnlockPassword";
import ExtractImages from "./Organize/ExtractImages";



const CustomToolRouter = () => {
  const { toolId } = useParams();

  switch (toolId) {
    case "merge-pdf":
      return <MergePdf />;
    case "split-pdf":
      return <SplitPdf />;
    case "rotate-pdf":
      return <RotatePdf />;
    case "delete-pages":
      return <DeletePages />;
    case "extract-pages":
      return <ExtractPages />;
    case "organize-pages":
      return <OrganizePages />;
    case "compress-pdf":
      return <CompressPdf />;
    case "annotate-pdf":
      return <Annotate />;
    case "edit-text":
      return <EditText />;
    case "crop-pdf":
      return <CropPdf />;
    case "add-watermark":
      return <Addwatermark />;
    case "add-numberpages":
      return <AddNumberPages />;
    case "add-signature":
      return <AddSignature />;
    case "chat-with-pdf":
      return <ChatwithPdf />;
    case "pdf-summarizer":
      return <PdfSummarize />;
    case "mulitilanguage-translate":
      return <TranslatePdf />;
    case "smart-classification":
      return <SmartClassification />;
    case "smart-merge":
      return <SmartMerge />;
    case "auto-naming":
      return <AutoNaming />;
    case "remove-duplicate":
      return <SmartCleanup />;
    case "ocr-extraction":
      return <OCRExtraction />;
    case "protect-with-password":
      return <ProtectWithPassword />;
    case "unlock-password":
      return <UnlockPassword />;
    case "extract-images":
      return <ExtractImages />;
    default:
      return <div>No custom UI defined for {toolId}</div>;
  }
};

export default CustomToolRouter;
