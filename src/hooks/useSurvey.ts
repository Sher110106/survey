'use client';

import { useState, useEffect, useCallback } from 'react';
import { ideas } from '@/data/ideas';
import { categories, DEFAULT_SCORE, Category } from '@/data/categories';

export interface IdeaRatings {
  [categoryId: string]: number | { [subId: string]: number };
}

export interface SurveyState {
  ratings: { [ideaId: number]: IdeaRatings };
  currentIdeaIndex: number;
  isComplete: boolean;
}

const STORAGE_KEY = 'smart-blinds-survey';

function getInitialState(): SurveyState {
  if (typeof window === 'undefined') {
    return {
      ratings: {},
      currentIdeaIndex: 0,
      isComplete: false
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, return default
    }
  }
  
  return {
    ratings: {},
    currentIdeaIndex: 0,
    isComplete: false
  };
}

export function useSurvey() {
  const [state, setState] = useState<SurveyState>(getInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        // Invalid stored data
      }
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const setRating = useCallback((ideaId: number, categoryId: string, value: number | { [subId: string]: number }) => {
    setState(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [ideaId]: {
          ...prev.ratings[ideaId],
          [categoryId]: value
        }
      }
    }));
  }, []);

  const nextIdea = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIdeaIndex: Math.min(prev.currentIdeaIndex + 1, ideas.length - 1)
    }));
  }, []);

  const prevIdea = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIdeaIndex: Math.max(prev.currentIdeaIndex - 1, 0)
    }));
  }, []);

  const goToIdea = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentIdeaIndex: Math.max(0, Math.min(index, ideas.length - 1))
    }));
  }, []);

  const markComplete = useCallback(() => {
    setState(prev => ({ ...prev, isComplete: true }));
  }, []);

  const resetSurvey = useCallback(() => {
    setState({
      ratings: {},
      currentIdeaIndex: 0,
      isComplete: false
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Calculate weighted score for an idea
  const calculateScore = useCallback((ideaId: number): number => {
    const ideaRatings = state.ratings[ideaId];
    if (!ideaRatings) return DEFAULT_SCORE;

    let totalScore = 0;
    let hasRatings = false;

    for (const category of categories) {
      const rating = ideaRatings[category.id];
      
      if (rating === undefined) {
        totalScore += DEFAULT_SCORE * category.weight;
      } else if (typeof rating === 'number') {
        totalScore += rating * category.weight;
        hasRatings = true;
      } else {
        // Design Integrity with sub-principles
        const subValues = Object.values(rating);
        if (subValues.length > 0) {
          // Check for critical failure (functionality or durability < 4)
          const functionality = rating['functionality'] || DEFAULT_SCORE;
          const durability = rating['durability'] || DEFAULT_SCORE;
          let avg = subValues.reduce((a, b) => a + b, 0) / subValues.length;
          
          if (functionality < 4 || durability < 4) {
            avg = Math.min(avg, 4);
          }
          
          totalScore += avg * category.weight;
          hasRatings = true;
        } else {
          totalScore += DEFAULT_SCORE * category.weight;
        }
      }
    }

    return hasRatings ? Math.round(totalScore * 10) / 10 : DEFAULT_SCORE;
  }, [state.ratings]);

  // Get category score for an idea
  const getCategoryScore = useCallback((ideaId: number, categoryId: string): number => {
    const ideaRatings = state.ratings[ideaId];
    if (!ideaRatings) return DEFAULT_SCORE;

    const rating = ideaRatings[categoryId];
    if (rating === undefined) return DEFAULT_SCORE;

    if (typeof rating === 'number') return rating;

    // Design Integrity with sub-principles
    const subValues = Object.values(rating);
    if (subValues.length === 0) return DEFAULT_SCORE;

    const functionality = rating['functionality'] || DEFAULT_SCORE;
    const durability = rating['durability'] || DEFAULT_SCORE;
    let avg = subValues.reduce((a, b) => a + b, 0) / subValues.length;

    if (functionality < 4 || durability < 4) {
      avg = Math.min(avg, 4);
    }

    return Math.round(avg * 10) / 10;
  }, [state.ratings]);

  // Get all scores for results
  const getAllScores = useCallback(() => {
    return ideas.map(idea => ({
      id: idea.id,
      name: idea.name,
      totalScore: calculateScore(idea.id),
      categoryScores: categories.reduce((acc, cat) => ({
        ...acc,
        [cat.id]: getCategoryScore(idea.id, cat.id)
      }), {} as { [key: string]: number })
    }));
  }, [calculateScore, getCategoryScore]);

  return {
    state,
    isHydrated,
    currentIdea: ideas[state.currentIdeaIndex],
    totalIdeas: ideas.length,
    setRating,
    nextIdea,
    prevIdea,
    goToIdea,
    markComplete,
    resetSurvey,
    calculateScore,
    getCategoryScore,
    getAllScores
  };
}
