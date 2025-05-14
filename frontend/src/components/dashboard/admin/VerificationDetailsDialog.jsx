import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Import DialogDescription from Radix UI
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

  // Helper function to ensure data is an array
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data === null || data === undefined) return [];
    return [data]; // Convert single item to array
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verification Details</DialogTitle>
          <DialogDescription>
            View and manage user verification details, including documents and status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                  {verification.type === "individual"
                    ? "Individual"
                    : "Company"}
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
                {format(new Date(verification.created_at), "MMM dd, yyyy")}
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
                  {verification.document_type || "N/A"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    ID Front
                  </h3>
                  <div className="border rounded-md p-4">
                    <img
                      src={`/storage/${verification.id_front_path}`}
                      alt="ID Front"
                      className="max-h-60 mx-auto"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    ID Back
                  </h3>
                  <div className="border rounded-md p-4">
                    <img
                      src={`/storage/${verification.id_back_path}`}
                      alt="ID Back"
                      className="max-h-60 mx-auto"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Address Proofs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ensureArray(verification.address_proofs).length > 0 ? (
                      ensureArray(verification.address_proofs).map(
                        (proof, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <img
                              src={`/storage/${proof}`}
                              alt={`Address Proof ${index + 1}`}
                              className="max-h-60 mx-auto"
                            />
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
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Company Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ensureArray(verification.company_docs).length > 0 ? (
                      ensureArray(verification.company_docs).map(
                        (doc, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <img
                              src={`/storage/${doc}`}
                              alt={`Company Doc ${index + 1}`}
                              className="max-h-60 mx-auto"
                            />
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
                    {ensureArray(verification.business_licenses).length > 0 ? (
                      ensureArray(verification.business_licenses).map(
                        (license, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <img
                              src={`/storage/${license}`}
                              alt={`Business License ${index + 1}`}
                              className="max-h-60 mx-auto"
                            />
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
            </>
          )}

          {verification.status === "pending" && (
            <div className="flex justify-end gap-2 pt-4">
              {showRejectForm && (
                <div className="flex-1 space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
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
                disabled={isSubmitting || (showRejectForm && !rejectionReason)}
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

          {verification.status === "rejected" && verification.rejection_reason && (
            <div className="	bg-red-50 p-4 rounded-md">
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
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDetailsDialog;