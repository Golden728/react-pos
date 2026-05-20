import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { Home, Auth, Orders, Tables, Menu } from "./pages";
import Header from "./components/shared/Header";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  setUser,
  removeUser,   // ✅ correct name
  setAuthChecked,
} from "./redux/slices/userSlice";

import FullScreenLoader from "./components/shared/FullScreenLoader";

import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";

// ✅ API
import { getUserData } from "./https";

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuth, authChecked } = useSelector((state) => state.user);

  const hideHeaderRoutes = ["/auth"];

  // ================= AUTH CHECK (VERY IMPORTANT) =================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔥 VERIFY COOKIE FROM BACKEND
        const res = await getUserData();

        if (res?.data) {
          dispatch(setUser(res.data));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        // ❌ COOKIE INVALID / EXPIRED
        dispatch(clearUser());
      } finally {
        dispatch(setAuthChecked());
      }
    };

    checkAuth();
  }, [dispatch]);

  // ================= LOADING =================
  if (!authChecked) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/auth"
          element={isAuth ? <Navigate to="/" /> : <Auth />}
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="/analysis" element={<Analysis />} />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

// ================= PROTECTED ROUTE =================
function ProtectedRoutes({ children }) {
  const { isAuth, authChecked } = useSelector((state) => state.user);

  if (!authChecked) return <FullScreenLoader />;

  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;