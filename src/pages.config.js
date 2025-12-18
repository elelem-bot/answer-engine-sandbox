import Home from './pages/Home';
import Setup from './pages/Setup';
import Approvals from './pages/Approvals';
import VisibilityHQ from './pages/VisibilityHQ';
import OptimizeContent from './pages/OptimizeContent';
import NewContent from './pages/NewContent';
import Tracking from './pages/Tracking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Setup": Setup,
    "Approvals": Approvals,
    "VisibilityHQ": VisibilityHQ,
    "OptimizeContent": OptimizeContent,
    "NewContent": NewContent,
    "Tracking": Tracking,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};