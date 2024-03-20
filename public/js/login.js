console.log("jajjjjsjsjsjsj")


let loginFormelement = document.getElementById("loginForm")



loginFormelement.addEventListener("submit",async function(event){
event.preventDefault();
    let username = document.getElementById("username").value 
    let password = document.getElementById("password").value

    console.log(username,password)

    const response = await fetch("/users/login",{
        method: "POST",
        body: JSON.stringify({username,password}),
        headers:{'Content-Type': 'application/json'}
    })
    if(response.ok){
        console.log("you are logged in")
        document.location.replace("/dashboard")
    }else{
        alert("something went wrong")
    }
})