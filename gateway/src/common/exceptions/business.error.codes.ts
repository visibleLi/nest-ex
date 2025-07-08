/**
 * @file 业务错误码
 * @description
 * 4位数错误码。
 * 1xxx: 用户模块
 * 2xxx: 书籍模块
 * ...
 */
export const BUSINESS_ERROR_CODE = {
  // 通用错误
  COMMON: { code: 1000, message: '通用业务错误' },
  ACCESS_FORBIDDEN: { code: 1001, message: '抱歉，您无此权限！' },

  // 用户模块 (1xxx)
  USER_NOT_EXIST: { code: 1101, message: '用户不存在' },
  USER_ALREADY_EXIST: { code: 1102, message: '该用户名已被注册' },
  PASSWORD_INVALID: { code: 1103, message: '密码错误' },

  // 书籍模块 (2xxx)
  BOOK_NOT_EXIST: { code: 2101, message: '书籍不存在' },
  BOOK_STOCK_INSUFFICIENT: { code: 2102, message: '书籍库存不足' },
};
