import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-lg text-muted-foreground">
              This is a placeholder for the settings page. In a real application, 
              this would contain user profile settings, notification preferences, etc.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;