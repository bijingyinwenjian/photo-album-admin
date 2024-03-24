import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/album/image/list',
    method: 'get',
    params: params
  })
}

export function updateImage(id, data) {
  return request({
    url: '/album/image/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteImage(data) {
  return request({
    url: '/album/image/delete',
    method: 'post',
    data: data
  })
}

export function updateImageStatus(id,params) {
  return request({
    url: '/album/image/updateStatus/'+id,
    method: 'post',
    params: params
  })
}

export function fetchAllCategoryList() {
  return request({
    url: '/album/imageCategory/listAll',
    method: 'get'
  })
}

export function fetchRecycleList(params) {
  return request({
    url: '/album/image/recycle/list',
    method: 'get',
    params: params
  })
}

export function revertDelete(data) {
  return request({
    url: '/album/image/recycle/revert',
    method: 'post',
    data: data
  })
}

export function recycleDelete() {
  return request({
    url: '/album/image/recycle/delete',
    method: 'get',
  })
}
