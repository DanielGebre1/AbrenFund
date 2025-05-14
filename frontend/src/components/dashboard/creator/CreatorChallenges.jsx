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
  const [error, setError] = useState(null);

  // Fetch challenges and submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch challenges with type=challenge
        const challengesResponse = await api.get('/api/campaigns', {
          params: { type: 'challenge' }
        });
        
        // Ensure we have an array of challenges
        let challengesData = [];
        if (challengesResponse.data && challengesResponse.data.data) {
          // Handle both array and paginated response
          challengesData = Array.isArray(challengesResponse.data.data) 
            ? challengesResponse.data.data 
            : challengesResponse.data.data.data || [];
        }
        
        setChallenges(challengesData);
        
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

  // Filter and sort challenges - now safely handles challenges array
  const filteredChallenges = Array.isArray(challenges) ? challenges.filter(challenge => {
    return (
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || challenge.status === statusFilter)
    );
  }).sort((a, b) => {
    if (sortColumn === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortColumn === "submissions") {
      return sortDirection === "asc" 
        ? (a.proposals_count || a.submissions_count || 0) - (b.proposals_count || b.submissions_count || 0)
        : (b.proposals_count || b.submissions_count || 0) - (a.proposals_count || a.submissions_count || 0);
    }
    return 0;
  }) : [];

  // Filter submissions for a specific challenge - safely handles submissions array
  const filteredSubmissions = Array.isArray(submissions) ? submissions.filter(submission => 
    viewSubmissionsForChallenge ? submission.campaign_id === viewSubmissionsForChallenge : true
  ) : [];

  // Handler for status change
  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      await api.put(`/api/proposals/${submissionId}/status`, {
        status: newStatus,
        feedback: feedbackText
      });
      
      toast.success(`Proposal ${newStatus} successfully`);
      setSubmissionDialogOpen(false);
      setFeedbackText("");
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: newStatus } : sub
      ));
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast.error(error.response?.data?.message || 'Failed to update proposal status');
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
    setViewSubmissionsForChallenge(challengeId);
  };

  // Go back to challenges list
  const backToChallenges = () => {
    setViewSubmissionsForChallenge(null);
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
            {error.message || 'Please try again later'}
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
          <p className="text-muted-foreground">Manage your company challenges and review submissions</p>
        </div>
        <Button onClick={() => window.location.href = '/create-campaign'}>Create New Challenge</Button>
      </div>

      {viewSubmissionsForChallenge ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={backToChallenges}>
              ← Back to All Challenges
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
                        <TableCell className="font-medium">{submission.title}</TableCell>
                        <TableCell>{submission.user?.name || 'Unknown'}</TableCell>
                        <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              submission.status === "approved" ? "default" : 
                              submission.status === "rejected" ? "destructive" : 
                              "outline"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
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
              defaultValue="all" 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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
                        <TableCell className="font-medium">{challenge.title}</TableCell>
                        <TableCell>{challenge.company}</TableCell>
                        <TableCell>{challenge.category}</TableCell>
                        <TableCell>{challenge.proposals_count || challenge.submissions_count || 0}</TableCell>
                        <TableCell>{challenge.award}</TableCell>
                        <TableCell>{new Date(challenge.deadline).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={challenge.status === "active" ? "outline" : "secondary"}
                          >
                            {challenge.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewSubmissionsFor(challenge.id)}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review this project submission for your challenge
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Project Title</h3>
                  <p>{selectedSubmission.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submitted By</h3>
                  <p>{selectedSubmission.user?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Submission Date</h3>
                <p>{new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Project Description</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Solution Approach</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.solution || 'No solution details provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Budget & Timeline</h3>
                <p className="text-muted-foreground">
                  {selectedSubmission.budget_breakdown || 'No budget breakdown provided'}
                </p>
                <p className="text-muted-foreground mt-2">
                  Timeline: {selectedSubmission.timeline || 'Not specified'}
                </p>
              </div>
              
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
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button 
              variant="destructive"
              onClick={() => handleStatusChange(selectedSubmission?.id, "rejected")}
              className="w-full sm:w-auto"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Submission
            </Button>
            <Button 
              onClick={() => handleStatusChange(selectedSubmission?.id, "approved")}
              className="w-full sm:w-auto"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Fund Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorChallenges;