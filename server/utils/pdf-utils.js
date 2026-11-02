// Simple PDF generation for attendance records using jsPDF
// This runs in the Node.js/server environment

function createPDF(dateStr, records) {
  const { create } = require('jspdf');
  const doc = create('p', 'mm', 'a4');
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('SmartScan Attendance', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.text(`Date: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  
  // Headers for table
  const headers = ['Employee', 'Check-in Time', 'Check-out Time'];
  const rows = records.map(record => [
    record.user ? record.user.name : 'Unknown',
    record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A',
    record.checkoutTime ? new Date(record.checkoutTime).toLocaleTimeString() : '—'
  ]);
  
  // Add table
  (doc.autoTable as any).setHeading(20);
  (doc.autoTable as any)({
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    margin: { left: 10, right: 10 }
  });
  
  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

module.exports = { createPDF };