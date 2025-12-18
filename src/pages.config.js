import Home from './pages/Home';
import Setup from './pages/Setup';
import Approvals from './pages/Approvals';
import VisibilityHQ from './pages/VisibilityHQ';
import OptimizeContent from './pages/OptimizeContent';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Setup": Setup,
    "Approvals": Approvals,
    "VisibilityHQ": VisibilityHQ,
    "OptimizeContent": OptimizeContent,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};