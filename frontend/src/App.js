import "./App.css";
import { React, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./containers/hooks/context";
import { loadingGif } from "./components/resource";

const LoginPage = lazy(() => import("./containers/loginPage"));
const GamePage = lazy(() => import("./containers/gamePage"));
const HomePage = lazy(() => import("./containers/homePage"));
const RoomPage = lazy(() => import("./containers/roomPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/game",
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <GamePage />
      </Suspense>
    ),
  },
  {
    path: "/room",
    element: (
      <Suspense fallback={<img src={loadingGif} />}>
        <RoomPage />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <div className="root">
      <UserProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </div>
  );
}

export default App;
