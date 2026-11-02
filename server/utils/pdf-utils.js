const { createPdf } = require('jspdf');

function createPDF(dateStr, records) {
  const doc = createPdf('p', 'mm', 'a4');
  
  // Title
  doc.setFontSize(18);
  doc.text('SmartScan Attendance', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Date
  doc.setFontSize(12);
  doc.text(`Date: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
  
  // Simple list of attendees
  let y = 50;
  doc.setFontSize(10);
  
  if (records.length === 0) {
    doc.text('No check-in records for this date.', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  } else {
    records.forEach((record, i) => {
      const name = record.user ? record.user.name : 'Unknown';
      const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A';
      const checkOut = record.checkoutTime ? new Date(record.checkoutTime).toLocaleTimeString() : '—';
      doc.text(`${i + 1}. ${name} — Check-in: ${checkIn} — Check-out: ${checkOut}`, 10, y);
      y += 10;
    });
  }
  
  // Output as Buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

module.exports = { createPDF };