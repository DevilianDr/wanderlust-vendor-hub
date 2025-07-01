
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string | null;
    location: string;
    featured_image: string | null;
    created_at: string;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow" 
      onClick={handleClick}
      itemScope 
      itemType="https://schema.org/Article"
    >
      {article.featured_image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover"
            itemProp="image"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span itemProp="about" itemScope itemType="https://schema.org/Place">
              <span itemProp="name">{article.location}</span>
            </span>
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <time itemProp="datePublished" dateTime={article.created_at}>
              {format(new Date(article.created_at), 'MMM dd, yyyy')}
            </time>
          </div>
        </div>
        <CardTitle className="text-lg" itemProp="headline">{article.title}</CardTitle>
      </CardHeader>
      {article.excerpt && (
        <CardContent>
          <p className="text-gray-600 text-sm line-clamp-3" itemProp="description">
            {article.excerpt}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default ArticleCard;
