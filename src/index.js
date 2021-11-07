const express = require('express');
require('./db/mongoose');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	if (req.method === "GET") {
// 		res.send("Get request are diabled");
// 	} else {
// 		next();
// 	}
// });

// app.use((req, res, next) => {
// 	res.status(503).send("Site is current down check back soon");
// 	// next();
// });

// const multer = require('multer');
// const upload = multer({
//   dest: 'images',
//   limits: { fileSize: 1000000 },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('Please upload a Word'));
//     }
//     cb(undefined, true);

//     // cb(new Error('File not support'));

//     // cb(undefined, false);
//   },
// });

// const errorMiddleware = (req, res, next) => {
//   throw new Error('from my middleware');
// };

// app.post(
//   '/upload',
//   upload.single('upload'),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server is up on port' + port);
});

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
// 	const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {
// 		expiresIn: '7 days',
// 	});
// 	const data = jwt.verify(token, 'thisismynewcourse');
// 	console.log(data);
// };

// myFunction();

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   // const task = await Task.findById('61841f0c95bec6129c6940c0');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);
//   //   const user = await User.findById('61841e06a8d7b823d47a5fc7');
//   //   await user.populate('tasks').execPopulate();
//   //   console.log(user.tasks);
// };

// main();
