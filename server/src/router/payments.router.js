const router = require("express").Router();
const { Payment } = require("../../db/models");
const { checkId } = require("../middleware/common");

router.get("/", async function (req, res) {
  try {
    const Payment = await Payment.findAll();
    res.send(Payment);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
});
router.get("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.query;
    const newPayment = await Payment.create({ category, value, user_id, date });
    res.json(newPayment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { category, value, user_id, date } = req.body;
    const newPayment = await Payment.create({ category, value, user_id, date });
    res.json(newPayment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка создания одной записи:", error.message);
  }
});

router.get("/:id", checkId, async (req, res) => {
  const { id } = req.params;
  try {
    const Payment = await Payment.findOne({ where: { id } });
    if (Payment) {
      res.send(Payment);
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
    await Payment.destroy({ where: { id } });
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
    await Payment.update({ category, value, user_id, date }, { where: { id } });
    res.json(`Запись с id: ${id} успешно обновлена.`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка редактирования одной записи:", error.message);
  }
});
module.exports = router;
