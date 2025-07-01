
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string | null;
    location: string;
    featured_image: string | null;
    created_at: string;
  };
  onClick: () => void;
}

const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {article.featured_image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {article.location}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            {format(new Date(article.created_at), 'MMM dd, yyyy')}
          </div>
        </div>
        <CardTitle className="text-lg">{article.title}</CardTitle>
      </CardHeader>
      {article.excerpt && (
        <CardContent>
          <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default ArticleCard;
