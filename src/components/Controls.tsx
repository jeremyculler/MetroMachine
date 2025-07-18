import React from 'react';
import { Preset, DrumKit } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  bpm: number;
  measures: number;
  beatsPerMeasure: number;
  subdivision: number;
  currentKit: string;
  currentPreset: string;
  fillEnabled: boolean;
  countInEnabled: boolean;
  accentVolumeReduction: number;
  presets: Preset[];
  kits: DrumKit[];
  onPlayPause: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
  onMeasuresChange: (measures: number) => void;
  onBeatsPerMeasureChange: (beats: number) => void;
  onSubdivisionChange: (subdivision: number) => void;
  onKitChange: (kitId: string) => void;
  onPresetChange: (presetId: string) => void;
  onFillToggle: (enabled: boolean) => void;
  onCountInToggle: (enabled: boolean) => void;
  onAccentVolumeChange: (reduction: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  bpm,
  measures,
  beatsPerMeasure,
  subdivision,
  currentKit,
  currentPreset,
  fillEnabled,
  countInEnabled,
  accentVolumeReduction,
  presets,
  kits,
  onPlayPause,
  onStop,
  onBpmChange,
  onMeasuresChange,
  onBeatsPerMeasureChange,
  onSubdivisionChange,
  onKitChange,
  onPresetChange,
  onFillToggle,
  onCountInToggle,
  onAccentVolumeChange,
}) => {
  return (
    <div className="controls">
      {/* Playback Section */}
      <div className="control-group">
        <h3>Playback</h3>
        <div className="control-grid">
          <button onClick={onPlayPause} className="play-btn">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={onStop} className="stop-btn">
            ⏹
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="control-group">
        <h3>Configuration</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>Preset</label>
            <select 
              value={currentPreset} 
              onChange={(e) => onPresetChange(e.target.value)}
            >
              {presets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>Kit</label>
            <select 
              value={currentKit} 
              onChange={(e) => onKitChange(e.target.value)}
            >
              {kits.map(kit => (
                <option key={kit.id} value={kit.id}>
                  {kit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pattern Section */}
      <div className="control-group">
        <h3>Pattern</h3>
        <div className="control-grid pattern-grid">
          <div className="control-item">
            <label>Measures</label>
            <input
              type="number"
              min="1"
              max="16"
              value={measures}
              onChange={(e) => onMeasuresChange(parseInt(e.target.value))}
            />
          </div>
          <div className="control-row">
            <div className="control-item">
              <label>Beats/Measure</label>
              <input
                type="number"
                min="2"
                max="8"
                value={beatsPerMeasure}
                onChange={(e) => onBeatsPerMeasureChange(parseInt(e.target.value))}
              />
            </div>
            <div className="control-item">
              <label>Subdivision</label>
              <input
                type="number"
                min="1"
                max="4"
                value={subdivision}
                onChange={(e) => onSubdivisionChange(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audio Section */}
      <div className="control-group">
        <h3>Audio</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>Tempo</label>
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => onBpmChange(parseInt(e.target.value))}
            />
            <span className="control-value">{bpm} BPM</span>
          </div>
          <div className="control-item">
            <label>Accent Volume</label>
            <input
              type="range"
              min="3"
              max="20"
              value={accentVolumeReduction}
              onChange={(e) => onAccentVolumeChange(parseInt(e.target.value))}
            />
            <span className="control-value">-{accentVolumeReduction}dB</span>
          </div>
        </div>
      </div>

      {/* Options Section */}
      <div className="control-group">
        <h3>Options</h3>
        <div className="control-grid">
          <div className="control-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={fillEnabled}
                onChange={(e) => onFillToggle(e.target.checked)}
              />
              Fill on Final Measure
            </label>
          </div>
          <div className="control-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={countInEnabled}
                onChange={(e) => onCountInToggle(e.target.checked)}
              />
              Count-In (1 measure)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};