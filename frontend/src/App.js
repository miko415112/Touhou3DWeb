import './App.css';
import { React, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './containers/hooks/context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { loadingGif } from './components/resource';

const GamePage = lazy(() => import('./containers/gamePage'));
const HomePage = lazy(() => import('./containers/homePage'));
const RoomPage = lazy(() => import('./containers/roomPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/game',
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <GamePage />
      </Suspense>
    ),
  },
  {
    path: '/room',
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <RoomPage />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <div className='root'>
      <UserProvider>
        <GoogleOAuthProvider
          clientId={
            '301310621595-m9vgf8rd7dqtlqhi0m24fprlb01j5frj.apps.googleusercontent.com'
          }
        >
          <RouterProvider router={router}></RouterProvider>
        </GoogleOAuthProvider>
      </UserProvider>
    </div>
  );
}

export default App;
