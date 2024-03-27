// 操作日志模块
// 引入express
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入file路由处理模块
const operationLogHandler = require('../router_handle/operation_log.js')


// 操作记录
router.post('/operationLog', operationLogHandler.operationLog)
// 返回操作日志列表
router.post('/operationLogList', operationLogHandler.operationLogList)
// 搜索最近十条操作记录
router.post('/searchOperationLogList', operationLogHandler.searchOperationLogList)
// 返回操作日志列表的长度
router.post('/operationLogListLength', operationLogHandler.operationLogListLength)
// 监听换页返回数据
router.post('/returnOperationListData', operationLogHandler.returnOperationListData)
// 清空操作日志
router.post('/clearOperationLogList', operationLogHandler.clearOperationLogList)

module.exports = router