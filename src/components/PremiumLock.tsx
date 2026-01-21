import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PremiumLockProps {
  title?: string;
  message?: string;
  buttonText?: string;
}

const PremiumLock = ({ 
  title = "Conteúdo Premium", 
  message = "Mude sua rotina com o Leve Fit, adquira já o seu", 
  buttonText = "Quero garantir meu tratamento" 
}: PremiumLockProps) => {
  const handlePurchase = () => {
    window.open('https://leveday.com.br', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-4"
    >
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-primary/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-pulse">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-bold text-foreground font-display">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {message}
          </p>
          
          <Button 
            onClick={handlePurchase}
            className="w-full max-w-sm gradient-primary text-white shadow-lg shadow-primary/20 group text-sm h-11"
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:spin-slow" />
            {buttonText}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PremiumLock;
