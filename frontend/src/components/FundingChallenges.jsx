import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";
import { toast } from "sonner";
import { challenges } from "../utils/challengeUtils";

const FundingChallenges = () => {
  const { isLoggedIn } = useUserRole();
  const navigate = useNavigate();

  const handleSubmitProposal = (challengeId) => {
    if (isLoggedIn()) {
      // Redirect to challenge detail page
      navigate(`/challenge/${challengeId}`);
    } else {
      toast.error("Please log in to submit a proposal");
      navigate("/login");
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">Funding Challenges</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit your proposals to these company-sponsored funding opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={challenge.logo} 
                    alt={challenge.company} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="text-sm font-medium">{challenge.company}</div>
                </div>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Award</span>
                    <span className="font-semibold text-primary">{challenge.award}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span>{challenge.deadline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submissions</span>
                    <span>{challenge.submissions}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {challenge.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSubmitProposal(challenge.id)}>
                  Submit Proposal
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/explore?type=challenges">View All Challenges</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FundingChallenges;