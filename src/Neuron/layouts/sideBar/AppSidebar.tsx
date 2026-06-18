import { logoIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components';
import { useAuth } from '@/Neuron/hooks/use-auth';
import { Notification } from '@/Neuron/layouts/notification';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';

interface AppSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const AppSidebar = ({ open, onToggle }: AppSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={
        'flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out shrink-0 ' +
        (open ? 'w-56' : 'w-14')
      }
    >
      <div
        className={`flex items-center h-12 border-b border-gray-200 transition-all ${
          open ? 'px-3 justify-between' : 'justify-center cursor-pointer hover:bg-gray-50'
        }`}
        onClick={!open ? onToggle : undefined}
      >
        <div className='flex items-center gap-2 overflow-hidden pointer-events-none'>
          <Image
            src={logoIcon}
            alt='Nuron Logo'
            className='w-7 h-7 flex-shrink-0 object-contain rounded-md'
          />
          <span
            className={`font-bold text-gray-800 tracking-tight transition-opacity duration-300 ${open ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
          >
            Nuron Browse
          </span>
        </div>

        {open && (
          <button
            onClick={onToggle}
            className='p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors'
            aria-label='Collapse sidebar'
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <SidebarNav collapsed={!open} />

      <div className='mt-auto px-2 pb-3 space-y-1'>
        <Notification collapsed={!open} />
        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
            open ? 'gap-3 px-3 py-2' : 'justify-center py-2'
          }`}
          title='Logout'
        >
          <LogOut size={18} />
          {open && <span className='text-sm font-medium'>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
