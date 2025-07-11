import React, { useRef, useEffect } from 'react';
import { GesturePoint } from '../types';
import { Hand, Zap } from 'lucide-react';

interface GestureAreaProps {
  isRecording: boolean;
  gesturePoints: GesturePoint[];
  recognizedGesture: string | null;
  confidence: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAddPoint: (x: number, y: number) => void;
  onClearGesture: () => void;
}

const GestureArea: React.FC<GestureAreaProps> = ({
  isRecording,
  gesturePoints,
  recognizedGesture,
  confidence,
  onStartRecording,
  onStopRecording,
  onAddPoint,
  onClearGesture
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gesturePoints.length > 1) {
      // Draw gesture trail
      ctx.strokeStyle = isRecording ? '#3B82F6' : '#10B981';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(gesturePoints[0].x, gesturePoints[0].y);

      for (let i = 1; i < gesturePoints.length; i++) {
        ctx.lineTo(gesturePoints[i].x, gesturePoints[i].y);
      }

      ctx.stroke();

      // Draw points
      gesturePoints.forEach((point, index) => {
        const opacity = (index + 1) / gesturePoints.length;
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [gesturePoints, isRecording]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onStartRecording();
    onAddPoint(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRecording) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onAddPoint(x, y);
  };

  const handleMouseUp = () => {
    if (isRecording) {
      onStopRecording();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    onStartRecording();
    onAddPoint(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isRecording) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    onAddPoint(x, y);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isRecording) {
      onStopRecording();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Hand className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Gesture Control</h3>
        </div>
        
        {recognizedGesture && (
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {recognizedGesture.replace('_', ' ')} ({Math.round(confidence * 100)}%)
            </span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className={`
          relative bg-gray-50 rounded-lg border-2 border-dashed transition-all duration-300
          ${isRecording ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${recognizedGesture ? 'border-green-400 bg-green-50' : ''}
          cursor-crosshair select-none
        `}
        style={{ height: '300px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {!isRecording && gesturePoints.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Hand className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Draw a gesture to control devices</p>
              <p className="text-sm text-gray-400 mt-1">
                Try: swipe, tap, circle, or custom patterns
              </p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Recording...
          </div>
        )}
      </div>

      {recognizedGesture && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Recognized: <span className="font-medium">{recognizedGesture.replace('_', ' ')}</span>
          </div>
          <button
            onClick={onClearGesture}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Gesture Commands:</strong></p>
        <ul className="mt-1 space-y-1">
          <li>• Swipe Right: Turn on lights</li>
          <li>• Swipe Left: Turn off lights</li>
          <li>• Swipe Up: Increase temperature</li>
          <li>• Swipe Down: Decrease temperature</li>
          <li>• Circle: Toggle security system</li>
          <li>• Tap: Select device</li>
        </ul>
      </div>
    </div>
  );
};

export default GestureArea;