import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface SchoolQRCodeProps {
  schoolId: string;
  schoolName: string;
  proprietorName: string;
  state: string;
  chapter: string;
  showCard?: boolean;
}

export const SchoolQRCode = ({ 
  schoolId, 
  schoolName, 
  proprietorName, 
  state, 
  chapter, 
  showCard = true 
}: SchoolQRCodeProps) => {
  // QR code value - contains verification URL
  const verifyUrl = `${window.location.origin}/verify?id=${schoolId}`;
  const qrValue = verifyUrl;

  const handleDownload = () => {
    const svg = document.getElementById('school-qr-code') as SVGSVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${schoolId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-area')?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>School QR Code - ${schoolId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .qr-container { margin: 20px auto; max-width: 300px; }
            .info { margin-top: 20px; text-align: left; }
            .info p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const qrCodeElement = (
    <div id="qr-print-area" className="flex flex-col items-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG
          id="school-qr-code"
          value={qrValue}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-bold text-lg">{schoolId}</h3>
        <p className="font-medium">{schoolName}</p>
        <p className="text-sm text-gray-600">{proprietorName}</p>
        <p className="text-xs text-gray-500">{state} - {chapter}</p>
      </div>
    </div>
  );

  if (!showCard) {
    return qrCodeElement;
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardContent className="p-6">
        {qrCodeElement}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolQRCode;
