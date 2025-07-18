import React from 'react';

interface CountdownOverlayProps {
  isVisible: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  isVisible,
  currentBeat,
  beatsPerMeasure,
}) => {
  if (!isVisible) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-content">
        <div className="countdown-number">{currentBeat}</div>
        <div className="countdown-label">Count-In</div>
        <div className="countdown-dots">
          {Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
              key={i}
              className={`countdown-dot ${i + 1 === currentBeat ? 'active' : ''} ${i + 1 < currentBeat ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};