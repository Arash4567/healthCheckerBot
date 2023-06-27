require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TOKEN, SERVER_URL, CHAT_ID } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

async function healthCheck() {
  await axios
    .get("http://terrapro.bulavka.uz:8089/settings/healthcheck")
    .then(async (res) => {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: CHAT_ID,
        text: res.data,
      });
    })
    .catch(async (err) => {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: CHAT_ID,
        text: err.message,
      });
    });
}

const init = async () => {
  await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`).then((res) => {
    console.log(res.data);
  }).catch((err) => {
    console.log(err.message);
  })
  setInterval(async () => {
    await healthCheck();
  }, 10 * 60 * 1000);
};

app.listen(process.env.PORT || 5000, async () => {
  console.log("App running on port ", process.env.PORT || 5000);
  await init();
});
