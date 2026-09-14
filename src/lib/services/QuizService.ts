export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  options: {
    id: number;
    label: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export const QUESTION_BANK: QuizQuestion[] = [
  {
    id: "otp_call",
    question: "Someone calling on the phone claims to be from your bank and asks for your 6-digit OTP code to fix a blocked account. What should you do?",
    category: "OTP Safety",
    options: [
      { id: 1, label: "Share the OTP so they can unblock your account quickly", isCorrect: false },
      { id: 2, label: "Hang up immediately. Never share an OTP over a phone call", isCorrect: true },
      { id: 3, label: "Ask them to send an SMS verification link instead", isCorrect: false },
    ],
    explanation: "Bank support will NEVER call asking for your OTP code. Always hang up and open the official banking app yourself.",
  },
  {
    id: "bank_link",
    question: "You receive an SMS saying 'Urgent: Bank token pending. Tap http://verify-secure.info now or account will be restricted.' What should you do?",
    category: "Phishing Links",
    options: [
      { id: 1, label: "Do NOT tap the link. Open your official bank app directly", isCorrect: true },
      { id: 2, label: "Tap the link and enter your banking password to verify", isCorrect: false },
      { id: 3, label: "Reply to the SMS asking for more details", isCorrect: false },
    ],
    explanation: "Unofficial links like verify-secure.info are fake phishing websites. Never tap links inside random SMS messages.",
  },
  {
    id: "app_permission",
    question: "A new photo editor app asks for permission to 'Read all your SMS text messages and contacts'. What should you do?",
    category: "App Privacy",
    options: [
      { id: 1, label: "Tap 'Allow All' so the photo editor works without issues", isCorrect: false },
      { id: 2, label: "Tap 'Deny'. Photo apps do not need access to private SMS messages", isCorrect: true },
      { id: 3, label: "Grant SMS access but hide your contacts", isCorrect: false },
    ],
    explanation: "Granting SMS permissions allows untrusted apps to intercept private OTP banking codes. Always deny unnecessary permissions.",
  },
  {
    id: "virus_popup",
    question: "While reading news on a web browser, a popup appears saying 'Warning! (4) Viruses detected on your phone! Tap to fix now.' What should you do?",
    category: "Fake Warnings",
    options: [
      { id: 1, label: "Tap 'Fix Now' to download the recommended cleaning software", isCorrect: false },
      { id: 2, label: "Close the browser tab immediately. Web popups cannot scan your phone", isCorrect: true },
      { id: 3, label: "Restart your phone and enter your lock screen PIN to scan", isCorrect: false },
    ],
    explanation: "Web browser popups use scare tactics to trick you into downloading unwanted apps. Close the tab immediately.",
  },
  {
    id: "unknown_call",
    question: "An unknown caller asks you to download 'AnyDesk' or 'TeamViewer' to help resolve a customer support refund. What should you do?",
    category: "Remote Access Scam",
    options: [
      { id: 1, label: "Refuse and hang up. Remote screen sharing apps give callers full control of your phone", isCorrect: true },
      { id: 2, label: "Download the app and share the 9-digit code displayed", isCorrect: false },
      { id: 3, label: "Allow them access but stay logged out of banking apps", isCorrect: false },
    ],
    explanation: "Scammers use remote access apps to view your screen and steal verification codes. Never install screen-sharing apps on caller advice.",
  },
  {
    id: "payment_receive",
    question: "Someone offering to buy your old item sends a UPI QR code and says 'Scan this QR code to RECEIVE money in your bank account'. What should you do?",
    category: "UPI / Payment Safety",
    options: [
      { id: 1, label: "Scan the QR code and enter your UPI PIN to receive payment", isCorrect: false },
      { id: 2, label: "Do NOT scan or enter your UPI PIN. You NEVER enter a PIN to receive money", isCorrect: true },
      { id: 3, label: "Share your ATM debit card number instead", isCorrect: false },
    ],
    explanation: "Entering your UPI PIN ALWAYS DEDUCTS money from your account. Receiving money never requires typing a PIN or scanning QR codes.",
  },
  {
    id: "password_reset",
    question: "You receive an unexpected SMS saying 'Your account password reset requested. If this wasn't you, click link.' What should you do?",
    category: "Account Security",
    options: [
      { id: 1, label: "Do not tap the link. Open the official website directly to check account security", isCorrect: true },
      { id: 2, label: "Tap the link and enter your old password to cancel the request", isCorrect: false },
      { id: 3, label: "Forward the SMS to your friends to check if it's safe", isCorrect: false },
    ],
    explanation: "Fake password reset links capture your password. If you didn't request a reset, open the official app directly to verify.",
  },
  {
    id: "free_wifi",
    question: "At a public airport, an open Wi-Fi network requires no password. Is it safe to log into your bank account?",
    category: "Public Wi-Fi",
    options: [
      { id: 1, label: "Yes, any public Wi-Fi network is safe for banking", isCorrect: false },
      { id: 2, label: "No. Use mobile data (4G/5G) for sensitive banking actions instead", isCorrect: true },
      { id: 3, label: "Yes, if you use incognito mode in your browser", isCorrect: false },
    ],
    explanation: "Unsecured public Wi-Fi networks can be monitored by hackers. Use mobile data when performing sensitive financial tasks.",
  },
];

const LOCAL_STORAGE_QUIZ_KEY = "digitalbridge_daily_quiz_v1";

export interface QuizProgress {
  date: string; // YYYY-MM-DD
  questionIds: string[];
  currentStep: number; // 0, 1, 2, or 3 (completed)
  answers: { [questionId: string]: { selectedOptionId: number; isCorrect: boolean } };
  isCompleted: boolean;
  score: number;
}

export class QuizService {
  /**
   * Deterministic seed generator for date YYYY-MM-DD
   */
  private static getDateSeed(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Get today's 3 deterministic questions
   */
  static getDailyQuestions(): QuizQuestion[] {
    const todayStr = new Date().toISOString().slice(0, 10);
    const seed = this.getDateSeed(todayStr);

    const questionsCopy = [...QUESTION_BANK];
    const daily: QuizQuestion[] = [];

    for (let i = 0; i < 3; i++) {
      const idx = (seed + i * 3) % questionsCopy.length;
      daily.push(questionsCopy[idx]);
    }

    return daily;
  }

  /**
   * Get stored progress for today
   */
  static getProgress(): QuizProgress {
    const todayStr = new Date().toISOString().slice(0, 10);
    const dailyQuestions = this.getDailyQuestions();
    const defaultProgress: QuizProgress = {
      date: todayStr,
      questionIds: dailyQuestions.map((q) => q.id),
      currentStep: 0,
      answers: {},
      isCompleted: false,
      score: 0,
    };

    if (typeof window === "undefined") return defaultProgress;

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
      if (!raw) return defaultProgress;

      const parsed: QuizProgress = JSON.parse(raw);
      if (parsed.date !== todayStr) {
        // Reset for new day
        localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify(defaultProgress));
        return defaultProgress;
      }

      return parsed;
    } catch (e) {
      console.warn("[QuizService] Error reading progress:", e);
      return defaultProgress;
    }
  }

  /**
   * Save updated progress
   */
  static saveProgress(progress: QuizProgress) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("[QuizService] Error saving progress:", e);
    }
  }
}
