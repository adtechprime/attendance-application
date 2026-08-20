/**
 * Universal High-Fidelity Document PDF, Image & Share Engine
 * Powered by html-to-image & jsPDF for 100% compatibility with Tailwind CSS v4, modern colors, and fonts.
 * Guaranteed full-document capture including all dual signatures and legal footers.
 */
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

/**
 * Generates and downloads an isolated, vector-crisp A4 PDF file of the FULL document (including headers & footers).
 */
export async function downloadPdfFromElement(
  element,
  fileName = "Document.pdf",
  orientation = "portrait"
) {
  if (!element) {
    console.error("No element provided for PDF generation");
    return false;
  }

  const safeFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  const isLandscape = orientation === "landscape";

  try {
    // 1. Measure complete natural dimensions of the document (full height from top to footer)
    const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, 600);
    const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, isLandscape ? 960 : 760);

    // 2. Render complete DOM node into high-res PNG
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // 2x resolution for razor-sharp typography and borders
      width: fullWidth,
      height: fullHeight,
      backgroundColor: "#ffffff",
      cacheBust: true,
      style: {
        height: `${fullHeight}px`,
        maxHeight: "none",
        overflow: "visible",
        transform: "none",
        margin: "0",
        boxShadow: "none",
        borderRadius: "0",
      },
      filter: (node) => {
        return !node.classList?.contains("no-print");
      },
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // 3. Initialize jsPDF with standard A4 measurements
    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = isLandscape ? 297 : 210; // mm
    const pageHeight = isLandscape ? 210 : 297; // mm
    const margin = 8; // 8mm printable margin
    const contentWidth = pageWidth - margin * 2;
    const maxPageContentHeight = pageHeight - margin * 2;
    const totalRenderedHeight = (img.height * contentWidth) / img.width;

    // 4. Single-page or multi-page A4 rendering
    if (totalRenderedHeight <= maxPageContentHeight) {
      // Document fits cleanly on a single A4 page
      pdf.addImage(dataUrl, "PNG", margin, margin, contentWidth, totalRenderedHeight, undefined, "FAST");
    } else {
      // Document spans multiple A4 pages - slice canvas cleanly to prevent cut-offs
      const imgWidth = img.width;
      const imgHeight = img.height;
      const pageCanvasHeight = (imgWidth * maxPageContentHeight) / contentWidth;

      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < imgHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const remainingSourceHeight = imgHeight - sourceY;
        const currentSourceHeight = Math.min(pageCanvasHeight, remainingSourceHeight);
        const currentDestHeight = (currentSourceHeight * contentWidth) / imgWidth;

        // Slice canvas for this specific page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = currentSourceHeight;
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          img,
          0,
          sourceY,
          imgWidth,
          currentSourceHeight,
          0,
          0,
          imgWidth,
          currentSourceHeight
        );

        const pageDataUrl = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageDataUrl, "PNG", margin, margin, contentWidth, currentDestHeight, undefined, "FAST");

        sourceY += currentSourceHeight;
        pageIndex++;
      }
    }

    // 5. Trigger download of the PDF file
    pdf.save(safeFileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF with html-to-image/jsPDF:", error);
    return false;
  }
}

/**
 * Downloads a high-resolution PNG image containing the entire document from top header to bottom footer.
 */
export async function downloadImageFromElement(element, fileName = "Document.png") {
  if (!element) return false;

  const safeFileName = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, 600);
  const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, 760);

  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      width: fullWidth,
      height: fullHeight,
      backgroundColor: "#ffffff",
      cacheBust: true,
      style: {
        height: `${fullHeight}px`,
        maxHeight: "none",
        overflow: "visible",
        transform: "none",
        margin: "0",
        boxShadow: "none",
        borderRadius: "0",
      },
    });

    const link = document.createElement("a");
    link.download = safeFileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 500);

    return true;
  } catch (error) {
    console.error("Error downloading image with html-to-image:", error);
    return false;
  }
}

/**
 * Generates an in-memory PDF File object of the full document for native Web Share API
 */
export async function generatePdfFile(element, fileName = "Document.pdf", orientation = "portrait") {
  if (!element) return null;

  const safeFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  const isLandscape = orientation === "landscape";
  const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, 600);
  const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, isLandscape ? 960 : 760);

  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      width: fullWidth,
      height: fullHeight,
      backgroundColor: "#ffffff",
      cacheBust: true,
      style: {
        height: `${fullHeight}px`,
        maxHeight: "none",
        overflow: "visible",
        transform: "none",
        margin: "0",
        boxShadow: "none",
      },
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const margin = 8;
    const contentWidth = pageWidth - margin * 2;
    const maxPageContentHeight = pageHeight - margin * 2;
    const totalRenderedHeight = (img.height * contentWidth) / img.width;

    if (totalRenderedHeight <= maxPageContentHeight) {
      pdf.addImage(dataUrl, "PNG", margin, margin, contentWidth, totalRenderedHeight, undefined, "FAST");
    } else {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const pageCanvasHeight = (imgWidth * maxPageContentHeight) / contentWidth;

      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < imgHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const remainingSourceHeight = imgHeight - sourceY;
        const currentSourceHeight = Math.min(pageCanvasHeight, remainingSourceHeight);
        const currentDestHeight = (currentSourceHeight * contentWidth) / imgWidth;

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = currentSourceHeight;
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          img,
          0,
          sourceY,
          imgWidth,
          currentSourceHeight,
          0,
          0,
          imgWidth,
          currentSourceHeight
        );

        const pageDataUrl = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageDataUrl, "PNG", margin, margin, contentWidth, currentDestHeight, undefined, "FAST");

        sourceY += currentSourceHeight;
        pageIndex++;
      }
    }

    const blob = pdf.output("blob");
    return new File([blob], safeFileName, { type: "application/pdf" });
  } catch (err) {
    console.error("Error generating PDF file blob:", err);
    return null;
  }
}

/**
 * Prints ONLY the selected element via an isolated hidden iframe.
 */
export function printIsolatedElement(element, title = "Print Document", isLandscape = false) {
  if (!element) return;

  let stylesHtml = "";
  const styleElements = document.querySelectorAll("style, link[rel='stylesheet']");
  styleElements.forEach((el) => {
    stylesHtml += el.outerHTML;
  });

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.title = title;

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${stylesHtml}
        <style>
          @page {
            margin: 8mm;
            size: ${isLandscape ? "landscape" : "portrait"};
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 8px !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-document-box {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        </style>
      </head>
      <body>
        <div class="print-document-box">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 350);
}

/**
 * Shares document summary text via WhatsApp
 */
export function shareDocumentViaWhatsApp(text) {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/**
 * Prepares and opens an email draft with pre-filled subject and body.
 */
export function shareDocumentViaEmail(subject, body) {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}
