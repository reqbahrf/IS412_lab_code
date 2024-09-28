/**
 * Represents a Product in the inventory.
 * @class
 */
class product {
  
  /**
 * Initializes a new instance of the class.
 * @constructor
 * @this {product}
 * @description
 * The constructor retrieves the product list and sold product list from 
 * local storage. If the lists are not available, they default to empty arrays.
 */
  constructor() {
    this.productList = JSON.parse(localStorage.getItem("productList")) || [];
    this.soldProductList =
      JSON.parse(localStorage.getItem("soldProductList")) || [];
  }

  /**
 * Saves the current product list to local storage.
 * @function
 * @this {product} 
 * @returns {void}
 * @description 
 * This function converts the `productList` array to a JSON string 
 * and stores it in local storage under the key "productList".
 */
  saveToLocalStorage() {
    localStorage.setItem("productList", JSON.stringify(this.productList));
  }


  /**
 * Saves the current sold product list to local storage.
 * @function
 * @this {product}  // Replace with the actual name of your class
 * @returns {void}
 * @description 
 * This function converts the `soldProductList` array to a JSON string 
 * and stores it in local storage under the key "soldProductList".
 */
  saveSoldProduct() {
    localStorage.setItem("soldProductList", JSON.stringify(this.soldProductList));
  }



  /**
 * Adds a new product to the product list and saves it to local storage.
 * @async
 * @function
 * @this {product}
 * @param {Object} product - The product object to be added.
 * @param {number} product.id - The unique identifier for the product (will be assigned automatically).
 * @param {string} product.name - The name of the product.
 * @param {string} product.category - The category of the product.
 * @param {number} product.quantity - The quantity of the product.
 * @param {number} product.price - The price of the product.
 * @returns {Promise<Object>} A promise that resolves to an object containing a success message and status.
 * @throws {Error} Throws an error if there is an issue adding the product.
 * @description 
 * This method assigns a unique ID to the new product, adds it to the `productList`, 
 * and saves the updated list to local storage. It returns a success message if the 
 * operation is successful, or an error message if an exception occurs.
 */
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


  /**
 * Updates an existing product in the product list and saves the changes to local storage.
 * @async
 * @function
 * @this {product} 
 * @param {number} id - The unique identifier of the product to be updated.
 * @param {Object} updatedProduct - An object containing the updated product information.
 * @param {string} [updatedProduct.name] - The updated name of the product.
 * @param {string} [updatedProduct.category] - The updated category of the product.
 * @param {number} [updatedProduct.quantity] - The updated quantity of the product.
 * @param {number} [updatedProduct.price] - The updated price of the product.
 * @returns {Promise<Object>} A promise that resolves to an object containing a success message and status.
 * @throws {Error} Throws an error if the product is not found or if there is an issue updating the product.
 * @description 
 * This method searches for a product by its unique ID, updates its information with 
 * the provided values, and saves the updated product list to local storage. It 
 * returns a success message if the update is successful, or an error message if 
 * the product is not found or another issue occurs.
 */
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

  /**
 * Deletes a product from the product list by its unique identifier and saves the changes to local storage.
 * @async
 * @function
 * @this {product}
 * @param {number} id - The unique identifier of the product to be deleted.
 * @returns {Promise<Object>} A promise that resolves to an object containing a success message and status.
 * @throws {Error} Throws an error if there is an issue deleting the product.
 * @description 
 * This method removes a product from the product list based on the provided ID and updates the local storage to reflect the changes. It returns a success message if the deletion is successful.
 */
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

  /**
 * Processes an order for a specific product by updating its quantity in the product list 
 * and tracking sold products. Saves the updated data to local storage.
 * @async
 * @function
 * @this {product} // Replace with the actual name of your class
 * @param {number} id - The unique identifier of the product being ordered.
 * @param {number} orderProductQuantity - The quantity of the product to be ordered.
 * @param {number} orderProductTotalPrice - The total price for the ordered quantity of the product.
 * @returns {Promise<Object>} A promise that resolves to an object containing a success message and status.
 * @throws {Error} Throws an error if there is an issue processing the order.
 * @description 
 * This method adjusts the quantity of the specified product in the product list 
 * and records the order in the sold product list. If the product already exists in the 
 * sold product list, it updates the quantity and total price. It returns a success message 
 * upon successful order processing or an error message if the product is not found.
 */
  async orderProduct(id, orderProductQuantity, orderProductTotalPrice) {
    console.log('this is called')
    try {
      const parsedOrderQuantity = parseInt(orderProductQuantity)
      const parsedTotalPrice = parseFloat(orderProductTotalPrice)
      const product = this.productList.find((product) => product.id === id);

      if (product) {
        product.quantity -= parsedOrderQuantity;

        const existingSoldProduct = this.soldProductList.find((soldProduct) => soldProduct?.id === id);

        console.log(existingSoldProduct);
        if (existingSoldProduct) {
          existingSoldProduct.quantity += parsedOrderQuantity;
          existingSoldProduct.price += parsedTotalPrice;
        } else {
          const soldProduct = {
            id: product.id,
            name: product.name,
            quantity: parsedOrderQuantity,
            price: parsedTotalPrice,
          };
         this.soldProductList.push(soldProduct);
        }

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


  /**
 * Calculates the total quantity and total price of all products in the product list.
 * @async
 * @function
 * @this {product}
 * @returns {Promise<Object>} A promise that resolves to an object containing the total quantity and total price.
 * @throws {Error} Throws an error if there is an issue during the calculation process.
 * @description 
 * This method iterates through the `productList` and computes the total quantity and 
 * total price by summing up the quantity and the product of quantity and price for each product. 
 * It returns an object containing the total quantity and total price.
 */
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

  /**
 * Retrieves the list of all products.
 * @returns {Array<Object>} An array of product objects from the product list.
 * @description 
 * This method returns the current list of products stored in the productList property.
 * Each product object in the array contains details such as id, name, category, quantity, and price.
 */
  getAllProducts() {
    return this.productList;
  }
}

/**
 * A class to handle toast notifications in the user interface.
 */
class toast {

   /**
   * Initializes a new instance of the toast class.
   * @constructor
   */
  constructor() {
    this.toastInstance = $("#toast");
  }

  /**
   * Displays a toast notification with the specified background color and message.
   * @param {string} bgcolor - The CSS class for the background color of the toast.
   * @param {string} message - The message to be displayed in the toast.
   * @description
   * This method removes the hidden class from the toast element, updates the background color
   * and message, and sets a timeout to hide the toast after 2 seconds.
   */
  showToast(bgcolor, message) {
    this.toastInstance.removeClass("hidden");
    this.toastInstance.find("#toast-content").addClass(bgcolor);
    this.toastInstance.find("#toast-message").text(message);
    setTimeout(() => {
      this.toastInstance.addClass("hidden");
    }, 2000);
  }


  /**
   * Hides the toast notification immediately.
   * @description 
   * This method adds the hidden class to the toast element,
   * removes any background color and border classes, and clears the toast message.
   */
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



/**
 * A class to manage modal instances for product operations.
 */
class model {


  /**
   * Initializes a new instance of the modal class.
   * @constructor
   */
  constructor() {
    this.modalInstance = $(".modal");
  }


  /**
   * Displays the update modal for a product.
   * @returns {jQuery} The jQuery object representing the modal instance.
   * @description
   * This method removes the hidden class from the modal, sets the header text to
   * "Update Product", displays the update product form, and returns the modal instance.
   */
  getUpdateModalInstance() {
    this.modalInstance.removeClass("hidden");
    this.modalInstance.find("h3").text("Update Product");
    this.modalInstance.find("#updateProductForm").removeClass("hidden");
    return this.modalInstance;
  }


  /**
   * Displays the order modal for a product.
   * @returns {jQuery} The jQuery object representing the modal instance.
   * @description 
   * This method removes the hidden class from the modal, sets the header text to 
   * "Order Product", displays the order product form, and returns the modal instance.
   */
  getOrderModalInstance() {
    this.modalInstance.removeClass("hidden");
    this.modalInstance.find("h3").text("Order Product");
    this.modalInstance.find("#orderProductForm").removeClass("hidden");
    return this.modalInstance;
  }


  /**
   * Closes the modal and resets its content.
   * @description 
   * This method adds the hidden class to the modal, clears the header text, 
   * hides the update and order product forms, unbinds any submit events, and resets 
   * all input and select elements within the forms.
   */
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


/**
 * Calculates the total quantity and price of all products and updates the corresponding HTML elements.
 *
 * @return {void}
 */
const calculateTotalQuantityAndPrice = async () => {
  const result = await manageProduct.calculateTotalQuantityAndPrice();
  $("#totalQuantity").text(result?.totalQuantity);
  $("#totalPrice").text(`₱ ${result?.totalPrice}`);
};


/**
 * Retrieves the list of all products from the `manageProduct` module and dynamically generates a table of products.
 * The product list is rendered inside an HTML table with the ID `#productList`, replacing any existing content.
 * 
 * Each product row contains the product's ID, image, name, category, quantity, and price, as well as buttons for 
 * ordering, editing, and deleting the product.
 * 
 * @function getProductsList
 * 
 * Function Steps:
 * 1. Calls `manageProduct.getAllProducts()` to retrieve all product data.
 * 2. Clears the current contents of the table body with ID `#productList`.
 * 3. For each product, creates a new `<tr>` element with various `<td>` elements representing:
 *    - Product ID
 *    - Product image (rendered inside an `<img>` tag)
 *    - Product name
 *    - Product category
 *    - Product quantity
 *    - Product price
 * 4. Appends action buttons for ordering, editing, and deleting each product in the last column.
 * 5. Appends the generated row to the table body.
 *
 * @example
 * getProductsList(); // Dynamically renders a list of products in the table.
 */
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


/**
 * Event listener for the submit event on the #addProductForm element.
 *
 * @description Handles the submission of the add product form, creates a new product object, and adds it to the product list. It also updates the product list table and displays a toast message indicating the result of the operation.
 *
 * @param {Event} e - The submit event object.
 */
$("#addProductForm").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const productImage = formData.get("product-image");
  const productName = formData.get("P-name");
  const productCategory = formData.get("category");
  const productQuantity = formData.get("quantity");
  const productPrice = formData.get("price");

  const reader = new FileReader();

  /**
   * Handles the onload event of the FileReader, creating a new product object from the loaded image and adding it to the product list.
   *
   * @param {Event} event - The onload event object.
   * @return {void}
   */
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
    calculateTotalQuantityAndPrice();
    result.success === true
      ? toastClass.showToast("bg-green-100 border border-green-400", result.message)
      : toastClass.showToast("bg-red-100 border border-red-400", result.message);
  };
  reader.readAsDataURL(productImage);
});


/**
 * Event listener for editing a product when the "edit" button is clicked in the product list table.
 * This function extracts product details from the table row, populates a modal form for updating the product,
 * and handles form submission including updating the product image either in base64 format or as a file.
 *
 * @event Click on the edit button in the product list.
 *
 * @param {jQuery.Event} event - The jQuery event object.
 * 
 * Function Steps:
 * 1. Extract product details (ID, image, name, category, quantity, price) from the clicked row.
 * 2. Populate the update modal with the product details.
 * 3. Handle the form submission for updating the product:
 *    - If a new product image is uploaded, convert it to base64.
 *    - If the existing image is used (base64), fetch it from the data attribute.
 *    - Update the product with the new details.
 * 4. Call the necessary functions to update the product in the backend, refresh the product list,
 *    and display a toast message based on the success or failure of the update.
 *
 * @function
 */
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
        calculateTotalQuantityAndPrice();
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



/**
 * Event listener for placing an order when the "order" button is clicked in the product list table.
 * This function extracts product details from the table row, populates the order modal with the product data,
 * allows the user to select a quantity, and calculates the total price. It then handles form submission for
 * placing the order.
 *
 * @event Click on the order button in the product list.
 *
 * @param {jQuery.Event} event - The jQuery event object.
 * 
 * Function Steps:
 * 1. Extract product details (ID, image, name, quantity, price) from the clicked row.
 * 2. Populate the order modal with product details including setting up a quantity selector.
 * 3. Handle the quantity change event to dynamically calculate the total price.
 * 4. Submit the order form:
 *    - Send the product ID, selected quantity, and calculated total price to the backend.
 *    - Display success or error messages based on the result.
 *    - Refresh the product list after placing the order.
 *
 * @function
 */
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


/**
 * Event listener for deleting a product when the "delete" button is clicked in the product list table.
 * This function retrieves the product ID from the clicked table row, calls the deleteProduct method
 * to remove the product, and handles the result by displaying a success or error message. 
 * It also refreshes the product list after deletion.
 *
 * @event Click on the delete button in the product list.
 *
 * @param {jQuery.Event} event - The jQuery event object.
 * 
 * Function Steps:
 * 1. Extract the product ID from the clicked table row.
 * 2. Call the asynchronous deleteProduct function to remove the product from the database.
 * 3. Display a success or error message based on the result of the deletion.
 * 4. Refresh the product list by calling getProductsList().
 *
 * @function
 */
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




/**
 * Event listener for handling image input changes in the update or add product forms.
 * When the user selects a new image, this function reads the file, converts it to a Base64 data URL,
 * and updates the corresponding image preview element in the form.
 *
 * @event Change on the image input in either the #updateProductForm or #addProductForm.
 *
 * @param {jQuery.Event} e - The jQuery event object triggered by the change event.
 *
 * Function Steps:
 * 1. Capture the selected file from the input field.
 * 2. Use FileReader to asynchronously read the file and convert it to a Base64 string.
 * 3. Once the file is successfully read, update the `src` attribute of the image preview element 
 *    inside the form where the input field is located.
 *
 * @function
 */
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


/**
 * Event listener for the "Unselect Image" button.
 * When clicked, this function clears the selected image input and resets the image preview.
 *
 * @event Click on the element with the class `.unselect-image`.
 *
 * Function Steps:
 * 1. Clears the value of the image input field (`.image-input`) to remove the selected file.
 * 2. Resets the `src` attribute of the image preview element (`.image-preview`) to an empty string, 
 *    effectively removing the displayed image preview.
 *
 * @function
 */
$(".unselect-image").on("click", () => {
  $(".image-input").val("");
  $(".image-preview").attr("src", "");
});


/**
 * Event listener for elements with the attribute `[data-model]`.
 * When clicked, this function closes the currently open modal by invoking the `closeModal` method of the `modelClass`.
 *
 * @event Click on elements with the `[data-model]` attribute.
 *
 * Function Steps:
 * 1. Triggers the `closeModal` function from the `modelClass` to close the currently active modal.
 *
 * @function
 */
$("[data-model]").on("click", function () {
  modelClass.closeModal();
});


calculateTotalQuantityAndPrice();

 $('.number-only').on('input', function(){
  const input = $(this);
  const value = input.val().replace(/[^0-9.]/g, '');
  input.val(value);
 });