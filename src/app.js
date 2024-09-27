class product {
  // Add a product
  constructor() {
    this.productList = JSON.parse(localStorage.getItem("productList")) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem("productList", JSON.stringify(this.productList));
  }

  async addProduct(product) {
    try {
      product.id = this.productList.length + 1;
      this.productList.push(product);
      this.saveToLocalStorage();
      return { message: "Product Added Successfully", success: true };
    } catch (error) {
      return { message: "Error" + error, success: false };
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const index = this.productList.findIndex((product) => product.id === id);
      if (index !== -1) {
        this.productList[index] = {
          ...this.productList[index],
          ...updatedProduct,
        };
        this.saveToLocalStorage();
        return { message: "Product Updated Successfully", success: true };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      return { message: "Error" + error, success: false };
    }
  }

  async deleteProduct(id) {
    try {
      this.productList = this.productList.filter(
        (product) => product.id !== id,
      );
      this.saveToLocalStorage();
      return { message: "Product Deleted Successfully", success: true };
    } catch (error) {
      return { message: "Error" + error, success: false };
    }
  }

  orderProduct(id) {
    const product = this.productList.find((product) => product.id === id);
    if (product) {
      console.log(`Ordering ${product.name}`);
    } else {
      console.log("Product not found");
    }
  }

  async calculateTotalQuantityAndPrice(){
    try{
      const totalQuantity = this.productList.reduce((acc, product) => acc + parseFloat(product.quantity), 0);
      const totalPrice = this.productList.reduce((acc, product) => acc + (parseFloat(product.quantity) * parseFloat(product.price)), 0);

      return {totalQuantity, totalPrice};
    }catch(error){
      return {message: "Error" + error, success:false}
    }
  }

  getAllProducts() {
    return this.productList;
  }
}

class toast {
  constructor() {
    this.toastInstance = $("#toast");
  }

  showToast(bgcolor, iconColor, message) {
    this.toastInstance.removeClass("hidden");
    this.toastInstance.addClass(bgcolor);
    this.toastInstance.find("#toast-icon").addClass(iconColor);
    this.toastInstance.find("#toast-message").text(message);
    setTimeout(() => {
      this.toastInstance.addClass("hidden");
    }, 2000);
  }

  closeToast() {
    this.toastInstance.addClass("hidden");
  }
}

class model {
  constructor() {
    this.modelInstance = $(".modal");
  }

  getModalInstance(){
    this.modelInstance.removeClass('hidden')
    return this.modelInstance;
  }

  closeModal() {
    this.modelInstance.addClass("hidden");
  }
}

const manageProduct = new product();
const toastClass = new toast();
const modelClass = new model();

const getProductsList = () => {
  const products = manageProduct.getAllProducts();
  const tablebody = $("#productList");
  tablebody.empty();

  products.forEach((product) => {
    const row = $('<tr data-product-id="' + product.id + '" class="border">');
    row.append($('<td class="border-y px-4 py-2">').text(product.id));
    row.append(
      $('<td class="border-y px-4 py-2">').html(
        `<img src="${product.image}" class="w-24 h-24 object-cover rounded-full mx-auto" alt="Product Image">`,
      ),
    );
    row.append(
      $('<td class="border-y px-4 py-2 text-center">').text(product.name),
    );
    row.append(
      $('<td class="border-y px-4 py-2 text-center">').text(product.category),
    );
    row.append(
      $('<td class="border-y px-4 py-2 text-center">').text(product.quantity),
    );
    row.append(
      $('<td class="border-y px-4 py-2 text-center">').text(product.price),
    );
    row.append(
      $('<td class="text-center">')
        .html(`<button class="bg-green-500 px-2 py-2 text-white order">Order</button>
    <button class="bg-blue-500 px-2 py-2 text-white edit">Edit</button>
    <button class="bg-red-500 px-2 py-2 text-white delete">Delete</button>`),
    );
    tablebody.append(row);
  });
};

getProductsList();

$("#addProductForm").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const productImage = formData.get("product-image");
  const productName = formData.get("P-name");
  const productCategory = formData.get("category");
  const productQuantity = formData.get("quantity");
  const productPrice = formData.get("price");

  const reader = new FileReader();
  reader.onload = async function (event) {
    const base64Image = event.target.result;
    const newProduct = {
      image: base64Image,
      name: productName,
      category: productCategory,
      quantity: productQuantity,
      price: productPrice,
    };
    const result = await manageProduct.addProduct(newProduct);
    getProductsList();
    result.success === true
      ? toastClass.showToast("bg-green", "text-white", result.message)
      : toastClass.showToast("bg-red", "text-white", result.message);
  };
  reader.readAsDataURL(productImage);
});

$("#productList").on('click', '.edit', function() {
  const tableRow = $(this).closest('tr')

 const product_id = tableRow.data('product-id');
 const product_imageBase64 = tableRow.find('img').attr('src');
 const product_name = tableRow.find('td:eq(2)').text().trim();
 const product_category = tableRow.find('td:eq(3)').text().trim();
 const product_quantity = tableRow.find('td:eq(4)').text().trim();
 const product_price = tableRow.find('td:eq(4)').text().trim();

const modal = modelClass.getModalInstance();

const modalBody = modal.find('.modal-body');
const updateform = modalBody.find('#updateProductForm');

console.log(updateform);

updateform.find('.image-preview').attr('src', `${product_imageBase64}`);
updateform.find('input[name="updated-product-image"]').attr('data-imgBased64', product_imageBase64);
updateform.find('input[name="updated-name"]').val(product_name);
updateform.find('select[name="updated-category"]').val(product_category);
updateform.find('input[name="update-quantity"]').val(product_quantity);
updateform.find('input[name="update-price"]').val(product_price);

 $("#updateProductForm").on("submit", async function(e){
   e.preventDefault();
 
   const updateFormData = new FormData(this);
   let updateProductImage = updateFormData.get('updated-product-image');
    
 
   if (updateProductImage && updateProductImage.size > 0) {
       console.log("File detected:", updateProductImage);

   } else {
       updateProductImage = $('input[name="updated-product-image"]').attr('data-imgBased64');
       console.log("Using base64 from data attribute:", updateProductImage);
   }
   const updateProductName = updateFormData.get('updated-name');
   const updateProductCategory = updateFormData.get('updated-category');
   const updateProductQuantity = updateFormData.get('update-quantity');
   const updateProductPrice = updateFormData.get('update-price');


  if (typeof updateProductImage === 'string' && updateProductImage.startsWith('data:image')) {
    // Image is already in Base64, no need to read again
    const updatedProduct = {
        image: updateProductImage,  // Already Base64 encoded
        name: updateProductName,
        category: updateProductCategory,
        quantity: updateProductQuantity,
        price: updateProductPrice,
    };

    const result = await manageProduct.updateProduct(product_id, updatedProduct);
    modelClass.closeModal();
    getProductsList();
    result.success === true
    ? toastClass.showToast("bg-green", "text-white", result.message)
    : toastClass.showToast("bg-red", "text-white", result.message);

} else {
    // Image is a File object, we need to convert it to Base64
    const reader = new FileReader();
    reader.onload = async function (event) {
        const base64Image = event.target.result;
        const updatedProduct = {
            image: base64Image,
            name: updateProductName,
            category: updateProductCategory,
            quantity: updateProductQuantity,
            price: updateProductPrice,
        };
        const result = await manageProduct.updateProduct(product_id, updatedProduct);
        getProductsList();
        modelClass.closeModal();
        result.success === true
        ? toastClass.showToast("bg-green", "text-white", result.message)
        : toastClass.showToast("bg-red", "text-white", result.message);
    };
    reader.readAsDataURL(updateProductImage);

}

 })
})


$("#productList").on("click", ".delete", async function () {
  const productId = $(this).closest("tr").data("product-id");
  const result = await manageProduct.deleteProduct(productId);
  result.success === true
    ? toastClass.showToast("bg-green", "text-green-500", result.message)
    : toastClass.showToast("bg-red", "text-red", result.message);
  getProductsList();
});

$("#updateProductForm, #addProductForm").on("change", '.image-input', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const input = $(e.target);
      input.closest('form').find(".image-preview").attr("src", event.target.result);
  };
  reader.readAsDataURL(file);
});

$(".unselect-image").on("click", () => {
  $(".image-input").val("");
  $(".image-preview").attr("src", "");
});

$("[data-model]").on("click", function () {
  modelClass.closeModal();
});

const calculateTotalQuantityAndPrice =  async () => {
 const result = await manageProduct.calculateTotalQuantityAndPrice();
 
 $('#totalQuantity').text(result?.totalQuantity);
 $('#totalPrice').text(`₱ ${result?.totalPrice}`)

}

calculateTotalQuantityAndPrice();
