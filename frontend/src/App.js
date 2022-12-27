import './App.css';
import { React, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './containers/hooks/context';

const GamePage = lazy(() => import('./containers/gamePage'));
const HomePage = lazy(() => import('./containers/homePage'));
const RoomPage = lazy(() => import('./containers/roomPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<p>loading...</p>}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/game',
    element: (
      <Suspense fallback={<p>loading...</p>}>
        <GamePage />
      </Suspense>
    ),
  },
  {
    path: '/room',
    element: (
      <Suspense fallback={<p>loading...</p>}>
        <RoomPage />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <div className='root'>
      <UserProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </div>
  );
}

export default App;
