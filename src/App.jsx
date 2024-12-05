import Signup from "./signup/Signup";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/Login";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
