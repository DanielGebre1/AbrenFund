import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectForm from '../components/campaign/ProjectForm';
import ChallengeForm from '../components/campaign/ChallengeForm';
import IdentityVerification from '../components/verification/IdentityVerification';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../hooks/useAuthStore';
import { Loader2 } from 'lucide-react';
import { CampaignService } from '../services/api';

const CreateCampaign = () => {
  const [images, setImages] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignType, setCampaignType] = useState('project');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();

  // Check authentication and verification status
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const localVerified = localStorage.getItem('userVerified') === 'true';
        const serverVerified = user?.is_verified || false;
        
        setIsVerified(localVerified || serverVerified);
        
        if (serverVerified && !localVerified) {
          localStorage.setItem('userVerified', 'true');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        toast.error('Failed to verify user status. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [navigate, isLoggedIn, user?.is_verified]);

  // Handle campaign submission
  const onSubmitCampaign = useCallback(
    async (values) => {
      try {
        if (!isVerified) {
          toast.error('Please complete identity verification first');
          return;
        }

        if (images.length === 0 && !values.thumbnailImage) {
          toast.error('Please upload at least one image or a thumbnail.');
          return;
        }

        const formData = new FormData();
        const fieldMappings = {
          shortDescription: 'short_description',
          fullDescription: 'full_description',
          fundingGoal: 'funding_goal',
          endDate: 'end_date',
          fundingType: 'funding_type',
          thumbnailImage: 'thumbnail_image',
          rewardAmount: 'reward_amount',
          submissionDeadline: 'submission_deadline',
          expectedDeliveryDate: 'expected_delivery_date',
          eligibilityCriteria: 'eligibility_criteria',
          projectScope: 'project_scope',
          companyName: 'company_name',
          companyDescription: 'company_description',
          contactEmail: 'contact_email',
        };

        // Process form values
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'thumbnailImage') return; // Handle separately
          
          const backendKey = fieldMappings[key] || key;
          
          if (['endDate', 'submissionDeadline', 'expectedDeliveryDate'].includes(key)) {
            formData.append(backendKey, value ? new Date(value).toISOString() : '');
          } else if (key === 'category') {
            formData.append(backendKey, String(value));
          } else if (['fundingGoal', 'rewardAmount'].includes(key)) {
            formData.append(backendKey, Number(value).toString());
          } else {
            formData.append(backendKey, value || '');
          }
        });

        // Set campaign type
        formData.append('type', campaignType);

        // Handle thumbnail image
        if (values.thumbnailImage instanceof File) {
          formData.append('thumbnail_image', values.thumbnailImage);
        }

        // Handle additional images
        images.forEach((image, index) => {
          if (image.file instanceof File) {
            formData.append(`images[${index}]`, image.file);
          }
        });

        const response = await CampaignService.createCampaign(formData);
        
        toast.success(response.message || 'Campaign submitted for review');
        navigate('/creator-dashboard');
      } catch (error) {
        console.error('Submission failed:', error);
        
        if (error.response) {
          if (error.response.status === 422) {
            const errors = error.response.data?.errors || {};
            Object.entries(errors).forEach(([field, messages]) => {
              const readableField = field.replace(/_/g, ' ').replace(/\[\d+\]/, '');
              messages.forEach(msg => toast.error(`${readableField}: ${msg}`));
            });
          } else if (error.response.status === 403) {
            toast.error('Verification required - please complete identity verification');
            setIsVerified(false);
            localStorage.removeItem('userVerified');
          } else {
            toast.error(error.response.data?.message || 'Failed to submit campaign');
          }
        } else if (error.request) {
          toast.error('No response from server. Please check your connection.');
        } else {
          toast.error(error.message || 'An unexpected error occurred. Please try again.');
        }
      }
    },
    [images, navigate, campaignType, isVerified]
  );

  // Handle image upload with validation
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed');
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        file,
        preview: URL.createObjectURL(file),
      }
    ]);
    toast.success('Image uploaded successfully');
  }, []);

  // Remove image from the list
  const removeImage = useCallback((index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview); // Clean up memory
      newImages.splice(index, 1);
      return newImages;
    });
    toast.success('Image removed successfully');
  }, []);

  // Handle successful verification
  const handleVerificationComplete = useCallback(() => {
    setIsVerified(true);
    localStorage.setItem('userVerified', 'true');
    toast.success('Verification successful! You can now create campaigns.');
  }, []);

  // Loading state
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
          <p className="text-muted-foreground mb-6">Launch your fundraising or challenge campaign</p>

          {!isVerified ? (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    You need to complete identity verification before creating a campaign.
                  </p>
                </div>
              </div>
              <IdentityVerification onVerificationComplete={handleVerificationComplete} />
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setCampaignType('project')}
                  className={`px-4 py-2 rounded-md font-medium border transition-colors ${
                    campaignType === 'project' 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Project Campaign
                </button>
                <button
                  onClick={() => setCampaignType('challenge')}
                  className={`px-4 py-2 rounded-md font-medium border transition-colors ${
                    campaignType === 'challenge' 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Challenge Campaign
                </button>
              </div>

              {campaignType === 'project' ? (
                <ProjectForm
                  onSubmit={onSubmitCampaign}
                  images={images}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                />
              ) : (
                <ChallengeForm
                  onSubmit={onSubmitCampaign}
                  images={images}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;