import { useState, useEffect } from 'react';
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ProposalService } from '../../../services/api';
import { toast } from 'sonner';
import { AlertCircle, Check, X, Info } from 'lucide-react';
import { Badge } from '../../ui/badge';

const statusBadgeClasses = {
  Pending: "bg-amber-100 text-amber-800",
  'Under Review': "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Funded: "bg-purple-100 text-purple-800",
  Rejected: "bg-red-100 text-red-800"
};

const statusDisplayNames = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Accepted",
  funded: "Funded",
  rejected: "Rejected"
};

const CreatorProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    proposed_solution: '',
    budget_breakdown: '',
    timeline: ''
  });

  // Fetch proposals when component mounts or filters change
  useEffect(() => {
    fetchProposals();
  }, [statusFilter, searchTerm]);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const response = await ProposalService.getMyProposals({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      });
      
      // Handle both array and paginated response
      const proposalsData = response.data?.data || response.data || [];
      setProposals(Array.isArray(proposalsData) ? proposalsData : []);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch proposals:', err);
      toast.error(err.response?.data?.message || 'Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle edit submission
  const handleEditSubmit = async () => {
    try {
      setIsEditing(true);
      await ProposalService.updateProposal(selectedProposal.id, editFormData);
      toast.success('Proposal updated successfully');
      setIsEditDialogOpen(false);
      fetchProposals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update proposal');
      console.error('Update error:', error);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle delete action
  const handleDelete = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      setIsDeleting(true);
      await ProposalService.deleteProposal(proposalId);
      toast.success('Proposal deleted successfully');
      fetchProposals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete proposal');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Set edit form data when proposal is selected for editing
  useEffect(() => {
    if (selectedProposal && isEditDialogOpen) {
      setEditFormData({
        title: selectedProposal.title || '',
        description: selectedProposal.description || '',
        proposed_solution: selectedProposal.proposed_solution || '',
        budget_breakdown: selectedProposal.budget_breakdown || '',
        timeline: selectedProposal.timeline || ''
      });
    }
  }, [selectedProposal, isEditDialogOpen]);

  // Client-side filtering as a fallback
  const filteredProposals = Array.isArray(proposals) ? proposals.filter(proposal => {
    const matchesSearch = proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === "all" || 
                         (statusDisplayNames[proposal.status.toLowerCase()]?.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  }) : [];

  // Get badge for feedback status
  const getFeedbackBadge = (proposal) => {
    if (!proposal.feedback) return null;
    
    return (
      <Badge variant="outline" className="ml-2">
        <Info className="h-3 w-3 mr-1" />
        Feedback Available
      </Badge>
    );
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
          <h3 className="text-lg font-medium">Error loading proposals</h3>
          <p className="text-muted-foreground">
            {error.response?.data?.message || error.message || 'Please try again later'}
          </p>
          <Button className="mt-4" onClick={fetchProposals}>
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
          <h2 className="text-2xl font-bold">My Proposals</h2>
          <p className="text-muted-foreground">View and manage your submitted proposals</p>
        </div>
        <Button 
          onClick={() => window.location.href = '/challenges'}
          variant="outline"
        >
          View Available Challenges
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search proposals..." 
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="funded">Funded</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {proposal.title || 'Untitled Proposal'}
                        {getFeedbackBadge(proposal)}
                      </div>
                    </TableCell>
                    <TableCell>{proposal.campaign?.title || 'N/A'}</TableCell>
                    <TableCell>{proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadgeClasses[proposal.status] || 'bg-gray-100 text-gray-800'}`}>
                        {proposal.status || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                        {proposal.status === "Pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(proposal.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No proposals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Proposal Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[80vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle>{selectedProposal?.title || 'Proposal Details'}</DialogTitle>
            <DialogDescription>
              Proposal for: {selectedProposal?.campaign?.title || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Status</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusBadgeClasses[selectedProposal.status] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedProposal.status || 'Unknown'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submitted On</h3>
                  <p>{selectedProposal.created_at ? new Date(selectedProposal.created_at).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Description</h3>
                <p className="text-muted-foreground">
                  {selectedProposal.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Problem Statement</h3>
                <p className="text-muted-foreground">
                  {selectedProposal.problem_statement || 'No problem statement provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Proposed Solution</h3>
                <p className="text-muted-foreground">
                  {selectedProposal.proposed_solution || 'No solution details provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Budget Breakdown</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedProposal.budget_breakdown || 'No budget breakdown provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Timeline</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedProposal.timeline || 'No timeline provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Team Information</h3>
                <p className="text-muted-foreground">
                  {selectedProposal.team_info || 'No team information provided'}
                </p>
              </div>
              
              {selectedProposal.feedback && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-yellow-800 mb-1">Feedback from Reviewers</h3>
                      <p className="text-sm text-yellow-700 whitespace-pre-line">
                        {selectedProposal.feedback}
                      </p>
                      {selectedProposal.status === 'Rejected' && (
                        <p className="text-xs text-yellow-600 mt-2">
                          You can resubmit this proposal after making the suggested changes.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedProposal.media?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Media</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedProposal.media.map((media, index) => (
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
            </div>
          )}
          
          <DialogFooter className="shrink-0 px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Proposal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Proposal</DialogTitle>
            <DialogDescription>
              Update your proposal for: {selectedProposal?.campaign?.title || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="space-y-4">
              {selectedProposal.feedback && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-yellow-800 mb-1">Reviewer Feedback</h3>
                      <p className="text-sm text-yellow-700 whitespace-pre-line">
                        {selectedProposal.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-sm mb-2">Title</h3>
                <Input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  placeholder="Enter proposal title"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-2">Description</h3>
                <Textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Describe your proposal"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-2">Proposed Solution</h3>
                <Textarea
                  name="proposed_solution"
                  value={editFormData.proposed_solution}
                  onChange={handleEditChange}
                  rows={4}
                  placeholder="Detail your proposed solution"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-2">Budget Breakdown</h3>
                <Textarea
                  name="budget_breakdown"
                  value={editFormData.budget_breakdown}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Break down your budget requirements"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-2">Timeline</h3>
                <Textarea
                  name="timeline"
                  value={editFormData.timeline}
                  onChange={handleEditChange}
                  rows={2}
                  placeholder="Estimated timeline for implementation"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isEditing}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isEditing}>
              {isEditing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorProposals;