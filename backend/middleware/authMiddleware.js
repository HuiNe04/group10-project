const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Thiếu token trong header" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token không hợp lệ" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
