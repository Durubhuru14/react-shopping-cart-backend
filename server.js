require("dotenv").config();

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is alive 🚀");
});

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  const lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/canceled`,
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(3000, () => console.log("The server listening on port 3000"));
