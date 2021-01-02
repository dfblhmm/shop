<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      </el-row>
      <!-- 角色列表区域 -->
      <!-- 角色列表展示 -->
      <el-table :data="roleList" style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格布局 -->
            <el-row v-for="(item1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row v-for="item2 in item1.children" :key="item2.id" class="bottom">
                  <el-col :span="6" >
                    <el-tag type="success" closable @close="removeRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18" class="three">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"
                      closable @close="removeRight(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle @click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <!-- 添加角色用户表单 -->
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="editDialogVisible" width="40%" @close="editDialogClose">
      <!-- 内容主体区域 -->
      <!-- 添加修改角色表单 -->
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色权限对话框 -->
    <el-dialog title="修改角色权限" :visible.sync="setRightDialogVisible" width="40%">
      <!-- 内容主体区域 -->
      <!-- 树形控件 -->
      <el-tree :data="rightList" show-checkbox default-expand-all node-key="id" ref="tree"
        highlight-current :props="treeProps" :default-checked-keys="defaultKeys">
      </el-tree>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'roles',
    data() {
      return {
        // 角色列表数据
        roleList: [],
        // 添加角色数据表单
        addForm: {
          roleName: '',
          roleDesc: ''
        },
        // 查询到的用户信息
        editForm: {},
        // 控制添加角色对话框的显示/隐藏
        addDialogVisible: false,
        // 控制修改角色对话框的显示/隐藏
        editDialogVisible: false,
        // 控制设置权限对话框的显示/隐藏
        setRightDialogVisible: false,
        // 所有权限的数据列表
        rightList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        roleId: '',
        // 默认选中的节点的id值数组
        defaultKeys: [],
        // 验证规则
        formRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getRoleList()
    },
    methods: {
      // 获取角色列表数据
      async getRoleList() {
        const { data: result } = await this.$http.get('roles')
        if (result.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.roleList = result.data
      },
      // 添加角色
      addRole() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          // 发起网络请求，添加新角色
          const { data: result } = await this.$http.post('roles', this.addForm)
          if (result.meta.status !== 201) return this.$message.error('添加角色失败')
          // 关闭添加角色对话框
          this.addDialogVisible = false
          this.$message.success('添加角色成功')
          // 重新获取角色列表
          this.getRoleList()
        })
      },
      // 添加角色对话框关闭重置验证
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      // 修改角色对话框关闭重置验证
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      // 显示修改角色对话框,查询角色数据
      async showEditDialog(id) {
        this.editDialogVisible = true
        const { data: result } = await this.$http.get(`roles/${id}`)
        if (result.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = result.data
      },
      editRole() {
        this.$refs.editFormRef.validate(async valid => {
          // 表单预验证不通过
          if (!valid) return
          // 发起网络请求，更新角色信息
          const { data: result } = await this.$http.put(`roles/${this.editForm.roleId}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          if (result.meta.status !== 200) return this.$message.error('更新用户信息失败')
          this.editDialogVisible = false // 关闭对话框
          this.$message.success('更新用户信息成功')
          // 更新用户列表
          this.getRoleList()
        })
      },
      // 删除角色
      async deleteUser(id) {
        const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).catch(err => err)
        // 如果用户点击了确定，则返回字符串 confirm
        // 如果用户点击了确定，则返回字符串 cancel
        if (result !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        // 更新用户列表
        this.getRoleList()
      },
      // 根据id删除权限
      async removeRight(role, rightId) {
        const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).catch(err => err)
        // 如果用户点击了确定，则返回字符串 confirm
        // 如果用户点击了确定，则返回字符串 cancel
        if (result !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败')
        this.$message.success('删除权限成功')
        // 更新权限
        role.children = res.data
      },
      // 弹出角色权限对话框
      async showSetRightDialog(role) {
        // 获取角色id
        this.roleId = role.id
        // 获取所有权限的数据
        const { data: result } = await this.$http.get('rights/tree')
        if (result.meta.status !== 200) return this.$message.error('获取权限信息失败')
        this.rightList = result.data
        // 递归获取三级权限
        this.defaultKeys = [] // 先清空默认权限数组
        this.getThreeRight(role, this.defaultKeys)
        this.setRightDialogVisible = true
      },
      // 获取当前角色的所有三级权限数据
      getThreeRight(node, arr) {
        if (!node.children) return arr.push(node.id)
        // 递归获取三级权限
        node.children.forEach(value => this.getThreeRight(value, arr))
      },
      // 分配权限
      async setRights() {
        // 获取全选状态的权限的id值
        const keys = this.$refs.tree.getCheckedKeys()
        // 获取半选状态的权限的id值
        const halfKeys = this.$refs.tree.getHalfCheckedKeys()
        const allKeys = [...keys, ...halfKeys]
        const rids = allKeys.join(',')
        const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
        if (result.meta.status !== 200) return this.$message.error('分配权限失败')
        this.$message.success('分配权限成功')
        this.getRoleList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }
  .el-row {
    margin: 10px;
    border-bottom: 1px solid #eee;
  }
  .el-tag {
    margin: 4px 8px;
  }
  .bottom:last-of-type {
    border-bottom: 0;
  }
  .el-row {
    display: flex;
    align-items: center;
  }
</style>
