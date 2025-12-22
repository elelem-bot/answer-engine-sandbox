import AgentVisibility from './pages/AgentVisibility';
import Approvals from './pages/Approvals';
import CustomerVisibility from './pages/CustomerVisibility';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import NewContent from './pages/NewContent';
import OptimizeContent from './pages/OptimizeContent';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import VisibilityHQ from './pages/VisibilityHQ';
import Prompts from './pages/Prompts';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AgentVisibility": AgentVisibility,
    "Approvals": Approvals,
    "CustomerVisibility": CustomerVisibility,
    "Home": Home,
    "LandingPage": LandingPage,
    "LandingPage2": LandingPage2,
    "NewContent": NewContent,
    "OptimizeContent": OptimizeContent,
    "Setup": Setup,
    "Tracking": Tracking,
    "VisibilityHQ": VisibilityHQ,
    "Prompts": Prompts,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};