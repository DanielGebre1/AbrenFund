import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Notifications = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Notifications</h1>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-lg text-muted-foreground">
              This is a placeholder for the notifications page. In a real application, 
              this would display user notifications about campaign updates, donations, etc.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;