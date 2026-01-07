import AnswerEngine from './pages/AnswerEngine';
import Approvals from './pages/Approvals';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import NewContent from './pages/NewContent';
import Prompts from './pages/Prompts';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import AIVisibility from './pages/AIVisibility';
import AnswerEngineering from './pages/AnswerEngineering';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AnswerEngine": AnswerEngine,
    "Approvals": Approvals,
    "Home": Home,
    "LandingPage": LandingPage,
    "LandingPage2": LandingPage2,
    "NewContent": NewContent,
    "Prompts": Prompts,
    "Setup": Setup,
    "Tracking": Tracking,
    "AIVisibility": AIVisibility,
    "AnswerEngineering": AnswerEngineering,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};