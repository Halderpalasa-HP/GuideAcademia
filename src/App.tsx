import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/common/AuthModal';
import { Header } from './components/common/Header';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { PaymentModal } from './components/common/PaymentModal';
import { CourseCatalog } from './components/student/CourseCatalog';
import { CourseDetailsModal } from './components/student/CourseDetailsModal';
import { LearningRoom } from './components/student/LearningRoom';
import { StudentProfile } from './components/student/StudentProfile';
import { TeacherStudio } from './components/teacher/TeacherStudio';
import { AppProvider, useApp } from './context/AppContext';
import { Course } from './types';

function MainApp() {
  const { currentUser, switchUser, users } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [courseToEnroll, setCourseToEnroll] = useState<Course | null>(null);
  const [activeCourseForLearning, setActiveCourseForLearning] = useState<Course | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // When a user selects a course to enroll from details or catalog
  const handleStartEnrollment = (course: Course) => {
    setSelectedCourseForDetails(null);
    setCourseToEnroll(course);
  };

  // Launch the interactive learning room
  const handleOpenLearningRoom = (course: Course) => {
    setSelectedCourseForDetails(null);
    setActiveCourseForLearning(course);
    setCurrentTab('learning-room');
  };

  return (
    <div className="min-h-screen dark:bg-black bg-[#f8fafc] dark:text-zinc-100 text-zinc-900 flex flex-col font-sans transition-colors">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab !== 'learning-room') {
            setActiveCourseForLearning(null);
          }
          setCurrentTab(tab);
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
      />

      {/* Account Status Alert Banner if Blocked or Banned */}
      {currentUser.status !== 'active' && (
        <div className="border-b border-red-500/30 bg-red-950/40 p-3 text-center text-xs text-red-300 flex items-center justify-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
          <span>
            {currentUser.status === 'banned'
              ? 'Attention : Votre compte a été banni par l’administrateur. Certaines fonctionnalités sont restreintes.'
              : 'Attention : Votre compte est temporairement bloqué par l’administrateur.'}
          </span>
          <button
            onClick={() => {
              const activeUser = users.find((u) => u.status === 'active');
              if (activeUser) switchUser(activeUser.id);
            }}
            className="underline font-bold text-white ml-2 hover:text-indigo-300"
          >
            Basculer sur un compte actif
          </button>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* VIEW 1: Catalog */}
        {currentTab === 'catalog' && (
          <CourseCatalog
            onSelectCourse={(course) => setSelectedCourseForDetails(course)}
            onOpenLearningRoom={handleOpenLearningRoom}
          />
        )}

        {/* VIEW 2: My Enrolled Courses */}
        {currentTab === 'my-courses' && (
          <StudentProfile onOpenCourse={handleOpenLearningRoom} />
        )}

        {/* VIEW 3: Interactive Learning Room */}
        {currentTab === 'learning-room' && activeCourseForLearning && (
          <LearningRoom
            course={activeCourseForLearning}
            onBack={() => {
              setActiveCourseForLearning(null);
              setCurrentTab('catalog');
            }}
          />
        )}

        {/* VIEW 4: User Profile */}
        {currentTab === 'profile' && (
          <StudentProfile onOpenCourse={handleOpenLearningRoom} />
        )}

        {/* VIEW 5: Teacher Studio */}
        {currentTab === 'teacher-studio' && <TeacherStudio />}

        {/* VIEW 6: Admin Governance & Control */}
        {currentTab === 'admin-center' && <AdminDashboard />}
      </main>

      {/* Modals */}
      {selectedCourseForDetails && (
        <CourseDetailsModal
          course={selectedCourseForDetails}
          onClose={() => setSelectedCourseForDetails(null)}
          onEnroll={handleStartEnrollment}
          onOpenLearningRoom={handleOpenLearningRoom}
        />
      )}

      {courseToEnroll && (
        <PaymentModal
          course={courseToEnroll}
          mode="student_course"
          onClose={() => setCourseToEnroll(null)}
          onSuccess={(tx) => {
            setCourseToEnroll(null);
            handleOpenLearningRoom(courseToEnroll);
          }}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole="student"
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      {/* Footer */}
      {currentTab !== 'learning-room' && (
        <footer className="border-t dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white py-12 mt-12 text-xs dark:text-zinc-400 text-zinc-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-300 text-emerald-500 shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-display text-lg font-extrabold dark:text-white text-zinc-900">
                    Edu<span className="text-emerald-500">Sphere</span>
                  </span>
                  <p className="text-[11px] dark:text-zinc-500 text-zinc-400">Plateforme Panafricaine & Internationale de Formations Pro</p>
                </div>
              </div>

              {/* Supported payment badges in footer */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono dark:text-zinc-400 text-zinc-600">
                <span className="dark:text-zinc-500 text-zinc-400 font-sans mr-1">Moyens de paiement acceptés :</span>
                <span className="rounded dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200 px-2.5 py-1 text-cyan-600 dark:text-cyan-400 font-bold">
                  🌊 Wave
                </span>
                <span className="rounded dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200 px-2.5 py-1 text-orange-600 dark:text-orange-400 font-bold">
                  🍊 Orange Money
                </span>
                <span className="rounded dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200 px-2.5 py-1 text-yellow-600 dark:text-yellow-400 font-bold">
                  📱 MTN MoMo
                </span>
                <span className="rounded dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200 px-2.5 py-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  📲 Moov Money
                </span>
                <span className="rounded dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200 px-2.5 py-1 text-indigo-600 dark:text-indigo-400 font-bold">
                  💳 Visa & Mastercard
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t dark:border-zinc-800 border-zinc-200 pt-6 gap-4 text-[11px]">
              <p>© 2026 EduSphere. Déployable immédiatement sur Vercel.</p>
              <div className="flex items-center gap-4 dark:text-zinc-500 text-zinc-400">
                <span>Modèle économique : Type Udemy (Commissions + Abonnements Formateurs)</span>
                <span>• Tuteur IA Gemini 2.5</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
