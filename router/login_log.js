// 登录日志模块
// 引入express
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入file路由处理模块
const loginLogHandler = require('../router_handle/login_log.js')


// 登录记录
router.post('/loginLog', loginLogHandler.loginLog)
// 返回登录日志列表
router.post('/loginLogList', loginLogHandler.loginLogList)
// 搜索最近十条登录记录
router.post('/searchLoginLogList', loginLogHandler.searchLoginLogList)
// 返回登录日志列表的长度
router.post('/loginLogListLength', loginLogHandler.loginLogListLength)
// 监听换页返回数据
router.post('/returnLoginListData', loginLogHandler.returnLoginListData)
// 清空登录日志
router.post('/clearLoginLogList', loginLogHandler.clearLoginLogList)

module.exports = router