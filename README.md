# DEEP - A Media Art Installation

**An experimental commentary on algorithmic emotional manipulation in social media**

## Overview

DEEP is an interactive media art installation that mimics social media feeds (like TikTok/Reels) but serves emotional phrases instead of videos. The installation explores how recommendation algorithms learn from user behavior and progressively show more intense, personalized content designed to trigger emotional responses.

### Artistic Intent

This project critiques how social media platforms use sophisticated algorithms to:
- Profile users based on emotional responses
- Create echo chambers of increasingly intense content  
- Manipulate psychological states through personalized feeds
- Keep users engaged through emotional exploitation

By experiencing this artificial system, users gain awareness of how real platforms may affect their mental health and emotional well-being.

## Features

- **Intelligent Recommendation Engine**: Learns from user likes and progressively shows deeper content
- **Emotional Phrase Database**: 40+ carefully crafted phrases across 5 emotional themes
- **Adaptive Intensity System**: Gradually introduces more intense content based on user tolerance
- **Procedural Ambient Audio**: Dynamic soundscapes that respond to emotional themes and intensity
- **TikTok-Style Interface**: Familiar swipe-based navigation with like/skip functionality
- **Safety Features**: Multiple exit options and crisis resource information
- **Escalation Mode**: Algorithm becomes more aggressive as user engagement increases
- **No Data Storage**: Everything is local state - resets on page refresh

## Emotional Themes

1. **💔 Loneliness/Loss** - Isolation, abandonment, silence
2. **💭 Regret/Nostalgia** - Past mistakes, missed opportunities  
3. **🥀 Unspoken Love/Longing** - Unexpressed feelings, lost connections
4. **⚫ Self-doubt/Emptiness** - Inadequacy, impostor syndrome, depression
5. **💡 Meta/Direct** - Algorithm speaking directly to user, breaking fourth wall

## Technical Implementation

### Architecture

```
src/
├── app/
│   ├── page.tsx           # Main application state manager
│   ├── layout.tsx         # Next.js layout
│   └── globals.css        # Custom animations and styles
├── components/
│   ├── DisclaimerScreen.tsx   # Safety warnings and consent
│   └── PhraseFeed.tsx         # Main TikTok-style interface
├── hooks/
│   ├── useRecommendationEngine.ts  # AI-like recommendation logic
│   └── useAmbientAudio.ts          # Procedural audio generation
└── data/
    └── phrases.ts         # Emotional phrase database
```

### Key Technologies

- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Web Audio API** for procedural ambient music
- **React Hooks** for state management
- **Local Storage** (session-only, no persistence)

### Recommendation Algorithm

The algorithm profiles users by tracking:
- Liked phrases and emotional themes
- Time spent in application  
- Emotional intensity tolerance
- Interaction patterns and session depth

It then:
- Scores phrases based on user preferences
- Gradually increases emotional intensity
- Enters "escalation mode" after heavy engagement
- Shows meta-commentary about the algorithm itself

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Running the Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd infinite-scroll-alpine-one-random
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

## User Experience Flow

1. **Disclaimer Screen**: Safety warnings, artistic intent, consent required
2. **Phrase Feed**: TikTok-style interface with emotional phrases
3. **Algorithm Learning**: System adapts based on user likes/skips
4. **Escalation**: Content becomes more intense and personal
5. **Meta Commentary**: Algorithm reveals what it "knows" about user
6. **Exit Options**: Multiple ways to leave with safety resources

## Controls

- **⬆️ Swipe Up / Arrow Up / Space**: Next phrase
- **⬇️ Swipe Down / Arrow Down / Enter**: Like phrase  
- **ESC**: Exit installation
- **✕ Button**: Exit with confirmation

## Safety Features

- Comprehensive disclaimer with crisis resources
- Multiple exit options always available
- Content warnings about emotional triggers
- Clear indication this is art, not real social media
- No data collection or storage
- Accessibility support (reduced motion, high contrast)

## Educational Use

This installation can be used for:
- Media literacy education
- Digital wellness workshops  
- Psychology courses on social media effects
- Art installations and exhibitions
- Tech ethics discussions

## Technical Notes

### Audio System

Uses Web Audio API to generate:
- Theme-specific frequency combinations
- Intensity-based harmonic layering
- Procedural white noise textures
- Smooth transitions between emotional states

### Privacy

- **No data collection**: Everything runs locally
- **No analytics**: No tracking or telemetry
- **Session only**: All data resets on page refresh
- **No network requests**: Except for initial page load

### Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers supported

## Development

### Adding New Phrases

Edit `src/data/phrases.ts`:

```typescript
{
  id: "unique_id",
  text: "Your emotional phrase here",
  theme: "loneliness", // or regret, love, self_doubt, meta
  intensity: 3, // 1-5, where 5 is most intense
  tags: ["tag1", "tag2"] // for algorithm matching
}
```

### Customizing Algorithm

Modify `src/hooks/useRecommendationEngine.ts`:
- Adjust scoring weights
- Change escalation triggers  
- Add new recommendation logic

### Styling

Global styles in `src/app/globals.css`
Component styles use Tailwind CSS classes

## Contributing

This is an art project exploring important social issues. Contributions welcome for:
- Additional emotional phrases
- Algorithm improvements
- Accessibility enhancements
- Educational materials

## Disclaimer

This is experimental art software exploring psychological manipulation in social media. It may trigger strong emotional responses. Users participate at their own discretion. 

**If you experience distress:**
- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988
- Contact your local mental health services

## License

[Add your preferred license]

## Credits

Created as commentary on algorithmic manipulation in social media platforms.

**Warning**: This installation is designed to demonstrate how algorithms can manipulate emotions. Please use responsibly and prioritize mental health.

---

*"The algorithm knows you better than you know yourself" - but it doesn't have to.*
