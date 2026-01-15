'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  wordsPerMinute?: number; // Reading speed in words per minute
  delay?: number; // Initial delay before starting in ms
  onComplete?: () => void;
}

export const TypewriterText = ({
  text,
  className = '',
  style = {},
  wordsPerMinute = 200, // Average reading speed
  delay = 0,
  onComplete
}: TypewriterTextProps) => {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Split text into words while preserving line breaks
  const words = text.split(/(\s+)/).filter(word => word.length > 0);
  const actualWords = words.filter(word => word.trim().length > 0);

  // Calculate interval between words (ms per word)
  const msPerWord = (60 * 1000) / wordsPerMinute;

  useEffect(() => {
    // Reset when text changes
    setVisibleWordCount(0);
    setHasStarted(false);

    // Initial delay before starting
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (visibleWordCount < actualWords.length) {
      const timer = setTimeout(() => {
        setVisibleWordCount(prev => prev + 1);
      }, msPerWord);

      return () => clearTimeout(timer);
    } else if (onComplete && visibleWordCount === actualWords.length) {
      onComplete();
    }
  }, [hasStarted, visibleWordCount, actualWords.length, msPerWord, onComplete]);

  // Build the visible text
  let wordIndex = 0;
  const renderedText = words.map((word, i) => {
    if (word.trim().length === 0) {
      // Whitespace - always show
      return <span key={i}>{word}</span>;
    }

    const isVisible = wordIndex < visibleWordCount;
    wordIndex++;

    return (
      <span
        key={i}
        className={`transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {word}
      </span>
    );
  });

  return (
    <span className={className} style={style}>
      {renderedText}
    </span>
  );
};
