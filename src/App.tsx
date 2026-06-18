import { WorkflowProvider } from '@/Neuron/context';
import { router } from '@/Neuron/routes/routes';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

export const App: React.FC = () => {
  return (
    <>
      <WorkflowProvider>
        <RouterProvider router={router} />
      </WorkflowProvider>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Slide}
      />
    </>
  );
};
