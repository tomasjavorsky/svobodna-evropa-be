const express = require("express");
const cors = require("cors");
const mockArticles = require("./mockArticles");
const { trimText } = require("./functions");

const app = express();
const port = 4000;
var articles = mockArticles;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/articles", (req, res) => {
  //ID
  if (req.query.id) {
    const article = articles.find((a) => a.id === req.query.id);
    if (!article) {
      res.status(400).send({ message: "Article with that id does not exist" });
    }
    setTimeout(() => {
      res.json(article);
    }, 1000);
    //SEARCH
  } else if (req.query.search) {
    const searchResult = articles.filter((a) =>
      a.title.includes(req.query.search)
    );
    //SEARCH + SORT
    if (req.query.sort) {
      searchResult.sort((a, b) =>
        a[req.query.sort].localeCompare(b[req.query.sort])
      );
    }
    setTimeout(() => {
      res.json(trimText(searchResult));
    }, 1000);
    //SORT
  } else if (req.query.sort) {
    const sortedArticles = [...articles];
    sortedArticles.sort((a, b) =>
      a[req.query.sort].localeCompare(b[req.query.sort])
    );
    setTimeout(() => {
      res.json(trimText(sortedArticles));
    }, 1000);
  } else {
    setTimeout(() => {
      res.json(trimText(articles));
    }, 1000);
  }
});

app.put("/articles", (req, res) => {
  if (req.body) {
    articles = articles.map((originalArticle) =>
      originalArticle.id === req.body.id ? req.body : originalArticle
    );
    setTimeout(() => {
      res.sendStatus(202);
    }, 1000);
  } else {
    setTimeout(() => {
      res.status(400).send({
        message: "Cold not update article, body of the request is empty",
      });
    }, 1000);
  }
});

app.post("/articles", (req, res) => {
  if (req.body) {
    articles.push(req.body);
    setTimeout(() => {
      res.sendStatus(201);
    }, 1000);
  } else {
    setTimeout(() => {
      res.status(400).send({
        message: "Cold not create article, body of the request is empty",
      });
    }, 1000);
  }
});

app.delete("/articles", (req, res) => {
  if (req.body.id) {
    if (articles.some((a) => a.id === req.body.id)) {
      articles = articles.filter((a) => a.id !== req.body.id);
      setTimeout(() => {
        res.sendStatus(200);
      }, 1000);
    } else {
      setTimeout(() => {
        res.status(400).send({
          message:
            "Cold not delete article. No article with provided id exists",
        });
      }, 1000);
    }
  } else {
    setTimeout(() => {
      res
        .status(400)
        .send({ message: "Cold not delete article. No article id provided" });
    }, 1000);
  }
});

app.listen(port, () => {
  console.log(`Article server running at: http://localhost:${port}`);
});
