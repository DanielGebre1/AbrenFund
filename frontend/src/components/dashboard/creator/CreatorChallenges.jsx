import React, { useState, useEffect } from "react";
import { Eye, ArrowUpDown, CheckCircle, XCircle, Users } from "lucide-react";
import { Textarea } from '../../ui/textarea';
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import api from '../../../services/api';

const statusBadgeClasses = {
  Pending: "bg-amber-100 text-amber-800",
  'Under Review': "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Funded: "bg-purple-100 text-purple-800",
  Rejected: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800"
};

const statusDisplayNames = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Accepted",
  funded: "Funded",
  rejected: "Rejected",
  draft: "Draft",
  active: "Active",
  completed: "Completed"
};

const CreatorChallenges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [viewSubmissionsForChallenge, setViewSubmissionsForChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch challenges and submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch only challenges created by the current user
        const challengesResponse = await api.get('/api/campaigns', {
          params: { 
            type: 'challenge',
            user_id: 'current' // Filter by current user
          }
        });
        
        // Ensure we have an array of challenges
        let challengesData = [];
        if (challengesResponse.data && challengesResponse.data.data) {
          challengesData = Array.isArray(challengesResponse.data.data) 
            ? challengesResponse.data.data 
            : challengesResponse.data.data.data || [];
        }
        
        // Transform status for display
        const transformedChallenges = challengesData.map(challenge => ({
          ...challenge,
          displayStatus: getDisplayStatus(challenge)
        }));
        
        setChallenges(transformedChallenges);
        
        if (viewSubmissionsForChallenge) {
          // Fetch proposals for the specific challenge
          const submissionsResponse = await api.get(`/api/campaigns/${viewSubmissionsForChallenge}/proposals`);
          
          // Ensure we have an array of submissions
          let submissionsData = [];
          if (submissionsResponse.data && submissionsResponse.data.data) {
            submissionsData = Array.isArray(submissionsResponse.data.data)
              ? submissionsResponse.data.data
              : submissionsResponse.data.data.data || [];
          }
          
          setSubmissions(submissionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [viewSubmissionsForChallenge]);

  // Helper function to determine display status
  const getDisplayStatus = (challenge) => {
    if (challenge.status === 'approved' && challenge.submission_deadline && new Date(challenge.submission_deadline) > new Date()) {
      return 'active';
    }
    if (challenge.status === 'approved' && challenge.submission_deadline && new Date(challenge.submission_deadline) <= new Date()) {
      return 'completed';
    }
    return challenge.status; // returns 'draft', 'pending', or 'rejected'
  };

  // Filter and sort challenges
  const filteredChallenges = Array.isArray(challenges) ? challenges.filter(challenge => {
    const matchesSearch = challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === "all" || challenge.displayStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortColumn === "title") {
      return sortDirection === "asc" 
        ? (a.title || '').localeCompare(b.title || '')
        : (b.title || '').localeCompare(a.title || '');
    } else if (sortColumn === "submissions") {
      return sortDirection === "asc" 
        ? (a.proposals_count || a.submissions_count || 0) - (b.proposals_count || b.submissions_count || 0)
        : (b.proposals_count || b.submissions_count || 0) - (a.proposals_count || a.submissions_count || 0);
    }
    return 0;
  }) : [];

  // Filter submissions for a specific challenge
  const filteredSubmissions = Array.isArray(submissions) ? submissions.filter(submission => 
    viewSubmissionsForChallenge ? submission.campaign_id === viewSubmissionsForChallenge : true
  ) : [];

  // Handler for status change
  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      setIsUpdating(true);
      await api.put(`/api/proposals/${submissionId}/status`, {
        status: newStatus,
        feedback: feedbackText
      });
      
      toast.success(`Proposal ${statusDisplayNames[newStatus] || newStatus} successfully`);
      setSubmissionDialogOpen(false);
      setFeedbackText("");
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: statusDisplayNames[newStatus] || newStatus } : sub
      ));
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast.error(error.response?.data?.message || 'Failed to update proposal status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle sorting change
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // View submissions for a specific challenge
  const viewSubmissionsFor = (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.displayStatus === 'active') {
      setViewSubmissionsForChallenge(challengeId);
    } else {
      toast.warning('You can only view submissions for active challenges');
    }
  };

  // Go back to challenges list
  const backToChallenges = () => {
    setViewSubmissionsForChallenge(null);
    setSubmissions([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error loading challenges</h3>
          <p className="text-muted-foreground">
            {error.response?.data?.message || error.message || 'Please try again later'}
          </p>
          <Button 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Challenges</h2>
          <p className="text-muted-foreground">Manage your challenges and review submissions</p>
        </div>
        <Button onClick={() => window.location.href = '/create-campaign'}>Create New Challenge</Button>
      </div>

      {viewSubmissionsForChallenge ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={backToChallenges}>
              ← Back to My Challenges
            </Button>
            <h3 className="text-lg font-semibold">
              {challenges.find(c => c.id === viewSubmissionsForChallenge)?.title || 'Challenge'} - Submissions
            </h3>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.title || 'Untitled Proposal'}</TableCell>
                        <TableCell>{submission.user?.name || 'Unknown'}</TableCell>
                        <TableCell>{submission.created_at ? new Date(submission.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge 
                            className={statusBadgeClasses[submission.status] || 'bg-gray-100 text-gray-800'}
                          >
                            {submission.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setFeedbackText(submission.feedback || '');
                                setSubmissionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No submissions found for this challenge
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Input 
                placeholder="Search challenges..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("submissions")}
                    >
                      <div className="flex items-center">
                        Submissions
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChallenges.length > 0 ? (
                    filteredChallenges.map((challenge) => (
                      <TableRow key={challenge.id}>
                        <TableCell className="font-medium">{challenge.title || 'Untitled Challenge'}</TableCell>
                        <TableCell>{challenge.company_name || 'N/A'}</TableCell>
                        <TableCell>{challenge.category || 'N/A'}</TableCell>
                        <TableCell>{challenge.proposals_count || challenge.submissions_count || 0}</TableCell>
                        <TableCell>{challenge.reward_amount ? `$${Number(challenge.reward_amount).toLocaleString()}` : 'N/A'}</TableCell>
                        <TableCell>
                          {challenge.submission_deadline 
                            ? new Date(challenge.submission_deadline).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={statusBadgeClasses[challenge.displayStatus] || 'bg-gray-100 text-gray-800'}
                          >
                            {challenge.displayStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewSubmissionsFor(challenge.id)}
                            disabled={challenge.displayStatus !== 'active'}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            View Submissions
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No challenges found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Submission Details Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[80vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle>{selectedSubmission?.title || 'Submission Details'}</DialogTitle>
            <DialogDescription>
              Review this project submission for {selectedSubmission?.campaign?.title || 'challenge'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Project Title</h3>
                  <p>{selectedSubmission.title || 'Untitled Proposal'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submitted By</h3>
                  <p>{selectedSubmission.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submission Date</h3>
                  <p>{selectedSubmission.created_at ? new Date(selectedSubmission.created_at).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Status</h3>
                  <Badge className={statusBadgeClasses[selectedSubmission.status] || 'bg-gray-100 text-gray-800'}>
                    {selectedSubmission.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Description</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Problem Statement</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.problem_statement || 'No problem statement provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Proposed Solution</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.proposed_solution || 'No solution details provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Budget Breakdown</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedSubmission.budget_breakdown || 'No budget breakdown provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Timeline</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedSubmission.timeline || 'No timeline provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Team Information</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.team_info || 'No team information provided'}
                </p>
              </div>
              
              {selectedSubmission.feedback && (
                <div>
                  <h3 className="font-semibold text-sm">Previous Feedback</h3>
                  <p className="text-muted-foreground">
                    {selectedSubmission.feedback}
                  </p>
                </div>
              )}
              
              {selectedSubmission.media?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Media</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedSubmission.media.map((media, index) => (
                      <div key={index} className="flex flex-col">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt={`Proposal media ${index + 1}`} 
                            className="max-w-full h-auto rounded-md mb-2"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                        ) : (
                          <a 
                            href={media.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                          >
                            Document {index + 1}
                          </a>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {media.type === 'image' ? 'Image' : 'Document'} {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-sm">Your Feedback</h3>
                <Textarea 
                  placeholder="Provide feedback on this submission..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="shrink-0 flex flex-col sm:flex-row gap-2 sm:justify-between px-6 py-4 border-t">
            <Button 
              variant="destructive"
              onClick={() => handleStatusChange(selectedSubmission?.id, "rejected")}
              className="w-full sm:w-auto"
              disabled={isUpdating || selectedSubmission?.status === 'Rejected'}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isUpdating ? 'Processing...' : 'Reject Submission'}
            </Button>
            <Button 
              onClick={() => handleStatusChange(selectedSubmission?.id, "approved")}
              className="w-full sm:w-auto"
              disabled={isUpdating || selectedSubmission?.status === 'Accepted'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isUpdating ? 'Processing...' : 'Approve & Fund Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorChallenges;