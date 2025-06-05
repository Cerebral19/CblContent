'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generatePublicLink } from '@/lib/utils';

interface ScheduleFormProps {
  clientId: string;
  clientName: string;
}

export default function ScheduleForm({ clientId, clientName }: ScheduleFormProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
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
      if (!month || !year) {
        throw new Error('Mês e ano são obrigatórios');
      }

      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      // Gerar link público
      const publicLink = generatePublicLink(clientName, monthNum, yearNum);

      const { data, error } = await supabase
        .from('schedules')
        .insert({
          client_id: clientId,
          month: monthNum,
          year: yearNum,
          public_link: publicLink
        })
        .select();

      if (error) throw error;

      router.refresh();
      
      // Redirecionar para a página do cronograma recém-criado
      if (data && data[0]) {
        router.push(`/dashboard/clientes/${clientId}?schedule=${data[0].id}`);
      } else {
        router.push(`/dashboard/clientes/${clientId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cronograma');
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
        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
          Mês
        </label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Selecione o mês</option>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Ano
        </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2020"
          max="2030"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
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
          {loading ? 'Criando...' : 'Criar Cronograma'}
        </button>
      </div>
    </form>
  );
}