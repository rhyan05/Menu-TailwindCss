const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal =document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-tems")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("chekout-Btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart= [];

// abrir modal carrinho
cartBtn.addEventListener("click", function(){
    updateCarrinho();
    cartModal.style.display="flex"
})
// fechar modal caso click fora do card do carrinho
cartModal.addEventListener("click", function(event){
    if(event.target===cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(event){
    cartModal.style.display= "none"
})

// add item no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name= parentButton.getAttribute("data-name")
        const price= parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

    }
})
// funçao para add no carrinho
function addToCart(name, price){
    if(existingItem){
        existingItem.item+=1;
    }else{
        cart.push({
            name, price, quantity:1,
        })
    }

    updateCarrinho()

}

// att carrinho
function updateCarrinho(){
    cartItemsContainer.innerHTML ="";
    let total =0;

    cart.forEach(item=>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML= `
        <div class ="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class="remove-btn" data-name="$item.name">Remover</button>
        </div>
        `

        total +=item.price*item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

// funcao para remover item do carrinho

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
    const name= event.target.getAttribute("data-name")

    removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item=> item.name ===name);
    if(index !==-1){
        const item =cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
            updateCarrinho();
            return;
        }
        cart.splice(index, 1);
        updateCarrinho();

    }
}

// pegar endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden");

    }
})
// finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen =checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante esta fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left", 
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
          }).showToast();
          return;
    }

    if(cart.length ===0){
        return;
    }
    if(addressInput.value===""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }
    // manda a informaçao para o whatsapp

    const cartItems = cart.map((item) =>{
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "999999999" //seu telefone aqui

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blanck")

    cart=[];
    updateCarrinho();

})

// verificar se o restaurante esta aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 && hora<22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
}else{
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}
