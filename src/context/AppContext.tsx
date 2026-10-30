import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BroadcastEmail,
  Course,
  CourseReview,
  PaymentMethod,
  PayoutRequest,
  PromoNotification,
  StudentProgress,
  Transaction,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../data/mockData';

interface AppContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'light') => void;

  // User & Auth
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  login: (email: string) => { success: boolean; message?: string };
  register: (data: { name: string; email: string; role: UserRole; phone?: string; headline?: string }) => User;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  
  // Admin User Governance
  addStudent: (data: { name: string; email: string; phone?: string; headline?: string }) => User;
  banUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  setUserRole: (userId: string, newRole: UserRole) => void;
  assignAdmin: (userId: string) => void;

  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'enrolledStudentsCount'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCoursePublish: (id: string) => void;
  
  // Monetization & Payments
  currency: 'XOF' | 'EUR' | 'USD';
  setCurrency: (c: 'XOF' | 'EUR' | 'USD') => void;
  formatPrice: (amountXOF: number) => string;
  transactions: Transaction[];
  enrollAndPayCourse: (
    courseId: string,
    method: PaymentMethod,
    details: { phone?: string; cardLast4?: string; promoCode?: string }
  ) => Promise<{ success: boolean; transaction: Transaction }>;
  payTeacherSubscription: (
    courseId: string,
    method: PaymentMethod,
    details: { phone?: string; cardLast4?: string }
  ) => Promise<{ success: boolean; transaction: Transaction }>;

  // Learning Progress & Quizzes
  progressList: StudentProgress[];
  getProgress: (courseId: string, studentId?: string) => StudentProgress | undefined;
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  recordQuizScore: (courseId: string, lessonId: string, score: number, maxScore: number) => void;

  // Reviews & Comments
  reviews: CourseReview[];
  addReview: (courseId: string, rating: number, comment: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;

  // Teacher Studio Tools
  broadcastEmails: BroadcastEmail[];
  sendBroadcastEmail: (courseId: string, subject: string, body: string) => void;
  payoutRequests: PayoutRequest[];
  requestPayout: (teacherId: string, amountXOF: number, provider: 'wave' | 'orange' | 'mtn' | 'bank', accountDetails: string) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string) => void;

  // Admin Broadcast & Financials
  promoNotifications: PromoNotification[];
  createPromoNotification: (data: Omit<PromoNotification, 'id' | 'createdAt' | 'readBy'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getTeacherBalance: (teacherId: string) => { totalEarned: number; paidOut: number; available: number };
  getPlatformFinancials: () => {
    totalPlatformRevenueXOF: number;
    courseSalesCommissionXOF: number;
    teacherSubscriptionRevenueXOF: number;
    totalPayoutsApprovedXOF: number;
    pendingPayoutsXOF: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`edusphere_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const storedUser = loadStored<User | null>('currentUser', null);
    if (storedUser) {
      const found = users.find((u) => u.id === storedUser.id);
      if (found) return found;
    }
    return users[0]; // Default to Aminata (Student)
  });

  const [courses, setCourses] = useState<Course[]>(() => loadStored('courses', INITIAL_COURSES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStored('transactions', INITIAL_TRANSACTIONS));
  const [reviews, setReviews] = useState<CourseReview[]>(() => loadStored('reviews', INITIAL_REVIEWS));
  const [promoNotifications, setPromoNotifications] = useState<PromoNotification[]>(() =>
    loadStored('notifications', INITIAL_NOTIFICATIONS)
  );
  const [broadcastEmails, setBroadcastEmails] = useState<BroadcastEmail[]>(() => loadStored('emails', []));
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() =>
    loadStored('payouts', [
      {
        id: 'payout-1',
        teacherId: 'user-teacher-1',
        teacherName: 'Dr. Kwesi Mensah',
        amountXOF: 30000,
        provider: 'wave',
        accountDetails: '+221 78 999 88 77',
        status: 'approved',
        requestedAt: '2026-10-22T10:00:00Z',
        processedAt: '2026-10-22T14:00:00Z',
      },
    ])
  );

  // Realistic Human Portraits for humanized profiles
  const REALISTIC_PORTRAITS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  ];

  // Theme Management (pure black dark vs clean light)
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return loadStored<'dark' | 'light'>('theme', 'dark');
  });

  useEffect(() => {
    localStorage.setItem('edusphere_theme', JSON.stringify(theme));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const [currency, setCurrency] = useState<'XOF' | 'EUR' | 'USD'>('XOF');

  // Student progress state
  const [progressList, setProgressList] = useState<StudentProgress[]>(() =>
    loadStored('progress', [
      {
        studentId: 'user-student-1',
        courseId: 'course-1',
        completedLessonIds: ['les-1-1'],
        quizScores: [
          {
            lessonId: 'les-1-1',
            score: 10,
            maxScore: 10,
            passed: true,
            date: '2026-10-22T15:00:00Z',
          },
        ],
        lastAccessedLessonId: 'les-1-2',
        enrolledAt: '2026-10-20T14:15:00Z',
        completionPercentage: 33,
      },
      {
        studentId: 'user-student-1',
        courseId: 'course-2',
        completedLessonIds: [],
        quizScores: [],
        lastAccessedLessonId: 'les-ai-1',
        enrolledAt: '2026-10-26T12:00:00Z',
        completionPercentage: 0,
      },
    ])
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('edusphere_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('edusphere_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem('edusphere_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('edusphere_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('edusphere_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('edusphere_notifications', JSON.stringify(promoNotifications));
  }, [promoNotifications]);
  useEffect(() => {
    localStorage.setItem('edusphere_progress', JSON.stringify(progressList));
  }, [progressList]);
  useEffect(() => {
    localStorage.setItem('edusphere_emails', JSON.stringify(broadcastEmails));
  }, [broadcastEmails]);
  useEffect(() => {
    localStorage.setItem('edusphere_payouts', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  // Currency Formatter
  const formatPrice = (amountXOF: number): string => {
    if (currency === 'EUR') {
      const eur = Math.round(amountXOF / 655.957);
      return `${eur} €`;
    }
    if (currency === 'USD') {
      const usd = Math.round(amountXOF / 600);
      return `$${usd}`;
    }
    return `${amountXOF.toLocaleString('fr-FR')} FCFA`;
  };

  // Switch demo user
  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Login
  const login = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'Aucun compte trouvé avec cette adresse email.' };
    }
    if (found.status === 'banned') {
      return { success: false, message: 'Ce compte a été définitivement banni par l\'administrateur.' };
    }
    if (found.status === 'blocked') {
      return { success: false, message: 'Ce compte est temporairement bloqué. Contactez le support.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  // Register
  const register = (data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    headline?: string;
  }): User => {
    const randomPortrait = REALISTIC_PORTRAITS[Math.floor(Math.random() * REALISTIC_PORTRAITS.length)];
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'active',
      avatar: randomPortrait,
      headline: data.headline || (data.role === 'teacher' ? 'Formateur Spécialiste' : 'Étudiant Déterminé'),
      phoneNumber: data.phone || '',
      enrolledCourseIds: [],
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    // switch to first student as default session
    const student = users.find((u) => u.role === 'student' && u.status === 'active') || users[0];
    setCurrentUser(student);
  };

  const updateProfile = (data: Partial<User>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Admin user governance
  const addStudent = (data: { name: string; email: string; phone?: string; headline?: string }): User => {
    const randomPortrait = REALISTIC_PORTRAITS[Math.floor(Math.random() * REALISTIC_PORTRAITS.length)];
    const newStudent: User = {
      id: `student-manual-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      status: 'active',
      avatar: randomPortrait,
      headline: data.headline || 'Étudiant inscrit manuellement par Admin',
      phoneNumber: data.phone || '',
      enrolledCourseIds: [],
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const banUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status: 'banned' }));
    }
  };

  const blockUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'blocked' } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status: 'blocked' }));
    }
  };

  const unblockUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status: 'active' }));
    }
  };

  const setUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const assignAdmin = (userId: string) => {
    setUserRole(userId, 'admin');
  };

  // Course Management
  const addCourse = (
    courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'enrolledStudentsCount'>
  ): Course => {
    const isByAdmin = currentUser.role === 'admin';
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      rating: 5.0,
      ratingCount: 1,
      enrolledStudentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // If added by admin, platform course is automatically verified & subscribed
      hasPaidPublicationSubscription: isByAdmin || courseData.hasPaidPublicationSubscription,
      isPlatformOfficial: isByAdmin,
      isPublished: isByAdmin, // Admin courses publish immediately; teacher needs subscription
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCoursePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (!c.hasPaidPublicationSubscription && !c.isPlatformOfficial) {
            alert("Veuillez d'abord régler l'abonnement de publication pour ce cours.");
            return c;
          }
          return { ...c, isPublished: !c.isPublished };
        }
        return c;
      })
    );
  };

  // Student course purchase
  const enrollAndPayCourse = async (
    courseId: string,
    method: PaymentMethod,
    details: { phone?: string; cardLast4?: string; promoCode?: string }
  ): Promise<{ success: boolean; transaction: Transaction }> => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Cours introuvable');

    let finalPriceXOF = course.priceXOF;
    if (details.promoCode && details.promoCode.toUpperCase() === 'TECHAFRICA') {
      finalPriceXOF = Math.round(finalPriceXOF * 0.75); // 25% promo
    }

    const platformCommissionXOF = Math.round(finalPriceXOF * 0.2); // 20% commission for platform admin
    const teacherEarningXOF = finalPriceXOF - platformCommissionXOF; // 80% to teacher

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'course_purchase',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      courseId: course.id,
      courseTitle: course.title,
      amountXOF: finalPriceXOF,
      amountEUR: Math.round(finalPriceXOF / 655.957),
      currency: 'XOF',
      method,
      phoneNumber: details.phone,
      cardLast4: details.cardLast4,
      status: 'completed',
      platformCommissionXOF,
      teacherEarningXOF,
      createdAt: new Date().toISOString(),
      reference: `EDUS-${method.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update current user & enrolled users list
    const updatedUser = {
      ...currentUser,
      enrolledCourseIds: Array.from(new Set([...currentUser.enrolledCourseIds, courseId])),
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Increment course enrolled count
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledStudentsCount: c.enrolledStudentsCount + 1 } : c))
    );

    // Init progress
    setProgressList((prev) => {
      const exists = prev.find((p) => p.studentId === currentUser.id && p.courseId === courseId);
      if (exists) return prev;
      const initialLesson = course.modules[0]?.lessons[0]?.id;
      return [
        ...prev,
        {
          studentId: currentUser.id,
          courseId,
          completedLessonIds: [],
          quizScores: [],
          lastAccessedLessonId: initialLesson,
          enrolledAt: new Date().toISOString(),
          completionPercentage: 0,
        },
      ];
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // non-blocking
    }

    return { success: true, transaction: newTx };
  };

  // Teacher pays publication subscription
  const payTeacherSubscription = async (
    courseId: string,
    method: PaymentMethod,
    details: { phone?: string; cardLast4?: string }
  ): Promise<{ success: boolean; transaction: Transaction }> => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Cours introuvable');

    const subscriptionFeeXOF = 15000; // 15,000 FCFA (~23 EUR) fixed publication fee

    const newTx: Transaction = {
      id: `sub-${Date.now()}`,
      type: 'teacher_subscription',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      courseId: course.id,
      courseTitle: `Abonnement publication : ${course.title}`,
      amountXOF: subscriptionFeeXOF,
      amountEUR: 23,
      currency: 'XOF',
      method,
      phoneNumber: details.phone,
      cardLast4: details.cardLast4,
      status: 'completed',
      platformCommissionXOF: subscriptionFeeXOF, // 100% platform revenue for admin
      teacherEarningXOF: 0,
      createdAt: new Date().toISOString(),
      reference: `SUB-PUBLISH-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Mark course as paid subscription and published
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, hasPaidPublicationSubscription: true, isPublished: true } : c))
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // non-blocking
    }

    return { success: true, transaction: newTx };
  };

  // Progress Management
  const getProgress = (courseId: string, studentId: string = currentUser.id): StudentProgress | undefined => {
    return progressList.find((p) => p.courseId === courseId && p.studentId === studentId);
  };

  const markLessonCompleted = (courseId: string, lessonId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

    setProgressList((prev) => {
      const current = prev.find((p) => p.courseId === courseId && p.studentId === currentUser.id);
      if (!current) {
        const percentage = Math.round((1 / Math.max(1, totalLessons)) * 100);
        return [
          ...prev,
          {
            studentId: currentUser.id,
            courseId,
            completedLessonIds: [lessonId],
            quizScores: [],
            lastAccessedLessonId: lessonId,
            enrolledAt: new Date().toISOString(),
            completionPercentage: percentage,
            isCertificateEarned: percentage === 100,
          },
        ];
      }

      const completed = Array.from(new Set([...current.completedLessonIds, lessonId]));
      const percentage = Math.round((completed.length / Math.max(1, totalLessons)) * 100);

      if (percentage === 100 && !current.isCertificateEarned) {
        try {
          confetti({ particleCount: 120, spread: 100 });
        } catch {
          // ignore
        }
      }

      return prev.map((p) =>
        p.courseId === courseId && p.studentId === currentUser.id
          ? {
              ...p,
              completedLessonIds: completed,
              lastAccessedLessonId: lessonId,
              completionPercentage: percentage,
              isCertificateEarned: percentage === 100,
            }
          : p
      );
    });
  };

  const recordQuizScore = (courseId: string, lessonId: string, score: number, maxScore: number) => {
    const passed = score >= maxScore * 0.7; // 70% threshold
    setProgressList((prev) => {
      const current = prev.find((p) => p.courseId === courseId && p.studentId === currentUser.id);
      if (!current) return prev;

      const filteredScores = current.quizScores.filter((q) => q.lessonId !== lessonId);
      const updatedScores = [
        ...filteredScores,
        {
          lessonId,
          score,
          maxScore,
          passed,
          date: new Date().toISOString(),
        },
      ];

      return prev.map((p) =>
        p.courseId === courseId && p.studentId === currentUser.id
          ? {
              ...p,
              quizScores: updatedScores,
            }
          : p
      );
    });

    if (passed) {
      markLessonCompleted(courseId, lessonId);
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {
        // ignore
      }
    }
  };

  // Reviews
  const addReview = (courseId: string, rating: number, comment: string) => {
    const newRev: CourseReview = {
      id: `rev-${Date.now()}`,
      courseId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate course rating
    const courseReviews = [newRev, ...reviews.filter((r) => r.courseId === courseId)];
    const avg = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              rating: Math.round(avg * 10) / 10,
              ratingCount: courseReviews.length,
            }
          : c
      )
    );
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              instructorReply: {
                text: replyText,
                repliedAt: new Date().toISOString(),
              },
            }
          : r
      )
    );
  };

  // Teacher email broadcast
  const sendBroadcastEmail = (courseId: string, subject: string, body: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const enrolledStudents = users.filter((u) => u.enrolledCourseIds.includes(courseId));
    const newBroadcast: BroadcastEmail = {
      id: `email-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      courseId,
      courseTitle: course.title,
      recipientCount: enrolledStudents.length || course.enrolledStudentsCount,
      subject,
      body,
      sentAt: new Date().toISOString(),
    };
    setBroadcastEmails((prev) => [newBroadcast, ...prev]);
  };

  // Teacher balance & payouts
  const getTeacherBalance = (teacherId: string) => {
    const sales = transactions.filter(
      (tx) => tx.type === 'course_purchase' && tx.status === 'completed'
    );
    // Find courses belonging to this teacher
    const teacherCourseIds = courses.filter((c) => c.instructorId === teacherId).map((c) => c.id);
    const teacherSales = sales.filter((tx) => tx.courseId && teacherCourseIds.includes(tx.courseId));
    const totalEarned = teacherSales.reduce((acc, tx) => acc + (tx.teacherEarningXOF || 0), 0);

    const paidOut = payoutRequests
      .filter((p) => p.teacherId === teacherId && p.status === 'approved')
      .reduce((acc, p) => acc + p.amountXOF, 0);

    const pending = payoutRequests
      .filter((p) => p.teacherId === teacherId && p.status === 'pending')
      .reduce((acc, p) => acc + p.amountXOF, 0);

    const available = Math.max(0, totalEarned - paidOut - pending);

    return { totalEarned, paidOut, available };
  };

  const requestPayout = (
    teacherId: string,
    amountXOF: number,
    provider: 'wave' | 'orange' | 'mtn' | 'bank',
    accountDetails: string
  ) => {
    const teacher = users.find((u) => u.id === teacherId);
    const newRequest: PayoutRequest = {
      id: `payout-${Date.now()}`,
      teacherId,
      teacherName: teacher ? teacher.name : 'Formateur',
      amountXOF,
      provider,
      accountDetails,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    setPayoutRequests((prev) => [newRequest, ...prev]);
  };

  const approvePayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'approved', processedAt: new Date().toISOString() } : p))
    );
  };

  const rejectPayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'rejected', processedAt: new Date().toISOString() } : p))
    );
  };

  // Admin Broadcasts & Notifications
  const createPromoNotification = (data: Omit<PromoNotification, 'id' | 'createdAt' | 'readBy'>) => {
    const newNotif: PromoNotification = {
      ...data,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readBy: [],
    };
    setPromoNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setPromoNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              readBy: Array.from(new Set([...n.readBy, currentUser.id])),
            }
          : n
      )
    );
  };

  // Admin platform ledger calculation
  const getPlatformFinancials = () => {
    let courseSalesCommissionXOF = 0;
    let teacherSubscriptionRevenueXOF = 0;

    transactions.forEach((tx) => {
      if (tx.status === 'completed') {
        if (tx.type === 'course_purchase') {
          courseSalesCommissionXOF += tx.platformCommissionXOF || 0;
        } else if (tx.type === 'teacher_subscription') {
          teacherSubscriptionRevenueXOF += tx.platformCommissionXOF || tx.amountXOF || 0;
        }
      }
    });

    const totalPlatformRevenueXOF = courseSalesCommissionXOF + teacherSubscriptionRevenueXOF;

    const totalPayoutsApprovedXOF = payoutRequests
      .filter((p) => p.status === 'approved')
      .reduce((acc, p) => acc + p.amountXOF, 0);

    const pendingPayoutsXOF = payoutRequests
      .filter((p) => p.status === 'pending')
      .reduce((acc, p) => acc + p.amountXOF, 0);

    return {
      totalPlatformRevenueXOF,
      courseSalesCommissionXOF,
      teacherSubscriptionRevenueXOF,
      totalPayoutsApprovedXOF,
      pendingPayoutsXOF,
    };
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        currentUser,
        users,
        setCurrentUser,
        switchUser,
        login,
        register,
        logout,
        updateProfile,
        addStudent,
        banUser,
        blockUser,
        unblockUser,
        setUserRole,
        assignAdmin,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCoursePublish,
        currency,
        setCurrency,
        formatPrice,
        transactions,
        enrollAndPayCourse,
        payTeacherSubscription,
        progressList,
        getProgress,
        markLessonCompleted,
        recordQuizScore,
        reviews,
        addReview,
        replyToReview,
        broadcastEmails,
        sendBroadcastEmail,
        payoutRequests,
        requestPayout,
        approvePayout,
        rejectPayout,
        promoNotifications,
        createPromoNotification,
        markNotificationAsRead,
        getTeacherBalance,
        getPlatformFinancials,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
