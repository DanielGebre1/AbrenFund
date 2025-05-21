import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignService } from "../../../services/api";
import { toast } from "react-toastify";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
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
import {
  ArrowUpRight,
  Edit,
  Trash,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Label } from "../../ui/label";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    funding_goal: "",
    status: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const perPage = 10;
  const navigate = useNavigate();

  // Fetch projects with filters, pagination, and sorting
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (search) params.search = search;
      if (category !== "all") params.category = category;
      if (status !== "all") params.status = status;
      if (type !== "all") params.type = type;

      console.log("Fetching projects with params:", params);
      const response = await CampaignService.getCampaigns(params);
      const { data, meta } = response.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: data is not an array");
      }

      setProjects(data);
      setTotalPages(meta?.last_page || 1);
      console.log("Projects fetched:", data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch projects";
      setError(message);
      toast.error(message);
      console.error("Fetch projects error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await CampaignService.deleteCampaign(id);
        setProjects((prev) => prev.filter((project) => project.id !== id));
        toast.success("Project deleted successfully");
        if (projects.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchProjects();
        }
      } catch (error) {
        const message =
          error.response?.status === 404
            ? "Project not found. It may have been deleted already."
            : error.response?.data?.message || "Failed to delete project";
        toast.error(message);
        console.error("Delete project error:", error);
      }
    }
  };

  // Open edit dialog
  const openEditDialog = (project) => {
    setEditProject(project);
    setEditForm({
      title: project.title || "",
      category: project.category || "technology",
      funding_goal: project.funding_goal ? project.funding_goal.toString() : "",
      status: project.status || "active",
      type: project.type || "project",
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form change
  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editForm.funding_goal || isNaN(editForm.funding_goal) || Number(editForm.funding_goal) <= 0) {
      toast.error("Funding goal must be a positive number");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        title: editForm.title.trim(),
        category: editForm.category,
        funding_goal: Number(editForm.funding_goal),
        status: editForm.status,
        type: editForm.type,
      };
      console.log("Updating project with data:", updateData);
      await CampaignService.updateCampaign(editProject.id, updateData);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editProject.id ? { ...p, ...updateData } : p
        )
      );
      toast.success("Project updated successfully");
      setIsEditDialogOpen(false);
      setEditProject(null);
      setEditForm({ title: "", category: "", funding_goal: "", status: "", type: "" });
    } catch (error) {
      const message =
        error.response?.status === 404
          ? "Project not found. It may have been deleted already."
          : error.response?.data?.message || "Failed to update project";
      toast.error(message);
      console.error("Update project error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view project details
  const handleView = (id) => {
    navigate(`/admin/projects/${id}`);
  };

  // Handle navigation to edit page
  const handleEditPage = (id) => {
    navigate(`/admin/projects/edit/${id}`);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Capitalize text
  const capitalize = (str) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Fetch projects on mount and when filters, page, or sort change
  useEffect(() => {
    fetchProjects();
  }, [search, category, status, type, page, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Button
          variant="outline"
          onClick={fetchProjects}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search projects..."
            className="w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select value={category} onValueChange={(value) => {
          setCategory(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="food">Food</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(value) => {
          setType(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="challenge">Challenge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No projects found.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      Project {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("funded")}
                    >
                      Funded {sortBy === "funded" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("funding_goal")}
                    >
                      Goal {sortBy === "funding_goal" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title || "Untitled"}</TableCell>
                      <TableCell>{project.user?.name || "Unknown"}</TableCell>
                      <TableCell>{capitalize(project.category)}</TableCell>
                      <TableCell>{formatCurrency(project.funded)}</TableCell>
                      <TableCell>{formatCurrency(project.funding_goal)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : project.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {capitalize(project.status)}
                        </span>
                      </TableCell>
                      <TableCell>{capitalize(project.type)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(project.id)}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center p-4">
                <div>
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the details for {editProject?.title || "the project"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter project title"
                value={editForm.title}
                onChange={(e) => handleEditFormChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => handleEditFormChange("category", value)}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-funding-goal">Funding Goal (USD)</Label>
              <Input
                id="edit-funding-goal"
                type="number"
                placeholder="e.g. 5000"
                value={editForm.funding_goal}
                onChange={(e) => handleEditFormChange("funding_goal", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => handleEditFormChange("status", value)}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => handleEditFormChange("type", value)}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="challenge">Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditProject(null);
                setEditForm({ title: "", category: "", funding_goal: "", status: "", type: "" });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProjects;