function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "Testi" && password == "Toimiiko"){
        alert ("Kirjautuminen onnistui");
        window.location = "C:\elokuva\Elokuvasovellus\HTML\success.html";
        return false;
    }
    else{
        alert("Käyttäjä tai salasana väärin, yritä uudestaan");
        return false;
    }
}