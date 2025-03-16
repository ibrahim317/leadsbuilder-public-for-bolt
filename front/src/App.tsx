import '@fontsource/poppins';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchProspects from './pages/SearchProspects';
import Lists from './pages/Lists';
import FollowUp from './pages/FollowUp';
import CRM from './pages/CRM';
import MarketingAgency from './pages/case-studies/MarketingAgency';
import B2BServices from './pages/case-studies/B2BServices';
import SaaS from './pages/case-studies/SaaS';
import Services from './pages/case-studies/Services';
import Affiliate from './pages/Affiliate';

function App() {
  return (
    <Router>
      <div className="font-poppins">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-prospects" element={<SearchProspects />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/followup" element={<FollowUp />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/case-studies/marketing" element={<MarketingAgency />} />
          <Route path="/case-studies/b2b" element={<B2BServices />} />
          <Route path="/case-studies/saas" element={<SaaS />} />
          <Route path="/case-studies/services" element={<Services />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;