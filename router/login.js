// 登录注册模块路由
// 导入express框架
const express = require('express')
const Joi = require('joi')
// 使用express框架的路由
const router = express.Router()
// 导入login的路由处理模块
const loginHandler = require('../router_handle/login')
// 导入expreJoi
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const {
	login_limit
} = require('../limit/login.js')
const {
	register_limit
} = require('../limit/register.js')

// 注册
router.post('/register',expressJoi(register_limit),loginHandler.register)
// 登录
router.post('/login',expressJoi(login_limit),loginHandler.login)
// returnMenuList
router.post('/returnMenuList',loginHandler.returnMenuList)

// 向外暴露路由
module.exports = router