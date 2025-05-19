import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  User,
  Building,
  FileText,
  Check,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "../../ui/textarea";
import { useState } from "react";
import { Label } from "../../ui/label";

const VerificationDetailsDialog = ({
  open,
  onOpenChange,
  verification,
  onApprove,
  onReject,
  isSubmitting,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!verification) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    return type === "individual" ? (
      <User className="h-4 w-4 mr-2" />
    ) : (
      <Building className="h-4 w-4 mr-2" />
    );
  };

  const handleRejectClick = () => {
    if (!showRejectForm) {
      setShowRejectForm(true);
    } else {
      onReject(verification.id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason("");
    }
  };

  // Helper function to determine file type
  const isImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };

  // Helper function to get file URL
  const getFileUrl = (path) => {
    if (!path) return null;
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }
    
    // For local storage paths
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseURL}/storage/${path.replace('public/', '')}`;
  };

  // Helper function to render a file (image or PDF link)
  const renderFile = (path, alt, index) => {
    const fileUrl = getFileUrl(path);
    
    if (!fileUrl) {
      console.log(`No valid path for ${alt}: ${path}`);
      return (
        <p className="text-sm text-muted-foreground">
          No file provided
        </p>
      );
    }

    if (isImage(fileUrl)) {
      return (
        <div className="relative">
          <img
            src={fileUrl}
            alt={alt}
            className="max-w-full h-auto rounded-md border"
            style={{ maxHeight: "200px", objectFit: "contain" }}
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load image: ${fileUrl}`);
              e.target.style.display = 'none';
              // Show fallback text if image fails to load
              const fallback = document.createElement('p');
              fallback.className = 'text-sm text-muted-foreground';
              fallback.textContent = 'Failed to load image';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
      );
    }

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center"
      >
        <FileText className="h-4 w-4 mr-1" />
        View Document {index + 1}
      </a>
    );
  };

  // Helper function to ensure data is an array
  const ensureArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [data];
      }
    }
    return [data];
  };

  // Prepare document URLs
  const prepareDocuments = () => {
    if (!verification) return {};
    
    return {
      idFrontUrl: verification.id_front_path,
      idBackUrl: verification.id_back_path,
      addressProofUrls: ensureArray(verification.address_proofs),
      companyDocsUrls: ensureArray(verification.company_docs),
      businessLicensesUrls: ensureArray(verification.business_licenses),
    };
  };

  const documents = prepareDocuments();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[80vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle>Verification Details</DialogTitle>
          <DialogDescription>
            View and manage user verification details, including documents and status.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                User
              </h3>
              <p className="text-sm font-medium">
                {verification.user?.name || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {verification.user?.email || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Verification Type
              </h3>
              <div className="flex items-center">
                {getTypeIcon(verification.type)}
                <p className="text-sm font-medium">
                  {verification.type === "individual" ? "Individual" : "Company"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              {getStatusBadge(verification.status)}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Submitted On
              </h3>
              <p className="text-sm font-medium">
                {verification.created_at
                  ? format(new Date(verification.created_at), "MMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          {verification.type === "individual" && (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Document Type
                </h3>
                <p className="text-sm font-medium">
                  {verification.document_type
                    ? verification.document_type.replace("-", " ").toUpperCase()
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    ID Front
                  </h3>
                  <div className="border rounded-md p-4">
                    {renderFile(documents.idFrontUrl, "ID Front", 0)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    ID Back
                  </h3>
                  <div className="border rounded-md p-4">
                    {renderFile(documents.idBackUrl, "ID Back", 0)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Address Proofs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {documents.addressProofUrls.length > 0 ? (
                      documents.addressProofUrls.map(
                        (url, index) => (
                          <div key={index} className="border rounded-md p-4">
                            {renderFile(url, `Address Proof ${index + 1}`, index)}
                            <p className="text-sm text-muted-foreground mt-2">
                              Address Proof {index + 1}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No address proofs provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {verification.type === "company" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Company Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {documents.companyDocsUrls.length > 0 ? (
                    documents.companyDocsUrls.map(
                      (url, index) => (
                        <div key={index} className="border rounded-md p-4">
                          {renderFile(url, `Company Doc ${index + 1}`, index)}
                          <p className="text-sm text-muted-foreground mt-2">
                            Company Document {index + 1}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No company documents provided
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Business Licenses
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {documents.businessLicensesUrls.length > 0 ? (
                    documents.businessLicensesUrls.map(
                      (url, index) => (
                        <div key={index} className="border rounded-md p-4">
                          {renderFile(url, `Business License ${index + 1}`, index)}
                          <p className="text-sm text-muted-foreground mt-2">
                            Business License {index + 1}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No business licenses provided
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {verification.status === "rejected" &&
            verification.rejection_reason && (
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      Rejection Reason
                    </h4>
                    <p className="text-sm text-red-700">
                      {verification.rejection_reason}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        {verification.status === "pending" && (
          <div className="shrink-0 px-6 py-4 border-t flex justify-end gap-2">
            {showRejectForm && (
              <div className="flex-1 space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection (min 10 characters)..."
                  rows={4}
                />
              </div>
            )}

            {!showRejectForm && (
              <Button
                variant="outline"
                onClick={() => onApprove(verification.id)}
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}

            <Button
              variant={showRejectForm ? "default" : "destructive"}
              onClick={handleRejectClick}
              disabled={
                isSubmitting || (showRejectForm && rejectionReason.length < 10)
              }
            >
              <X className="h-4 w-4 mr-2" />
              {showRejectForm ? "Submit Rejection" : "Reject"}
            </Button>

            {showRejectForm && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDetailsDialog;