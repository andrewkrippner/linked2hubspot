export const transformDate = (dateString: string): string => {
    const months: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }

    const [day, month, year] = dateString.split(' ')
    const formattedDay = day.length === 1 ? '0' + day : day
    const formattedMonth = months[month]

    return `${year}-${formattedMonth}-${formattedDay}`
}
