import { Routes, Route } from "react-router-dom";
import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRouters.jsx";
import { AuthenticationPage } from "./auth/AuthenticationPage.jsx";
import { Layout } from "./layout/Layout.jsx";
import { TestPage1 } from "./pages/TestPage1.jsx";
import { TestRoot } from "./pages/TestRoot.jsx";

function App() {
  return (
    <ClerkProviderWithRoutes>
      <Routes>
        <Route path="/sign-in/*" element={<AuthenticationPage />} />
        <Route path="/sign-up" element={<AuthenticationPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<TestRoot />} />
          <Route path="/test-one" element={<TestPage1 />} />
        </Route>
      </Routes>
    </ClerkProviderWithRoutes>
  );
}

export default App;