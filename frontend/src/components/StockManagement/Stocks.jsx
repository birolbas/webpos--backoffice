import staticStyles from '../main/StaticStyle.module.css'
import styles from './Stocks.module.css'
import topBarStyle from '../MenuSettings/CondimentProducts.module.css'
import { useEffect, useState } from 'react'

function Stocks() {

    const [inputBox, setInputBox] = useState(false)

    const [stockMoves, setStockMoves] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const [ingredientId, setIngredientId] = useState(null)
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState()
    const [afterTransaction, setAfterTransaction] = useState()
    const [unit, setUnit] = useState()
    const [isAdd, setIsAdd] = useState(true)

    const [ingredients, setIngredients] = useState()

    const onMount = async () => {
        const stockMoves = await fetch("http://localhost:5000/getIngredientsOnStockMoves")
        if (stockMoves.ok) {
            const data = await stockMoves.json()
            console.log(data)
            setIngredients(data.ingredients)
            setStockMoves(data.stock_moves)
        }
    }
    useEffect(() => {
        onMount()
    }, [])

    const saveToDB = async () => {
        if (name.length > 0) {
            console.log()
            const obj = {
                name: name,
                ingredient_id: ingredientId,
                is_add: isAdd,
                unit: unit,
                quantity: quantity
            }
            const response = await fetch("http://localhost:5000/updateStock", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            if(response.ok){
                const returnings = await response.json()
                obj.id = returnings[0].id
                obj.stock_after_transaction = returnings[0].stock_after_transaction
                obj.created_at = returnings[0].created_at
                const tempStockMoves = [...stockMoves]
                tempStockMoves.push(obj)
                setStockMoves(tempStockMoves)
            }
        }
    }


    useEffect(() => {
        console.log(ingredientId)
        const tempIngredient = ingredients?.find(i => i.id == ingredientId)
        setUnit(tempIngredient?.unit)
        setName(tempIngredient?.name)
    }, [ingredientId])

    return <div className={staticStyles["content-container"]}>
        <div className={topBarStyle["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <h1>Zayi- Stok Ekle</h1>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => { setIsAdd(true), setInputBox(true) }}>Stok Ekle</button>
                <button onClick={() => { setIsAdd(false), setInputBox(true) }} className={staticStyles["purple-button"]}>Zayi Ekle</button>
            </div>
        </div>
        <div className={staticStyles["table-container"]} >
            <h1>İşlem Listesi</h1>
            <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                <p>Ürün Adı</p>
                <p>Eklenen- Çıkarılan Stok</p>
                <p>İşlem Sonrası Stok</p>
                <p>Birim</p>
                <p>Tarih</p>
                <p>İşlem Türü</p>
            </div>
            {stockMoves.map((move, index) => (
                <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                    <p>{move?.name}</p>
                    <p>{move?.quantity}</p>
                    <p>{move?.stock_after_transaction}</p>
                    <p>{move?.unit}</p>
                    <p>{move?.created_at}</p>
                    <p className={move.is_add ? staticStyles["status-active"] : staticStyles["status-passive"]}> {move.is_add ? "EKLE" : "ZAYİ"} </p>
                    <p style={{ display: "flex" }} className={styles["actions"]}>
                        <svg onClick={() => deleteRecipe(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </p>
                </div>
            ))}
        </div>
        {inputBox &&
            <div className={staticStyles["input-container"]}>
                <h1>Yeni Ürün Ekle</h1>
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]} >
                        <p>Ürün Adı</p>
                        <select onChange={(e) => setIngredientId(parseInt(e.target.value))} id="ProductTax" required defaultValue="">
                            <option value="" disabled selected hidden>BAĞLI REÇETE SEÇİNİZ</option>
                            {ingredients?.map((ingredient, index) => (
                                <option value={ingredient.id}> {ingredient.name} </option>
                            ))}
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Birim</p>
                        <input value={unit} type="text" placeholder="KATEGORİ" name="" id="Category" />
                    </div>
                </div>
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}>
                        <p>Bağlı Reçete</p>
                        <input value={isAdd ? "STOK EKLE" : "ZAYİ GİR"} name="" id="" />
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Miktar</p>
                        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" placeholder="ÜRÜN FİYATI" name="" id="ProductPrice" />
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => { setInputBox(false); setIsEditProduct(false) }} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={() => { isEdit ? saveEditedProduct() : saveToDB() }} >Kaydet</button>
                </div>
            </div>
        }

    </div>
}
export default Stocks