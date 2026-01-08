import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Leaf, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const kits = [
  { id: '1_pote', label: '1 Pote', description: '30 dias de tratamento', icon: '📦' },
  { id: '3_potes', label: '3 Potes', description: '90 dias de tratamento', icon: '📦📦📦' },
  { id: '5_potes', label: '5 Potes', description: '150 dias de tratamento', icon: '📦📦📦📦📦' },
];

const KitSelectionPage = () => {
  const [selectedKit, setSelectedKit] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selectedKit) return;
    
    setLoading(true);
    try {
      await updateProfile({ 
        kit_type: selectedKit,
        treatment_start_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: 'Kit selecionado!',
        description: 'Seu tratamento foi iniciado. Boa jornada!',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a seleção. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-6">
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
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg"
        >
          <Leaf className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Bem-vindo ao LeveFit!
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Qual kit você comprou?
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl"
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
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <RadioGroupItem value={kit.id} id={kit.id} className="sr-only" />
                  <div className="flex-shrink-0">
                    <Package className={`w-8 h-8 ${selectedKit === kit.id ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-lg ${selectedKit === kit.id ? 'text-green-700' : 'text-gray-900'}`}>
                      {kit.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{kit.description}</p>
                  </div>
                  {selectedKit === kit.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          disabled={!selectedKit || loading}
          className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default KitSelectionPage;
