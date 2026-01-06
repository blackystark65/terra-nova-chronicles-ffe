import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Climate from './pages/Climate';
import Encyclopedia from './pages/Encyclopedia';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Climate": Climate,
    "Encyclopedia": Encyclopedia,
    "Home": Home,
    "Missions": Missions,
    "Profile": Profile,
    "Quiz": Quiz,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};