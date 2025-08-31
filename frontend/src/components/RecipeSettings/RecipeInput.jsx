import { use, useEffect, useState } from 'react'
import ProductStyle from '../MenuSettings/MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
import style from './RecipeInput.module.css'
function RecipeInput() {
    const [recipeName, setRecipeName] = useState("Reçete İsmi Giriniz")
    const [ingredients, setIngredients] = useState([])
    const [cost, setCost] = useState(0)
    const [inputs, setInputs] = useState([{
        name: "",
        unit: "",
        amount:0,
        cost_per_unit: 0,
        total_cost: 0,
    }])
    function setInput(inputIndex, e){
        const tempInputs = [...inputs]
        const ingredient_index = e.target.value
        tempInputs[inputIndex].name = ingredients[ingredient_index].name
        tempInputs[inputIndex].unit = ingredients[ingredient_index].unit
        tempInputs[inputIndex].amount = 0
        tempInputs[inputIndex].cost_per_unit = ingredients[ingredient_index].cost_per_unit
        console.log(tempInputs)
        setInputs(tempInputs)
    }
    function changeAmount(index, e){
        const tempInputs = [...inputs]
        console.log("e is", e.target.value)
        tempInputs[index].amount = e.target.value
        tempInputs[index].total_cost = parseFloat(tempInputs[index].cost_per_unit) * parseFloat(tempInputs[index].amount)
        console.log("tempInputs[index].total_cost", tempInputs[index].total_cost)
        var tempCost = cost
        console.log(tempCost + tempInputs[index].total_cost )
        setCost(tempCost + tempInputs[index].total_cost )
        setInputs(tempInputs)
    }
    function addIngredient(){
        const tempInputs = [...inputs]
        tempInputs.push({
            name: "",
            unit: "",
            amount:0,
            cost_per_unit: 0,
        })
        console.log(tempInputs)
        setInputs(tempInputs)
    }
    const getDataFromDB = async () => {
        const response = await fetch("http://localhost:5000/getIngredients")
        const data = await response.json()
        console.log(data)    
        setIngredients(data)
    }
    useEffect(()=>{
        getDataFromDB()
    },[])
    return <>
        <div className={ProductStyle["content-container"]}>
            <div className={ProductStyle["append-menu-item"]}>
                <div style={{ display: "flex" }} className={staticStyles["info-box"]}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg></p>
                    <p className={style["recipe-name-input"]}>Reçete Adı:{recipeName}:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z">
                        </path><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z">
                        </path></svg>
                    </p>
                </div>
            </div>
            <div className={style["ingredients-container"]}>
                <div className={style["table-headers"]}>
                    <p>Malzeme</p>
                    <p>Birim</p>
                    <p>Miktar</p>
                    <p>Maliyet</p>
                    <p>İşlemler</p>
                </div>
                <div id='input-container' className={style["input-container"]}>
                    {inputs.map((count, inputIndex)=>(
                        <div id='input' className={style["input"]}>
                            <div className={style["ingredient-name"]} >
                                <select className={style["select-option"]} onChange={(e)=>setInput(inputIndex, e)}  id="ingredient-name" required defaultValue="">
                                    <option value="" disabled selected hidden>Malzeme Seçiniz</option>
                                    {ingredients.map((ingredient, ingredient_index)=>(
                                        <option value={ingredient_index}> {ingredient.name} </option>
                                    ))}
                                </select>
                            </div>
                            <div className={style["ingredient-unit"]}>
                                {count.unit}
                            </div>
                            <div className={style["ingredient-amount"]}>
                                <input onChange={(e)=>(changeAmount(inputIndex, e))} type="number" name="" id="" placeholder='Lütfen ürün miktarını birime dikkat ederek giriniz'/>
                            </div>
                            <div className={style["recipe-cost"]}>
                                {count.amount == 0 ? 0 : (count.amount * parseFloat(count.cost_per_unit))}
                            </div>
                            <div className={style["action-container"]}>
                                <svg onClick={() => editProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
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
                <div onClick={()=>addIngredient()} className={style["new-ingredient"]} > <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>Yeni Malzeme Ekle</div>
                <div className={style["cost-container"]}>
                    <p>Toplam Maliyet: {cost} </p>
                </div>
            </div>
        </div>
    </>

}
export default RecipeInput