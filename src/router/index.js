import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../components/login.vue')
const Home = () => import('../components/home.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // to表示要访问的路径
  // from 表示从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()表示直接放行，next('/login')表示强制跳转到指定路径
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  // token 不存在则跳转到登录页
  if (!token) return next('/login')
  next()
})

export default router
