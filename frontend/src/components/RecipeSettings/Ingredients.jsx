import staticStyles from '../main/StaticStyle.module.css'
import style from './RecipeInput.module.css'
import IngredientsCSS from './Ingredients.module.css'
import { useEffect, useState } from 'react'
import LeftBar from '../LeftBar/LeftBar'
function Ingredients() {
    const [ingredientInputBox, setIngredientInputBox] = useState(false)
    const [ingredientName, setIngredientName] = useState("")
    const [ingredientStockCategory, setIngredientStockCategory] = useState()
    const [ingredientUnit, setIngredientUnit] = useState("KG")
    const [ingredientStockQuantity, setIngredientStockQuantity] = useState()
    const [ingredientStockCheck, setIngredientStockCheck] = useState()
    const [ingredientCost, setIngredientStockCost] = useState()
    useEffect(() => {
        console.log("ingredientStockCategory,", ingredientStockCategory)
    }, [ingredientStockCategory])
    const [ingredients, setIngredients] = useState([])
    const [stockCategories, setStockCategories] = useState([])

    const getDataFromDB = async () => {
        const response = await fetch("http://localhost:5000/getIngredients")
        const data = await response.json()
        setIngredients(data.ingredients)
        console.log("data", data)
        setStockCategories(data.stock_categories)
    }
    useEffect(() => {
        getDataFromDB()
    }, [])
    const saveDataToDB = async () => {
        const tempIngredients = [...ingredients]
        const existingIndex = tempIngredients.findIndex(tI => tI.ingredientName == ingredientName)
        console.log("stockCategories", stockCategories, "ingredientStockCategory", ingredientStockCategory)
        const stockCategoryId = stockCategories.findIndex(sC => sC.name == ingredientStockCategory)
        console.log("stockCategoryId", stockCategoryId)
        if (existingIndex == -1) {
            const obj = {
                name: ingredientName,
                stockCategory: ingredientStockCategory,
                unit: ingredientUnit,
                stockQuantity: ingredientStockQuantity,
                stockCheck: ingredientStockCheck,
                cost_per_unit: ingredientCost,
            }
            const response = await fetch("http://localhost:5000/saveIngredients", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tempIngredients)
            })
            if(response.ok){
                tempIngredients.push(obj)
                setIngredients(tempIngredients)
            }
        }
    }
    

    function deleteProduct(index) {
        const tempIngredients = [...ingredients]
        console.log(tempIngredients)
        const databaseIndex = tempIngredients[index].id
        tempIngredients.splice(index, 1)
        setIngredients(tempIngredients)
        deleteIngredient(databaseIndex)
    }
    const deleteIngredient = async (databaseIndex) => {
        const response = await fetch("http://localhost:5000/deleteIngredient", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(databaseIndex)
        })
        console.log(response)
    }
    
    function editIngredient(ingredientId){
        const ingredient = ingredients.find(i => i.id == ingredientId)
        console.log("ingrredient", ingredient)
        setIngredientName(ingredient.name)
        setIngredientStockCategory(ingredient.stock_category_id)
        setIngredientUnit(ingredient.unit)
        setIngredientStockQuantity(ingredient.stock_quantity)
        setIngredientStockCheck(ingredient.stockcheck)
        setIngredientStockCost(ingredient.cost_per_unit)
        setIngredientInputBox(true)
    }
    useEffect(()=>{
        console.log(stockCategories)
        
    },[ingredientStockCategory])
    return <div className={staticStyles["content-container"]}>
        <div className={staticStyles["info-container"]}>
            <div className={staticStyles["save-div"]}>
                <div className={staticStyles["info-box"]}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>Reçete oluşturmak için malzemelerinizi ekleyebilirsiniz. Ayrıca faturadan otomatik fiyat güncellemesi yapmak için malzemelerin faturadaki isimlerini ekleyebilirsiniz </p>
                </div>
            <div onClick={() => setIngredientInputBox(true)} className={style["action-container"]}>
                <button>DEĞİŞİKLİKLERİ KAYDET</button>
            </div>

            </div>

            <div className={style["ingredients-container"]}>
                <div className={IngredientsCSS["ingredient-headers"]}>
                    <h1>Malzeme Listesi</h1>
                </div>
                <div style={{ gridTemplateColumns: "1.5fr 1fr 0.25fr 1fr 1fr 0.5fr 1fr 0.5fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                    <p>Ürün Adı</p>
                    <p>Stok Kategorisi</p>
                    <p>Birim</p>
                    <p>Stoktaki Miktar</p>
                    <p>Kritik Stok Kontrolü</p>
                    <p>Maliyet</p>
                    <p>Durum</p>
                    <p>Fatura İsimleri</p>
                    <p>İşlemler</p>
                </div>

                <div id='input-container' className={IngredientsCSS["input-container"]}>
                    <div className={IngredientsCSS["ingredient-container"]} >
                        {ingredients.map((ingredient, index) => (
                            <div style={{ gridTemplateColumns: "1.5fr 1fr 0.25fr 1fr 1fr 0.5fr 1fr 0.5fr 0.5fr" }} className={IngredientsCSS["ingredient"]}>
                                <div className={IngredientsCSS["ingredient-name"]}> {ingredient.name} </div>
                                <div>{ingredient.stock_category}</div>
                                <div className={IngredientsCSS["ingredient-unit"]}> {ingredient.unit}</div>
                                <p> {ingredient.stock_quantity} {ingredient.unit} </p>
                                <p> {ingredient.stockcheck} </p>
                                <div className={IngredientsCSS["ingredient-cost"]}> {ingredient.cost_per_unit}₺</div>
                                {ingredient.stock_quantity > ingredient.stockcheck ? (
                                    <div className={IngredientsCSS["enough-stock"]}>
                                        <p>Stok Yeterli</p>
                                    </div>
                                ) : ingredient.stock_quantity < 0 ? (
                                    <div className={IngredientsCSS["out-of-stock"]}>
                                        <p>Stokta Ürün Yok</p>
                                    </div>) : (
                                    <div className={IngredientsCSS["normal-stock"]}>
                                        <p>Kritik Stok Altında</p>
                                    </div>
                                )
                                }


                                <div>{ingredient.invoice_names}</div>
                                <div style={{ display: "flex" }} className={style["actions"]}>
                                    <svg onClick={() => editIngredient(ingredient.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                    </svg>
                                    <svg onClick={() => deleteProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </div>
                            </div>

                        ))}
                    </div>

                </div>
            </div>
            {ingredientInputBox ? (
                <div className={staticStyles["input-container"]}>
                    <h1>Yeni Ürün Ekle</h1>
                    <p>Ürün Adı</p>
                    <input value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} type="text" placeholder="ÜRÜN İSMİ" name="" id="ProductName" />
                    <div className={staticStyles["two-form"]}>
                        <div className={staticStyles["form"]}  >
                            <p>Stock Kategorisi</p>
                            <select value={ingredientStockCategory} onChange={(e) => setIngredientStockCategory(e.target.value)} id="unit" required defaultValue="">
                                <option value="" disabled defaultValue={null} hidden>Stok Kategorisi Seçiniz</option>
                                {stockCategories.map((category, index) => (
                                    <option value={category.parent_id}> {category.name} </option>

                                ))}
                            </select>
                        </div>
                        <div className={staticStyles["form"]} >
                            <p>Birim</p>
                            <select onChange={(e) => setIngredientUnit(e.target.value)} id="unit" required defaultValue="">
                                <option value="KG">KG</option>
                                <option value="Litre">Litre</option>
                                <option value="Piece">Adet</option>
                            </select>
                        </div>
                    </div>

                    <div className={staticStyles["two-form"]}>
                        <div className={staticStyles["form"]}>
                            <p>Stok Miktarı</p>
                            <input value={ingredientStockQuantity} onChange={(e) => setIngredientStockQuantity(e.target.value)} type="number" name="" id="" />
                        </div>
                        <div className={staticStyles["form"]} >
                            <p>Stok Kontrolü</p>
                            <input value={ingredientStockCheck} onChange={(e) => setIngredientStockCheck(e.target.value)} placeholder='Girdiğiniz değer kadar stok kalınca uyarı yapılacak.' type="number" name="" id="" />
                        </div>

                    </div>
                    <div className={staticStyles["two-form"]}>
                        <div className={staticStyles["form"]}>
                            <p>Maliyet</p>
                            <input value={ingredientCost} onChange={(e) => setIngredientStockCost(e.target.value)} type="number" name="" id="" />

                        </div>
                        <div className={staticStyles["form"]}>
                            <p>Fatura İsimleri</p>
                            <input type="text" />

                        </div>

                    </div>


                    <div className={staticStyles["action-buttons"]}>
                        <button onClick={() => setIngredientInputBox(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                        <button onClick={saveDataToDB ? () => saveDataToDB() : () => saveEditedProductToDB()} >Kaydet</button>
                    </div>
                </div>
            ) : ""}
        </div>
    </div>



} export default Ingredients
