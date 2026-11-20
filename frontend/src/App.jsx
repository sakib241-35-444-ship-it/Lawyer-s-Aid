import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import LawSearch from './pages/LawSearch.jsx';
import FindLawyers from './pages/FindLawyers.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Cases from './pages/Cases.jsx';
import CaseForm from './pages/CaseForm.jsx';
import CaseDetails from './pages/CaseDetails.jsx';
import CaseHistory from './pages/CaseHistory.jsx';
import Timeline from './pages/Timeline.jsx';
import Notifications from './pages/Notifications.jsx';

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/laws" element={<LawSearch />} />
          <Route path="/find-lawyers" element={<FindLawyers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* lawyers only */}
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/profile" element={<P><Profile /></P>} />
          <Route path="/cases" element={<P><Cases /></P>} />
          <Route path="/cases/new" element={<P><CaseForm /></P>} />
          <Route path="/cases/:id" element={<P><CaseDetails /></P>} />
          <Route path="/cases/:id/edit" element={<P><CaseForm /></P>} />
          <Route path="/history" element={<P><CaseHistory /></P>} />
          <Route path="/timeline" element={<P><Timeline /></P>} />
          <Route path="/notifications" element={<P><Notifications /></P>} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <footer className="footer">
        Lawyer's Aid gives general legal information only, not legal advice. Please consult a qualified lawyer.
      </footer>
    </>
  );
}
