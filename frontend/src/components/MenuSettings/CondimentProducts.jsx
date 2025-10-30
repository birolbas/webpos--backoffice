import { useEffect, useState } from 'react'
import staticStyles from '../main/StaticStyle.module.css'
import styles from './CondimentProducts.module.css'
function CondimentGroups() {
    const [products, setProducts] = useState([])
    const [isInput, setIsInput] = useState(false)
    const [isEditProduct, setIsEditProduct] = useState(false)

    const [inputID, setInputId] = useState(null)
    const [inputName, setInputName] = useState("")
    const [inputCategory, setInputCategory] = useState(null)
    const [inputRelatedRecipe, setInputRelatedRecipe] = useState(null)
    const [inputPrice, setInputPrice] = useState(0)
    const [recipes, setRecipes] = useState([])

    const saveToDB = async () => {
        if (inputName && inputCategory && inputPrice) {
            const obj = {
                name: inputName,
                category: inputCategory,
                relatedRecipe: inputRelatedRecipe,
                price: inputPrice
            }
            const response = await fetch("http://localhost:5000/saveCondimentItems", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            console.log(response)
            const id = await response.json()
            if (response.ok) {
                obj.id = id[0].id
                console.log("id is",id)
                setProducts(prev => [...prev, obj])
            }
        }
    }
    const getFromDB = async () => {
        const response = await fetch("http://localhost:5000/getCondimentItems")
        const data = await response.json()
        console.log("data", data)
        setProducts(data.combo_products)
        setRecipes(data.recipes)
    }
    function editProduct(productId) {
        const product = products.find(p => p.id == productId)
        console.log(product)
        setInputId(productId)
        setInputName(product.name)
        setInputCategory(product.category)
        setInputRelatedRecipe(product.relatedRecipe)
        setInputPrice(product.price)
        setIsEditProduct(true)
        setIsInput(true)
    }
    const deleteProduct = async (recipe_id, uiIndex) => {
        const response = await fetch("http://localhost:5000/deleteCondimentItem", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: recipe_id
        }
        )
        if (response.ok) {
            const tempProducts = [...products]
            tempProducts.splice(uiIndex, 1)
            setProducts(tempProducts)
        }
    }
    const saveEditedProduct = async () => {
        if (inputName && inputCategory && inputPrice) {
            const obj = {
                id: inputID,
                name: inputName,
                category: inputCategory,
                relatedRecipe: inputRelatedRecipe,
                price: inputPrice
            }
            const response = await fetch("http://localhost:5000/editCondimentItems", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            if (response.ok) {
                const tempProducts = [...products]
                const index = tempProducts.findIndex(p => p.id == obj.id)
                tempProducts[index].name = inputName
                tempProducts[index].category = inputCategory
                tempProducts[index].price = inputPrice
                tempProducts[index].related_recipe = inputRelatedRecipe
                setProducts(tempProducts)
                setIsInput(false)
                setIsEditProduct(false)
            }
        }
    }
    useEffect(() => {
        getFromDB()
    }, [])

    useEffect(() => {
        console.log(products)
    }, [products])
    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <h1>İlave Grubunda Kullanılacak Ürünleri Ekle</h1>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => setIsInput(!isInput)} className={staticStyles["purple-button"]}>Yeni Ürün Ekle</button>
            </div>
        </div>
        <div className={staticStyles["table-container"]} >
            <h1>Ürün Katoloğu</h1>
            <div className={staticStyles["table-header-style"]}>
                <p>Ürün Adı</p>
                <p>Kategori</p>
                <p>Bağlı Reçete</p>
                <p>Fiyat</p>
                <p>İşlemler</p>
            </div>
            {products?.map((recipe, index) => (
                <div style={{ gridTemplateColumns: "2fr 1fr 1fr 0.5fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                    <p>{recipe.name}</p>
                    <p>{recipe.category}</p>
                    <p>{recipe.relatedRecipe}</p>
                    <p>{recipe.price}₺</p>
                    <p style={{ display: "flex" }} className={styles["actions"]}>
                        <svg onClick={() => editProduct(recipe.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                        <svg onClick={() => deleteProduct(recipe.id, index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </p>
                </div>
            ))}
        </div>
        {isInput ? (
            <div className={staticStyles["input-container"]}>
                <h1>Yeni Ürün Ekle</h1>
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]} >
                        <p>Ürün Adı</p>
                        <input value={inputName} onChange={(e) => setInputName(e.target.value)} type="text" placeholder="ÜRÜN ADI" name="" id="ProductName" />
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Kategori</p>
                        <input value={inputCategory} onChange={(e) => setInputCategory(e.target.value)} type="text" placeholder="KATEGORİ" name="" id="Category" />
                    </div>
                </div>

                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}>
                        <p>Bağlı Reçete</p>
                        <select value={inputRelatedRecipe} onChange={(e) => setInputRelatedRecipe(e.target.value)} id="ProductTax" required defaultValue="">
                            <option value="" disabled selected hidden>BAĞLI REÇETE SEÇİNİZ</option>
                            {recipes.map((recipe, index) => (
                                <option value=""> {recipe.name} </option>
                            ))}
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Fiyat</p>
                        <input value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} type="number" placeholder="ÜRÜN FİYATI" name="" id="ProductPrice" />
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => { setIsInput(false); setIsEditProduct(false) }} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={() => { isEditProduct ? saveEditedProduct() : saveToDB() }} >Kaydet</button>
                </div>
            </div>
        ) : ""}
    </div>

} export default CondimentGroups
