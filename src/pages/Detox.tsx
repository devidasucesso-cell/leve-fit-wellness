import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, CloudSun, Moon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getDetoxByTimeOfDay } from '@/data/detoxDrinks';
import DetoxCard from '@/components/DetoxCard';
import Navigation from '@/components/Navigation';
import WaterReminder from '@/components/WaterReminder';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PremiumLock from '@/components/PremiumLock';
import { Sparkles } from 'lucide-react';
import { getDetoxImage } from '@/data/recipeImages';

type TimeOfDay = 'morning' | 'afternoon' | 'night';

const timeConfig = {
  morning: { label: 'Manhã', icon: Sun, color: 'bg-warning text-warning-foreground' },
  afternoon: { label: 'Tarde', icon: CloudSun, color: 'bg-primary text-primary-foreground' },
  night: { label: 'Noite', icon: Moon, color: 'bg-info text-info-foreground' },
};

const Detox = () => {
  const { profile, isCodeValidated } = useAuth();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('morning');
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  
  const category = profile?.imc_category || 'normal';
  const drinks = getDetoxByTimeOfDay(category, selectedTime);

  const categoryLabels = {
    underweight: 'Bebidas Nutritivas',
    normal: 'Equilíbrio Natural',
    overweight: 'Detox Emagrecedor',
    obese: 'Desintoxicação Suave',
  };

  const handleDrinkClick = (drink: any, index: number) => {
    if (!isCodeValidated && index >= 5) {
      setSelectedDrink({ ...drink, locked: true });
    } else {
      setSelectedDrink(drink);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display text-primary-foreground">Chás & Sucos Detox</h1>
            <p className="text-primary-foreground/80 text-sm">Bebidas para desintoxicar seu corpo</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
            {categoryLabels[category]}
          </span>
        </div>
      </div>

      {/* Time Selector */}
      <div className="px-6 -mt-6">
        <div className="bg-card shadow-lg rounded-2xl p-2 flex justify-between items-center">
          {(Object.keys(timeConfig) as TimeOfDay[]).map((time) => {
            const config = timeConfig[time];
            const Icon = config.icon;
            const isSelected = selectedTime === time;
            
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-xl transition-all flex flex-col items-center gap-1",
                  isSelected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drinks Grid */}
      <div className="px-6 mt-6 space-y-4">
        {drinks.map((drink, index) => {
          const isLocked = !isCodeValidated && index >= 5;
          return (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleDrinkClick(drink, index)}
              className={`bg-card rounded-2xl p-3 shadow-sm flex gap-4 cursor-pointer relative overflow-hidden ${isLocked ? 'opacity-80' : ''}`}
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                 <img
                   src={getDetoxImage(selectedTime, index)}
                   alt={drink.name}
                   className={`w-full h-full object-cover ${isLocked ? 'filter grayscale blur-[1px]' : ''}`}
                 />
                 {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-2xl">🔒</span>
                    </div>
                 )}
              </div>
              
              <div className="flex-1 py-1">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{drink.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-2">
                   {drink.benefits.slice(0, 2).map((benefit, i) => (
                     <span key={i} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                       {benefit}
                     </span>
                   ))}
                </div>

                <div className="flex items-center text-primary text-xs font-medium mt-auto">
                   Ver receita
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Drink Detail Modal */}
      <Dialog open={!!selectedDrink} onOpenChange={() => setSelectedDrink(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedDrink?.locked ? (
             <PremiumLock message="Tenha acesso ilimitado" buttonText="Quero acesso ilimitado" />
          ) : (
            selectedDrink && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedDrink.name}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="relative h-48 -mx-6 -mt-2 mb-4 overflow-hidden">
                     <img 
                       src={getDetoxImage(selectedTime, 0)} 
                       alt={selectedDrink.name}
                       className="w-full h-full object-cover"
                     />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Benefícios:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDrink.benefits.map((benefit: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">Ingredientes</h4>
                    <ul className="space-y-2">
                      {selectedDrink.ingredients.map((ingredient: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">Modo de Preparo</h4>
                    <ol className="space-y-4">
                      {selectedDrink.instructions.map((step: string, i: number) => (
                        <li key={i} className="flex gap-4 text-sm text-muted-foreground">
                          <span className="w-6 h-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>

      <WaterReminder />
      <Navigation />
    </div>
  );
};

export default Detox;
