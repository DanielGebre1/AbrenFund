import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedCampaigns from '../components/FeaturedCampaign';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import TrustedPartners from '../components/TrustedPartners';
const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedCampaigns />
        <HowItWorks />
        <TrustedPartners />
        <Stats />
        </main>
      <Footer />
    </div>
  );
};

export default Index;
