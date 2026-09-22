import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { NotificationProvider } from "./context/notifications/NotificationProvider.jsx";
import AppRoutes from "./routes/AppRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;