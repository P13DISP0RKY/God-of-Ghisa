import { useState } from "react";
import { Header } from "@/components/Header";
import { ForgiaPage } from "@/pages/ForgiaPage";
import { ClassificaPage } from "@/pages/ClassificaPage";

type Route = "home" | "classifica";

function App() {
  const [route, setRoute] = useState<Route>("home");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header current={route} onNavigate={setRoute} />
      {route === "home" ? <ForgiaPage /> : <ClassificaPage />}
    </div>
  );
}

export default App;
