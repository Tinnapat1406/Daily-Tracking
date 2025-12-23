const fs = require('fs');

class UserModel {
  constructor() {
    this.users = [];
  }

    AddUsers(user) {
        this.users.push(user);
    }

    getAllUsers(){
        return this.users;
    }

    findUserByName(name){
        return this.users.find(user => user.name === name);
    }

    deleteUserByName(name){
        this.users = this.users.filter(user => user.name !== name);
    }

    saveUsersToFile(filePath){
        fs.writeFileSync(filePath,JSON.stringify(this.users,null,2));
    }

    loadUsersFromFile(filePath){
        if(fs.existsSync(filePath)){
            const data = fs.readFileSync(filePath,'utf-8');
            this.users = JSON.parse(data);
        }else{
            this.users = [];
        }   
    }

    
}
module.exports = UserModel;

