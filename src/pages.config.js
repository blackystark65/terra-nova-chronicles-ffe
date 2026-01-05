import Atlas from './pages/Atlas';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import Climate from './pages/Climate';
import Encyclopedia from './pages/Encyclopedia';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Profile from './pages/Profile';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "Climate": Climate,
    "Encyclopedia": Encyclopedia,
    "Home": Home,
    "Missions": Missions,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};