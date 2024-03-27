const joi = require('joi')

// string值只能为字符串
// alphanum值为a-z A-Z 0-9
// min是最小长度 max是最大长度
// required是必填项
// pattern是正则

const id = joi.required()
const name = joi.string().required()
const email = joi.string().pattern(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/).required()
const oldPassword = joi.string().required()
const newPassword = joi.string().required()

exports.password_limit ={
	// 表示对req.body里面的数据进行验证
	body:{
		id,
		oldPassword,
		newPassword
	}
}

exports.name_limit ={
	// 表示对req.body里面的数据进行验证
	body:{
		id,
		name
	}
}

exports.email_limit ={
	// 表示对req.body里面的数据进行验证
	body:{
		id,
		email
	}
}

exports.forgetPassword_limit ={
	// 表示对req.body里面的数据进行验证
	body:{
		id,
		newPassword
	}
}