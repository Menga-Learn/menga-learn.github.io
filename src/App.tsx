import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CertPage } from './pages/CertPage';
import { LessonPage } from './pages/LessonPage';
import { ExercisePage } from './pages/ExercisePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { QuizSessionPage } from './pages/QuizSessionPage';
import { InfoPage } from './pages/InfoPage';
import { NotFoundPage } from './pages/NotFoundPage';

// HashRouter: l'app è statica e funziona su qualunque hosting (anche GitHub Pages) senza configurare il server.
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="c/:certId" element={<CertPage />} />
          <Route path="c/:certId/lezione/:lessonId" element={<LessonPage />} />
          <Route path="c/:certId/esercizio/:exerciseId" element={<ExercisePage />} />
          <Route path="c/:certId/domande" element={<QuestionsPage />} />
          <Route path="c/:certId/domande/sessione" element={<QuizSessionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
