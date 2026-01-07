import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Plus, Check, X, Shield, Loader2, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AccessCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
  user_name?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    if (isAdmin) {
      fetchCodes();
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchCodes = async () => {
    try {
      // Fetch all access codes
      const { data: codesData, error: codesError } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;

      if (codesData) {
        // Fetch profiles to get user names for used codes
        const usedByIds = codesData
          .filter(c => c.used_by)
          .map(c => c.used_by);

        let userNames: Record<string, string> = {};
        
        if (usedByIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, name')
            .in('user_id', usedByIds);
          
          if (profiles) {
            userNames = profiles.reduce((acc, p) => {
              acc[p.user_id] = p.name;
              return acc;
            }, {} as Record<string, string>);
          }
        }

        setCodes(codesData.map(code => ({
          ...code,
          user_name: code.used_by ? userNames[code.used_by] || 'Usuário' : undefined,
        })));
      }
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os códigos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(code);
  };

  const createCode = async () => {
    if (!newCode.trim()) {
      toast({
        title: 'Código obrigatório',
        description: 'Digite ou gere um código.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('access_codes')
        .insert({ code: newCode.toUpperCase().trim() });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Código já existe',
            description: 'Este código já está cadastrado.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Código criado!',
          description: `Código ${newCode.toUpperCase()} criado com sucesso.`,
        });
        setNewCode('');
        fetchCodes();
      }
    } catch (error) {
      console.error('Error creating code:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o código.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copiado!',
      description: 'Código copiado para a área de transferência.',
    });
  };

  const deleteCode = async (id: string, code: string) => {
    try {
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCodes(codes.filter(c => c.id !== id));
      toast({
        title: 'Código removido',
        description: `Código ${code} foi removido.`,
      });
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o código.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const availableCodes = codes.filter(c => !c.is_used);
  const usedCodes = codes.filter(c => c.is_used);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-8">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Gerenciar Códigos</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{availableCodes.length}</p>
                    <p className="text-sm text-green-600">Disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{usedCodes.length}</p>
                    <p className="text-sm text-blue-600">Utilizados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Create Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Criar Novo Código
              </CardTitle>
              <CardDescription>
                Digite um código ou gere um automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                  maxLength={20}
                />
                <Button variant="outline" onClick={generateCode}>
                  Gerar
                </Button>
              </div>
              <Button
                onClick={createCode}
                disabled={creating || !newCode.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Criar Código
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-green-500" />
                Códigos Disponíveis ({availableCodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableCodes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum código disponível
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableCodes.slice(0, 20).map(code => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono font-bold">{code.code}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(code.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyCode(code.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteCode(code.id, code.code)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {availableCodes.length > 20 && (
                    <p className="text-center text-muted-foreground text-sm mt-2">
                      Mostrando 20 de {availableCodes.length} códigos
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Used Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-blue-500" />
                Códigos Utilizados ({usedCodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usedCodes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum código utilizado ainda
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Usado por</TableHead>
                        <TableHead>Data de uso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usedCodes.map(code => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono">
                            <Badge variant="secondary">{code.code}</Badge>
                          </TableCell>
                          <TableCell>{code.user_name || 'Usuário'}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {code.used_at
                              ? new Date(code.used_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;