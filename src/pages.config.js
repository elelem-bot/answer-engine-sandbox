import Analytics from './pages/Analytics';
import AnswerEngine from './pages/AnswerEngine';
import AnswerEngineering from './pages/AnswerEngineering';
import AnswerVisibility from './pages/AnswerVisibility';
import Approvals from './pages/Approvals';
import Home from './pages/Home';
import NewContent from './pages/NewContent';
import Prompts from './pages/Prompts';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import PromptResearch from './pages/PromptResearch';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "AnswerEngine": AnswerEngine,
    "AnswerEngineering": AnswerEngineering,
    "AnswerVisibility": AnswerVisibility,
    "Approvals": Approvals,
    "Home": Home,
    "NewContent": NewContent,
    "Prompts": Prompts,
    "Setup": Setup,
    "Tracking": Tracking,
    "PromptResearch": PromptResearch,
}

export const pagesConfig = {
    mainPage: "Setup",
    Pages: PAGES,
    Layout: __Layout,
};