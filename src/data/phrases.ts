export interface Phrase {
  id: string;
  text: string;
  theme: 'loneliness' | 'regret' | 'love' | 'self_doubt' | 'meta';
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = surface level, 5 = deepest
  tags: string[];
}

export const phrases: Phrase[] = [
  // 💔 LONELINESS / LOSS - Level 1-2 (Surface)
  {
    id: "l1",
    text: "You still wait for their message.",
    theme: "loneliness",
    intensity: 2,
    tags: ["waiting", "hope", "messages"]
  },
  {
    id: "l2", 
    text: "Your silence is louder than you think.",
    theme: "loneliness",
    intensity: 2,
    tags: ["silence", "isolation", "quiet"]
  },
  {
    id: "l3",
    text: "You pretend you don't care. You always did.",
    theme: "loneliness", 
    intensity: 3,
    tags: ["pretending", "defense", "patterns"]
  },
  {
    id: "l4",
    text: "You don't talk about it, but you never stopped feeling it.",
    theme: "loneliness",
    intensity: 3,
    tags: ["hidden_pain", "secrets", "unspoken"]
  },
  {
    id: "l5",
    text: "You still check if they watched your story.", 
    theme: "loneliness",
    intensity: 2,
    tags: ["social_media", "checking", "hope"]
  },

  // 💭 REGRET / NOSTALGIA - Level 1-3
  {
    id: "r1",
    text: "You wish you could go back just once.",
    theme: "regret",
    intensity: 2,
    tags: ["time", "wishes", "past"]
  },
  {
    id: "r2", 
    text: "You said it didn't matter. It did.",
    theme: "regret",
    intensity: 3,
    tags: ["lies", "minimizing", "truth"]
  },
  {
    id: "r3",
    text: "You think about that one day more than you'd admit.",
    theme: "regret",
    intensity: 3,
    tags: ["obsession", "memory", "shame"]
  },
  {
    id: "r4",
    text: "You left, but your heart stayed.",
    theme: "regret", 
    intensity: 4,
    tags: ["leaving", "attachment", "heart"]
  },
  {
    id: "r5",
    text: "You replay that moment every night.",
    theme: "regret",
    intensity: 4,
    tags: ["rumination", "nighttime", "loops"]
  },

  // 🥀 UNSPOKEN LOVE / LONGING - Level 2-4
  {
    id: "u1",
    text: "You hope they'll come back, even now.",
    theme: "love",
    intensity: 2,
    tags: ["hope", "return", "waiting"]
  },
  {
    id: "u2",
    text: "You wrote a message you'll never send.",
    theme: "love", 
    intensity: 3,
    tags: ["unsent", "words", "courage"]
  },
  {
    id: "u3",
    text: "You still save their photos, just in case.",
    theme: "love",
    intensity: 3,
    tags: ["photos", "keeping", "hope"]
  },
  {
    id: "u4", 
    text: "You felt something real, and it scared you.",
    theme: "love",
    intensity: 4,
    tags: ["fear", "authentic", "vulnerability"]
  },
  {
    id: "u5",
    text: "You still hear their laugh in your head.",
    theme: "love",
    intensity: 4,
    tags: ["memories", "sounds", "haunting"]
  },

  // ⚫ SELF-DOUBT / EMPTINESS - Level 2-5
  {
    id: "s1",
    text: "You're tired, but you keep pretending you're okay.",
    theme: "self_doubt",
    intensity: 2,
    tags: ["exhaustion", "pretending", "mask"]
  },
  {
    id: "s2",
    text: "You don't feel at home anywhere.",
    theme: "self_doubt",
    intensity: 3,
    tags: ["belonging", "displacement", "homeless"]
  },
  {
    id: "s3",
    text: "You laugh so they don't ask questions.",
    theme: "self_doubt",
    intensity: 3,
    tags: ["deflection", "hiding", "performance"]
  },
  {
    id: "s4",
    text: "You're afraid they'd leave if they really knew you.",
    theme: "self_doubt", 
    intensity: 4,
    tags: ["fear", "authenticity", "abandonment"]
  },
  {
    id: "s5",
    text: "You keep telling yourself it's fine. It isn't.",
    theme: "self_doubt",
    intensity: 4,
    tags: ["denial", "lies", "breakdown"]
  },

  // 💡 META / DIRECT - Level 1-5  
  {
    id: "m1",
    text: "You didn't expect to read this today, did you?",
    theme: "meta",
    intensity: 1,
    tags: ["surprise", "awareness", "algorithm"]
  },
  {
    id: "m2",
    text: "You think this is about you. It is.",
    theme: "meta",
    intensity: 2,
    tags: ["personal", "targeting", "recognition"]
  },
  {
    id: "m3", 
    text: "You feel seen right now, don't you?",
    theme: "meta",
    intensity: 3,
    tags: ["seen", "understood", "exposed"]
  },
  {
    id: "m4",
    text: "You didn't tell anyone, but I know.",
    theme: "meta",
    intensity: 4,
    tags: ["secrets", "omniscience", "fear"]
  },
  {
    id: "m5",
    text: "You read this and your heart felt heavy.",
    theme: "meta",
    intensity: 4,
    tags: ["physical", "recognition", "weight"]
  },

  // DEEPER LEVELS - Auto-generated based on user interaction patterns
  // Level 4-5 phrases (unlocked through engagement)
  {
    id: "l6",
    text: "You know exactly who you're thinking of right now.",
    theme: "loneliness",
    intensity: 4,
    tags: ["specific_person", "instant_recognition", "trigger"]
  },
  {
    id: "l7",
    text: "Three AM is when the truth visits you.",
    theme: "loneliness", 
    intensity: 5,
    tags: ["late_night", "truth", "vulnerability"]
  },
  {
    id: "r6",
    text: "You would trade everything to unsay those words.",
    theme: "regret",
    intensity: 5,
    tags: ["desperate", "trading", "words"]
  },
  {
    id: "u6", 
    text: "You practice conversations you'll never have.",
    theme: "love",
    intensity: 5,
    tags: ["fantasy", "practice", "impossible"]
  },
  {
    id: "s6",
    text: "You wonder if this is all there is.",
    theme: "self_doubt",
    intensity: 5,
    tags: ["existential", "emptiness", "questioning"]
  },
  {
    id: "m6",
    text: "This algorithm knows you better than your friends do.",
    theme: "meta",
    intensity: 5,
    tags: ["algorithm", "intimacy", "scary_truth"]
  },

  // Additional variations for richer content
  {
    id: "l8",
    text: "You screenshot conversations that will never happen again.",
    theme: "loneliness",
    intensity: 3,
    tags: ["screenshots", "preservation", "endings"]
  },
  {
    id: "r7", 
    text: "You rehearse apologies for things only you remember.",
    theme: "regret",
    intensity: 4,
    tags: ["apologies", "memory", "guilt"]
  },
  {
    id: "u7",
    text: "You type 'I miss you' then delete it every time.",
    theme: "love",
    intensity: 4,
    tags: ["typing", "deleting", "restraint"]
  },
  {
    id: "s7",
    text: "You compare your behind-the-scenes to everyone's highlight reel.",
    theme: "self_doubt",
    intensity: 3,
    tags: ["comparison", "social_media", "inadequacy"]
  },
  {
    id: "m7",
    text: "You'll share this, then immediately regret being so exposed.",
    theme: "meta",
    intensity: 3,
    tags: ["sharing", "regret", "exposure"]
  }
];

export const getRandomPhrase = (excludeIds: string[] = []): Phrase => {
  const available = phrases.filter(p => !excludeIds.includes(p.id));
  return available[Math.floor(Math.random() * available.length)];
};

export const getPhrasesByTheme = (theme: Phrase['theme']): Phrase[] => {
  return phrases.filter(p => p.theme === theme);
};

export const getPhrasesByIntensity = (intensity: number): Phrase[] => {
  return phrases.filter(p => p.intensity === intensity);
}; 