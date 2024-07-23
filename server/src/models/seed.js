
import "../utils/dbConnect.js"
import mongoose from "mongoose"
import TasksModel from "./Tasks.js"
import fs from "fs"


async function seed(){
	let data = JSON.parse(fs.readFileSync("./data.json"));
	await TasksModel.insertMany(data);
}

seed();