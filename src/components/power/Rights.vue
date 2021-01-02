<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 用户列表展示 -->
      <el-table :data="rightList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 使用作用域插槽自定义权限等级展示方式 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'rights',
    data () {
      return {
        // 权限列表数据
        rightList: []
      }
    },
    created () {
      this.getRightList()
    },
    methods: {
      // 获取权限列表
      async getRightList() {
        const { data: result } = await this.$http.get('rights/list')
        if (result.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightList = result.data
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
