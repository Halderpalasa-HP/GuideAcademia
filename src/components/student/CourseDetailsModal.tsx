import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  Play,
  PlayCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface CourseDetailsModalProps {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  onOpenLearningRoom: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnroll,
  onOpenLearningRoom,
}) => {
  const { currentUser, formatPrice, reviews } = useApp();
  const [activeTab, setActiveTab] = useState<'syllabus' | 'instructor' | 'reviews'>('syllabus');

  const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
  const courseReviews = reviews.filter((r) => r.courseId === course.id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md dark:bg-zinc-800 bg-zinc-200 px-2 py-0.5 text-[11px] font-mono dark:text-zinc-300 text-zinc-700">
              {course.category}
            </span>
            <span className="text-xs dark:text-zinc-400 text-zinc-500">• Niveau {course.level}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 dark:text-zinc-400 text-zinc-500 hover:dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-white hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banner & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {course.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{course.subtitle}</p>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{course.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({course.ratingCount} avis)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>{course.enrolledStudentsCount} apprenants inscrits</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>{totalLessons} modules interactifs</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructorName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <p className="text-xs text-slate-400">Créé par</p>
                  <p className="text-sm font-bold text-white">{course.instructorName}</p>
                </div>
              </div>
            </div>

            {/* Right Card / CTA */}
            <div className="rounded-2xl border border-slate-800 bg-[#090D16] p-5 space-y-4 shadow-xl">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full aspect-video rounded-xl object-cover ring-1 ring-slate-800"
              />
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">
                    {formatPrice(course.priceXOF)}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    Accès illimité + Tuteur IA
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-mono text-emerald-400 font-bold">
                  -25% avec code
                </span>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => onOpenLearningRoom(course)}
                  className="w-full rounded-xl bg-[#6366F1] py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Accéder à la Salle de Cours
                </button>
              ) : (
                <button
                  onClick={() => onEnroll(course)}
                  className="w-full rounded-xl bg-[#10B981] py-3.5 text-sm font-bold text-slate-950 hover:bg-[#34D399] transition-all glow-emerald flex items-center justify-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  S'inscrire (Wave, Orange, MTN, Carte)
                </button>
              )}

              <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  Vidéos HD, Diapositives PDF & Articles
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  Exercices pratiques & Quizz avec notation
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  Tuteur IA Gemini 2.5 contextuel disponible
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-amber-400" />
                  Certificat de réussite nominatif à 100%
                </p>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="border-b border-slate-800 flex gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`pb-3 transition-colors ${
                activeTab === 'syllabus'
                  ? 'border-b-2 border-indigo-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Programme du Cours ({course.modules.length} modules)
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`pb-3 transition-colors ${
                activeTab === 'instructor'
                  ? 'border-b-2 border-indigo-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              À Propos du Formateur
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-indigo-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Avis des Étudiants ({courseReviews.length})
            </button>
          </div>

          {/* Tab: Syllabus */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">{course.description}</p>
              <div className="space-y-3">
                {course.modules.map((module, mIdx) => (
                  <div
                    key={module.id}
                    className="rounded-xl border border-slate-800 bg-[#090D16] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{module.title}</h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {module.lessons.length} leçons
                      </span>
                    </div>
                    {module.description && (
                      <p className="text-xs text-slate-400">{module.description}</p>
                    )}

                    <div className="divide-y divide-slate-800/80 pt-1">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 text-slate-200">
                            {lesson.type === 'video' && (
                              <PlayCircle className="h-4 w-4 text-indigo-400" />
                            )}
                            {lesson.type === 'pdf' && (
                              <FileText className="h-4 w-4 text-emerald-400" />
                            )}
                            {lesson.type === 'text' && (
                              <BookOpen className="h-4 w-4 text-purple-400" />
                            )}
                            <span className="font-medium">{lesson.title}</span>
                            {lesson.quiz && lesson.quiz.length > 0 && (
                              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-300">
                                Quizz inclus
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 font-mono text-slate-500 text-[11px]">
                            <span>{lesson.durationMinutes} min</span>
                            {lesson.isFreePreview ? (
                              <span className="text-emerald-400 font-semibold font-sans">
                                Aperçu gratuit
                              </span>
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-slate-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Instructor */}
          {activeTab === 'instructor' && (
            <div className="rounded-xl border border-slate-800 bg-[#090D16] p-5 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructorName}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{course.instructorName}</h4>
                  <p className="text-xs text-indigo-400 font-medium">Formateur Vérifié EduSphere</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Spécialiste des formations à fort impact technologique et pratique.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Le formateur a conçu ce cours selon une méthodologie orientée projet, permettant aux
                apprenants de construire des applications opérationnelles et de maîtriser les outils réels.
              </p>
            </div>
          )}

          {/* Tab: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {courseReviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Aucun avis n'a encore été publié pour ce cours. Soyez le premier !
                </p>
              ) : (
                <div className="space-y-3">
                  {courseReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-800 bg-[#090D16] p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.studentAvatar}
                            alt={rev.studentName}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-200">{rev.studentName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{rev.comment}</p>

                      {rev.instructorReply && (
                        <div className="mt-2 rounded-lg border-l-2 border-indigo-500 bg-slate-900/80 p-2.5 text-[11px] text-slate-300">
                          <p className="font-semibold text-indigo-300 mb-0.5">
                            Réponse du formateur :
                          </p>
                          <p>{rev.instructorReply.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
