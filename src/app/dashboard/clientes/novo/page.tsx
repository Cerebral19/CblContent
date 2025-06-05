import ClientForm from '@/components/ui/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Novo Cliente</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <ClientForm />
      </div>
    </div>
  );
}