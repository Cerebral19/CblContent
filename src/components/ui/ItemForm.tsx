'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ItemFormProps {
  scheduleId: string;
  clientId: string;
  existingItemsCount: number;
}

export default function ItemForm({ scheduleId, clientId, existingItemsCount }: ItemFormProps) {
  const [artUrl, setArtUrl] = useState('');
  const [caption, setCaption] = useState('');
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
      if (!artUrl.trim() || !caption.trim()) {
        throw new Error('URL da arte e legenda são obrigatórios');
      }

      const { data, error } = await supabase
        .from('schedule_items')
        .insert({
          schedule_id: scheduleId,
          art_url: artUrl.trim(),
          caption: caption.trim(),
          order: existingItemsCount + 1
        })
        .select();

      if (error) throw error;

      // Limpar o formulário
      setArtUrl('');
      setCaption('');
      
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar item');
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
        <label htmlFor="artUrl" className="block text-sm font-medium text-gray-700">
          URL da Arte (Google Drive)
        </label>
        <input
          type="url"
          id="artUrl"
          value={artUrl}
          onChange={(e) => setArtUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Cole o link compartilhável da imagem no Google Drive
        </p>
      </div>
      
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
          Legenda
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Adicionando...' : 'Adicionar Item'}
        </button>
      </div>
    </form>
  );
}