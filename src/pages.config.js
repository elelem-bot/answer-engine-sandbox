import Approvals from './pages/Approvals';
import Home from './pages/Home';
import NewContent from './pages/NewContent';
import OptimizeContent from './pages/OptimizeContent';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import VisibilityHQ from './pages/VisibilityHQ';
import LandingPage from './pages/LandingPage';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Approvals": Approvals,
    "Home": Home,
    "NewContent": NewContent,
    "OptimizeContent": OptimizeContent,
    "Setup": Setup,
    "Tracking": Tracking,
    "VisibilityHQ": VisibilityHQ,
    "LandingPage": LandingPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};