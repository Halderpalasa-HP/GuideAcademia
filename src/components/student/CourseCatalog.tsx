import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  PlayCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onOpenLearningRoom: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  onOpenLearningRoom,
}) => {
  const { courses, currentUser, formatPrice } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedLevel, setSelectedLevel] = useState<string>('Tous');

  const categories = [
    'Tous',
    'Développement',
    'Intelligence Artificielle',
    'Design & UX',
    'Finance & Fintech',
  ];

  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'];

  const publishedCourses = courses.filter((c) => c.isPublished);

  const filteredCourses = publishedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(search.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Tous' || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === 'Tous' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section - Pure Black & Crisp Light Theme (No AI Gradients) */}
      <section className="relative overflow-hidden rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white p-6 sm:p-10 lg:p-12 shadow-sm transition-colors">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border dark:border-emerald-500/30 border-emerald-400/40 dark:bg-emerald-950/20 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Award className="h-3.5 w-3.5" />
            <span>Formations Pratiques Certifiées pour Professionnels & Créateurs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold dark:text-white text-zinc-900 tracking-tight leading-tight">
            Apprenez les compétences réelles avec des{' '}
            <span className="text-emerald-500">
              Experts de Terrain
            </span>
          </h1>

          <p className="text-sm sm:text-base dark:text-zinc-300 text-zinc-600 leading-relaxed max-w-2xl font-normal">
            Formez-vous avec des vidéos de haute qualité, des supports de diapositives PDF téléchargeables,
            des exercices concrets notés et une assistance pédagogique intelligente. Paiement facile via Wave, Orange Money, MTN ou Carte.
          </p>

          {/* Clean trust pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-3 py-1.5 dark:text-zinc-300 text-zinc-700">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              Paiement Wave, Orange Money & MTN
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-3 py-1.5 dark:text-zinc-300 text-zinc-700">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              Certificats de fin de formation
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-3 py-1.5 dark:text-zinc-300 text-zinc-700">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              Accès illimité aux cours
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 dark:text-zinc-400 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par technologie, sujet, formateur (ex: React, Wave, IA, Figma)..."
              className="w-full rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white pl-10 pr-4 py-2.5 text-sm dark:text-white text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 dark:text-zinc-400 text-zinc-500 shrink-0" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white px-3 py-2.5 text-xs font-medium dark:text-zinc-200 text-zinc-800 focus:border-emerald-500 focus:outline-none w-full sm:w-44 shadow-sm"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  Niveau : {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-sm font-bold'
                  : 'border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-black hover:border-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Courses Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold dark:text-white text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Formations Disponibles ({filteredCourses.length})
          </h2>
          <span className="text-xs dark:text-zinc-400 text-zinc-500 font-mono">
            {publishedCourses.length} cours vérifiés
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
            <h3 className="text-base font-bold dark:text-white text-zinc-900">Aucun cours trouvé</h3>
            <p className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
              Essayez de réinitialiser vos filtres ou de chercher un autre terme.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('Tous');
                setSelectedLevel('Tous');
              }}
              className="mt-4 rounded-lg dark:bg-zinc-800 bg-zinc-200 px-4 py-2 text-xs font-semibold dark:text-white text-zinc-900 hover:dark:bg-zinc-700 hover:bg-zinc-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
              const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white overflow-hidden transition-all duration-200 hover:dark:border-zinc-600 hover:border-zinc-400 hover:shadow-lg"
                >
                  {/* Thumbnail frame */}
                  <div className="relative aspect-video w-full overflow-hidden dark:bg-zinc-900 bg-zinc-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />

                    {/* Authentic Badge (No AI gradient) */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30 shadow">
                      <span>PROJET PRATIQUE</span>
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-2.5 right-2.5 rounded-md bg-black/75 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
                      {course.level}
                    </div>

                    {/* Enrolled state indicator */}
                    {isEnrolled && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-emerald-500 text-black px-2 py-0.5 text-[11px] font-bold shadow">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Inscrit</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Instructor meta */}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="h-6 w-6 rounded-full object-cover ring-1 dark:ring-zinc-700 ring-zinc-300"
                      />
                      <span className="text-xs dark:text-zinc-300 text-zinc-700 font-medium truncate">
                        {course.instructorName}
                      </span>
                      {course.isPlatformOfficial && (
                        <span className="rounded dark:bg-amber-500/20 bg-amber-50 border dark:border-amber-500/30 border-amber-300 px-1.5 py-0.2 text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                          OFFICIEL
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-base font-bold dark:text-white text-zinc-900 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors">
                      {course.title}
                    </h3>

                    {/* Subtitle / summary */}
                    <p className="mt-1.5 text-xs dark:text-zinc-400 text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                      {course.subtitle}
                    </p>

                    {/* Metadata pills (lessons, rating, students) */}
                    <div className="mt-4 flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-500 border-t dark:border-zinc-800 border-zinc-100 pt-3">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-[11px] dark:text-zinc-500 text-zinc-400 font-normal">
                          ({course.ratingCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <PlayCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{lessonCount} leçons</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Users className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{course.enrolledStudentsCount}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-4 flex items-center justify-between pt-2">
                      <div>
                        <span className="text-lg font-extrabold dark:text-white text-zinc-900">
                          {formatPrice(course.priceXOF)}
                        </span>
                        <span className="block text-[10px] dark:text-zinc-500 text-zinc-400 font-mono">
                          Accès complet à vie
                        </span>
                      </div>

                      {isEnrolled ? (
                        <button
                          onClick={() => onOpenLearningRoom(course)}
                          className="flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-black px-4 py-2 text-xs font-bold transition-all shadow-sm"
                        >
                          <PlayCircle className="h-4 w-4 text-emerald-400" />
                          Reprendre
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-sm"
                        >
                          Détails & Inscription
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
