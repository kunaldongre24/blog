import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Recent from "./components/Recent";
import Popular from "./components/Popular";
import Login from "./screens/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./components/Loader";
import { authentication } from "./config/firebase";
import Activity from "./components/Activity";
import NewBlog from "./components/NewBlog";

function App() {
  const [user, loading, error] = useAuthState(authentication);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route
              path="newblog"
              element={
                <ProtectedRoute>
                  <NewBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="recent"
              element={
                <ProtectedRoute>
                  <Recent />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="popular"
              element={
                <ProtectedRoute>
                  <Popular />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
