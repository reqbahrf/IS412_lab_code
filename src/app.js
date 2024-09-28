class product {
  // Add a product
  constructor() {
    this.productList = JSON.parse(localStorage.getItem("productList")) || [];
    this.soldProductList =
      JSON.parse(localStorage.getItem("soldProductList")) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem("productList", JSON.stringify(this.productList));
  }

  saveSoldProduct() {
    localStorage.setItem("soldProductList", JSON.stringify(this.soldProductList));
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

  async orderProduct(id, orderProductQuantity, orderProductTotalPrice) {
    console.log('this is called')
    try {
      const parsedOrderQuantity = parseInt(orderProductQuantity)
      const parsedTotalPrice = parseFloat(orderProductTotalPrice)
      const product = this.productList.find((product) => product.id === id);

      if (product) {
        // Decrement the product quantity based on the order
        product.quantity -= parsedOrderQuantity;

        const existingSoldProduct = this.soldProductList.find((soldProduct) => soldProduct?.id === id);

        console.log(existingSoldProduct);
        if (existingSoldProduct) {
          // Update the existing sold product's quantity and total price
          existingSoldProduct.quantity += parsedOrderQuantity;
          existingSoldProduct.price += parsedTotalPrice; // Add to the total price
        } else {
          // Create a new sold product and add it to the soldProductList
          const soldProduct = {
            id: product.id,
            name: product.name,
            quantity: parsedOrderQuantity,
            price: parsedTotalPrice, // Set the initial total price
          };
         this.soldProductList.push(soldProduct);
        }
        
        // Save changes
        this.saveSoldProduct();
        this.saveToLocalStorage();
  
        return {
          message: `New Order for Product ${product.name}`,
          success: true,
        };
      } else {
        return { message: "Product Not Found", success: false };
      }
    } catch (error) {
      return { message: "Error: " + error, success: false };
    }
  }

  async calculateTotalQuantityAndPrice() {
    try {
      const totalQuantity = this.productList.reduce(
        (acc, product) => acc + parseFloat(product.quantity),
        0,
      );
      const totalPrice = this.productList.reduce(
        (acc, product) =>
          acc + parseFloat(product.quantity) * parseFloat(product.price),
        0,
      );

      return { totalQuantity, totalPrice };
    } catch (error) {
      return { message: "Error" + error, success: false };
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

  showToast(bgcolor, message) {
    this.toastInstance.removeClass("hidden");
    this.toastInstance.find("#toast-content").addClass(bgcolor);
    this.toastInstance.find("#toast-message").text(message);
    setTimeout(() => {
      this.toastInstance.addClass("hidden");
    }, 2000);
  }

  closeToast() {
    this.toastInstance.addClass("hidden");
    this.toastInstance
      .find("#toast-content")
      .removeClass(
        "bg-green-100, bg-red-100, border, border-green-400, border-red-400 ",
      );
    this.toastInstance.find("#toast-message").text("");
  }
}

class model {
  constructor() {
    this.modalInstance = $(".modal");
  }

  getUpdateModalInstance() {
    this.modalInstance.removeClass("hidden");
    this.modalInstance.find("h3").text("Update Product");
    this.modalInstance.find("#updateProductForm").removeClass("hidden");
    return this.modalInstance;
  }
  getOrderModalInstance() {
    this.modalInstance.removeClass("hidden");
    this.modalInstance.find("h3").text("Order Product");
    this.modalInstance.find("#orderProductForm").removeClass("hidden");
    return this.modalInstance;
  }

  closeModal() {
    this.modalInstance.addClass("hidden");
    this.modalInstance.find("h3").text("");
    const modalForms = this.modalInstance.find(
      "#updateProductForm, #orderProductForm",
    );
    modalForms.off("submit");
    modalForms.addClass("hidden");
    modalForms.find("input, select").val("");

  }
}

const manageProduct = new product();
const toastClass = new toast();
const modelClass = new model();

const calculateTotalQuantityAndPrice = async () => {
  const result = await manageProduct.calculateTotalQuantityAndPrice();
  console.log(result);
  $("#totalQuantity").text(result?.totalQuantity);
  $("#totalPrice").text(`₱ ${result?.totalPrice}`);
};

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
   await calculateTotalQuantityAndPrice();
    result.success === true
      ? toastClass.showToast("bg-green-100 border border-green-400", result.message)
      : toastClass.showToast("bg-red-100 border border-red-400", result.message);
  };
  reader.readAsDataURL(productImage);
});

$("#productList").on("click", ".edit", function () {
  const tableRow = $(this).closest("tr");

  const product_id = tableRow.data("product-id");
  const product_imageBase64 = tableRow.find("img").attr("src");
  const product_name = tableRow.find("td:eq(2)").text().trim();
  const product_category = tableRow.find("td:eq(3)").text().trim();
  const product_quantity = tableRow.find("td:eq(4)").text().trim();
  const product_price = tableRow.find("td:eq(4)").text().trim();

  const modal = modelClass.getUpdateModalInstance();

  const modalBody = modal.find(".modal-body");
  const updateform = modalBody.find("#updateProductForm");

  updateform.find(".image-preview").attr("src", `${product_imageBase64}`);
  updateform
    .find('input[name="updated-product-image"]')
    .attr("data-imgBased64", product_imageBase64);
  updateform.find('input[name="updated-name"]').val(product_name);
  updateform.find('select[name="updated-category"]').val(product_category);
  updateform.find('input[name="update-quantity"]').val(product_quantity);
  updateform.find('input[name="update-price"]').val(product_price);

  modal.find("#updateProductForm").on("submit", async function (e) {
    e.preventDefault();

    const updateFormData = new FormData(this);
    let updateProductImage = updateFormData.get("updated-product-image");

    if (updateProductImage && updateProductImage.size > 0) {
      console.log("File detected:", updateProductImage);
    } else {
      updateProductImage = $('input[name="updated-product-image"]').attr(
        "data-imgBased64",
      );
      console.log("Using base64 from data attribute:", updateProductImage);
    }
    const updateProductName = updateFormData.get("updated-name");
    const updateProductCategory = updateFormData.get("updated-category");
    const updateProductQuantity = updateFormData.get("update-quantity");
    const updateProductPrice = updateFormData.get("update-price");

    if (
      typeof updateProductImage === "string" &&
      updateProductImage.startsWith("data:image")
    ) {
      // Image is already in Base64, no need to read again
      const updatedProduct = {
        image: updateProductImage, // Already Base64 encoded
        name: updateProductName,
        category: updateProductCategory,
        quantity: updateProductQuantity,
        price: updateProductPrice,
      };

      const result = await manageProduct.updateProduct(
        product_id,
        updatedProduct,
      );
      modelClass.closeModal();
      getProductsList();
      result.success === true
        ? toastClass.showToast(
            "bg-green-100 border border-green-400",
            result.message,
          )
        : toastClass.showToast(
            "bg-red-100 border border-red-400",
            result.message,
          );
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
        const result = await manageProduct.updateProduct(
          product_id,
          updatedProduct,
        );
        getProductsList();
       await calculateTotalQuantityAndPrice();
        modelClass.closeModal();
        result.success === true
          ? toastClass.showToast(
              "bg-green-100 border border-green-400",
              result.message,
            )
          : toastClass.showToast(
              "bg-red-100 border border-red-400",
              result.message,
            );
      };
      reader.readAsDataURL(updateProductImage);
    }
  });
});

$("#productList").on("click", ".order", function () {
  const tableRow = $(this).closest("tr");
  const product_id = tableRow.data("product-id");
  const product_imageBase64 = tableRow.find("img").attr("src");
  const product_name = tableRow.find("td:eq(2)").text().trim();
  const product_quantity = tableRow.find("td:eq(4)").text().trim();
  const product_price = tableRow.find("td:eq(4)").text().trim();

  const modal = modelClass.getOrderModalInstance();

  modal.find("img").attr("src", product_imageBase64);
  modal.find('input[name="ReadonlyProductName"]').val(product_name);
  modal.find('input[name="price"]').val(product_price);
  const quantitySelect = modal.find('select[name="Quantity"]').empty();

  (() => {
    quantitySelect.append(`<option>Select Quantity</option>`);
    for (let i = 1; i <= product_quantity; i++) {
      quantitySelect.append(`<option value="${i}">Quantities: ${i}</option>`);
    }
  })(parseInt(product_quantity));

  quantitySelect.on("change", function () {
    const thisInputValue = $(this).val();
    const totalPriceReadonlyInput = modal.find('input[name="Total"]');
    const totalPrice = parseInt(thisInputValue) * parseFloat(product_price);

    totalPriceReadonlyInput.val(totalPrice);
  });

  modal.find("#orderProductForm").on("submit", async function (e) {
    e.preventDefault();
    const orderFormData = new FormData(this);

    const orderProductQuantity = orderFormData.get("Quantity");
    const orderProducTotalPrice = orderFormData.get("Total");
    console.log(product_id, orderProductQuantity, orderProducTotalPrice);
    const result = await manageProduct.orderProduct(
      product_id,
      orderProductQuantity,
      orderProducTotalPrice,
    );
    console.log(result);
    result.success === true
      ? toastClass.showToast(
          "bg-green-100 border border-green-400",
          result.message,
        )
      : toastClass.showToast(
          "bg-red-100 border border-red-400",
          result.message,
        );
    getProductsList();
  });
});

$("#productList").on("click", ".delete", async function () {
  const productId = $(this).closest("tr").data("product-id");
  const result = await manageProduct.deleteProduct(productId);
  result.success === true
    ? toastClass.showToast(
        "bg-green-100 border border-green-400",
        result.message,
      )
    : toastClass.showToast("bg-red-100 border border-red-400", result.message);
  getProductsList();
});

$("#updateProductForm, #addProductForm").on(
  "change",
  ".image-input",
  function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const input = $(e.target);
      input
        .closest("form")
        .find(".image-preview")
        .attr("src", event.target.result);
    };
    reader.readAsDataURL(file);
  },
);

$(".unselect-image").on("click", () => {
  $(".image-input").val("");
  $(".image-preview").attr("src", "");
});

$("[data-model]").on("click", function () {
  modelClass.closeModal();
});

/**
 * Calculates the total quantity and price of products and updates the corresponding HTML elements.
 *
 * @return {void}
 */


calculateTotalQuantityAndPrice();
