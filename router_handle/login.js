const db = require('../db/index.js')
// 导入bcrypt加密中间件
const bcrypt = require('bcryptjs')
// 导入jwt,用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密跟解密
const jwtconfig = require('../jwt_config/index.js')

exports.register = (req, res) => {
    // req是前端传过来的数据,也就是request,res是返回给前端的数据,也就是response
    const reginfo = req.body
    console.log(reginfo)
    // 第一步,判断前端传过来的数据有没有空
    if ((!reginfo.phone && !reginfo.email) || !reginfo.password) {
        return res.send({
            status: 1,
            message: '账号或者密码不能为空'
        })
    }
    // 第二步,判断前端传过来账号有没有已经存在在数据表中
    // 需要使用mysql的select语句
    var sql = ''
    var queryFiled = ''
    if(reginfo.phone){
        sql = 'select * from users where phone = ?'
        queryFiled = reginfo.phone
    }else if(reginfo.email){
        sql = 'select * from users where email = ?'
        queryFiled = reginfo.email
    }
    // const sql = 'select * from users where email = ?'
    // 第一个参数是执行语句，第二个是参数，第三个是一个函数，用于处理结果
    db.query(sql, queryFiled, (err, results) => {
        if (results.length > 0) {
            return res.send({
                code:6666,
                data:{
                    status: 0,
                    message: '已被注册，请重新登陆'
                }
            })
        }
        // 第三步,对密码进行加密
        // 需要使用加密中间件 bcrypt.js
        // bcrypt.hashSyncd第一个参数是传入的密码，第二个参数是加密后的长度
        reginfo.password = bcrypt.hashSync(reginfo.password, 10)
        // 第四步,把账号跟密码插入到users表里面
        const sql1 = 'insert into users set ?'
        // 注册身份
        const identity = '用户'
        // 创建时间
        const create_time = new Date()
        db.query(sql1, {
            email: reginfo.email,
            phone: reginfo.phone,
            password: reginfo.password,
            checked: reginfo.checked? '1' : '0',
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
                    code:6666,
                    data:{
                        status: 0,
                        message: '注册账号失败'
                    }
                })
            }
            res.send({
                code: 6666,
                data:{
                    message: '注册账号成功'
                }
            })
        })
    })
}

exports.login = (req, res) => {
    const loginfo = req.body
    // 第一步 查看数据表中有没有前端传过来的账号
    var sql = ''
    var queryFiled = ''
    var psd = true
    if(loginfo.phone){
        sql = 'select * from users where phone = ?'
        queryFiled = loginfo.phone
        psd = false
    }else if(loginfo.account){
        sql = 'select * from users where email = ?'
        queryFiled = loginfo.account
    }
    db.query(sql, queryFiled, (err, results) => {
        // 执行sql语句失败的情况 一般在数据库断开的情况会执行失败
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('账号不存在',403)
        // 第二步 对前端传过来的密码进行解密
        //如果是邮箱登录，必须传密码，手机登录可以免密
        const compareResult = psd ? bcrypt.compareSync(loginfo.password, results[0].password):true
        if (!compareResult) {
            return res.cc('密码错误',403)
        }
        // 第三步 对账号是否冻结做判定
        if (results[0].status == 1) {
            return res.cc('账号被冻结',403)
        }
        // 第四步 生成返回给前端的token
        // 剔除加密后的密码,头像,创建时间,更新时间
        const user = {
            ...results[0],
            password: '',
            create_time: '',
            update_time: '',
        }
        // 设置token的有效时长 有效期为7个小时
        const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
            expiresIn: '7h'
        })
        res.send({
            code: 6666,
            data:{
                token: tokenStr,
                message: '登录成功',
                userInfo: user,
            }
        })
    })
}

// 超级管理员路由
const superAdminRouter = [{
    name: 'home',
    path: '/home',
    meta: {title: '首页'},
    component: 'home/index'
},
    {
        name: 'set',
        path: '/set',
        meta: {title: '设置'},
        component: 'set/index'
    },
    {
        name: 'overview',
        path: '/overview',
        meta: {title: '系统概览'},
        component: 'overview/index'
    },
    {
        name: 'product_manage',
        path: '/product_manage',
        meta: {title: '产品管理员'},
        component: 'user_manage/product_manage/index'
    },
    {
        name: 'message_manage',
        path: '/message_manage',
        meta: {title: '消息管理员'},
        component: 'user_manage/message_manage/index'
    },
    {
        name: 'user_list',
        path: '/user_list',
        meta: {title: '用户列表'},
        component: 'user_manage/user_list/index'
    },
    {
        name: 'users_manage',
        path: '/users_manage',
        meta: {title: '用户管理'},
        component: 'user_manage/users_manage/index'
    },
    {
        name: 'product_manage_list',
        path: '/product_manage_list',
        meta: {title: '产品管理'},
        component: 'product/product_manage_list/index'
    },
    {
        name: 'out_product_manage_list',
        path: '/out_product_manage_list',
        meta: {title: '出库管理'},
        component: 'product/out_product_manage_list/index'
    },
    {
        name: 'message_list',
        path: '/message_list',
        meta: {title: '消息管理'},
        component: 'message/message_list/index'
    },
    {
        name: 'recycle',
        path: '/recycle',
        meta: {title: '回收站'},
        component: 'message/recycle/index'
    },
    {
        name: 'file',
        path: '/file',
        meta: {title: '文件管理'},
        component: 'file/index'
    },
    {
        name: 'operation_log',
        path: '/operation_log',
        meta: {title: '操作日志'},
        component: 'operation_log/index'
    },
    {
        name: 'login_log',
        path: '/login_log',
        meta: {title: '登录日志'},
        component: 'login_log/index'
    },
]

// 用户管理员路由
const userAdminRouter = [
    {
        name: 'home',
        path: '/home',
        meta: {title: '首页'},
        component: 'home/index',
    },
    {
        name: 'set',
        path: '/set',
        meta: {title: '设置'},
        component: 'set/index',
    },
    {
        name: 'user_list',
        path: '/user_list',
        meta: {title: '用户列表'},
        component: 'user_manage/user_list/index',
    },
    {
        name: 'users_manage',
        path: '/users_manage',
        meta: {title: '用户管理'},
        component: 'user_manage/users_manage/index',
    },
    {
        name: 'file',
        path: '/file',
        meta: {title: '文件管理'},
        component: 'file/index',
    }
]
// 产品管理员路由
const productAdminRouter = [
    {
        name: 'home',
        path: '/home',
        meta: {title: '首页'},
        component: 'home/index',
    },
    {
        name: 'set',
        path: '/set',
        meta: {title: '设置'},
        component: 'set/index',
    },
    {
        name: 'product_manage_list',
        path: '/product_manage_list',
        meta: {title: '产品管理'},
        component: 'product/product_manage_list/index',
    },
    {
        name: 'out_product_manage_list',
        path: '/out_product_manage_list',
        meta: {title: '出库管理'},
        component: 'product/out_product_manage_list/index',
    },
    {
        name: 'file',
        path: '/file',
        meta: {title: '文件管理'},
        component: 'file/index'
    },

]
// 消息管理员路由
const messageAdminRouter = [
    {
        name: 'home',
        path: '/home',
        meta: {title: '首页'},
        component: 'home/index',
    },
    {
        name: 'set',
        path: '/set',
        meta: {title: '设置'},
        component: 'set/index',
    },
    {
        name: 'message_list',
        path: '/message_list',
        meta: {title: '消息管理'},
        component: 'message/message_list/index'
    },
    {
        name: 'recycle',
        path: '/recycle',
        meta: {title: '回收站'},
        component: 'message/recycle/index'
    },
    {
        name: 'file',
        path: '/file',
        meta: {title: '文件管理'},
        component: 'file/index'
    },
]
// 普通用户路由
const userRouter = [
    {
        name: 'home',
        path: '/home',
        meta: {title: '首页'},
        component: 'home/index'
    },
    {
        name: 'set',
        path: '/set',
        meta: {title: '设置'},
        component: 'set/index'
    },
    {
        name: 'product_manage_list',
        path: '/product_manage_list',
        meta: {title: '产品管理'},
        component: 'product/product_manage_list/index'
    },
    {
        name: 'out_product_manage_list',
        path: '/out_product_manage_list',
        meta: {title: '出库管理'},
        component: 'product/out_product_manage_list/index'
    },
    {
        name: 'file',
        path: '/file',
        meta: {title: '文件管理'},
        component: 'file/index'
    },
]

// 返回用户的路由列表，参数ID
exports.returnMenuList = (req,res) =>{
    const sql = 'select identity from users where id = ?'
    db.query(sql,req.body.id,(err,result)=>{
        if (err) return res.cc(err)
        let menu = []
        if(result[0].identity=='超级管理员'){
            menu = superAdminRouter
        }
        if(result[0].identity=='用户管理员'){
            menu = userAdminRouter
        }
        if(result[0].identity=='产品管理员'){
            menu = productAdminRouter
        }
        if(result[0].identity=='消息管理员'){
            menu = messageAdminRouter
        }
        if(result[0].identity=='用户'){
            menu = userRouter
        }
        res.send(menu)
    })
}