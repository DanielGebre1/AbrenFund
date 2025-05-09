import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminVerificationService } from "../../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  AlertCircle,
  Check,
  X,
  FileText,
  User,
  Building,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import { Skeleton } from "../../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import VerificationDetailsDialog from "./VerificationDetailsDialog";

const AdminVerifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");

  const { data: verifications, isLoading } = useQuery({
    queryKey: ["admin-verifications", page, status],
    queryFn: async () => {
      const response = await AdminVerificationService.getVerifications(page, status);
      return response;
    },
  });

  const updateVerification = useMutation({
    mutationFn: async ({ id, action, reason }) => {
      if (action === "approve") {
        return await AdminVerificationService.approveVerification(id);
      } else {
        return await AdminVerificationService.rejectVerification(id, reason);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-verifications"]);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update verification",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id) => {
    updateVerification.mutate({ id, action: "approve" });
  };

  const handleReject = (id, reason) => {
    updateVerification.mutate({ id, action: "reject", reason });
  };

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Identity Verifications</h2>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications?.data?.length > 0 ? (
              verifications.data.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell className="font-medium">
                    {verification.user.name}
                    <p className="text-sm text-muted-foreground">
                      {verification.user.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getTypeIcon(verification.type)}
                      {verification.type === "individual"
                        ? "Individual"
                        : "Company"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {verification.document_type || "Company Documents"}
                  </TableCell>
                  <TableCell>
                    {new Date(verification.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(verification.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVerification(verification);
                          setIsDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      {verification.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(verification.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No verification requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {verifications?.meta?.last_page > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span>
            Page {verifications?.meta?.current_page} of {verifications?.meta?.last_page}
          </span>
          <Button
            variant="outline"
            disabled={page === verifications?.meta?.last_page}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      <VerificationDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        verification={selectedVerification}
        onApprove={handleApprove}
        onReject={handleReject}
        isSubmitting={updateVerification.isLoading}
      />
    </div>
  );
};

export default AdminVerifications;