<template>
  <div class="container">
    <div class="login">
      <!-- logo区域 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :model="form" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" show-password v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        // 登录表单的数据对象
        form: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 重置表单
      reset() {
        this.$refs.loginFormRef.resetFields()
      },
      // 登录前预验证
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return // 验证不通过
          // 将服务器返回的数据解构出来
          const { data: result } = await this.$http.post('login', this.form)
          console.log(result)
          if (result.meta.status !== 200) return this.$message.error('用户名不存在，请重新登录')
          this.$message.success('登录成功')
          // 将服务器端发来的token保存到sessionStorage
          window.sessionStorage.setItem('token', result.data.token)
          // 跳转至后台主页
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang = "less" scoped>
  .container {
    background-color: #2b4b6b;
    height: 100%;
    position: relative;

    .login {
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 1px solid #ddd;
        padding: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .2);
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
          width: 100%;
          border-radius: 50%;
          background-color: #ccc;
        }
      }
    }

    .login-form {
      position: absolute;
      bottom: 0;
      width: 90%;
      padding: 0 20px;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
