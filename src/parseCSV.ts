export const parseCSV = (csvString: string): Record<string, string>[] => {
    const rows = csvString.trim().split('\n')
    const headers = rows[0].split(',')
    const objects = rows.slice(1).map((row) => {
        const values: string[] = []
        let insideQuotes = false
        let value = ''

        for (const char of row) {
            if (char === '"') {
                insideQuotes = !insideQuotes
            } else if (char === ',' && !insideQuotes) {
                values.push(value.trim())
                value = ''
            } else {
                value += char
            }
        }
        values.push(value.trim())

        const obj: { [key: string]: string } = {}
        headers.forEach((header, index) => {
            obj[header.trim()] =
                values[index].startsWith('"') && values[index].endsWith('"')
                    ? values[index].slice(1, -1)
                    : values[index]
        })

        return obj
    })

    return objects
}
