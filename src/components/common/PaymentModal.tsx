import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Download,
  Lock,
  Phone,
  QrCode,
  Shield,
  Smartphone,
  Tag,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, PaymentMethod, Transaction } from '../../types';

interface PaymentModalProps {
  course: Course;
  mode: 'student_course' | 'teacher_subscription';
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  mode,
  onClose,
  onSuccess,
}) => {
  const { enrollAndPayCourse, payTeacherSubscription, formatPrice, currency } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('wave');
  const [phone, setPhone] = useState('+221 77 000 00 00');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const basePriceXOF = mode === 'student_course' ? course.priceXOF : 15000;
  const discountXOF = promoApplied ? Math.round(basePriceXOF * 0.25) : 0;
  const finalPriceXOF = basePriceXOF - discountXOF;

  // Auto-detect provider if phone changes
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const cleaned = val.replace(/\s+/g, '');
    if (cleaned.startsWith('+22177') || cleaned.startsWith('77') || cleaned.startsWith('+22176')) {
      // Wave / Orange
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TECHAFRICA') {
      setPromoApplied(true);
    } else {
      alert("Code promo invalide. Essayez 'TECHAFRICA' pour -25% !");
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate real gateway response time
      await new Promise((r) => setTimeout(r, 1200));

      let res;
      if (mode === 'student_course') {
        res = await enrollAndPayCourse(course.id, method, {
          phone,
          cardLast4: method === 'card' ? cardNumber.slice(-4) : undefined,
          promoCode: promoApplied ? promoCode : undefined,
        });
      } else {
        res = await payTeacherSubscription(course.id, method, {
          phone,
          cardLast4: method === 'card' ? cardNumber.slice(-4) : undefined,
        });
      }

      setCompletedTx(res.transaction);
      onSuccess(res.transaction);
    } catch (err: any) {
      alert(err.message || 'Échec de la transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-black bg-white shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-zinc-900">
                {mode === 'student_course' ? 'Paiement Sécurisé du Cours' : 'Abonnement Publication Formateur'}
              </h3>
              <p className="text-xs dark:text-zinc-400 text-zinc-500">Transactions instantanées chiffrées de bout en bout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 dark:text-zinc-400 text-zinc-500 hover:dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-white hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success View */}
        {completedTx ? (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 glow-emerald">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Paiement Confirmé avec Succès !</h4>
              <p className="text-sm text-slate-300 mt-1">
                {mode === 'student_course'
                  ? 'Félicitations ! Vous êtes officiellement inscrit(e) au cours.'
                  : 'Votre abonnement a été validé ! Votre cours est désormais publié et accessible aux étudiants.'}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>RÉFÉRENCE :</span>
                <span className="text-emerald-400 font-bold">{completedTx.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>OBJET :</span>
                <span className="text-white truncate max-w-[260px]">{course.title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MONTANT RÉGLÉ :</span>
                <span className="text-white font-bold">{formatPrice(completedTx.amountXOF)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MOYEN UTILISÉ :</span>
                <span className="text-indigo-400 uppercase font-bold">{completedTx.method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>DATE :</span>
                <span className="text-slate-300">{new Date(completedTx.createdAt).toLocaleString('fr-FR')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-[#34D399] transition-all glow-emerald"
              >
                Accéder immédiatement
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-6 space-y-5">
            {/* Course Summary pill */}
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090D16] p-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-12 w-16 rounded-lg object-cover ring-1 ring-slate-800 shrink-0"
                />
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white truncate">{course.title}</h4>
                  <p className="text-xs text-slate-400">Par {course.instructorName}</p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <span className="text-lg font-bold text-white">{formatPrice(finalPriceXOF)}</span>
                {promoApplied && (
                  <span className="block text-[11px] text-slate-500 line-through">
                    {formatPrice(basePriceXOF)}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Method Selector (Mobile Money vs Card) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Choisissez votre moyen de paiement
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'wave',
                    name: 'Wave',
                    sub: 'Sénégal, CI',
                    color: 'hover:border-cyan-500/50',
                    active: 'border-cyan-400 bg-cyan-950/20 text-cyan-300',
                    badge: 'W',
                  },
                  {
                    id: 'orange_money',
                    name: 'Orange',
                    sub: 'Afrique de l’Ouest',
                    color: 'hover:border-orange-500/50',
                    active: 'border-orange-400 bg-orange-950/20 text-orange-300',
                    badge: 'OM',
                  },
                  {
                    id: 'mtn_money',
                    name: 'MTN MoMo',
                    sub: 'Ghana, Bénin, CI',
                    color: 'hover:border-yellow-500/50',
                    active: 'border-yellow-400 bg-yellow-950/20 text-yellow-300',
                    badge: 'MTN',
                  },
                  {
                    id: 'card',
                    name: 'Carte Bancaire',
                    sub: 'Visa, Mastercard',
                    color: 'hover:border-indigo-500/50',
                    active: 'border-indigo-400 bg-indigo-950/20 text-indigo-300',
                    badge: 'CARD',
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setMethod(p.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                      method === p.id ? p.active : `border-slate-800 bg-[#0B0F19] text-slate-400 ${p.color}`
                    }`}
                  >
                    <span className="text-xs font-bold">{p.name}</span>
                    <span className="text-[10px] text-slate-500">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details Input */}
            {method !== 'card' ? (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                    Numéro Mobile Money ({method.toUpperCase().replace('_', ' ')})
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                    Détection réseau auto
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-mono"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                      {method === 'wave' ? '🌊 WAVE' : method === 'orange_money' ? '🍊 ORANGE' : '📱 MTN'}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                  Une invite de validation USSD ou une notification push apparaîtra sur votre téléphone.
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                    Coordonnées de la Carte
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Chiffrement AES-256</span>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Numéro de carte (16 chiffres)"
                  className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3 py-2 text-sm text-white font-mono"
                  />
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV (3 chiffres)"
                    maxLength={4}
                    className="w-full rounded-lg border border-slate-700 bg-[#060E20] px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Promo Code section */}
            {mode === 'student_course' && (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Code Promo (ex: TECHAFRICA)"
                    disabled={promoApplied}
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F19] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    promoApplied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {promoApplied ? '✓ -25% Appliqué' : 'Appliquer'}
                </button>
              </div>
            )}

            {/* Final CTA Button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full rounded-xl bg-[#10B981] py-3.5 px-4 font-display text-sm font-bold text-slate-950 hover:bg-[#34D399] transition-all glow-emerald flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Validation de la transaction auprès de {method.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>
                    Payer {formatPrice(finalPriceXOF)} via {method.replace('_', ' ').toUpperCase()}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
