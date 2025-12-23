const fs = require('fs');
const path = require('path');

const issuesFilePath = path.join(__dirname, '../data/issues.json');

class IssuesModel {
  constructor() {
    this.issues = [];
  }

  loadIssues() {
    if (fs.existsSync(issuesFilePath)) {
      const data = fs.readFileSync(issuesFilePath, 'utf-8').trim();
      if (!data) {
        this.issues = [];
        return;
      }
      try {
        this.issues = JSON.parse(data);
      } catch (err) {
        console.error('Failed resetting to empty list:', err.message);
        this.issues = [];
      }
    } else {
      this.issues = [];
    }
  }

  saveIssues() {
    const dir = path.dirname(issuesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(issuesFilePath, JSON.stringify(this.issues, null, 2));
  }

  getAllIssues() {
    const result = this.issues;
    return result;
  }


  addIssue(issue) {
    const severityOrder = { 
      High: 1, 
      Medium: 2, 
      Low: 3 
    };
    const index = this.issues.findIndex(
      existingIssue => severityOrder[issue.severity] < severityOrder[existingIssue.severity]
    );

    if (index === -1) {
      this.issues.push(issue); 
    } 
    else {
      this.issues.splice(index, 0, issue); 
    }

    this.saveIssues();
  }

 
  findIssueById(id) {
    const result = this.issues.find(issue => issue.id === id);
    return result;
  }


  updateIssueStatus(id, status) {
    this.issues = this.issues.map(
      issue =>issue.id === id ? { ...issue, status } : issue
    );
    this.saveIssues();
  }

  
  deleteIssueById(id) {
    const issueToDelete = this.issues.find(issue => issue.id === id);

    if (issueToDelete && issueToDelete.image) {
      const imagePath = path.join(__dirname, '../', issueToDelete.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); 
      }
    }

   
    this.issues = this.issues.filter(issue => issue.id !== id);
    this.saveIssues();
  }

  reopenIssueById(id) {
    this.issues = this.issues.map(issue =>
      issue.id === id ? { ...issue, status: 'Open' } : issue
    );
    this.saveIssues();
  }

 
  finishIssueById(id) {
    this.issues = this.issues.map(
      issue =>issue.id === id ? { ...issue, status: 'Finished' } : issue
    );
    this.saveIssues();
  }


  sortBySeverity() {
    const severityOrder = { 
      High: 1, 
      Medium: 2, 
      Low: 3 };
    this.issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return this.issues;
  }


  sortDescendingByPriority() {
    const severityOrder = { 
      High: 1,
      Medium: 2, 
      Low: 3 };
    this.issues.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  }

  
  removeTaskByPriority(priority) {
    const severityOrder = { 
      High: 1, 
      Medium: 2, 
      Low: 3 };
    const index = this.issues.findIndex(issue => severityOrder[issue.severity] === severityOrder[priority]);

    if (index !== -1) {
      this.issues.splice(index, 1); 
      this.saveIssues();
    }

  }

  removeSmallestPriorityTask() {
    this.sortBySeverity(); 
    if (this.issues.length > 0) {
      this.issues.shift(); 
      this.saveIssues();
    }
  }

  removeHighestPriorityTask() {
    this.sortDescendingByPriority();
    if (this.issues.length > 0) {
      this.issues.pop();
      this.saveIssues();
    }
  }
}

module.exports = IssuesModel;