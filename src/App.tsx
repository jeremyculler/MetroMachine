import React, { useEffect } from 'react';
import { Controls } from './components/Controls';
import { MeasureCounter } from './components/MeasureCounter';
import { DrumGrid } from './components/DrumGrid';
import { FillGrid } from './components/FillGrid';
import { CountdownOverlay } from './components/CountdownOverlay';
import { useDrumMachine } from './hooks/useDrumMachine';
import { useAudioEngine } from './hooks/useAudioEngine';
import './App.css';

function App() {
  const { state, drums, kits, presets, actions } = useDrumMachine();
  const currentKit = kits.find(kit => kit.id === state.currentKit) || null;
  
  const { isPlaying, isCountingIn, currentBeat, currentMeasure, currentSubBeat, start, startWithoutCountIn, stop, pause, playDrum } = useAudioEngine(
    drums,
    currentKit,
    state.pattern,
    state.fillPattern,
    state.bpm,
    state.beatsPerMeasure,
    state.subdivision,
    state.measures,
    state.fillEnabled,
    state.countInEnabled,
    state.accentVolumeReduction,
    actions.updateBeatPosition
  );

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      start();
    }
  };

  const handleStop = () => {
    stop();
  };

  const handlePresetChange = (presetId: string) => {
    actions.loadPreset(presetId);
    actions.setState(prev => ({ ...prev, bpm: prev.bpm }));
  };

  const handleToggleDrum = (drumId: string, beatPosition: string) => {
    actions.toggleDrum(drumId, beatPosition, false);
  };

  const handleToggleAccent = (drumId: string, beatPosition: string) => {
    actions.toggleAccent(drumId, beatPosition, false);
  };

  const handleToggleFillDrum = (drumId: string, beatPosition: string) => {
    actions.toggleDrum(drumId, beatPosition, true);
  };

  const handleToggleFillAccent = (drumId: string, beatPosition: string) => {
    actions.toggleAccent(drumId, beatPosition, true);
  };

  const handleToggleBeatAccent = (beat: number) => {
    actions.toggleBeatAccent(beat, false);
  };

  const handleToggleFillBeatAccent = (beat: number) => {
    actions.toggleBeatAccent(beat, true);
  };

  const handleToggleColumnAccent = (beatPosition: string) => {
    actions.toggleColumnAccent(beatPosition, false);
  };

  const handleToggleFillColumnAccent = (beatPosition: string) => {
    actions.toggleColumnAccent(beatPosition, true);
  };

  const handleBpmChange = (bpm: number) => {
    actions.setState(prev => ({ ...prev, bpm }));
  };

  const handleMeasuresChange = (measures: number) => {
    actions.setState(prev => ({ ...prev, measures }));
  };

  const handleBeatsPerMeasureChange = (beatsPerMeasure: number) => {
    actions.setState(prev => ({ ...prev, beatsPerMeasure }));
  };

  const handleSubdivisionChange = (subdivision: number) => {
    actions.setState(prev => ({ ...prev, subdivision }));
  };

  const handleKitChange = (kitId: string) => {
    actions.setState(prev => ({ ...prev, currentKit: kitId }));
  };

  const handleFillToggle = (enabled: boolean) => {
    actions.setState(prev => ({ ...prev, fillEnabled: enabled }));
  };

  const handleAccentVolumeChange = (reduction: number) => {
    actions.setState(prev => ({ ...prev, accentVolumeReduction: reduction }));
  };

  const handleCountInToggle = (enabled: boolean) => {
    actions.setState(prev => ({ ...prev, countInEnabled: enabled }));
  };

  const handleDrumPreview = (drumId: string) => {
    playDrum(drumId, false); // Play drum without accent
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (event.code === 'Space') {
        event.preventDefault();
        handlePlayPause();
        return;
      }
      
      // Number keys 1-8 for drum preview
      const numberKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8'];
      const keyIndex = numberKeys.indexOf(event.code);
      
      if (keyIndex !== -1 && keyIndex < drums.length) {
        event.preventDefault();
        const drumId = drums[keyIndex].id;
        handleDrumPreview(drumId);
        
        // Add visual feedback to the drum label
        const drumLabels = document.querySelectorAll('.drum-label.clickable');
        const targetLabel = drumLabels[keyIndex] as HTMLElement;
        if (targetLabel) {
          targetLabel.classList.add('pressed');
          setTimeout(() => {
            targetLabel.classList.remove('pressed');
          }, 150);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, drums, handleDrumPreview]);

  // Auto-scroll to main groove table when countdown finishes
  useEffect(() => {
    if (!isCountingIn && isPlaying) {
      // Small delay to ensure overlay has finished fading out
      setTimeout(() => {
        const mainGrooveTable = document.getElementById('main-groove-table');
        if (mainGrooveTable) {
          mainGrooveTable.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 400);
    }
  }, [isCountingIn, isPlaying]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>MetroMachine</h1>
        <MeasureCounter
          currentMeasure={currentMeasure}
          totalMeasures={state.measures}
          currentBeat={currentBeat}
          beatsPerMeasure={state.beatsPerMeasure}
          isPlaying={isPlaying}
          isCountingIn={isCountingIn}
        />
      </header>

      <CountdownOverlay
        isVisible={isCountingIn}
        currentBeat={currentBeat}
        beatsPerMeasure={state.beatsPerMeasure}
      />

      <main className="app-main">
        <Controls
          isPlaying={isPlaying}
          bpm={state.bpm}
          measures={state.measures}
          beatsPerMeasure={state.beatsPerMeasure}
          subdivision={state.subdivision}
          currentKit={state.currentKit}
          currentPreset={state.currentPreset}
          fillEnabled={state.fillEnabled}
          countInEnabled={state.countInEnabled}
          accentVolumeReduction={state.accentVolumeReduction}
          presets={presets}
          kits={kits}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onBpmChange={handleBpmChange}
          onMeasuresChange={handleMeasuresChange}
          onBeatsPerMeasureChange={handleBeatsPerMeasureChange}
          onSubdivisionChange={handleSubdivisionChange}
          onKitChange={handleKitChange}
          onPresetChange={handlePresetChange}
          onFillToggle={handleFillToggle}
          onCountInToggle={handleCountInToggle}
          onAccentVolumeChange={handleAccentVolumeChange}
        />

        <div className="grid-container">
          <div className="main-grid">
            <h2>Main Pattern</h2>
            <DrumGrid
              id="main-groove-table"
              drums={drums}
              pattern={state.pattern}
              beatsPerMeasure={state.beatsPerMeasure}
              subdivision={state.subdivision}
              currentBeat={state.fillEnabled && currentMeasure === state.measures ? 0 : currentBeat}
              currentSubBeat={state.fillEnabled && currentMeasure === state.measures ? 0 : currentSubBeat}
              currentMeasure={currentMeasure}
              isPlaying={isPlaying}
              onToggleDrum={handleToggleDrum}
              onToggleAccent={handleToggleAccent}
              onToggleBeatAccent={handleToggleBeatAccent}
              onToggleColumnAccent={handleToggleColumnAccent}
              onDrumPreview={handleDrumPreview}
            />
          </div>

          {state.fillEnabled && (
            <div className="fill-grid-container">
              <FillGrid
                drums={drums}
                fillPattern={state.fillPattern}
                beatsPerMeasure={state.beatsPerMeasure}
                subdivision={state.subdivision}
                currentBeat={currentBeat}
                currentSubBeat={currentSubBeat}
                currentMeasure={currentMeasure}
                totalMeasures={state.measures}
                fillEnabled={state.fillEnabled}
                isPlaying={isPlaying}
                onToggleDrum={handleToggleFillDrum}
                onToggleAccent={handleToggleFillAccent}
                onToggleBeatAccent={handleToggleFillBeatAccent}
                onToggleColumnAccent={handleToggleFillColumnAccent}
                onDrumPreview={handleDrumPreview}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;