import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMonthName } from '@/lib/utils';
import ItemForm from '@/components/ui/ItemForm';

interface ClientPageProps {
  params: { id: string };
  searchParams: { schedule?: string };
}

export default async function ClientPage({ params, searchParams }: ClientPageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // Buscar cliente
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();
    
  if (!client) {
    notFound();
  }
  
  // Buscar cronogramas do cliente
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*')
    .eq('client_id', params.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false });
    
  // Se tiver um cronograma selecionado, buscar seus itens
  let selectedSchedule = null;
  let scheduleItems = null;
  
  if (searchParams.schedule) {
    const { data: schedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', searchParams.schedule)
      .single();
      
    if (schedule) {
      selectedSchedule = schedule;
      
      const { data: items } = await supabase
        .from('schedule_items')
        .select(`
          *,
          item_feedbacks (*)
        `)
        .eq('schedule_id', schedule.id)
        .order('order');
        
      scheduleItems = items;
    }
  }
  
  // URL base para o link público
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <Link 
          href={`/dashboard/clientes/${client.id}/editar`} 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Editar Cliente
        </Link>
      </div>
      
      {/* Informações do cliente */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informações do Cliente
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Instagram</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.instagram_handle}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Foto de Perfil</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.profile_picture_url ? (
                  <a href={client.profile_picture_url}  rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                    Ver foto de perfil
                  </a>
                ) : (
                  'Não cadastrada'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(client.created_at).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Cronogramas */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cronogramas</h2>
        <button 
          type="button"
          onClick={() => {
            // Abrir modal para criar novo cronograma
          }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Novo Cronograma
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {schedules?.length ? (
          schedules.map((schedule) => (
            <Link 
              key={schedule.id} 
              href={`/dashboard/clientes/${client.id}?schedule=${schedule.id}`}
              className={`block p-4 border rounded-lg hover:bg-gray-50 ${
                selectedSchedule?.id === schedule.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <h3 className="font-medium text-gray-900">
                {getMonthName(schedule.month)} {schedule.year}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Link público: <span className="text-indigo-600">{baseUrl}/{schedule.public_link}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Criado em {new Date(schedule.created_at).toLocaleDateString('pt-BR')}
              </p>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-gray-500">
            Nenhum cronograma criado ainda.
          </div>
        )}
      </div>
      
      {/* Itens do cronograma selecionado */}
      {selectedSchedule && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Itens do Cronograma - {getMonthName(selectedSchedule.month)} {selectedSchedule.year}
            </h2>
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => {
                  // Copiar link público para a área de transferência
                  navigator.clipboard.writeText(`${baseUrl}/${selectedSchedule.public_link}`);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Copiar Link Público
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Adicionar Novo Item
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ItemForm 
                scheduleId={selectedSchedule.id} 
                clientId={client.id}
                existingItemsCount={scheduleItems?.length || 0}
              />
            </div>
          </div>
          
          {/* Lista de itens */}
          <div className="space-y-4">
            {scheduleItems?.length ? (
              scheduleItems.map((item) => (
                <div key={item.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Item #{item.order}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Arte</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <a href={item.art_url}  rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                            Ver imagem
                          </a>
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Legenda</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.caption}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Status de Feedback</dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                          {item.item_feedbacks?.length ? (
                            <div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.item_feedbacks[0].status === 'approved' ? 'bg-green-100 text-green-800' :
                                item.item_feedbacks[0].status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.item_feedbacks[0].status === 'approved' ? 'Aprovado' :
                                 item.item_feedbacks[0].status === 'rejected' ? 'Reprovado' :
                                 item.item_feedbacks[0].status === 'review_caption' ? 'Revisar Legenda' :
                                 item.item_feedbacks[0].status === 'review_art' ? 'Revisar Arte' : 'Pendente'}
                              </span>
                              {item.item_feedbacks[0].comment && (
                                <p className="mt-2 text-sm text-gray-500">{item.item_feedbacks[0].comment}</p>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Aguardando feedback
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                Nenhum item adicionado a este cronograma ainda.
              </div>
            )}
          </div>
        </div>
      )}
      
      {!selectedSchedule && schedules?.length > 0 && (
        <div className="text-gray-500">
          Selecione um cronograma para ver seus itens.
        </div>
      )}
    </div>
  );
}