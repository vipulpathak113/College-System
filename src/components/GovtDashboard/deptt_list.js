

const colSchema = [
    {
        displayName: "Total Transaction",
        name: "total_transactions",
        color: "#ee8033"
    },
    {
        displayName: "Amount transferred",
        name: "amount_transferred",
        color: "#37be90"
    },
    {
        displayName: "Beneficiaries",
        name: "beneficiaries",
        color: "#8c6239"
    },
];

const colMeta = {
    total: {
        displayName: "Total Transaction",
        color: "#ee8033",
        borderColor: "#fff"
    },
    amount: {
        displayName: "Amount transferred",
        color: "#37be90",
        borderColor: "#37be90"
    },
    beneficiary: {
        displayName: "Beneficiaries",
        color: "#8c6239",
        borderColor: "#8c6239"
    }
}

export { colSchema, colMeta }