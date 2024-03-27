// 导入数据库操作模块
const db = require('../db/index')

// 获取部门消息 参数 id department
exports.getDepartmentMsg = (req, res) => {
	const {
		id,
		department
	} = req.body
	// 根据发布消息时候的部门获取到用户的部门消息 并形成 数组 
	const sql = 'select * from message where message_receipt_object = ? and message_status = 0 '
	db.query(sql, department, (err, results) => {
		if (err) return res.cc(err)
		let msgArr = []
		results.forEach((e) => {
			msgArr.push(e.id)
		})
		// 更新用户的 未读列表 read_list 以及 read_status
		const sql1 = 'update users set read_list = ?,read_status = 1 where id = ?'
		db.query(sql1, [JSON.stringify(msgArr), id], (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				id: id,
				read_list: msgArr,
			})
		})
	})
}

// 获取部门消息
exports.getDepartmentMsgList = (req, res) => {
	const {
		department
	} = req.body
	const sql = 'select * from message where message_receipt_object = ? and message_status = 0 '
	db.query(sql, department, (err, results) => {
		if (err) return res.cc(err)
		res.send(results)
	})

}


// 返回用户的阅读列表及状态
exports.getReadListAndStatus = (req, res) => {
	const sql = 'select read_list,read_status from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 用户点击消息后,对read_list内的数据进行删减 参数 消息的readId 以及 用户的id
exports.clickDelete = (req, res) => {
	const sql = 'select read_list from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		// 第一步 需要把我们获取到的read_list 变成 JSON对象 
		// 第二步 对这个read_list进行一个过滤
		// 第三步 使用JSON.stringify 变回原样 同时，update 这个用户的 read_list
		list = JSON.stringify(JSON.parse(result[0].read_list).filter(item => item != req.body.readId))
		const sql1 = 'update users set read_list = ? where id = ?'
		db.query(sql1, [list, req.body.id], (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '删减成功'
			})
		})
	})
}

// 把新发布文章的id插入到当前所属部门的用户的read_list中 参数 新发布文章的newid 对应的部门 department
exports.changeUserReadList = (req, res) => {
	const sql = 'select read_list,read_status,id from users where department = ?'
	db.query(sql, req.body.department, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			if (e.read_status == 1) {
				let arr = JSON.parse(e.read_list)
				arr.push(JSON.parse(req.body.newid))
				arr = JSON.stringify(arr)
				const sql1 = 'update users set read_list = ? where id = ?'
				db.query(sql1, [arr, e.id], (err, result) => {})
			}
		})
		res.send({
			status: 0,
			message: '更新成功'
		})
	})
}

// 把删除的文章的id从当前所属部门的用户的read_list中删除 参数 新发布文章的deleteid 对应的部门 department
exports.changeUserReadListButDelete = (req, res) => {
	const sql = 'select read_list,read_status,id from users where department = ?'
	db.query(sql, req.body.department, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			if (e.read_status == 1) {
				let arr = JSON.parse(e.read_list)
				arr = arr.filter(item => {
					return item != req.body.deleteid
				})
				arr = JSON.stringify(arr)
				const sql1 = 'update users set read_list = ? where id = ?'
				db.query(sql1, [arr, e.id], (err, result) => {})
			}
		})
		res.send({
			status: 0,
			message: '更新成功'
		})
	})
}