import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Copy, Share2, Check, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ReferralCard = () => {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a simple referral code based on user id
  const referralCode = user?.id ? `LEVE${user.id.slice(0, 6).toUpperCase()}` : 'LEVEFIT';
  
  const referralLink = `https://levefitapp.lovable.app?ref=${referralCode}`;
  const referralMessage = `🌿 Estou usando o LeveFit e estou amando os resultados! Use meu código ${referralCode} para começar sua jornada de emagrecimento. ${referralLink}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralMessage);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LeveFit - Indique e Ganhe',
          text: referralMessage,
          url: referralLink,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card 
          className="p-4 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowDialog(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Indique e Ganhe</h3>
                <p className="text-sm text-muted-foreground">
                  Convide amigos e ganhe recompensas!
                </p>
              </div>
            </div>
            <Gift className="w-5 h-5 text-amber-500" />
          </div>
        </Card>
      </motion.div>

      {/* Referral Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <span className="text-2xl">🎁</span>
              Indique e Ganhe
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Benefits */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Benefícios
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>Seu amigo ganha 10% de desconto</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Você ganha pontos para próxima compra</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span>Indique 5 amigos e ganhe frete grátis!</span>
                </li>
              </ul>
            </div>

            {/* Referral Code */}
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Seu código de indicação:</p>
              <div className="flex items-center justify-between bg-background rounded-lg px-4 py-3">
                <span className="font-mono font-bold text-lg text-primary">{referralCode}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Indicados</p>
              </div>
              <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
                <Gift className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Pontos</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReferralCard;
