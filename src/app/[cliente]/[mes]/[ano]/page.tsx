'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/supabase-js';
import { getMonthName } from '@/lib/utils';

interface FeedbackPageProps {
  params: {
    cliente: string;
    mes: string;
    ano: string;
  };
}

interface ScheduleItem {
  id: string;
  art_url: string;
  caption: string;
  order: number;
  feedback?: {
    status: string;
    comment: string | null;
  };
}

export default function FeedbackPage({ params }: FeedbackPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, { status: string; comment: string | null }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const month = parseInt(params.mes);
  const year = parseInt(params.ano);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const publicLink = `${params.cliente}/${params.mes}/${params.ano}`;

        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select(`*, clients (*)`)
          .eq('public_link', publicLink)
          .single();

        if (scheduleError) throw scheduleError;

        if (!scheduleData) {
          setError('Cronograma não encontrado');
          setLoading(false);
          return;
        }

        setSchedule(scheduleData);
        setClient(scheduleData.clients);

        const { data: itemsData, error: itemsError } = await supabase
          .from('schedule_items')
          .select(`*, item_feedbacks (*)`)
          .eq('schedule_id', scheduleData.id)
          .order('order');

        if (itemsError) throw itemsError;

        const initialFeedbacks: Record<string, { status: string; comment: string | null }> = {};

        const processedItems = itemsData?.map(item => {
          if (item.item_feedbacks && item.item_feedbacks.length > 0) {
            initialFeedbacks[item.id] = {
              status: item.item_feedbacks[0].status,
              comment: item.item_feedbacks[0].comment
            };

            return {
              ...item,
              feedback: {
                status: item.item_feedbacks[0].status,
                comment: item.item_feedbacks[0].comment
              }
            };
          }

          return item;
        }) || [];

        setItems(processedItems);
        setFeedbacks(initialFeedbacks);

      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, supabase]);

  const handleFeedbackChange = (itemId: string, status: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status
      }
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const missingFeedback = items.some(item => !feedbacks[item.id]?.status);
      if (missingFeedback) {
        alert('Por favor, forneça feedback para todos os itens antes de enviar.');
        return;
      }

      const missingComment = items.some(item =>
        feedbacks[item.id]?.status !== 'approved' &&
        (!feedbacks[item.id]?.comment || feedbacks[item.id]?.comment.trim() === '')
      );

      if (missingComment) {
        alert('Por favor, forneça um comentário para todos os itens não aprovados.');
        return;
      }

      for (const item of items) {
        const feedback = feedbacks[item.id];

        if (!feedback) continue;

        const { data: existingFeedback } = await supabase
          .from('item_feedbacks')
          .select('id')
          .eq('item_id', item.id)
          .maybeSingle();

        if (existingFeedback) {
          await supabase
            .from('item_feedbacks')
            .update({
              status: feedback.status,
              comment: feedback.comment
            })
            .eq('item_id', item.id);
        } else {
          await supabase
            .from('item_feedbacks')
            .insert({
              item_id: item.id,
              status: feedback.status,
              comment: feedback.comment
            });
        }
      }

      setSubmitted(true);
      alert('Feedback enviado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Feedback - {getMonthName(month)} {year}</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id}>
              <img src={item.art_url} alt={item.caption} width={300} />
              <p>{item.caption}</p>
              <select
                value={feedbacks[item.id]?.status || ''}
                onChange={e => handleFeedbackChange(item.id, e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
              {feedbacks[item.id]?.status === 'rejected' && (
                <textarea
                  placeholder="Motivo da reprovação"
                  value={feedbacks[item.id]?.comment || ''}
                  onChange={e => handleCommentChange(item.id, e.target.value)}
                />
              )}
            </div>
          ))}
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar Feedback'}
          </button>
          {submitted && <p>Feedback enviado!</p>}
        </div>
      )}
    </div>
  );
}
