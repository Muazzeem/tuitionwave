import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAccessToken } from "@/utils/auth";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  contractId,
}) => {
  const [teachingStyleRating, setTeachingStyleRating] = useState<number>(0);
  const [timeManagementRating, setTimeManagementRating] = useState<number>(0);
  const [behaviorRating, setBehaviorRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleStarClick = (category: string, selectedRating: number) => {
    switch (category) {
      case "teaching":
        setTeachingStyleRating(selectedRating);
        break;
      case "timeManagement":
        setTimeManagementRating(selectedRating);
        break;
      case "behavior":
        setBehaviorRating(selectedRating);
        break;
      default:
        break;
    }
  };

  const handleSubmitReview = async () => {
    if (teachingStyleRating === 0 || timeManagementRating === 0 || behaviorRating === 0) {
      toast({
        title: "Ratings Required",
        description: "Please provide ratings for all categories before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const accessToken = getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedbacks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          contract_uid: contractId,
          teaching_style_rating: teachingStyleRating,
          time_management_rating: timeManagementRating,
          behavior_rating: behaviorRating,
          comment: comment,
        }),
      });

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully.",
        });
        setTeachingStyleRating(0);
        setTimeManagementRating(0);
        setBehaviorRating(0);
        setComment("");
        onClose();
      } else {
        const errorData = await response.json();
        for (const key in errorData) {
          if (errorData[key].length > 0) {
            toast({
              title: "Error",
              description: errorData[key][0],
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (category: string, value: number, label: string) => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-500"
              }`}
              onClick={() => handleStarClick(category, star)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold dark:text-white">
            Write a Review
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6 py-4">
          <div className="flex flex-col space-y-5">
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Please rate your experience in the following categories:
            </p>
            {renderStarRating("teaching", teachingStyleRating, "Teaching Style")}
            {renderStarRating("timeManagement", timeManagementRating, "Time Management")}
            {renderStarRating("behavior", behaviorRating, "Behavior")}
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Your Comment
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience and help others..."
              className="h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;