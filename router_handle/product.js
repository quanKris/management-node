// 导入数据库操作模块
const db = require('../db/index')

/**
 * id int

 * product_id 入库编号 int
 * product_name 产品名称 varchar
 * product_category 产品类别  varchar
 * product_unit 产品单位 varchar
 * product_in_warehouse_number 产品入库数量 库存 int
 * product_single_price 产品入库单价 int
 * product_all_price 产品入库总价 int
 * product_status 库存状态 100-300为正常 100以下为库存告急 300以上为过剩 varchar
 * product_create_person 入库操作人 varchar
 * product_create_time 产品新建时间 varchar
 * product_update_time 产品最新编辑时间 varchar
 * in_memo 入库备注
 * 
 * product_out_id 出库id int
 * product_out_number 出库数量 int
 * product_out_price 出库总价 int
 * product_out_apply_person 出库申请人 varchar
 * product_apply_time 申请出库时间 varchar
 * apply_memo 申请备注 varchar
 * product_out_status 出库状态 申请出库 or 同意 or 否决 varchar
 * product_audit_time 审核时间 varchar
 * product_out_audit_person 审核人 varchar
 * audit_memo 出库/审核备注 varchar
 * 
 */
// memory就是备忘录的意思

// 产品入库 创建产品
exports.createProduct = (req, res) => {
	const {
		product_id,
		product_name,
		product_category,
		product_unit,
		product_in_warehouse_number,
		product_single_price,
		product_create_person,
		in_memo
	} = req.body
	const product_create_time = new Date()
	const product_all_price = product_in_warehouse_number * 1 * product_single_price
	const sql0 = 'select * from product where product_id = ?'
	db.query(sql0, product_id, (err, res) => {
		if (res.length > 0) {
			res.send({
				status: 1,
				message: '产品编号已存在'
			})
		}
		const sql = 'insert into product set ?'
		db.query(sql, {
			product_id,
			product_name,
			product_category,
			product_unit,
			product_in_warehouse_number,
			product_single_price,
			product_all_price,
			product_create_person,
			product_create_time,
			in_memo,
		}, (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '添加产品成功'
			})
		})
	})

}

// 删除产品
exports.deleteProduct = (req, res) => {
	const sql = 'delete from product where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '删除产品成功'
		})
	})
}


// 编辑产品信息
exports.editProduct = (req, res) => {
	const {
		product_name,
		product_category,
		product_unit,
		product_in_warehouse_number,
		product_single_price,
		in_memo,
		id
	} = req.body
	const product_update_time = new Date()
	const product_all_price = product_in_warehouse_number * 1 * product_single_price
	const sql =
		'update product set product_name = ?,product_category = ?,product_unit = ?,product_in_warehouse_number = ?,product_single_price = ?,product_all_price = ? ,product_update_time= ?,in_memo = ? where id = ?'
	db.query(sql, [
		product_name,
		product_category,
		product_unit,
		product_in_warehouse_number,
		product_single_price,
		product_all_price,
		product_update_time,
		in_memo,
		id
	], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '编辑产品信息成功'
		})
	})
}

// 获取产品列表
exports.getProductList = (req, res) => {
	const sql = 'select * from product where product_in_warehouse_number>= 0'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 产品申请出库
exports.applyOutProduct = (req, res) => {
	const product_out_status = '申请出库'
	const {
		id,
		product_out_id,
		product_single_price,
		product_out_number,
		product_out_apply_person,
		apply_memo,
	} = req.body
	const product_apply_time = new Date()
	const product_out_price = product_out_number * 1 * product_single_price
	const sql0 = 'select * from product where product_out_id = ?'
	db.query(sql0, product_out_id, (err, result) => {
		if (result.length > 0) {
			res.send({
				status: 1,
				message: '申请出库编号已存在'
			})
		}else{
			const sql =
				'update product set product_out_status = ?,product_out_id=?,product_out_number=?,product_out_price=?,product_out_apply_person=?,apply_memo=?,product_apply_time= ? where id = ?'
			db.query(sql, [
				product_out_status,
				product_out_id,
				product_out_number,
				product_out_price,
				product_out_apply_person,
				apply_memo,
				product_apply_time,
				id
			], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '申请出库成功'
				})
			})
		}
	})
}

// 产品审核列表
exports.applyProductList = (req, res) => {
	const sql = 'select * from product where product_out_status not in ("同意")'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}


// 对产品进行撤回申请
exports.withdrawApplyProduct = (req, res) => {
	const sql =
		'update product set product_out_id = NULL,product_out_status = NULL , product_out_number =NULL,product_out_apply_person=NULL,apply_memo =NULL,product_out_price =NULL,product_apply_time = NULL where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '撤回申请出库成功'
		})
	})
}

// 产品审核
exports.auditProduct = (req, res) => {
	const {
		id,
		product_out_id,
		product_out_status,
		audit_memo,
		product_out_price,
		product_out_audit_person,
		product_out_apply_person,
		product_in_warehouse_number,
		product_single_price,
		product_out_number
	} = req.body
	const product_audit_time = new Date()
	if (product_out_status == "同意") {
		// // 产品出库总价
		// product_out_price = product_out_number * 1 * product_single_price * 1
		// 新的库存数量
		const newWarehouseNumber = product_in_warehouse_number * 1 - product_out_number * 1
		// 新的库存总价
		const product_all_price = newWarehouseNumber * product_single_price
		const sql = 'insert into outproduct set ?'
		db.query(sql, {
			product_out_id,
			product_out_number,
			product_out_price,
			product_out_audit_person,
			product_out_apply_person,
			product_audit_time,
			audit_memo
		}, (err, result) => {
			if (err) return res.cc(err)
			const sql1 =
				'update product set product_in_warehouse_number = ?,product_all_price = ?,product_out_status = NULL ,product_out_id = NULL,product_out_number =NULL,product_out_apply_person=NULL,apply_memo =NULL,product_out_price =NULL,product_apply_time = NULL where id = ?'
			db.query(sql1, [newWarehouseNumber, product_all_price, req.body.id], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '产品出库成功'
				})
			})
		})
	}
	if (product_out_status == '否决') {
		const sql =
			'update product set audit_memo = ?,product_out_status = ?,product_audit_time= ?,product_out_audit_person = ? where id = ?'
		db.query(sql, [audit_memo, product_out_status, product_audit_time, product_out_audit_person, id], (err,
			result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '产品被否决'
			})
		})
	}
}

// 通过入库编号对产品进行搜索 
exports.searchProductForId = (req, res) => {
	const sql = 'select * from product where product_id  = ?'
	db.query(sql, req.body.product_id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 通过出库申请编号对产品进行搜索 
exports.searchProductForApplyId = (req, res) => {
	const sql = 'select * from product where product_out_id   = ?'
	db.query(sql, req.body.product_out_id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 通过出库编号对产品进行搜索 
exports.searchProductForOutId = (req, res) => {
	const sql = 'select * from outproduct where product_out_id   = ?'
	db.query(sql, req.body.product_out_id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 获取产品总数
exports.getProductLength = (req, res) => {
	const sql = 'select * from product where product_in_warehouse_number>= 0'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 获取申请出库产品总数
exports.getApplyProductLength = (req, res) => {
	const sql = 'select * from product where product_out_status = "申请出库" || product_out_status = "否决"'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 出库产品列表
exports.auditProductList = (req, res) => {
	const sql = 'select * from outproduct'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}


// 获取出库产品总数
exports.getOutProductLength = (req, res) => {
	const sql = 'select * from outproduct'
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据  产品页面
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnProductListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql =
		`select * from product where product_in_warehouse_number>= 0 ORDER BY product_create_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 监听换页返回数据  申请出库页面
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnApplyProductListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql =
		`select * from product where product_out_status = "申请出库" || product_out_status = "否决" ORDER BY product_apply_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 监听换页返回数据  出库页面
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnOutProductListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql = `select * from outproduct ORDER BY product_audit_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

