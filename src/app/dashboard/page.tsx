import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Buscar estatísticas
  const { data: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });
    
  const { data: schedulesCount } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true });
    
  // Buscar clientes recentes
  const { data: recentClients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  // Buscar cronogramas recentes
  const { data: recentSchedules } = await supabase
    .from('schedules')
    .select(`
      id,
      month,
      year,
      created_at,
      clients (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total de Clientes
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {clientsCount?.count || 0}
              </dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/clientes" className="font-medium text-indigo-600 hover:text-indigo-500">
                Ver todos os clientes
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total de Cronogramas
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {schedulesCount?.count || 0}
              </dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/clientes" className="font-medium text-indigo-600 hover:text-indigo-500">
                Ver todos os cronogramas
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Clientes Recentes */}
      <h2 className="text-xl font-semibold mb-4">Clientes Recentes</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <ul className="divide-y divide-gray-200">
          {recentClients?.length ? (
            recentClients.map((client) => (
              <li key={client.id}>
                <Link href={`/dashboard/clientes/${client.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{client.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {client.instagram_handle}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {client.profile_picture_url ? 'Com foto de perfil' : 'Sem foto de perfil'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Criado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-gray-500">Nenhum cliente cadastrado ainda.</li>
          )}
        </ul>
      </div>
      
      {/* Cronogramas Recentes */}
      <h2 className="text-xl font-semibold mb-4">Cronogramas Recentes</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {recentSchedules?.length ? (
            recentSchedules.map((schedule) => (
              <li key={schedule.id}>
                <Link href={`/dashboard/clientes/${schedule.clients?.id}?schedule=${schedule.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {schedule.clients?.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {new Date(schedule.year, schedule.month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Criado em {new Date(schedule.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-gray-500">Nenhum cronograma criado ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
}