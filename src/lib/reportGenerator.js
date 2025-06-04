import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateReport = async (analysisData, imageUrl) => {
  const pdf = new jsPDF();
  
  // Add header
  pdf.setFontSize(20);
  pdf.text('Medical Image Analysis Report', 20, 20);
  
  // Add date
  pdf.setFontSize(12);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Add image
  const img = new Image();
  img.src = imageUrl;
  await new Promise(resolve => {
    img.onload = resolve;
  });
  pdf.addImage(img, 'JPEG', 20, 40, 170, 100);
  
  let yPos = 150;

  analysisData.forEach((finding, index) => {
    // Add condition header
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Finding ${index + 1}: ${finding.type.toUpperCase()}`, 20, yPos);
    yPos += 10;

    // Add severity and confidence
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Severity: ${finding.severity} (${finding.confidence.toFixed(1)}% confidence)`, 25, yPos);
    yPos += 10;

    // Add medical explanation
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Medical Explanation:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    const explanation = pdf.splitTextToSize(finding.explanation, 170);
    pdf.text(explanation, 25, yPos);
    yPos += explanation.length * 7;

    // Add symptoms
    pdf.setFontSize(12);
    pdf.text("Symptoms:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    finding.symptoms.forEach(symptom => {
      pdf.text(`• ${symptom}`, 25, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Add recommended tests
    pdf.setFontSize(12);
    pdf.text("Recommended Tests:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    finding.tests.forEach(test => {
      pdf.text(`• ${test}`, 25, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Add specialists
    pdf.setFontSize(12);
    pdf.text("Specialists to Consult:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    finding.specialists.forEach(specialist => {
      pdf.text(`• ${specialist}`, 25, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Add treatment options
    pdf.setFontSize(12);
    pdf.text("Treatment Options:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    finding.treatments.forEach(treatment => {
      pdf.text(`• ${treatment}`, 25, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Add lifestyle recommendations
    pdf.setFontSize(12);
    pdf.text("Lifestyle Recommendations:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    finding.lifestyle.forEach(recommendation => {
      pdf.text(`• ${recommendation}`, 25, yPos);
      yPos += 7;
    });
    yPos += 15;

    // Add new page if needed
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
  });
  
  return pdf;
};

export const downloadReport = async (analysisData, imageUrl) => {
  const pdf = await generateReport(analysisData, imageUrl);
  pdf.save('medical-analysis-report.pdf');
};