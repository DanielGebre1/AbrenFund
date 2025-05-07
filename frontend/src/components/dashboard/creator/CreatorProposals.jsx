import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";

const CreatorProposals = () => {
  const proposals = [
    {
      id: 1,
      title: "AI-Powered Waste Management",
      company: "Green Earth Inc.",
      challenge: "Sustainable Innovation",
      submitted: "2023-05-15",
      status: "Pending",
    },
    {
      id: 2,
      title: "Educational App for Underprivileged Communities",
      company: "Future Education",
      challenge: "Education for All",
      submitted: "2023-05-12",
      status: "Under Review",
    },
    {
      id: 3,
      title: "Smart Water Conservation System",
      company: "AquaTech Solutions",
      challenge: "Water Conservation",
      submitted: "2023-05-10",
      status: "Accepted",
    },
    {
      id: 4,
      title: "Healthcare Access for Remote Areas",
      company: "HealthLink Global",
      challenge: "Healthcare Access",
      submitted: "2023-05-05",
      status: "Funded",
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "Renewable Energy Solutions",
      company: "GreenPower Co.",
      deadline: "2023-06-30",
      award: "$50,000",
    },
    {
      id: 2,
      title: "Urban Mobility Innovation",
      company: "CityMove Inc.",
      deadline: "2023-07-15",
      award: "$75,000",
    },
    {
      id: 3,
      title: "Digital Literacy in Developing Nations",
      company: "Education First Foundation",
      deadline: "2023-06-20",
      award: "$40,000",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Proposals Management</h2>

      <Tabs defaultValue="my-proposals">
        <TabsList className="mb-4">
          <TabsTrigger value="my-proposals">My Proposals</TabsTrigger>
          <TabsTrigger value="available-challenges">Available Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="my-proposals" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Input placeholder="Search proposals..." className="w-full" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.title}</TableCell>
                      <TableCell>{proposal.company}</TableCell>
                      <TableCell>{proposal.challenge}</TableCell>
                      <TableCell>{proposal.submitted}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          proposal.status === "Funded"
                            ? "bg-green-100 text-green-800"
                            : proposal.status === "Accepted"
                            ? "bg-blue-100 text-blue-800"
                            : proposal.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {proposal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available-challenges" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Input placeholder="Search challenges..." className="w-full" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">By {challenge.company}</p>
                    <div className="flex justify-between text-sm">
                      <span>Deadline:</span>
                      <span className="font-medium">{challenge.deadline}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Award:</span>
                      <span className="font-medium">{challenge.award}</span>
                    </div>
                    <Button className="w-full mt-2">Submit Proposal</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProposals;
