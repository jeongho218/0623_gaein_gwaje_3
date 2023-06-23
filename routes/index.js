const express = require("express"); // express를 할당받는다
const router = express.Router(); // 객체 express 안에 있는 함수 Router()를 실행시켜 그 값을 변수 router에 할당한다
const postsRouter = require("./posts");
const commentsRouter = require("./comments");
const userRouter = require("./users");
const authRouter = require("./auth");

const defaultRoutes = [
  {
    path: "/posts",
    route: postsRouter,
  },
  {
    path: "/comments",
    route: commentsRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
