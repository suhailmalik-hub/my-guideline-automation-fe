import { useSSE } from '@/Neuron/hooks';
import { AppSidebar } from '@/Neuron/layouts/sideBar/AppSidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSSE({
    onConnected: () => console.log('[SSE] Connected'),
    onDisconnected: () => console.log('[SSE] Disconnected'),
  });

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-1 overflow-hidden'>
        <AppSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className='flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
