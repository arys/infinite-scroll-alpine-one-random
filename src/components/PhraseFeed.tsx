'use client';

import { useState, useEffect, useRef } from 'react';
import { useRecommendationEngine } from '../hooks/useRecommendationEngine';
import { useAmbientAudio } from '../hooks/useAmbientAudio';

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

  const {
    isPlaying: audioIsPlaying,
    isEnabled: audioIsEnabled,
    startAudio,
    updateAudio
  } = useAmbientAudio();

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
      handleNext(); // Swipe up for next (like Instagram)
    } else if (isDownSwipe) {
      handleNext(); // Swipe down also goes to next (like Instagram)
    }
  };

  // Keyboard shortcuts (Instagram Reels style)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          handleNext(); // Both up and down go to next, like Instagram
          break;
        case 'Enter':
          e.preventDefault();
          handleLike(); // Heart/like with Enter
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

  // Start audio when component mounts
  useEffect(() => {
    if (!audioIsPlaying && !audioIsEnabled) {
      startAudio().catch(error => {
        console.warn('Could not start ambient audio:', error);
      });
    }
  }, []);

  // Update ambient audio based on current phrase
  useEffect(() => {
    if (currentPhrase && audioIsEnabled) {
      const audioConfig = {
        volume: 0.3 + (currentPhrase.intensity * 0.1), // Volume increases with intensity
        intensity: currentPhrase.intensity,
        theme: currentPhrase.theme,
        escalationMode: context.escalationMode
      };
      
      updateAudio(audioConfig);
    }
  }, [currentPhrase, context.escalationMode, audioIsEnabled, updateAudio]);

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
      <div className="min-h-screen flex items-center justify-center p-6 pr-20 pb-40 relative">
        <div 
          ref={phraseRef}
          className={`text-left max-w-sm transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          <p className="text-white text-xl md:text-2xl font-light leading-relaxed tracking-wide">
            {currentPhrase.text}
          </p>
        </div>
      </div>

      {/* Music indicator (bottom right of main content) */}
      <div className="absolute bottom-40 right-6 flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded-full px-3 py-1">
          <div className={`w-3 h-3 rounded-full ${audioIsPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}>
            {audioIsPlaying && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
            {!audioIsPlaying && (
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            )}
          </div>
          <span className="text-white text-xs">
            {audioIsPlaying ? `${currentPhrase?.theme || 'Deep'} Ambient` : 'Audio Off'}
          </span>
        </div>
      </div>

      {/* Instagram-style right sidebar */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
        {/* Like button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={isLiked || isTransitioning}
            className={`instagram-button w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 ${
              isLiked ? 'animate-heart-pop' : ''
            }`}
          >
            <svg 
              className={`w-7 h-7 transition-colors duration-200 ${
                isLiked ? 'text-red-500 fill-current' : 'text-white'
              }`} 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={isLiked ? 0 : 2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {userProfile.likedPhrases.length}
          </span>
        </div>

        {/* Comments button */}
        <div className="flex flex-col items-center">
          <button className="instagram-button w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {10 + userProfile.sessionDepth * 3}
          </span>
        </div>

        {/* Share button */}
        <div className="flex flex-col items-center">
          <button className="instagram-button w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* More options */}
        <div className="flex flex-col items-center">
          <button className="instagram-button w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Instagram-style bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="flex items-center space-x-3 mb-3">
          {/* Profile picture */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">algorithm.deep</p>
            <p className="text-gray-300 text-xs">
              {context.escalationMode ? 'Reading your mind...' : 'AI-generated emotional content'}
            </p>
          </div>
          <button className="instagram-button border border-white px-4 py-1 rounded text-white text-sm font-medium hover:bg-white hover:text-black transition-colors">
            {userProfile.likedPhrases.length > 5 ? 'Following' : 'Follow'}
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-white text-sm">
            <span className="font-medium">algorithm.deep</span> {currentPhrase.text}
          </p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs text-gray-300">#{currentPhrase.theme}</span>
            <span className="text-xs text-gray-300">#intensity{currentPhrase.intensity}</span>
            <span className="text-xs text-gray-300">#deepthoughts</span>
            {currentPhrase.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-300">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Intensity indicator as progress bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Emotional Intensity</span>
            <span className="text-xs text-gray-400">{currentPhrase.intensity}/5</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-red-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentPhrase.intensity / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Algorithm insight overlay */}
      {showInsight && (
        <div className="absolute top-20 left-4 right-4 text-center z-10">
          <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-4 text-white text-sm animate-fade-in border border-red-500 border-opacity-30">
            <p className="opacity-90 text-red-300 font-medium">🔴 Algorithm Notice</p>
            <p className="opacity-80 mt-1">{generateAlgorithmInsight()}</p>
          </div>
        </div>
      )}

      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-opacity-70 z-10"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Session info (in escalation mode) */}
      {context.escalationMode && (
        <div className="absolute top-6 left-6 text-white text-opacity-70 text-xs bg-black bg-opacity-50 rounded p-2">
          <p>📊 Session: {userProfile.sessionDepth}</p>
          <p>⏱️ Time: {Math.floor(userProfile.timeSpent / 60)}m {userProfile.timeSpent % 60}s</p>
          <p>🎯 Level: {Math.ceil(userProfile.emotionalIntensityTolerance)}/5</p>
        </div>
      )}

      {/* Swipe hint */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-opacity-40 text-xs text-center">
        <p>↕️ Swipe to continue</p>
      </div>
    </div>
  );
} 