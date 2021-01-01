<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠菜单栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened
          :collapse="isCollapse" :collapse-transition="false" router>
          <!-- 用户管理 -->
          <el-submenu :index="item.id.toString()" v-for="(item,index) in menulist" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconlist[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="value in item.children" :key="value.id" :index="'/' + value.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{value.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        // 左侧菜单数据
        menulist: [],
        iconlist: ['el-icon-user-solid', 'el-icon-lock', 'el-icon-goods', 'el-icon-s-claim', 'el-icon-s-platform'],
        isCollapse: false
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      // 退出登录
      exit() {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      },
      // 获取菜单数据
      async getMenuList() {
        const { data: result } = await this.$http('menus')
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.menulist = result.data
      },
      // 折叠与展开菜单栏
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 25px;
    color: #fff;
    .logo {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border: 0
    }
    .toggle-button {
      background-color: #4a5064;
      color: #fff;
      font-size: 14px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      letter-spacing: .2em;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

</style>
