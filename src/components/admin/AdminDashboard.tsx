import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Ban,
  CheckCircle,
  Coins,
  CreditCard,
  Crown,
  DollarSign,
  Lock,
  Plus,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  TrendingUp,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, PromoNotification, User, UserRole } from '../../types';
import { RoleBadge } from '../common/RoleBadge';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    addStudent,
    banUser,
    blockUser,
    unblockUser,
    setUserRole,
    assignAdmin,
    courses,
    addCourse,
    deleteCourse,
    toggleCoursePublish,
    transactions,
    payoutRequests,
    approvePayout,
    rejectPayout,
    createPromoNotification,
    formatPrice,
    getPlatformFinancials,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'financials' | 'users' | 'courses' | 'promos'>('financials');

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddOfficialCourseModal, setShowAddOfficialCourseModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [adminAssignTarget, setAdminAssignTarget] = useState<User | null>(null);

  // Add student form
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentHeadline, setStudentHeadline] = useState('');

  // Add official course form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('Finance & Fintech');
  const [coursePriceXOF, setCoursePriceXOF] = useState(15000);
  const [courseThumbnail, setCourseThumbnail] = useState(
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
  );

  // Promo notification form
  const [promoTitle, setPromoTitle] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(20);
  const [promoRole, setPromoRole] = useState<'all' | 'student' | 'teacher'>('all');

  // Search in users
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const financials = getPlatformFinancials();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;

    addStudent({
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      headline: studentHeadline,
    });

    alert(`Étudiant ${studentName} ajouté avec succès au système !`);
    setShowAddStudentModal(false);
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
  };

  const handleAddOfficialCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    addCourse({
      title: courseTitle,
      subtitle: courseSubtitle || 'Formation officielle certifiée EduSphere',
      description: courseDescription || 'Cours officiel conçu pour accélérer votre carrière.',
      category: courseCategory,
      level: 'Tous niveaux',
      priceXOF: coursePriceXOF,
      priceEUR: Math.round(coursePriceXOF / 655.957),
      priceUSD: Math.round(coursePriceXOF / 600),
      instructorId: currentUser.id,
      instructorName: 'Direction EduSphere',
      instructorAvatar: currentUser.avatar,
      instructorRoleBadge: 'Officiel Plateforme',
      thumbnail: courseThumbnail,
      modules: [
        {
          id: 'mod-off-1',
          title: 'Module 1 : Maîtrise & Stratégie',
          lessons: [
            {
              id: 'les-off-1',
              title: '1. Introduction Stratégique',
              durationMinutes: 20,
              type: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              isFreePreview: true,
            },
          ],
        },
      ],
      tags: ['Officiel', 'Certification', courseCategory],
      isPublished: true,
      isPlatformOfficial: true,
      hasPaidPublicationSubscription: true,
    });

    alert('Cours officiel de la plateforme créé et publié avec succès !');
    setShowAddOfficialCourseModal(false);
    setCourseTitle('');
  };

  const handleCreatePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim() || !promoMessage.trim()) return;

    createPromoNotification({
      title: promoTitle,
      message: promoMessage,
      code: promoCode ? promoCode.toUpperCase() : undefined,
      discountPercentage: promoDiscount ? Number(promoDiscount) : undefined,
      targetRole: promoRole,
    });

    alert('Notification promotionnelle diffusée à tous les abonnés du site !');
    setShowPromoModal(false);
    setPromoTitle('');
    setPromoMessage('');
    setPromoCode('');
  };

  const handleConfirmAssignAdmin = () => {
    if (!adminAssignTarget) return;
    assignAdmin(adminAssignTarget.id);
    alert(`${adminAssignTarget.name} a été nommé(e) Administrateur avec succès !`);
    setAdminAssignTarget(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-6 sm:p-8 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md dark:bg-amber-950/40 bg-amber-50 border dark:border-amber-500/30 border-amber-300 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
              GOUVERNANCE & ADMINISTRATION
            </span>
            <span className="text-xs dark:text-zinc-400 text-zinc-500">Direction Générale EduSphere</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-zinc-900 tracking-tight">
            Centre de Contrôle & Encaissements Plateforme
          </h1>
          <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-600">
            Gestion globale des utilisateurs, modération des cours, encaissement des abonnements formateurs et des commissions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="flex items-center gap-1.5 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-zinc-100 px-4 py-2.5 text-xs font-bold dark:text-zinc-200 text-zinc-800 hover:dark:bg-zinc-800 hover:bg-zinc-200"
          >
            <UserPlus className="h-4 w-4 text-emerald-500" />
            + Ajouter étudiant
          </button>
          <button
            onClick={() => setShowPromoModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 shadow-sm"
          >
            <Send className="h-4 w-4" />
            Diffuser promo
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform Revenue */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Revenus Nets Plateforme</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(financials.totalPlatformRevenueXOF)}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-mono">
            Abonnements + 20% Commissions
          </p>
        </div>

        {/* Teacher Subscription Earnings */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Abonnements Formateurs</span>
            <Coins className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(financials.teacherSubscriptionRevenueXOF)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            15 000 FCFA par publication
          </p>
        </div>

        {/* Course Sales Commissions */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Commissions Ventes (20%)</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(financials.courseSalesCommissionXOF)}
          </div>
          <p className="text-[11px] dark:text-zinc-400 text-zinc-500 mt-1 font-mono">
            Prélevées sur achats étudiants
          </p>
        </div>

        {/* Pending Teacher Payouts */}
        <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500">
            <span className="font-semibold">Retraits à Valider</span>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold dark:text-white text-zinc-900">
            {formatPrice(financials.pendingPayoutsXOF)}
          </div>
          <p className="text-[11px] dark:text-zinc-400 text-zinc-500 mt-1 font-mono">
            {payoutRequests.filter((p) => p.status === 'pending').length} demande(s) en attente
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'financials'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="h-4 w-4 text-amber-400" />
          Journal Financier & Validations Retraits
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4 text-indigo-400" />
          Gestion Utilisateurs, Rôles & Sécurité ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Modération & Cours Officiels EduSphere
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'promos'
              ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="h-4 w-4 text-purple-400" />
          Promotions & Codes Réduction
        </button>
      </div>

      {/* TAB 1: FINANCIALS & PAYOUT APPROVALS */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Pending Payout Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="h-4 w-4 text-amber-400" />
              Demandes de Retraits Formateurs (Mobile Money / Banque)
            </h3>

            {payoutRequests.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 text-xs text-slate-400 text-center">
                Aucune demande de retrait pour l'instant.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Formateur</th>
                      <th className="py-3 px-4">Montant Requis</th>
                      <th className="py-3 px-4">Opérateur</th>
                      <th className="py-3 px-4">Coordonnées</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Action Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {payoutRequests.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-sans font-bold text-white">{p.teacherName}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {formatPrice(p.amountXOF)}
                        </td>
                        <td className="py-3 px-4 uppercase text-indigo-400 font-bold">{p.provider}</td>
                        <td className="py-3 px-4 text-slate-300">{p.accountDetails}</td>
                        <td className="py-3 px-4 font-sans">
                          {p.status === 'approved' ? (
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              ✓ Validé & Virement Effectué
                            </span>
                          ) : p.status === 'rejected' ? (
                            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                              Rejeté
                            </span>
                          ) : (
                            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                              ⏳ En attente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          {p.status === 'pending' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => approvePayout(p.id)}
                                className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 shadow-sm"
                              >
                                Valider le virement
                              </button>
                              <button
                                onClick={() => rejectPayout(p.id)}
                                className="rounded bg-red-900/60 border border-red-500/40 px-2 py-1 text-[11px] text-red-300 hover:bg-red-900"
                              >
                                Rejeter
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Full Transactions Ledger */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              Grand Livre des Encaissements Plateforme (Tous Paiements)
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Réf</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Montant Brut</th>
                    <th className="py-3 px-4">Part Admin</th>
                    <th className="py-3 px-4">Part Formateur</th>
                    <th className="py-3 px-4">Moyen</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-indigo-400">{t.reference}</td>
                      <td className="py-3 px-4 font-sans text-xs">
                        {t.type === 'teacher_subscription' ? (
                          <span className="rounded bg-amber-500/10 text-amber-300 px-2 py-0.5 border border-amber-500/30">
                            Abonnement Formateur
                          </span>
                        ) : (
                          <span className="rounded bg-indigo-500/10 text-indigo-300 px-2 py-0.5 border border-indigo-500/30">
                            Achat de Cours
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-white">{t.userName}</td>
                      <td className="py-3 px-4 font-bold text-white">{formatPrice(t.amountXOF)}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        +{formatPrice(t.platformCommissionXOF)}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {formatPrice(t.teacherEarningXOF)}
                      </td>
                      <td className="py-3 px-4 uppercase text-slate-300">
                        {t.method.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS GOVERNANCE & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Rechercher par nom, email..."
              className="w-full sm:w-72 rounded-xl border border-slate-800 bg-[#0F172A] px-3.5 py-2 text-xs text-white"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-mono">Filtrer rôle:</span>
              {(['all', 'student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-800 bg-[#0F172A] text-slate-400'
                  }`}
                >
                  {r === 'all' ? 'Tous' : r}
                </button>
              ))}

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="ml-auto rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-[#34D399]"
              >
                + Ajouter étudiant
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Rôle Actuel</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Actions de Rôle</th>
                  <th className="py-3 px-4">Sécurité (Bloquer / Bannir)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <RoleBadge role={u.role} size="sm" />
                    </td>

                    <td className="py-3 px-4">
                      {u.status === 'active' ? (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          Actif
                        </span>
                      ) : u.status === 'blocked' ? (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          Bloqué
                        </span>
                      ) : (
                        <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                          Banni
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {u.phoneNumber || '—'}
                    </td>

                    {/* Change Role */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={u.role}
                          onChange={(e) => setUserRole(u.id, e.target.value as UserRole)}
                          className="rounded border border-slate-700 bg-[#090D16] px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="student">Étudiant</option>
                          <option value="teacher">Professeur</option>
                          <option value="admin">Admin</option>
                        </select>

                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setAdminAssignTarget(u)}
                            className="p-1 rounded bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                            title="Promouvoir comme Administrateur"
                          >
                            <Crown className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Block / Ban Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {u.status === 'blocked' ? (
                          <button
                            onClick={() => unblockUser(u.id)}
                            className="flex items-center gap-1 rounded bg-emerald-600/20 border border-emerald-500/30 px-2 py-1 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-600/30"
                          >
                            <Unlock className="h-3 w-3" />
                            Débloquer
                          </button>
                        ) : (
                          <button
                            onClick={() => blockUser(u.id)}
                            className="flex items-center gap-1 rounded bg-amber-600/20 border border-amber-500/30 px-2 py-1 text-[10px] font-semibold text-amber-300 hover:bg-amber-600/30"
                          >
                            <Lock className="h-3 w-3" />
                            Bloquer
                          </button>
                        )}

                        {u.status === 'banned' ? (
                          <button
                            onClick={() => unblockUser(u.id)}
                            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300"
                          >
                            Réhabiliter
                          </button>
                        ) : (
                          <button
                            onClick={() => banUser(u.id)}
                            className="flex items-center gap-1 rounded bg-red-600/20 border border-red-500/30 px-2 py-1 text-[10px] font-semibold text-red-300 hover:bg-red-600/30"
                          >
                            <Ban className="h-3 w-3" />
                            Bannir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM & OFFICIAL COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Catalogue Global & Cours Officiels EduSphere
            </h2>
            <button
              onClick={() => setShowAddOfficialCourseModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Ajouter un cours officiel plate-forme
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4 space-y-3"
              >
                <div className="flex gap-3">
                  <img src={c.thumbnail} alt={c.title} className="h-16 w-24 rounded-xl object-cover shrink-0" />
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1">
                      {c.isPlatformOfficial && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-mono text-amber-300">
                          OFFICIEL
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">{c.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                    <p className="text-[11px] text-slate-400">Créé par : {c.instructorName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-xs font-mono">
                  <span>Prix : {formatPrice(c.priceXOF)}</span>
                  <span>{c.isPublished ? '🟢 Publié' : '🟡 Dépublié'}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => toggleCoursePublish(c.id)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    {c.isPublished ? 'Masquer du catalogue' : 'Mettre en ligne'}
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-1.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/40"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROMOTIONAL BROADCASTS */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-400" />
              Diffusion de Promotions & Alertes aux Abonnés
            </h2>
            <button
              onClick={() => setShowPromoModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Créer une nouvelle promotion
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              En tant qu'administrateur, chaque notification promotionnelle que vous diffusez s'affiche instantanément dans la cloche des notifications de tous les utilisateurs (étudiants et professeurs).
            </p>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-400" />
                Ajouter un Nouvel Étudiant
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Ibrahima Sylla"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="ibrahima.sylla@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Téléphone Mobile Money
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Objectif / Titre
                </label>
                <input
                  type="text"
                  value={studentHeadline}
                  onChange={(e) => setStudentHeadline(e.target.value)}
                  placeholder="Ex: Formation continue Full-Stack"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#6366F1] py-2.5 text-xs font-bold text-white hover:bg-indigo-600 shadow-md mt-2"
              >
                Créer et inscrire l'étudiant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD OFFICIAL COURSE MODAL */}
      {showAddOfficialCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                Créer un Cours Officiel Plateforme
              </h3>
              <button
                onClick={() => setShowAddOfficialCourseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOfficialCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Titre *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Ex: Masterclass EduSphere : Lancer sa Fintech en Afrique"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={courseSubtitle}
                  onChange={(e) => setCourseSubtitle(e.target.value)}
                  placeholder="Ex: De l'agrément bancaire aux passerelles de paiement"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white"
                  >
                    <option value="Finance & Fintech">Finance & Fintech</option>
                    <option value="Développement">Développement</option>
                    <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                    <option value="Design & UX">Design & UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Prix (FCFA)
                  </label>
                  <input
                    type="number"
                    value={coursePriceXOF}
                    onChange={(e) => setCoursePriceXOF(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md mt-2"
              >
                Publier le cours officiel immédiatement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROMO NOTIFICATION MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0F172A] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-400" />
                Diffuser une Promotion à Tous les Abonnés
              </h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Titre de l'annonce *</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="Ex: 🚀 Promo Black Friday : -30% sur tous les cours Tech"
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message d'explication *</label>
                <textarea
                  required
                  rows={3}
                  value={promoMessage}
                  onChange={(e) => setPromoMessage(e.target.value)}
                  placeholder="Profitez d'une réduction exceptionnelle sur l'ensemble de notre catalogue panafricain..."
                  className="w-full rounded-xl border border-slate-700 bg-[#090D16] p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Code Promo (Optionnel)</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Ex: TECHAFRICA"
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Remise (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={80}
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500 shadow-md mt-2"
              >
                Diffuser la notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM NOMINATE ADMIN MODAL */}
      {adminAssignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-amber-500/50 bg-[#0F172A] shadow-2xl p-6 space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nommer un Administrateur</h3>
            <p className="text-xs text-slate-300">
              Êtes-vous sûr(e) de vouloir élever <strong>{adminAssignTarget.name}</strong> au rôle de Super-Administrateur ? Cette personne aura les pleins pouvoirs sur la plateforme.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAdminAssignTarget(null)}
                className="flex-1 rounded-xl border border-slate-700 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAssignAdmin}
                className="flex-1 rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
