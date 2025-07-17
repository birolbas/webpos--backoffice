import { useEffect, useState } from "react"
import staticStyles from '../main/StaticStyle.module.css'
import styles from './Taxes.module.css'
function Taxes() {
    const [taxes, setTaxes] = useState([])
    function createTax(){
        document.getElementsByClassName(styles["tax-input"])[0].style.display = "flex"
    }
    function closeCreateTax(){
        document.getElementsByClassName(styles["tax-input"])[0].style.display = "none"
    }

    function saveTax(){
        const taxId = document.getElementById("TaxId").value
        const taxPercent = document.getElementById("TaxPercent").value
        const object = {
            taxId : taxId, 
            taxPercent: taxPercent
        }
        setTaxes([...taxes, object])
    }

    useEffect(()=>{
        console.log(taxes)
    },[taxes])
    return <>
    <div className={staticStyles["content-container"]}>
        <div className={staticStyles["append-tax"]}>
            <div className={staticStyles["save-div"]}>
                <p>Vergi Seçenekleri</p>
            </div>
            <div className={styles["taxes"]}>
            {taxes.map((tax, _)=>(
                <div >
                    <button className={styles["tax-cards"]}> {tax.taxId} {tax.taxPercent}% </button>
                </div>
            ))}
            <button onClick={()=>createTax()} className={styles["append-button"]}>+</button>
            </div>
        </div>
        <div className={styles["tax-input"]}>
            <h1>Vergi İsmini Giriniz</h1>
            <input type="text" placeholder="VERGİ İSMİ" name="" id="TaxId" />
            <h1>Vergi Oranını Giriniz</h1>
            <input type="text" placeholder="1-100 ARASINDA TAM SAYI GİRİNİZ" name="" id="TaxPercent" />
            <div className={styles["action-buttons"]}>
                <button onClick={()=>saveTax()}>Kaydet</button>
                <button onClick={()=>closeCreateTax()} style={{backgroundColor:"red"}} >İptal</button>
            </div>
        </div>
    </div>
    </>
}
export default Taxes