const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: true }
));

mongoose.connect('mongodb://localhost/student_development', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  email: String
});

const subjectSchema = new mongoose.Schema({
  name: String,
  status: String
});

const Student = mongoose.model('student_mst', studentSchema);
const Subject = mongoose.model('subject_mst', subjectSchema);

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  marks: Number
});

const Marks  = mongoose.model('marks_mst', marksSchema);


app.post('/marks', async (req, res) => {
  console.log(req.body)
  const { studentId, subjectId, marks } = req.body;
  const studentMarks = new Marks({ studentId, subjectId, marks });
  await studentMarks.save();
  res.send(studentMarks);
});

app.post('/report', async (req, res) => {
  const query = {};
  if(req.body.firstName){
    query.firstName = req.body.firstName; 
  }
  if(req.body.lastName){
    query.lastName = req.body.lastName;
  }
  if(req.body.fullName){
    const nameParts = req.body.fullName.split(' ');
    if (nameParts.length === 1) {
      query.$or = [
        { firstName: req.body.fullName },
        { lastName: req.body.fullName }
      ];
    }
  }
  if(req.body.subjectId){
    query.subjectId = req.body.subjectId;
  }
  if(req.body.averageStart){
    query.averageStart = req.body.averageStart;
  }
  if(req.body.averageEnd){
    query.averageEnd = req.body.averageEnd;
  }
  const reportData = Student.find(query);
  res.send(reportData);
});

app.listen(() => {
    console.log('app is running on http://localhost:%s', 3000);
})
