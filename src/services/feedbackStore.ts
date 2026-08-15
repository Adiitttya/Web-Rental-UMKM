import { sanitizeText } from '@/utils/sanitize';

export interface FeedbackRecord {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
  status: 'unread' | 'read';
}

const STORAGE_KEY = 'dster_user_feedbacks';

// Default initial mock feedbacks if storage is empty
const defaultFeedbacks: FeedbackRecord[] = [
  {
    id: 'fb-1',
    name: 'Andi Saputra',
    comment: 'Saran untuk cabang 2, tolong ditambahkan variasi snack dingin yang lebih banyak. Selebihnya sudah mantap!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'read',
  },
  {
    id: 'fb-2',
    name: 'Bagus Pratama',
    comment: 'Pelayanannya sangat ramah dan tempatnya bersih. Semoga ke depannya ada turnamen mingguan reguler.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'unread',
  },
];

export const getStoredFeedbacks = (): FeedbackRecord[] => {
  if (typeof window === 'undefined') return defaultFeedbacks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFeedbacks));
      return defaultFeedbacks;
    }
    const parsed: FeedbackRecord[] = JSON.parse(raw);
    return parsed.map((item) => ({
      ...item,
      name: sanitizeText(item.name, 100),
      comment: sanitizeText(item.comment, 1000),
    }));
  } catch (err) {
    console.error('Error reading feedbacks from storage:', err);
    return defaultFeedbacks;
  }
};

export const saveFeedback = (data: { name: string; comment: string }): FeedbackRecord => {
  const cleanName = sanitizeText(data.name, 100);
  const cleanComment = sanitizeText(data.comment, 1000);

  const newRecord: FeedbackRecord = {
    id: `fb-${Date.now()}`,
    name: cleanName,
    comment: cleanComment,
    createdAt: new Date().toISOString(),
    status: 'unread',
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getStoredFeedbacks();
      const updated = [newRecord, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving feedback to storage:', err);
    }
  }

  return newRecord;
};
