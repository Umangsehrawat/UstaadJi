const pool = require("../config/db");

exports.startConversation = async (req, res) => {
  try {
    const { ad_id, seller_id } = req.body;
    const buyer_id = req.user.id;

    if (!ad_id || !seller_id) {
      return res.status(400).json({ message: "Ad and seller are required" });
    }

    const existing = await pool.query(
      `
      SELECT * FROM conversations
      WHERE buyer_id = $1 AND seller_id = $2 AND ad_id = $3
      `,
      [buyer_id, seller_id, ad_id]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await pool.query(
      `
      INSERT INTO conversations (buyer_id, seller_id, ad_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [buyer_id, seller_id, ad_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start conversation" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const result = await pool.query(
      `
      SELECT messages.*, users.name AS sender_name
      FROM messages
      LEFT JOIN users ON messages.sender_id = users.id
      WHERE conversation_id = $1
      ORDER BY messages.created_at ASC
      `,
      [conversationId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, message } = req.body;

    if (!conversation_id || !message) {
      return res.status(400).json({ message: "Conversation and message are required" });
    }

    const result = await pool.query(
      `
      INSERT INTO messages (conversation_id, sender_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [conversation_id, req.user.id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        conversations.*,
        ads.title AS ad_title,
        ads.price AS ad_price,
        buyer.name AS buyer_name,
        seller.name AS seller_name,
        (
          SELECT message
          FROM messages
          WHERE messages.conversation_id = conversations.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT created_at
          FROM messages
          WHERE messages.conversation_id = conversations.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_message_at
      FROM conversations
      LEFT JOIN ads ON conversations.ad_id = ads.id
      LEFT JOIN users buyer ON conversations.buyer_id = buyer.id
      LEFT JOIN users seller ON conversations.seller_id = seller.id
      WHERE conversations.buyer_id = $1 OR conversations.seller_id = $1
      ORDER BY conversations.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT COUNT(*) AS unread_count
      FROM messages
      JOIN conversations ON messages.conversation_id = conversations.id
      WHERE messages.sender_id != $1
      AND messages.is_read = false
      AND (conversations.buyer_id = $1 OR conversations.seller_id = $1)
      `,
      [userId]
    );

    res.json({
      unread_count: Number(result.rows[0].unread_count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await pool.query(
      `
      UPDATE messages
      SET is_read = true
      WHERE conversation_id = $1
      AND sender_id != $2
      `,
      [conversationId, userId]
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};