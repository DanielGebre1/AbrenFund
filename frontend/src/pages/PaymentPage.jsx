import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

// Form schema
const paymentSchema = z.object({
  cardName: z.string().min(2, { message: "Name is required" }),
  cardNumber: z.string().min(16, { message: "Enter a valid card number" }),
  expiryDate: z.string().min(5, { message: "Enter a valid expiry date (MM/YY)" }),
  cvv: z.string().min(3, { message: "Enter a valid CVV" }),
});

const PaymentPage = () => {
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample project data - in a real app, this would be fetched based on ID
  const project = {
    id: id || "1",
    title: "Eco-Friendly Irrigation System",
    imageUrl: "https://images.unsplash.com/photo-1568198473832-b6b0f46328c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    amount: 5000,
  };
  
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      toast({
        title: "Payment successful!",
        description: "Thank you for backing this project.",
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/project/${id}`);
      }, 3000);
    }, 2000);
  };

  const onSubmit = (data) => {
    console.log("Payment data:", data);
    processPayment();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
              
              <div className="grid md:grid-cols-5 gap-8">
                {/* Project Summary */}
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="flex items-start mb-4">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">Project ID: {project.id}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span>Amount</span>
                        <span>{project.amount.toLocaleString()} Birr</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Processing fee</span>
                        <span>0 Birr</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>{project.amount.toLocaleString()} Birr</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Form */}
                <div className="md:col-span-3">
                  <div className="bg-white p-6 rounded-xl shadow-soft">
                    <Tabs defaultValue="card" className="mb-6" onValueChange={setPaymentMethod}>
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="card" className="flex items-center justify-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Card
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="flex items-center justify-center">
                          <Landmark className="w-4 h-4 mr-2" />
                          Bank
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="flex items-center justify-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Mobile Money
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on card</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234 5678 9012 3456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full mt-6" 
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : `Pay ${project.amount.toLocaleString()} Birr`}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="bank">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Make a direct transfer to our bank account. Your funds will be attributed to the project once the transfer is confirmed.
                          </p>
                          
                          <div className="bg-muted/30 p-4 rounded-md">
                            <p className="font-medium mb-2">Bank Account Details</p>
                            <ul className="space-y-2 text-sm">
                              <li><span className="font-medium">Bank:</span> Commercial Bank of Ethiopia</li>
                              <li><span className="font-medium">Account Number:</span> 1000123456789</li>
                              <li><span className="font-medium">Account Name:</span> AbrenFund Ltd</li>
                              <li><span className="font-medium">Reference:</span> PRJ-{project.id}</li>
                            </ul>
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              type="button" 
                              className="w-full" 
                              onClick={processPayment}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "I've Completed My Bank Transfer"}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="mobile">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Make a payment using your mobile money account. We support TeleBirr, Amole, and CBE Birr.
                          </p>
                          
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="border border-muted rounded-md p-3 text-center cursor-pointer hover:border-primary">
                              <img src="https://placeholder.svg" alt="TeleBirr" className="h-12 w-auto mx-auto mb-2" />
                              <p className="text-sm font-medium">TeleBirr</p>
                            </div>
                            <div className="border border-muted rounded-md p-3 text-center cursor-pointer hover:border-primary">
                              <img src="https://placeholder.svg" alt="Amole" className="h-12 w-auto mx-auto mb-2" />
                              <p className="text-sm font-medium">Amole</p>
                            </div>
                            <div className="border border-muted rounded-md p-3 text-center cursor-pointer hover:border-primary">
                              <img src="https://placeholder.svg" alt="CBE Birr" className="h-12 w-auto mx-auto mb-2" />
                              <p className="text-sm font-medium">CBE Birr</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="phone" className="block text-sm font-medium">
                                Phone Number
                              </label>
                              <Input id="phone" placeholder="e.g. 0911234567" />
                            </div>
                          </div>
                          
                          <Button 
                            type="button" 
                            className="w-full mt-4" 
                            onClick={processPayment}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : `Pay ${project.amount.toLocaleString()} Birr`}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-soft text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for backing this project. Your contribution of {project.amount.toLocaleString()} Birr has been received.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to={`/project/${project.id}`}>Return to Project</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/explore">Explore More Projects</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;