const router = require("express").Router();
const { Income } = require("../../db/models");
const { checkId } = require("../middleware/common");

router.get("/", async function (req, res) {
  try {
    const income = await Income.findAll();
    res.send(income);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
});
router.get("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.query;
    const newIncome = await Income.create({ category, value, user_id, date });
    res.json(newIncome);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});
router.post("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.body;
    const newIncome = await Income.create({ category, value, user_id, date });
    res.json(newIncome);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.get("/:id", checkId, async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findOne({ where: { id } });
    if (income) {
      res.send(income);
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
    await Income.destroy({ where: { id } });
    res.status(200).send("Запись успешно удалена.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка удаления одной записи:", error.message);
  }
});

router.put("/:id", checkId, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value, user_id, date } = req.body;
    await Income.update({ category, value, user_id, date }, { where: { id } });
    res.json(`Запись с id: ${id} успешно обновлена.`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка редактирования одной записи:", error.message);
  }
});
module.exports = router;
