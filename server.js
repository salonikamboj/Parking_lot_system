const express = require("express")
const app = express()

const HTTP_PORT = process.env.PORT || 8080

const path = require("path")

// - extract data sent by <form> element in the client
app.use(express.urlencoded({ extended: true }))
app.use(express.static("assets"))


let paymentList = []
app.get("/", (req, res) => {
    console.log(req.params)
    res.sendFile(path.join(__dirname, "home.html"))
})
app.get("/admin", (req, res) => {
    console.log(req.params)
    res.sendFile(path.join(__dirname, "admin.html"))
})
app.post("/pay", (req, res) => {
    console.log("[DEBUG] POST request received at the / endpoint")
    console.log("Data received from form is:")
    console.log(req.body)
    const parkinglot = req.body.parkingLot
    const numhours = req.body.hours
    const licensePlate = req.body.licPlate
    const Numhrs = parseInt(numhours)
    let parkingrate = 0
    if (licensePlate === "" || numhours === "") {
        res.send("<p style='border:1px solid yellow; background-color:yellow; color:red; font-weight:bold; padding-left:10px'>ERROR: Licence plate and parking hours must be provided</p>")
    }
    if (isNaN(Numhrs) === true) {
        res.send("<p style='border:1px solid yellow; background-color:yellow; color:red; font-weight:bold; padding-left:10px'>ERROR:number of hpurs should be in digit</p>")
        return
    }
    if (Numhrs > 8) {
        res.send("<p style='border:1px solid yellow; background-color:yellow; color:red; font-weight:bold; padding-left:10px'>Error:The maximum number of hour is 8</p>")
        return
    }
    else if (Numhrs < 1) {
        res.send("<p style='border:1px solid yellow; background-color:yellow; color:red; font-weight:bold; padding-left:10px'>ERROR:The minimum number of hour is 1</p>")
    }
    if (parkinglot === "Parking Lot A($2.50 per hr)") {
        parkingrate = 2.50
    }
    else if (parkinglot === "Parking Lot B($1.00 per hr)") {
        parkingrate = 1.00
    }
    else if (parkinglot === "Underground garage parking($5.00 per hr)") {
        parkingrate = 5.00
    }
    const subtotal = parkingrate * Numhrs
    const tax = subtotal + (0.13 * subtotal)
    const total = subtotal + tax
    const payment = { license: licensePlate, Totalpay: total }
    paymentList.push(payment)
    res.send(`<h1>Your Receipt</h1>
    <p> Hours requested: ${Numhrs} </p>
    <p> Hourly Rate: $ ${parkingrate.toFixed(2)} </p>
    <p> Subtotal: $ ${subtotal.toFixed(2)}</p>
     <p> Tax: $ ${tax.toFixed(2)} </p>
    <p> Total: $ ${payment.Totalpay.toFixed(2)}   </p>
    <p style=' font-weight:bold'> You must pay: $ ${payment.Totalpay.toFixed(2)} </p>`)
})

app.post("/login", (req, res) => {
    console.log("[DEBUG] POST request received at the /admin endpoint")
    console.log("Data received from form is:")
    console.log(req.body)
    const Username = req.body.username
    const Password = req.body.password
    let totalfees = 0
    let numCars = paymentList.length
    if (Username != "admin" || Password != "0000") {
        res.send("<p style='border:1px solid yellow; background-color:yellow; color:red; font-weight:bold; padding-left:10px'>ERROR:Login failed</p>")
        return
    }
    for (let i = 0; i < paymentList.length; i++) {
        totalfees += paymentList[i].Totalpay
    }
    res.send(`<p>Total Cars: ${numCars}</p>
    <p>Total amount collected: $${totalfees.toFixed(2)}</p>`)
})
const onHttpStart = () => {

    console.log(`Express web server running on port: ${HTTP_PORT}`)
    console.log(`Press CTRL+C to exit`)
}

app.listen(HTTP_PORT, onHttpStart)