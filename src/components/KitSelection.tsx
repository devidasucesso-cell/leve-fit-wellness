import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Leaf, Package, ArrowRight } from 'lucide-react';

interface KitSelectionProps {
  onSelect: (kitType: string) => void;
}

const kits = [
  { id: '1_pote', label: '1 Pote', description: '30 dias de tratamento', icon: '📦' },
  { id: '3_potes', label: '3 Potes', description: '90 dias de tratamento', icon: '📦📦📦' },
  { id: '5_potes', label: '5 Potes', description: '150 dias de tratamento', icon: '📦📦📦📦📦' },
];

const KitSelection = ({ onSelect }: KitSelectionProps) => {
  const [selectedKit, setSelectedKit] = useState<string>('');

  const handleContinue = () => {
    if (selectedKit) {
      onSelect(selectedKit);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      {/* Background with transparency support */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-full mb-6 shadow-glow"
        >
          <Leaf className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Bem-vindo ao LeveFit!
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Qual kit você comprou?
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <RadioGroup value={selectedKit} onValueChange={setSelectedKit} className="space-y-4">
            {kits.map((kit, index) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Label
                  htmlFor={kit.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedKit === kit.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-secondary border-2 border-transparent hover:bg-secondary/80'
                  }`}
                >
                  <RadioGroupItem value={kit.id} id={kit.id} className="sr-only" />
                  <div className="flex-shrink-0">
                    <Package className={`w-8 h-8 ${selectedKit === kit.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-lg ${selectedKit === kit.id ? 'text-primary' : 'text-foreground'}`}>
                      {kit.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{kit.description}</p>
                  </div>
                  {selectedKit === kit.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </motion.div>

        <Button
          onClick={handleContinue}
          disabled={!selectedKit}
          className="w-full h-14 text-lg gradient-primary text-primary-foreground shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default KitSelection;