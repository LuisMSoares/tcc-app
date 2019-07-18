import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import SideMenu from './sideMenu';

import vPresence from './pages/vPresence';
import lsSubject from './pages/lsSubject';
import createSubject from './pages/createSubject';
import editSubject from './pages/editSubject';
import subjInfo from './pages/subjInfo';
import myAbsence from './pages/myAbsence';
import detailsAbsence from './pages/detailsAbsence';

const subjectPage = createStackNavigator({
  lsSubject,
  subjInfo,
  editSubject,
  detailsAbsence,
});

const myAbsencePage = createStackNavigator({
  myAbsence,
  detailsAbsence,
});

const drawernav = createDrawerNavigator({
    vPresence,
    subjectPage,
    subjInfo,
    myAbsencePage,
    createSubject,
  }, {
    contentComponent: SideMenu,
    drawerWidth: 250
});


export default drawernav;