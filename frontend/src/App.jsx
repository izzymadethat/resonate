import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import ProjectsPage from "./components/ProjectsPage";
import CreateProjectPage from "./components/CreateProjectPage";
import ViewSingleProjectPage from "./components/ViewSingleProjectPage";
import EditProjectPage from "./components/EditProjectPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/projects",
        children: [
          {
            index: true,
            element: <ProjectsPage />
          },
          {
            path: "new",
            element: <CreateProjectPage />
          },
          {
            path: ":projectId",
            children: [
              {
                index: true,
                element: <ViewSingleProjectPage />
              },
              {
                path: "edit",
                element: <EditProjectPage />
              }
            ]
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
