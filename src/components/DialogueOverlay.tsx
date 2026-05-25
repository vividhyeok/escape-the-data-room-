import { useEffect, useState, useRef, useCallback } from "react";
import { dialogues } from "../data/story";
import { useGameStore } from "../store/gameStore";
import { SoundEngine } from "../utils/SoundEngine";

export function DialogueOverlay(): React.JSX.Element | null {
  const currentDialogueId = useGameStore((state) => state.currentDialogueId);
  const setDialogue = useGameStore((state) => state.setDialogue);
  const textSpeed = useGameStore((state) => state.textSpeed);
  
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<number | null>(null);

  const currentStory = currentDialogueId ? dialogues[currentDialogueId] : null;
  const lines = currentStory ? currentStory.lines : [];
  const currentLine = lines[lineIndex] ?? null;

  useEffect(() => {
    if (currentDialogueId) {
      setLineIndex(0);
      setDisplayedText("");
    }
  }, [currentDialogueId]);

  useEffect(() => {
    if (!currentLine) return;
    
    if (typingTimer.current) window.clearInterval(typingTimer.current);

    if (textSpeed === "instant") {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let charIndex = 0;
    
    let speedMs = 50;
    if (textSpeed === "fast") speedMs = 20;
    else if (textSpeed === "slow") speedMs = 100;

    typingTimer.current = window.setInterval(() => {
      setDisplayedText(currentLine.text.slice(0, charIndex + 1));
      SoundEngine.playType();
      charIndex++;
      if (charIndex >= currentLine.text.length) {
        setIsTyping(false);
        if (typingTimer.current) window.clearInterval(typingTimer.current);
      }
    }, speedMs);

    return () => {
      if (typingTimer.current) window.clearInterval(typingTimer.current);
    };
  }, [currentLine, lineIndex, textSpeed]);

  const handleNext = useCallback(() => {
    if (!currentLine) {
      setDialogue(null);
      return;
    }
    if (isTyping) {
      if (typingTimer.current) window.clearInterval(typingTimer.current);
      setDisplayedText(currentLine.text);
      setIsTyping(false);
    } else {
      if (lineIndex < lines.length - 1) {
        setLineIndex((prev) => prev + 1);
      } else {
        setDialogue(null);
      }
    }
  }, [currentLine, isTyping, lineIndex, lines.length, setDialogue]);

  useEffect(() => {
    if (!currentDialogueId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDialogueId, handleNext]);

  // All hooks are above — safe to return early now
  if (!currentDialogueId || !currentLine) return null;

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue(null);
  };

  return (
    <div className="dialogue-overlay" onClick={handleNext}>
      <div className="dialogue-box">
        <button className="dialogue-skip" onClick={handleSkip} type="button">SKIP</button>
        {currentLine.speaker && <div className="dialogue-speaker">{currentLine.speaker}</div>}
        <div className="dialogue-text">
          {displayedText}
          <span className="hacker-cursor">█</span>
        </div>
        {!isTyping && <div className="dialogue-prompt">▼</div>}
      </div>
    </div>
  );
}
