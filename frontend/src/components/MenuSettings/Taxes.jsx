import { useEffect, useState } from "react"
import staticStyles from '../main/StaticStyle.module.css'
import styles from './Taxes.module.css'
function Taxes() {
    const [taxes, setTaxes] = useState([])
    const [taxInputId, setTaxInputId] = useState("")
    const [taxInputPercent, setTaxInputPercent] = useState()
    const [taxInput, setTaxInput] = useState(false)

    const getTaxesFromDB = async () =>{
        const response = await fetch("http://localhost:5000/getTaxes")
        const data = await response.json()
        setTaxes(data)
    }

    useEffect(()=>{
        getTaxesFromDB()
    },[])
    const saveTaxesToDB = async () => {
        const obj = {
            taxid: taxInputId,
            taxpercent: taxInputPercent
        }
        const response = await fetch("http://localhost:5000/saveTaxes", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if(response.ok){
            setTaxInputPercent("")
            setTaxInputId("")
        }
    }

    function saveTax() {
        if (taxInputId == "") {
            document.getElementById("TaxId").placeholder = "Vergi ismi boş bırakılmamalıdır!"
        }
        if (taxInputPercent == "") {
            document.getElementById("TaxPercent").placeholder = "Vergi oranı boş bırakılmamalıdır!"
        }
        const existingIndex = taxes.findIndex(t => t.taxId === taxInputId)
        if (taxInputId != "" && taxInputPercent != "" && existingIndex == -1) {
            const object = {
                taxid: taxInputId,
                taxpercent: Number(parseFloat(taxInputPercent).toFixed(2))
            }
            setTaxes([...taxes, object])

            document.getElementById("TaxId").placeholder = "VERGİ İSMİ"
            document.getElementById("TaxPercent").placeholder = "1-100 ARASINDA TAM SAYI GİRİNİZ"
            saveTaxesToDB()
        } else if (existingIndex != -1) {
            setTaxInputId("")
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
                </div>
                <div className={styles["taxes"]}>
                    {taxes.map((tax, index) => (
                        <div key={index} className={styles["tax-cards"]}>
                            <div className={styles["tax-card-info"]}>
                                <button className={styles["tax-card"]}>
                                    <div id={styles["tax-id"]}>{tax.taxid}</div> 
                                    <div id= {styles["tax-percent"]}>{tax.taxpercent}%</div>
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setTaxInput(true)} className={styles["append-button"]}>+</button>
                </div>
            </div>
            {taxInput && (
            <div className={styles["tax-input"]}>
                <h1>Yeni Vergi Ekle</h1>
                <p>Vergi Adı</p>
                <input onChange={(e)=>setTaxInputId(e.target.value)} type="text" placeholder="VERGİ İSMİ" name="" id="TaxId" />
                <p>Vergi Oranı (%)</p>
                <input onChange={(e)=>setTaxInputPercent(e.target.value)} type="number" placeholder="1-100 ARASINDA TAM SAYI GİRİNİZ" name="" id="TaxPercent" />
                
                <div className={styles["action-buttons"]}>
                    <button onClick={() => setTaxInput(false)} style={{ backgroundColor: "#374151" }} >İptal</button>
                    <button onClick={() => saveTax()}>Kaydet</button>
                </div>
            </div>
            )}
        </div>
    </>
}
export default Taxes