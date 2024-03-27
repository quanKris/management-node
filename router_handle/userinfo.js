const db = require('../db/index.js')
// 导入bcrypt加密中间件
const JWT = require('../util/JWT');
const jwtconfig = require('../jwt_config/index.js')
const bcrypt = require('bcryptjs')
// 导入node.js的crypto库生成uuid
const crypto = require('crypto')
// 导入fs处理文件

// 获取用户信息 接收参数 id
exports.getUserInfo = (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1]
    const payload=  JWT.verify(token,jwtconfig.jwtSecretKey)
    var userId = ''
    if(payload){
        userId = payload.id
    }
	const sql = 'select * from users where id = ?'
	db.query(sql, userId, (err, result) => {
		if (err) return res.cc(err)
		result[0].password = ''
		res.send({
            code: 6666,
            data:result[0],
        })
	})
}
// 获取用户路由
exports.getMenuList = async (req, res) => {
    // const routes = await db.query('SELECT * FROM routes');
	const results = [
        {
          path: '/list',
          name: 'list',
          component: 'LAYOUT',
          redirect: '/list/base',
          meta: {
            title: '列表页',
            icon: 'asdasd',
          },
          children: [
            {
              path: 'base',
              name: 'ListBase',
              component: '/list/base/index',
              meta: {
                title: '基础列表页',
              },
            },
            {
              path: 'card',
              name: 'ListCard',
              component: '/list/card/index',
              meta: {
                title: '卡片列表页',
              },
            },
            {
              path: 'filter',
              name: 'ListFilter',
              component: '/list/filter/index',
              meta: {
                title: '筛选列表页',
              },
            },
            {
              path: 'tree',
              name: 'ListTree',
              component: '/list/tree/index',
              meta: {
                title: '树状筛选列表页',
              },
            },
          ],
        },
        {
          path: '/form',
          name: 'form',
          component: 'LAYOUT',
          redirect: '/form/base',
          meta: {
            title: '表单页',
            icon: 'edit-1',
          },
          children: [
            {
              path: 'base',
              name: 'FormBase',
              component: '/form/base/index',
              meta: {
                title: '基础表单页',
              },
            },
            {
              path: 'step',
              name: 'FormStep',
              component: '/form/step/index',
              meta: {
                title: '分步表单页',
                keepAlive: false,
              },
            },
          ],
        },
        {
          path: '/detail',
          name: 'detail',
          component: 'LAYOUT',
          redirect: '/detail/base',
          meta: {
            title: '详情页',
            icon: 'layers',
          },
          children: [
            {
              path: 'base',
              name: 'DetailBase',
              component: '/detail/base/index',
              meta: {
                title: '基础详情页',
              },
            },
            {
              path: 'advanced',
              name: 'DetailAdvanced',
              component: '/detail/advanced/index',
              meta: {
                title: '多卡片详情页',
              },
            },
            {
              path: 'deploy',
              name: 'DetailDeploy',
              component: '/detail/deploy/index',
              meta: {
                title: '数据详情页',
              },
            },
            {
              path: 'secondary',
              name: 'DetailSecondary',
              component: '/detail/secondary/index',
              meta: {
                title: '二级详情页',
              },
            },
          ],
        },
        {
          path: '/frame',
          name: 'Frame',
          component: 'Layout',
          redirect: '/frame/doc',
          meta: {
            icon: 'internet',
            title: '外部页面',
          },
          children: [
            {
              path: 'doc',
              name: 'Doc',
              component: 'IFrame',
              meta: {
                frameSrc: 'https://tdesign.tencent.com/starter/docs/vue-next/get-started',
                title: '使用文档（内嵌）',
              },
            },
            {
              path: 'TDesign',
              name: 'TDesign',
              component: 'IFrame',
              meta: {
                frameSrc: 'https://tdesign.tencent.com/vue-next/getting-started',
                title: 'TDesign 文档（内嵌）',
              },
            },
            {
              path: 'TDesign2',
              name: 'TDesign2',
              component: 'IFrame',
              meta: {
                frameSrc: 'https://tdesign.tencent.com/vue-next/getting-started',
                frameBlank: true,
                title: 'TDesign 文档（外链）',
              },
            },
          ],
        },
    ]
    res.send({
        code: 6666,
        data: results,
    })
}
// 上传头像
exports.uploadAvatar = (req, res) => {
	// 生成唯一标识
	const onlyId = crypto.randomUUID()
	let oldName = req.file.filename;
    const deleteSql = 'DELETE FROM image WHERE account = ?';
    db.query(deleteSql, [req.body.account], (err, result) => {
        if (err) return res.cc(err);
        let newName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
        const sql = 'insert into image set ?'
        db.query(sql, {
            image_url: `http://127.0.0.1:3007/upload/${newName}`,
            onlyId
        }, (err, result) => {
            if (err) return res.cc(err)
            res.send({
                onlyId,
                status: 0,
                url: 'http://127.0.0.1:3007/upload/' + newName
            })
        })
    });
	
}
// 绑定账号 onlyid account url
exports.bindAccount = (req, res) => {
	const {
		account,
		onlyId,
		url
	} = req.body
	const sql = 'update image set account = ? where onlyId = ?'
	db.query(sql, [account, onlyId], (err, result) => {
		if (err) return res.cc(err)
		if (result.affectedRows == 1) {
			const sql1 = 'update users set image_url = ? where account = ?'
			db.query(sql1, [url, account], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改成功'
				})
			})
		}
	})
}

// 修改用户密码 先输入旧密码 oldPassword 新密码 newPassword id 
exports.changePassword = (req, res) => {
	const sql = 'select password from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		// bcrypt
		const compareResult = bcrypt.compareSync(req.body.oldPassword, result[0].password)
		if (!compareResult) {
			return res.send({
				status: 1,
				message: '原密码错误'
			})
		}
		req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10)
		const sql1 = 'update users set password = ? where id = ?'
		db.query(sql1, [req.body.newPassword, req.body.id], (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '修改成功'
			})
		})
	})
}





// 获取公司部门信息
exports.getDepartment = (req, res) => {
	const {
		id,
		name
	} = req.body
	const sql = 'select * from department'
	db.query(sql,  (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}


// 修改姓名 接收参数 id name
exports.changeName = (req, res) => {
	const {
		id,
		name
	} = req.body
	const sql = 'update users set name = ? where id = ?'
	db.query(sql, [name, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}

// 修改性别 接收参数 id sex
exports.changeSex = (req, res) => {
	const {
		id,
		sex
	} = req.body
	const sql = 'update users set sex = ? where id = ?'
	db.query(sql, [sex, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			code:6666,
            data:{
                message:'修改成功',
                status:0
            }
		})
	})
}
// 修改性别 接收参数 id sex
exports.changeIdentity = (req, res) => {
	const {
		id,
		identity
	} = req.body
	const sql = 'update users set identity = ? where id = ?'
	db.query(sql, [identity, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			code:6666,
            data:{
                message:'修改成功',
                status:0
            }
		})
	})
}

// 修改邮箱 接收参数 id email
exports.changeEmail = (req, res) => {
	const {
		id,
		email
	} = req.body
	const sql = 'update users set email = ? where id = ?'
	db.query(sql, [email, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}

// 验证账户和与邮箱是否一致 email account
exports.verifyAccountAndEmail = (req, res) => {
	const {
		account,
		email
	} = req.body
	const sql = 'select * from users where account = ?'
	db.query(sql, account, (err, result) => {
		if (err) return res.cc(err)
		// res.send(result[0].email)
		if (email == result[0].email) {
			res.send({
				status: 0,
				message: '查询成功',
				id: result[0].id
			})
		} else {
			res.send({
				status: 1,
				message: '查询失败'
			})
		}
	})
}

// 登录页面修改密码 参数 newPassword id
exports.changePasswordInLogin = (req, res) => {
	const user = req.body
	user.newPassword = bcrypt.hashSync(user.newPassword, 10)
	const sql = 'update users set password = ? where id = ?'
	db.query(sql, [user.newPassword, user.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '更新成功'
		})
	})
}

// ----------------------------------------用户管理
// 添加管理员
exports.createAdmin = (req, res) => {
	const {
		account,
		password,
		name,
		sex,
		department,
		email,
		identity
	} = req.body
	// 判断账号是否存在与数据库中
	const sql = 'select * from users where account = ?'
	db.query(sql, account, (err, results) => {
		// 判断账号是否存在
		if (results.length > 0) {
			return res.send({
				status: 1,
				message: '账号已存在'
			})
		}
		const hashpassword = bcrypt.hashSync(password, 10)
		// 第四步,把账号跟密码插入到users表里面
		const sql1 = 'insert into users set ?'
		// 创建时间
		const create_time = new Date()
		db.query(sql1, {
			account,
			password: hashpassword,
			name,
			sex,
			department,
			email,
			// 身份
			identity,
			// 创建时间
			create_time,
			// 初始未冻结状态为0
			status: 0,
		}, (err, results) => {
			// 第一个,插入失败
			// affectedRows为影响的行数，如果插入失败，那么就没有影响到行数，也就是行数不为1
			if (results.affectedRows !== 1) {
				return res.send({
					status: 1,
					message: '添加管理员失败'
				})
			}
			res.send({
				status: 0,
				message: '添加管理员成功'
			})
		})
	})
}

// 获取管理员列表 参数是 identity 
exports.getAdminList = (req, res) => {
	const sql = 'select * from users where identity = ?'
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = ''
			e.create_time = ''
			e.image_url = ''
			e.status = ''
		})
		res.send(result)
	})
}
// 编辑管理员账号信息
exports.editAdmin = (req, res) => {
	const {
		id,
		name,
		sex,
		email,
		department
	} = req.body
	const date = new Date()
	const sql0 = 'select department from users where id = ?'
	db.query(sql0, id, (err, result) => {
		if (result[0].department == department) {
			// 修改的内容
			const updateContent = {
				id,
				name,
				sex,
				email,
				department,
				update_time: date,
			}
			const sql = 'update users set ? where id = ?'
			db.query(sql, [updateContent, updateContent.id], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改管理员信息成功'
				})
			})
		} else {
			// 修改的内容
			const updateContent = {
				id,
				name,
				sex,
				email,
				department,
				update_time: date,
				read_list: null,
				read_status: 0
			}
			const sql = 'update users set ? where id = ?'
			db.query(sql, [updateContent, updateContent.id], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改管理员信息成功'
				})
			})
		}
	})

}

// 对管理员取消赋权 参数 id
exports.changeIdentityToUser = (req, res) => {
	const identity = '用户'
	const sql = 'update users set identity = ? where id = ?'
	db.query(sql, [identity, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '降级成功'
		})
	})
}

// 对用户进行赋权 参数 id identity
exports.changeIdentityToAdmin = (req, res) => {
	const date = new Date()
	const sql = 'update users set identity = ?,update_time = ? where id = ?'
	db.query(sql, [req.body.identity, date, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '赋权成功'
		})
	})
}

// 通过账号对用户搜索 account identity
exports.searchUser = (req, res) => {
	const {account,identity} = req.body
	const sql = 'select * from users where account = ? and identity = ?'
	db.query(sql, [account,identity], (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = ''
			e.create_time = ''
			e.image_url = ''
			e.status = ''
		})
		res.send(result)
	})
}

// 通过部门对用户搜索 department
exports.searchUserByDepartment = (req, res) => {
	const sql = 'select * from users where department = ? and identity = "用户"'
	db.query(sql, req.body.department, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = ''
			e.image_url = ''
		})
		res.send(result)
	})
}


// 冻结用户 通过id 把status 置为 1 
exports.banUser = (req, res) => {
	const status = 1
	const sql = 'update users set status = ? where id = ?'
	db.query(sql, [status, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '冻结成功'
		})
	})
}



// 解冻用户
exports.hotUser = (req, res) => {
	const status = 0
	const sql = 'update users set status = ? where id = ?'
	db.query(sql, [status, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '解冻成功'
		})
	})
}

// 获取冻结用户列表
exports.getBanList = (req, res) => {
	const sql = 'select * from users where status = "1" '
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

// 删除用户 id account
exports.deleteUser = (req, res) => {
	const sql = 'delete from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		const sql1 = 'delete from image where account = ?'
		db.query(sql1, req.body.account, (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '删除用户成功'
			})
		})
	})
}

// 获取对应身份的一个总人数 identity
exports.getAdminListLength = (req, res) => {
	const sql = 'select * from users where identity = ? '
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据 页码 pager identity
// limit 10 为我们要拿到数据 offset 我们跳过多少条数据
exports.returnListData = (req, res) => {
	const number = (req.body.pager - 1) * 10
	const sql = `select * from users where identity = ? ORDER BY create_time limit 10 offset ${number} `
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}