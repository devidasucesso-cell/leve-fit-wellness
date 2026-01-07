import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, LogOut, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CodeVerification = () => {
  const { logout, profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira o código de acesso.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if code exists and is not used
      const { data: codeData, error: fetchError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!codeData) {
        toast({
          title: "Código inválido",
          description: "O código inserido não existe.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (codeData.is_used) {
        toast({
          title: "Código já utilizado",
          description: "Este código já foi usado por outro usuário.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Mark code as used
      const { error: updateCodeError } = await supabase
        .from('access_codes')
        .update({
          is_used: true,
          used_by: user.id,
          used_at: new Date().toISOString(),
        })
        .eq('id', codeData.id);

      if (updateCodeError) {
        throw updateCodeError;
      }

      // Update profile to mark code as validated
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ code_validated: true })
        .eq('user_id', user.id);

      if (updateProfileError) {
        throw updateProfileError;
      }

      toast({
        title: "Código validado!",
        description: "Seu acesso foi liberado com sucesso.",
      });

      // Refresh profile to update the state
      await refreshProfile();

    } catch (error: unknown) {
      console.error('Error verifying code:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-4 shadow-lg"
          >
            <KeyRound className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            LeveFit
          </h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Ativar Acesso
              </h2>
              <p className="text-muted-foreground">
                Olá{profile?.name ? `, ${profile.name}` : ''}! Insira o código de acesso fornecido para liberar o uso do aplicativo.
              </p>
            </motion.div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Acesso</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Digite seu código"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="text-center text-lg tracking-widest font-mono uppercase"
                  maxLength={20}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Ativar Código
                  </>
                )}
              </Button>
            </form>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={logout}
                className="w-full"
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CodeVerification;