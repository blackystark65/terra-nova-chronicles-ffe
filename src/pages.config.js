import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Climate from './pages/Climate';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Encyclopedia from './pages/Encyclopedia';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Climate": Climate,
    "Home": Home,
    "Missions": Missions,
    "Profile": Profile,
    "Encyclopedia": Encyclopedia,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};