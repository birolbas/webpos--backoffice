import staticStyles from '../main/StaticStyle.module.css'
import style from './RecipeInput.module.css'
import IngredientsCSS from './Ingredients.module.css'
import { useEffect, useState } from 'react'
function Ingredients() {
    const [ingredients, setIngredients] = useState([])
    function saveIngredient(){
        const tempIngredients = [...ingredients]
        const input = document.getElementsByClassName(style["input"])[0].childNodes
        const ingredientName = input[0].firstChild.value
        const existingIndex = tempIngredients.findIndex(tI => tI.ingredientName == ingredientName)
        console.log(existingIndex)
        if(existingIndex == -1){
            const obj = {
                name: input[0].firstChild.value,
                unit: input[1].firstChild.value,
                cost_per_unit: parseFloat(input[2].firstChild.value).toFixed(2),
                invoice_names: input[3].firstChild.value
            }
            tempIngredients.push(obj)
            console.log(typeof obj.ingredientCost)
            setIngredients(tempIngredients)
            saveDataToDB(obj)
        }
    }
    const getDataFromDB = async()=>{
        const response = await fetch("http://localhost:5000/getIngredients")
        const data = await response.json()
        console.log(data)    
        setIngredients(data)
    }
    useEffect(()=>{
        getDataFromDB()
    },[])
    const saveDataToDB = async (tempIngredients) => {
        const response = await fetch("http://localhost:5000/saveIngredients", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempIngredients)
            })
        console.log(response)
    }
    function deleteProduct(index){
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
    
    return <div className={staticStyles["content-container"]}>
        <div className={staticStyles["info-container"]}>
            <div className={staticStyles["save-div"]}>
                <div className={staticStyles["info-box"]}>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>Reçete oluşturmak için malzemelerinizi ekleyebilirsiniz. Ayrıca faturadan otomatik fiyat güncellemesi yapmak için malzemelerin faturadaki isimlerini ekleyebilirsiniz </p>
                </div>
                <div className={staticStyles["save-button"]}>
                    <button >DEĞİŞİKLİKLERİ KAYDET</button>
                </div>
            </div>
            <div className={style["ingredients-container"]}>
                <div className={style["table-headers"]}>
                    <p>Malzeme Adı</p>
                    <p>Birim</p>
                    <p>Maliyet</p>
                    <p>Fatura İsimleri</p>
                    <p>İşlemler</p>
                </div>

                <div id='input-container' className={IngredientsCSS["input-container"]}>
                        <div className={IngredientsCSS["ingredient-container"]} >
                            {ingredients.map((ingredient, index)=>(
                                <div className={IngredientsCSS["ingredient"]}>
                                    <div className={IngredientsCSS["ingredient-name"]}> {ingredient.name} </div>
                                    <div className={IngredientsCSS["ingredient-unit"]}> {ingredient.unit}</div>
                                    <div className={IngredientsCSS["ingredient-cost"]}> {ingredient.cost_per_unit}</div>
                                    <div className={IngredientsCSS["ingredient-invoicenames"]}> {ingredient.invoice_names}</div>
                                    <div style={{display:"flex"}} className={style["actions"]}>
                                    <svg onClick={()=>editProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                    </svg>
                                    <svg onClick={()=>deleteProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>                                        
                                    </div>
                                </div>

                            ))}
                        </div>
                        <div id='input' className={style["input"]}>
                            <div className={IngredientsCSS["ingredient-name"]} >
                                <input type="text" name="" id="" />
                            </div>
                            <div className={IngredientsCSS["ingredient-unit"]}>
                                <select id="unit" required defaultValue="">
                                    <option value="KG">KG</option>
                                    <option value="Litre">Litre</option>
                                    <option value="Piece">Adet</option>
                                </select>
                            </div>
                            <div className={IngredientsCSS["ingredient-cost"]}>
                                <input type="number" name="" id="" />
                            </div>
                            <div className={style["recipe-cost"]}>
                                0
                            </div>
                            <div onClick={()=>saveIngredient()} className={style["action-container"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                </svg>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>



} export default Ingredients
