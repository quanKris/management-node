const joi = require('joi')

// string值只能为字符串
// alphanum值为a-z A-Z 0-9
// min是最小长度 max是最大长度
// required是必填项
// pattern是正则

// 账号的验证
// const account = joi.string().alphanum().min(6).max(12).required()
// // 密码的验证
// const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()
// 账号的验证
const account = joi.string().alphanum().required()
// 手机号的验证
const phone = joi.string().pattern(/^1[3456789]\d{9}$/);

// 邮箱的验证
const email = joi.string().email();
// 密码的验证


exports.login_limit ={
	// 表示对req.body里面的数据进行验证
	body:{
		phone: joi.string().empty('').default(null), // 允许为空字符串，设定默认值为 null
        account: joi.string().empty('').default(null), // 允许为空字符串，设定默认值为 null
        password:joi.string().empty('').default(null),
        verifyCode : joi.string().empty('').default(null),
        checked: joi.boolean().empty('').default(null),
	}
}