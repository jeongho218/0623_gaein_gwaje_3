const mongoose = require("mongoose");
// mongoose 패키지를 가져와 변수 mongoose에 할당한다.

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Gaein_Gwaje") // mongoose로 연결할 mongoDB 서버와 DB를 입력한다.
    // 주소는 localhost도 가능하지만 127.0.0.1로 적는 편이 좋다.
    .catch((err) => console.log(err));
  // MongoDB에 연결시 실패하였을 경우 err 로그를 남긴다.
};

mongoose.connection.on("error", (err) => {
  // MongoDB에 연결이 실패하였을 경우 에러 로그 발생
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
// 위 내용을 app.js에서 쓰기위한 exports
