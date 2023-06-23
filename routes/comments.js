const express = require("express"); // express를 할당받는다
const router = express.Router(); // 객체 express 안에 있는 함수 Router()를 실행시켜 그 값을 변수 router에 할당한다

const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware.js");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

router // localhost:3000/comments/:postid
  .route("/:postId")
  .get(async (req, res) => {
    const { postId } = req.params;

    if (!ObjectId.isValid(postId)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const result = await Comment.find({ postId }).sort({ updatedAt: -1 });
    res.send(
      result.map((r) => {
        return {
          commentId: r._id,
          user: r.user,
          content: r.content,
          createdAt: r.createdAt,
        };
      })
    );
  })
  .post(authMiddleware, async (req, res) => {
    // 댓글 작성 api

    const { nickname, password } = res.locals.user;
    const { postId } = req.params;
    const { content } = req.body;

    if (!ObjectId.isValid(postId)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    if (!nickname || !password) {
      res.status(403).json({ errorMessage: "로그인 후 사용 가능합니다." });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    if (!postId) {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      return;
    }

    await Comment.create({ content });
    res.status(200).json({ message: "댓글을 작성하였습니다." });
  });

router
  .route("/:id") // localhost:3000/comments/:id
  .put(authMiddleware, async (req, res) => {
    const { nickname, password } = res.locals.user;
    const { id } = req.params;
    const { content } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    if (!nickname || !password) {
      res
        .status(403)
        .json({ errorMessage: "댓글의 수정 권한이 존재하지 않습니다." });
      return;
    }

    if (!id) {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    await Comment.updateOne({ _id: id }, { content });
    res.status(200).json({ message: "댓글을 수정하였습니다." });
  })
  .delete(authMiddleware, async (req, res) => {
    // 댓글 삭제 API
    const { nickname, password } = res.locals.user;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    if (!nickname || !password) {
      res.status(403).json({ errorMessage: "로그인 후 사용 가능합니다." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
      return;
    }

    await Comment.deleteOne({ _id: id });
    res.status(200).json({ message: "댓글을 삭제하였습니다." });
  });

module.exports = router;
// 위 내용을 app.js로 보내기 위한 export
