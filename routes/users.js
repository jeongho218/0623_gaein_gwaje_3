const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 내 정보 조회 API, 로그인 확인 용도, 과제 내용 아님
// localhost:3000/users/me
router.get("/me", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;

  res.status(200).json({
    user: {
      nickname: nickname,
    },
  });
});

// 회원가입 API
// localhost:3000/users
router.post("/", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  // 1. 닉네임 조건은 3자 이상, 알파벳 대소문자, 숫자 조합
  // 닉네임 형식이 비정상적인 경우
  // -> "닉네임의 형식이 일치하지 않습니다."
  // [a-zA-Z0-9]를 쓰면 될것 같은데 이걸 boolean 형태로 뽑아내는 방법을 모르겠다
  if (nickname < 3) {
    res
      .status(412)
      .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    return;
  }

  // 2. DB에 동일한 닉네임이 존재할 경우 실패, 에러 출력 (성공)
  // 입력한 nickname이 DB에 존재하는 검증
  const isExistUser = await userSchema.findOne({ nickname });
  if (isExistUser) {
    res.status(412).json({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  // 3. 패스워드 최소 4자 이상이며 닉네임을 포함할 경우 실패 (성공)
  if (password.length < 5 || password.includes(nickname)) {
    res
      .status(412)
      .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    return;
  }

  // 4. password와 confirm이 일치하는지 검증 (성공)
  if (password !== confirm) {
    res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
    return;
  }

  // 5. 400 예외 케이스에서 처리하지 못한 에러
  // errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
  // 닉네임을 "   " 이럴 경우?
  //   if (nickname.includes("  ")) {
  //     res
  //       .status(400)
  //       .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  //     return;
  //   }

  const user = new userSchema({ nickname, password });
  await user.save(); // DB에 저장, studio 3t에서 확인함, 성공

  return res // 성공시 안내 메세지 출력, 성공
    .status(201)
    .json({ message: "회원가입에 성공하였습니다.", status: 201 });
});

module.exports = router;
