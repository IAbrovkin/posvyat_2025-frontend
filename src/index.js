import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Registration from './pages/Registration';
import Transfer from './pages/Transfer';
import Place from './pages/Place';
import Tickets from './pages/Tickets';
import Main from './pages/Main';
import ErrorPage404 from './pages/ErrorPage404';
import { BeatLoader } from "react-spinners";

import "./scss/main.scss";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "*", element: <ErrorPage404/> },
  { path: "/", element: <Main />,
    loader: async () => <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />
  },
  { path: "/registration", element: <Registration />,
    loader: async () => <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />
  },
  { path: "/transfer", element: <Transfer />,
    loader: async () => <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />
  },
  { path: "/check-in", element: <Place />,
    loader: async () => <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />
  },
  { path: "/tickets", element: <Tickets />,
    loader: async () => <BeatLoader className='loader' color="#8000ff" speedMultiplier={0.7} />
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
