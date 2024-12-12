import appsAndPages from './apps-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import others from './others'
import uiElements from './ui-elements'


import events from './events'

import type { VerticalNavItems } from '@layouts/types'

//export default [...dashboard, ...appsAndPages, ...uiElements, ...forms, ...charts, ...others] as VerticalNavItems
export default [...dashboard, ...events, ...appsAndPages, ...uiElements, ...forms, ...charts, ...others] as VerticalNavItems
