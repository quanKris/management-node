const joi = require('joi');

// 手机号的验证规则
const phone = joi.string().pattern(/^1[3456789]\d{9}$/);

// 邮箱的验证规则
const email = joi.string().email();

// 密码的验证规则
const password = joi.string().required();

// 验证码的验证规则

exports.register_limit = {
  // 对 req.body 中的数据进行验证
  body: {
    phone: joi.string().empty('').default(null), // 允许为空字符串，设定默认值为 null
    email: joi.string().empty('').default(null), // 允许为空字符串，设定默认值为 null
    password,
    verifyCode : joi.string().empty('').default(null),
    checked: joi.boolean().required()
  }
};