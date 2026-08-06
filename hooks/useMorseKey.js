import { useCallback, useEffect, useRef, useState } from 'react';
import { getReverseMorseMap } from '../utils/morseCode';
import { startTone, stopTone } from '../utils/morseAudio';

// A reusable "virtual telegraph key": press-and-hold (mouse/touch/keyboard)
// sends dots/dashes, decoded live into a running text buffer. Short holds
// send a dot, longer holds send a dash; pausing finalizes a letter, pausing
// longer adds a word space (1/3/7-unit timing, matching the rest of the app).
export function useMorseKey({ language, wpm, frequency }) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentSymbols, setCurrentSymbols] = useState('');
  const [buffer, setBuffer] = useState('');

  const audioCtxRef = useRef(null);
  const toneRef = useRef(null);
  const pressStartRef = useRef(0);
  const letterTimeoutRef = useRef(null);
  const wordTimeoutRef = useRef(null);
  const isPressedRef = useRef(false);
  const symbolsRef = useRef('');
  const bufferRef = useRef('');
  const languageRef = useRef(language);
  const wpmRef = useRef(wpm);
  const frequencyRef = useRef(frequency);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);
  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  };

  const clearTimers = () => {
    if (letterTimeoutRef.current) {
      clearTimeout(letterTimeoutRef.current);
      letterTimeoutRef.current = null;
    }
    if (wordTimeoutRef.current) {
      clearTimeout(wordTimeoutRef.current);
      wordTimeoutRef.current = null;
    }
  };

  const finalizeLetter = useCallback(() => {
    letterTimeoutRef.current = null;
    const symbols = symbolsRef.current;
    if (!symbols) return;

    const reverseMap = getReverseMorseMap(languageRef.current);
    const char = reverseMap[symbols];
    bufferRef.current += char || '□';
    setBuffer(bufferRef.current);
    symbolsRef.current = '';
    setCurrentSymbols('');

    const unitMs = 1200 / wpmRef.current;
    wordTimeoutRef.current = setTimeout(() => {
      wordTimeoutRef.current = null;
      if (bufferRef.current !== '' && !bufferRef.current.endsWith(' ')) {
        bufferRef.current += ' ';
        setBuffer(bufferRef.current);
      }
    }, unitMs * 4); // remaining time to reach a 7-unit word gap
  }, []);

  const pressStart = useCallback(() => {
    if (isPressedRef.current) return;
    isPressedRef.current = true;
    setIsPressed(true);
    clearTimers();

    pressStartRef.current = performance.now();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    toneRef.current = startTone(ctx, frequencyRef.current);
  }, []);

  const pressEnd = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    setIsPressed(false);

    if (toneRef.current) {
      stopTone(toneRef.current);
      toneRef.current = null;
    }

    const durationMs = performance.now() - pressStartRef.current;
    const unitMs = 1200 / wpmRef.current;
    const symbol = durationMs < unitMs * 2 ? '.' : '-';
    symbolsRef.current += symbol;
    setCurrentSymbols(symbolsRef.current);

    letterTimeoutRef.current = setTimeout(finalizeLetter, unitMs * 3);
  }, [finalizeLetter]);

  const clearBuffer = useCallback(() => {
    clearTimers();
    symbolsRef.current = '';
    bufferRef.current = '';
    setCurrentSymbols('');
    setBuffer('');
  }, []);

  // Reads the current buffer and resets it to empty (for "send" actions).
  const consumeBuffer = useCallback(() => {
    const text = bufferRef.current.trim();
    bufferRef.current = '';
    setBuffer('');
    return text;
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (toneRef.current) stopTone(toneRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return { isPressed, currentSymbols, buffer, pressStart, pressEnd, clearBuffer, consumeBuffer };
}
