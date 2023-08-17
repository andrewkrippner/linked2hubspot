type CSVValue = number | string | undefined

const csvValueToString = (value: CSVValue) => {
    if (value === undefined) {
        return ''
    } else if (typeof value === 'number') {
        return value.toString()
    }
    if (value.includes(',')) return `"${value}"`
    return `${value}`
}

const createCSVLine = (...values: CSVValue[]) =>
    values.map(csvValueToString).join(',')

const joinCSVLines = (...lines: string[]) => lines.join('\n')

export const createCSV = <K extends string>(
    keys: K[],
    data: Record<K, CSVValue>[],
) => {
    const header = createCSVLine(...keys)
    const lines = data.map((dataPoint) =>
        createCSVLine(...keys.map((key) => dataPoint[key])),
    )
    const csv = joinCSVLines(header, ...lines)
    return csv
}
