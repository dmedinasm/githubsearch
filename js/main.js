//Obtener el formulario
const form = document.getElementById("form") 

//Obtener la barra de busqueda
const search = document.getElementById("search")

//Obtener el widget del usuario
const userCard = document.getElementById("usercard")

//Escuchar el evento submit del form
form.addEventListener("submit", (event)=>{
    event.preventDefault()
    const username = search.value
    getUserData(username)
    search.value =""//Estamos reasignando el valor de un objeto de la constante, no la referencia a otro objeto//
})

//Obtener la info del usuario en Github
async function getUserData(username) {
    const API = "https://api.github.com/users/"

    try {
        const userRequest = await fetch(API + username)

        if (!userRequest.ok) {//En caso de que de error el primer request
            throw new Error(userRequest.status)
        }

        const userData = await userRequest.json()


        if (userData.public_repos) {
            const reposRequest = await fetch(API + username + "/repos")
            const reposData = await reposRequest.json()
            userData.repos = reposData//aregamos un atributo a userData para obtener los repos
        }

        showUserData(userData)

    } catch (error) {
        showError(error.message)
    }

}

//Función para componer e hidratar el HTML del widget
function showUserData(userData){
    let userContent = `
            <img src=${userData.avatar_url} alt="Avatar">
            <h1>${userData.name}</h1>
            <p>${userData.bio}</p>
            
            <section class="data">
                <ul>
                    <li>Followers: ${userData.followers}</li>
                    <li>Following: ${userData.following}</li>
                    <li>Repos: ${userData.public_repos}</li>
                </ul>
            </section>

         `

        if(userData.repos){

            userContent += `<section class="repos">`

            //Aqui corto el array de repos de mas elementos a solo 7
            userData.repos.slice(0, 7).forEach(repo => {
                userContent += `<a href="${repo.html_url}" target = "_blank">${repo.name}</a>`
            })

            userContent += `</section>`
        }

    userCard.innerHTML = userContent


}

//Función para gestionar los errores
function showError(error){
    const errorContent = `<h1>Error: ⚠ ${error}`
    userCard.innerHTML += errorContent
}

