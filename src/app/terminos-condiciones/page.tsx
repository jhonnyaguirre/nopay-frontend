'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TermsModalNoPay from 'app/resources/terminosCondiciones';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';

export default function TerminosModalPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleAccept = () => {
    setShowModal(false);
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header />

      {/* Fondo visual base para mantener coherencia */}
      <main className="min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] pt-20 pb-20">
        {/* Espacio reservado por si quieres mostrar algo más aquí */}
      </main>

      {/* El modal aparece centrado en overlay, independiente del flow */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <TermsModalNoPay
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
