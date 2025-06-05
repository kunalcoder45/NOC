// File: lib/generatePDF.ts
import html2pdf from 'html2pdf.js';

export default function generatePDF(formData) {
  const letterElement = document.querySelector('div'); // Target top-level div in <Letter />

  if (!letterElement) return;

  const opt = {
    margin: 0.5,
    filename: `NOC-${formData.name}-${formData.regNo}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf(letterElement, opt).save();
}
