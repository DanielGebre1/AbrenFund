import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({
  id = "1",
  title,
  description,
  imageUrl,
  category,
  raisedAmount,
  goalAmount,
  daysLeft,
  backers,
}) => {
  const navigate = useNavigate();
  const progress = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  return (
    <div
      onClick={() => navigate(`/project/${id}`)}
      className="cursor-pointer rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
          {category}
        </Badge>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">{progress}% Funded</span>
            <span>{raisedAmount.toLocaleString()} Birr raised</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{daysLeft} days left</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{backers} backers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
