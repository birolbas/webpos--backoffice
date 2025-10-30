import staticStyles from '../main/StaticStyle.module.css'
import styles from './Discount.module.css'
import { useEffect, useState } from 'react'
function Discount() {
    const [isInputBox, setIsInputBox] = useState(false)
    const [discountId, setDiscountId] = useState(null)
    const [discountName, setDiscountName] = useState("")
    const [isDiscountFixed, setIsDiscountFixed] = useState(false)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [discounts, setDiscounts] = useState([])
    const [isNewDiscount, setIsNewDiscount] = useState(true)
    const [discountEditIndex, setDiscountEditIndex] = useState(null)

    const saveEditedDiscount = async () => {
        if (discountName && discountAmount) {
            const obj = {
                id: discountId,
                name: discountName,
                is_fixed: isDiscountFixed,
                amount: discountAmount
            }
            try {
                const response = await fetch("http://localhost:5000/saveEditedDiscount", {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj)
                })
                console.log(response)
                if (response.ok) {
                    const tempDiscounts = [...discounts]
                    tempDiscounts[discountEditIndex].name = discountName
                    tempDiscounts[discountEditIndex].is_fixed = isDiscountFixed
                    tempDiscounts[discountEditIndex].amount = discountAmount
                    setDiscounts(tempDiscounts)
                    setDiscountId(null)
                    setDiscountName("")
                    setDiscountAmount(0)
                    setDiscountEditIndex(null)
                    setIsInputBox(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        getFromDB()
    }, [])

    const getFromDB = async () => {
        try {
            const response = await fetch("http://localhost:5000/getDiscounts")
            const data = await response.json()
            console.log("data is ", data)
            setDiscounts(data)
        } catch (error) {
            console.log(error)
        }
    }
    const saveToDB = async () => {
        const obj = {
            name: discountName,
            is_fixed: isDiscountFixed,
            amount: discountAmount
        }
        try {
            const response = await fetch("http://localhost:5000/saveDiscounts", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            console.log(response)
            if (response.ok) {
                const tempDiscounts = [...discounts]
                tempDiscounts.push(obj)
                setDiscounts(prev => [...prev, obj])
                setDiscountName("");
                setDiscountAmount("");
                setIsDiscountFixed(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteDiscount = async (ui_index, db_index) => {
        try {
            const response = await fetch("http://localhost:5000/deleteDiscount", {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: db_index
            })
            console.log(response)
            if (response.ok) {
                const tempDiscounts = [...discounts]
                tempDiscounts.splice(ui_index, 1)
                setDiscounts(tempDiscounts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function editDiscount(index) {
        const discountToEdit = discounts[index]
        setDiscountEditIndex(index)
        setIsInputBox(true)
        setIsNewDiscount(false)
        setDiscountId(discountToEdit.id)
        setDiscountName(discountToEdit.name)
        setDiscountAmount(discountToEdit.amount)
        setIsDiscountFixed(discountToEdit.is_fixed)
    }
    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>İndirim tanımlamak için sağ taraftaki butonu kullanabilirsiniz. Yüzdesel veya sabit tutar indirimler tanımlayabilirsiniz.</p>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => { setIsInputBox(true); setIsNewDiscount(true) }} >Yeni Ürün</button>
            </div>
        </div>
        <div className={staticStyles["table-banner"]}>
            <div className={staticStyles["title"]}> İndirimler</div>
        </div>

        <div className={styles["discount-container"]}>
            <div style={{ gridTemplateColumns: "1fr 1fr 1fr .5fr" }} className={staticStyles["table-header-style"]}>
                <p>İndirim Adı</p>
                <p>İndirim Türü</p>
                <p>İndirim Miktarı</p>
                <p>İşlemler</p>
            </div>

            {discounts.map((discount, index) => (
                <div style={{ gridTemplateColumns: "1fr 1fr 1fr .5fr" }} className={staticStyles["table-item-style"]}>
                    <p> {discount.name} </p>
                    <p> {discount.is_fixed == true ? "SABİT ÜCRET" : "YÜZDESEL"} </p>
                    <p> {discount.amount} </p>
                    <p style={{ display: "flex" }} > <svg onClick={() => editDiscount(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                        <svg onClick={() => deleteDiscount(index, discount.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </p>
                </div>
            ))}
        </div>




        {isInputBox &&
            <div className={staticStyles["input-container"]}>
                <h1>İndirim Ekle</h1>
                <p>İndirim Adı</p>
                <input value={discountName} onChange={(e) => setDiscountName(e.target.value)} type="text" placeholder="İNDİRİM ADI GİRİNİZ" name="" id="MethodName" />
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}  >
                        <p>İndirim Türü</p>
                        <select value={isDiscountFixed} onChange={(e) => setIsDiscountFixed(e.target.value)}
                            id="DiscountType" required defaultValue="">
                            <option value={false}>YÜZDESEL</option>
                            <option value={true}>SABİT ÜCRET</option>
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Değer</p>
                        {isDiscountFixed == true ? <input value={discountAmount} onChange={(e) => setDiscountAmount(Number(parseFloat(e.target.value).toFixed(2)))} placeholder="İNDİRİM ÜCRETİNİ GİRİNİZ" name="" id="DiscountAmount" type='number' /> :
                            <input value={discountAmount} onChange={(e) => setDiscountAmount(Number(parseFloat(e.target.value).toFixed(2)))} placeholder="İNDİRİM ORANI GİRİNİZ" min={0} max={100} name="" id="DiscountAmount" type='number' />}
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => setIsInputBox(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={() => { isNewDiscount ? saveToDB() : saveEditedDiscount() }} >Kaydet</button>
                </div>
            </div>
        }
    </div>
}
export default Discount