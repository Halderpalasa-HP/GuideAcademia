import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Lightbulb,
  Maximize2,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askGeminiTutor } from '../../services/aiService';
import { Course, Lesson, QuizQuestion } from '../../types';

interface LearningRoomProps {
  course: Course;
  onBack: () => void;
}

export const LearningRoom: React.FC<LearningRoomProps> = ({ course, onBack }) => {
  const {
    currentUser,
    getProgress,
    markLessonCompleted,
    recordQuizScore,
    reviews,
    addReview,
  } = useApp();

  const progress = getProgress(course.id) || {
    studentId: currentUser.id,
    courseId: course.id,
    completedLessonIds: [],
    quizScores: [],
    completionPercentage: 0,
    enrolledAt: new Date().toISOString(),
  };

  // Find all lessons flattened
  const allLessons: Lesson[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => allLessons.push(les));
  });

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  // Active view tab in main player: 'content' | 'quiz' | 'discussion'
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'discussion'>('content');

  // Video player custom state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // PDF Viewer state
  const [currentSlidePage, setCurrentSlidePage] = useState(1);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Reviews state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // AI Tutor Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: `Bonjour **${currentUser.name}** ! Je suis votre tuteur IA pour le cours **"${course.title}"**.\n\nJe suis synchronisé sur la leçon : **"${currentLesson.title}"**.\nN'hésitez pas à me poser une question ou à me demander un résumé !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // When lesson changes, reset quiz state and slide page
  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCurrentSlidePage(1);
    setIsPlaying(false);
  }, [currentLessonIndex]);

  const isCompleted = progress.completedLessonIds.includes(currentLesson.id);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
    }
  };

  // Video play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Quiz submission
  const handleQuizSubmit = () => {
    if (!currentLesson.quiz) return;

    let totalPoints = 0;
    let earnedPoints = 0;

    currentLesson.quiz.forEach((q) => {
      totalPoints += q.points;
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selectedOptionId === correctOption?.id) {
        earnedPoints += q.points;
      }
    });

    setQuizScore(earnedPoints);
    setQuizSubmitted(true);
    recordQuizScore(course.id, currentLesson.id, earnedPoints, totalPoints);
  };

  // Review submission
  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    addReview(course.id, newRating, newComment);
    setNewComment('');
    setIsSubmittingReview(false);
  };

  // AI Tutor Send
  const handleSendAi = async (promptText?: string) => {
    const text = promptText || aiInput;
    if (!text.trim() || aiLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await askGeminiTutor(
        text,
        {
          courseTitle: course.title,
          lessonTitle: currentLesson.title,
          lessonType: currentLesson.type,
          lessonContent: currentLesson.textContent || currentLesson.title,
          studentName: currentUser.name,
        },
        chatMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }))
      );

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Je suis désolé, une interruption réseau est survenue. N'hésitez pas à reformuler votre question.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const courseReviews = reviews.filter((r) => r.courseId === course.id);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] dark:bg-black bg-[#f8fafc] dark:text-zinc-100 text-zinc-900 overflow-hidden -mx-4 -mb-8 sm:-mx-6 lg:-mx-8 transition-colors">
      {/* Top Learning Bar */}
      <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-zinc-100 px-2.5 py-1.5 text-xs dark:text-zinc-300 text-zinc-700 hover:dark:text-white hover:text-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Retour au catalogue</span>
          </button>
          <div className="h-4 w-px dark:bg-zinc-800 bg-zinc-300" />
          <h2 className="text-xs sm:text-sm font-bold dark:text-white text-zinc-900 truncate max-w-xs sm:max-w-md">
            {course.title}
          </h2>
        </div>

        {/* Course Progress Header & AI Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Progression :</span>
            <div className="h-2 w-28 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {progress.completionPercentage}%
            </span>
          </div>

          {progress.isCertificateEarned && (
            <span className="hidden lg:flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
              <Award className="h-3 w-3" />
              Certifié
            </span>
          )}

          <button
            onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isAiDrawerOpen
                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/25 glow-violet'
                : 'border border-purple-500/30 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tuteur IA</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Lesson Sidebar (Collapsible on mobile) */}
        <div className="hidden lg:flex flex-col w-80 border-r dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white shrink-0">
          <div className="p-3 border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-zinc-600">
              Sommaire du Cours
            </span>
            <span className="text-[11px] font-mono dark:text-zinc-500 text-zinc-500">
              {progress.completedLessonIds.length}/{allLessons.length} validés
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {course.modules.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-1">
                <p className="px-2 pt-1 text-[11px] font-bold uppercase tracking-wider dark:text-zinc-400 text-zinc-600">
                  {mod.title}
                </p>
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const lesIdx = allLessons.findIndex((l) => l.id === les.id);
                    const isSelected = currentLesson.id === les.id;
                    const isDone = progress.completedLessonIds.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => setCurrentLessonIndex(lesIdx)}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                          isSelected
                            ? 'dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-700 border-zinc-300 dark:text-white text-zinc-900 font-semibold'
                            : 'dark:text-zinc-400 text-zinc-600 hover:dark:bg-zinc-900/50 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isDone ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Play className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="font-mono text-[10px] dark:text-zinc-500 text-zinc-400 shrink-0 ml-1">
                          {les.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Primary Player & Exercise Area */}
        <div className="flex-1 flex flex-col overflow-y-auto dark:bg-black bg-[#f8fafc]">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A]/80 px-4 py-2 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'content'
                    ? 'bg-[#1E293B] text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentLesson.type === 'video'
                  ? 'Vidéo HD'
                  : currentLesson.type === 'pdf'
                  ? 'Diapositives PDF'
                  : 'Article / Guide Texte'}
              </button>

              {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Exercice Pratique & Quizz ({currentLesson.quiz.length})
                </button>
              )}

              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'discussion'
                    ? 'bg-[#1E293B] text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                Commentaires & Avis ({courseReviews.length})
              </button>
            </div>

            {/* Mark as completed button */}
            <button
              onClick={() => markLessonCompleted(course.id, currentLesson.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <CheckCircle className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Leçon Complétée' : 'Marquer comme terminée'}</span>
            </button>
          </div>

          {/* Tab 1: Content (Video, PDF, or Text) */}
          {activeTab === 'content' && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* VIDEO FORMAT */}
              {currentLesson.type === 'video' && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
                    <video
                      ref={videoRef}
                      src={currentLesson.contentUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      className="h-full w-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls
                    />
                  </div>

                  {/* Video speed pills */}
                  <div className="flex items-center justify-between bg-[#0F172A] rounded-xl p-3 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Vitesse de lecture :</span>
                      {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`rounded px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                            playbackRate === speed
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSendAi(`Explique-moi les points essentiels de la vidéo "${currentLesson.title}"`)}
                      className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 bg-purple-950/40 border border-purple-500/30 rounded-lg px-2.5 py-1"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      Résumer la vidéo avec l'IA
                    </button>
                  </div>
                </div>
              )}

              {/* PDF FORMAT */}
              {currentLesson.type === 'pdf' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl min-h-[420px] flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-400" />
                        <h3 className="font-bold text-white text-base">
                          {currentLesson.pdfSlides?.[currentSlidePage - 1]?.title || currentLesson.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-slate-400">
                        Diapositive {currentSlidePage} / {currentLesson.pdfSlides?.length || 1}
                      </span>
                    </div>

                    {/* Slide Content Box */}
                    <div className="py-8 px-4 sm:px-8 space-y-4">
                      <div className="rounded-xl border border-slate-800/80 bg-[#090D16] p-6 shadow-inner">
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                          {currentLesson.pdfSlides?.[currentSlidePage - 1]?.content ||
                            "Support de présentation PDF interactif. Utilisez les touches précédentes et suivantes pour parcourir les diapositives du formateur."}
                        </p>
                      </div>
                    </div>

                    {/* PDF Navigation controls */}
                    <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                      <button
                        onClick={() => setCurrentSlidePage((p) => Math.max(1, p - 1))}
                        disabled={currentSlidePage === 1}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert("Téléchargement du support PDF déclenché.")}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Télécharger le PDF
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          setCurrentSlidePage((p) =>
                            Math.min(currentLesson.pdfSlides?.length || 1, p + 1)
                          )
                        }
                        disabled={
                          currentSlidePage === (currentLesson.pdfSlides?.length || 1)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TEXT / ARTICLE FORMAT */}
              {currentLesson.type === 'text' && (
                <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8 space-y-6">
                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300 text-sm leading-relaxed">
                    <div className="whitespace-pre-line font-sans">
                      {currentLesson.textContent || "Aucun contenu textuel disponible pour cette leçon."}
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Summary and Next/Prev buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Leçon précédente
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                  className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-5 py-2 text-xs font-bold text-white hover:bg-indigo-600 disabled:opacity-30 transition-all shadow-md shadow-indigo-500/20"
                >
                  Leçon suivante
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Quiz & Interactive Exercises */}
          {activeTab === 'quiz' && currentLesson.quiz && (
            <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Exercices d'Application : {currentLesson.title}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Répondez aux questions ci-dessous pour valider vos acquis. Le seuil de validation est de 70%.
                </p>
              </div>

              <div className="space-y-6">
                {currentLesson.quiz.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-bold text-white">
                        <span className="text-indigo-400 mr-2 font-mono">#{idx + 1}</span>
                        {q.question}
                      </h4>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 shrink-0">
                        {q.points} pts
                      </span>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isSelected = selectedAnswers[q.id] === opt.id;
                        let optionStyle =
                          'border-slate-800 bg-[#090D16] text-slate-300 hover:border-slate-700';

                        if (isSelected) {
                          optionStyle = 'border-indigo-500 bg-indigo-950/30 text-white font-medium';
                        }

                        if (quizSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-semibold';
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = 'border-red-500 bg-red-950/30 text-red-200';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                            }
                            className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left text-xs transition-all ${optionStyle}`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                isSelected ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && '✓'}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="rounded-xl border border-slate-800 bg-[#060E20] p-3 text-xs text-slate-300">
                        <p className="font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Explication pédagogique :
                        </p>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit or Result view */}
              <div className="flex items-center justify-between pt-4">
                {quizSubmitted ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">
                      Score obtenu :{' '}
                      <span className="text-emerald-400 font-mono text-base">{quizScore} pts</span>
                    </span>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Recommencer l'exercice
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < currentLesson.quiz.length}
                    className="rounded-xl bg-[#10B981] px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-[#34D399] transition-all glow-emerald disabled:opacity-40"
                  >
                    Valider mes réponses
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Discussion & Reviews on Teacher's Course */}
          {activeTab === 'discussion' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
              {/* Form to leave a review */}
              <form
                onSubmit={handlePostReview}
                className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    Poser une question ou laisser un avis à l'enseignant
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            newRating >= star ? 'fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ex: Merci pour l'explication sur Wave ! J'ai une question sur la vérification HMAC..."
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] p-3 text-xs text-white placeholder-slate-500 focus:border-[#6366F1] focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingReview}
                    className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Envoyer le commentaire
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Commentaires des apprenants ({courseReviews.length})
                </h4>

                {courseReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-800 bg-[#0F172A] p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.studentAvatar}
                          alt={rev.studentName}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="font-bold text-slate-200">{rev.studentName}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-2">
                            {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed pl-9">{rev.comment}</p>

                    {rev.instructorReply && (
                      <div className="mt-2 ml-9 rounded-xl border-l-2 border-emerald-500 bg-[#090D16] p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Bot className="h-3.5 w-3.5" />
                            Réponse de {course.instructorName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(rev.instructorReply.repliedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-slate-300">{rev.instructorReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: Pedagogical Assistant */}
        {isAiDrawerOpen && (
          <div className="w-80 sm:w-96 border-l dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white flex flex-col shrink-0 shadow-xl relative transition-colors">
            {/* AI Drawer Header */}
            <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-black bg-zinc-50 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl dark:bg-zinc-900 bg-zinc-200 text-emerald-500 border dark:border-zinc-700 border-zinc-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold dark:text-white text-zinc-900 flex items-center gap-1.5">
                    Assistant Pédagogique
                    <span className="rounded dark:bg-zinc-800 bg-zinc-200 px-1 py-0.2 text-[9px] font-mono dark:text-zinc-300 text-zinc-700">
                      GEMINI
                    </span>
                  </h3>
                  <p className="text-[10px] dark:text-zinc-400 text-zinc-500">Synchronisé sur votre leçon</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="rounded-lg p-1 dark:text-zinc-400 text-zinc-500 hover:dark:text-white hover:text-black hover:dark:bg-zinc-800 hover:bg-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 p-2 dark:bg-black bg-zinc-100 border-b dark:border-zinc-800 border-zinc-200 overflow-x-auto scrollbar-none text-[11px]">
              <button
                onClick={() => handleSendAi('Explique-moi cette leçon de façon simple et imagée.')}
                className="whitespace-nowrap rounded-lg dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-300 px-2.5 py-1 dark:text-zinc-300 text-zinc-700 hover:border-emerald-500"
              >
                💡 Vulgariser
              </button>
              <button
                onClick={() => handleSendAi('Donne-moi un exemple concret de code pour appliquer cette notion.')}
                className="whitespace-nowrap rounded-lg dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-300 px-2.5 py-1 dark:text-zinc-300 text-zinc-700 hover:border-emerald-500"
              >
                💻 Exemple Code
              </button>
              <button
                onClick={() => handleSendAi('Fais-moi un mini-quizz de 2 questions pour tester ma compréhension.')}
                className="whitespace-nowrap rounded-lg dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-300 px-2.5 py-1 dark:text-zinc-300 text-zinc-700 hover:border-emerald-500"
              >
                🎯 Mini-Quizz
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans dark:bg-zinc-950 bg-white">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'dark:bg-zinc-800 bg-zinc-900 text-white rounded-br-none shadow-sm'
                        : 'dark:bg-black bg-zinc-50 border dark:border-zinc-800 border-zinc-200 dark:text-zinc-200 text-zinc-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono text-emerald-500 font-bold">
                        <Bot className="h-3 w-3" />
                        Tuteur EduSphere
                      </div>
                    )}
                    <div className="whitespace-pre-line prose prose-xs dark:prose-invert">
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono dark:text-zinc-500 text-zinc-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-center gap-2 p-3 text-xs text-purple-300 glass-panel rounded-2xl max-w-[80%]">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                  <span>Le tuteur IA analyse votre question...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t dark:border-zinc-800 border-zinc-200 dark:bg-black bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                  placeholder="Posez votre question au tuteur..."
                  className="flex-1 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-white px-3 py-2 text-xs dark:text-white text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSendAi()}
                  disabled={!aiInput.trim() || aiLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
