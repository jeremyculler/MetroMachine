# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based drum machine application built with TypeScript, Vite, and Tone.js. It features a step sequencer interface with preset patterns, fill system, and configurable drum kits.

## Commands

### Development
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Testing
```bash
npm test           # Run tests (not implemented yet)
```

## Architecture

### Core Components
- **App.tsx** - Main application component that orchestrates all functionality
- **DrumGrid.tsx** - Step sequencer grid interface for programming beats
- **FillGrid.tsx** - Secondary grid for fill patterns on the final measure
- **Controls.tsx** - Transport controls, tempo, preset selection, and configuration
- **MeasureCounter.tsx** - Visual display of current measure and beat position

### Core Hooks
- **useDrumMachine.ts** - Main state management for patterns, presets, and configuration
- **useAudioEngine.ts** - Handles Tone.js audio playback, scheduling, and timing

### Configuration
- **drums.json** - Defines available drums and drum kits
- **presets.json** - Contains preset patterns (Rock, Swing) with beat configurations

### Key Features
- **Step Sequencer**: Click-based beat programming with accent toggles
- **Fill System**: Secondary pattern that plays on the final measure when enabled
- **Preset System**: Pre-configured patterns that maintain BPM and fill state when switched
- **Configurable Timing**: Adjustable beats per measure, subdivision, and measure count
- **Audio Engine**: Precise timing using Tone.js Transport system

### Audio Implementation
- Uses Tone.js for audio playback and scheduling
- Supports multiple drum kits via JSON configuration
- Handles accent variations through volume control
- Graceful fallback when audio files are missing

### Pattern Data Structure
Patterns are stored as nested objects:
```typescript
{
  [drumId]: {
    [beatPosition]: {
      enabled: boolean,
      accent: boolean
    }
  }
}
```

Beat positions are formatted as "beat.subdivision" (e.g., "1.1", "2.3").

## Development Notes

- Audio files should be placed in `/public/sounds/[kitname]/` directory
- New drum kits can be added by updating `drums.json` and adding corresponding audio files
- New presets can be added by updating `presets.json` with pattern definitions
- The app handles missing audio files gracefully by hiding unavailable drums