# 🥁 Drum Machine

https://jeremyculler.github.io/MetroMachine/

A React-based drum machine with step sequencer, pattern presets, and real-time BPM control.

## Features

- **Step Sequencer**: 16-step grid with accent support
- **Pattern Presets**: Rock and Blues patterns with different measures
- **Fill System**: Separate pattern for final measure
- **Real-time BPM Control**: Change tempo during playback
- **Multiple Kits**: Extensible drum kit system
- **Visual Feedback**: Beat highlighting and measure counter

## Getting Started

```bash
npm install
npm run dev
```

## Adding a Drum Kit

To add a new drum kit to the application:

### 1. Create Audio Files Directory

Create a new directory in `public/sounds/` with your kit name:

```
public/sounds/your-kit-name/
├── crash.wav
├── ride.wav
├── tom1.wav
├── tom2.wav
├── hihat-open.wav
├── hihat-closed.wav
├── snare.wav
└── bass.wav
```

### 2. Update drums.json Configuration

Add your kit to `src/config/drums.json` in the `kits` array:

```json
{
  "drums": [
    // ... existing drum definitions
  ],
  "kits": [
    {
      "id": "basic",
      "name": "Basic Kit",
      "path": "/sounds/basic/",
      "sounds": {
        "crash": "crash.wav",
        "ride": "ride.wav",
        "tom1": "tom1.wav",
        "tom2": "tom2.wav",
        "hihat-open": "hihat-open.wav",
        "hihat-closed": "hihat-closed.wav",
        "snare": "snare.wav",
        "bass": "bass.wav"
      }
    },
    {
      "id": "your-kit-name",
      "name": "Your Kit Display Name",
      "path": "/sounds/your-kit-name/",
      "sounds": {
        "crash": "crash.wav",
        "ride": "ride.wav",
        "tom1": "tom1.wav",
        "tom2": "tom2.wav",
        "hihat-open": "hihat-open.wav",
        "hihat-closed": "hihat-closed.wav",
        "snare": "snare.wav",
        "bass": "bass.wav"
      }
    }
  ]
}
```

### 3. Required Audio Files

Each kit must include these 8 audio files:

| File | Drum | Description |
|------|------|-------------|
| `crash.wav` | Crash Cymbal | Crash cymbal sound |
| `ride.wav` | Ride Cymbal | Ride cymbal sound |
| `tom1.wav` | Tom 1 | High tom sound |
| `tom2.wav` | Tom 2 | Low tom sound |
| `hihat-open.wav` | Hi-Hat Open | Open hi-hat sound |
| `hihat-closed.wav` | Hi-Hat Closed | Closed hi-hat sound |
| `snare.wav` | Snare | Snare drum sound |
| `bass.wav` | Bass | Bass drum/kick sound |

### 4. Audio File Requirements

- **Format**: WAV, MP3, or other web-compatible formats
- **Length**: Keep samples under 2-3 seconds for best performance
- **Quality**: 44.1kHz/16-bit recommended
- **Volume**: Normalize levels across all samples in the kit

### 5. File Structure Example

```
public/sounds/
├── basic/
│   ├── crash.wav
│   ├── ride.wav
│   ├── tom1.wav
│   ├── tom2.wav
│   ├── hihat-open.wav
│   ├── hihat-closed.wav
│   ├── snare.wav
│   └── bass.wav
└── your-kit-name/
    ├── crash.wav
    ├── ride.wav
    ├── tom1.wav
    ├── tom2.wav
    ├── hihat-open.wav
    ├── hihat-closed.wav
    ├── snare.wav
    └── bass.wav
```

### 6. Testing Your Kit

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Use the kit selector in the controls to switch to your new kit
4. Test each drum by clicking the grid buttons
5. Verify all sounds load properly (check browser console for errors)

### Notes

- The application will gracefully handle missing audio files
- Kit switching preserves the current pattern
- Audio files are loaded asynchronously when the kit is selected
- Large audio files may cause loading delays

## Setting Up the Basic Kit

The drum machine comes with a pre-configured "Basic Kit" that requires 8 audio files to be placed in the correct directory with specific naming conventions.

### Required File Structure

Create the following directory structure in your project:

```
public/sounds/basic/
├── crash.wav
├── ride.wav
├── tom1.wav
├── tom2.wav
├── hihat-open.wav
├── hihat-closed.wav
├── snare.wav
└── bass.wav
```

### File Naming Convention

The files must be named **exactly** as shown below (case-sensitive):

| Required Filename | Drum Component | Description |
|-------------------|----------------|-------------|
| `crash.wav` | Crash Cymbal | Loud, explosive cymbal crash sound |
| `ride.wav` | Ride Cymbal | Sustained, shimmering cymbal for rhythm |
| `tom1.wav` | High Tom | Higher-pitched tom drum |
| `tom2.wav` | Low Tom | Lower-pitched tom drum |
| `hihat-open.wav` | Open Hi-Hat | Open hi-hat cymbal sound |
| `hihat-closed.wav` | Closed Hi-Hat | Closed/tight hi-hat sound |
| `snare.wav` | Snare Drum | Sharp, crackling snare drum hit |
| `bass.wav` | Bass Drum | Deep, punchy kick drum sound |

### Important Notes

- **File names are case-sensitive** - use exactly the names shown above
- **Directory path must be exact** - files go in `public/sounds/basic/`
- **File extensions** - currently configured for `.wav` files, but other web formats (MP3, OGG) should work
- **Missing files** - the application will gracefully handle missing files and show warnings in the browser console

### Quick Setup Steps

1. Create the directory: `public/sounds/basic/`
2. Add your 8 audio files with the exact names listed above
3. Start the development server: `npm run dev`
4. Select "Basic Kit" in the drum machine interface
5. Test each drum by clicking the grid buttons

### Troubleshooting

- **No sound playing**: Check browser console for loading errors
- **Files not loading**: Verify file names match exactly (case-sensitive)
- **Wrong directory**: Ensure files are in `public/sounds/basic/` not `src/sounds/basic/`
- **"Unable to decode audio data" error**: 
  - Files may be corrupted - test them in an audio player first
  - Re-export as standard WAV: 44.1kHz, 16-bit, PCM encoding
  - Try MP3 format as alternative (update file extensions in `src/config/drums.json`)
  - Avoid files with unusual codecs or compression
- **File format issues**: Stick to standard WAV (PCM) or MP3 formats
