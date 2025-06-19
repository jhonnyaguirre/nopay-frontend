import React from "react";

// src/components/ChatBot.tsx
export default function ChatBot({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    if (!visible) return null;
  
    return (
      <div className="fixed bottom-5 right-5 bg-white border shadow-xl p-4 rounded-lg z-50">
        <button onClick={onClose} className="text-sm text-red-500 float-right">Cerrar</button>
        <p>¡Hola! Soy el ChatBot de NoPay 🤖</p>
      </div>
    );
  }
  