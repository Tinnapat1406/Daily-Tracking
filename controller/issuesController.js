const IssuesModel = require('../models/issuesModel');
const issuesModel = new IssuesModel();
issuesModel.loadIssues(); 

exports.getIssues = (req, res) => {
  const issues = issuesModel.getAllIssues(); 
  res.render('issues', { issues }); 
};
exports.addIssue = (req, res) => {
  const { description, severity, assignedTo } = req.body;
  const id = Date.now().toString();
  const status = 'Open';
  const image = req.file ? `/uploads/${req.file.filename}` : null;


  issuesModel.addIssue({ id, description, severity, assignedTo, status, image });
  const issues = issuesModel.getAllIssues();
  res.render('issues', { issues });
};

exports.closeIssue = (req, res) => {
  const issueId = req.params.id;
  issuesModel.updateIssueStatus(issueId, 'Closed');
  res.redirect('/issues');
};

exports.finishIssue = (req, res) => {
  const issueId = req.params.id;
  issuesModel.finishIssueById(issueId);
  res.redirect('/issues');
};


exports.deleteIssue = (req, res) => {
  const issueId = req.params.id;
  issuesModel.deleteIssueById(issueId);
  res.redirect('/issues');
};


exports.reopenIssue = (req, res) => {
  const issueId = req.params.id;
  issuesModel.reopenIssueById(issueId);
  res.redirect('/issues');
};

exports.sortIssuesBySeverity = (req, res) => {
  const sortedIssues = issuesModel.sortBySeverity(); 
  res.render('issues', { issues: sortedIssues }); 
};


exports.deleteFirstIssue = (req, res) => {
  issuesModel.issues = issuesModel.sortBySeverity(); 
  if (issuesModel.issues.length > 0) {
    issuesModel.issues.shift(); 
    issuesModel.saveIssues(); 
  }
  res.redirect('/issues'); 
};

exports.deleteLastIssue = (req, res) => {
  issuesModel.issues = issuesModel.sortBySeverity(); 
  if (issuesModel.issues.length > 0) {
    issuesModel.issues.pop(); 
    issuesModel.saveIssues(); 
  }
  res.redirect('/issues'); 
};

exports.sortDescendingBySeverity = (req, res) => {
  issuesModel.sortDescendingByPriority();
  res.redirect('/issues');
};
exports.removeTaskByPriority = (req, res) => {
  const { priority } = req.body;
  issuesModel.removeTaskByPriority(priority);
  res.redirect('/issues');
};