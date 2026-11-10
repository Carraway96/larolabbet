import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import WorkAreaPage from "./pages/WorkAreaPage";
import NotFoundPage from "./pages/NotFoundPage";
import ConceptTrainingPage from "./pages/ConceptTrainingPage";
import EgyptTrainingPage from "./pages/EgyptTrainingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="amne/:subjectId" element={<SubjectPage />} />
        <Route path="arbetsomrade/:areaId" element={<WorkAreaPage />} />
        <Route path="arbetsomrade/demokrati-diktatur-medier/begreppstraning" element={<ConceptTrainingPage />} />
        <Route path="arbetsomrade/flodkulturen-i-egypten/spel" element={<EgyptTrainingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
