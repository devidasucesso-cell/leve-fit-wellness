import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import KitSelection from '@/components/KitSelection';

const Index = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showKitSelection, setShowKitSelection] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleKitSelect = (kitType: string) => {
    // Store kit selection in sessionStorage to use after signup
    sessionStorage.setItem('selectedKit', kitType);
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <KitSelection onSelect={handleKitSelect} />;
};

export default Index;