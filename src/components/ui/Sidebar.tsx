'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  clients?: {
    id: string;
    name: string;
  }[];
}

export default function Sidebar({ clients = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gray-100 border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Clientes</h2>
        <Link 
          href="/dashboard/clientes/novo" 
          className="mb-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Novo Cliente
        </Link>
        <div className="mt-6 space-y-2">
          {clients.map((client) => (
            <Link 
              key={client.id} 
              href={`/dashboard/clientes/${client.id}`}
              className={`block px-4 py-2 rounded-md ${
                pathname === `/dashboard/clientes/${client.id}` 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {client.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}