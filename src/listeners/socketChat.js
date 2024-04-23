import MessagesManager from "../dao/manager/messages.dao.js";
import logger from "../logger.js";
const messagesManager = new MessagesManager();

const socketChat = (socketServer) => {
    socketServer.on("connection", async (socket) => {

    socket.on("mensaje", async (info) => {
        logger.info(info)
        await messagesManager.createMessage(info);
        socketServer.emit("chat", await messagesManager.getMessages());
    })

    socket.on("clearchat", async () => {
        await messagesManager.deleteAllMessages();
        socketServer.emit("chatCleared");
    });

    })
};

export default socketChat;