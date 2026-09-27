'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import EmployeeExperience from '../components/landing/EmployeeExperience';
import EnterpriseBenefits from '../components/landing/EnterpriseBenefits';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import LegalModal from '../components/landing/LegalModal';

type Modal = 'terms' | 'privacy' | null;

export default function LandingPage() {
  const [modal, setModal] = useState<Modal>(null);

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow-1">
        <Hero />
        <HowItWorks />
        <Features />
        <EmployeeExperience />
        <EnterpriseBenefits />
        <Testimonials />
        <CTA />
      </main>
      <Footer
        onOpenTerms={() => setModal('terms')}
        onOpenPrivacy={() => setModal('privacy')}
      />
      {modal && <LegalModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
