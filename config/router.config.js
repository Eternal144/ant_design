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
          //这个是添加表单
          // {
          //   path: '/score/info',
          //   name: 'basicform',
          //   component: './Forms/BasicForm',
          // },
          {
            path: '/score/info',
            name: 'basicform',
            component: './List/TableList',
          },
            // hideChildrenInMenu: true,
            // routes: [
            //   {
            //     path: '/form/step-form',
            //     redirect: '/form/step-form/info',
            //   },
            //   {
            //     path: '/form/step-form/info',
            //     name: 'info',
            //     component: './Forms/StepForm/Step1',
            //   },
            //   {
            //     path: '/form/step-form/confirm',
            //     name: 'confirm',
            //     component: './Forms/StepForm/Step2',
            //   },
            //   {
            //     path: '/form/step-form/result',
            //     name: 'result',
            //     component: './Forms/StepForm/Step3',
            //   },
            // ],
 
          {
            path: '/score/addinfo',
            name: 'advancedform',
            authority: ['admin'],
            component: './Dashboard/Analysis',
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
            path: '/course/add',
            name: 'advanced',
            //hideInMenu: true,
            component: './Forms/CourseBasicForm',
          },
          // {
          //   path: '/profile/advanced',
          //   name: 'advanced',
          //   authority: ['admin'],
          //   component: './Profile/AdvancedProfile',
          // },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
