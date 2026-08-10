import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import WorkAreaPage from "./pages/WorkAreaPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="amne/:subjectId" element={<SubjectPage />} />
        <Route path="arbetsomrade/:areaId" element={<WorkAreaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
