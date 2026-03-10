const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role, // single primary role
      roles: decoded.roles || [decoded.role], // multi-role support
      collegeId: decoded.collegeId
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    const userRoles = req.user.roles || [];

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles
};