import express from 'express';
import fs, { read } from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
 
const readData = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
}

const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

readData();

app.get("/", (req, res) => {
    res.send("Welcome to my first API 🚀");
})

app.get("/food", (req, res) => {
    const data = readData();
    res.json(data.food);
})

// app.get("/food/:id", (req, res) => {
//     const data = readData();
//     const id = parseInt(req.params.id);
//     const food = data.food.find((food) => food.id === id);
//     res.json(food);
// });

//Obtener por nombre del alimento

app.get("/food/:name", (req, res) => {
    const data = readData();

    const name = req.params.name.toLowerCase();

    const foods = data.food.filter((food) => {
        return food.name.toLowerCase().includes(name);
    });

    res.json(foods);
});

app.post("/food", (req, res) => {
    const data = readData();
    const body = req.body;
    const newFood = {
        id: data.food.length + 1,
        ...body
    };
    data.food.push(newFood);
    writeData(data);
    res.json(newFood); 
});

app.put("/food/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const foodIndex = data.food.findIndex((food) => food.id === id);
    data.food[foodIndex] = {
        ...data.food[foodIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Food updated successfully" });
});

app.delete("/food/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const foodIndex = data.food.findIndex((food) => food.id === id);
    data.food.splice(foodIndex, 1);
    writeData(data);
    res.json({ message: "Food deleted successfully" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});