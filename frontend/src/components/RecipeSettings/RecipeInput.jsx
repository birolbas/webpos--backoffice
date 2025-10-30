import { use, useEffect, useState } from 'react'
import ProductStyle from '../MenuSettings/MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router";

import style from './RecipeInput.module.css'
import { Link } from 'react-router-dom'

function RecipeInput() {
    const navigate = useNavigate()
    const [recipeName, setRecipeName] = useState("Reçete İsmi Giriniz")
    const [ingredients, setIngredients] = useState([])
    const [cost, setCost] = useState(0)
    const [ingredientCost, setIngredientCost] = useState(0)
    const [subRecipeCost, setSubRecipeCost] = useState(0)
    const [unit, setUnit] = useState("KG")
    const [subRecipes, setSubRecipes] = useState([])
    const [isRecipeEdit, setIsRecipeEdit] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isSubRecipe, setIsSubRecipe] = useState("false")
    const params = useParams()

    const location = useLocation()

    const [subRecipeInputs, setSubRecipeInputs] = useState([{
        id: "",
        name: "",
        unit: "",
        amount: 0,
        cost_per_unit: 0,
        total_cost: 0,
    }])
    const [ingredientInputs, setIngredientInputs] = useState([{
        id: "",
        name: "",
        unit: "",
        amount: 0,
        cost_per_unit: 0,
        total_cost: 0,
    }])

    function setInput(inputIndex, e, isSubRecipe) {
        const tempInputs = isSubRecipe ? [...subRecipeInputs] : [...ingredientInputs]
        const forUseState = isSubRecipe ? setSubRecipeInputs : setIngredientInputs
        const ingOrSuB = isSubRecipe ? [...subRecipes] : [...ingredients]
        const ingredient_index = e.target.value
        tempInputs[inputIndex].id = ingOrSuB[ingredient_index].id
        tempInputs[inputIndex].unit = ingOrSuB[ingredient_index].unit
        tempInputs[inputIndex].cost_per_unit = ingOrSuB[ingredient_index].cost_per_unit
        tempInputs[inputIndex].name = ingOrSuB[ingredient_index].name
        tempInputs[inputIndex].amount = 0
        forUseState(tempInputs)
    }
    function changeAmount(index, e, isSubRecipe) {
        const tempInputs = isSubRecipe ? [...subRecipeInputs] : [...ingredientInputs]
        const costForUseState = isSubRecipe ? setSubRecipeCost : setIngredientCost
        const ingOrSuB = isSubRecipe ? [...subRecipes] : [...ingredients]
        const forUseState = isSubRecipe ? setSubRecipeInputs : setIngredientInputs
        tempInputs[index].amount = parseFloat(e.target.value)
        tempInputs[index].total_cost = parseFloat(tempInputs[index].cost_per_unit) * parseFloat(tempInputs[index].amount)

        var tempCost = 0
        tempInputs.forEach((input) => {

            if (!isNaN(input.total_cost))
                tempCost += input.total_cost
        })
        costForUseState(Number(tempCost.toFixed(2)))
        forUseState(tempInputs)
    }
    function addIngredient(isSubRecipe) {
        const tempInputs = isSubRecipe ? [...subRecipeInputs] : [...ingredientInputs]
        const forUseState = isSubRecipe ? setSubRecipeInputs : setIngredientInputs
        tempInputs.push({
            name: "",
            unit: "",
            amount: 0,
            cost_per_unit: 0,
        })
        console.log(tempInputs)
        forUseState(tempInputs)
    }
    const getDataFromDB = async () => {
        const tempIsEdit = (params["is-edit"])
        setIsEdit(Boolean(tempIsEdit))
        const recipeType = (params["recipe-type"])
        setIsSubRecipe(recipeType)
        console.log("typeof tempIsEdit", typeof tempIsEdit)
        if (tempIsEdit == "true") {
            const id = location?.state
            const editRecipeResponse = await fetch(`http://localhost:5000/getSubRecipeToEdit?edit_id=${id}`)
            const editRecipe = await editRecipeResponse.json()
            console.log("editRecipe", editRecipe)
            console.log("editRecipe.ingredients", editRecipe.ingredients)
            setRecipeName(editRecipe.ingredients[0].recipe_name)
            setIngredientInputs(editRecipe.ingredients)
            setSubRecipeInputs(editRecipe.sub_recipes)
            setIngredientCost(editRecipe.ingredient_cost)
            setSubRecipeCost(editRecipe.sub_recipe_cost)
            setCost(editRecipe.total_cost)
            
        }
        const response = await fetch("http://localhost:5000/getSubRecipeAndIngredients")
        const data = await response.json()
        setIngredients(data.ingredients)
        setSubRecipes(data.sub_recipes)
    }
    useEffect(() => {
        getDataFromDB()
    }, [])
    useEffect(() => {
        setCost(subRecipeCost + ingredientCost)
    }, [subRecipeCost, ingredientCost])
    useEffect(()=>{
        console.log("ingredientInputs", ingredientInputs)
    },[ingredientInputs])
    const saveRecipe = async () => {
        const obj = {
            recipeName: recipeName,
            recipeIngredients: ingredientInputs,
            recipeSubRecipes: subRecipeInputs,
            isSubRecipe: false
        }
        const response = await fetch("http://localhost:5000/saveUpperRecipe", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
            navigate("/reçeteler")
        }
    }

    const saveSubRecipe = async () => {
        const obj = {
            recipeName: recipeName,
            recipeIngredients: ingredientInputs,
            recipeSubRecipes: subRecipeInputs,
            recipeUnit: unit,
            isSubRecipe: true
        }
        const response = await fetch("http://localhost:5000/saveSubRecipe", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
            navigate("/reçeteler")
        }
    }

    return <>
        <div className={staticStyles["content-container"]}>
            <div className={ProductStyle["append-menu-item"]}>
                <div style={{ display: "flex" }} className={staticStyles["info-box"]}>
                    <Link to="/reçeteler"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                    </Link>
                    <div>
                        <h1>Yeni Reçete Ekle</h1>
                        <p>Malzemeleri ekleyerek yeni reçete oluştur ve maliyetlerini incele.</p>
                    </div>
                </div>
                <div className={staticStyles["action-container"]}>
                    <button className={staticStyles["purple-button"]} onClick={() => isSubRecipe == "true" ? saveSubRecipe() : saveRecipe()}>Reçeteyi Kaydet</button>
                </div>
            </div>
            <div className={style["recipe-information-container"]}>
                <h1>Bilgiler</h1>
                <div className={style["recipe-info-inputs"]}>
                    <div className={style["recipe-name-input"]}>
                        <label htmlFor="">Reçete Adı</label>
                        <input value={recipeName} onChange={(e) => setRecipeName(e.target.value)} type="text" name="" id="" />
                    </div>
                    <div className={style["recipe-category-input"]}>
                        <label htmlFor="">Birim</label>
                        <select onChange={(e) => setUnit(e.target.value)} id="unit" required defaultValue="">
                            <option value="KG">KG</option>
                            <option value="Litre">Litre</option>
                            <option value="Piece">Adet</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={style["ingredients-container"]}>
                <div className={style["ingredient-container-headers"]}>
                    <h1>Malzemeler</h1>
                    <button className={style["dark-blue-button"]} onClick={() => addIngredient(false)}>Yeni Malzeme Ekle</button>
                </div>
                <div style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }} className={style["table-headers"]}>
                    <p>Malzeme</p>
                    <p>Birim</p>
                    <p>Miktar</p>
                    <p >Maliyet</p>
                    <p >İşlemler</p>
                </div>
                <div id='input-container' className={style["input-container"]}>
                    {ingredientInputs.map((count, inputIndex) => {

                        return <><div style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }} id='input' className={style["input"]}>
                            <div className={style["ingredient-name"]} >

                                <select className={style["select-option"]} onChange={(e) => setInput(inputIndex, e, false)} id="ingredient-name"
                                    value={count.name ? ingredients.findIndex(ing => ing.name === count.name) : ""} required>
                                    <option value="" disabled>Malzeme Seçiniz</option>
                                    {ingredients?.map((ingredient, ingredient_index) => {
                                        return <option value={ingredient_index}> {ingredient.name} </option>
                                    })}
                                </select>
                            </div>
                            <div className={style["ingredient-unit"]}>
                                <input type="text" value={count.unit} />
                            </div>
                            <div className={style["ingredient-amount"]}>
                                <input defaultValue={count.quantity} onChange={(e) => (changeAmount(inputIndex, e, false))} type="number" name="" id="" placeholder='Lütfen ürün miktarını birime dikkat ederek giriniz' />
                            </div>
                            <div className={style["recipe-cost"]}>
                                <p>
                                    {count.total_cost}₺
                                </p>
                            </div>
                            <div className={style["action-container"]}>
                                <svg onClick={() => deleteProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </div>
                        </div></>
                    })}
                </div>

            </div>
            {isSubRecipe == "false" ? (
                <>
                    <div className={style["ingredients-container"]}>
                        <div className={style["ingredient-container-headers"]}>
                            <h1>Alt Reçeteler</h1>
                            <button className={style["dark-blue-button"]} onClick={() => addIngredient(true)} >Yeni Alt Reçete Ekle</button>
                        </div>
                        <div style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }} className={style["table-headers"]}>
                            <p>Alt Reçete</p>
                            <p>Birim</p>
                            <p>Miktar</p>
                            <p>Maliyet</p>
                            <p>İşlemler</p>
                        </div>
                        <div id='input-container' className={style["input-container"]}>
                            {subRecipeInputs.map((count, inputIndex) => (
                                <div style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }} id='input' className={style["input"]}>
                                    <div className={style["ingredient-name"]} >
                                        <select className={style["select-option"]} onChange={(e) => setInput(inputIndex, e, true)}
                                            value={count.name ? subRecipes.findIndex(sub => sub.name === count.name) : ""} required>
                                            <option value="" disabled>Alt Reçete Seçiniz</option>
                                            {subRecipes.map((subRecipe, ingredient_index) => (
                                                <option key={ingredient_index} value={ingredient_index}>
                                                    {subRecipe.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={style["ingredient-unit"]}>
                                        <input type="text" value={count.unit} />
                                    </div>
                                    <div className={style["ingredient-amount"]}>
                                        <input value={count.quantity} onChange={(e) => (changeAmount(inputIndex, e, true))} type="number" name="" id="" placeholder='Lütfen ürün miktarını birime dikkat ederek giriniz' />
                                    </div>
                                    <div className={style["recipe-cost"]}>
                                        <p>
                                            {count.amount == 0 ? 0 : (count.amount * parseFloat(count.cost_per_unit))}₺
                                        </p>
                                    </div>
                                    <div className={style["action-container"]}>
                                        <svg onClick={() => deleteProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : ""}
            <div className={style["cost-container"]}>
                <h1>Reçete Maliyeti</h1>
                <div className={style["cost-types"]}>
                    <div className={style["cost"]}>
                        <p>Malzeme Maliyeti</p>
                        <span>{ingredientCost}₺</span>
                    </div>
                    {isSubRecipe == "false" ? (
                        <div className={style["cost"]}>
                            <p>Alt Reçete Maliyeti</p>
                            <span>{subRecipeCost}₺</span>
                        </div>
                    ) : ""}
                    <div style={{ backgroundColor: "white" }} className={style["cost"]}>
                        <p style={{ color: "#4F46E5" }}>Toplam Maliyet</p>
                        <span style={{ color: "#4F46E5" }}>{cost}₺</span>
                    </div>
                </div>
            </div>
        </div>
    </>

}
export default RecipeInput