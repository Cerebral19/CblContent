'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ClientForm() {
  const [name, setName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!name.trim() || !instagramHandle.trim()) {
        throw new Error('Nome e Instagram são obrigatórios');
      }

      // Formatar o handle do Instagram
      const formattedHandle = instagramHandle.startsWith('@') 
        ? instagramHandle 
        : `@${instagramHandle}`;

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: name.trim(),
          instagram_handle: formattedHandle,
          profile_picture_url: profilePictureUrl.trim() || null
        })
        .select();

      if (error) throw error;

      router.push('/dashboard/clientes');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
          Instagram
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
            @
          </span>
          <input
            type="text"
            id="instagram"
            value={instagramHandle.startsWith('@') ? instagramHandle.substring(1) : instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
          URL da Foto de Perfil (Google Drive)
        </label>
        <input
          type="url"
          id="profilePicture"
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Cole o link compartilhável da imagem no Google Drive
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
}