import staticStyles from '../main/StaticStyle.module.css'
import styles from './Dashboard.module.css'
import { useState, useEffect, use } from 'react'

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

function Dasboard() {

    const [date, setDate] = useState(null)

    const [checkCount, setCheckCount] = useState(0)
    const [closedTotal, setClosedTotal] = useState(0)
    const [openTotal, setOpenTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [discountTotal, setDiscountTotal] = useState(0)
    const [serviceChargeTotal, setServiceChargeTotal] = useState(0)
    const [guestCount, setGuestCount] = useState(0)
    const [paymentMethods, setPaymentMethods] = useState([])
    const [net, setNet] = useState(0)
    const [total, setTotal] = useState(0)
    const [cost, setCost] = useState(0)
    const [averagePerCheck, setAveragePerCheck] = useState(0)
    const [averagePerPerson, setAveragePerPerson] = useState(0)
    const [peakHour, setPeakHour] = useState('')

    const [weekdayNames, setWeekDayNames] = useState(["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"])
    const [chartData, setChartData] = useState([])
    const [criticStocks, setCriticStocks] = useState([])
    const [weeklyData, setWeeklyData] = useState([])
    const [checks, setChecks] = useState([])
    const getDailyFromDB = async (date) => {
        try {
            const response = await fetch("http://localhost:5000/income", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(date)
            })
            if (response.ok) {
                const data = await response.json()
                console.log("data is ", data)
                const pTypes = {
                    "Total": 0,
                    "Net": 0,
                    "CheckCount": 0,
                    "Average per Person": 0,
                    "Average per Check": 0,
                    "Payment Methods": paymentMethods,
                    "Peak Hours": [],
                }
                pTypes["Payment Methods"].forEach((type, index) => {
                    type["Total"] = 0
                })
                console.log("data", data)
                let tempClosedTotal = 0
                let paymentMethodDiscount = 0
                data.payments.forEach((p, index) => {
                    if (p.includedincome) {
                        tempClosedTotal += p.total_method_money
                    } else {
                        paymentMethodDiscount += p.total_method_money
                    }
                })
                console.log("tempclosedtotal", tempClosedTotal)
                let tempPaymentMethods = JSON.parse(localStorage.getItem("PaymentMethods"))
                tempPaymentMethods.forEach((item) => {
                    item.total_method_money = 0
                })

                const tempTotalPrice = (data.check_info[0].totalmoney)
                console.log(tempPaymentMethods)
                setCheckCount(data.check_info[0].totalcheckcount)
                setClosedTotal(tempClosedTotal.toFixed(2))
                setOpenTotal((data.check_info[0].totalmoney - tempClosedTotal) || 0)
                setTax(data.check_info[0].totaltaxes.toFixed(2))
                setDiscountTotal((data.check_info[0].totaldiscount + paymentMethodDiscount).toFixed(2))
                setServiceChargeTotal((data.check_info[0].totalservicecharge).toFixed(2))
                setGuestCount(data.check_info[0].guestcount || 0)
                setPaymentMethods(data.payments.length > 0 ? data.payments : tempPaymentMethods)
                setNet((tempTotalPrice - data.check_info[0].totaltaxes).toFixed(2))
                setTotal(tempTotalPrice.toFixed(2))
                setAveragePerCheck((tempTotalPrice / data.check_info[0].totalcheckcount).toFixed(2) || 0)
                setPeakHour(data.busiest_hours[0])
                setCost(data.check_info[0].totalcost.toFixed(2))
                if (data.check_info[0].guestcount == 0) {
                    setAveragePerPerson(tempTotalPrice)
                } else {
                    setAveragePerPerson(tempTotalPrice / data.check_info[0].guestcount)
                }
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    const getCriticalStocks = async () => {
        try {
            const response = await fetch("http://localhost:5000/criticStocks")
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setCriticStocks(data)
            }

        }
        catch (error) {
            console.log(error)

        }
    }


    const getChartData = async () => {
        try {
            const response = await fetch("http://localhost:5000/chartData")
            if (response.ok) {
                const data = await response.json()
                console.log("chartdata", data)
                const weekdayIncome = [0, 0, 0, 0, 0, 0, 0]
                data.forEach((item, index) => {
                    const date = new Date(item.order_date)
                    const day = date.getDay()
                    console.log("day is ", day)
                    console.log("daily_sales", item.daily_sales)
                    weekdayIncome[day] = item.daily_sales
                })

                console.log("33", weekdayIncome)
                setChartData(weekdayIncome)

            }

        }

        catch (error) {
            console.log(error)

        }
    }
    const getChecks = async () => {
        try {
            const response = await fetch("http://localhost:5000/getChecks")
            if (response.ok) {
                const data = await response.json()
                console.log("data are ", data)
                setChecks(data)

            }
        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        setDate(date)
        getDailyFromDB(date)
        getCriticalStocks()
        getChartData()
        getChecks()
    }, [])
    return <><div className={staticStyles["content-container"]}>
        <div className={staticStyles["info-container"]}>
            <div className={staticStyles["table-container"]}>
                <h1>Satış Raporları</h1>
            </div>
            <div className={styles["income-reports"]}>
                <div className={styles["income-report"]}>
                    <p className={styles["stats-headers"]}>Gelir</p>
                    <p className={styles["income-report-data"]}>{total}₺</p>

                </div>
                <div className={styles["income-report"]}>
                    <p className={styles["stats-headers"]}>Maliyet</p>
                    <p className={styles["income-report-data"]}>{cost}₺</p>

                </div>
                <div className={styles["income-report"]}>
                    <p className={styles["stats-headers"]}>Müşteri Sayısı</p>
                    <p className={styles["income-report-data"]}>{guestCount} Kişi</p>

                </div>
                <div className={styles["income-report"]}>
                    <p className={styles["stats-headers"]}>Çek Başına Ücret</p>
                    <p className={styles["income-report-data"]}>{averagePerCheck}₺</p>
                </div>
            </div>
            <div className={styles["sales-stats"]}>
                <div className={styles["sales-graph"]}>
                    <p className={styles["stats-headers"]}>Ciro Grafiği</p>
                    <div style={{ height: '350px', width: '100%' }}>
                        <Line
                            data={{
                                labels: weekdayNames,
                                datasets: [
                                    {
                                        label: 'Satış',
                                        data: chartData,
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    title: { display: true, text: 'Seçilen Tarihler Arası Satış Grafiği' }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={styles["critic-stocks"]}>
                    <div style={{ color: "#92400e" }} className={styles["stats-headers"]}>
                        <svg xmlns="http://www.w3.org/200 0/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                        </svg>
                        <div style={{ marginLeft: "1rem" }}>
                            <p style={{ color: "#92400e", fontWeight: "bold" }} >Stok Uyarıları</p>
                            <p>{criticStocks.length} Malzeme stoğunda azalma-bitme durumu mevcut.</p>
                        </div>
                    </div>
                    <div>
                        <p style={{ color: "#92400e", marginBottom: "1rem" }}> En Kritikler:</p>
                        {criticStocks.map((stock, index) => {
                            if (index >= 5) return null
                            return <div className={styles["stock-list"]} style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>{stock.name}</p>
                                <p>Miktar: {stock.stock_quantity}</p>
                            </div>
                        })}
                    </div>
                    <div>

                    </div>
                </div>
            </div>
                
            <h1>En Son Kapatılan Çekler</h1>
            <div className={styles["table-container"]}>
    
                <div style={{gridTemplateColumns:"1fr 0.6fr 1.2fr 1fr 1.5fr 0.8fr"}} className={staticStyles["table-header-style"]}>
                    <p>Sipariş No</p>
                    <p>Masa</p>
                    <p>Garson</p>
                    <p>Tutar</p>
                    <p>Ödeme Seçenekleri</p>
                    <p>Zaman</p>
                </div>
                <div className={styles["checks"]}>
                    {checks.map((check, index) => (
                        <div style={{gridTemplateColumns:"1fr 0.6fr 1.2fr 1fr 1.5fr 0.8fr"}} className={staticStyles["table-item-style"]}>
                            <p>{check.check_number}</p>
                            <p>{check.table_id}</p>
                            <p>GARSON ADI</p>
                            <p>{check.total_price}₺</p>
                            <p style={{ display: "flex", flexDirection: "column" }} > {check.payments.length > 1 ? (
                                <>
                                    <span>{check.payments[0].paymentName} {check.payments[0].payedPrice}₺</span>
                                    <span>+{(check.payments.length) - 1} Ödeme</span>
                                </>

                            ) : <> <span>{check.payments[0].paymentName} </span>
                                <span>{check.payments[0].payedPrice}₺</span>
                            </>}
                            </p>
                            <p>{check.closing_time.slice(0, 5)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    </>
}
export default Dasboard