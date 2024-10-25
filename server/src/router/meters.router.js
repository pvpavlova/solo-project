const router = require("express").Router();
const { Meter } = require("../../db/models");
const { checkId } = require("../middleware/common");

router.get("/", async function (req, res) {
  try {
    const Meter = await Meter.findAll();
    res.send(Meter);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
});
router.get("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.query;
    const newMeter = await Meter.create({ category, value, user_id, date });
    res.json(newMeter);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.body;
    const newMeter = await Meter.create({ category, value, user_id, date });
    res.json(newMeter);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.get("/:id", checkId, async (req, res) => {
  const { id } = req.params;
  try {
    const Meter = await Meter.findOne({ where: { id } });
    if (Meter) {
      res.send(Meter);
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
    await Meter.destroy({ where: { id } });
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
    await Meter.update({ category, value, user_id, date }, { where: { id } });
    res.json(`Запись с id: ${id} успешно обновлена.`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка редактирования одной записи:", error.message);
  }
});
module.exports = router;