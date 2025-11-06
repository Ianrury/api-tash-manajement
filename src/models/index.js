import User from './User.js';
import Task from './Task.js';

User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'tasks',
});

Task.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Task.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator',
});

export { User, Task };
