import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Profile from './pages/Profile';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Home": Home,
    "Missions": Missions,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};