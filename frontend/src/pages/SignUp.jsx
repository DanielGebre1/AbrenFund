import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuthStore } from "../hooks/useAuthStore";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match."] });
      setIsSubmitting(false);
      return;
    }

    if (!agreeTerms) {
      setErrors({ terms: ["You must agree to the Terms of Service and Privacy Policy."] });
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await register({
        name,
        email,
        password,
      });

      if (success) {
        navigate("/email-verification", { replace: true });
      } else {
        // Handle case where register returns false but doesn't throw
        setErrors({ general: ["Registration failed. Please try again."] });
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: [error.response?.data?.message || "Registration failed."] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <HeartHandshake className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-display font-bold text-primary">AbrenFund</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Sign up to get started with AbrenFund</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <p className="text-xs text-red-600 mb-4">{errors.general[0]}</p>
              )}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters long.
                </p>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword[0]}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  className="mt-1"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80 transition">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 transition">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-600 mt-1">{errors.terms[0]}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Facebook
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;