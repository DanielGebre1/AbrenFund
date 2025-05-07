import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectForm from '../components/campaign/ProjectForm';
import IdentityVerification from '../components/verification/IdentityVerification';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../hooks/useAuthStore';
import { Loader2 } from 'lucide-react';
import { CampaignService } from '../services/api'; // ✅ Added service import

const CreateCampaign = () => {
  const [images, setImages] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const checkVerification = async () => {
      try {
        const hasVerification = localStorage.getItem('userVerified') === 'true';
        setIsVerified(hasVerification);
      } catch (error) {
        console.error('Verification check failed:', error);
        toast.error('Failed to verify user status');
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [navigate, isLoggedIn]);

  const onSubmitProject = useCallback(async (values) => {
    try {
      if (images.length === 0) {
        toast.error('Please upload at least one image.');
        return;
      }

      const payload = {
        ...values,
        images, // base64 images
      };

      await CampaignService.createCampaign(payload);
      toast.success('Project campaign submitted for review');
      navigate('/creator-dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).flat().forEach(msg => toast.error(msg));
      } else {
        toast.error('Failed to submit campaign. Please try again.');
      }
    }
  }, [images, navigate]);

  const handleImageUpload = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result.toString()]);
          toast.success('Image uploaded successfully');
        }
      };
      reader.onerror = () => {
        toast.error('Failed to upload image');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed successfully');
  }, []);

  const handleVerificationComplete = useCallback(() => {
    try {
      localStorage.setItem('userVerified', 'true');
      setIsVerified(true);
      toast.success('Verification successful! You can now create campaigns.');
    } catch (error) {
      console.error('Verification completion failed:', error);
      toast.error('Failed to complete verification');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground mb-8">Launch your fundraising campaign</p>

          {!isVerified ? (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    You need to complete identity verification before creating a campaign.
                  </p>
                </div>
              </div>
              <IdentityVerification onVerificationComplete={handleVerificationComplete} />
            </div>
          ) : (
            <ProjectForm
              onSubmit={onSubmitProject}
              images={images}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
