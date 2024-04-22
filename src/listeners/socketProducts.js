import ProductManager from "../dao/manager/products.dao.js";
const pm = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected")
        const listadeproductos = await pm.getAll()
        socketServer.emit("enviodeproducts", listadeproductos)

        socket.on("addProduct", async (obj) => {
            await pm.create(obj)
            const listadeproductos = await pm.getAll()
            socketServer.emit("enviodeproducts", listadeproductos)
        })

        socket.on("deleteProduct", async (id) => {
            console.log(id)
            await pm.delete(id)
            const listadeproductos = await pm.getAll()
            socketServer.emit("enviodeproducts", listadeproductos)
        })

        socket.on("nuevousuario", (usuario) => {
            console.log("usuario", usuario)
            socket.broadcast.emit("broadcast", usuario)
        })
        socket.on("disconnect", () => {
            console.log(`Usuario esta desconectado `)
        })

    })
};

export default socketProducts;