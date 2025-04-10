import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const CreateCampaign = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Create a New Campaign</h1>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-lg text-muted-foreground mb-8">
              This is a placeholder for the campaign creation form. In a real application, 
              this would contain a form with fields for campaign details, funding goals, media uploads, etc.
            </p>
            <Button>Coming Soon</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;