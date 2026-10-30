import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  FileText,
  HelpCircle,
  Mail,
  Plus,
  Send,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, LessonType, Module, QuizQuestion } from '../../types';
import { PaymentModal } from '../common/PaymentModal';

export const TeacherStudio: React.FC = () => {
  const {
    currentUser,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCoursePublish,
    formatPrice,
    getTeacherBalance,
    requestPayout,
    payoutRequests,
    users,
    progressList,
    sendBroadcastEmail,
    broadcastEmails,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'progression' | 'wallet' | 'emails'>('courses');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [courseToSubscribe, setCourseToSubscribe] = useState<Course | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('Développement');
  const [newLevel, setNewLevel] = useState<Course['level']>('Tous niveaux');
  const [newPriceXOF, setNewPriceXOF] = useState(20000);
  const [newThumbnail, setNewThumbnail] = useState(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  );

  // Syllabus builder during course creation
  const [newModules, setNewModules] = useState<Module[]>([
    {
      id: 'mod-init-1',
      title: 'Module 1 : Introduction & Fondamentaux',
      description: 'Prise en main des concepts de base',
      lessons: [
        {
          id: 'les-init-1',
          title: '1. Bienvenue & objectifs de la formation',
          durationMinutes: 15,
          type: 'video',
          contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isFreePreview: true,
          quiz: [
            {
              id: 'q-1',
              question: 'Quel est l’objectif principal de ce module ?',
              options: [
                { id: '1', text: 'Poser les bases théoriques et pratiques', isCorrect: true },
                { id: '2', text: 'Sauter directement en production sans tests', isCorrect: false },
              ],
              explanation: 'Comprendre les fondations évite les erreurs critiques par la suite.',
              points: 10,
            },
          ],
        },
      ],
    },
  ]);

  // Temporary lesson addition state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-init-1');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [lessonDuration, setLessonDuration] = useState(15);
  const [lessonContent, setLessonContent] = useState('');

  // Payout request modal states
  const [payoutAmount, setPayoutAmount] = useState<number>(20000);
  const [payoutProvider, setPayoutProvider] = useState<'wave' | 'orange' | 'mtn' | 'bank'>('wave');
  const [payoutDetails, setPayoutDetails] = useState('+221 78 999 88 77');

  // Email modal states
  const [emailCourseId, setEmailCourseId] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const myCourses = courses.filter((c) => c.instructorId === currentUser.id);
  const balance = getTeacherBalance(currentUser.id);

  // Students enrolled in this teacher's courses
  const myCourseIds = myCourses.map((c) => c.id);
  const enrolledStudents = users.filter((u) =>
    u.enrolledCourseIds.some((cid) => myCourseIds.includes(cid))
  );

  const handleAddLessonToModule = () => {
    if (!lessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: lessonTitle,
      durationMinutes: Number(lessonDuration) || 10,
      type: lessonType,
      contentUrl:
        lessonType === 'video'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          : undefined,
      textContent: lessonType === 'text' ? lessonContent : undefined,
      pdfSlides:
        lessonType === 'pdf'
          ? [
              {
                pageNumber: 1,
                title: lessonTitle,
                content: lessonContent || 'Présentation et résumé des points clés.',
              },
            ]
          : undefined,
      quiz: [
        {
          id: `q-${Date.now()}`,
          question: `Question de révision sur : ${lessonTitle}`,
          options: [
            { id: '1', text: 'Option A (Correcte)', isCorrect: true },
            { id: '2', text: 'Option B (Fausse)', isCorrect: false },
          ],
          explanation: 'Revoir la leçon pour consolider cette notion.',
          points: 10,
        },
      ],
    };

    setNewModules((prev) =>
      prev.map((m) =>
        m.id === selectedModuleId
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      )
    );

    setLessonTitle('');
    setLessonContent('');
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = addCourse({
      title: newTitle,
      subtitle: newSubtitle || 'Formation pratique complète par un expert',
      description: newDescription || 'Contenu pédagogique enrichi avec quiz et exercices.',
      category: newCategory,
      level: newLevel,
      priceXOF: Number(newPriceXOF),
      priceEUR: Math.round(Number(newPriceXOF) / 655.957),
      priceUSD: Math.round(Number(newPriceXOF) / 600),
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      instructorRoleBadge: 'Formateur Certifié',
      thumbnail: newThumbnail,
      modules: newModules,
      tags: [newCategory, 'Formation', 'Pratique'],
      isPublished: false,
      hasPaidPublicationSubscription: false, // Must pay platform subscription fee
    });

    setShowCreateModal(false);
    // Prompt teacher to pay subscription fee to publish
    setCourseToSubscribe(created);
    setShowSubscriptionModal(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCourseId || !emailSubject || !emailBody) return;

    sendBroadcastEmail(emailCourseId, emailSubject, emailBody);
    alert('Email envoyé avec succès à tous les étudiants de la promotion !');
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleRequestPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > balance.available) {
      alert('Montant invalide ou solde insuffisant.');
      return;
    }

    requestPayout(currentUser.id, payoutAmount, payoutProvider, payoutDetails);
    alert(`Demande de retrait de ${formatPrice(payoutAmount)} soumise vers ${payoutProvider.toUpperCase()} ! L'administrateur va valider le virement.`);
    setShowPayoutModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-6 sm:p-8 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md dark:bg-emerald-950/40 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-300 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ESPACE CRÉATEUR
            </span>
            <span className="text-xs dark:text-zinc-400 text-zinc-500">Studio Formateur EduSphere</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-zinc-900 tracking-tight">
            Gestion & Monétisation de Vos Formations
          </h1>
          <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-600">
            Publiez vos leçons, suivez vos étudiants, envoyez des annonces et retirez vos gains vers Wave ou Orange Money.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-all shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nouveau cours
        </button>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Wallet Balance */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Solde Disponible (Retrait)</span>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(balance.available)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            80% du montant net des ventes
          </p>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={balance.available <= 0}
            className="mt-3 w-full rounded-lg bg-emerald-500/10 border border-emerald-500/30 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
          >
            Demander un virement
          </button>
        </div>

        {/* Total Earned */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Total Cumulé Gagné</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(balance.totalEarned)}
          </div>
          <p className="text-[11px] dark:text-zinc-400 text-zinc-500 mt-1 font-mono">
            Déjà versé : {formatPrice(balance.paidOut)}
          </p>
        </div>

        {/* Total Students */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Étudiants Inscrits</span>
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {enrolledStudents.length}
          </div>
          <p className="text-[11px] dark:text-zinc-400 text-zinc-500 mt-1 font-mono">
            Sur l'ensemble de vos cours
          </p>
        </div>

        {/* Published Courses */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Catalogue de Cours</span>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">{myCourses.length}</div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {myCourses.filter((c) => c.isPublished).length} publiés en ligne
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4 text-emerald-400" />
          Mes Cours ({myCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('progression')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'progression'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          Suivi de la Progression des Étudiants
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'emails'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="h-4 w-4 text-purple-400" />
          Communication par Email
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'wallet'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="h-4 w-4 text-amber-400" />
          Portefeuille & Retraits Mobile Money
        </button>
      </div>

      {/* TAB 1: COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Gestion de Vos Formations</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Nouveau cours
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">Vous n'avez pas encore créé de cours</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Commencez par ajouter votre premier cours avec vidéos, diapositives PDF, articles et exercices.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 rounded-xl bg-[#10B981] px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-[#34D399]"
              >
                Créer mon premier cours
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((c) => {
                const totalLessons = c.modules.reduce((sum, m) => sum + m.lessons.length, 0);

                return (
                  <div
                    key={c.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden shadow-lg transition-all hover:border-slate-700"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-900">
                        <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover" />
                        <div className="absolute top-2 right-2">
                          {c.isPublished ? (
                            <span className="rounded-full bg-emerald-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px]">
                              Publié en ligne
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px]">
                              Brouillon
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-2">{c.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{c.subtitle}</p>

                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-2">
                          <span>{totalLessons} leçons</span>
                          <span className="text-white font-bold">{formatPrice(c.priceXOF)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription & Action Footer */}
                    <div className="p-5 pt-0 space-y-2">
                      {!c.hasPaidPublicationSubscription && !c.isPlatformOfficial ? (
                        <button
                          onClick={() => {
                            setCourseToSubscribe(c);
                            setShowSubscriptionModal(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-400"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Payer l'abonnement publication ({formatPrice(15000)})
                        </button>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 font-mono">
                          <span className="flex items-center gap-1 font-bold">
                            <CheckCircle className="h-3.5 w-3.5" /> Abonnement réglé
                          </span>
                          <button
                            onClick={() => toggleCoursePublish(c.id)}
                            className="text-slate-300 underline hover:text-white"
                          >
                            {c.isPublished ? 'Dépublier' : 'Publier'}
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => {
                            setEmailCourseId(c.id);
                            setShowEmailModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          <Mail className="h-3 w-3 text-purple-400" />
                          Email élèves
                        </button>

                        <button
                          onClick={() => deleteCourse(c.id)}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-red-400 hover:bg-red-500/20"
                          title="Supprimer le cours"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT PROGRESSION TRACKER */}
      {activeTab === 'progression' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Suivi en Direct des Apprenants Inscrits
            </h2>
            <span className="text-xs text-slate-400">
              {enrolledStudents.length} élèves actifs dans vos cours
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Étudiant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Cours Suivi</th>
                    <th className="py-3 px-4">Progression %</th>
                    <th className="py-3 px-4">Scores aux Quizz</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {enrolledStudents.map((st) => {
                    const studentCourses = myCourses.filter((mc) =>
                      st.enrolledCourseIds.includes(mc.id)
                    );

                    return studentCourses.map((crs) => {
                      const prog = progressList.find(
                        (p) => p.studentId === st.id && p.courseId === crs.id
                      ) || { completionPercentage: 0, quizScores: [] };

                      return (
                        <tr key={`${st.id}-${crs.id}`} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                              />
                              <div>
                                <span className="font-bold text-white block">{st.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {st.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {st.phoneNumber || 'Non renseigné'}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-200 truncate max-w-xs">
                            {crs.title}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400"
                                  style={{ width: `${prog.completionPercentage}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-emerald-400">
                                {prog.completionPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {prog.quizScores && prog.quizScores.length > 0 ? (
                              <span className="text-indigo-400">
                                {prog.quizScores.filter((q) => q.passed).length}/
                                {prog.quizScores.length} quizz validés
                              </span>
                            ) : (
                              <span className="text-slate-500">Pas encore de test</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setEmailCourseId(crs.id);
                                setEmailSubject(`Encouragements pour votre cours : ${crs.title}`);
                                setEmailBody(`Bonjour ${st.name},\n\nJ'ai remarqué votre belle progression dans le cours. Continuez vos efforts !`);
                                setShowEmailModal(true);
                              }}
                              className="rounded bg-slate-800 px-2 py-1 text-[11px] text-indigo-300 hover:bg-slate-700"
                            >
                              Message
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL BROADCASTS */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-400" />
              Historique des Emails & Annonces Groupées
            </h2>
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
              Écrire à une promotion
            </button>
          </div>

          {broadcastEmails.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 text-center text-xs text-slate-400">
              Aucun email groupé n'a encore été envoyé. Utilisez le bouton ci-dessus pour écrire à vos étudiants !
            </div>
          ) : (
            <div className="space-y-3">
              {broadcastEmails.map((em) => (
                <div
                  key={em.id}
                  className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm">{em.subject}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {new Date(em.sentAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>Cours concerné : <strong className="text-slate-200">{em.courseTitle}</strong></span>
                    <span>• {em.recipientCount} destinataires</span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line bg-[#090D16] p-3 rounded-xl border border-slate-800/80 mt-2">
                    {em.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WALLET & PAYOUTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Fonctionnement des Gains et Payouts Formateur
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Pour chaque cours vendu sur EduSphere, vous percevez <strong>80% du prix net</strong>.
              La plateforme prélève une commission de gestion de 20%. Vous pouvez déclencher un retrait instantané vers votre compte Wave, Orange Money ou MTN dès 5 000 FCFA.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setShowPayoutModal(true)}
                disabled={balance.available <= 0}
                className="rounded-xl bg-[#10B981] px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-[#34D399] glow-emerald disabled:opacity-40"
              >
                Demander un virement immédiat
              </button>
            </div>
          </div>

          {/* Payouts list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Historique des Demandes de Retrait
            </h4>
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Date de demande</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Opérateur</th>
                    <th className="py-3 px-4">Coordonnées</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {payoutRequests
                    .filter((p) => p.teacherId === currentUser.id)
                    .map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(pr.requestedAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {formatPrice(pr.amountXOF)}
                        </td>
                        <td className="py-3 px-4 uppercase text-indigo-400 font-bold">
                          {pr.provider}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{pr.accountDetails}</td>
                        <td className="py-3 px-4 font-sans">
                          {pr.status === 'approved' ? (
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                              ✓ Virement Envoyé
                            </span>
                          ) : pr.status === 'rejected' ? (
                            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                              Rejeté
                            </span>
                          ) : (
                            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
                              ⏳ En cours de validation Admin
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#131B2E] px-6 py-4 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                Créer une Nouvelle Formation
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateCourseSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Titre du cours *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Développer des API REST avec Node.js & Wave Checkout"
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sous-titre accrocheur
                  </label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Ex: Maîtrisez les webhooks, idempotence et encaissements automatisés"
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white"
                  >
                    <option value="Développement">Développement</option>
                    <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Niveau</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white"
                  >
                    <option value="Tous niveaux">Tous niveaux</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prix de vente (en FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={newPriceXOF}
                    onChange={(e) => setNewPriceXOF(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image de couverture (URL)
                  </label>
                  <input
                    type="url"
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Syllabus & Lessons Creation in Modal */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Création des Chapitres, Leçons & Quizz
                </h4>

                {/* Modules preview */}
                <div className="space-y-2">
                  {newModules.map((m) => (
                    <div key={m.id} className="rounded-xl border border-slate-800 bg-[#090D16] p-3 text-xs">
                      <p className="font-bold text-white">{m.title}</p>
                      <p className="text-[11px] text-slate-400">{m.lessons.length} leçon(s) configurée(s)</p>
                    </div>
                  ))}
                </div>

                {/* Add a lesson form inline */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/15 p-4 space-y-3">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Plus className="h-4 w-4" />
                    Ajouter une leçon (Vidéo, PDF ou Texte) avec Quizz
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        placeholder="Titre de la leçon (ex: Déploiement sur serveur cloud)"
                        className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <select
                        value={lessonType}
                        onChange={(e) => setLessonType(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3 py-1.5 text-xs text-white"
                      >
                        <option value="video">Format Vidéo</option>
                        <option value="pdf">Format Diapositives PDF</option>
                        <option value="text">Format Texte / Article</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLessonToModule}
                    disabled={!lessonTitle.trim()}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
                  >
                    + Insérer cette leçon
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#10B981] px-6 py-2 text-xs font-bold text-slate-950 hover:bg-[#34D399] glow-emerald"
                >
                  Enregistrer & Procéder à l'abonnement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER SUBSCRIPTION PAYMENT MODAL */}
      {showSubscriptionModal && courseToSubscribe && (
        <PaymentModal
          course={courseToSubscribe}
          mode="teacher_subscription"
          onClose={() => {
            setShowSubscriptionModal(false);
            setCourseToSubscribe(null);
          }}
          onSuccess={() => {
            setShowSubscriptionModal(false);
            setCourseToSubscribe(null);
          }}
        />
      )}

      {/* EMAIL BROADCAST MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-400" />
                Envoyer un Email à la Promotion
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cours concerné
                </label>
                <select
                  required
                  value={emailCourseId}
                  onChange={(e) => setEmailCourseId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white"
                >
                  <option value="">Sélectionnez un cours...</option>
                  {myCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Objet du message *
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Ex: Nouveau chapitre disponible & astuce pour l'exercice 3"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Message / Annonce *
                </label>
                <textarea
                  required
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Chers apprenants, je viens de mettre en ligne une nouvelle vidéo explicative..."
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md"
                >
                  Envoyer aux étudiants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-400" />
                Demande de Virement Formateur
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestPayoutSubmit} className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex justify-between items-center font-mono">
                <span>Solde disponible :</span>
                <span className="text-sm font-bold text-white">{formatPrice(balance.available)}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Montant à retirer (FCFA)
                </label>
                <input
                  type="number"
                  required
                  min={5000}
                  max={balance.available}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Opérateur de réception
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['wave', 'orange', 'mtn'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setPayoutProvider(prov)}
                      className={`rounded-lg border p-2 text-xs font-bold capitalize transition-all ${
                        payoutProvider === prov
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-[#090D16] text-slate-400'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Numéro de téléphone / Compte
                </label>
                <input
                  type="tel"
                  required
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#10B981] py-3 text-xs font-bold text-slate-950 hover:bg-[#34D399] glow-emerald"
              >
                Confirmer la demande de retrait
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
