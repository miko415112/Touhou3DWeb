import "./App.css";
import { React, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { WebSocketComponent } from "./containers/webSocket";
import { loadingGif } from "./components/resource";
import { NotifyComponent } from "./containers/notify";

const LoginPage = lazy(() => import("./containers/loginPage"));
const HomePage = lazy(() => import("./containers/homePage"));
const RoomPage = lazy(() => import("./containers/roomPage"));
const GamePage = lazy(() => import("./containers/gamePage"));

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
      <Provider store={store}>
        <WebSocketComponent />
        <NotifyComponent />
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </div>
  );
}

export default App;
