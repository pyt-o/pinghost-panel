import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { trpc } from '@/utils/trpc';
import { Star, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarketplaceReviewForm from './MarketplaceReviewForm';

interface MarketplaceReviewsProps {
  itemId: number;
}

const MarketplaceReviews: React.FC<MarketplaceReviewsProps> = ({ itemId }) => {
  const { t } = useTranslation();
  const { data: reviews, isLoading, refetch } = trpc.marketplaceReviews.marketplaceReviews.listByItem.useQuery({ itemId });
  const { data: item } = trpc.marketplace.getById.useQuery({ id: itemId });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          rating > i ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">{t('marketplace.reviews')} ({reviews?.length || 0})</h4>
        {item && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{item.rating?.toFixed(1) || '0.0'}</span>
            <div className="flex">{renderStars(item.rating || 0)}</div>
          </div>
        )}
      </div>

      <MarketplaceReviewForm itemId={itemId} onReviewSubmitted={refetch} />

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{t('marketplace.user')} {review.userId}</CardTitle>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-card-foreground">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">{t('marketplace.no_reviews')}</p>
        )}
      </div>
    </div>
  );
};

export default MarketplaceReviews;
