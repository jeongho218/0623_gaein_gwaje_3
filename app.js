const express = require("express");

// schemas를 불러오는 부분
const connect = require("./schemas");
// const connect = require("./schemas/index.js");
// 이 부분에서 index.js는 생략하였다.
// node.js에서는 폴더의 경로까지 지정하였을 경우 해당 폴더안에 있는 index.js를 자동적으로 가져오기 때문이다.

// routes를 불러오는 부분
const routes = require("./routes");
const cookieParser = require("cookie-parser");
// /routes/index.js로 가도록 설정

const app = express();
const port = 3000;

connect(); // mongoose를 이용해 MongoDB 서버와 DB에 연결한다.

app.use(express.json()); // express에서 미들어웨를 사용하는 방법. body를 통해 들어오는 JSON 형식의 요청 내용을 JS 객체로 변환한다.
app.use(express.urlencoded({ extended: false })); // URL encoded 형식의 요청 본문을 해석하기 위한 미들웨어, 브라우저에 접속했을때 폼 데이터를 받을 수 있도록 함
app.use(express.static("assets")); // API를 사용하기 이전에 이 미들웨어에서 assets 폴더에 있는 파일을 먼저 찾아봄
// 백엔드만 개발하는게 과제 내용이라 이 부분도 넣어줘야할지 아닐지 확실하지 않아 일단 넣었음
app.use(cookieParser());

// app.use("/api", routes);
app.use("/", routes);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
