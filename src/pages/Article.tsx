
import { useParams, useNavigate } from "react-router-dom";
import { useArticle } from "@/hooks/useArticles";
import { useProperties } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Star, Car, Bed, MapPin as LocationIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading: articleLoading } = useArticle(id || "");
  const { data: allProperties } = useProperties();

  // Filter properties by location
  const locationProperties = allProperties?.filter(
    property => property.location.toLowerCase() === article?.location.toLowerCase()
  ) || [];

  // SEO optimization - Update document metadata
  useEffect(() => {
    if (article) {
      // Update page title
      document.title = `${article.title} - Travel Guide | Wanderlust`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.excerpt || `Discover ${article.location} - ${article.title}. Find the best properties and travel tips for your next adventure.`);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = article.excerpt || `Discover ${article.location} - ${article.title}. Find the best properties and travel tips for your next adventure.`;
        document.head.appendChild(meta);
      }

      // Add Open Graph meta tags
      const updateOrCreateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMeta('og:title', article.title);
      updateOrCreateMeta('og:description', article.excerpt || `Discover ${article.location} - ${article.title}`);
      updateOrCreateMeta('og:type', 'article');
      updateOrCreateMeta('og:url', window.location.href);
      if (article.featured_image) {
        updateOrCreateMeta('og:image', article.featured_image);
      }

      // Add Twitter Card meta tags
      const updateOrCreateTwitterMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
      updateOrCreateTwitterMeta('twitter:title', article.title);
      updateOrCreateTwitterMeta('twitter:description', article.excerpt || `Discover ${article.location} - ${article.title}`);
      if (article.featured_image) {
        updateOrCreateTwitterMeta('twitter:image', article.featured_image);
      }

      // Add structured data (JSON-LD)
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt || `Travel guide for ${article.location}`,
        "image": article.featured_image || "",
        "author": {
          "@type": "Organization",
          "name": "Wanderlust"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Wanderlust",
          "logo": {
            "@type": "ImageObject",
            "url": "https://wanderlust.com/logo.png"
          }
        },
        "datePublished": article.created_at,
        "dateModified": article.updated_at,
        "about": {
          "@type": "Place",
          "name": article.location
        }
      };

      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Wanderlust Vendor Hub';
    };
  }, [article]);

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
            <p className="text-red-600 mb-4">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Button onClick={() => navigate('/')} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <article className="space-y-6" itemScope itemType="https://schema.org/Article">
            <header className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span itemProp="about" itemScope itemType="https://schema.org/Place">
                    <span itemProp="name">{article.location}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time itemProp="datePublished" dateTime={article.created_at}>
                    {format(new Date(article.created_at), 'MMMM dd, yyyy')}
                  </time>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900" itemProp="headline">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed" itemProp="description">
                  {article.excerpt}
                </p>
              )}
            </header>

            {article.featured_image && (
              <figure className="aspect-video w-full overflow-hidden rounded-lg">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  itemProp="image"
                />
              </figure>
            )}

            <div className="prose prose-lg max-w-none" itemProp="articleBody">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
            </div>

            {article.images && article.images.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.images.map((image, index) => (
                    <figure key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${article.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </article>

          {locationProperties.length > 0 && (
            <section className="space-y-6" itemScope itemType="https://schema.org/ItemList">
              <div className="border-t pt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2" itemProp="name">
                  Properties in {article.location}
                </h2>
                <p className="text-gray-600" itemProp="description">
                  Stay at these amazing properties during your visit
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationProperties.map((property, index) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/LodgingBusiness" itemProp="itemListElement">
                    {property.images && property.images.length > 0 && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img 
                          src={property.images[0]} 
                          alt={property.name}
                          className="w-full h-full object-cover"
                          itemProp="image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 capitalize">
                          {property.type}
                        </span>
                        {property.rating && (
                          <div className="flex items-center gap-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium" itemProp="ratingValue">{property.rating}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg" itemProp="name">{property.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-600" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <LocationIcon className="h-3 w-3" />
                        <span itemProp="addressLocality">{property.address || property.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2" itemProp="description">
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
