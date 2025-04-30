// src/pages/EmailVerifyCallback.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

export default function EmailVerifyCallback() {
  const [status, setStatus] = useState("idle"); // idle | verifying | success | already | error
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== "idle") return;

    const statusParam = searchParams.get("status");

    if (statusParam === "verified") {
      setStatus("success");
      toast.success("Email successfully verified!");
      return;
    }

    if (statusParam === "already_verified") {
      setStatus("already");
      toast.info("Your email is already verified.");
      return;
    }

    toast.error("Invalid or expired verification link.");
    setStatus("error");
  }, [status, searchParams]);

  const renderContent = () => {
    if (status === "idle" || status === "verifying") {
      return <p>Verifying your email…</p>;
    }
    if (status === "success") {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
          <p className="mb-6">Thanks for confirming your address.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      );
    }
    if (status === "already") {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Already Verified</h1>
          <p className="mb-6">Your email was already verified. You can log in now.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      );
    }
    // status === "error"
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
        <p className="mb-6">
          The link may have expired or is invalid. Try requesting a new one.
        </p>
        <Button onClick={() => navigate("/email-verification")}>
          Resend Verification
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">{renderContent()}</div>
      </main>
      <Footer />
    </div>
  );
}
