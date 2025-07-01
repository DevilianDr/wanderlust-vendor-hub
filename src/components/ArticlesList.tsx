
import { useArticles } from "@/hooks/useArticles";
import ArticleCard from "@/components/ArticleCard";
import { useState } from "react";
import ArticleDetail from "@/components/ArticleDetail";

const ArticlesList = () => {
  const { data: articles, isLoading, error } = useArticles();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

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

  if (selectedArticleId) {
    return (
      <ArticleDetail 
        articleId={selectedArticleId}
        onBack={() => setSelectedArticleId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Articles</h2>
        <p className="text-gray-600">Discover amazing places and find properties to stay</p>
      </div>
      
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticleId(article.id)}
            />
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
