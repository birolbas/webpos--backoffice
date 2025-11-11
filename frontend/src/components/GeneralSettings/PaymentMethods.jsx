import staticStyles from '../main/StaticStyle.module.css'
import styles from './PaymentMethods.module.css'
import { useState, useEffect } from 'react'
function PaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [editIndex, setEditIndex] = useState(null)

    const [isNewMethodInput, setIsNewMethodInput] = useState(false)

    const [isNewMethod, setIsNewMethod] = useState(true)

    const [methodId, setMethodId] = useState(null)
    const [methodName, setMethodName] = useState("")
    const [methodIncludedIncome, setMethodIncludedIncome] = useState(true)
    const [methodCommission, setMethodCommission] = useState()


    const setDataToDB = async () => {
        const obj = {
            name:methodName,
            commission: methodCommission,
            includedincome: methodIncludedIncome
        }
        const response = await fetch("http://localhost:5000/savePaymentMethods", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }
        )
        if(response.ok){
            const response_json = await response.json()
            const id = Number(response_json[0].id)
            obj.id = Number(id)
            const tempPaymentMethods = [...paymentMethods]
            tempPaymentMethods.push(obj)
            setPaymentMethods(tempPaymentMethods)
        }
    }
    const saveEditedMethod = async () => {
        const obj = {
            id: methodId,
            name: methodName,
            commission: methodCommission,
            includedincome: methodIncludedIncome
        }
        const response = await fetch("http://localhost:5000/saveEditedMethods", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }
        )
        if(response.ok){
            const tempPaymentMethods = [...paymentMethods]
            tempPaymentMethods[editIndex].name = methodName
            tempPaymentMethods[editIndex].commission = methodCommission
            tempPaymentMethods[editIndex].includedincome = methodIncludedIncome
            setPaymentMethods(tempPaymentMethods)
        }
    }

    const getDataFromDB = async () => {
        const response = await fetch("http://localhost:5000/getPaymentMethods")
        const data = await response.json()
        console.log(data)
        setPaymentMethods(data)
    }
    useEffect(() => {
        getDataFromDB()
    }, [])

    useEffect(() => {
        console.log(paymentMethods)
    }, [paymentMethods])

    function saveMethod() {

        if (isNewMethod) {
            const existingIndex = paymentMethods.findIndex(pM => pM.name === methodName)
            if (methodName.length == 0) {
                document.getElementById("MethodName").placeholder = "İsim boş bırakılamaz"
            }
            if (methodCommission.length == 0) {
                document.getElementById("MethodCommission").placeholder = "Komisyon kısmı boş bırakılamaz"
            } else if (existingIndex == -1) {
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "METOT İSMİ GİRİNİZ"
                document.getElementById("MethodCommission").value = ""
                setDataToDB()
            } else if (existingIndex != -1) {
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "Bu isimde bir ödeme seçeneği mevcut!!"
            }
        } else {
            const existingIndex = paymentMethods.findIndex(pM => pM.name === methodName)
            console.log("existingIndex")
            if (existingIndex == editIndex || existingIndex == -1 && methodName.length > 0) {
                setDataToDB()
            } else {
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "Bu isimde bir ödeme seçeneği mevcut!!"
            }
        }

    }

    const deleteMethodFromDB = async (db_index, ui_index) => {
        const response = await fetch("http://localhost:5000/deletePaymentMethod", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: db_index
        }
        )
        if (response.ok) {
            const tempPaymentMethods = [...paymentMethods]
            tempPaymentMethods.splice(ui_index, 1)
            setPaymentMethods(tempPaymentMethods)
        }
    }
    function editMethod(index) {
        setIsNewMethodInput(true)
        console.log("index", paymentMethods[index].name)
        setMethodId(paymentMethods[index].id)
        setMethodName(paymentMethods[index].name)
        setMethodCommission(paymentMethods[index].commission)
        setMethodIncludedIncome(paymentMethods[index].includedincome)
        setEditIndex(index)
        setIsNewMethod(false)
    }
    function PaymentMethodsFunc() {
        return <div className={styles["methods"]}>
            {paymentMethods.map((method, index) => (
                <div className={styles["method"]}>
                    <div className={styles["method-header"]}>
                        <div className={styles["method-name"]}>
                            <p>{method.name}</p>
                        </div>
                        <div className={styles["method-action-buttons"]}>
                            <svg onClick={() => {editMethod(index); setIsNewMethod(false)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                            <svg onClick={() => deleteMethodFromDB(paymentMethods[index].id, index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>

                        </div>
                    </div>
                    <div className={styles["method-info"]}>
                        <div className={styles["commission"]}>
                            <h3>Komisyon Oranı</h3>
                            <p className={method.commission > 0 ? styles["commission-percent-red"] : styles["commission-percent-green"]}>%{method.commission}</p>
                        </div>
                        <div className={styles["activeness"]}>
                            <h3>Ciroya Dahil Mi?</h3>
                            <p className={method.includedincome == true ? styles["activeness-green"] : styles["activeness-red"]}> {method.includedincome == true ? "Evet" : "Hayır"} </p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    }
    function noPaymentOption() {
        return <div className={styles["no-payment-option"]} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
            </svg>
            <h3>Henüz Ödeme Yöntemi Tanımlanmamış</h3>
            <p>Yukarıdaki "Yeni Ödeme Yöntemi" butonuna tıklayarak ilk ödeme yönteminizi ekleyin.</p>
        </div>
    }
    return <>
        <div className={staticStyles["content-container"]}>
            <div className={staticStyles["info-container"]}>
                <div className={staticStyles["save-div"]}>
                <div className={staticStyles["title"]}>Ödeme Yöntemleri</div>
                    <div className={staticStyles["save-button"]}>
                        <button onClick={() => setIsNewMethodInput(!isNewMethodInput)} >Yeni Ödeme Yöntemi</button>
                    </div>
                </div>
            </div>

            <div>
                {paymentMethods?.length > 0 ? PaymentMethodsFunc() : noPaymentOption()}
            </div>
            {isNewMethodInput &&
                <div className={staticStyles["input-container"]}>
                    <h1>Yeni Ödeme Metodu Ekle</h1>
                    <p>Metot Adı</p>
                    <input onChange={(e) => setMethodName(e.target.value)} type="text" placeholder="METOT İSMİ GİRİNİZ" name="" id="MethodName" value={methodName} />
                    <div className={staticStyles["two-form"]}>
                        <div className={staticStyles["form"]}  >
                            <p>Ciroya Dahil Mi?</p>
                            <select onChange={(e) => setMethodIncludedIncome(e.target.value)} id="MethodIncludedIncome" required defaultValue="">
                                <option value={true}>Evet</option>
                                <option value={false}>Hayır</option>
                            </select>
                        </div>
                        <div className={staticStyles["form"]} >
                            <p>Komisyon-Kesinti Oranı</p>
                            <input onChange={(e) => setMethodCommission(e.target.value)} type="number" placeholder="METOT ORANI GİRİNİZ" name="" id="MethodCommission" value={methodCommission} />
                        </div>
                    </div>
                    <div className={staticStyles["action-buttons"]}>
                        <button onClick={() => setIsNewMethodInput(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                        <button onClick={isNewMethod ? () => saveMethod() : () => saveEditedMethod()} >Kaydet</button>
                    </div>
                </div>

            }
        </div>
    </>

}
export default PaymentMethods