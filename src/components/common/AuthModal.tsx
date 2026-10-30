import React, { useState } from 'react';
import {
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { RoleBadge } from './RoleBadge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'student' }) => {
  const { register, login, users } = useApp();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet et votre adresse email.');
      return;
    }

    const created = register({
      name,
      email,
      role,
      phone,
      headline,
    });

    setSuccessMsg(`Compte créé avec succès ! Bienvenue, ${created.name}.`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(email);
    if (!res.success) {
      setErrorMsg(res.message || 'Identifiants invalides');
      return;
    }

    setSuccessMsg('Connexion réussie !');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const quickLoginAs = (userEmail: string) => {
    setEmail(userEmail);
    const res = login(userEmail);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 border dark:border-emerald-500/30 border-emerald-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-zinc-900">Espace Membre EduSphere</h3>
              <p className="text-xs dark:text-zinc-400 text-zinc-500">Rejoignez la communauté des apprenants et créateurs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 dark:text-zinc-400 text-zinc-500 hover:dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-white hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 text-xs font-bold transition-all rounded-lg ${
              tab === 'register'
                ? 'dark:bg-zinc-900 bg-white dark:text-white text-zinc-900 shadow-sm border dark:border-zinc-700 border-zinc-200'
                : 'dark:text-zinc-400 text-zinc-600 hover:text-zinc-900 hover:dark:text-white'
            }`}
          >
            Créer un compte (Inscription)
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 text-xs font-bold transition-all rounded-lg ${
              tab === 'login'
                ? 'dark:bg-zinc-900 bg-white dark:text-white text-zinc-900 shadow-sm border dark:border-zinc-700 border-zinc-200'
                : 'dark:text-zinc-400 text-zinc-600 hover:text-zinc-900 hover:dark:text-white'
            }`}
          >
            Se Connecter (Accès direct)
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {successMsg}
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role selection pill cards */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Votre profil sur EduSphere
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      role === 'student'
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-[#0B0F19] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <GraduationCap className="h-5 w-5 text-[#818CF8]" />
                      <RoleBadge role="student" size="sm" />
                    </div>
                    <span className="text-xs font-bold text-white">Je suis Étudiant</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Suivre des cours, faire des exercices & discuter avec l'IA.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      role === 'teacher'
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-800 bg-[#0B0F19] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Users className="h-5 w-5 text-[#34D399]" />
                      <RoleBadge role="teacher" size="sm" />
                    </div>
                    <span className="text-xs font-bold text-white">Je suis Formateur</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Publier des cours vidéo/PDF, créer des exercices & monétiser.
                    </span>
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nom complet *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Fatou Sow"
                      className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#6366F1] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Adresse Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="fatou.sow@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#6366F1] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Téléphone Mobile Money</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+221 77..."
                        className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#6366F1] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Spécialité / Titre</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={role === 'teacher' ? 'Ex: Expert React & IA' : 'Ex: Développeur en herbe'}
                      className="w-full rounded-xl border border-slate-700 bg-[#090D16] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 font-mono focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#6366F1] py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 mt-2 flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Finaliser mon Inscription
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Votre Email EduSphere</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aminata.diallo@edusphere.africa"
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#090D16] pl-9 pr-3 py-2.5 text-sm text-white font-mono focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#6366F1] py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
              >
                Se connecter
              </button>

              {/* One-click demo login accounts for fast evaluation */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[11px] text-slate-400 mb-2 font-medium">Ou connexion en 1 clic avec un compte de démonstration :</p>
                <div className="space-y-1.5">
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => quickLoginAs(u.email)}
                      className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-800 bg-[#090D16] hover:border-slate-700 text-xs text-left"
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="h-6 w-6 rounded-full" />
                        <span className="text-slate-200">{u.name}</span>
                      </div>
                      <RoleBadge role={u.role} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
