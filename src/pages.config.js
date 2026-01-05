import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Climate from './pages/Climate';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Home": Home,
    "Missions": Missions,
    "Profile": Profile,
    "Climate": Climate,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};