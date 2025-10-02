import staticStyles from '../main/StaticStyle.module.css'
import styles from './Discount.module.css'
import { useState, useEffect } from 'react'
function ServiceCharge() {
    const [newServiceCharge, setNewServiceCharge] = useState(false)
    const [serviceChargeName, setServiceChargeName] = useState("")
    const [serviceChargeType, setServiceChargeType] = useState("")
    const [serviceChargeAmount, setServiceChargeAmount] = useState(0)
    const [serviceCharges, setServiceCharges] = useState([])

    function saveServiceCharge() {
        const obj = {
            serviceChargeName: serviceChargeName,
            serviceChargeAmount: serviceChargeAmount,
            serviceChargeType: serviceChargeType
        }
        const tempServiceCharges = [...serviceCharges]
        tempServiceCharges.push(obj)
        setServiceCharges(prev => [...prev, obj])

        setServiceChargeName("");
        setServiceChargeAmount(0);
        setServiceChargeType("");
        setNewServiceCharge(false)
        saveToDB(tempServiceCharges)
    }
    useEffect(()=>{
        getFromDB()
    },[])

    const getFromDB = async () => {
        try {
            const response = await fetch("http://localhost:5000/getServiceCharges")
            const data = await response.json()
            console.log("data is ", data[0][0])
            setServiceCharges(data[0][0])
        } catch (error) {
            console.log(error)
        }
    }
    const saveToDB = async (tempServiceCharges) => {
        try {
            const response = await fetch("http://localhost:5000/saveServiceCharges", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tempServiceCharges)
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    function deleteCharge(index){
        const tempServiceCharges = [...serviceCharges]
        tempServiceCharges.splice(index, 1)
        setServiceCharges(tempServiceCharges)
        saveToDB(tempServiceCharges)
    }

    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>Servis ücreti tanımlamak için sağ taraftaki butonu kullanabilirsiniz. Yüzdesel veya sabit tutar indirimler tanımlayabilirsiniz.</p>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => setNewServiceCharge(!newServiceCharge)} >Yeni Servis Ücreti</button>
            </div>
        </div>
        <div className={staticStyles["table-banner"]}>
            <div className={staticStyles["title"]}> Servis Ücretileri</div>
        </div>

        <div className={staticStyles["table-container"]}>
            <div style={{gridTemplateColumns:"1fr 1fr 1fr .5fr"}} className={staticStyles["table-header-style"]}>
                <p>Servis Ücreti Adı</p>
                <p>Servis Ücreti Türü</p>
                <p>Servis Ücreti Miktarı</p>
                <p>İşlemler</p>

            </div>

            {serviceCharges.map((charge, index) => (
                <div style={{gridTemplateColumns:"1fr 1fr 1fr .5fr"}} className={staticStyles["table-item-style"]}>
                    <p> {charge.serviceChargeName} </p>
                    <p> {charge.serviceChargeType == "Fixed" ? "SABİT" : "YÜZDESEL"}  </p>
                    <p> {charge.serviceChargeAmount} </p>
                    <p style={{display:"flex"}}> <svg onClick={() => editProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                        <svg onClick={() => deleteCharge(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                    </p>
                </div>
            ))}
        </div>




        {newServiceCharge &&
            <div className={staticStyles["input-container"]}>
                <h1>Servis Ücreti Ekle</h1>
                <p>Servis Ücreti Adı</p>
                <input onChange={(e) => setServiceChargeName(e.target.value)} type="text" placeholder="SERVİS ÜCRETİ ADI GİRİNİZ" name="" id="ServiceChargeName" />
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}  >
                        <p>Servis Ücreti Türü</p>
                        <select onChange={(e) => setServiceChargeType(e.target.value)}
                            id="ServiceChargeType" required defaultValue="">
                            <option value="Percentage">YÜZDESEL</option>
                            <option value="Fixed">SABİT ÜCRET</option>
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Değer</p>
                        {serviceChargeType == "Fixed" ? <input onChange={(e) => setServiceChargeAmount(Number(parseFloat(e.target.value).toFixed(2))).toFixed(2)} placeholder="SERVİS ÜCRETİNİ GİRİNİZ" name="" id="ServiceChargeAmount"  type='number' /> :
                            <input onChange={(e) => setServiceChargeAmount(Number(parseFloat(e.target.value).toFixed(2)))} placeholder="SERVİS ÜCRETİ ORANI GİRİNİZ" min={0} max={100} name="" id="ServiceChargeAmount" type='number' />}
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => setNewServiceCharge(!newServiceCharge)} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={() => saveServiceCharge()} >Kaydet</button>
                </div>
            </div>
        }
    </div>
}
export default ServiceCharge