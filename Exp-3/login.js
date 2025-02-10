function LoginValidate(){
    var enteremail=document.getElementById("email").value;
    var enterpassword=document.getElementById("pwd").value;
    var getEmail=localStorage.getItem('email');
    var getpwd=localStorage.getItem('password');
    if(enteremail==getEmail){
        if(enterpassword==getpwd){
            alert("Login Success");
            window.location="welcome.html";
            return false;
        }
        else{
            alert("Wrong Password");
        }
    }
    else{
        alert("Invalid Details");
    }
}