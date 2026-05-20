const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, chatController.startConversation);
router.get("/unread-count", protect, chatController.getUnreadCount);
router.put("/:conversationId/read", protect, chatController.markMessagesAsRead);
router.get("/:conversationId/messages", protect, chatController.getMessages);
router.post("/message", protect, chatController.sendMessage);
router.get("/", protect, chatController.getConversations);

module.exports = router;