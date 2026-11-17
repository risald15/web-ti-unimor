import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import SambutanKaprodi from '@/components/SambutanKaprodi';
import StatistikSection from '@/components/StatistikSection';
import BidangMinatSection from '@/components/BidangMinatSection';
import BeritaDanAgenda from '@/components/BeritaDanAgenda';
import VideoKegiatanSection from '@/components/VideoKegiatanSection';
import FasilitasSection from '@/components/FasilitasSection';
import DosenPreview from '@/components/DosenPreview';
import PortalMahasiswa from '@/components/PortalMahasiswa';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider />
        <SambutanKaprodi />
        <StatistikSection />
        <BidangMinatSection />
        <BeritaDanAgenda />
        <VideoKegiatanSection />
        <FasilitasSection />
        <DosenPreview />
        <PortalMahasiswa />
      </main>
      <Footer />
    </div>
  );
}
