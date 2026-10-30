import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle,
  CreditCard,
  Edit3,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  Phone,
  Play,
  Save,
  Shield,
  Smartphone,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { RoleBadge } from '../common/RoleBadge';

interface StudentProfileProps {
  onOpenCourse: (course: Course) => void;
}

const AUTHENTIC_PORTRAIT_CHOICES = [
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 1 (Aminata)',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 2 (Kofi)',
  },
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 3 (Kwesi)',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 4 (Sophie)',
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 5 (Sarah)',
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 6 (Jean-Baptiste)',
  },
  {
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 7 (Mamadou)',
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 8 (Awa)',
  },
  {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    label: 'Portrait 9 (Malick)',
  },
];

export const StudentProfile: React.FC<StudentProfileProps> = ({ onOpenCourse }) => {
  const { currentUser, updateProfile, courses, progressList, transactions, formatPrice, theme } =
    useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [phone, setPhone] = useState(currentUser.phoneNumber || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const enrolledCourses = courses.filter((c) =>
    currentUser.enrolledCourseIds.includes(c.id)
  );

  const studentTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      headline,
      bio,
      phoneNumber: phone,
      avatar: selectedAvatar,
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const handleSelectAvatar = (url: string) => {
    setSelectedAvatar(url);
    updateProfile({ avatar: url });
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      handleSelectAvatar(customAvatarUrl.trim());
      setCustomAvatarUrl('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Overview Card - Pure Black in Dark Mode (#000000 / #0c0c0e) */}
      <div className="rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Avatar with live change trigger */}
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 dark:ring-zinc-700 ring-zinc-300 shadow-md"
              />
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity"
                title="Changer la photo de profil"
              >
                <Camera className="h-5 w-5 mb-0.5" />
                <span>Changer</span>
              </button>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black shadow">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold dark:text-white text-zinc-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <RoleBadge role={currentUser.role} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-emerald-500 font-medium">
                {currentUser.headline || "Membre EduSphere"}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs dark:text-zinc-400 text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {currentUser.email}
                </span>
                {currentUser.phoneNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    {currentUser.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="flex items-center gap-1.5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-3.5 py-2 text-xs font-semibold dark:text-zinc-300 text-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <ImageIcon className="h-4 w-4 text-emerald-500" />
              Photos réelles
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-4 py-2 text-xs font-semibold dark:text-zinc-200 text-zinc-800 hover:dark:bg-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <Edit3 className="h-4 w-4 text-emerald-500" />
              {isEditing ? 'Fermer' : 'Modifier mon profil'}
            </button>
          </div>
        </div>

        {/* Realistic Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="mt-6 rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold dark:text-white text-zinc-900 uppercase tracking-wider">
                  Galerie de portraits humains authentiques
                </h4>
                <p className="text-[11px] dark:text-zinc-400 text-zinc-500">
                  Choisissez une véritable photo professionnelle ou renseignez votre propre lien d'image.
                </p>
              </div>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-xs dark:text-zinc-400 text-zinc-500 hover:text-black hover:dark:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Portraits Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {AUTHENTIC_PORTRAIT_CHOICES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAvatar(p.url)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    currentUser.avatar === p.url
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'dark:border-zinc-800 border-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
                  {currentUser.avatar === p.url && (
                    <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white drop-shadow font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom URL input */}
            <div className="flex items-center gap-2 pt-2 border-t dark:border-zinc-800 border-zinc-200">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="Ou collez l'URL d'une photo personnalisée..."
                className="flex-1 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-white px-3 py-1.5 text-xs dark:text-white text-zinc-900 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customAvatarUrl.trim()}
                className="rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-40"
              >
                Appliquer
              </button>
            </div>
          </div>
        )}

        {/* Bio preview */}
        {currentUser.bio && !isEditing && (
          <p className="mt-6 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 p-4 text-xs dark:text-zinc-300 text-zinc-700 leading-relaxed">
            {currentUser.bio}
          </p>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 space-y-4 border-t dark:border-zinc-800 border-zinc-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium dark:text-zinc-300 text-zinc-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-white px-3.5 py-2 text-xs dark:text-white text-zinc-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-zinc-300 text-zinc-700 mb-1">
                  Titre professionnel
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-white px-3.5 py-2 text-xs dark:text-white text-zinc-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium dark:text-zinc-300 text-zinc-700 mb-1">Numéro Mobile Money (Wave, Orange, MTN)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-white px-3.5 py-2 text-xs dark:text-white text-zinc-900 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium dark:text-zinc-300 text-zinc-700 mb-1">Présentation / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-white p-3 text-xs dark:text-white text-zinc-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border dark:border-zinc-800 border-zinc-300 px-4 py-2 text-xs font-semibold dark:text-zinc-400 text-zinc-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-black hover:bg-emerald-400 shadow-sm"
              >
                <Save className="h-4 w-4" />
                Enregistrer mon profil
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Mes Formations Inscrites ({enrolledCourses.length})
          </h2>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-8 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-zinc-400 mb-2" />
            <p className="text-sm font-semibold dark:text-zinc-300 text-zinc-700">
              Vous n'êtes inscrit à aucun cours pour le moment.
            </p>
            <p className="text-xs dark:text-zinc-500 text-zinc-400 mt-1">
              Explorez le catalogue pour vous former avec nos experts !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((c) => {
              const p = progressList.find(
                (pr) => pr.courseId === c.id && pr.studentId === currentUser.id
              ) || { completionPercentage: 0, completedLessonIds: [] };

              return (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-5 hover:dark:border-zinc-700 hover:border-zinc-400 transition-all shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="h-20 w-28 rounded-xl object-cover shrink-0 ring-1 dark:ring-zinc-800 ring-zinc-200"
                    />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold dark:text-white text-zinc-900 line-clamp-1">{c.title}</h3>
                      <p className="text-xs dark:text-zinc-400 text-zinc-600">Formateur : {c.instructorName}</p>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-mono dark:text-zinc-400 text-zinc-500 mb-1">
                          <span>Progression</span>
                          <span className="text-emerald-500 font-bold">{p.completionPercentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full dark:bg-zinc-800 bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${p.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t dark:border-zinc-800 border-zinc-100">
                    {p.completionPercentage === 100 ? (
                      <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500">
                        <Award className="h-4 w-4 text-amber-500" />
                        Certificat débloqué
                      </span>
                    ) : (
                      <span className="text-xs dark:text-zinc-500 text-zinc-500 font-mono">
                        {p.completedLessonIds.length} leçons terminées
                      </span>
                    )}

                    <button
                      onClick={() => onOpenCourse(c)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-black" />
                      Continuer le cours
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction & Payment History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold dark:text-white text-zinc-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-500" />
          Historique de Mes Achats & Reçus
        </h2>

        {studentTransactions.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-6 text-center text-xs dark:text-zinc-400 text-zinc-500">
            Aucune transaction enregistrée.
          </div>
        ) : (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="dark:bg-zinc-950 bg-zinc-50 dark:text-zinc-400 text-zinc-600 font-mono uppercase text-[10px] border-b dark:border-zinc-800 border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Objet</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Méthode</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800 divide-zinc-200 dark:text-zinc-300 text-zinc-800">
                  {studentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:dark:bg-zinc-900/40 hover:bg-zinc-50 font-mono">
                      <td className="py-3 px-4 font-bold text-emerald-500">{tx.reference}</td>
                      <td className="py-3 px-4 font-sans dark:text-white text-zinc-900 truncate max-w-xs">
                        {tx.courseTitle || 'Achat de cours'}
                      </td>
                      <td className="py-3 px-4 font-bold dark:text-white text-zinc-900">{formatPrice(tx.amountXOF)}</td>
                      <td className="py-3 px-4 uppercase dark:text-zinc-400 text-zinc-600">
                        {tx.method.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 dark:text-zinc-400 text-zinc-500 text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded dark:bg-emerald-500/10 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                          <CheckCircle className="h-3 w-3" />
                          Validé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
