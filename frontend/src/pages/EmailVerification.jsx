import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MailCheck, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuthStore } from "../hooks/useAuthStore"; // Assuming you have the useAuthStore hook

function EmailVerification() {
  const { user, token } = useAuthStore();  // Getting user and token from store
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get the email from localStorage (stored during sign up)
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Set up countdown for resending verification
    let timer;
    if (!canResend) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [canResend]);

  async function handleResendVerification() {
    if (isResending || !canResend) return;

    setIsResending(true);
    
    try {
      const response = await api.post('/api/email/verification-notification', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.message === "Verification link sent!") {
        toast.success('Verification email has been sent!');
        setCanResend(false);  // Disable resend option
        setCountdown(60);  // Reset the countdown
      } else {
        toast.error('Failed to resend verification email');
      }
    } catch (error) {
      toast.error('An error occurred while resending the email');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
            <p className="text-muted-foreground">
              We've sent a verification link to{" "}
              <span className="font-medium text-foreground">{email || "your email"}</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft mb-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-medium">What's next?</h2>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <p>Check your email for the verification link</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <p>Click the link to verify your account</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <p>Return to AbrenFund to start exploring projects</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Didn't receive the email? Check your spam folder or request a new verification link.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleResendVerification}
                  disabled={isResending || !canResend}
                >
                  {isResending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {isResending 
                    ? "Sending..." 
                    : canResend 
                      ? "Resend verification email" 
                      : `Resend in ${countdown}s`}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:text-primary/80 inline-flex items-center">
                <ArrowRight className="h-4 w-4 mr-1" />
                Return to Home
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EmailVerification;
