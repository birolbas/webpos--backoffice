import {  useEffect, useState } from 'react'
import ProductStyle from '../MenuSettings/MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
import styles from './AddRecipe.module.css'
import RecipeInput from './RecipeInput'
import { Link } from "react-router-dom"
function AddRecipe() {
    const [recipeType, setRecipeType] = useState()
    const [goInputScreen, setGoInputScreen] = useState(false)
    const [recipes, setRecipes] = useState([])
    const [recipeTypeInput, setRecipeTypeInput] = useState(false)
    const [isSureToDelete, setIsSureToDelete] = useState(false)

    const [deleteUiIndex, setDeleteUiIndex] = useState(null)

    function chooseRecipeType(recipe) {
        if (recipe == "prep-recipe") {
            setRecipeType("true")
        } else {
            setRecipeType("false")
        }
    }

    const getRecipesFromDB = async () => {
        const response = await fetch("http://localhost:5000/getRecipes")
        if (response.ok) {
            const data = await response.json()
            console.log("data", data)
            setRecipes(data)
            console.log(data)
            data.forEach((recipe) => {
                var ingredientCost = 0
                var subRecipeCost = 0
                recipe[3].forEach((item) => {
                    ingredientCost += item.total_cost
                })
                recipe[4].forEach((item) => {
                    subRecipeCost += item.total_cost
                })
                recipe.cost = ingredientCost + subRecipeCost
            })
            setRecipes(data)
        }
    }
    const deleteRecipeFromDB = async () => {
        const recipeToDelete = [...recipes]
        console.log("recipetodelete", recipeToDelete)
        const response = await fetch("http://localhost:5000/deleteRecipe", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:recipeToDelete[deleteUiIndex].id,
                                is_sub_recipe: recipeToDelete[deleteUiIndex].is_sub_recipe
            })
        })
        if(response.ok){
            recipeToDelete.splice(deleteUiIndex, 1)
            setRecipes(recipeToDelete)
        }
    }
    function deleteRecipe(index) {
        setIsSureToDelete(true)
        setDeleteUiIndex(index)
    }
    useEffect(() => {
        getRecipesFromDB()
    }, [])
    return <>
        <div className={staticStyles["content-container"]}>
            <div className={ProductStyle["append-menu-item"]}>
                <div className={staticStyles["info-box"]}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>Yeni ürün eklemek için sağ tarafta bulunan butonu kullanabilirsiniz. Düzenleme ve silme işlemleri için işlemler kategorisi altındaki butonları kullanabilirsiniz.</p>
                </div>
                <div className={staticStyles["save-button"]}>
                    <button onClick={() => setRecipeTypeInput(true)} >Yeni Reçete</button>
                </div>
            </div>
            <div className={staticStyles["table-banner"]}>
                <div className={styles["recipe-types"]}>
                    <button>Ürün Reçetesi</button>
                    <button>Hazırlık Reçetesi</button>
                </div>
            </div>
            <div className={staticStyles["table-container"]}>
                <h1>Reçeteler</h1>
                <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                    <p>Reçete Adı</p>
                    <p>Maliyet</p>
                    <p>Türü</p>
                    <p>İşlemler</p>
                </div>
                {recipes.map((recipe, index) => (
                    <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                        <p>{recipe.name}</p>
                        <p>{recipe.total_cost}₺</p>
                        <p> {recipe.is_sub_recipe ? "Alt Reçete" : "Ana Reçete"} </p>
                        <p className={styles["actions"]}>
                            <Link to={`/reçeteler/reçete-girişi/${recipe.is_sub_recipe}/${true}/`}
                                  state={recipe.id}>
                                <svg style={{fill:"black"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </Link>

                            <svg onClick={() => deleteRecipe(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </p>
                    </div>
                ))}
            </div>
        </div>
        {isSureToDelete && (
            <div className={staticStyles["confirm-container"]}>
                <div className={staticStyles["exclamation"]} >
                    <svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                    </svg>
                </div>
                <div className={staticStyles["confirm-text"]}>
                    <h1>Emin Misiniz?</h1>
                    <p>Reçeteyi silmek istediğinizden emin misiniz?</p>
                </div>
                <div className={staticStyles["confirm-buttons"]}>
                    <button onClick={() => {setIsSureToDelete(false); setDeleteUiIndex(null)}}>İptal</button>
                    <button onClick={() => deleteRecipeFromDB()} style={{ backgroundColor: "green", color: "white" }}>Çeki Sil</button>
                </div>
            </div>
        )}
        {recipeTypeInput ? (
            <div className={styles["recipe-type-input"]}>
                <h1>Reçete Türü Seçiniz</h1>
                <p>Oluşturmak istediğiniz reçete türünü seçerek devam edebilirsiniz.</p>

                <div className={styles["recipe-types"]}>
                    <div id='prep-recipe' onClick={() => chooseRecipeType('prep-recipe')} className={`${styles.recipeOption} ${recipeType === "true" ? styles.active : ""}`}>
                        <div className={styles["recipe-types-title"]} >
                            <h1>Hazırlık Reçetesi</h1>
                            <p>Ürünler içerisinde kullanılan soslar vs için reçete</p>
                            <p className={styles["examples"]} >Örnek: Pizza Sosu</p>
                        </div>
                    </div>

                    <div id='product-recipe' onClick={() => chooseRecipeType('product-recipe')} className={`${styles.recipeOption} ${recipeType === "false" ? styles.active : ""}`}>
                        <div className={styles["recipe-types-title"]}>
                            <h1>Ürün Reçetesi</h1>
                            <p>Ürünler içerisinde kullanılan soslar vs için reçete</p>
                            <p className={styles["examples"]} >Örnek: Pizza</p>
                        </div>
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => setRecipeTypeInput(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <Link to={`/reçeteler/reçete-girişi/${recipeType}/${false}`}>
                        <button onClick={() => setGoInputScreen(true)} >Devam Et</button>
                    </Link>
                </div>
            </div>
        ) : ""}

    </>



}
export default AddRecipe