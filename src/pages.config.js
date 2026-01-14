import AIVisibility from './pages/AIVisibility';
import AnswerEngine from './pages/AnswerEngine';
import AnswerEnginePro from './pages/AnswerEnginePro';
import AnswerEngineering from './pages/AnswerEngineering';
import Approvals from './pages/Approvals';
import Home from './pages/Home';
import NewContent from './pages/NewContent';
import Prompts from './pages/Prompts';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIVisibility": AIVisibility,
    "AnswerEngine": AnswerEngine,
    "AnswerEnginePro": AnswerEnginePro,
    "AnswerEngineering": AnswerEngineering,
    "Approvals": Approvals,
    "Home": Home,
    "NewContent": NewContent,
    "Prompts": Prompts,
    "Setup": Setup,
    "Tracking": Tracking,
}

export const pagesConfig = {
    mainPage: "Setup",
    Pages: PAGES,
    Layout: __Layout,
};