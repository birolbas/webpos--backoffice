import staticStyles from '../main/StaticStyle.module.css'
import styles from './PaymentMethods.module.css'
import { useState, useEffect, act } from 'react'
function PaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [isNewProduct, setIsNewProduct] = useState(true)
    const [editIndex, setEditIndex] = useState(0)
    const [isNewMethod, setIsNewMethod] = useState(false)

    const setDataToDB = async (paymentM) =>{
        const response = await fetch("http://localhost:5000/savePaymentMethods",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentM)
            }
        )
    }
    const getDataFromDB = async () => {
        const response = await fetch("http://localhost:5000/getPaymentMethods")
        const data = await response.json()
        console.log(data)
        setPaymentMethods(data[0][0])
    }
    useEffect(()=>{
        getDataFromDB()
    },[])
    function closeCreateProduct(){
        document.getElementsByClassName(staticStyles["input-container"])[0].style.display = "none"
    }
    useEffect(()=>{
        console.log(paymentMethods)
    },[paymentMethods])
    function saveMethod(){
        if(isNewProduct){
            const name = document.getElementById("MethodName").value
            const existingIndex = paymentMethods.findIndex(pM=> pM.name === name)
            const includedIncome = document.getElementById("MethodIncludedIncome").value
            const commission = document.getElementById("MethodCommission").value
            if(name.length == 0){
                console.log(name.length)
                document.getElementById("MethodName").placeholder = "İsim boş bırakılamaz"
            }
            if(commission.length == 0){
                document.getElementById("MethodCommission").placeholder = "Komisyon kısmı boş bırakılamaz"
            }else if(existingIndex == -1 ){
                const object = {
                    name: name,
                    includedIncome: includedIncome,
                    commission: commission
                }
                const tempPaymentMethods = [...paymentMethods]
                tempPaymentMethods.push(object)
                setDataToDB(tempPaymentMethods)
                setPaymentMethods(tempPaymentMethods)
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "METOT İSMİ GİRİNİZ"
                document.getElementById("MethodCommission").value = ""
            }else if(existingIndex !=-1){
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "Bu isimde bir ödeme seçeneği mevcut!!"
            }
        }else{
            const tempPaymentMethods = [...paymentMethods]
            const newName =  document.getElementById("MethodName").value
            const existingIndex = paymentMethods.findIndex(pM=> pM.name === newName)
            console.log(existingIndex)
            if(existingIndex == editIndex || existingIndex ==-1 && newName.length > 0){
                tempPaymentMethods[editIndex].name = document.getElementById("MethodName").value
                tempPaymentMethods[editIndex].includedIncome = document.getElementById("MethodIncludedIncome").value
                tempPaymentMethods[editIndex].commission = document.getElementById("MethodCommission").value
                setPaymentMethods(tempPaymentMethods)
                setDataToDB(tempPaymentMethods)
                closeCreateProduct()

            }else{
                document.getElementById("MethodName").value = ""
                document.getElementById("MethodName").placeholder = "Bu isimde bir ödeme seçeneği mevcut!!"
            }
        }

    }
    function deleteMethod(index){
        const tempPaymentMethods = [...paymentMethods]
        tempPaymentMethods.splice(index, 1)
        setPaymentMethods(tempPaymentMethods)
        setDataToDB(tempPaymentMethods)
    }
    function editMethod(index){
        setIsNewMethod(true)
        console.log([document.getElementById("MethodName").value])
        document.getElementById("MethodName").value = paymentMethods[index].name
        document.getElementById("MethodIncludedIncome").value = paymentMethods[index].includedIncome
        document.getElementById("MethodCommission").value = paymentMethods[index].commission
        setEditIndex(index)
    }
    function PaymentMethodsFunc(){
        return <div className={styles["methods"]}>
                    {paymentMethods.map((method, index)=>(
                        <div className={styles["method"]}>
                            <div className={styles["method-header"]}>
                                <div className={styles["method-name"]}>
                                    <p>{method.name}</p>                        
                                </div>
                                <div className={styles["method-action-buttons"]}>
                                    <svg onClick={()=>editMethod(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>
                                    <svg onClick={()=>deleteMethod(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
            
                                </div>
                            </div>
                            <div className={styles["method-info"]}>
                                <div className={styles["commission"]}>
                                    <h3>Komisyon Oranı</h3>
                                    <p className = {method.commission > 0 ? styles["commission-percent-red"] : styles["commission-percent-green"]}>%{method.commission}</p>
                                </div>
                                <div className={styles["activeness"]}>
                                    <h3>Ciroya Dahil Mi?</h3>
                                    <p className = {method.includedIncome == "Evet"  ? styles["activeness-green"] : styles["activeness-red"] }>{method.includedIncome}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
    }
    function noPaymentOption(){
        return            <div className={styles["no-payment-option"]} >
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
                    <div className={staticStyles["info-box"]}>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                            </svg>Ödeme yöntemlerini yönetin ve komisyon oranlarını belirleyin. Yeni ödeme yöntemi eklemek için yeşil butona basın. Mevcut yöntemleri düzenlemek veya silmek için kart üzerindeki düğmeleri kullanın.
                        </p>
                    </div>
                    <div className={staticStyles["save-button"]}>
                        <button onClick={()=>setIsNewMethod(!isNewMethod)} >Yeni Ödeme Yöntemi</button>
                    </div>
                </div>
            </div>
            <div className={staticStyles["table-banner"]}>
                <div className={staticStyles["title"]}>Ödeme Yöntemleri</div>
            </div>
            <div>
                {paymentMethods.length > 0 ? PaymentMethodsFunc(): noPaymentOption()}
            </div>
                {isNewMethod &&
                <div className={staticStyles["input-container"]}>
                    <h1>Yeni Ödeme Metodu Ekle</h1>
                    <p>Metot Adı</p>
                    <input type="text" placeholder="METOT İSMİ GİRİNİZ" name="" id="MethodName" />
                    <div className={staticStyles["two-form"]}>
                        <div className={staticStyles["form"]}  >
                            <p>Ciroya Dahil Mi?</p>
                            <select id="MethodIncludedIncome" required defaultValue="">
                                <option value="Evet">Evet</option>
                                <option value="Hayır">Hayır</option>
                            </select>
                        </div>
                        <div className={staticStyles["form"]} >
                            <p>Komisyon-Kesinti Oranı</p>
                            <input type="number" placeholder="METOT ORANI GİRİNİZ" name="" id="MethodCommission" />
                        </div>
                    </div>
                    <div className={staticStyles["action-buttons"]}>
                        <button onClick={() => closeCreateProduct()} style={{ backgroundColor: "#374151" }}>İptal</button>
                        <button onClick={() => saveMethod()} >Kaydet</button>
                    </div>
                </div>
                
                }
        </div>
    </>

}
export default PaymentMethods