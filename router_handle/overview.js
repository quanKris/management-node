// 导入数据库操作模块
const db = require('../db/index')
const moment = require('moment')
const { func } = require('joi')

// 获取产品类别和总价
exports.getCategoryAndNumber = (req, res) => {
	// 获取产品类别数组
	const CategoryArr = () => {
		return new Promise(resolve => {
			const sql = 'select set_value from setting where set_name = "产品设置"'
			db.query(sql, (err, result) => {
				let str = result[0].set_value
				// eval() JSON格式字符串转化为 JSON对象
				const arr = eval('(' + str + ')')
				resolve(arr)
			})
		})
	}
	// 获取价格
	const getNumber = product_category => {
		return new Promise(resolve => {
			const sql = 'select product_all_price from product where product_category= ?'
			db.query(sql,product_category,(err,result)=>{
				let total = 0
				for(let i =0;i<result.length;i++){
					total += result[i]['product_all_price']
				}
				resolve(total)
			})
		})
	}
	// 通过循环类别数组里面每一个类别获取对应的价格
	async function getAll(){
		const category = await CategoryArr()
		const price = []
		for(let i =0 ;i<category.length;i++){
			price[i] = await getNumber(category[i])
		}
		res.send({
			category:category,
			price:price
		})
	}
	getAll()
}

// 获取不同角色与数量
exports.getAdminAndNumber = (req,res) =>{
	// 获取不同角色的数量
	const getNumber = identity =>{
		return new Promise(resolve=>{
			const sql = 'select * from users where identity = ?'
			db.query(sql,identity,(err,result)=>{
				resolve(result.length)
			})
		})
	}
	
	async function getAll(){
		const data = [{
			value:0,
			name:'超级管理员'
		},
		{
			value:0,
			name:'产品管理员'
		},
		{
			value:0,
			name:'用户管理员'
		},
		{
			value:0,
			name:'消息管理员'
		},
		{
			value:0,
			name:'用户'
		}
		]
		
		for(let i = 0;i<data.length;i++){
			data[i]['value'] = await getNumber(data[i]['name'])
		}
		res.send({
			data:data
		})
	}
	getAll()
}

// 获取不同消息等级与数量
exports.getLevelAndNumber = (req,res) =>{
	// 获取不同消息等级的数量
	const getNumber = message_level =>{
		return new Promise(resolve=>{
			const sql = 'select * from message where message_level = ?'
			db.query(sql,message_level,(err,result)=>{
				resolve(result.length)
			})
		})
	}
	
	async function getAll(){
		const data = [{
			value:0,
			name:'一般'
		},
		{
			value:0,
			name:'重要'
		},
		{
			value:0,
			name:'必要'
		},
		]
		
		for(let i = 0;i<data.length;i++){
			data[i]['value'] = await getNumber(data[i]['name'])
		}
		res.send({
			data:data
		})
	}
	getAll()
}

// 返回每天登录人数
exports.getDayAndNumber = (req,res) =>{
	// 获取最近七天日期
	const getDay = () =>{
		let day =new Date()
		let week = []
		for(let i = 0;i<7;i++){
			// day.getDate() 返回当前的一天 比如 2023年9月24日 会返回 24 为了获取前七天的数据 这边就-1
			day.setDate(day.getDate() - 1)
			// 2023/9/23 → 2023-9-23 2023-09-23 
			// moment.js
			week.push(moment(day.toLocaleDateString().replace(/\//g,'-'),'YYYY-MM-DD').format('YYYY-MM-DD'))
		}
		return week
	}
	// 获取每天登录的人数
	const getNumber = login_time =>{
		return new Promise(resolve=>{
			const sql = `select * from login_log where login_time like '%${login_time}%'`
			db.query(sql,login_time,(err,result)=>{
				resolve(result.length)
			})
		})
	}
	
	async function getAll(){
		let week = getDay()
		let number = []
		for(let i = 0;i<week.length;i++){
			number[i] = await getNumber(week[i])
		}
		res.send({
			number:number,
			week:week
		})
	}
	getAll()
}