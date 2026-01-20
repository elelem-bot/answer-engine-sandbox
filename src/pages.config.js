import Analytics from './pages/Analytics';
import AnswerEngine from './pages/AnswerEngine';
import AnswerEngineering from './pages/AnswerEngineering';
import AnswerVisibility from './pages/AnswerVisibility';
import Approvals from './pages/Approvals';
import Home from './pages/Home';
import NewContent from './pages/NewContent';
import PromptResearch from './pages/PromptResearch';
import Prompts from './pages/Prompts';
import Setup from './pages/Setup';
import Tracking from './pages/Tracking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "AnswerEngine": AnswerEngine,
    "AnswerEngineering": AnswerEngineering,
    "AnswerVisibility": AnswerVisibility,
    "Approvals": Approvals,
    "Home": Home,
    "NewContent": NewContent,
    "PromptResearch": PromptResearch,
    "Prompts": Prompts,
    "Setup": Setup,
    "Tracking": Tracking,
}

export const pagesConfig = {
    mainPage: "Setup",
    Pages: PAGES,
    Layout: __Layout,
};