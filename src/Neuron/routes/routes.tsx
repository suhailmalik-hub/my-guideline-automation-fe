import AppLayout from '@/Neuron/layouts/AppLayout';
import { Loader } from '@/lib/ui/components';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('@/Neuron/pages/login/Login').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('@/Neuron/pages/dashboard/Dashboard').then((m) => ({ default: m.DashboardPage }))
);
const WorkFlowEditorPage = lazy(() =>
  import('@/Neuron/pages/work-flow-editor/WorkFlowEditor').then((m) => ({ default: m.WorkFlowEditorPage }))
);
const WorkFlowListPage = lazy(() =>
  import('@/Neuron/pages/work-flow-list/WorkFlowList').then((m) => ({ default: m.WorkFlowListPage }))
);
const NotFoundPage = lazy(() => import('@/Neuron/pages/notFound/NotFound').then((m) => ({ default: m.NotFoundPage })));
const VisaMasterPage = lazy(() =>
  import('@/Neuron/pages/visa-master/VisaMaster').then((m) => ({ default: m.VisaMasterPage }))
);
const ReviewGuidelinePage = lazy(() =>
  import('@/Neuron/pages/review-guideline/ReviewGuideline').then((m) => ({ default: m.ReviewGuidelinePage }))
);

const Lazy = ({ children }: { children: React.ReactNode }) => <Suspense fallback={<Loader />}>{children}</Suspense>;

export const LOGIN_ROUTES = [
  {
    path: '/login',
    element: (
      <Lazy>
        <LoginPage />
      </Lazy>
    ),
  },
  {
    path: '/',
    element: (
      <Lazy>
        <LoginPage />
      </Lazy>
    ),
  },
];

export const APP_ROUTES = [
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Lazy>
                <DashboardPage />
              </Lazy>
            ),
          },
          {
            path: '/workflow/create',
            element: (
              <Lazy>
                <WorkFlowEditorPage />
              </Lazy>
            ),
          },
          {
            path: '/workflow/:id/edit',
            element: (
              <Lazy>
                <WorkFlowEditorPage />
              </Lazy>
            ),
          },
          {
            path: '/workflow/list',
            element: (
              <Lazy>
                <WorkFlowListPage />
              </Lazy>
            ),
          },
          {
            path: '/workflow/:id/review',
            element: (
              <Lazy>
                <ReviewGuidelinePage />
              </Lazy>
            ),
          },
          {
            path: '/visa-master',
            element: (
              <Lazy>
                <VisaMasterPage />
              </Lazy>
            ),
          },
        ],
      },
    ],
  },
];

export const NOT_FOUND_ROUTE = [
  {
    path: '*',
    element: (
      <Lazy>
        <NotFoundPage />
      </Lazy>
    ),
  },
];

export const router = createBrowserRouter([...LOGIN_ROUTES, ...APP_ROUTES, ...NOT_FOUND_ROUTE]);
