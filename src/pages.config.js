import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Climate from './pages/Climate';
import Encyclopedia from './pages/Encyclopedia';
import Home from './pages/Home';
import Jeux from './pages/Jeux';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Puzzle from './pages/Puzzle';
import Quiz from './pages/Quiz';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Climate": Climate,
    "Encyclopedia": Encyclopedia,
    "Home": Home,
    "Jeux": Jeux,
    "Missions": Missions,
    "Profile": Profile,
    "Puzzle": Puzzle,
    "Quiz": Quiz,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};