import { useState, useEffect, useCallback, useRef } from 'react';
import { GesturePoint } from '../types';

export const useGestureRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [gesturePoints, setGesturePoints] = useState<GesturePoint[]>([]);
  const [recognizedGesture, setRecognizedGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const gestureTimeoutRef = useRef<NodeJS.Timeout>();

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setGesturePoints([]);
    setRecognizedGesture(null);
    setConfidence(0);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (gesturePoints.length > 0) {
      const gesture = recognizeGesture(gesturePoints);
      setRecognizedGesture(gesture.name);
      setConfidence(gesture.confidence);
    }
  }, [gesturePoints]);

  const addPoint = useCallback((x: number, y: number) => {
    if (!isRecording) return;

    const point: GesturePoint = {
      x,
      y,
      timestamp: Date.now()
    };

    setGesturePoints(prev => [...prev, point]);

    // Clear timeout and set new one
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }

    gestureTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 1000);
  }, [isRecording, stopRecording]);

  const recognizeGesture = (points: GesturePoint[]): { name: string; confidence: number } => {
    if (points.length < 3) return { name: 'unknown', confidence: 0 };

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const midPoint = points[Math.floor(points.length / 2)];

    const deltaX = lastPoint.x - firstPoint.x;
    const deltaY = lastPoint.y - firstPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Simple gesture recognition patterns
    if (distance < 50) {
      return { name: 'tap', confidence: 0.9 };
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 100) return { name: 'swipe_right', confidence: 0.8 };
      if (deltaX < -100) return { name: 'swipe_left', confidence: 0.8 };
    } else {
      if (deltaY > 100) return { name: 'swipe_down', confidence: 0.8 };
      if (deltaY < -100) return { name: 'swipe_up', confidence: 0.8 };
    }

    // Check for circular motion
    const centerX = (firstPoint.x + lastPoint.x) / 2;
    const centerY = (firstPoint.y + lastPoint.y) / 2;
    let circularScore = 0;

    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i];
      const dist = Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
      if (dist > 50 && dist < 150) circularScore++;
    }

    if (circularScore > points.length * 0.6) {
      return { name: 'circle', confidence: 0.7 };
    }

    return { name: 'unknown', confidence: 0.3 };
  };

  const clearGesture = useCallback(() => {
    setRecognizedGesture(null);
    setConfidence(0);
    setGesturePoints([]);
  }, []);

  useEffect(() => {
    return () => {
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    gesturePoints,
    recognizedGesture,
    confidence,
    startRecording,
    stopRecording,
    addPoint,
    clearGesture
  };
};