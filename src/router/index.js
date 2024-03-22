import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    meta: {title: '首页', icon: 'home'},
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '仪表盘', icon: 'dashboard'}
    }
    ]
  }
]

export const asyncRouterMap = [
  {
    path:'/sys',
    component: Layout,
    redirect: '/sys/admin',
    name: 'sys',
    meta: {title: '权限', icon: 'sys'},
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/sys/admin/index'),
        meta: {title: '用户列表', icon: 'sys-admin'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/sys/role/index'),
        meta: {title: '角色列表', icon: 'sys-role'}
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/sys/role/allocMenu'),
        meta: {title: '分配菜单'},
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/sys/role/allocResource'),
        meta: {title: '分配资源'},
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/sys/menu/index'),
        meta: {title: '菜单列表', icon: 'sys-menu'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/sys/menu/add'),
        meta: {title: '添加菜单'},
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/sys/menu/update'),
        meta: {title: '修改菜单'},
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/sys/resource/index'),
        meta: {title: '资源列表', icon: 'sys-resource'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/sys/resource/categoryList'),
        meta: {title: '资源分类'},
        hidden: true
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

