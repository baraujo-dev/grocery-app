import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./auth/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { PhoneLayout } from "./components/PhoneLayout";

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <PhoneLayout>
          <MainPage />
        </PhoneLayout>
      </QueryClientProvider>
    );
  } else {
    return (
      <PhoneLayout>
        <LoginPage />
      </PhoneLayout>
    );
  }
}

export default App;
