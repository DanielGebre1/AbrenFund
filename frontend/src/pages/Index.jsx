import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedCampaigns from '../components/FeaturedCampaign';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import TrustedPartners from '../components/TrustedPartners';
import SuccessStoryPreview from '../components/SuccessStoryPreview';


const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Categories />
        <FeaturedCampaigns />
        <HowItWorks />
        <SuccessStoryPreview />
        <TrustedPartners />
        <Stats />
        </main>
      <Footer />
    </div>
  );
};

export default Index;
