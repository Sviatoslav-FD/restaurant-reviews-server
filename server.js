require("dotenv").config()

const express = require("express")
const cors = require("cors")
const db = require('./db')
const app = express()

app.use(cors())
app.use(express.json())

// Get All Restaurants
app.get(process.env.URL, async (req, res) => {
  try {
    const restaurants = (await db.query("select * from restaurants;")).rows
  
    res.status(200).json({
      status: "success",
      length: restaurants.length,
      restaurants
    })
  } catch (e) { console.log(e) }
})

// Get Exact Restaurant
app.get(`${process.env.URL}/:id`, async (req, res) => {
  try {
    const restaurant = (await db.query("select * from restaurants where id = $1", [req.params.id])).rows[0]

    const reviews = (await db.query("select * from reviews where restaurant_id = $1", [req.params.id])).rows
  
    res.status(200).json({ status: "success", restaurant, reviews })
  } catch (e) { console.log(e) }
})

// Create Restaurant
app.post(process.env.URL, async (req, res) => {
  try {
    const restaurant = (await db.query(
      "insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *;",
      Object.values(req.body)
    )).rows[0]

    res.status(200).json({ status: "success", restaurant })
  } catch (e) { console.log(e) }
})

// Update Restaurant
app.put(`${process.env.URL}/:id`, async (req, res) => {
  try {
    const restaurant = (await db.query(
      "update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *;",
      [...Object.values(req.body), req.params.id]
    )).rows[0]

    res.status(200).json({ status: "success", data: { restaurant } })
  } catch (e) { console.log(e) }
})

// Delete Restaurant
app.delete(`${process.env.URL}/:id`, async (req, res) => {
  try {
    await db.query("delete from restaurants where id = $1", [req.params.id])
    res.status(204).json({ status: "success" })
  } catch (e) { console.log(e) }
})

const port = process.env.PORT || 3005
app.listen(port, () => console.log(`server listening on port ${port}`)) 