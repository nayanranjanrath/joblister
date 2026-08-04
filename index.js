import express from "express"
import routes from "./routes/routes.js"
const app = express()
app.use(routes)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})



async function shutdown() {
    console.log("Closing Prisma...");
    await prisma.$disconnect();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);