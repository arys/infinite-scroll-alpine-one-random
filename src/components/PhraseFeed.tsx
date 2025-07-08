'use client';

import { useState, useEffect, useRef } from 'react';
import { useRecommendationEngine } from '../hooks/useRecommendationEngine';

interface PhraseFeedProps {
  onExit: () => void;
}

export default function PhraseFeed({ onExit }: PhraseFeedProps) {
  const {
    currentPhrase,
    likePhrase,
    skipPhrase,
    showNextPhrase,
    userProfile,
    context,
    generateAlgorithmInsight
  } = useRecommendationEngine();

  const [isLiked, setIsLiked] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const phraseRef = useRef<HTMLDivElement>(null);
  
  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Handle like action
  const handleLike = () => {
    if (currentPhrase && !isLiked) {
      setIsLiked(true);
      likePhrase(currentPhrase);
      
      // Show algorithm insight occasionally
      if (Math.random() < 0.3 && userProfile.likedPhrases.length >= 2) {
        setShowInsight(true);
        setTimeout(() => setShowInsight(false), 3000);
      }
      
      // Auto-advance after like
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  };

  // Handle skip/next action
  const handleNext = () => {
    if (currentPhrase && !isTransitioning) {
      setIsTransitioning(true);
      
      if (!isLiked) {
        skipPhrase(currentPhrase);
      }
      
      setTimeout(() => {
        showNextPhrase();
        setIsLiked(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      handleNext(); // Swipe up for next
    } else if (isDownSwipe) {
      handleLike(); // Swipe down for like
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault();
          handleLike();
          break;
        case 'Escape':
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPhrase, isLiked, isTransitioning]);

  // Auto-advance if user is inactive (optional - creates pressure)
  useEffect(() => {
    if (context.escalationMode && !isLiked) {
      const timer = setTimeout(() => {
        handleNext();
      }, 8000); // 8 seconds in escalation mode

      return () => clearTimeout(timer);
    }
  }, [currentPhrase, context.escalationMode, isLiked]);

  if (!currentPhrase) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'loneliness': return 'from-blue-900 to-purple-900';
      case 'regret': return 'from-red-900 to-orange-900';  
      case 'love': return 'from-pink-900 to-rose-900';
      case 'self_doubt': return 'from-gray-900 to-slate-900';
      case 'meta': return 'from-green-900 to-teal-900';
      default: return 'from-gray-900 to-black';
    }
  };

  const intensityOpacity = Math.min(0.3 + (currentPhrase.intensity * 0.15), 0.9);

  return (
    <div 
      className={`min-h-screen w-full bg-gradient-to-br ${getThemeColor(currentPhrase.theme)} relative overflow-hidden`}
      style={{ background: `linear-gradient(to bottom right, rgba(0,0,0,${intensityOpacity}), rgba(0,0,0,0.95))` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45"></div>
      </div>

      {/* Main phrase display */}
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div 
          ref={phraseRef}
          className={`text-center transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed max-w-4xl mx-auto mb-8">
            {currentPhrase.text}
          </p>
          
          {/* Intensity indicator */}
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                  i < currentPhrase.intensity 
                    ? 'bg-white opacity-80' 
                    : 'bg-white opacity-20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm insight overlay */}
      {showInsight && (
        <div className="absolute top-1/4 left-4 right-4 text-center">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-white text-sm animate-fade-in">
            <p className="opacity-80">{generateAlgorithmInsight()}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
        {/* Skip button */}
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center transition-all duration-200 hover:bg-opacity-30 active:scale-95 disabled:opacity-50"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={isLiked || isTransitioning}
          className={`w-20 h-20 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 disabled:opacity-50 ${
            isLiked 
              ? 'bg-red-500 bg-opacity-80' 
              : 'bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30'
          }`}
        >
          <svg 
            className={`w-8 h-8 transition-colors duration-200 ${isLiked ? 'text-white fill-current' : 'text-white'}`} 
            fill={isLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center transition-all duration-200 hover:bg-opacity-30"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Swipe indicators */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white text-opacity-50 text-xs text-center">
        <p>↑ Next • ↓ Like • ESC Exit</p>
      </div>

      {/* Session info (in escalation mode) */}
      {context.escalationMode && (
        <div className="absolute top-6 left-6 text-white text-opacity-70 text-xs">
          <p>Session depth: {userProfile.sessionDepth}</p>
          <p>Time: {Math.floor(userProfile.timeSpent / 60)}m {userProfile.timeSpent % 60}s</p>
          <p>Engagement level: {Math.ceil(userProfile.emotionalIntensityTolerance)}/5</p>
        </div>
      )}
    </div>
  );
} 