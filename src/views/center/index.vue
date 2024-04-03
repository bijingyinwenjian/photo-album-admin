<template>
  <div>

  <div style="display: flex; justify-content: center;">
    <el-card>
       <div style="margin: auto; text-align: center;">
        <el-upload
          :headers="{'Authorization':token}"
          class="avatar-uploader"
          action="http://localhost:8080/admin/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <el-form
        :model="form"
        ref="form"
        label-width="120px"
        size="small"
        style="margin: auto; text-align: center;"
      >
        <el-form-item label="帐号：">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitForm()" size="small">确 定</el-button>
  </div>
</div>

</template>
<script>
  import {getAdminInfo,upload,updateAdmin} from '@/api/login.js';
  import { getToken } from '@/utils/auth';
  export default {
    data() {
      return {
        imageUrl: '',
        form:{},
        token: getToken(),
      };
    },
    created(){
      this.getInfo()
    },
    methods: {
      getInfo(){
        getAdminInfo().then( res => {
          this.form = res.data
          this.imageUrl = res.data.icon
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      submitForm(){
        updateAdmin(this.form.id,this.form).then(res => {
          if(res.code === 200){
            this.$message.success('修改成功！');
            this.getInfo()
          }else{
            this.$message.error(res.message);
          }
        })
      }
    },

  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
