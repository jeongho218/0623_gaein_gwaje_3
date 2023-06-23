const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

// 로그인 API
router.post("/", async (req, res) => {
  const { nickname, password } = req.body;

  // 닉네임이 일치하는 유저를 찾는다
  const user = await User.findOne({ nickname });

  // 일치하는 nickname을 가진 유저가 없거나
  // 유저의 패스워드와 입력받은 패스워드가 다를때
  if (!user || user.password !== password) {
    res
      .status(400)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요" });
    return;
  }

  // 예외 케이스 -> errorMessage: "로그인에 실패하였습니다."

  // JWT 생성
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;
