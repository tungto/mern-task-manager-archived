const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

// const Task = mongoose.model('Task', {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     completed: Boolean,
//     default: false,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
// });

taskSchema.pre('save', async function (next) {
	const task = this;
	if (task.isModified('description')) {
		console.log('task modifies description');
	}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
