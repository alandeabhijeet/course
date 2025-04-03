const express = require("express");
const { signup, login, logout , checkOwner ,deleteOwnerIdFromUser , checkBuyer , sendCourseBuyerId , sendCourseOwnerId} = require("../controllers/authControllers");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
router.post("/signup",signup );
router.post("/login",login );
router.post("/logout",verifyToken ,  logout);
const User = require("../models/User");
router.get("/checkowner" ,verifyToken ,  checkOwner); 
router.get("/checkbuyer" ,verifyToken ,  checkBuyer);

router.delete("/deleteowneridfromuser" ,verifyToken ,  deleteOwnerIdFromUser);

router.get("/sendcoursebuyerid" ,verifyToken ,  sendCourseBuyerId);
router.get("/sendcourseownerid" ,verifyToken ,  sendCourseOwnerId);



router.get("/verify-token", verifyToken, (req, res) => {
    res.json({ userId: req.user.id });
});

router.post("/add-owner-course", verifyToken, async (req, res) => {
    try {
        console.log("Add owner course called");
      const { userId, courseId } = req.body;
        console.log("User ID:", userId); // Debugging line
        console.log("Course ID:", courseId); // Debugging line
      if (!userId || !courseId) {
        return res.status(400).json({ message: "Missing userId or courseId" });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.owner.push(courseId);
      await user.save();
  
      res.json({ message: "Course added to owner", user });
    } catch (error) {
      console.error("❌ Error adding course to owner:", error.message);
      res.status(500).json({ message: error.message });
    }
  });
  

router.post("/add-buy-course", verifyToken, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.buy_course.includes(courseId)) {
            return res.status(400).json({ message: "Course already purchased" });
        }

        user.buy_course.push(courseId);
        await user.save();

        res.json({ message: "Course added to purchased list", buyCourseIds: user.buy_course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
