
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "../map/types";
import { FileText, Download, Share2, Printer } from "lucide-react";

interface ReceiptGeneratorProps {
  booking: Booking;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ booking }) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded as a PDF.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Receipt Shared",
      description: "A link to your receipt has been copied to clipboard.",
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Printing Receipt",
      description: "Your receipt has been sent to the printer.",
    });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const calculateTax = (fare: number) => {
    return fare * 0.1; // 10% tax
  };
  
  const calculateTotal = (fare: number) => {
    return fare + calculateTax(fare);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText size={16} />
          <span>Receipt</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Trip Receipt</DialogTitle>
          <DialogDescription>
            Receipt for trip to {booking.destination} on {formatDate(booking.completedAt || booking.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">TaxiConnect</h3>
            <p className="text-sm text-gray-500">Receipt #{booking.id.slice(-6)}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm"><strong>From:</strong> Terminal #{booking.terminalId}</p>
            <p className="text-sm"><strong>To:</strong> {booking.destination}</p>
            <p className="text-sm"><strong>Date:</strong> {formatDate(booking.completedAt || booking.createdAt)}</p>
            <p className="text-sm"><strong>Driver:</strong> #{booking.driverId.slice(-4)}</p>
          </div>
          
          <Table>
            <TableCaption>Thank you for using our service</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Base fare</TableCell>
                <TableCell className="text-right">${booking.fare.toFixed(2)}</TableCell>
              </TableRow>
              {booking.isShared && booking.originalFare && (
                <TableRow>
                  <TableCell className="text-green-600">Ride sharing discount</TableCell>
                  <TableCell className="text-right text-green-600">
                    -${(booking.originalFare - booking.fare).toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Tax (10%)</TableCell>
                <TableCell className="text-right">${calculateTax(booking.fare).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">${calculateTotal(booking.fare).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} className="mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={16} className="mr-1" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptGenerator;
