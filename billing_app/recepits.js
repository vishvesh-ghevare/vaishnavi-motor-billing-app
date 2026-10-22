// ==========================================
// RECEIPT APP JAVASCRIPT
// ==========================================

// IMPORTANT:
// Copy your existing SUPABASE_URL and
// SUPABASE_KEY from your working app.js here.

// DO NOT change the values.

const SUPABASE_URL = "https://supabase.com/dashboard/project/icbajvpsbiqqbpotwcsd/settings/api-keys";

const SUPABASE_KEY = "sb_publishable_pJTpG_z7fhZl096K19mznw_K7IJC2uCs";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log("Receipt Supabase loaded successfully");


// ==========================================
// ADD ITEM
// ==========================================

function addItem() {

    const container =
        document.getElementById("itemsContainer");

    const row =
        document.createElement("div");

    row.className = "item-row";

    row.style =
        "display:grid;grid-template-columns:1fr 220px 110px;gap:12px;margin-bottom:15px;";

    row.innerHTML = `

        <input
            type="text"
            class="item-name"
            placeholder="Work / Product name"
            oninput="calculateTotal()"
            style="
            padding:14px;
            border:1px solid #ccc;
            border-radius:8px;
            font-size:16px;
            "
        >

        <input
            type="number"
            class="item-amount"
            placeholder="Amount"
            min="0"
            step="0.01"
            oninput="calculateTotal()"
            style="
            padding:14px;
            border:1px solid #ccc;
            border-radius:8px;
            font-size:16px;
            "
        >

        <button
            type="button"
            onclick="removeItem(this)"
            style="
            background:#dc2626;
            color:white;
            border:none;
            border-radius:8px;
            cursor:pointer;
            "
        >
            Remove
        </button>

    `;

    container.appendChild(row);

    calculateTotal();
}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(button) {

    const rows =
        document.querySelectorAll(".item-row");

    if (rows.length <= 1) {

        alert("At least one item is required.");

        return;
    }

    button.parentElement.remove();

    calculateTotal();
}


// ==========================================
// TOTAL
// ==========================================

function calculateTotal() {

    const amounts =
        document.querySelectorAll(".item-amount");

    let total = 0;

    amounts.forEach(function(input) {

        total += Number(input.value) || 0;

    });

    document.getElementById("liveTotal")
        .textContent =
        "₹" + total.toFixed(2);

    return total;
}


// ==========================================
// SAVE RECEIPT
// ==========================================

async function saveReceiptNew() {

    try {

        console.log("SAVE STARTED");


        // CUSTOMER

        const customerName =
            document.getElementById(
                "customerName"
            ).value.trim();


        if (!customerName) {

            alert(
                "Please enter customer name."
            );

            return;
        }


        // ITEMS

        const rows =
            document.querySelectorAll(
                ".item-row"
            );

        const items = [];


        rows.forEach(function(row) {

            const name =
                row.querySelector(
                    ".item-name"
                ).value.trim();

            const amount =
                Number(
                    row.querySelector(
                        ".item-amount"
                    ).value
                );


            if (name && amount > 0) {

                items.push({

                    product_name: name,

                    quantity: 1,

                    price: amount,

                    amount: amount

                });

            }

        });


        if (items.length === 0) {

            alert(
                "Please enter work and amount."
            );

            return;
        }


        // TOTAL

        const total =
            items.reduce(
                function(sum, item) {

                    return sum + item.amount;

                },
                0
            );


        console.log(
            "Customer:",
            customerName
        );

        console.log(
            "Total:",
            total
        );


        // ==================================
        // FIND CUSTOMER
        // ==================================

        const {
            data: customers,
            error: customerSearchError
        } =
        await supabaseClient
            .from("customers")
            .select("id,name")
            .eq("name", customerName)
            .limit(1);


        if (customerSearchError) {

            console.error(
                customerSearchError
            );

            alert(
                "Customer check error:\n\n" +
                customerSearchError.message
            );

            return;
        }


        let customerId;


        // EXISTING CUSTOMER

        if (
            customers &&
            customers.length > 0
        ) {

            customerId =
                customers[0].id;

        }


        // NEW CUSTOMER
        else {

            const {
                data: newCustomer,
                error: customerInsertError
            } =
            await supabaseClient
                .from("customers")
                .insert([{
                    name: customerName
                }])
                .select()
                .single();


            if (customerInsertError) {

                console.error(
                    customerInsertError
                );

                alert(
                    "Customer save error:\n\n" +
                    customerInsertError.message
                );

                return;
            }


            customerId =
                newCustomer.id;

        }


        // ==================================
        // RECEIPT NUMBER
        // ==================================

        const receiptNumber =
            "REC-" + Date.now();


        // ==================================
        // SAVE BILL
        // ==================================

        const {
            data: bill,
            error: billError
        } =
        await supabaseClient
            .from("bills")
            .insert([{

                bill_number: receiptNumber,

                customer_id: customerId,

                subtotal: total,

                discount: 0,

                tax: 0,

                total: total,

                payment_method: "Cash",

                bill_date: new Date().toISOString()

            }])
            .select()
            .single();


        if (billError) {

            console.error(
                billError
            );

            alert(
                "Receipt save error:\n\n" +
                billError.message
            );

            return;
        }


        // ==================================
        // SAVE ITEMS
        // ==================================

        const billItems =
            items.map(function(item) {

                return {

                    bill_id: bill.id,

                    product_id: null,

                    product_name: item.product_name,

                    quantity: 1,

                    price: item.price,

                    amount: item.amount

                };

            });


        const {
            error: itemError
        } =
        await supabaseClient
            .from("bill_items")
            .insert(
                billItems
            );


        if (itemError) {

            console.error(
                itemError
            );

            alert(
                "Receipt saved, but work details failed:\n\n" +
                itemError.message
            );

            return;
        }


        // ==================================
        // SHOW RECEIPT
        // ==================================

        document.getElementById(
                "receiptNumberPreview"
            ).textContent =
            receiptNumber;


        document.getElementById(
                "receiptDatePreview"
            ).textContent =
            new Date().toLocaleDateString(
                "en-IN"
            );


        document.getElementById(
                "receiptCustomerPreview"
            ).textContent =
            customerName;


        const preview =
            document.getElementById(
                "receiptItemsPreview"
            );


        preview.innerHTML = "";


        items.forEach(function(item) {

            const row =
                document.createElement(
                    "div"
                );

            row.style =
                "display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:8px;";


            const name =
                document.createElement(
                    "span"
                );

            name.textContent =
                item.product_name;


            const amount =
                document.createElement(
                    "span"
                );

            amount.textContent =
                "₹" +
                item.amount.toFixed(2);


            row.appendChild(name);

            row.appendChild(amount);

            preview.appendChild(row);

        });


        document.getElementById(
                "receiptTotalPreview"
            ).textContent =
            total.toFixed(2);


        document.getElementById(
                "receiptPreview"
            ).style.display =
            "block";


        alert(
            "✅ Receipt saved successfully!\n\n" +
            "Receipt No: " +
            receiptNumber
        );

    } catch (error) {

        console.error(
            "Receipt Error:",
            error
        );

        alert(
            "Something went wrong:\n\n" +
            error.message
        );

    }

}


// ==========================================
// PRINT
// ==========================================

function printReceiptNew() {

    const receipt =
        document.getElementById(
            "receiptImageArea"
        );


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    printWindow.document.write(`
        <html>
        <head>
            <title>Receipt</title>

            <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }
            </style>

        </head>

        <body>

            ${receipt.outerHTML}

        </body>

        </html>
    `);


    printWindow.document.close();

    printWindow.focus();

    setTimeout(
        function() {
            printWindow.print();
        },
        500
    );

}


// ==========================================
// SHARE RECEIPT IMAGE
// ==========================================

async function shareReceiptImage() {

    try {

        const receipt =
            document.getElementById(
                "receiptImageArea"
            );


        const canvas =
            await html2canvas(
                receipt, {
                    scale: 3,
                    backgroundColor: "#ffffff"
                }
            );


        const blob =
            await new Promise(
                function(resolve) {

                    canvas.toBlob(
                        resolve,
                        "image/png"
                    );

                }
            );


        const file =
            new File(
                [blob],
                "receipt.png", {
                    type: "image/png"
                }
            );


        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [file]
            })
        ) {

            await navigator.share({

                title: "Receipt",

                text: "Receipt from VAISHNAVI MOTOR REWINDING AND ENGINEERING WORKS",

                files: [file]

            });

            return;
        }


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "receipt.png";


        link.click();


        URL.revokeObjectURL(url);


        alert(
            "Receipt image downloaded.\n\n" +
            "Attach receipt.png in WhatsApp."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Image sharing failed:\n\n" +
            error.message
        );

    }

}


calculateTotal();
const SUPABASE_URL = "YOUR_EXISTING_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_EXISTING_SUPABASE_PUBLISHABLE_KEY";


// Check Supabase library
if (!window.supabase) {

    alert("❌ Supabase library is NOT loaded.");

} else {

    console.log("✅ Supabase library loaded.");

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    // Test database connection
    async function testSupabase() {

        try {

            const { data, error } =
            await supabaseClient
                .from("customers")
                .select("id")
                .limit(1);


            if (error) {

                console.error(
                    "Supabase error:",
                    error
                );

                alert(
                    "❌ Supabase connection failed!\n\n" +
                    error.message
                );

                return;
            }


            console.log(
                "Supabase test result:",
                data
            );

            alert(
                "✅ Supabase connection is working!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "❌ Connection error:\n\n" +
                error.message
            );

        }

    }


    testSupabase();

}