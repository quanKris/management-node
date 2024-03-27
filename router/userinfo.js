// 导入express框架
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入expreJoi
const expressJoi = require('@escook/express-joi')

// 导入userinfo的路由处理模块
const userinfoHandler = require('../router_handle/userinfo')
// 导入验证规则
const {
	password_limit,
	name_limit,
	email_limit,
	forgetPassword_limit,
} = require('../limit/user.js')
fs = require('fs')
const multer = require("multer");
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({
	dest: './public/upload'
})
// 上传头像
router.post('/uploadAvatar', upload.single('avatar'), userinfoHandler.uploadAvatar)
// 绑定账号
router.post('/bindAccount', userinfoHandler.bindAccount)
// 修改用户密码 changePassword
router.post('/changePassword', expressJoi(password_limit), userinfoHandler.changePassword)
// 获取用户信息
router.get('/getUserInfo', userinfoHandler.getUserInfo)
// 获取用户路由
router.get('/getMenuList', userinfoHandler.getMenuList)
// 获取公司部门信息
router.get('/getDepartment', userinfoHandler.getDepartment)
// 修改姓名 changeName
router.post('/changeName', expressJoi(name_limit), userinfoHandler.changeName)
// 修改性别
router.post('/changeSex', userinfoHandler.changeSex)
// 修改身份
router.post('/changeIdentity', userinfoHandler.changeIdentity)
// 修改邮箱
router.post('/changeEmail', expressJoi(email_limit), userinfoHandler.changeEmail)
// 验证账号与邮箱 verifyAccountAndEmail
router.post('/verifyAccountAndEmail', userinfoHandler.verifyAccountAndEmail)
// 登录页面修改密码 changePasswordInLogin
router.post('/changePasswordInLogin', expressJoi(forgetPassword_limit),userinfoHandler.changePasswordInLogin)
// ---------------用户管理
// 添加管理员
router.post('/createAdmin',userinfoHandler.createAdmin)
// 获取管理员列表
router.post('/getAdminList',userinfoHandler.getAdminList)
// 编辑管理员账号信息
router.post('/editAdmin',userinfoHandler.editAdmin)
// 对管理员取消赋权
router.post('/changeIdentityToUser',userinfoHandler.changeIdentityToUser)
// 对用户进行赋权
router.post('/changeIdentityToAdmin',userinfoHandler.changeIdentityToAdmin)
// 通过账号对用户搜索
router.post('/searchUser',userinfoHandler.searchUser)
// 通过部门对用户搜索
router.post('/searchUserByDepartment',userinfoHandler.searchUserByDepartment)
// 冻结用户
router.post('/banUser',userinfoHandler.banUser)
// 解冻用户
router.post('/hotUser',userinfoHandler.hotUser)
// 获取冻结用户列表
router.post('/getBanList',userinfoHandler.getBanList)
// 删除用户 deleteUser
router.post('/deleteUser',userinfoHandler.deleteUser)
// 获取对应身份的一个总人数
router.post('/getAdminListLength',userinfoHandler.getAdminListLength)
// 监听换页返回数据
router.post('/returnListData',userinfoHandler.returnListData)

// 向外暴露路由
module.exports = router