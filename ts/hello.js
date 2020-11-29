// function sayHello(person:string) {
//     return 'Hello, ' + person;
// }
// var user = 'Tom';
// console.log(sayHello(user));
// let u: null;
// let num: number = u;
window.onload = function () {
    var Student = /** @class */ (function () {
        function Student(firstName, middleInitial, lastName) {
            this.firstName = firstName;
            this.middleInitial = middleInitial;
            this.lastName = lastName;
            this.fullName = firstName + " " + middleInitial + " " + lastName;
        }
        return Student;
    }());
    function greeter(person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }
    var user = new Student("Jane", "M.", "User");
    document.body.innerHTML = greeter(user);
    // Declare a tuple type
    var x;
    // Initialize it
    // x = ['hello', 10]; // OK
    // Initialize it incorrectly
    x = [10, 'hello']; // Error
};
