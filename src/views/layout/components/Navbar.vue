<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="goCenter" style="display:block;">个人中心</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="resetPassword" style="display:block;">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="100px" ref="changePasswordForm"
                  :rules="changePasswordRules"
                         :model="changePasswordForm"
                         @submit.native.prevent>
                    <el-form-item label="旧密码" prop="password">
                        <el-input type="password"
                                  show-password
                                  ref="password"
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.password" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password"
                                  show-password
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.newPassword" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="reNewPassword">
                        <el-input type="password"
                                  show-password
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.reNewPassword" autocomplete="off"/>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doChangePassword">确 定</el-button>
            </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {updatePassword} from '@/api/login';

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    let checkReNewPassword = (rule, value, callback) => {
            if (value !== this.changePasswordForm.newPassword) {
                return callback(new Error('两次密码不一致'));
            } else {
                callback()
            }
        }
    return {
      dialogVisible:false,
      changePasswordForm: {
          password: '',
          newPassword: '',
          reNewPassword: ''
      },
      changePasswordRules: {
          password: [
              {required: true, message: '请输入旧密码', trigger: 'blur'},
              { message: '请输入旧密码', trigger: 'blur'}
          ],
          newPassword: [
              {required: true, message: '请输入新密码', trigger: 'blur'},
              { message: '请输入新密码', trigger: 'blur'}
          ],
          reNewPassword: [
              {required: true, message: '请输入确认密码', trigger: 'blur'},
              {validator: checkReNewPassword, trigger: 'blur'}
          ]
      }

    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    goCenter(){
      this.$router.push({path:'/center/center'})
    },
    resetPassword(){
      this.dialogVisible = true
    },
    doChangePassword(){
      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          var admin = {
            username: this.name,
            oldPassword: this.changePasswordForm.password,
            newPassword: this.changePasswordForm.newPassword
          }
        updatePassword(admin).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        })
    }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

