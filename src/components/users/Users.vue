<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加功能 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryUsers.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="#" style="width: 5%"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="身份"></el-table-column>
        <el-table-column label="状态" style="width: 10%">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- layout 选择要展示的功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryUsers.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryUsers.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <!-- 添加用户表单 -->
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%" @close="editDialogClose">
      <!-- 内容主体区域 -->
      <!-- 添加用户表单 -->
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'users',
    data () {
      // 自定义校验规则
      // 验证邮箱
      const checkEmail = (rule, value, callback) => {
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (!regEmail.test(value)) return callback(new Error('请输入合法的邮箱'))
        // 验证通过
        callback()
      }
      // 验证手机号
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (!regMobile.test(value)) return callback(new Error('请输入正确的手机号'))
        callback()
      }
      return {
        queryUsers: {
          query: '',
          pagenum: 1, // 当前页数
          pagesize: 10 // 当前每页显示多少数据
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框显示/隐藏
        addDialogVisible: false,
        // 控制修改用户对话框显示/隐藏
        editDialogVisible: false,
        // 添加用户表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 查询到的用户信息
        editForm: {},
        // 验证规则
        formRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { data: result } = await this.$http.get('users', { params: this.queryUsers })
        if (result.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.userList = result.data.users
        this.total = result.data.total
      },
      // pagesize发生变化
      handleSizeChange(newPageSize) {
        this.queryUsers.pagesize = newPageSize
        this.getUserList()
      },
      // 当前页码数发生变化
      handleCurrentChange(currentPage) {
        this.queryUsers.pagenum = currentPage
        this.getUserList()
      },
      // 用户状态修改
      async statusChange(user) {
        const { data: result } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        if (result.meta.status !== 200) {
          // 修改失败，恢复用户状态
          user.mg_state = !user.mg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
      },
      // 添加用户对话框关闭重置校验
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加新用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          // 表单预验证不通过
          if (!valid) return
          // 发起网络请求，添加新用户
          const { data: result } = await this.$http.post('users', this.addForm)
          if (result.meta.status !== 201) return this.$message.error('添加用户失败')
          this.addDialogVisible = false // 关闭对话框
          this.$message.success('添加用户成功')
          // 更新用户列表
          this.getUserList()
        })
      },
      // 显示修改用户对话框
      async showEditDialog(id) {
        this.editDialogVisible = true
        const { data: result } = await this.$http.get(`users/${id}`)
        if (result.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = result.data
      },
      // 修改用户
      editUser() {
        this.$refs.editFormRef.validate(async valid => {
          // 表单预验证不通过
          if (!valid) return
          // 发起网络请求，添加新用户
          const { data: result } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (result.meta.status !== 200) return this.$message.error('更新用户信息失败')
          this.editDialogVisible = false // 关闭对话框
          this.$message.success('更新用户信息成功')
          // 更新用户列表
          this.getUserList()
        })
      },
      // 修改用户对话框关闭重置校验
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      // 删除用户
      async deleteUser(id) {
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).catch(err => err)
        // 如果用户点击了确定，则返回字符串 confirm
        // 如果用户点击了确定，则返回字符串 cancel
        if (result !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        // 更新用户列表
        this.getUserList()
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-table {
    margin: 15px 0 15px;
    .el-table-column {
      width: 16%;
    }
  }
</style>
