import "./styles/styles.scss";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { AppRouter } from "./providers/router";
import { Navbar } from "../widgets/Navbar";
import { Footer } from "../widgets/Footer";

function App() {
  return (
    <div className="main">
      <Navbar />
      <Suspense fallback={<BarLoader />}>
        <AppRouter />
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
