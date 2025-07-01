
import { useArticle } from "@/hooks/useArticles";
import { useProperties } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Star, Car, Bed, MapPin as LocationIcon } from "lucide-react";
import { format } from "date-fns";

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

const ArticleDetail = ({ articleId, onBack }: ArticleDetailProps) => {
  const { data: article, isLoading: articleLoading } = useArticle(articleId);
  const { data: allProperties } = useProperties();

  // Filter properties by location
  const locationProperties = allProperties?.filter(
    property => property.location.toLowerCase() === article?.location.toLowerCase()
  ) || [];

  if (articleLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Article not found.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Articles
      </Button>

      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {article.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(article.created_at), 'MMMM dd, yyyy')}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
          
          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">{article.excerpt}</p>
          )}
        </div>

        {article.featured_image && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
        </div>

        {article.images && article.images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image} 
                    alt={`${article.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {locationProperties.length > 0 && (
        <div className="space-y-6">
          <div className="border-t pt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Properties in {article.location}
            </h2>
            <p className="text-gray-600">Stay at these amazing properties during your visit</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                {property.images && property.images.length > 0 && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={property.images[0]} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 capitalize">
                      {property.type}
                    </span>
                    {property.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <LocationIcon className="h-3 w-3" />
                    {property.address || property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.room_types && property.room_types.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.room_types.length} room types</span>
                      </div>
                    )}
                    {property.vehicles && property.vehicles.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>{property.vehicles.length} vehicles</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
