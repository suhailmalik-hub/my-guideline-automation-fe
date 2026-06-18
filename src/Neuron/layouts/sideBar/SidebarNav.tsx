import { t } from '@/config/labels';
import { LayoutDashboard, List, PlaneTakeoff, Workflow } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: t('Dashboard') },
  { to: '/workflow/create', icon: Workflow, label: t('WorkFlow') },
  { to: '/workflow/list', icon: List, label: t('WorkFlow List') },
  { to: '/visa-master', icon: PlaneTakeoff, label: t('Visa Master') },
] as const;

interface SidebarNavProps {
  collapsed: boolean;
}

export const SidebarNav = ({ collapsed }: SidebarNavProps) => {
  return (
    <nav className='flex flex-col gap-1 px-2 mt-2'>
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors 
            ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            ${collapsed ? 'justify-center px-0' : ''}`
          }
        >
          <item.icon
            size={20}
            className='shrink-0'
          />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
