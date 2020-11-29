// function sayHello(person:string) {
//     return 'Hello, ' + person;
// }
// var user = 'Tom';
// console.log(sayHello(user));
// let u: null;
// let num: number = u;
window.onload = function(){
    class Student {
        fullName: string;
        constructor(public firstName, public middleInitial, public lastName) {
            this.fullName = firstName + " " + middleInitial + " " + lastName;
        }
        // toString() {
        //     return '11';
        //   }
    }
    
    interface Person {
        firstName: string;
        lastName: string;
    }
    
    function greeter(person : Person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }
    
    let user = new Student("Jane", "M.", "User");
    
    document.body.innerHTML = greeter(user);
    // Declare a tuple type
let x: [string, number];
// Initialize it
// x = ['hello', 10]; // OK
// Initialize it incorrectly
 x = [10, 'hello']; // Error
}
