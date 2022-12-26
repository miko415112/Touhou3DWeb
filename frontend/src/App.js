import './App.css';
import { React } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { GamePage } from './containers/gamePage';
import { HomePage } from './containers/homePage';
import { RoomPage } from './containers/roomPage';

import { UserProvider } from './containers/hooks/context';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/game',
    element: <GamePage />,
  },
  {
    path: '/room',
    element: <RoomPage />,
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
