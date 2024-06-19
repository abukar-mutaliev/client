import { Route, Routes } from "react-router-dom";
import { MainPage } from "../../../../pages/MainPage";
import { AboutPage } from "../../../../pages/AboutPage";
import { AdminPanelPage } from "../../../../pages/AdminPanelPage";
import { DescriptionPage } from "../../../../pages/DescriptionPage";
import { NotFoundPage } from "../../../../pages/NotFoundPage";
import "./appRouter.scss";
import { CategoriesPage } from "../../../../pages/CategoriesPage";
import { LoginPage } from "../../../../pages/LoginPage";
import { RegionsPage } from "../../../../pages/RegionsPage";
import { PartnerPage } from "../../../../pages/PartnerPage";

export function AppRouter() {
  return (
    <div className="container-AppRouter">
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/person/:id" element={<DescriptionPage />} />
        <Route path="/partner/" element={<PartnerPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/categories/:id" element={<CategoriesPage />} />
        <Route path="/region/:id" element={<RegionsPage />} />
      </Routes>
    </div>
  );
}
