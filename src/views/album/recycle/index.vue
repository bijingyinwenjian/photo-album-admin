<template> 
  <div class="app-container">

    <el-button type="success" round @click="revertFile">
            还原文件<i class="el-icon-refresh-left"/>
        </el-button>
        <el-button type="danger" round @click="deleteFile">
            清空回收站<i class="el-icon-delete el-icon--right"/>
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
              :disabled="true"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
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
              <el-image-viewer
                class="el-image-viewer"
                v-if="showImage"
                :on-close="closeShowViewer"
                :url-list="srcList"/>
  </div>
</template>
<script>
  import {fetchAllCategoryList,fetchRecycleList,revertDelete,recycleDelete} from '@/api/image';
  import {formatDate} from '@/utils/date';
  import { getToken } from '@/utils/auth';
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

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
    name: 'recycleList',
    components: {ElImageViewer},
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
      revertFile(){
        var ids = this.multipleSelection.map(it => it.id)
        console.log(ids);
        this.$confirm('是否要还原照片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revertDelete(ids).then(response => {
            this.$message({
              type: 'success',
              message: '还原成功!'
            });
            this.getList();
          });
        });
      },
      deleteFile(){
        this.$confirm('是否要彻底删除照片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recycleDelete().then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      closeShowViewer() {
        this.showImage = false
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
      getList() {
        this.listLoading = true;
        fetchRecycleList(this.listQuery).then(response => {
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


