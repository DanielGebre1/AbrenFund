
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Upload, FileCheck, Plus, Info, User, Building, FileText, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { VerificationService } from "../../services/api";

const IdentityVerification = ({ onVerificationComplete }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("individual");
  const [documentType, setDocumentType] = useState("national-id");
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState(null);
  const [addressProofFiles, setAddressProofFiles] = useState([]);
  const [addressProofPreviews, setAddressProofPreviews] = useState([]);
  const [companyDocFiles, setCompanyDocFiles] = useState([]);
  const [companyDocPreviews, setCompanyDocPreviews] = useState([]);
  const [businessLicenseFiles, setBusinessLicenseFiles] = useState([]);
  const [businessLicensePreviews, setBusinessLicensePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload PNG, JPG, or PDF files.");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("Files must be less than 5MB.");
      return false;
    }
    return true;
  };

  // Check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setIsLoadingStatus(true);
        const status = await VerificationService.getVerificationStatus();
        setVerificationStatus(status);
        if (status?.status === "approved") {
          localStorage.setItem('userVerified', 'true');
          if (onVerificationComplete) {
            onVerificationComplete();
          } else {
            navigate("/create-campaign");
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
        toast.error("Failed to check verification status.");
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkVerificationStatus();
    const intervalId = verificationStatus?.status === "pending" ? 
      setInterval(checkVerificationStatus, 30000) : null;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [verificationStatus?.status, navigate, onVerificationComplete]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      if (idFrontPreview) URL.revokeObjectURL(idFrontPreview);
      if (idBackPreview) URL.revokeObjectURL(idBackPreview);
      addressProofPreviews.forEach(preview => preview && URL.revokeObjectURL(preview));
      companyDocPreviews.forEach(preview => preview && URL.revokeObjectURL(preview));
      businessLicensePreviews.forEach(preview => preview && URL.revokeObjectURL(preview));
    };
  }, [idFrontPreview, idBackPreview, addressProofPreviews, companyDocPreviews, businessLicensePreviews]);

  const handleSingleFileUpload = (e, setFile, setPreview) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFile(file);
        if (file.type.startsWith('image/')) {
          const previewUrl = URL.createObjectURL(file);
          console.log(`Generated preview for ${file.name}: ${previewUrl}`);
          setPreview(previewUrl);
        } else {
          console.log(`No preview for ${file.name} (non-image)`);
          setPreview(null);
        }
      }
    }
  };

  const handleMultipleFileUpload = (e, setFiles, setPreviews, currentFiles, currentPreviews) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(validateFile);
      if (newFiles.length > 0) {
        const newPreviews = newFiles.map(file => {
          if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            console.log(`Generated preview for ${file.name}: ${previewUrl}`);
            return previewUrl;
          }
          console.log(`No preview for ${file.name} (non-image)`);
          return null;
        });
        setFiles([...currentFiles, ...newFiles]);
        setPreviews([...currentPreviews, ...newPreviews]);
      }
    }
  };

  const removeFile = (index, files, setFiles, previews, setPreviews) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    if (newPreviews[index]) {
      console.log(`Revoking preview URL: ${newPreviews[index]}`);
      URL.revokeObjectURL(newPreviews[index]);
    }
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("type", activeTab);
    
    if (activeTab === "individual") {
      formData.append("document_type", documentType);
      if (idFrontFile) formData.append("id_front", idFrontFile);
      if (idBackFile) formData.append("id_back", idBackFile);
      addressProofFiles.forEach((file, index) => {
        formData.append(`address_proofs[${index}]`, file);
      });
    } else {
      companyDocFiles.forEach((file, index) => {
        formData.append(`company_docs[${index}]`, file);
      });
      businessLicenseFiles.forEach((file, index) => {
        formData.append(`business_licenses[${index}]`, file);
      });
    }

    // Debug FormData
    console.log("Submitting FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await VerificationService.submitVerification(formData);
      setVerificationStatus({ status: "pending" });
      toast.success("Verification submitted successfully");
    } catch (error) {
      console.error("Verification submission error:", error);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(err => toast.error(err[0]));
      } else {
        toast.error(error.response?.data?.message || "Error submitting documents.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentTypeIcon = () => {
    switch (documentType) {
      case "passport": return <FileText className="h-4 w-4" />;
      case "drivers-license": return <CreditCard className="h-4 w-4" />;
      case "national-id": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case "passport": return "Passport";
      case "drivers-license": return "Driver's License";
      case "national-id": return "National ID Card";
      default: return "ID Document";
    }
  };

  const individualComplete = idFrontFile && idBackFile && addressProofFiles.length > 0;
  const companyComplete = companyDocFiles.length > 0 && businessLicenseFiles.length > 0;
  const isComplete = activeTab === "individual" ? individualComplete : companyComplete;

  const renderStatusAlert = () => {
    if (isLoadingStatus) {
      return (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>Loading verification status...</AlertDescription>
        </Alert>
      );
    }
    if (isSubmitting) {
      return (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>Submitting your verification documents...</AlertDescription>
        </Alert>
      );
    }
    if (verificationStatus?.status === "pending") {
      return (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>Your verification is under review. This may take up to 24 hours.</AlertDescription>
        </Alert>
      );
    }
    if (verificationStatus?.status === "rejected") {
      return (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {verificationStatus.rejection_reason || "Your verification was rejected. Please resubmit."}
          </AlertDescription>
        </Alert>
      );
    }
    if (verificationStatus?.status === "error") {
      return (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {verificationStatus.message || "An error occurred during verification."}
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  if (isLoadingStatus) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>Loading verification status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus?.status === "approved") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>Your identity verification has been approved</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <Info className="h-4 w-4" />
            <AlertDescription>Your verification is complete. You can now create campaigns.</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => {
              localStorage.setItem('userVerified', 'true');
              if (onVerificationComplete) {
                onVerificationComplete();
              } else {
                navigate("/create-campaign");
              }
            }}>
              Continue to Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus?.status === "pending") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>Your verification is currently under review</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStatusAlert()}
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                We're reviewing your submitted documents. You'll receive a notification once complete.
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>Verification is required before creating campaigns or challenges</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatusAlert()}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual Verification
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Upload clear, unaltered photos or scans of the required documents.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ID Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="national-id">National ID Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="government-id-front">{getDocumentTypeLabel()} (Front)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload the front side of your {getDocumentTypeLabel().toLowerCase()}
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    {idFrontFile ? (
                      <div className="flex flex-col items-center w-full">
                        <FileCheck className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium">{idFrontFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(idFrontFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {idFrontPreview && (
                          <img
                            src={idFrontPreview}
                            alt="ID Front Preview"
                            className="mt-2 max-h-32 w-auto rounded-md object-contain"
                            onError={(e) => {
                              console.error(`Failed to load preview for ${idFrontFile.name}`);
                              toast.error("Failed to load image preview.");
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            if (idFrontPreview) URL.revokeObjectURL(idFrontPreview);
                            setIdFrontFile(null);
                            setIdFrontPreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium mb-1">Click to upload front side</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 5MB)</p>
                        <input
                          id="government-id-front"
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          onChange={(e) => handleSingleFileUpload(e, setIdFrontFile, setIdFrontPreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="government-id-back">{getDocumentTypeLabel()} (Back)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload the back side of your {getDocumentTypeLabel().toLowerCase()}
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    {idBackFile ? (
                      <div className="flex flex-col items-center w-full">
                        <FileCheck className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium">{idBackFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(idBackFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {idBackPreview && (
                          <img
                            src={idBackPreview}
                            alt="ID Back Preview"
                            className="mt-2 max-h-32 w-auto rounded-md object-contain"
                            onError={(e) => {
                              console.error(`Failed to load preview for ${idBackFile.name}`);
                              toast.error("Failed to load image preview.");
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            if (idBackPreview) URL.revokeObjectURL(idBackPreview);
                            setIdBackFile(null);
                            setIdBackPreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium mb-1">Click to upload back side</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 5MB)</p>
                        <input
                          id="government-id-back"
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          onChange={(e) => handleSingleFileUpload(e, setIdBackFile, setIdBackPreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-proof">Address Verification</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload utility bills or bank statements (multiple files allowed)
                  </p>
                  {addressProofFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {addressProofFiles.map((file, index) => (
                        <div key={index} className="flex flex-col items-start p-2 border rounded-md">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, addressProofFiles, setAddressProofFiles, addressProofPreviews, setAddressProofPreviews)}
                            >
                              Remove
                            </Button>
                          </div>
                          {addressProofPreviews[index] && (
                            <img
                              src={addressProofPreviews[index]}
                              alt={`Address Proof ${index + 1} Preview`}
                              className="mt-2 max-h-32 w-auto rounded-md object-contain"
                              onError={(e) => {
                                console.error(`Failed to load preview for ${file.name}`);
                                toast.error("Failed to load image preview.");
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium mb-1">Click to upload</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 5MB)</p>
                      <input
                        id="address-proof"
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        multiple
                        onChange={(e) => handleMultipleFileUpload(e, setAddressProofFiles, setAddressProofPreviews, addressProofFiles, addressProofPreviews)}
                      />
                    </label>
                  </div>
                  {addressProofFiles.length > 0 && (
                    <div className="mt-2 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => document.getElementById("address-proof")?.click()}
                      >
                        <Plus className="h-4 w-4" /> Add another file
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!individualComplete || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="company">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Upload official company documents for verification.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-doc">Company Registration Documents</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Certificate of incorporation or equivalent (multiple files allowed)
                  </p>
                  {companyDocFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {companyDocFiles.map((file, index) => (
                        <div key={index} className="flex flex-col items-start p-2 border rounded-md">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, companyDocFiles, setCompanyDocFiles, companyDocPreviews, setCompanyDocPreviews)}
                            >
                              Remove
                            </Button>
                          </div>
                          {companyDocPreviews[index] && (
                            <img
                              src={companyDocPreviews[index]}
                              alt={`Company Doc ${index + 1} Preview`}
                              className="mt-2 max-h-32 w-auto rounded-md object-contain"
                              onError={(e) => {
                                console.error(`Failed to load preview for ${file.name}`);
                                toast.error("Failed to load image preview.");
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium mb-1">Click to upload</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 5MB)</p>
                      <input
                        id="company-doc"
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        multiple
                        onChange={(e) => handleMultipleFileUpload(e, setCompanyDocFiles, setCompanyDocPreviews, companyDocFiles, companyDocPreviews)}
                      />
                    </label>
                  </div>
                  {companyDocFiles.length > 0 && (
                    <div className="mt-2 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => document.getElementById("company-doc")?.click()}
                      >
                        <Plus className="h-4 w-4" /> Add another file
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-license">Business Licenses</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Valid business licenses or permits (multiple files allowed)
                  </p>
                  {businessLicenseFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {businessLicenseFiles.map((file, index) => (
                        <div key={index} className="flex flex-col items-start p-2 border rounded-md">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, businessLicenseFiles, setBusinessLicenseFiles, businessLicensePreviews, setBusinessLicensePreviews)}
                            >
                              Remove
                            </Button>
                          </div>
                          {businessLicensePreviews[index] && (
                            <img
                              src={businessLicensePreviews[index]}
                              alt={`Business License ${index + 1} Preview`}
                              className="mt-2 max-h-32 w-auto rounded-md object-contain"
                              onError={(e) => {
                                console.error(`Failed to load preview for ${file.name}`);
                                toast.error("Failed to load image preview.");
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium mb-1">Click to upload</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 5MB)</p>
                      <input
                        id="business-license"
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        multiple
                        onChange={(e) => handleMultipleFileUpload(e, setBusinessLicenseFiles, setBusinessLicensePreviews, businessLicenseFiles, businessLicensePreviews)}
                      />
                    </label>
                  </div>
                  {businessLicenseFiles.length > 0 && (
                    <div className="mt-2 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => document.getElementById("business-license")?.click()}
                      >
                        <Plus className="h-4 w-4" /> Add another file
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!companyComplete || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IdentityVerification;