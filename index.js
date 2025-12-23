const express = require('express');

const path = require('path');
const session = require('express-session');
const multer = require('multer');
const authController = require('./controller/authController');
const issuesController = require('./controller/issuesController');

const upload = multer({ dest: path.join(__dirname, 'uploads/') });


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
  })
);


app.get('/', authController.authenticate, issuesController.getIssues);
app.get('/logout', authController.logout);
app.get('/login', authController.showLoginPage);
app.post('/login', authController.login);
app.get('/register', authController.showRegisterPage);
app.post('/register', authController.register);

app.get('/issues', authController.authenticate, issuesController.getIssues);
app.post('/issues/add', upload.single('image'), issuesController.addIssue);
app.get('/issues/close/:id', issuesController.closeIssue);
app.get('/issues/delete/:id', issuesController.deleteIssue);
app.get('/issues/reopen/:id', issuesController.reopenIssue);
app.get('/issues/sort/severity', authController.authenticate, issuesController.sortIssuesBySeverity);
app.get('/issues/finish/:id', issuesController.finishIssue);
app.get('/issues/deleteFirst', issuesController.deleteFirstIssue);
app.get('/issues/deleteLast', issuesController.deleteLastIssue);
app.post('/issues/removeByPriority', issuesController.removeTaskByPriority);
app.get('/issues/sort/descending', issuesController.sortDescendingBySeverity);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});