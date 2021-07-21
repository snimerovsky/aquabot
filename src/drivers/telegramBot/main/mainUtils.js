export const getOrderFormat = (orders) => {
    try {
        let products = []
        orders.forEach(v => {
            products.push(...v['Items'])
        })

        let all_price = 0
        return `
${products.map(v => {
            all_price += parseFloat(v['TotalSum'])
            return `${v['ProductName']}
${v['Amount']} x ${v['Price']} = ${v['TotalSum']} сум
`
        }).join('\n')}
            
Итого: ${all_price} сум`
    } catch (e) {
        console.log('error getProductsInto', e.message)
    }
}