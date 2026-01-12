import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Droplets, Pill, Flame, Star, Award, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  total?: number;
  color: string;
}

interface AchievementsCardProps {
  capsuleDays: number;
  waterStreak: number;
  totalWaterDays: number;
}

const AchievementsCard = ({ capsuleDays, waterStreak, totalWaterDays }: AchievementsCardProps) => {
  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'first-capsule',
      name: 'Primeiro Passo',
      description: 'Tomou sua primeira cápsula',
      icon: <Pill className="w-5 h-5" />,
      unlocked: capsuleDays >= 1,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 'week-capsule',
      name: 'Semana Completa',
      description: '7 dias tomando a cápsula',
      icon: <Star className="w-5 h-5" />,
      unlocked: capsuleDays >= 7,
      progress: Math.min(capsuleDays, 7),
      total: 7,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'month-capsule',
      name: 'Mês de Dedicação',
      description: '30 dias tomando a cápsula',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: capsuleDays >= 30,
      progress: Math.min(capsuleDays, 30),
      total: 30,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 'hydration-start',
      name: 'Hidratação Iniciada',
      description: 'Primeiro dia batendo meta de água',
      icon: <Droplets className="w-5 h-5" />,
      unlocked: totalWaterDays >= 1,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'hydration-week',
      name: 'Semana Hidratada',
      description: '7 dias batendo a meta de água',
      icon: <Zap className="w-5 h-5" />,
      unlocked: totalWaterDays >= 7,
      progress: Math.min(totalWaterDays, 7),
      total: 7,
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      id: 'consistency',
      name: 'Consistência',
      description: '15 dias de cápsula',
      icon: <Target className="w-5 h-5" />,
      unlocked: capsuleDays >= 15,
      progress: Math.min(capsuleDays, 15),
      total: 15,
      color: 'from-pink-400 to-pink-600',
    },
    {
      id: 'master',
      name: 'Mestre LeveFit',
      description: '60 dias de tratamento',
      icon: <Award className="w-5 h-5" />,
      unlocked: capsuleDays >= 60,
      progress: Math.min(capsuleDays, 60),
      total: 60,
      color: 'from-amber-400 to-amber-600',
    },
    {
      id: 'fire',
      name: 'Em Chamas',
      description: '3 dias seguidos de hidratação',
      icon: <Flame className="w-5 h-5" />,
      unlocked: waterStreak >= 3,
      progress: Math.min(waterStreak, 3),
      total: 3,
      color: 'from-red-400 to-red-600',
    },
  ], [capsuleDays, totalWaterDays, waterStreak]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Conquistas</h3>
            <p className="text-xs text-muted-foreground">{unlockedCount}/{achievements.length} desbloqueadas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <div
              className={cn(
                "w-full aspect-square rounded-xl flex items-center justify-center transition-all",
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} shadow-lg`
                  : "bg-muted/50 opacity-40"
              )}
            >
              <span className={achievement.unlocked ? "text-white" : "text-muted-foreground"}>
                {achievement.icon}
              </span>
            </div>
            
            {/* Progress indicator */}
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
                {achievement.progress}/{achievement.total}
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[120px]">
              <p className="text-xs font-medium text-foreground text-center">{achievement.name}</p>
              <p className="text-[10px] text-muted-foreground text-center">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default AchievementsCard;
