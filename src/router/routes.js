import Layout from '@/components/layout/Layout.vue'
import { CollectionTag, HomeFilled, Link } from '@element-plus/icons-vue'

export const homePage = '/'

export const home = {
  path: '/home',
  component: Layout,
  children: [
    {
      path: '',
      name: 'Index',
      component: () => import('@/views/home/index.vue'),
      meta: {
        key: 'home',
        title: '首页',
        icon: HomeFilled,
        closeable: false
      }
    }
  ]
}

export const routes = [
  {
    path: '/',
    redirect: '/tagview',
    meta: {
      hideInMenu: true
    }
  },
  home,
  {
    path: '/tagview',
    component: Layout,
    meta: {
      title: '多标签页',
      icon: CollectionTag
    },
    children: [
      {
        path: '',
        name: 'TagView',
        component: () => import('@/views/tagview/index.vue'),
        meta: {
          title: '多标签页',
          icon: CollectionTag
        }
      },
      {
        path: 'page1',
        name: 'TagViewPage1',
        component: () => import('@/views/tagview/page1.vue'),
        meta: {
          title: '页面1',
          hideInMenu: true
        }
      },
      {
        path: 'page2',
        name: 'TagViewPage2',
        component: () => import('@/views/tagview/page2.vue'),
        meta: {
          title: '页面2',
          hideInMenu: true
        }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Test',
        component: () => import('@/views/Test.vue'),
        meta: {
          title: '测试页面'
        },
      }
    ]
  },
  {
    path: '/link',
    name: 'Link',
    component: Layout,
    meta: {
      title: '外部链接',
      icon: Link
    },
    children: [
      {
        path: 'github',
        name: 'Github',
        meta: {
          href: 'https://github.com/Montaro2017/vue-tag-view',
          title: 'Github',
          icon: Link
        }
      },
      {
        path: 'baidu2',
        name: 'Baidu2',
        meta: {
          href: 'https://www.baidu.com/',
          title: '新标签百度',
          target: '_blank',
          icon: Link
        }
      },
      {
        path: 'vue',
        name: 'Vue',
        meta: {
          href: 'https://cn.vuejs.org/guide/quick-start.html',
          title: 'Vue文档',
          target: '_blank',
          icon: Link
        }
      }
    ]
  }
]