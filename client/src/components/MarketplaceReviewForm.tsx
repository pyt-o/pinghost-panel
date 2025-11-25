import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/contexts/LanguageContext';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface MarketplaceReviewFormProps {
  itemId: number;
  onReviewSubmitted: () => void;
}

const MarketplaceReviewForm: React.FC<MarketplaceReviewFormProps> = ({ itemId, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const submitReviewMutation = trpc.marketplaceReviews.marketplaceReviews.submit.useMutation({
    onSuccess: () => {
      toast.success(t('marketplace.review_submitted'));
      setRating(0);
      setComment('');
      onReviewSubmitted();
    },
    onError: (error) => {
      toast.error(error.message || t('marketplace.review_error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t('marketplace.rating_required'));
      return;
    }
    submitReviewMutation.mutate({ itemId, rating, comment: comment || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">{t('marketplace.submit_review')}</h3>
      
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              (hoverRating || rating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating} {t('marketplace.stars')})
        </span>
      </div>

      <Textarea
        placeholder={t('marketplace.review_placeholder')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
      />

      <Button type="submit" disabled={rating === 0 || submitReviewMutation.isLoading}>
        {submitReviewMutation.isLoading ? t('common.loading') : t('marketplace.submit')}
      </Button>
    </form>
  );
};

export default MarketplaceReviewForm;
