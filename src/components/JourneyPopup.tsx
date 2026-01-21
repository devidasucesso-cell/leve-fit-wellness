import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Gift, CheckCircle2, Calendar, Target, Clock, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { differenceInDays, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

type JourneyMessage = {
  day: number;
  title: string;
  subtitle?: string;
  message: string[];
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  action?: {
    label: string;
    url: string;
  };
};

const JOURNEY_MESSAGES: JourneyMessage[] = [
  {
    day: 1,
    title: "Seja bem-vinda ao LeveFit!",
    subtitle: "DIA 1 — BOAS-VINDAS",
    message: [
      "A partir de hoje, seu foco não é comer menos.",
      "É controlar o apetite 💚",
      "Tome suas cápsulas direitinho e registre tudo no app.",
      "Seu progresso começa agora ✨"
    ],
    icon: <Sparkles className="w-12 h-12 text-white" />,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-600"
  },
  {
    day: 3,
    title: "Seu corpo está se adaptando",
    subtitle: "DIA 3 — ADAPTAÇÃO",
    message: [
      "É normal perceber menos fome ou menos vontade de beliscar.",
      "Seu corpo está começando a responder ao LeveFit.",
      "Continue firme! 💚"
    ],
    icon: <Clock className="w-12 h-12 text-white" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600"
  },
  {
    day: 5,
    title: "Parabéns!",
    subtitle: "DIA 5 — PRIMEIRA CONQUISTA",
    message: [
      "Você completou seus primeiros dias de uso 🎉",
      "Pequenas conquistas constroem grandes resultados.",
      "Não pare agora!"
    ],
    icon: <Trophy className="w-12 h-12 text-white" />,
    color: "text-amber-600",
    bgGradient: "from-amber-500 to-orange-600"
  },
  {
    day: 7,
    title: "Semana 1 concluída!",
    subtitle: "DIA 7 — SEMANA 1",
    message: [
      "Seu corpo já começou o processo.",
      "Continue usando o app e completando as conquistas.",
      "O melhor vem na hora certa 💚"
    ],
    icon: <CheckCircle2 className="w-12 h-12 text-white" />,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-violet-600"
  },
  {
    day: 10,
    title: "Constância gera resultado",
    subtitle: "DIA 10 — CONSTÂNCIA",
    message: [
      "Agora o controle do apetite fica mais perceptível.",
      "Continue firme.",
      "Seu esforço está sendo registrado."
    ],
    icon: <Target className="w-12 h-12 text-white" />,
    color: "text-teal-600",
    bgGradient: "from-teal-500 to-emerald-600"
  },
  {
    day: 14,
    title: "2 semanas completas!",
    subtitle: "DIA 14 — SEMANA 2",
    message: [
      "Seu corpo já está respondendo.",
      "Muitas pessoas percebem diferença nessa fase.",
      "Continue 💪"
    ],
    icon: <Calendar className="w-12 h-12 text-white" />,
    color: "text-cyan-600",
    bgGradient: "from-cyan-500 to-blue-600"
  },
  {
    day: 18,
    title: "Falta pouco...",
    subtitle: "DIA 18 — ANTECIPAÇÃO",
    message: [
      "Você está muito próxima de completar uma fase importante do seu processo.",
      "Continue registrando tudo no app 💚"
    ],
    icon: <Clock className="w-12 h-12 text-white" />,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-purple-600"
  },
  {
    day: 21,
    title: "Você está perto!",
    subtitle: "DIA 21 — PRÉ-DESBLOQUEIO",
    message: [
      "Você está perto de liberar um benefício especial 🎁",
      "Mantenha o uso correto das cápsulas e acompanhe seu progresso."
    ],
    icon: <Gift className="w-12 h-12 text-white" />,
    color: "text-pink-600",
    bgGradient: "from-pink-500 to-rose-600"
  },
  {
    day: 23,
    title: "Atenção!",
    subtitle: "DIA 23 — ALERTA DE BENEFÍCIO",
    message: [
      "Você está entre as pessoas que mais evoluíram no processo.",
      "Complete suas conquistas para liberar seu benefício exclusivo 💚"
    ],
    icon: <Sparkles className="w-12 h-12 text-white" />,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600"
  },
  {
    day: 25,
    title: "PARABÉNS!",
    subtitle: "DIA 25 — DESBLOQUEIO FINAL 🔥",
    message: [
      "Você completou 75% do seu progresso 🎯",
      "Agora você desbloqueou:",
      "💊 Compre 1 LeveFit por R$297",
      "🎁 Ganhe outro TOTALMENTE GRÁTIS"
    ],
    icon: <Gift className="w-12 h-12 text-white" />,
    color: "text-green-600",
    bgGradient: "from-green-600 to-emerald-800",
    action: {
      label: "Garanta agora e não interrompa seus resultados!",
      url: "/settings" // Redireciona para onde está o botão de compra
    }
  }
];

const JourneyPopup = () => {
  const { profile } = useAuth();
  const [currentMessage, setCurrentMessage] = useState<JourneyMessage | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!profile?.created_at) return;

    const checkJourneyMessage = () => {
      const startDate = parseISO(profile.created_at);
      const today = new Date();
      // Calculate diff in days (1 means first day)
      const diffDays = Math.floor(differenceInDays(today, startDate)) + 1;
      
      // Find message for current day
      const message = JOURNEY_MESSAGES.find(m => m.day === diffDays);
      
      if (message) {
        // Check if already shown today using localStorage
        const storageKey = `levefit_journey_shown_${diffDays}_${profile.user_id}`;
        const hasShown = localStorage.getItem(storageKey);

        if (!hasShown) {
          setCurrentMessage(message);
          setIsOpen(true);
          // Mark as shown immediately to prevent re-show on refresh
          localStorage.setItem(storageKey, 'true');
        }
      }
    };

    // Small delay to ensure UI is ready
    const timer = setTimeout(checkJourneyMessage, 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  if (!currentMessage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-sm mx-auto overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header Background */}
          <div className={`h-32 bg-gradient-to-br ${currentMessage.bgGradient} relative flex items-center justify-center`}>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            
            {/* Main Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative z-10 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
            >
              {currentMessage.icon}
            </motion.div>

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center space-y-4">
            <div>
              <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${currentMessage.color}`}>
                {currentMessage.subtitle}
              </p>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {currentMessage.title}
              </h2>
            </div>

            <div className="space-y-2 py-2">
              {currentMessage.message.map((line, idx) => (
                <p key={idx} className="text-muted-foreground text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {currentMessage.action ? (
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  if (currentMessage.action?.url) {
                    window.location.href = currentMessage.action.url;
                  }
                }}
                className={`w-full h-12 font-bold text-white bg-gradient-to-r ${currentMessage.bgGradient} shadow-lg`}
              >
                {currentMessage.action.label}
              </Button>
            ) : (
              <Button 
                onClick={() => setIsOpen(false)}
                className={`w-full h-12 font-bold text-white bg-gradient-to-r ${currentMessage.bgGradient} shadow-lg`}
              >
                Continuar
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default JourneyPopup;