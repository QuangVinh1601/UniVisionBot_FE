import React, { useState, useEffect } from 'react';
import { useFeedback } from '../contexts/FeedbackContext';
import StarRating from './StarRating';

interface FeedbackForm {
  userInterface: number;
  functionality: number;
  performance: number;
  usefulness: number;
  comment: string;
}
const initialFormState: FeedbackForm = {
    userInterface: 0,
    functionality: 0,
    performance: 0,
    usefulness: 0,
    comment: ''
  };
interface Ratings {
  userInterface: number;
  functionality: number;
  performance: number;
  usefulness: number;
}

interface FeedbackRequest {
  overallFeedback: string;
  userId: string;
  instance: Ratings;
}

interface FeedbackModalProps {
  onClose?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const { isModalOpen, closeModal } = useFeedback();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const UserId = localStorage.getItem('UserId');
    const [formData, setFormData] = useState<FeedbackForm>(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setError(null);
    }
    
    // Reset states when modal opens/closes
    useEffect(() => {
      if (!isModalOpen) {
        setIsSuccess(false);
        setError(null);
        setFormData(initialFormState);
      }
    }, [isModalOpen]);

  const questions = [
    { key: 'userInterface', label: 'Giao diện người dùng thân thiện?' },
    { key: 'functionality', label: 'Tốc độ phản hồi nhanh chóng?' },
    { key: 'performance', label: 'Chatbot có hiểu yêu cầu và ngữ cảnh của bạn không?' },
    { key: 'usefulness', label: 'Thông tin ChatBot đưa ra có phù hợp với bạn không' },
  ];

  const handleClose = () => {
    if (isSuccess) {
      alert('Cảm ơn bạn đã dành thời gian đánh giá!'); // Or use a custom toast/notification
    }
    setIsSuccess(false); // Reset success state
    resetForm();
    closeModal();
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (!formData.comment || formData.comment.length > 500) {
      setError('Feedback không được để trống và không được vượt quá 500 ký tự');
      setIsLoading(false);
      return;
    }

    // Validate all ratings are between 1-5
    const ratings = [formData.userInterface, formData.functionality, 
                    formData.performance, formData.usefulness];
    
    if (ratings.some(rating => rating < 1 || rating > 5)) {
      setError('Tất cả đánh giá phải từ 1 đến 5 sao');
      setIsLoading(false);
      return;
    }

    try {
      const requestBody: FeedbackRequest = {
        overallFeedback: formData.comment.trim(),
        userId: UserId || 'anonymous',
        instance: {
          userInterface: Number(formData.userInterface),
          functionality: Number(formData.functionality),
          performance: Number(formData.performance),
          usefulness: Number(formData.usefulness)
        }
      };

      const response = await fetch('https://localhost:7230/api/Feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.errors ? Object.values(data.errors).flat().join(', ') : 'Submission failed');
      }

      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        
      <div className="fixed inset-0 bg-green-900/30 backdrop-blur-sm" onClick={closeModal} />
      <div className="bg-white rounded-xl p-8 w-[500px] max-h-[90vh] overflow-y-auto z-10 shadow-2xl border-t-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          Đánh giá trải nghiệm của bạn
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map(({ key, label }) => (
            <div key={key} className="space-y-2 hover:bg-green-50 p-4 rounded-lg transition-colors">
              <label className="block text-green-700 font-medium">{label}</label>
              <StarRating
                rating={formData[key as keyof FeedbackForm] as number}
                onRate={(rating) => setFormData(prev => ({ ...prev, [key]: rating }))}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="block text-green-700 font-medium">
              Ý kiến đóng góp của bạn
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 
                transition-all resize-none border-green-200"
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Chia sẻ thêm ý kiến của bạn..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg border border-green-300 text-green-700
                hover:bg-green-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg 
                hover:bg-green-600 transition-colors"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">↻</span>
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
        {isSuccess && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            Cảm ơn bạn đã gửi đánh giá!
          </div>
        )}
      </div>
    </div>
  );
};