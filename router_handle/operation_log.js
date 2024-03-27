// 导入数据库操作模块
const db = require('../db/index')

/**
 * 
 * 操作日志
 * 
 * operation_person 操作者
 * operation_content 操作内容
 * operation_level 操作等级
 * operation_time 操作时间
 */

// 操作记录
exports.operationLog = (req,res) =>{
	const {operation_person,operation_content,operation_level } = req.body
	const operation_time = new Date()
	const sql = 'insert into operation_log set ?'
	db.query(sql,{operation_person,operation_content,operation_level,operation_time},(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			status:0,
			message:'操作记录成功'
		})
	})
}

// 返回操作日志列表
exports.operationLogList = (req,res) =>{
	const sql = 'select * from operation_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 搜索最近十条操作记录
exports.searchOperationLogList = (req,res) =>{
	const sql = 'select * from operation_log where operation_person = ? ORDER BY operation_time limit 10'
	db.query(sql,req.body.operation_person,(err,result)=>{
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 返回操作日志列表的长度
exports.operationLogListLength = (req,res) =>{
	const sql = 'select * from operation_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据  操作日志列表
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnOperationListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql =
		`select * from operation_log ORDER BY operation_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 清空操作日志 truncate
exports.clearOperationLogList = (req,res) =>{
	const sql = 'truncate table operation_log'
	db.query(sql,(err,result)=>{
		if (err) return res.cc(err)
		res.send({
			status:0,
			message:'数据表清空成功'
		})
	})
}
