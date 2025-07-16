import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JudgeSubmissions = ({ 
  submissions = [], 
  selectedSubmission = null,
  onSubmissionSelect = () => {},
  onSelectWinner = () => {},
  isLoading = false,
  className = '' 
}) => {
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  const handleSubmissionClick = (submission) => {
    if (selectedSubmission?.id === submission.id) {
      setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id);
    } else {
      onSubmissionSelect(submission);
      setExpandedSubmission(null);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Clock" size={24} className="text-muted-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Waiting for Submissions
          </h3>
          <p className="text-muted-foreground">
            Players are selecting their curse cards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Player Submissions
          </h3>
          <p className="text-sm text-muted-foreground">
            Select the best curse response
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-accent/20 text-accent px-3 py-1 rounded-full">
          <Icon name="Crown" size={16} />
          <span className="text-sm font-medium">Judge</span>
        </div>
      </div>

      {/* Submissions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {submissions.map((submission, index) => {
          const isSelected = selectedSubmission?.id === submission.id;
          const isExpanded = expandedSubmission === submission.id;
          
          return (
            <div
              key={submission.id}
              onClick={() => handleSubmissionClick(submission)}
              className={`
                relative bg-background border-2 rounded-lg p-4 cursor-pointer
                transition-all duration-200 hover:shadow-lg
                ${isSelected 
                  ? 'border-accent bg-accent/5 shadow-game-card' 
                  : 'border-border hover:border-accent/50'
                }
                ${isExpanded ? 'col-span-full' : ''}
              `}
            >
              {/* Submission header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-secondary">
                    CURSE
                  </span>
                </div>
                {isSelected && (
                  <Icon name="Check" size={16} className="text-accent" />
                )}
              </div>

              {/* Submission text */}
              <p className={`
                text-sm text-foreground leading-relaxed
                ${isExpanded ? 'text-base' : 'line-clamp-4'}
              `}>
                {submission.text}
              </p>

              {/* Expand button */}
              {submission.text.length > 120 && !isExpanded && (
                <button className="text-xs text-accent hover:text-accent/80 mt-2">
                  Read more...
                </button>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-accent rounded-lg pointer-events-none animate-pulse-glow" />
              )}
            </div>
          );
        })}
      </div>

      {/* Select winner button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={onSelectWinner}
          disabled={!selectedSubmission || isLoading}
          loading={isLoading}
          iconName="Crown"
          iconPosition="left"
          className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Select Winner
        </Button>
      </div>
    </div>
  );
};

export default JudgeSubmissions;