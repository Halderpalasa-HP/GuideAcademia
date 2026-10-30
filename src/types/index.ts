export type UserRole = 'student' | 'teacher' | 'admin';

export type UserStatus = 'active' | 'blocked' | 'banned';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  bio?: string;
  headline?: string;
  phoneNumber?: string;
  mobileMoneyProvider?: 'wave' | 'orange' | 'mtn' | 'moov';
  enrolledCourseIds: string[];
  createdAt: string;
  lastLogin?: string;
}

export type LessonType = 'video' | 'pdf' | 'text';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  points: number;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  contentUrl?: string; // Video URL or PDF URL
  textContent?: string; // Rich markdown/text guide
  pdfSlides?: {
    pageNumber: number;
    title: string;
    content: string;
  }[];
  quiz?: QuizQuestion[];
  isFreePreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  instructorReply?: {
    text: string;
    repliedAt: string;
  };
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Développement' | 'Intelligence Artificielle' | 'Design & UX' | 'Business & Marketing' | 'Finance & Fintech';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRoleBadge?: string;
  thumbnail: string;
  priceXOF: number; // In FCFA
  priceEUR: number; // In EUR
  priceUSD: number; // In USD
  modules: Module[];
  tags: string[];
  isPublished: boolean;
  isPlatformOfficial?: boolean; // Added by Admin
  hasPaidPublicationSubscription: boolean; // Teacher paid subscription fee to publish
  rating: number;
  ratingCount: number;
  enrolledStudentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  completedLessonIds: string[];
  quizScores: {
    lessonId: string;
    score: number;
    maxScore: number;
    passed: boolean;
    date: string;
  }[];
  lastAccessedLessonId?: string;
  enrolledAt: string;
  completionPercentage: number;
  isCertificateEarned?: boolean;
}

export type PaymentMethod = 'wave' | 'orange_money' | 'mtn_money' | 'moov_money' | 'card';

export interface Transaction {
  id: string;
  type: 'course_purchase' | 'teacher_subscription' | 'teacher_payout';
  userId: string;
  userName: string;
  userRole: UserRole;
  courseId?: string;
  courseTitle?: string;
  amountXOF: number;
  amountEUR: number;
  currency: 'XOF' | 'EUR' | 'USD';
  method: PaymentMethod;
  phoneNumber?: string;
  cardLast4?: string;
  status: 'completed' | 'pending' | 'failed';
  platformCommissionXOF: number; // 20% on course sales, 100% on teacher subscriptions
  teacherEarningXOF: number; // 80% on course sales
  createdAt: string;
  reference: string;
}

export interface PromoNotification {
  id: string;
  title: string;
  message: string;
  code?: string;
  discountPercentage?: number;
  targetRole: 'all' | 'student' | 'teacher';
  createdAt: string;
  expiresAt?: string;
  readBy: string[]; // user IDs
}

export interface PayoutRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  amountXOF: number;
  provider: 'wave' | 'orange' | 'mtn' | 'bank';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface BroadcastEmail {
  id: string;
  senderId: string;
  senderName: string;
  courseId: string;
  courseTitle: string;
  recipientCount: number;
  subject: string;
  body: string;
  sentAt: string;
}
