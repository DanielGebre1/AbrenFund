import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "react-toastify";
import { ModeratorCampaignService } from "../../../services/api";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Info,
  ArrowUpRight,
  Calendar,
  DollarSign,
  User,
  Tag,
  Clock,
  Award,
  Shield,
  FileIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const ModeratorChallenges = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [decision, setDecision] = useState("");
  const [feedback, setFeedback] = useState("");
  const [contentNotes, setContentNotes] = useState("");
  const [contentChecks, setContentChecks] = useState({
    description: false,
    appropriate: false,
    goals: false,
    budget: false,
    scope: false
  });
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [searchTerm, statusFilter]);

  const fetchChallenges = async () => {
    try {
      const params = {
        type: "challenge",
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
      };
      console.log("Fetching challenges with params:", params); // Log params
      const response = await ModeratorCampaignService.getCampaigns(params);
      console.log("Challenges response:", response.data); // Log response
      const fetchedChallenges = response.data.data;
      if (!fetchedChallenges.every(challenge => challenge.type === 'challenge')) {
        console.warn("Non-challenge campaigns detected in response:", fetchedChallenges);
      }
      setChallenges(fetchedChallenges);
    } catch (error) {
      toast.error("Failed to fetch challenges. Please try again.");
      console.error("Failed to fetch challenges:", error);
    }
  };

  const openReviewDialog = async (challenge) => {
    try {
      setIsLoadingDetails(true);
      const response = await ModeratorCampaignService.getCampaignDetails(challenge.id);
      const challengeData = response.data;
      console.log("Challenge details:", challengeData); // Log details
      if (challengeData.type !== 'challenge') {
        console.warn("Fetched campaign is not a challenge:", challengeData);
      }
      setSelectedChallenge(challengeData);
      setFeedback(challengeData.feedback || "");
      setContentNotes(challengeData.content_notes || "");
      setContentChecks(
        challengeData.content_checks || {
          description: false,
          appropriate: false,
          goals: false,
          budget: false,
          scope: false
        }
      );
      setCurrentMediaIndex(0);
      setDecision("");
      setIsReviewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch challenge details. Please try again.");
      console.error("Failed to fetch challenge details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!decision) {
      toast.error("Please select a decision before submitting.");
      return;
    }

    if (["rejected", "changes"].includes(decision) && !feedback.trim()) {
      toast.error("Please provide feedback when rejecting or requesting changes.");
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData = {
        decision,
        feedback: feedback.trim() || null,
        content_notes: contentNotes.trim() || null,
        content_checks: contentChecks
      };

      console.log("Submitting review data:", reviewData); // Log data for debugging

      await ModeratorCampaignService.reviewCampaign(selectedChallenge.id, reviewData);
      toast.success(`Challenge ${decision} successfully`);
      setIsReviewDialogOpen(false);
      setDecision("");
      setFeedback("");
      setContentNotes("");
      setContentChecks({
        description: false,
        appropriate: false,
        goals: false,
        budget: false,
        scope: false
      });
      fetchChallenges();
    } catch (error) {
      let message = "Failed to submit review. Please try again.";
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(" ");
        console.error("Validation errors:", errors);
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (checkName) => {
    setContentChecks((prev) => ({
      ...prev,
      [checkName]: !prev[checkName]
    }));
  };

  const handleCreateChallenge = async () => {
    // Placeholder for creating a challenge (to be implemented with API)
    toast.success("Challenge created successfully");
    setIsCreateDialogOpen(false);
    fetchChallenges();
  };

  const handleViewProfile = () => {
    if (selectedChallenge?.user?.id) {
      navigate(`/profile/${selectedChallenge.user.id}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMediaPreview = () => {
    if (!selectedChallenge?.images?.length && !selectedChallenge?.thumbnail_url) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No media available</p>
        </div>
      );
    }

    const mediaItems = [
      ...(selectedChallenge.thumbnail_url ? [{ url: selectedChallenge.thumbnail_url, type: 'image' }] : []),
      ...(selectedChallenge.images?.map(img => ({ url: img.url, type: 'image' })) || [])
    ];

    if (mediaItems.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No media available</p>
        </div>
      );
    }

    const currentMedia = mediaItems[currentMediaIndex];

    return (
      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt="Challenge media"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FileIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={() => setCurrentMediaIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentMediaIndex(prev => (prev + 1) % mediaItems.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {mediaItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`h-2 w-2 rounded-full ${index === currentMediaIndex ? 'bg-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDetailItem = (icon, label, value, className = "", onClick) => {
    return (
      <div 
        className={`flex items-start gap-3 ${className} ${onClick ? 'cursor-pointer hover:text-primary' : ''}`}
        onClick={onClick}
      >
        <div className="mt-0.5 text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value || 'Not specified'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Company Challenges</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Challenge</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
              <DialogDescription>
                Set up a new company funding challenge for creators
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="challenge-title">Challenge Title</Label>
                <Input id="challenge-title" placeholder="Enter challenge title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-company">Company Name</Label>
                <Input id="challenge-company" placeholder="Company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge-budget">Budget</Label>
                  <Input id="challenge-budget" placeholder="e.g. $50,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenge-deadline">Deadline</Label>
                  <Input id="challenge-deadline" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-description">Challenge Description</Label>
                <Textarea
                  id="challenge-description"
                  placeholder="Describe the challenge, goals, and requirements"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-scope">Project Scope</Label>
                <Textarea
                  id="challenge-scope"
                  placeholder="Define what types of projects can be submitted"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChallenge}>Create Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search challenges..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Under Review</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proposals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No challenges found.
                  </TableCell>
                </TableRow>
              ) : (
                challenges.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell className="font-medium">{challenge.title || 'N/A'}</TableCell>
                    <TableCell>{challenge.company_name || 'N/A'}</TableCell>
                    <TableCell>${challenge.reward_amount?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>{formatDate(challenge.submission_deadline)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          challenge.status === "active"
                            ? "bg-green-100 text-green-800"
                            : challenge.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : challenge.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{challenge.submissions_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(challenge)}
                        >
                          Review
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/campaigns/${challenge.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Challenge
            </DialogTitle>
            <DialogDescription>
              {selectedChallenge
                ? `${selectedChallenge.title || 'N/A'} by ${selectedChallenge.company_name || 'N/A'}`
                : "Challenge"}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Challenge Details</TabsTrigger>
                <TabsTrigger value="content">Content Review</TabsTrigger>
                <TabsTrigger value="decision">Decision</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Media</Label>
                  {renderMediaPreview()}
                  <p className="text-xs text-muted-foreground">
                    {selectedChallenge?.images?.length || 0} additional media files
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Basic Information
                    </h3>
                    {renderDetailItem(
                      <Tag className="h-4 w-4" />,
                      "Category",
                      selectedChallenge?.category
                    )}
                    {renderDetailItem(
                      <DollarSign className="h-4 w-4" />,
                      "Reward Amount",
                      selectedChallenge?.reward_amount ? `$${selectedChallenge.reward_amount.toLocaleString()}` : null
                    )}
                    {renderDetailItem(
                      <Calendar className="h-4 w-4" />,
                      "Created Date",
                      formatDate(selectedChallenge?.created_at)
                    )}
                    {renderDetailItem(
                      <User className="h-4 w-4" />,
                      "Creator",
                      selectedChallenge?.user?.name,
                      "",
                      handleViewProfile
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Challenge Specifications
                    </h3>
                    {renderDetailItem(
                      <Clock className="h-4 w-4" />,
                      "Submission Deadline",
                      formatDate(selectedChallenge?.submission_deadline)
                    )}
                    {renderDetailItem(
                      <Calendar className="h-4 w-4" />,
                      "Expected Delivery",
                      formatDate(selectedChallenge?.expected_delivery_date)
                    )}
                    {renderDetailItem(
                      <Award className="h-4 w-4" />,
                      "Proposals",
                      selectedChallenge?.submissions_count || 0
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </h3>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <p className="text-sm">
                        {selectedChallenge?.short_description || "No short description provided"}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Full Description</Label>
                      <p className="text-sm whitespace-pre-line">
                        {selectedChallenge?.full_description || "No full description provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Challenge Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Eligibility Criteria</Label>
                      <p className="text-sm whitespace-pre-line">
                        {selectedChallenge?.eligibility_criteria || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Project Scope</Label>
                      <p className="text-sm whitespace-pre-line">
                        {selectedChallenge?.project_scope || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <p className="text-sm">
                        {selectedChallenge?.company_name || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <p className="text-sm">
                        {selectedChallenge?.contact_email || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Description</Label>
                      <p className="text-sm whitespace-pre-line">
                        {selectedChallenge?.company_description || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="border rounded-lg p-4">
                  <Label>Content Requirements Checklist</Label>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="description-check"
                        checked={contentChecks.description}
                        onChange={() => handleCheckboxChange("description")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="description-check" className="ml-2 text-sm">
                        Clear and complete challenge description
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="appropriate-check"
                        checked={contentChecks.appropriate}
                        onChange={() => handleCheckboxChange("appropriate")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="appropriate-check" className="ml-2 text-sm">
                        Appropriate content and language
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="goals-check"
                        checked={contentChecks.goals}
                        onChange={() => handleCheckboxChange("goals")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="goals-check" className="ml-2 text-sm">
                        Realistic challenge goals
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="budget-check"
                        checked={contentChecks.budget}
                        onChange={() => handleCheckboxChange("budget")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="budget-check" className="ml-2 text-sm">
                        Adequate budget allocation
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="scope-check"
                        checked={contentChecks.scope}
                        onChange={() => handleCheckboxChange("scope")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="scope-check" className="ml-2 text-sm">
                        Well-defined project scope
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-notes">Content Review Notes</Label>
                  <Textarea
                    id="content-notes"
                    placeholder="Add your detailed notes about the challenge content..."
                    rows={4}
                    value={contentNotes}
                    onChange={(e) => setContentNotes(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="decision" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="decision">Review Decision</Label>
                  <Select value={decision} onValueChange={setDecision}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Approve Challenge
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Reject Challenge
                        </div>
                      </SelectItem>
                      <SelectItem value="changes">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Request Changes
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback to Company</Label>
                  <Textarea
                    id="feedback"
                    placeholder={
                      decision === "approved"
                        ? "Optional feedback for the company..."
                        : "Provide detailed feedback to the company..."
                    }
                    rows={5}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  {["rejected", "changes"].includes(decision) && !feedback.trim() && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Feedback is required for this decision.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6 sticky bottom-0 bg-background pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewDialogOpen(false);
                setDecision("");
                setFeedback("");
                setContentNotes("");
                setContentChecks({
                  description: false,
                  appropriate: false,
                  goals: false,
                  budget: false,
                  scope: false
                });
                setCurrentMediaIndex(0);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={
                !decision ||
                (["rejected", "changes"].includes(decision) && !feedback.trim()) ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratorChallenges;