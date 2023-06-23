const express = require("express"); // express를 할당받는다
const router = express.Router(); // 객체 express 안에 있는 함수 Router()를 실행시켜 그 값을 변수 router에 할당한다

const Post = require("../schemas/post");
const authMiddleware = require("../middlewares/auth-middleware.js");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

router
  .route("/") // localhost:3000/posts
  .get(async (req, res) => {
    // 게시글 조회, READ

    //  제목, 작성자명(nickname), 작성 날짜를 조회하기
    const result = await Post.find({}).sort({ createdAt: -1 }); // 조회할때 createdAt를 기준으로 내림차순으로 정렬한다.
    res.send(
      result.map((r) => {
        return {
          postId: r._id,
          // userId: r.user,
          title: r.title,
          // nickname: .nickname,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      })
    );
  })
  .post(authMiddleware, async (req, res) => {
    // 게시글 생성 API
    const { nickname, password } = res.locals.user;
    const { title, content } = req.body;

    if (!nickname || !password) {
      res.status(400).json({ errorMessage: "로그인 후 사용 가능합니다." });
      return;
    }

    if (!title || !content) {
      res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    await Post.create({ title, content });
    res.status(200).json({ message: "게시글을 생성하였습니다." });
  });

router
  .route("/:id") // localhost:3000/posts/:id
  .get(async (req, res) => {
    // 상품 상세 조회 API
    // to-be: 제목 title, 작성자명 nickname, 작성 날짜 createdAt, 작성 내용 content
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    } else {
      const result = await Post.findOne({ _id: id });

      if (result) {
        res.send({
          postId: result._id,
          user: result.user,
          // -> userId: result.
          // nickname:
          title: result.title,
          content: result.content,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        });
      } else {
        res.status(400).json({ message: "게시글 조회에 실패하였습니다." });
      }
    }
  })
  .put(authMiddleware, async (req, res) => {
    // 게시글 수정 API
    const { nickname, password } = res.locals.user;
    const { title, content } = req.body;
    const { id } = req.params;

    if (!nickname || !password) {
      res.status(403).json({ errorMessage: "로그인 후 사용 가능합니다." });
      return;
    }

    if (!title || !content) {
      res.status(412).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "게시글 조회에 실패했습니다." });
      return;
    }
    await Post.updateOne({ _id: id }, { title, content });
    res.status(200).json({ message: "게시글을 수정하였습니다." });
  })
  .delete(authMiddleware, async (req, res) => {
    // 게시글 삭제 API
    const { nickname, password } = res.locals.user;
    const { id } = req.params;

    if (!nickname || !password) {
      res.status(403).json({ errorMessage: "로그인 후 사용 가능합니다." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "게시글 조회에 실패했습니다." });
      return;
    }

    await Post.deleteOne({ _id: id });
    res.status(200).json({ message: "게시글을 삭제하였습니다." });
  });

module.exports = router;
// 위 내용을 app.js로 보내기 위한 export
