import Atlas from './pages/Atlas';
import BiomeArctic from './pages/BiomeArctic';
import BiomeDesert from './pages/BiomeDesert';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import BiomeSavanna from './pages/BiomeSavanna';
import Climate from './pages/Climate';
import Encyclopedia from './pages/Encyclopedia';
import Home from './pages/Home';
import Jeux from './pages/Jeux';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Puzzle from './pages/Puzzle';
import Quiz from './pages/Quiz';
import Recyclage from './pages/Recyclage';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeArctic": BiomeArctic,
    "BiomeDesert": BiomeDesert,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "BiomeSavanna": BiomeSavanna,
    "Climate": Climate,
    "Encyclopedia": Encyclopedia,
    "Home": Home,
    "Jeux": Jeux,
    "Missions": Missions,
    "Profile": Profile,
    "Puzzle": Puzzle,
    "Quiz": Quiz,
    "Recyclage": Recyclage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};