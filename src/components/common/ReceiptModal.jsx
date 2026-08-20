import React, { useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  FileText,
  Share2,
  Mail,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  downloadPdfFromElement,
  downloadImageFromElement,
  generatePdfFile,
  printIsolatedElement,
  shareDocumentViaWhatsApp,
  shareDocumentViaEmail,
} from "../../utils/pdfGenerator";

export const ReceiptModal = ({
  isOpen,
  onClose,
  title = "Official Document Preview",
  fileName = "Corporate_Document",
  orientation = "portrait", // 'portrait' | 'landscape'
  children,
}) => {
  const { showToast } = useApp();
  const documentRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen) return null;

  const isLandscape = orientation === "landscape";

  // 1. Direct PDF Download
  const handleDownloadPdf = async () => {
    if (!documentRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const success = await downloadPdfFromElement(documentRef.current, fileName, orientation);
      if (success) {
        showToast(`✓ ${fileName}.pdf downloaded to your device!`, "success");
      } else {
        showToast("⚠️ Could not generate PDF. Trying print mode...", "warning");
        printIsolatedElement(documentRef.current, title, isLandscape);
      }
    } catch (err) {
      console.error("PDF Download failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Direct PNG Image Download
  const handleDownloadImage = async () => {
    if (!documentRef.current || isGeneratingImg) return;
    setIsGeneratingImg(true);
    try {
      const success = await downloadImageFromElement(documentRef.current, fileName);
      if (success) {
        showToast(`✓ ${fileName}.png image saved to your device!`, "success");
      }
    } catch (err) {
      console.error("Image Download failed:", err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // 3. Print Isolated Document
  const handlePrint = () => {
    if (!documentRef.current) return;
    printIsolatedElement(documentRef.current, title, isLandscape);
  };

  // 4. WhatsApp Share
  const handleShareWhatsApp = async () => {
    // Also trigger PNG download so user has the visual ready to drop into WhatsApp
    downloadImageFromElement(documentRef.current, fileName);
    const text = `*📄 ${title}*\nOfficial Record generated via Apex Civil Infrastructure Management.\nDate: ${new Date().toLocaleDateString("en-IN")}\n(Document image has been saved to your downloads for quick attaching)`;
    shareDocumentViaWhatsApp(text);
    showToast("✓ Opened WhatsApp! Document image downloaded to attach.", "success");
  };

  // 5. Email Share (Pre-fills email + downloads PDF to attach)
  const handleShareEmail = async () => {
    // Generate and download PDF so the user has the file to attach
    await downloadPdfFromElement(documentRef.current, fileName, orientation);
    const subject = `${title} - Official Record`;
    const body = `Hello,\n\nPlease find attached the official record for:\n\n${title}\nGenerated on: ${new Date().toLocaleDateString("en-IN")}\n\n(The generated ${fileName}.pdf has been saved to your downloads folder — simply attach it to this email).\n\nIssued by Apex Civil Infrastructure Management.`;
    shareDocumentViaEmail(subject, body);
    showToast(`✓ Opened Email Client! Attach ${fileName}.pdf from your downloads.`, "info");
  };

  // 6. Universal Device / App Share
  const handleUniversalShare = async () => {
    if (!documentRef.current || isSharing) return;
    setIsSharing(true);

    try {
      const pdfFile = await generatePdfFile(documentRef.current, fileName, orientation);

      if (pdfFile && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title,
          text: `Official Document: ${title}`,
          files: [pdfFile],
        });
        showToast("✓ Shared successfully!", "success");
      } else if (navigator.share) {
        await navigator.share({
          title,
          text: `Official Document: ${title} - Generated via Apex Civil Management`,
        });
        showToast("✓ Shared successfully!", "success");
      } else {
        // Fallback to in-app share menu on desktop browsers without Web Share
        setShowShareModal(true);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setShowShareModal(true);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // 7. Copy Summary Text
  const handleCopySummary = () => {
    const text = `📄 ${title}\nDate: ${new Date().toLocaleDateString("en-IN")}\nSystem: Apex Civil Management`;
    navigator.clipboard.writeText(text);
    showToast("✓ Document summary copied to clipboard!", "success");
  };

  return (
    <div
      className="modal-overlay no-print-backdrop"
      onClick={onClose}
    >
      <div
        className={`app-panel modal-dialog overflow-hidden shadow-2xl animate-in fade-in flex flex-col relative ${
          isLandscape ? "max-w-5xl" : "max-w-4xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─────────────────────────────────────────────────────────
            MODAL HEADER & MULTI-SHARE ACTION TOOLBAR
        ───────────────────────────────────────────────────────── */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 no-print space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Isolated Document • {isLandscape ? "A4 Landscape" : "A4 Portrait"} • Multi-Share Ready</span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto pb-1 sm:flex-wrap">
            {/* 1. PDF Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              title="Download only this document as PDF"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 btn-touch transition-all cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* 2. PNG Image Download */}
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImg}
              title="Save as High-Res PNG Image"
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 btn-touch transition-all cursor-pointer"
            >
              {isGeneratingImg ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving PNG...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Save PNG</span>
                </>
              )}
            </button>

            {/* 3. Print */}
            <button
              onClick={handlePrint}
              title="Print only this document without background pages"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 btn-touch transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* 4. WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              title="Share record via WhatsApp"
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 btn-touch transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* 5. Email Share */}
            <button
              onClick={handleShareEmail}
              title="Send via Email (downloads PDF to attach)"
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20 btn-touch transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            {/* 6. Universal Share / More Channels */}
            <button
              onClick={handleUniversalShare}
              disabled={isSharing}
              title="Share file directly via any installed app"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md btn-touch transition-all cursor-pointer"
            >
              {isSharing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>Share...</span>
            </button>

            {/* 7. Copy Summary */}
            <button
              onClick={handleCopySummary}
              title="Copy Summary to Clipboard"
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            SCROLLABLE PRINTABLE DOCUMENT CONTAINER
        ───────────────────────────────────────────────────────── */}
        <div className="p-3 sm:p-6 overflow-y-auto overflow-x-auto bg-slate-200/70 dark:bg-slate-950 flex justify-center">
          <div
            ref={documentRef}
            className={`w-full bg-white text-slate-900 shadow-2xl rounded-2xl p-5 sm:p-8 border border-slate-300 print-document-box font-sans ${
              isLandscape ? "max-w-[960px] min-w-[760px]" : "max-w-[800px]"
            }`}
            style={{ boxSizing: "border-box" }}
          >
            {children}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            DESKTOP SHARE CHANNELS MODAL (FALLBACK)
        ───────────────────────────────────────────────────────── */}
        {showShareModal && (
          <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="app-panel p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Share Document</h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Choose how you'd like to share <strong>{fileName}</strong>:
              </p>

              <div className="space-y-2 text-xs font-bold">
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleShareWhatsApp();
                  }}
                  className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp (Message & Image)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleShareEmail();
                  }}
                  className="w-full p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center justify-between hover:bg-sky-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-600" />
                    <span>Email (Download PDF & Draft)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleDownloadPdf();
                  }}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-between hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span>Direct Download PDF</span>
                  </span>
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleDownloadImage();
                  }}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-between hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Direct Download PNG</span>
                  </span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
