import Approvals from './pages/Approvals';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import NewContent from './pages/NewContent';
import OptimizeContent from './pages/OptimizeContent';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import VisibilityHQ from './pages/VisibilityHQ';
import CustomerVisibility from './pages/CustomerVisibility';
import AgentVisibility from './pages/AgentVisibility';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Approvals": Approvals,
    "Home": Home,
    "LandingPage": LandingPage,
    "LandingPage2": LandingPage2,
    "NewContent": NewContent,
    "OptimizeContent": OptimizeContent,
    "Setup": Setup,
    "Tracking": Tracking,
    "VisibilityHQ": VisibilityHQ,
    "CustomerVisibility": CustomerVisibility,
    "AgentVisibility": AgentVisibility,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};