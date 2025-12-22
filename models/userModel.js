const fs = require('fs');

class Users {
    constructor(){
        this.user = [];
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
        this.name = this.users.filter(user => user.name !==name);
    }

    saveUsers(filePath){
        fs.writeFileSync(filePath,JSON.stringify(this.users,null,2));
    }

    loadUsers(filePath){
        if(fs.existsSync(filePath)){
            const data = fs.readFileSync(filePath,'utf-8');
            this.users = JSON.parse(data);
        }else{
            this.users = [];
        }   
    }

    
}
module.exports = Users;

