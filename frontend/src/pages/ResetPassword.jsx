import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { HeartHandshake } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import Header from "../components/Header";
import { AuthService } from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null); // null = loading, true/false = loaded
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const { toast } = useToast();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await AuthService.verifyResetToken(token, email);
        setIsTokenValid(response.valid);
        
        if (!response.valid) {
          toast({
            title: "Invalid reset link",
            description: response.message || "The password reset link is invalid or has expired.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setIsTokenValid(false);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to verify reset token",
          variant: "destructive",
        });
      }
    };

    verifyToken();
  }, [token, email, toast]);

  useEffect(() => {
    // Validate password requirements in real-time
    const requirements = {
      length: formData.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(formData.newPassword),
      lowercase: /[a-z]/.test(formData.newPassword),
      number: /[0-9]/.test(formData.newPassword),
      specialChar: /[^A-Za-z0-9]/.test(formData.newPassword)
    };
    setPasswordRequirements(requirements);
  }, [formData.newPassword]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Check if all password requirements are met
    if (!Object.values(passwordRequirements).every(Boolean)) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all the requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await AuthService.resetPassword({
        token,
        email,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword
      });
      
      // Navigate to success page with state
      navigate("/reset-password/success", { 
        state: { email },
        replace: true 
      });
    } catch (error) {
      let errorMessage = "Failed to reset password";
      
      if (error.response) {
        if (error.response.data.errors?.password) {
          errorMessage = error.response.data.errors.password[0];
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while verifying token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg 
                  className="animate-spin h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg">Verifying reset link</h3>
              <p className="text-muted-foreground mt-2">
                Please wait while we verify your password reset link...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!token || !email || !isTokenValid) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Invalid reset link</h3>
              <p className="text-muted-foreground mt-2">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/forgot-password">Request new link</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity"
            >
              <HeartHandshake className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-display font-bold text-primary">AbrenFund</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
            <p className="text-muted-foreground">
              Create a new password for your account
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full"
                  disabled={isSubmitting}
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <PasswordRequirement 
                    met={passwordRequirements.length} 
                    text="At least 8 characters" 
                  />
                  <PasswordRequirement 
                    met={passwordRequirements.uppercase} 
                    text="Uppercase letter" 
                  />
                  <PasswordRequirement 
                    met={passwordRequirements.lowercase} 
                    text="Lowercase letter" 
                  />
                  <PasswordRequirement 
                    met={passwordRequirements.number} 
                    text="Number" 
                  />
                  <PasswordRequirement 
                    met={passwordRequirements.specialChar} 
                    text="Special character" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !Object.values(passwordRequirements).every(Boolean)}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center space-x-2">
    <span className={`inline-block w-3 h-3 rounded-full ${met ? 'bg-green-500' : 'bg-gray-300'}`}></span>
    <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>{text}</span>
  </div>
);

const ResetPasswordSuccess = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity"
            >
              <HeartHandshake className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-display font-bold text-primary">AbrenFund</span>
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-soft text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Password updated successfully</h3>
            <p className="text-muted-foreground mt-2">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <Button asChild className="w-full mt-6">
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ResetPassword, ResetPasswordSuccess };