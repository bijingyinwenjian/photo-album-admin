import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/album/imageCategory/list',
    method: 'get',
    params: params
  })
}

export function createCategory(data) {
  return request({
    url: '/album/imageCategory/create',
    method: 'post',
    data: data
  })
}

export function updateCategory(id, data) {
  return request({
    url: '/album/imageCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/album/imageCategory/delete/' + id,
    method: 'post'
  })
}


export function fetchAllCategoryList() {
  return request({
    url: '/album/imageCategory/listAll',
    method: 'get'
  })
}
