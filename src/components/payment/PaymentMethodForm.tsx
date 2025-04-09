
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethod } from '../map/types';
import { CreditCard, DollarSign, AppleIcon, ShoppingCart } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface PaymentMethodFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ 
  isOpen, 
  onOpenChange, 
  onAddPaymentMethod 
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs (simplified)
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Validation Error",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // In a real application, this would call a payment processor API
    setTimeout(() => {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        lastFour: cardNumber.slice(-4),
        isDefault,
      };

      toast({
        title: "Payment Method Added",
        description: `Card ending in ${newPaymentMethod.lastFour} has been added`,
      });

      onAddPaymentMethod(newPaymentMethod);
      onOpenChange(false);
      setIsLoading(false);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setIsDefault(true);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                toast({
                  title: "Credit Card Selected",
                  description: "Please enter your card details",
                });
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Card
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                toast({
                  title: "Not implemented",
                  description: "PayPal integration would go here",
                });
              }}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              PayPal
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                toast({
                  title: "Not implemented",
                  description: "Apple Pay integration would go here",
                });
              }}
            >
              <AppleIcon className="mr-2 h-4 w-4" />
              Apple Pay
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-name">Name on Card</Label>
            <Input
              id="card-name"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
                type="password"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="default-payment"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
            <Label htmlFor="default-payment">Make default payment method</Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Add Payment Method"}
          </Button>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            <ShoppingCart className="inline-block mr-1 h-3 w-3" />
            Your payment information is secure and encrypted
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodForm;
