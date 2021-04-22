var routesData = [{
  name: 'dashboard',
  displayName: 'menu.dashboard',
  meta: {
    iconClass: 'vuestic-iconset vuestic-iconset-dashboard',
    authorize: ['SYS_ADMIN', 'MSO_ADMIN'],
  },
},
{
  name: 'workers',
  displayName: 'Workers',
  meta: {
    iconClass: 'fa fa-users',
    authorize: ['SYS_ADMIN'],
  },
  disabled: true,
},
{
  name: 'workinfo',
  displayName: 'INFO',
  meta: {
    iconClass: 'fa fa-circle',
    authorize: ['SYS_ADMIN'],
  },
  disabled: true,
},
// {
//   name: 'operatordetails',
//   displayName: 'Operator Details',
//   meta: {
//     iconClass: 'fa fa-users',
//     authorize: ['SYS_ADMIN'],
//   },
//   disabled: true,
// },
// {
//   name: 'upgrade',
//   displayName: 'Upgrade',
//   meta: {
//     iconClass: 'fa fa-history',
//     authorize: ['SYS_ADMIN', 'MSO_ADMIN'],
//   },
//   disabled: true,
// },
]

var navigationRoutes = {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: routesData,
}

export { navigationRoutes }
