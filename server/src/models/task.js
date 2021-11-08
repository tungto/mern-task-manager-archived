const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
	{
		
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		priority: {
			type: String,
			required: true,
			default: 'normal',
		},
		dueDate: {
			type: Date,
			required: true,
			default: new Date(),
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
