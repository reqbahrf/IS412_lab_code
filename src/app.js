
class product {
  // Add a product
  constructor() {
    this.productList = JSON.parse(localStorage.getItem('productList')) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('productList', JSON.stringify(this.productList));
  }

async addProduct(product) {
  try{
    product.id = this.productList.length + 1
    this.productList.push(product);
    this.saveToLocalStorage();
    return {message : 'Product Added Successfully', success: true};
  }catch(error){
    return {message : 'Error' + error, success: false};
  }
  }

 async updateProduct(id, updatedProduct) {
  try{
    const index = this.productList.findIndex(product => product.id === id);
    if (index !== -1) {
      this.productList[index] = { ...this.productList[index], ...updatedProduct };
      this.saveToLocalStorage();
      return {message : 'Product Updated Successfully', success: true};
    }else {
     throw new Error('Product not found');
    }
  }catch(error){
    return {message : 'Error' + error, success: false};
  }
  }

 async deleteProduct(id) {
  try{
    this.productList = this.productList.filter(product => product.id !== id);
    this.saveToLocalStorage();
    return {message : 'Product Deleted Successfully', success: true};
  }catch(error){
    return {message : 'Error' + error, success: false};
  }
  }

  orderProduct(id){
    const product = this.productList.find(product => product.id === id);
    if (product) {
      console.log(`Ordering ${product.name}`);
    } else {
      console.log('Product not found');}
  } 

  getAllProducts() {
    return this.productList;
  }
}

class toast {

  constructor() {
    this.toastInstance = $('#toast');
  }

  showToast(bgcolor, iconColor, message){
    this.toastInstance.removeClass('hidden');
    this.toastInstance.addClass(bgcolor);
    this.toastInstance.find('#toast-icon').addClass(iconColor);
    this.toastInstance.find('#toast-message').text(message);
    setTimeout(() => {
      this.toastInstance.addClass('hidden');
    }, 2000);
  }

  closeToast(){
    this.toastInstance.addClass('hidden');
  }
}

const manageProduct = new product();
const toastObject = new toast();

const getProductsList = () => {
  const products = manageProduct.getAllProducts();
  const tablebody = $('#productList');
   tablebody.empty();

  products.forEach((product) => {
    const row = $('<tr data-product-id="' + product.id + '" class="border">');
    row.append($('<td class="border-y px-4 py-2">').text(product.id));
    row.append($('<td class="border-y px-4 py-2">').html(`<img src="${product.image}" class="w-24 h-24 object-cover rounded-full mx-auto" alt="Product Image">`));
    row.append($('<td class="border-y px-4 py-2 text-center">').text(product.name));
    row.append($('<td class="border-y px-4 py-2 text-center">').text(product.category));
    row.append($('<td class="border-y px-4 py-2 text-center">').text(product.quantity));
    row.append($('<td class="border-y px-4 py-2 text-center">').text(product.price));
    row.append($('<td class="text-center">').html(`<button class="bg-green-500 px-2 py-2 text-white order">Order</button>
    <button class="bg-blue-500 px-2 py-2 text-white Edit">Edit</button>
    <button class="bg-red-500 px-2 py-2 text-white delete">Delete</button>`));
    tablebody.append(row);
  });
}

getProductsList();


$('#addProductForm').on('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const productImage = formData.get('product-image');
  const productName = formData.get('P-name');
  const productCategory = formData.get('category');
  const productQuantity = formData.get('quantity');
  const productPrice = formData.get('price');

  const reader = new FileReader();
  reader.onload = async function(event){
    const base64Image = event.target.result;
    const newProduct = {
      image: base64Image,
      name: productName,
      category: productCategory,
      quantity: productQuantity,
      price: productPrice
    };
  const result = await manageProduct.addProduct(newProduct);
  getProductsList();
  result.success === true
  ? toastObject.showToast('bg-green', 'text-white', result.message)
  : toastObject.showToast('bg-red', 'text-white', result.message);
  };
  reader.readAsDataURL(productImage);
})

$('#productList').on('click', '.delete' , async function() {
  const productId = $(this).closest('tr').data('product-id');
  const result = await manageProduct.deleteProduct(productId);
  result.success === true
  ? toastObject.showToast('bg-green', 'text-green-500', result.message)
  : toastObject.showToast('bg-red', 'text-red', result.message);
  getProductsList();
})

$('#image-input').on('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    $('#image-preview').attr('src', event.target.result);
  };
  reader.readAsDataURL(file);
});

$('#unselect-image').on('click', () => {
  $('#image-input').val('');
  $('#image-preview').attr('src', '');
})



