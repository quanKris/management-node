// 导入数据库操作模块
const db = require('../db/index')

/**
 * 登录日志字段
 * 
 * account 账号
 * name 名字
 * email 邮箱/联系方式
 * login_time 登录时间 
 * 
 */

// 登录记录
exports.loginLog = (req,res) =>{
	const {account,name,email } = req.body
	const login_time = new Date()
	const sql = 'insert into login_log set ?'
	db.query(sql,{account,name,email,login_time},(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			status:0,
		})
	})
}

// 返回登录日志列表
exports.loginLogList = (req,res) =>{
	const sql = 'select * from login_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 搜索最近十条登录记录
exports.searchLoginLogList = (req,res) =>{
	const sql = 'select * from login_log where account = ? ORDER BY login_time limit 10'
	db.query(sql,req.body.account,(err,result)=>{
		if (err) return res.cc(err)
		res.send(result)
	})
}



// 返回登录日志列表的长度
exports.loginLogListLength = (req,res) =>{
	const sql = 'select * from login_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据  登录日志列表
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnLoginListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql =
		`select * from login_log ORDER BY login_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 清空登录日志 truncate
exports.clearLoginLogList = (req,res) =>{
	const sql = 'truncate table login_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			status:0,
			message:'数据表清空成功'
		})
	})
}



