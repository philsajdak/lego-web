const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const themeSchema = new mongoose.Schema({
  name: String
}, { timestamps: false });

const setSchema = new mongoose.Schema({
  set_num: { type: String, required: true, unique: true },
  name: String,
  year: Number,
  num_parts: Number,
  theme_id: { type: String, ref: 'Theme' },
  img_url: String
}, { timestamps: false });

const Theme = mongoose.model('Theme', themeSchema);
const Set = mongoose.model('Set', setSchema);

async function Initialize() {
  console.log('Database initialized');
}

function getAllSets() {
  return Set.find().populate('theme_id');
}

function getSetByNum(setNum) {
  return Set.findOne({ set_num: setNum }).populate('theme_id').then(set => {
    if (!set) throw new Error(`Error, couldn't find set ${setNum}`);
    return set;
  });
}

function getSetsByTheme(theme) {
  return Theme.findOne({ name: new RegExp(theme, 'i') }).then(themeDoc => {
    if (!themeDoc) throw new Error(`Error, couldn't find ${theme}`);
    return Set.find({ theme_id: themeDoc._id }).populate('theme_id');
  });
}

function addSet(setData) {
  return Set.create(setData);
}

function getAllThemes() {
  return Theme.find();
}

function editSet(set_num, setData) {
  return Set.findOneAndUpdate({ set_num: set_num }, setData, { new: true }).then(updatedSet => {
    if (!updatedSet) throw new Error('No set found.');
    return updatedSet;
  });
}

function deleteSet(set_num) {
  return Set.findOneAndDelete({ set_num: set_num }).then(deletedSet => {
    if (!deletedSet) throw new Error('Set not found.');
    return deletedSet;
  });
}

module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet };
