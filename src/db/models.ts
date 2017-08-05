import Sequelize = require('sequelize');

var secrets;
try {
  secrets = require('./../../secrets.json')
} catch (e) {
  console.error('Create your own secrets file lazybones');
  secrets = require('./../../secret-sample.json');
}

const DATABASE_URL = process.env.DATABASE_URL || ('postgres://' + secrets.DB_USER + ":" + secrets.DB_PASSWORD + "@" + secrets.DB_HOST + ":5432/" + secrets.DATABASE);

const db = new Sequelize(DATABASE_URL);

const User = db.define('user', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
  , name: Sequelize.STRING
  , email: Sequelize.STRING
  , contact: Sequelize.STRING
  , designation: Sequelize.STRING
  , centre: Sequelize.STRING
});

const Lead = db.define('lead', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
    , name: {type: Sequelize.STRING, allowNull: false}
    , email: {type: Sequelize.STRING, allowNull: false}
    , contact: {type: Sequelize.STRING, allowNull: false}
    , dob: Sequelize.STRING
    , gaurdianName: Sequelize.STRING
    , gaurdianContact: Sequelize.STRING
    , gaurdianEmail: Sequelize.STRING
    , college: Sequelize.STRING
    , branch: Sequelize.STRING
    , university: Sequelize.STRING
    , collegeBatch: Sequelize.STRING
    , address: Sequelize.STRING
    , city: Sequelize.STRING
    , state: Sequelize.STRING
    , pincode: Sequelize.STRING
    , coursesOfInterest: Sequelize.ARRAY(Sequelize.INTEGER)
    , centresOfInterest: Sequelize.ARRAY(Sequelize.INTEGER)
    , referrer: Sequelize.ARRAY(Sequelize.STRING)
    , VMCRollNumber: Sequelize.STRING
    , CBRollNumber: Sequelize.STRING
    , cbStudentReferral: Sequelize.JSON
    /*
     Expected Structure:
     {
     id: Sequelize.STRING
     , name: Sequelize.STRING
     }
     */
    , status: {type: Sequelize.ENUM('New','Interested','Uninterested','Enrolled','Untracked'), allowNull: false, defaultValue:'New'}
});

const Comment = db.define('comment', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
  , comment: Sequelize.STRING(1234)
});

Comment.belongsTo(Lead);
Comment.belongsTo(User);
Lead.hasMany(Comment);
User.hasMany(Comment);

const Centre = db.define('centre', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
  , name: {type: Sequelize.STRING, allowNull: false, unique: true}
});

const Course = db.define('course', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
  , name: {type: Sequelize.STRING, allowNull: false, unique: true}
});

const models = {
  User
  , Lead
  , Comment
  , Centre
  , Course
};

export default db;
export {models}
