export interface MarketplaceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface MarketplaceStep {
  step: number;
  title: string;
  description: string;
}

export interface MarketplaceTestimonial {
  name: string;
  event: string;
  quote: string;
  rating: number;
}

export interface MarketplacePricingPlan {
  key: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface MarketplaceFaq {
  question: string;
  answer: string;
}

export interface MarketplaceStat {
  value: string;
  label: string;
}

export const marketplaceStats: MarketplaceStat[] = [
  { value: "500+", label: "بانگهێشتنامەی دروستکراو" },
  { value: "7", label: "تێمپلەیتی جیاواز" },
  { value: "48h", label: "کاتی ئامادەکردن" },
  { value: "100%", label: "ڕازیبوونی کڕیار" }
];

export const marketplaceFeatures: MarketplaceFeature[] = [
  {
    icon: "Smartphone",
    title: "گونجاو بۆ مۆبایل",
    description: "هەموو بانگهێشتنامەکان بە تەواوی responsiveن و لەسەر هەموو ئامێرێک جوان دەردەکەون."
  },
  {
    icon: "Palette",
    title: "دیزاینی تایبەت",
    description: "ڕەنگ، فۆنت و وێنەکان بەپێی دڵخوازی خۆت دەگۆڕدرێن بۆ ئەوەی بانگهێشتنامەکەت یەکتایە بێت."
  },
  {
    icon: "Users",
    title: "RSVP و کتێبی میوان",
    description: "سیستەمی RSVP و کتێبی ئارزووەکان بۆ ئەوەی میوانەکانت بە ئاسانی وەڵام بدەنەوە."
  },
  {
    icon: "Clock",
    title: "کاونتداون و خشتەی ڕۆژ",
    description: "کاونتداون بۆ ڕۆژی هاوسەرگیری و خشتەی ڕووداوەکان بۆ ئەوەی میوانەکان هەموو شتێک بزانن."
  },
  {
    icon: "MapPin",
    title: "نەخشەی شوێن",
    description: "شوێنی ئاهەنگەکە لەسەر Google Maps دەردەکەوێت بۆ ئەوەی میوانەکان بە ئاسانی بگەن."
  },
  {
    icon: "Share2",
    title: "هاوبەشکردنی ئاسان",
    description: "لینکی تایبەت بۆ بانگهێشتنامەکەت وەربگرە و لە WhatsApp، Instagram یان SMS بنێرە."
  }
];

export const marketplaceSteps: MarketplaceStep[] = [
  {
    step: 1,
    title: "تێمپلەیت هەڵبژێرە",
    description: "لە نێوان ٧+ تێمپلەیت جیاوازدا هەڵبژێرە کە لەگەڵ شێوازی ئاهەنگەکەت دەگونجێت."
  },
  {
    step: 2,
    title: "Live Demo ببینە",
    description: "پێش ئۆردەرکردن demo زیندوو ببینە بۆ ئەوەی بزانیت بانگهێشتنامەکەت چۆن دەردەکەوێت."
  },
  {
    step: 3,
    title: "ئۆردەر بنێرە",
    description: "فۆڕمی ئۆردەر پڕبکەرەوە و زانیارییەکانی خۆت بنووسە. تیمەکەمان لەگەڵت دەمێنێتەوە."
  },
  {
    step: 4,
    title: "وەربگرە و بڵاوبکەرەوە",
    description: "لە ماوەی ٤٨ کاتژمێردا بانگهێشتنامەی تایبەتت ئامادە دەبێت و دەتوانیت هاوبەشی بکەیت."
  }
];

export const marketplaceTestimonials: MarketplaceTestimonial[] = [
  {
    name: "سارا و ئارام",
    event: "هاوسەرگیری — سلێمانی",
    quote: "بانگهێشتنامەکەمان زۆر جوان بوو! میوانەکانمان سەرسام بوون و RSVP بە ئاسانی کار دەکرد.",
    rating: 5
  },
  {
    name: "هێڤی و ڕێباز",
    event: "هاوسەرگیری — هەولێر",
    quote: "خزمەتگوزارییەکە زۆر خێرا بوو. لە ٢ ڕۆژدا هەموو شت ئامادە بوو و بە کوالیتی بەرز.",
    rating: 5
  },
  {
    name: "لەیلا و کەمال",
    event: "هاوسەرگیری — دهۆک",
    quote: "تێمپلەیتی Royal Gold هەڵبژاردمان و زۆر جوان بوو. پێشنیار دەکەین بۆ هەموو کەسێک!",
    rating: 5
  }
];

export const marketplacePricing: MarketplacePricingPlan[] = [
  {
    key: "basic",
    name: "بنەڕەتی",
    price: "٤٩,٠٠٠",
    period: "IQD",
    description: "بۆ ئاهەنگە بچووکەکان",
    features: [
      "١ تێمپلەیت دیاریکراو",
      "RSVP و کتێبی میوان",
      "کاونتداون و خشتەی ڕۆژ",
      "لینکی تایبەت",
      "پشتگیری ٣٠ ڕۆژ"
    ],
    cta: "ئۆردەر بکە"
  },
  {
    key: "premium",
    name: "پریمیۆم",
    price: "٧٩,٠٠٠",
    period: "IQD",
    description: "بەناوبانگترین پلان",
    highlighted: true,
    features: [
      "هەر تێمپلەیتێک هەڵبژێرە",
      "گۆڕینی ڕەنگ و فۆنت",
      "ڤیدیۆی intro (cinematic)",
      "RSVP + کتێبی میوان",
      "نەخشەی شوێن",
      "پشتگیری ٦٠ ڕۆژ"
    ],
    cta: "ئۆردەر بکە"
  },
  {
    key: "vip",
    name: "VIP",
    price: "١٢٩,٠٠٠",
    period: "IQD",
    description: "بۆ ئاهەنگە تایبەتەکان",
    features: [
      "هەموو تایبەتمەندی پریمیۆم",
      "تێمپلەیت تەواو تایبەت",
      "وێنە و ڤیدیۆی تایبەت",
      "گۆڕینی تەواوی دیزاین",
      "پشتگیری تایبەت ٢٤/٧",
      "پێشینە لە ئامادەکردن"
    ],
    cta: "پەیوەندی بکە"
  }
];

export const marketplaceFaqs: MarketplaceFaq[] = [
  {
    question: "چەند کات دەخایەنێت تا بانگهێشتنامەکەم ئامادە بێت؟",
    answer: "بە شێوەی ئاسایی لە ماوەی ٢٤ تا ٤٨ کاتژمێردا بانگهێشتنامەکەت ئامادە دەبێت. بۆ پلانی VIP خزمەتگوزاری خێراترە."
  },
  {
    question: "دەتوانم دوای ئامادەبوون گۆڕانکاری بکەم؟",
    answer: "بەڵێ! لە ماوەی پشتگیری پلانەکەتدا دەتوانیت گۆڕانکاری بکەیت. پەیوەندیمان پێوە بکە."
  },
  {
    question: "چۆن میوانەکان RSVP دەکەن؟",
    answer: "هەر بانگهێشتنامەیەک لینکی تایبەتی هەیە. میوانەکان کلیک دەکەن و بە ئاسانی وەڵام دەدەنەوە."
  },
  {
    question: "ئایا دەتوانم تێمپلەیت بگۆڕم دوای ئۆردەر؟",
    answer: "بەڵێ، پێش ئەوەی دیزاینەکە دەستپێبکەین دەتوانیت تێمپلەیت بگۆڕیت بەبێ بەرامبەر."
  },
  {
    question: "چۆن پارە دەدەم؟",
    answer: "دوای پشتڕاستکردنەوەی ئۆردەر، ڕێگای پارەدان لە ڕێگەی FastPay، FIB یان گواستنەوەی بانکی دەنێردرێت."
  }
];

export const marketplaceContact = {
  phone: "+964 750 123 4567",
  email: "info@haawirabet.com",
  instagram: "https://instagram.com/haawirabet",
  whatsapp: "https://wa.me/9647501234567"
};
