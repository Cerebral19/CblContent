'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Client } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { convertGoogleDriveUrl } from '@/lib/imageUtils'; // Importe a função

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('name');

        if (error) throw error;
        setClients(data || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar clientes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Erro ao carregar clientes: {error}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Nenhum cliente cadastrado ainda.</p>
        <Link 
          href="/dashboard/clients/new" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cadastrar Novo Cliente
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Clientes</h2>
        <Link 
          href="/dashboard/clients/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Cliente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Link 
            key={client.id} 
            href={`/dashboard/clients/${client.id}`}
            className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-40 bg-gray-200 relative">
              {client.profile_picture_url ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={convertGoogleDriveUrl(client.profile_picture_url)} 
                    alt={client.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <span className="text-gray-400 text-4xl">📷</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{client.name}</h3>
              <p className="text-gray-500">@{client.instagram_handle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}