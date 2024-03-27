// 系统设置模块路由
// 导入express框架
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入set的路由处理模块
const setHandler = require('../router_handle/setting')
const multer = require("multer");
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({
	dest: './public/upload'
})

// 上传轮播图
router.post('/uploadSwiper', upload.single('swiper'), setHandler.uploadSwiper)
// 获取所有轮播图
router.post('/getAllSwiper', setHandler.getAllSwiper)
// 获取公司名称
router.post('/getCompanyName', setHandler.getCompanyName)
// 改变公司名称
router.post('/changeCompanyName', setHandler.changeCompanyName)
// 编辑公司介绍的接口
router.post('/changeCompanyIntroduce', setHandler.changeCompanyIntroduce)
// 获取公司介绍
router.post('/getCompanyIntroduce', setHandler.getCompanyIntroduce)
// 获取所有公司信息
router.post('/getAllCompanyIntroduce', setHandler.getAllCompanyIntroduce)
// 部门设置
router.post('/setDepartment', setHandler.setDepartment)
// 获取部门
router.post('/getDepartment', setHandler.getDepartment)
// 产品设置
router.post('/setProduct', setHandler.setProduct)
// 获取产品
router.post('/getProduct', setHandler.getProduct)

// 向外暴露路由
module.exports = router