import { Quote } from "@/types";

export const quotes: Quote[] = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    id: "2",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success",
  },
  {
    id: "3",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    id: "4",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "persistence",
  },
  {
    id: "5",
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindset",
  },
  {
    id: "6",
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "belief",
  },
  {
    id: "7",
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "life",
  },
  {
    id: "8",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "action",
  },
  {
    id: "9",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence",
  },
  {
    id: "10",
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "courage",
  },
  {
    id: "11",
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    category: "growth",
  },
  {
    id: "12",
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "opportunity",
  },
  {
    id: "13",
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "inner-strength",
  },
  {
    id: "14",
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "resilience",
  },
  {
    id: "15",
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life",
  },
  {
    id: "16",
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "action",
  },
  {
    id: "17",
    text: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    category: "mindset",
  },
  {
    id: "18",
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "beginning",
  },
  {
    id: "19",
    text: "You become what you believe.",
    author: "Oprah Winfrey",
    category: "belief",
  },
  {
    id: "20",
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "impact",
  },
  {
    id: "21",
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "happiness",
  },
  {
    id: "22",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "action",
  },
  {
    id: "23",
    text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    author: "Roy T. Bennett",
    category: "courage",
  },
  {
    id: "24",
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "growth",
  },
  {
    id: "25",
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "belief",
  },
  {
    id: "26",
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "beginning",
  },
  {
    id: "27",
    text: "Your life does not get better by chance, it gets better by change.",
    author: "Jim Rohn",
    category: "change",
  },
  {
    id: "28",
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous",
    category: "work",
  },
  {
    id: "29",
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "dreams",
  },
  {
    id: "30",
    text: "What we think, we become.",
    author: "Buddha",
    category: "mindset",
  },
  {
    id: "31",
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "success",
  },
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % quotes.length;
  return quotes[index];
}
