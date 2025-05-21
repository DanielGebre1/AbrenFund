import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { 
  ArrowUpRight, CheckCircle, XCircle, Loader2, FileText, AlertCircle, Info, 
  Calendar, DollarSign, User, Tag, BarChart2, FileIcon, Shield, 
  Image, ChevronLeft, ChevronRight
} from "lucide-react";
import { ModeratorCampaignService } from "../../../services/api";
import { toast } from "react-toastify";

const ModeratorReviewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [decision, setDecision] = useState("");
  const [feedback, setFeedback] = useState("");
  const [contentNotes, setContentNotes] = useState("");
  const [contentChecks, setContentChecks] = useState({
    description: false,
    appropriate: false,
    goals: false,
    budget: false,
    timeline: false
  });
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      const params = {
        type: "project",
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: searchTerm || undefined,
      };
      console.log("Fetching projects with params:", params); // Log params
      const response = await ModeratorCampaignService.getCampaigns(params);
      console.log("Projects response:", response.data); // Log response
      const fetchedProjects = response.data.data;
      if (!fetchedProjects.every(project => project.type === 'project')) {
        console.warn("Non-project campaigns detected in response:", fetchedProjects);
      }
      setProjects(fetchedProjects);
    } catch (error) {
      toast.error("Failed to fetch projects. Please try again.");
      console.error('Failed to fetch projects:', error);
    }
  };

  const openReviewDialog = async (project) => {
    try {
      setIsLoadingDetails(true);
      const response = await ModeratorCampaignService.getCampaignDetails(project.id);
      const projectData = response.data;
      console.log("Project details:", projectData); // Log details
      if (projectData.type !== 'project') {
        console.warn("Fetched campaign is not a project:", projectData);
      }
      setSelectedProject(projectData);
      setFeedback(projectData.feedback || "");
      setContentNotes(projectData.content_notes || "");
      setCurrentMediaIndex(0);
      
      // Initialize content checks from existing data or set defaults
      setContentChecks(projectData.content_checks || {
        description: false,
        appropriate: false,
        goals: false,
        budget: false,
        timeline: false
      });
      
      setReviewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch project details. Please try again.");
      console.error('Failed to fetch project details:', error);
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
      
      console.log('Submitting review data:', reviewData); // Log data for debugging
      
      await ModeratorCampaignService.reviewCampaign(selectedProject.id, reviewData);
      toast.success(`Project ${decision} successfully`);
      setReviewDialogOpen(false);
      setDecision("");
      setFeedback("");
      setContentNotes("");
      setContentChecks({
        description: false,
        appropriate: false,
        goals: false,
        budget: false,
        timeline: false
      });
      fetchCampaigns();
    } catch (error) {
      let message = "Failed to submit review. Please try again.";
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(" ");
        console.error('Validation errors:', errors); // Log validation errors
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (checkName) => {
    setContentChecks(prev => ({
      ...prev,
      [checkName]: !prev[checkName]
    }));
  };

  const handleViewProfile = () => {
    if (selectedProject?.user?.id) {
      navigate(`/profile/${selectedProject.user.id}`);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200';
      case 'approved': return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
      case 'changes': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200';
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
    if (!selectedProject?.images?.length && !selectedProject?.thumbnail_url) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No media available</p>
        </div>
      );
    }

    const mediaItems = [
      ...(selectedProject.thumbnail_url ? [{ url: selectedProject.thumbnail_url, type: 'image' }] : []),
      ...(selectedProject.images?.map(img => ({ url: img.url, type: 'image' })) || [])
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
            alt="Project media"
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
        <h2 className="text-2xl font-bold">Review Projects</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search projects..." 
            className="w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Environment">Environment</SelectItem>
            <SelectItem value="Arts">Arts</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="changes">Changes Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Funding Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium">{project.title}</div>
                    </TableCell>
                    <TableCell>{project.user?.name || 'N/A'}</TableCell>
                    <TableCell>{project.category || 'N/A'}</TableCell>
                    <TableCell>{formatDate(project.created_at)}</TableCell>
                    <TableCell>${project.funding_goal?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeVariant(project.status)}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openReviewDialog(project)}
                        >
                          Review
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/campaigns/${project.id}`)}
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

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Project
            </DialogTitle>
            <DialogDescription>
              {selectedProject ? selectedProject.title : "Project"} by {selectedProject ? (selectedProject.user?.name || 'N/A') : "Creator"}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="content">Content Review</TabsTrigger>
                <TabsTrigger value="decision">Decision</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Media</Label>
                  {renderMediaPreview()}
                  <p className="text-xs text-muted-foreground">
                    {selectedProject?.images?.length || 0} additional media files
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
                      selectedProject?.category
                    )}
                    {renderDetailItem(
                      <DollarSign className="h-4 w-4" />,
                      "Funding Goal",
                      selectedProject?.funding_goal ? `$${selectedProject.funding_goal.toLocaleString()}` : null
                    )}
                    {renderDetailItem(
                      <Calendar className="h-4 w-4" />,
                      "Created Date",
                      formatDate(selectedProject?.created_at)
                    )}
                    {renderDetailItem(
                      <User className="h-4 w-4" />,
                      "Creator",
                      selectedProject?.user?.name,
                      "",
                      handleViewProfile
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Project Specifications
                    </h3>
                    {renderDetailItem(
                      <BarChart2 className="h-4 w-4" />,
                      "Funding Type",
                      selectedProject?.funding_type
                    )}
                    {renderDetailItem(
                      <Calendar className="h-4 w-4" />,
                      "End Date",
                      formatDate(selectedProject?.end_date)
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
                        {selectedProject?.short_description || "No short description provided"}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Full Description</Label>
                      <p className="text-sm whitespace-pre-line">
                        {selectedProject?.full_description || "No full description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <Label>Content Requirements Checklist</Label>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="description-check"
                          checked={contentChecks.description}
                          onChange={() => handleCheckboxChange('description')}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="description-check" className="ml-2 text-sm">
                          Clear and complete project description
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="appropriate-check"
                          checked={contentChecks.appropriate}
                          onChange={() => handleCheckboxChange('appropriate')}
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
                          onChange={() => handleCheckboxChange('goals')}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="goals-check" className="ml-2 text-sm">
                          Realistic funding goals
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="budget-check"
                          checked={contentChecks.budget}
                          onChange={() => handleCheckboxChange('budget')}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="budget-check" className="ml-2 text-sm">
                          Detailed budget breakdown
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="timeline-check"
                          checked={contentChecks.timeline}
                          onChange={() => handleCheckboxChange('timeline')}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="timeline-check" className="ml-2 text-sm">
                          Timeline for project completion
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content-notes">Content Review Notes</Label>
                    <Textarea 
                      id="content-notes" 
                      placeholder="Add your detailed notes about the project content..." 
                      rows={4}
                      value={contentNotes}
                      onChange={(e) => setContentNotes(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="decision" className="space-y-4 mt-4">
                <div className="space-y-4">
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
                            Approve Project
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            Reject Project
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
                    <Label htmlFor="feedback">Feedback to Creator</Label>
                    <Textarea 
                      id="feedback" 
                      placeholder={
                        decision === "approved" 
                          ? "Optional feedback for the creator..." 
                          : "Provide detailed feedback to the project creator..."
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
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6 sticky bottom-0 bg-background pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setReviewDialogOpen(false);
                setDecision("");
                setFeedback("");
                setContentNotes("");
                setContentChecks({
                  description: false,
                  appropriate: false,
                  goals: false,
                  budget: false,
                  timeline: false
                });
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

export default ModeratorReviewProjects;