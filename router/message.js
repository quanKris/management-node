// 信息管理模块
// 引入express
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入message路由处理模块
const messageHandler = require('../router_handle/message')

// 发布消息
router.post('/publishMessage', messageHandler.publishMessage)
// 获取公司公告列表
router.post('/companyMessageList', messageHandler.companyMessageList)
// 获取系统消息列表
router.post('/systemMessageList', messageHandler.systemMessageList)
// 编辑公告
router.post('/editMessage', messageHandler.editMessage)
// 根据发布部门进行搜索消息
router.post('/searchMessageBydepartment', messageHandler.searchMessageBydepartment)
// 根据发布等级进行获取消息
router.post('/searchMessageByLevel', messageHandler.searchMessageByLevel)
// 获取公告/系统消息
router.post('/getMessage', messageHandler.getMessage)
// 更新点击率
router.post('/updateClick', messageHandler.updateClick)
// 初次删除
router.post('/firstDelete', messageHandler.firstDelete)
// 获取回收站的列表
router.post('/recycleList', messageHandler.recycleList)
// 获取回收站总数
router.post('/getRecycleMessageLength', messageHandler.getRecycleMessageLength)
// 回收站监听换页
router.post('/returnRecycleListData', messageHandler.returnRecycleListData)

// 还原操作
router.post('/recover', messageHandler.recover)
// 删除操作
router.post('/deleteMessage', messageHandler.deleteMessage)
// 获取公司公告总数
router.post('/getCompanyMessageLength', messageHandler.getCompanyMessageLength)
// 获取系统消息总数
router.post('/getSystemMessageLength', messageHandler.getSystemMessageLength)
// 监听换页返回数据  公司公告列表
router.post('/returnCompanyListData', messageHandler.returnCompanyListData)
// 监听换页返回数据  系统消息列表
router.post('/returnSystemListData', messageHandler.returnSystemListData)

module.exports = router