import React from 'react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  const handleStarClick = (e: React.MouseEvent, value: number) => {
    e.preventDefault();
    e.stopPropagation();
    onRate(value);
  };

  return (
    <div 
      className="flex gap-1" 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => handleStarClick(e, star)}
          className={`text-2xl transition-colors cursor-pointer select-none
            ${star <= rating ? 'text-green-500' : 'text-gray-300'}
            hover:text-green-400`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;