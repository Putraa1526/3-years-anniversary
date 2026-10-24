/**
 * ============================================================
 *  Diraa & Pupaa — Our Little Universe  💗
 *  Central configuration + editable content types.
 * ============================================================
 *
 *  LOVE_CONFIG below is the DEFAULT content. Once the creator edits
 *  the site via the in-site admin panel, the saved version lives in
 *  the database (SiteContent) and overrides these defaults at runtime.
 *
 *  You can still edit LOVE_CONFIG to change the defaults, or edit
 *  everything live from the website's "Creator" button in the footer.
 * ============================================================
 */

export interface StoryItem {
  date: string;
  title: string;
  description: string;
  image: string;
  ornament?: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface SurpriseCard {
  title: string;
  body: string;
}

export const LOVE_CONFIG = {
  partnerOne: "Diraa",
  partnerTwo: "Pupaa",
  siteTitle: "Our Little Universe",
  tagline: "A little world, made just for us.",
  /** Replace "YYYY-MM-DD" with your real date to enable the counter. */
  anniversaryDate: "YYYY-MM-DD" as string,
  anniversaryMessage: "Every day with you is a little blessing.",
  heroSubtitle:
    "In a world full of people, I'm glad our paths found each other.",
  story: [
    { date: "August 14, 2022", title: "The Day Our Story Began", description: "The first hello, the first smile, the first time the world felt a little brighter. This is where our little universe started.", image: "", ornament: "✦" },
    { date: "October 02, 2022", title: "My Favorite Memory", description: "A quiet afternoon that turned into one of my favorite memories. Nothing grand, just us, and that was more than enough.", image: "", ornament: "❀" },
    { date: "February 14, 2023", title: "The Little Things I Remember", description: "The way you laughed at my silly jokes. The way you held my hand like it was the most natural thing in the world.", image: "", ornament: "♡" },
    { date: "June 21, 2023", title: "A Moment I Want to Keep Forever", description: "Some moments are too soft to describe. This one I want to keep, gently, in a little box inside my heart.", image: "", ornament: "✿" },
    { date: "Today", title: "And Our Story Continues...", description: "Every new day is another page, another little star added to our sky. The best part? There are still so many pages left to write.", image: "", ornament: "✦" },
  ] as StoryItem[],
  gallery: [
    { src: "/images/gallery/photo-1.png", alt: "Soft pink peonies — the beginning of everything.", caption: "the beginning of everything" },
    { src: "/images/gallery/photo-2.png", alt: "Two paper hearts floating in a dreamy sky.", caption: "ordinary days, extraordinary us" },
    { src: "/images/gallery/photo-3.png", alt: "A love letter sealed with a pink wax heart.", caption: "words from the heart" },
    { src: "/images/gallery/photo-4.png", alt: "A dreamy pink sunset sky with a crescent moon.", caption: "golden hour" },
    { src: "/images/gallery/photo-5.png", alt: "Two cups of coffee and pink macarons.", caption: "little celebrations" },
    { src: "/images/gallery/photo-6.png", alt: "A field of pink wildflowers under a starry twilight.", caption: "my favorite view" },
  ] as GalleryItem[],
  letter: {
    greeting: "Dear Diraa,",
    paragraphs: [
      "If I could make a little place in this world just for us, I would fill it with our favorite memories, our silly conversations, our little dreams, and all the moments that make being with you feel special.",
      "Thank you for being part of my story. I hope this little website reminds you that even the simplest moments can become beautiful memories when they mean something to us.",
      "No matter how ordinary a day may seem, I hope we can keep finding little reasons to smile, laugh, and create new memories together.",
    ],
    closing: "Happy Anniversary, Diraa. ♡",
    signOff: "With love,",
    signature: "Pupaa",
  },
  music: {
    songUrl: "/audio/our-song.mp3",
    title: "Our Little Song",
    artist: "Just for You",
    cover: "",
  },
  surpriseCards: [
    { title: "A Reason I Appreciate You", body: "You make the quiet parts of life feel gentle. You listen like my words matter, and that is something I will never take for granted." },
    { title: "A Memory I Treasure", body: "There was a day nothing special happened, and yet I still think about it often. That is the kind of memory you have given me — soft, ordinary, and completely mine." },
    { title: "A Wish for Our Future", body: "I wish us many more ordinary days made extraordinary, many more little worlds, and a love that grows softer and stronger all at once." },
  ] as SurpriseCard[],
  surpriseMessages: [
    "If I could choose a thousand little moments to keep, I would still want more moments with you. ♡",
    "You are my favorite hello and my hardest goodbye, all in one little universe.",
    "Some people search a lifetime for a feeling we found without even trying.",
    "Of all the places my mind wanders, it always finds its way back to you.",
    "Loving you is the easiest thing I've ever done, and the most beautiful.",
    "If forever exists, I'd like to spend it making you smile.",
    "You are the calm in my chaos, the song in my silence, the little star in my sky.",
    "Even on ordinary days, you are the most extraordinary part of my world.",
  ],
};

export const hasAnniversaryDate = (date?: string): boolean => {
  const d = date ?? LOVE_CONFIG.anniversaryDate;
  return !!d && d !== "YYYY-MM-DD" && !Number.isNaN(new Date(d).getTime());
};

export type LoveConfig = typeof LOVE_CONFIG;

export interface SiteContent {
  partnerOne: string;
  partnerTwo: string;
  siteTitle: string;
  tagline: string;
  anniversaryDate: string;
  anniversaryMessage: string;
  heroSubtitle: string;
  story: StoryItem[];
  gallery: GalleryItem[];
  letter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    signOff: string;
    signature: string;
  };
  surpriseCards: SurpriseCard[];
  surpriseMessages: string[];
  footerMain: string;
  footerSub: string;
}

export const defaultContent: SiteContent = {
  partnerOne: LOVE_CONFIG.partnerOne,
  partnerTwo: LOVE_CONFIG.partnerTwo,
  siteTitle: LOVE_CONFIG.siteTitle,
  tagline: LOVE_CONFIG.tagline,
  anniversaryDate: LOVE_CONFIG.anniversaryDate,
  anniversaryMessage: LOVE_CONFIG.anniversaryMessage,
  heroSubtitle: LOVE_CONFIG.heroSubtitle,
  story: LOVE_CONFIG.story,
  gallery: LOVE_CONFIG.gallery,
  letter: LOVE_CONFIG.letter,
  surpriseCards: LOVE_CONFIG.surpriseCards,
  surpriseMessages: LOVE_CONFIG.surpriseMessages,
  footerMain: "Made with love, just for Diraa ♡",
  footerSub: "A little universe by Pupaa.",
};

export function mergeContent(stored: Partial<SiteContent> | null | undefined): SiteContent {
  if (!stored) return { ...defaultContent };
  return {
    ...defaultContent,
    ...stored,
    letter: { ...defaultContent.letter, ...(stored.letter ?? {}) },
    story: Array.isArray(stored.story) ? stored.story : defaultContent.story,
    gallery: Array.isArray(stored.gallery) ? stored.gallery : defaultContent.gallery,
    surpriseCards: Array.isArray(stored.surpriseCards) ? stored.surpriseCards : defaultContent.surpriseCards,
    surpriseMessages: Array.isArray(stored.surpriseMessages) ? stored.surpriseMessages : defaultContent.surpriseMessages,
  };
}
