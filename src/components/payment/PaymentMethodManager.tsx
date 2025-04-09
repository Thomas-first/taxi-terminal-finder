
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { User, PaymentMethod } from "../map/types";
import { 
  CreditCard, 
  Trash2, 
  Plus, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

interface PaymentMethodManagerProps {
  user: User;
  onSave: (user: User) => void;
}

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({ 
  user, 
  onSave 
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Cards form schema
  const cardFormSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits").max(19),
    cardName: z.string().min(2, "Name is required"),
    expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry must be in MM/YY format"),
    cvv: z.string().min(3, "CVV must be 3-4 digits").max(4),
    isDefault: z.boolean().default(false),
  });
  
  // Digital form schema (PayPal, Apple Pay, etc.)
  const digitalFormSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    type: z.enum(["paypal", "applepay", "googlepay"]),
    isDefault: z.boolean().default(false),
  });
  
  // Card form state
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      isDefault: false,
    },
  });
  
  // Digital payment form state
  const digitalForm = useForm<z.infer<typeof digitalFormSchema>>({
    resolver: zodResolver(digitalFormSchema),
    defaultValues: {
      email: user.email,
      type: "paypal",
      isDefault: false,
    },
  });
  
  const handleDeletePaymentMethod = (id: string) => {
    if (!user.paymentMethods) return;
    
    // If deleting default payment method, select a new default
    const deletingDefault = user.paymentMethods.find(p => p.id === id)?.isDefault;
    let updatedPaymentMethods = user.paymentMethods.filter(p => p.id !== id);
    
    if (deletingDefault && updatedPaymentMethods.length > 0) {
      updatedPaymentMethods[0].isDefault = true;
    }
    
    onSave({
      ...user,
      paymentMethods: updatedPaymentMethods,
    });
    
    toast({
      title: "Payment method removed",
      description: "Your payment method has been successfully removed.",
    });
  };
  
  const handleSetDefault = (id: string) => {
    if (!user.paymentMethods) return;
    
    const updatedPaymentMethods = user.paymentMethods.map(p => ({
      ...p,
      isDefault: p.id === id,
    }));
    
    onSave({
      ...user,
      paymentMethods: updatedPaymentMethods,
    });
    
    // Also update user preferences
    if (user.preferences) {
      onSave({
        ...user,
        paymentMethods: updatedPaymentMethods,
        preferences: {
          ...user.preferences,
          preferredPaymentMethod: id
        }
      });
    }
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been set.",
    });
  };
  
  const onSubmitCard = (values: z.infer<typeof cardFormSchema>) => {
    const lastFour = values.cardNumber.slice(-4);
    
    let newPaymentMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: "card",
      lastFour,
      isDefault: values.isDefault,
    };
    
    // If setting as default, update all other payment methods
    let updatedPaymentMethods = user.paymentMethods ? [...user.paymentMethods] : [];
    
    if (values.isDefault) {
      updatedPaymentMethods = updatedPaymentMethods.map(p => ({
        ...p,
        isDefault: false,
      }));
    }
    
    updatedPaymentMethods.push(newPaymentMethod);
    
    onSave({
      ...user,
      paymentMethods: updatedPaymentMethods,
    });
    
    cardForm.reset();
    setOpen(false);
    
    toast({
      title: "Card added successfully",
      description: `Your card ending in ${lastFour} has been added.`,
    });
  };
  
  const onSubmitDigital = (values: z.infer<typeof digitalFormSchema>) => {
    let newPaymentMethod: PaymentMethod = {
      id: `${values.type}-${Date.now()}`,
      type: values.type,
      isDefault: values.isDefault,
    };
    
    // If setting as default, update all other payment methods
    let updatedPaymentMethods = user.paymentMethods ? [...user.paymentMethods] : [];
    
    if (values.isDefault) {
      updatedPaymentMethods = updatedPaymentMethods.map(p => ({
        ...p,
        isDefault: false,
      }));
    }
    
    updatedPaymentMethods.push(newPaymentMethod);
    
    onSave({
      ...user,
      paymentMethods: updatedPaymentMethods,
    });
    
    digitalForm.reset();
    setOpen(false);
    
    toast({
      title: "Digital payment added",
      description: `Your ${values.type} account has been linked.`,
    });
  };
  
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-gray-500" />;
      case 'paypal':
        return <span className="text-blue-500 font-bold">P</span>;
      case 'applepay':
        return <span className="font-bold">⌘</span>;
      case 'googlepay':
        return <span className="text-primary font-bold">G</span>;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `Card ending in ${method.lastFour}`;
      case 'paypal':
        return 'PayPal';
      case 'applepay':
        return 'Apple Pay';
      case 'googlepay':
        return 'Google Pay';
      default:
        return 'Unknown payment method';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus size={16} />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="card" className="mt-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="digital">Digital Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card">
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(onSubmitCard)} className="space-y-4 mt-4">
                    <FormField
                      control={cardForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name on Card</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={cardForm.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cardForm.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={cardForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Set as default payment method</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Card</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="digital">
                <Form {...digitalForm}>
                  <form onSubmit={digitalForm.handleSubmit(onSubmitDigital)} className="space-y-4 mt-4">
                    <FormField
                      control={digitalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The email associated with your digital payment account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={digitalForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="paypal" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  PayPal
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="applepay" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Apple Pay
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="googlepay" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Google Pay
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={digitalForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Set as default payment method</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Payment Method</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mt-4 space-y-3">
        {(!user.paymentMethods || user.paymentMethods.length === 0) ? (
          <div className="text-center py-6 border rounded-lg">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No payment methods added yet</p>
            <Button variant="link" onClick={() => setOpen(true)} className="mt-2">
              Add your first payment method
            </Button>
          </div>
        ) : (
          user.paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  {getPaymentMethodIcon(method.type)}
                </div>
                <div>
                  <p className="font-medium">{getPaymentMethodName(method)}</p>
                  <p className="text-xs text-gray-500">
                    {method.isDefault && (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={12} className="mr-1" />
                        Default
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeletePaymentMethod(method.id)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodManager;
