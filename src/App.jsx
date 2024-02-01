import "./App.css";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

function App() {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedAction, setSelectedAction] = useState("substract"); // Valor predeterminado
  const [productName, setProductName] = useState("");
  const [stockInitial, setStockInitial] = useState(1);
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStockInitial, setEditStockInitial] = useState(0);
  const [editPrice, setEditPrice] = useState(0);


  useEffect(() => {
    // Realizar la solicitud GET a la API al cargar el componente
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        // Almacenar la lista de productos en el estado
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
  }, []);

  const codeInputRef = useRef(null);
  const quantityInputRef = useRef(null);
  const productNameInputRef = useRef(null);
  const stockInitialInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let postData;

      if (
        selectedAction === "substract" ||
        selectedAction === "add" ||
        selectedAction === "defective" ||
        selectedAction === "edit"
      ) {
        postData = {
          code,
          quantity,
          stockInitial: editStockInitial,
          price: editPrice
        };
      } else if (selectedAction === "addProduct") {
        postData = {
          name: productName,
          stockInitial,
          price,
          code,
        };
      }

     let actionUrl;

     if (selectedAction === "substract") {
       actionUrl = "/products/substract";
     } else if (selectedAction === "add") {
       actionUrl = "/products/add";
     } else if (selectedAction === "defective") {
       actionUrl = "/products/defective";
     } else if (selectedAction === "edit"){
       actionUrl = "/products/edit"
     } else {
       actionUrl = "/products";
     }


      await axios.post(`http://localhost:8000${actionUrl}`, postData);
      setCode("");
      setQuantity(1);
      setProductName("");
      setStockInitial(0);
      setPrice(0);

      if (selectedAction === "addProduct") {
        productNameInputRef.current.focus();
      } else {
        codeInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedAction === "addProduct") {
        productNameInputRef.current.focus();
      } else {
        quantityInputRef.current.focus();
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sum = filteredProducts.reduce(
    (total, product) => total + product.total,
    0
  );
    const incomeEstimated = filteredProducts.reduce(
      (total, product) =>
        total +
        (parseInt(product.stockInitial) + parseInt(product.stockAdded)) *
          product.price,
      0
    );
    const incomeFuture = incomeEstimated - sum

  return (
    <div className="home">
      <span
        style={{
          position: "absolute",
          marginLeft: "15.8rem",
          marginTop: "-2rem",
          fontWeight: "800",
        }}
      >
        Productos: {filteredProducts.length}
      </span>
      <div className="search">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="inputSearch"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        action="/products/substract"
        method="post"
        className="form"
      >
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="substract">Restar Stock</option>
          <option value="add">Sumar Stock</option>
          <option value="edit">Editar stock</option>
          <option value="defective">Agregar Stock Dañado</option>
          <option value="addProduct">Añadir Producto</option>
        </select>
        <label>Código del producto</label>
        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleCodeKeyDown}
          ref={codeInputRef}
        />
        {selectedAction === "edit" && (
          <>
            <label>Stock Inicial</label>
            <input
              type="number"
              value={editStockInitial}
              onChange={(e) => setEditStockInitial(e.target.value)}
              required
            />
            <label>Precio</label>
            <input
              type="number"
              placeholder="Precio"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              required={true}
            />
          </>
        )}

        {selectedAction === "addProduct" && (
          <>
            <label>Nombre del producto</label>
            <input
              type="text"
              placeholder="Nombre del Producto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              ref={productNameInputRef}
              required
            />
            <label>Stock</label>
            <input
              type="number"
              value={stockInitial}
              onChange={(e) => setStockInitial(e.target.value)}
              ref={stockInitialInputRef}
              required
            />
            <label>Precio</label>
            <input
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              ref={priceInputRef}
              required={true}
            />
          </>
        )}
        {selectedAction !== "addProduct" && (
          <div>
            <label>Unidades</label>
            <input
              type="number"
              placeholder="Unidades"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              ref={quantityInputRef}
              required
            />
          </div>
        )}

        <button type="submit">Enviar</button>
      </form>
      <div className="cardContainer">
        {filteredProducts.map((product) => (
          <div className="card" key={product.id}>
            <div className="card__title">{product.name}</div>
            <div className="card__data">
              <div className="card__right">
                <div className="item" style={{ fontWeight: "800" }}>
                  Stock actual
                </div>
                <div className="item">Stock inicial</div>
                <div className="item">Stock añadido</div>
                <div className="item">Stock defectuoso</div>
                <div className="item">Stock vendido</div>
                <div className="item">Precio</div>
                <div className="item" style={{ fontWeight: "800" }}>
                  Total
                </div>
              </div>
              <div className="card__left">
                <div className="item" style={{ fontWeight: "800" }}>
                  {product.stockCurrent}
                </div>
                <div className="item">{product.stockInitial}</div>
                <div className="item">{product.stockAdded}</div>
                <div className="item">{product.stockDefective}</div>
                <div className="item">{product.stockSold}</div>
                <div className="item">
                  {product.price.toLocaleString("es", {
                    style: "currency",
                    currency: "COP",
                  })}
                </div>
                <div
                  className="item"
                  style={{ fontWeight: "800", color: "#53D353" }}
                >
                  {product.total.toLocaleString("es", {
                    style: "currency",
                    currency: "COP",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', height: '10rem', gap: '1rem'}}>
        <div className="total">
          <strong>Ingreso recibido</strong>{" "}
          <span style={{ color: "#53D353", fontWeight: "800" }}>
            {sum.toLocaleString("es", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </div>
        <div className="total">
          <strong>Ingreso estimado</strong>{" "}
          <span style={{ color: "#53D353", fontWeight: "800" }}>
            {incomeEstimated.toLocaleString("es", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </div>
        <div className="total">
          <strong>Ingreso por recibir</strong>{" "}
          <span style={{ color: "#53D353", fontWeight: "800" }}>
            {incomeFuture.toLocaleString("es", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
