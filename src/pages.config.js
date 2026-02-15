/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Atlas from './pages/Atlas';
import BiomeArctic from './pages/BiomeArctic';
import BiomeDesert from './pages/BiomeDesert';
import BiomeOcean from './pages/BiomeOcean';
import BiomeRainforest from './pages/BiomeRainforest';
import BiomeSavanna from './pages/BiomeSavanna';
import Climate from './pages/Climate';
import Encyclopedia from './pages/Encyclopedia';
import FermeBoulangerie from './pages/FermeBoulangerie';
import FermeCentreFormation from './pages/FermeCentreFormation';
import FermePepiniere from './pages/FermePepiniere';
import FermeRoleSelection from './pages/FermeRoleSelection';
import Home from './pages/Home';
import Jeux from './pages/Jeux';
import MicroFerme from './pages/MicroFerme';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Puzzle from './pages/Puzzle';
import Quiz from './pages/Quiz';
import Recyclage from './pages/Recyclage';
import RecyclageDecheterie from './pages/RecyclageDecheterie';
import RecyclageGame from './pages/RecyclageGame';
import RecyclageKitchen from './pages/RecyclageKitchen';
import RecyclageLeaderboard from './pages/RecyclageLeaderboard';
import RecyclageMarina from './pages/RecyclageMarina';
import RecyclageParking from './pages/RecyclageParking';
import RecyclagePlage from './pages/RecyclagePlage';
import RecyclagePool from './pages/RecyclagePool';
import RecyclageReception from './pages/RecyclageReception';
import RecyclageRestaurant from './pages/RecyclageRestaurant';
import RecyclageRoleSelection from './pages/RecyclageRoleSelection';
import RecyclageRooms from './pages/RecyclageRooms';
import RecyclageSchedule from './pages/RecyclageSchedule';
import RecyclageShop from './pages/RecyclageShop';


export const PAGES = {
    "Atlas": Atlas,
    "BiomeArctic": BiomeArctic,
    "BiomeDesert": BiomeDesert,
    "BiomeOcean": BiomeOcean,
    "BiomeRainforest": BiomeRainforest,
    "BiomeSavanna": BiomeSavanna,
    "Climate": Climate,
    "Encyclopedia": Encyclopedia,
    "FermeBoulangerie": FermeBoulangerie,
    "FermeCentreFormation": FermeCentreFormation,
    "FermePepiniere": FermePepiniere,
    "FermeRoleSelection": FermeRoleSelection,
    "Home": Home,
    "Jeux": Jeux,
    "MicroFerme": MicroFerme,
    "Missions": Missions,
    "Profile": Profile,
    "Puzzle": Puzzle,
    "Quiz": Quiz,
    "Recyclage": Recyclage,
    "RecyclageDecheterie": RecyclageDecheterie,
    "RecyclageGame": RecyclageGame,
    "RecyclageKitchen": RecyclageKitchen,
    "RecyclageLeaderboard": RecyclageLeaderboard,
    "RecyclageMarina": RecyclageMarina,
    "RecyclageParking": RecyclageParking,
    "RecyclagePlage": RecyclagePlage,
    "RecyclagePool": RecyclagePool,
    "RecyclageReception": RecyclageReception,
    "RecyclageRestaurant": RecyclageRestaurant,
    "RecyclageRoleSelection": RecyclageRoleSelection,
    "RecyclageRooms": RecyclageRooms,
    "RecyclageSchedule": RecyclageSchedule,
    "RecyclageShop": RecyclageShop,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};