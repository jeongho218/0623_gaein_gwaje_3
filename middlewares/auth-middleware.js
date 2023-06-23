const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(403).json({
      errorMessage:
        "전달된 쿠키에서 오류가 발생했습니다. (token value or type)",
    });
    return;
  }

  try {
    // JWT 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    const user = await User.findById(userId);
    res.locals.user = user;
    next(); // 이 미들웨어 다음으로 보낸다
  } catch (error) {
    console.error(error); // JWT를 검증하는 중에 서명이 유효하지 않은 경우
    res.status(403).json({
      errorMessage: "전달된 쿠키에서 오류가 발생했습니다. (JWT secret key)",
    });
    return;
  }
};
