import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getExercisesByDifficultyAndCategory, getCategoriesForDifficulty, exerciseCategoryLabels } from '@/data/exercises';
import ExerciseCard from '@/components/ExerciseCard';
import Navigation from '@/components/Navigation';
import WaterReminder from '@/components/WaterReminder';
import { useNavigate } from 'react-router-dom';
import { ExerciseCategory } from '@/types';

type Difficulty = 'easy' | 'moderate' | 'intense';

const difficultyConfig = {
  easy: { label: 'Fácil', color: 'bg-exercise-easy text-white', description: 'Perfeito para iniciantes' },
  moderate: { label: 'Moderado', color: 'bg-exercise-moderate text-warning-foreground', description: 'Desafio equilibrado' },
  intense: { label: 'Intenso', color: 'bg-exercise-intense text-white', description: 'Para quem quer resultados rápidos' },
};

const Exercises = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);
  
  const categories = useMemo(() => getCategoriesForDifficulty(selectedDifficulty), [selectedDifficulty]);
  
  const exercises = useMemo(() => 
    getExercisesByDifficultyAndCategory(selectedDifficulty, selectedCategory || undefined),
    [selectedDifficulty, selectedCategory]
  );
  
  const config = difficultyConfig[selectedDifficulty];

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className={cn("p-6 pb-8 rounded-b-3xl", config.color)}>
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-current hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display">Exercícios Aeróbicos</h1>
            <p className="opacity-80 text-sm">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-4 space-y-4">
        {/* Difficulty Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {(Object.keys(difficultyConfig) as Difficulty[]).map((difficulty) => {
            const dConfig = difficultyConfig[difficulty];
            const isSelected = selectedDifficulty === difficulty;
            
            return (
              <Button
                key={difficulty}
                onClick={() => handleDifficultyChange(difficulty)}
                className={cn(
                  "flex-1 h-12 transition-all font-semibold",
                  isSelected ? dConfig.color : "bg-card hover:bg-secondary text-foreground"
                )}
                variant={isSelected ? "default" : "outline"}
              >
                {dConfig.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto pb-2"
        >
          <div className="flex gap-2 min-w-max">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "whitespace-nowrap",
                selectedCategory === null && "bg-primary text-primary-foreground"
              )}
            >
              Todos ({exercises.length})
            </Button>
            {categories.map((category) => {
              const categoryInfo = exerciseCategoryLabels[category];
              const count = getExercisesByDifficultyAndCategory(selectedDifficulty, category).length;
              const isSelected = selectedCategory === category;
              
              return (
                <Button
                  key={category}
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "whitespace-nowrap",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                >
                  {categoryInfo.icon} {categoryInfo.label} ({count})
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Exercises Grid */}
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
        
        {exercises.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum exercício encontrado para esta categoria.
          </div>
        )}
      </div>

      <WaterReminder />
      <Navigation />
    </div>
  );
};

export default Exercises;
