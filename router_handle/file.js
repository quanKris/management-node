// 文件管理模块
// 导入数据库操作模块
const db = require('../db/index')
// 用于处理文件
fs = require("fs");


/**
 * file_name 文件名
 * file_url 文件地址
 * file_size 文件大小
 * upload_person 上传者 
 * upload_time 上传时间
 * download_number 下载次数
 */

// 上次文件
exports.uploadFile = (req, res) => {
	// 老名字
	let oldName = req.file.filename;
	// 新名字
	let newName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
	let upload_time = new Date()
	const sql1 = 'select * from files where file_name = ?'
	db.query(sql1, newName, (err, results) => {
		if (results.length > 1) {
			res.send({
				status: 1,
				message: "文件名已存在"
			})
		} else {
			fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
			const sql = 'insert into files set ?'
			db.query(sql, {
				file_url: `http://127.0.0.1:3007/upload/${newName}`,
				file_name: newName,
				file_size: req.file.size * 1 / 1024,
				upload_time,
				download_number: 0
			}, (err, results) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					url: 'http://127.0.0.1:3007/upload/' + newName
				})
			})
		}
	})
}



// 绑定上传者
exports.bindFileAndUser = (req, res) => {
	const {
		name,
		url
	} = req.body
	const sql = 'update files set upload_person = ? where file_url = ?'
	db.query(sql, [name, url], (err, results) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '绑定成功'
		})
	})
}

// 更新下载量
exports.updateDownload = (req, res) => {
	const {
		download_number,
		id
	} = req.body
	number = download_number * 1 + 1
	const sql = 'update files set download_number = ? where id = ?'
	db.query(sql, [number, id], (err, results) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '下载量增加'
		})
	})
}

// 下载文件
exports.downloadFile = (req, res) => {
	const sql = 'select * from files where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result[0].file_url)
	})
}

// 获取文件列表
exports.fileList = (req, res) => {
	const sql = 'select * from files '
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 获取文件列表总数
exports.fileListLength = (req, res) => {
	const sql = 'select * from files '
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据 文件列表
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnFilesListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql =
		`select * from files  ORDER BY upload_time limit 10 offset ${number} `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}


// 搜索文件 模糊搜索
exports.searchFile = (req, res) => {
	const file_name = req.body.file_name
	const sql = `select * from files where file_name like '%${file_name}%' `
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 删除文件 id file_name
exports.deleteFile = (req, res) => {
	const sql = `delete from files where id = ? `
	db.query(sql, req.body.id, (err, result) => {
		// 使用fsd unlink对文件进行删除
		fs.unlink(`./public/upload/${req.body.file_name}`,(err)=>{
			if (err) return res.cc(err)
		})
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '删除成功'
		})
	})
}