import './App.css';
import { React } from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { GamePage } from './containers/gamePage';
import { HomePage } from './containers/homePage';
import { RoomPage } from './containers/roomPage';

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
    path: '/room/:roomID/:id/:name',
    element: <RoomPage />,
  },
]);

function App() {
  return (
    <div className='root'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
