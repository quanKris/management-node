// 产品管理模块
// 引入express
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入user路由处理模块
const productHandler = require('../router_handle/product')

// 产品入库
router.post('/createProduct', productHandler.createProduct)
// 删除产品
router.post('/deleteProduct', productHandler.deleteProduct)
// 编辑产品信息
router.post('/editProduct', productHandler.editProduct)
// 获取产品列表
router.post('/getProductList', productHandler.getProductList)
// 产品申请出库
router.post('/applyOutProduct', productHandler.applyOutProduct)
// 产品审核列表
router.post('/applyProductList', productHandler.applyProductList)
// 对产品进行撤回申请
router.post('/withdrawApplyProduct', productHandler.withdrawApplyProduct)
// 产品审核
router.post('/auditProduct', productHandler.auditProduct)
// 通过入库编号对产品进行搜索
router.post('/searchProductForId', productHandler.searchProductForId)
// 通过出库申请编号对产品进行搜索
router.post('/searchProductForApplyId', productHandler.searchProductForApplyId)
// 通过出库编号对产品进行搜索
router.post('/searchProductForOutId', productHandler.searchProductForOutId)
// 获取产品总数
router.post('/getProductLength', productHandler.getProductLength)
// 获取申请出库产品总数
router.post('/getApplyProductLength', productHandler.getApplyProductLength)
// 出库产品列表
router.post('/auditProductList', productHandler.auditProductList)
// 获取出库产品总数
router.post('/getOutProductLength', productHandler.getOutProductLength)
// 监听换页返回数据  产品页面
router.post('/returnProductListData', productHandler.returnProductListData)
// 监听换页返回数据  申请出库页面
router.post('/returnApplyProductListData', productHandler.returnApplyProductListData)
// 监听换页返回数据  申请出库页面
router.post('/returnOutProductListData', productHandler.returnOutProductListData)

module.exports = router