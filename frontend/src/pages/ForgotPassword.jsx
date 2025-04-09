import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Leaf } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, a password reset link has been sent.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Leaf className="h-8 w-8 text-primary mr-2" />
            <span className="text-3xl font-display font-bold text-primary">AbrenFund</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-soft">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Check your email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Didn't receive the email? Check your spam folder or 
                <button 
                  type="button" 
                  className="text-primary hover:text-primary/80 transition ml-1"
                  onClick={() => setIsSuccess(false)}
                >
                  try again
                </button>
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;