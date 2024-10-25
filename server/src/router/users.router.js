const router = require("express").Router();
const { User } = require("../../db/models");
const { checkId, checkUser } = require("../middleware/common");

router.get("/", async function (req, res) {
  try {
    const user = await User.findAll();
    res.send(user);
  } catch (error) {
    console.log(" error", error);
    res.status(500).send(error.message);
  }
});
router.get("/new", checkUser, async (req, res) => {
  try {
    const { user_name, password, email } = req.query;
    const newUser = await User.create({ user_name, password, email });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.post("/new", checkUser, async (req, res) => {
  try {
    const { user_name, password, email } = req.body;
    const newUser = await User.create({ user_name, password, email });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.get("/:id", checkId, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      res.send(user);
    } else {
      res.send(`Запись с id: ${id} не найдена`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка получения одной записи:", error.message);
  }
});

router.delete("/:id", checkId, async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.status(200).send("Запись успешно удалена.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка удаления одной записи:", error.message);
  }
});

router.put("/:id", checkId, checkUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, password, email } = req.body;
    await User.update({ user_name, password, email }, { where: { id } });
    res.json(`Запись с id: ${id} успешно обновлена.`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка редактирования одной записи:", error.message);
  }
});
module.exports = router;
