<template> 
  <div class="app-container">
    <el-button type="primary" id="uploadButton" round @click="uploadDialogVisible = true">
            上传<i class="el-icon-upload el-icon--right"/>
    </el-button>
    <el-button type="info" round @click="downloadFile">
            下载<i class="el-icon-download el-icon--right"/>
        </el-button>
        <el-button type="danger" round @click="deleteFile">
            删除<i class="el-icon-delete el-icon--right"/>
        </el-button>
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="类型搜索：">
            <el-select v-model="listQuery.categoryId" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="照片名称搜索：">
            <el-input v-model="listQuery.imageName" class="input-width" placeholder="照片名称名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                tooltip-effect="dark"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" 
                @selection-change="handleSelectionChange"
                border>
          <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <div @click="clickFilename(scope.row)" class="file-name-content">
              <i style="margin-right: 15px; font-size: 20px; cursor: pointer;"/>
                <span style="cursor:pointer;">{{ scope.row.imageName }}</span>
            </div>
           </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="上传者" width="100" align="center">
          <template slot-scope="scope">{{scope.row.uploadName}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="描述" width="100" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column label="是否审核" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :disabled="name !== 'admin'"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="primary"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="primary"
                       type="text"
                       @click="handleShare(scope.$index, scope.row)">
              分享
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑图片信息':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="image"
               label-width="150px" size="small">
        <el-form-item label="帐号：">
          <el-input v-model="image.imageName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
            <el-select v-model="image.categoryId" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="image.remark"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

            <el-dialog
                    title="文件上传"
                    :visible.sync="uploadDialogVisible"
                    :modal="false"
                    :append-to-body="true"
                    center
                    >
                    <el-upload
                      ref="upload"
                      :on-success="uploadSuccess"
                      class="upload-demo"
                      drag
                      :headers="{'Authorization':token}"
                      action="http://localhost:8080/album/image/upload"
                      accept=".jpg,.png"
                      :before-upload="beforeUpload"
                      multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
            </el-dialog>

              <el-image-viewer
                class="el-image-viewer"
                v-if="showImage"
                :on-close="closeShowViewer"
                :url-list="srcList"/>

                <el-dialog
                :title="shareTitle"
                :visible.sync="shareDialogVisible"
                @closed="resetForm('shareForm')"
                width="80%"
                :append-to-body=true
                :modal-append-to-body=false
                :center=true>
            <div>
                <div>
                    <el-form label-width="100px"
                             status-icon
                             @submit.native.prevent>
                        <el-form-item label="分享链接" prop="shareUrl">
                            <el-link :underline=false type="primary"><span>{{ shareResultForm.shareUrl }}</span>
                            </el-link>
                        </el-form-item>
                          <div style="display: flex; float: right;">
                              <el-button type="primary" class="share-result-copy-button" @click="copy">
                                  点击复制<i class="el-icon-document-copy el-icon--right"></i>
                              </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="shareDialogVisible = false" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
  import {fetchList,fetchAllCategoryList,updateImage,deleteImage,updateImageStatus} from '@/api/image';
  import {formatDate} from '@/utils/date';
  import { getToken } from '@/utils/auth';
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
  import { mapGetters } from 'vuex'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    iamgeName: '',
    categoryId: '',
  };
  const defaultImage = {
    id: null,
    categoryId: null,
    imageName: null,
    storePath: null,
    suffix: null,
    uploadId: null,
    uploadName: null,
    createTime: null,
    remark: null,
    status: null,
    isDeleted: null,
  };
  export default {
    name: 'imageList',
    components: {ElImageViewer},
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    data() {
      return {
        showImage: false,
        srcList: [],
        token: getToken(),
        uploadDialogVisible: false,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        image: Object.assign({}, defaultImage),
        isEdit: false,
        multipleSelection: [],
        categoryList: [],
        shareDialogVisible: false,
        loading: false,
        step: 1,
        shareFileForm: {
            shareName: '',
        },
        shareFileRules: {
            shareName: [
                {required: true, message: '请输入分享名称', trigger: 'blur'}
            ]
        },
        shareTitle: '',
        shareResultForm: {
            shareUrl: '',
        }
      }
    },
    created() {
      this.getList();
      this.getCategoryList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      resetForm(refName) {
          this.shareTitle = ''
          this.shareResultForm = {
              shareUrl: '',
              shareCode: ''
          }
      },
      copy(){
        let shareMessage = this.shareResultForm.shareUrl
        this.$copyText(shareMessage)
        this.$message.success('复制成功')
      },
      handleShare(index, row){
        this.shareDialogVisible = true
        this.shareResultForm.shareUrl = row.storePath
      },
      deleteFile(){
        var ids = this.multipleSelection.map(it => it.id)
        console.log(ids);
        this.$confirm('是否要删除照片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteImage(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      downloadFile(){
        if ( this.multipleSelection.length === 0) {
          this.$message.error('请选择要下载的文件')
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
            const element = this.multipleSelection[i];
            console.log(element);
            window.open(element.storePath, '_blank'); // 新开窗口下载
        }
      },
      uploadSuccess(response, file, fileList){
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      closeShowViewer() {
        this.showImage = false
      },
      clickFilename(row){
        this.srcList = [row.storePath]
        this.showImage = true
      },
      beforeUpload(file){
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
        const whiteList = ["png", "jpg", "jpeg"];
        if (whiteList.indexOf(fileSuffix) === -1) {
          this.$message.error('上传文件只能是 "png", "jpg", "jpeg"格式');
          return false;
        }
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateImageStatus(row.id, {status: row.status}).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.image = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateImage(this.image.id,this.image).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getCategoryList(){
        fetchAllCategoryList().then(response => {
          this.categoryList = response.data
        })
      },
    }
  }
</script>
<style></style>


