function getTime(req, res, next) {
  console.log(new Date().toLocaleString());
  next();
}

function removeXPoweredBy(req, res, next) {
  res.removeHeader("x-powered-by");
  next();
}

function checkId(req, res, next) {
  const { id } = req.params;
  if (Number(id)) {
    next();
  } else {
    res.status(400).send(`Неверный тип данных для id. Отработала мидлварка!!!`);
  }
}

function checkUser(req, res, next) {
  const {
    user_name: usernameQuery,
    password: passwordQuery,
    email: emailQuery,
  } = req.query;
  const {
    user_name: usernameBody,
    password: passwordBody,
    email: emailBody,
  } = req.body;
  if (
    (usernameQuery && passwordQuery && emailQuery) ||
    (usernameBody && passwordBody && emailBody)
  ) {
    next();
  } else {
    res
      .status(409)
      .send("Все поля должны быть заполнены. Отработала мидлварка!");
  }
}

module.exports = { getTime, removeXPoweredBy, checkId, checkUser };
