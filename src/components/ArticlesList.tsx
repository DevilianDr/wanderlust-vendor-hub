
import { useArticles } from "@/hooks/useArticles";
import ArticleCard from "@/components/ArticleCard";

const ArticlesList = () => {
  const { data: articles, isLoading, error } = useArticles();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-t-lg mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading articles. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Articles</h1>
        <p className="text-gray-600">Discover amazing places and find properties to stay</p>
      </div>
      
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" itemScope itemType="https://schema.org/ItemList">
          {articles.map((article) => (
            <div key={article.id} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No articles available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
