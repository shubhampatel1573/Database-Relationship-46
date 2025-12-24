const mongoose = require("mongoose");
const { Schema } = require("mongoose");

main().then(() => console.log("DB CONNECTED")).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const customerSchema = new Schema({
    name: String,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        }
    ]
})

// customerSchema.pre("findOneAndDelete", async () => {
//     console.log("PRE MIDDLEWARE");
// })

customerSchema.post("findOneAndDelete", async (customer) => {
    if (customer.orders.length) {
        let res = await Order.deleteMany({ _id: { $in: customer.orders } })
        console.log(res);
    }
})

const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

const addCustomer = async () => {
    // let cus1 = new Customer ({
    //     name : "Rahul"
    // })

    // let order1 = await Order.findOne({item: "Chips"});
    // let order2 = await Order.findOne({item: "Chocolates"});

    // cus1.orders.push(order1);
    // cus1.orders.push(order2);

    // let result = await cus1.save();
    // console.log(result);

    let result = await Customer.find({}).populate("orders");
    console.log(result[0]);

}

// addCustomer()


// const addOrders = async () => {
//     let result = await Order.insertMany([
//         {item: "samosa", price:12},
//         {item: "Chips", price:10},
//         {item: "Chocolates", price:40}
//     ]
//     );
//     console.log(result)
// }

// addOrders();



// Mongoose Middleware
const addCust = async () => {
    let newCust = new Customer({
        name: "Karan Arjun",
    });

    let newOrder = new Order({
        item: "Bruger",
        price: 250
    })

    newCust.orders.push(newOrder);

    await newOrder.save();
    await newCust.save();

    console.log("added new Customer");
}

const delCust = async () => {
    let data = await Customer.findOneAndDelete("694c0fdacc6e9cabb82acd01");
    console.log(data);
}

// addCust();


