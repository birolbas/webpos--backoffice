import { useEffect, useState } from "react"
import staticStyles from '../main/StaticStyle.module.css'
import styles from './Taxes.module.css'
function Taxes() {
    const [taxes, setTaxes] = useState([])
    function createTax() {
        document.getElementsByClassName(styles["tax-input"])[0].style.display = "flex"
    }
    function closeCreateTax() {
        document.getElementsByClassName(styles["tax-input"])[0].style.display = "none"
    }
    function deleteTax(index) {
        const taxesCopy = [...taxes]
        taxesCopy.splice(index, 1)
        setTaxes(taxesCopy)

    }
    const getTaxesFromDB = async () =>{
        const response = await fetch("http://localhost:5000/getTaxes")
        const data = await response.json()
        console.log("data", data[0][2])
        setTaxes(data[0][2])
    }
    useEffect(()=>{
        getTaxesFromDB()
    },[])
    const saveTaxesToDB = async () => {
        const response = await fetch("http://localhost:5000/saveTaxes", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taxes)
        })
    }

    function saveTax() {
        const taxId = document.getElementById("TaxId").value
        const taxPercent = document.getElementById("TaxPercent").value
        if (taxId == "") {
            document.getElementById("TaxId").placeholder = "Vergi ismi boş bırakılmamalıdır!"
        }
        if (taxPercent == "") {
            document.getElementById("TaxPercent").placeholder = "Vergi oranı boş bırakılmamalıdır!"
        }
        const existingIndex = taxes.findIndex(t => t.taxId === taxId)
        if (taxId != "" && taxPercent != "" && existingIndex == -1) {
            const object = {
                taxId: taxId,
                taxPercent: taxPercent
            }
            setTaxes([...taxes, object])
            document.getElementById("TaxId").value = ""
            document.getElementById("TaxPercent").value = ""
            document.getElementById("TaxId").placeholder = "VERGİ İSMİ"
            document.getElementById("TaxPercent").placeholder = "1-100 ARASINDA TAM SAYI GİRİNİZ"
        } else if (existingIndex != -1) {
            document.getElementById("TaxId").value = ""
            document.getElementById("TaxId").placeholder = "BU İSİMDE BİR VERGİ SEÇENEĞİ MEVCUT"
        }

    }

    useEffect(() => {
        console.log(taxes)
    }, [taxes])
    return <>
        <div className={staticStyles["content-container"]}>
            <div className={staticStyles["info-container"]}>
                <div className={staticStyles["save-div"]}>
                    <h2>Vergi Seçenekleri</h2>
                    <div className={styles["info-box"]}>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>Yeni vergi eklemek için yeşil butona basarak vergi adını ve vergi oranını giriniz. Silmek için ise varolan vergi oranının üstüne tıklayınız</p>
                    </div>
                    <div className={styles["save-button"]}>
                        <button onClick={()=>saveTaxesToDB()}>DEĞİŞİKLİKLERİ KAYDET</button>
                    </div>

                </div>
                <div className={styles["taxes"]}>
                    {taxes.map((tax, index) => (
                        <div key={index} className={styles["tax-cards"]}>
                            <div className={styles["tax-card-info"]}>
                                <button className={styles["tax-card"]}>
                                    <div id="tax-id">{tax.taxId}</div> 
                                    <div id="tax-percent">{tax.taxPercent}%</div>
                                </button>
                            </div>
                            <div onClick={() => deleteTax(index)} className={styles["tax-card-delete"]}>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={styles["delete-tax"]} viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => createTax()} className={styles["append-button"]}>+</button>
                </div>
            </div>
            <div className={styles["tax-input"]}>
                <h1>Yeni Vergi Ekle</h1>
                <p>Vergi Adı</p>
                <input type="text" placeholder="VERGİ İSMİ" name="" id="TaxId" />
                <p>Vergi Oranı (%)</p>
                <input type="number" placeholder="1-100 ARASINDA TAM SAYI GİRİNİZ" name="" id="TaxPercent" />
                
                <div className={styles["action-buttons"]}>
                    <button onClick={() => closeCreateTax()} style={{ backgroundColor: "#374151" }} >İptal</button>
                    <button onClick={() => saveTax()}>Kaydet</button>
                </div>
            </div>
        </div>
    </>
}
export default Taxes