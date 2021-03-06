export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/stuslls/info', authority: ['admin', 'user'] },
      {
        path: '/stuslls',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/stuslls/info',
            name: 'analysis',
            component: './Forms/Record/RecordForm',
          },
          {
            path: '/stuslls/pick',
            name: 'monitor',
            component: './List/TableList',
          },
        ],
      },
      // forms
      {
        path: '/score',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/score/info',
            name: 'basicform',
            component: './Forms/Score/ScoreForm',
          },
          {
            path: '/score/addinfo',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/Student/ClassAnalysis',
          },
        ],
      },
      // list

      {
        path: '/student',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/student/info',
            name: 'searchtable',
            component: './Forms/Student/StudentForm',
          },
          {
            path: '/student/add',
            name: 'basiclist',
            component: './Forms/StudentBasicForm',
          },

        ],
      },

      ///profile/basic/:id
      {
        path: '/course',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/course/info',
            name: 'basic',
            component: './Forms/Course/CourseForm',
          },
          {
            path: '/course/insert',
            name: 'advanced',
            //hideInMenu: true,
            component: './Forms/CourseBasicForm',
          },
          {
            path: '/course/advanced',
            name: 'spread',
            component: './Forms/Course/CourseAnalysis',
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
