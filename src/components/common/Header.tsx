import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from './RoleBadge';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuthModal: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAuthModal,
  onOpenNotifications,
}) => {
  const { currentUser, users, switchUser, currency, setCurrency, promoNotifications, theme, toggleTheme } = useApp();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = promoNotifications.filter((n) => !n.readBy.includes(currentUser.id)).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b dark:border-zinc-800 border-zinc-200 dark:bg-black/95 bg-white/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Human, Professional, Clean */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onTabChange('catalog')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-700 border-zinc-300 text-emerald-500 shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl font-extrabold tracking-tight dark:text-white text-zinc-900">
                  Edu<span className="text-emerald-500">Sphere</span>
                </span>
                <span className="rounded dark:bg-zinc-800 bg-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider dark:text-zinc-300 text-zinc-700">
                  AFRICA & MONDE
                </span>
              </div>
              <p className="text-[10px] dark:text-zinc-400 text-zinc-500 font-medium">Plateforme de Formations Certifiantes</p>
            </div>
          </button>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('catalog')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                currentTab === 'catalog'
                  ? 'dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-900 font-semibold border dark:border-zinc-700 border-zinc-300'
                  : 'dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-zinc-900 hover:dark:bg-zinc-900/50 hover:bg-zinc-100'
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              Catalogue
            </button>

            {currentUser.role === 'student' && (
              <button
                onClick={() => onTabChange('my-courses')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  currentTab === 'my-courses'
                    ? 'dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-900 font-semibold border dark:border-zinc-700 border-zinc-300'
                    : 'dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-zinc-900 hover:dark:bg-zinc-900/50 hover:bg-zinc-100'
                }`}
              >
                <span>Mes Inscriptions</span>
                <span className="rounded-full dark:bg-zinc-800 bg-zinc-200 px-2 py-0.5 text-[10px] font-mono font-bold">
                  {currentUser.enrolledCourseIds.length}
                </span>
              </button>
            )}

            {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
              <button
                onClick={() => onTabChange('teacher-studio')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  currentTab === 'teacher-studio'
                    ? 'dark:bg-zinc-900 bg-zinc-100 text-emerald-500 font-semibold border dark:border-emerald-500/40 border-emerald-400'
                    : 'dark:text-zinc-400 text-zinc-600 hover:text-emerald-500 hover:dark:bg-zinc-900/50 hover:bg-zinc-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                Studio Formateur
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onTabChange('admin-center')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  currentTab === 'admin-center'
                    ? 'dark:bg-zinc-900 bg-zinc-100 text-amber-500 font-semibold border dark:border-amber-500/40 border-amber-400'
                    : 'dark:text-zinc-400 text-zinc-600 hover:text-amber-500 hover:dark:bg-zinc-900/50 hover:bg-zinc-100'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Administration & Gouvernance
              </button>
            )}
          </nav>
        </div>

        {/* Right Tools: Theme Switcher, Currency, Persona Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* THEME SWITCHER (Dark Noir Pur vs Light Clair) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 dark:text-zinc-300 text-zinc-700 hover:dark:text-white hover:text-black transition-all"
            title={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre (Noir pur)'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-800" />
            )}
          </button>

          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center dark:bg-zinc-950 bg-zinc-100 border dark:border-zinc-800 border-zinc-300 rounded-lg p-0.5 text-xs font-mono">
            {(['XOF', 'EUR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === curr
                    ? 'dark:bg-zinc-800 bg-white dark:text-white text-zinc-900 font-bold shadow-sm'
                    : 'dark:text-zinc-400 text-zinc-600 hover:text-zinc-900 hover:dark:text-white'
                }`}
                title={`Devise : ${curr === 'XOF' ? 'Franc CFA' : curr}`}
              >
                {curr === 'XOF' ? 'FCFA' : curr === 'EUR' ? '€' : '$'}
              </button>
            ))}
          </div>

          {/* Quick Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 px-2.5 py-1.5 text-xs dark:text-zinc-200 text-zinc-800 hover:dark:bg-zinc-900 hover:bg-zinc-200 transition-all"
              title="Tester les rôles (Étudiant, Professeur, Admin)"
            >
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden lg:inline dark:text-zinc-400 text-zinc-500 font-normal">Rôle:</span>
              <RoleBadge role={currentUser.role} size="sm" />
              <ChevronDown className="h-3 w-3 dark:text-zinc-400 text-zinc-500 ml-0.5" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1.5 border-b dark:border-zinc-800 border-zinc-100 mb-1">
                  <p className="text-[11px] font-semibold dark:text-zinc-300 text-zinc-800">Comptes de démonstration</p>
                  <p className="text-[10px] dark:text-zinc-400 text-zinc-500">Basculez entre les rôles réels :</p>
                </div>
                <div className="space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left text-xs transition-colors ${
                        currentUser.id === u.id
                          ? 'dark:bg-zinc-900 bg-zinc-100 font-semibold'
                          : 'hover:dark:bg-zinc-900/60 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover ring-1 dark:ring-zinc-700 ring-zinc-300" />
                        <div className="truncate">
                          <p className="font-medium dark:text-zinc-200 text-zinc-900 truncate">{u.name}</p>
                          <p className="text-[10px] dark:text-zinc-400 text-zinc-500 truncate">{u.headline || u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <RoleBadge role={u.role} size="sm" />
                        {currentUser.id === u.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 dark:text-zinc-300 text-zinc-700 hover:dark:text-white hover:text-black transition-colors"
            title="Notifications & Promotions"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 p-1.5 hover:dark:border-zinc-700 hover:border-zinc-400 transition-all focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover ring-1 dark:ring-zinc-700 ring-zinc-300"
              />
              <span className="hidden sm:block text-xs font-medium dark:text-zinc-200 text-zinc-800 max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="h-3 w-3 dark:text-zinc-400 text-zinc-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b dark:border-zinc-800 border-zinc-100">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm dark:text-white text-zinc-900 truncate">{currentUser.name}</p>
                    <RoleBadge role={currentUser.role} size="sm" />
                  </div>
                  <p className="text-xs dark:text-zinc-400 text-zinc-500 truncate mt-0.5">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onTabChange('profile');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs dark:text-zinc-300 text-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-100"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Mon Profil & Paramètres
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs dark:text-zinc-300 text-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-100"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-indigo-500" />
                    Connexion / Nouvelle Inscription
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 dark:text-zinc-300 text-zinc-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-4 space-y-2">
          <button
            onClick={() => {
              onTabChange('catalog');
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg p-2 text-sm dark:text-zinc-300 text-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-100"
          >
            <BookOpen className="h-4 w-4 text-emerald-500" />
            Catalogue des Cours
          </button>

          {currentUser.role === 'student' && (
            <button
              onClick={() => {
                onTabChange('my-courses');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-sm dark:text-zinc-300 text-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-100"
            >
              Mes Inscriptions ({currentUser.enrolledCourseIds.length})
            </button>
          )}

          {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
            <button
              onClick={() => {
                onTabChange('teacher-studio');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-emerald-500 hover:dark:bg-zinc-900 hover:bg-zinc-100"
            >
              <LayoutDashboard className="h-4 w-4" />
              Studio Formateur
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                onTabChange('admin-center');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-amber-500 hover:dark:bg-zinc-900 hover:bg-zinc-100"
            >
              <ShieldCheck className="h-4 w-4" />
              Administration & Gouvernance
            </button>
          )}

          <div className="pt-2 border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-between">
            <span className="text-xs dark:text-zinc-400 text-zinc-500">Mode :</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1 rounded border dark:border-zinc-700 border-zinc-300 text-xs font-medium"
            >
              {theme === 'dark' ? '🌙 Sombre (Noir Pur)' : '☀️ Clair'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
