import AIVisibility from './pages/AIVisibility';
import AnswerEngine from './pages/AnswerEngine';
import AnswerEngineering from './pages/AnswerEngineering';
import Approvals from './pages/Approvals';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import NewContent from './pages/NewContent';
import Prompts from './pages/Prompts';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIVisibility": AIVisibility,
    "AnswerEngine": AnswerEngine,
    "AnswerEngineering": AnswerEngineering,
    "Approvals": Approvals,
    "Home": Home,
    "LandingPage": LandingPage,
    "LandingPage2": LandingPage2,
    "NewContent": NewContent,
    "Prompts": Prompts,
    "Setup": Setup,
    "Tracking": Tracking,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};