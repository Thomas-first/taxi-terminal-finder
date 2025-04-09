
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { BarChart3, ArrowLeft } from "lucide-react";

const Analytics = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for admin authorization
    const checkAuthorization = () => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAuthorized(isAdmin);
      setIsLoading(false);
      
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the analytics dashboard",
          variant: "destructive",
        });
      }
    };
    
    // Wait a bit to simulate loading
    const timer = setTimeout(checkAuthorization, 1000);
    return () => clearTimeout(timer);
  }, [toast]);

  // For demo purposes, automatically grant access
  useEffect(() => {
    localStorage.setItem('isAdmin', 'true');
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <BarChart3 size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 text-center">
          You don't have permission to access the analytics dashboard
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <BarChart3 className="text-primary mr-2" size={24} />
            <h1 className="text-xl font-bold">Taxi Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <AnalyticsDashboard />
      </main>
    </div>
  );
};

export default Analytics;
