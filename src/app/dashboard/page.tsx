'use client';

import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  // Função de manipulação de eventos
  const handleStatisticsClick = () => {
    console.log('Estatísticas clicadas');
    // Qualquer lógica adicional aqui
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Para links, podemos usar o componente Link normalmente */}
        <Link 
          href="/dashboard/clients" 
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Gerenciar Clientes</h2>
          <p className="text-gray-600">Cadastre e gerencie seus clientes.</p>
        </Link>
        
        {/* Para botões com eventos, usamos diretamente o elemento button */}
        <button
          onClick={handleStatisticsClick}
          className="block w-full text-left p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Estatísticas</h2>
          <p className="text-gray-600">Em breve: estatísticas e métricas de uso.</p>
        </button>
      </div>
    </div>
  );
}