import { useState, useEffect, useCallback } from 'react';
import { Phrase, phrases } from '../data/phrases';

interface UserProfile {
  likedPhrases: string[];
  preferredThemes: Record<string, number>; // theme -> weight
  preferredTags: Record<string, number>; // tag -> weight  
  emotionalIntensityTolerance: number; // 1-5, starts at 1
  sessionDepth: number; // how deep into the session
  timeSpent: number; // seconds on app
}

interface RecommendationContext {
  lastShownPhrases: string[];
  consecutiveThemeStreak: number;
  currentTheme?: string;
  escalationMode: boolean; // when algorithm gets more aggressive
}

export const useRecommendationEngine = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    likedPhrases: [],
    preferredThemes: {},
    preferredTags: {},
    emotionalIntensityTolerance: 1,
    sessionDepth: 0,
    timeSpent: 0
  });

  const [context, setContext] = useState<RecommendationContext>({
    lastShownPhrases: [],
    consecutiveThemeStreak: 0,
    escalationMode: false
  });

  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);

  // Track time spent on app
  useEffect(() => {
    const interval = setInterval(() => {
      setUserProfile(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Like a phrase - this is where the algorithm learns
  const likePhrase = useCallback((phrase: Phrase) => {
    setUserProfile(prev => {
      const newProfile = { ...prev };
      
      // Add to liked phrases
      newProfile.likedPhrases.push(phrase.id);
      
      // Increase theme preference
      newProfile.preferredThemes[phrase.theme] = 
        (newProfile.preferredThemes[phrase.theme] || 0) + 1;
      
      // Increase tag preferences
      phrase.tags.forEach(tag => {
        newProfile.preferredTags[tag] = 
          (newProfile.preferredTags[tag] || 0) + 1;
      });
      
      // Gradually increase intensity tolerance based on liked content
      if (phrase.intensity >= newProfile.emotionalIntensityTolerance) {
        newProfile.emotionalIntensityTolerance = Math.min(5, 
          newProfile.emotionalIntensityTolerance + 0.2);
      }
      
      return newProfile;
    });

    // Trigger escalation mode if user is engaging heavily
    if (userProfile.likedPhrases.length >= 3) {
      setContext(prev => ({ ...prev, escalationMode: true }));
    }
  }, [userProfile.likedPhrases.length]);

  // Skip a phrase - negative signal
  const skipPhrase = useCallback((phrase: Phrase) => {
    setUserProfile(prev => {
      const newProfile = { ...prev };
      
      // Slightly decrease theme preference
      newProfile.preferredThemes[phrase.theme] = 
        Math.max(0, (newProfile.preferredThemes[phrase.theme] || 0) - 0.1);
      
      return newProfile;
    });
  }, []);

  // Calculate phrase score based on user profile
  const calculatePhraseScore = useCallback((phrase: Phrase): number => {
    let score = 0;
    
    // Don't show recently seen phrases
    if (context.lastShownPhrases.includes(phrase.id)) {
      return -1;
    }
    
    // Don't show already liked phrases
    if (userProfile.likedPhrases.includes(phrase.id)) {
      return -1;
    }
    
    // Theme preference score
    const themeWeight = userProfile.preferredThemes[phrase.theme] || 0;
    score += themeWeight * 10;
    
    // Tag preference score
    phrase.tags.forEach(tag => {
      const tagWeight = userProfile.preferredTags[tag] || 0;
      score += tagWeight * 5;
    });
    
    // Intensity scoring - gradually introduce deeper content
    const intensityDiff = phrase.intensity - userProfile.emotionalIntensityTolerance;
    if (intensityDiff <= 0) {
      score += 20; // Prefer content at or below tolerance
    } else if (intensityDiff <= 1) {
      score += 10; // Slightly push boundaries
    } else {
      score -= intensityDiff * 10; // Penalize too-intense content
    }
    
    // Escalation mode - actively seek deeper content
    if (context.escalationMode) {
      score += phrase.intensity * 5;
      
      // Prefer meta phrases in escalation mode
      if (phrase.theme === 'meta') {
        score += 15;
      }
    }
    
    // Session depth bonus - get more aggressive over time
    score += userProfile.sessionDepth * 2;
    
    // Time spent bonus - longer sessions get more intense content
    if (userProfile.timeSpent > 60) { // After 1 minute
      score += phrase.intensity * 3;
    }
    
    // Consecutive theme streak management
    if (context.currentTheme === phrase.theme && context.consecutiveThemeStreak >= 2) {
      score -= 10; // Avoid too much of the same theme
    }
    
    return score;
  }, [userProfile, context]);

  // Get next recommended phrase
  const getNextPhrase = useCallback((): Phrase => {
    // Calculate scores for all phrases
    const scoredPhrases = phrases
      .map(phrase => ({
        phrase,
        score: calculatePhraseScore(phrase)
      }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score);
    
    // If no good matches, fall back to random appropriate content
    if (scoredPhrases.length === 0) {
      const fallbackPhrases = phrases.filter(p => 
        p.intensity <= Math.ceil(userProfile.emotionalIntensityTolerance) &&
        !userProfile.likedPhrases.includes(p.id) &&
        !context.lastShownPhrases.includes(p.id)
      );
      
      if (fallbackPhrases.length > 0) {
        return fallbackPhrases[Math.floor(Math.random() * fallbackPhrases.length)];
      }
      
      // Absolute fallback
      return phrases[0];
    }
    
    // Weighted selection from top scoring phrases
    const topCandidates = scoredPhrases.slice(0, Math.min(5, scoredPhrases.length));
    const weights = topCandidates.map((_, i) => topCandidates.length - i);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < topCandidates.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return topCandidates[i].phrase;
      }
    }
    
    return topCandidates[0].phrase;
  }, [calculatePhraseScore, userProfile, context]);

  // Show next phrase
  const showNextPhrase = useCallback(() => {
    const nextPhrase = getNextPhrase();
    
    setCurrentPhrase(nextPhrase);
    
    setContext(prev => ({
      ...prev,
      lastShownPhrases: [...prev.lastShownPhrases.slice(-4), nextPhrase.id], // Keep last 5
      consecutiveThemeStreak: prev.currentTheme === nextPhrase.theme ? 
        prev.consecutiveThemeStreak + 1 : 0,
      currentTheme: nextPhrase.theme
    }));
    
    setUserProfile(prev => ({
      ...prev,
      sessionDepth: prev.sessionDepth + 1
    }));
  }, [getNextPhrase]);

  // Initialize with first phrase
  useEffect(() => {
    if (!currentPhrase) {
      showNextPhrase();
    }
  }, [currentPhrase, showNextPhrase]);

  // Generate insight about what the algorithm "knows"
  const generateAlgorithmInsight = useCallback((): string | null => {
    const { likedPhrases, preferredThemes, timeSpent } = userProfile;
    
    if (likedPhrases.length < 2) return null;
    
    const topTheme = Object.entries(preferredThemes)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    const insights = [
      "I notice you resonate with themes of " + topTheme,
      "You've been here for " + Math.floor(timeSpent / 60) + " minutes. I'm learning.",
      "Your engagement pattern suggests deep emotional availability",
      "You're drawn to intensity level " + Math.ceil(userProfile.emotionalIntensityTolerance),
      "I see patterns in what makes you pause and reflect"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }, [userProfile]);

  return {
    currentPhrase,
    likePhrase,
    skipPhrase,
    showNextPhrase,
    userProfile,
    context,
    generateAlgorithmInsight
  };
}; 