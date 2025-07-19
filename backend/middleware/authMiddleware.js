import JWT from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // console.log("Auth Header:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded User:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token", err });
  }
};
